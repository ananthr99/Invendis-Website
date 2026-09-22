// @invendis/github-client
//
// Single shared wrapper around the GitHub Contents API. Both apps import
// this instead of hand-rolling their own fetch/encode/decode logic:
//
//   - apps/main-site  uses only the read functions, unauthenticated,
//     always against the "main" branch (the repo is public).
//   - apps/cms-admin  uses the read AND write/delete functions, always
//     with an explicit token, against whichever branch it's told to
//     (it writes to "main" AND "gh-pages" on every save — see README).
//
// Nothing here is React-specific or app-specific on purpose: it's plain
// fetch calls against api.github.com, so it's easy to unit-test and easy
// to reason about independent of either UI.

/**
 * @param {{ owner: string, repo: string, defaultBranch?: string }} config
 */
export function createGithubClient({ owner, repo, defaultBranch = "main" }) {
	const API_BASE = `https://api.github.com/repos/${owner}/${repo}`;

	function authHeaders(token) {
		return {
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		};
	}

	async function request(path, { method = "GET", token, body } = {}) {
		const res = await fetch(`${API_BASE}${path}`, {
			method,
			headers: {
				...authHeaders(token),
				...(body ? { "Content-Type": "application/json" } : {}),
			},
			...(body ? { body: JSON.stringify(body) } : {}),
		});

		if (!res.ok) {
			const errBody = await res.json().catch(() => ({}));
			const err = new Error(errBody.message || `GitHub API error (${res.status})`);
			err.status = res.status;
			throw err;
		}
		if (res.status === 204) return null;
		return res.json();
	}

	// ---- encode/decode helpers (UTF-8 safe) ----

	function encodeBase64(text) {
		const bytes = new TextEncoder().encode(text);
		let binary = "";
		bytes.forEach((b) => {
			binary += String.fromCharCode(b);
		});
		return btoa(binary);
	}

	function decodeBase64(base64) {
		const binary = atob(base64.replace(/\n/g, ""));
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	}

	// ---- reads (no token required — repo is public) ----

	/** Verify a token is valid and can see this repo. Returns the repo's full_name. */
	async function testConnection(token) {
		const data = await request("", { token });
		return data.full_name;
	}

	/** Read a text file's decoded content + its sha (sha is required to update/delete it). */
	async function readFile(path, { branch = defaultBranch, token } = {}) {
		const data = await request(`/contents/${path}?ref=${branch}`, { token });
		return { content: decodeBase64(data.content), sha: data.sha };
	}

	/** Read a binary file's raw base64 content (images, PDFs) + its sha. */
	async function readFileBase64(path, { branch = defaultBranch, token } = {}) {
		const data = await request(`/contents/${path}?ref=${branch}`, { token });
		return { base64: data.content.replace(/\n/g, ""), sha: data.sha };
	}

	/** Cheap existence/sha check without pulling the file body. Returns null if not found. */
	async function getFileSha(path, { branch = defaultBranch, token } = {}) {
		try {
			const data = await request(`/contents/${path}?ref=${branch}`, { token });
			return data.sha ?? null;
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}

	/** List files in a directory (non-recursive). */
	async function listDir(path, { branch = defaultBranch, token } = {}) {
		const data = await request(`/contents/${path}?ref=${branch}`, { token });
		return Array.isArray(data) ? data : [data];
	}

	// ---- writes (token required) ----

	/** Create or update a text file. Omit `sha` to create a new file. */
	async function writeFile(path, textContent, { message, sha, branch = defaultBranch, token }) {
		if (!token) throw new Error("writeFile requires a token");
		return request(`/contents/${path}`, {
			method: "PUT",
			token,
			body: {
				message,
				content: encodeBase64(textContent),
				branch,
				...(sha ? { sha } : {}),
			},
		});
	}

	/** Create or update a binary file from a bare base64 string (no "data:" prefix). */
	async function writeFileBase64(path, base64Content, { message, sha, branch = defaultBranch, token }) {
		if (!token) throw new Error("writeFileBase64 requires a token");
		return request(`/contents/${path}`, {
			method: "PUT",
			token,
			body: {
				message,
				content: base64Content,
				branch,
				...(sha ? { sha } : {}),
			},
		});
	}

	async function deleteFile(path, sha, { message, branch = defaultBranch, token }) {
		if (!token) throw new Error("deleteFile requires a token");
		return request(`/contents/${path}`, {
			method: "DELETE",
			token,
			body: { message, sha, branch },
		});
	}

	/** Fire-and-forget repository_dispatch event (e.g. to trigger a CDN cache purge). */
	function dispatchEvent(eventType, token) {
		fetch(`${API_BASE}/dispatches`, {
			method: "POST",
			headers: { ...authHeaders(token), "Content-Type": "application/json" },
			body: JSON.stringify({ event_type: eventType }),
		}).catch(() => {});
	}

	return {
		testConnection,
		readFile,
		readFileBase64,
		getFileSha,
		listDir,
		writeFile,
		writeFileBase64,
		deleteFile,
		dispatchEvent,
	};
}

/** Read a browser File/Blob as a bare base64 string (no "data:" prefix). */
export function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result.split(",")[1]);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
