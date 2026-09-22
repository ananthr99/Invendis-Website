import { useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import { github, OWNER, REPO } from "../config.js";

export default function Setup() {
	const { token, saveToken, toast } = useAdmin();
	const [draft, setDraft] = useState(token);
	const [testing, setTesting] = useState(false);

	async function handleTest() {
		setTesting(true);
		try {
			const fullName = await github.testConnection(draft);
			toast(`Connected to ${fullName}`, "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setTesting(false);
		}
	}

	function handleSave() {
		saveToken(draft);
		toast("Token saved", "ok");
	}

	return (
		<div className="admin-card" style={{ maxWidth: 520 }}>
			<h2 style={{ marginTop: 0 }}>GitHub connection</h2>
			<p style={{ color: "var(--admin-muted)", fontSize: 13.5 }}>
				Every save writes directly to{" "}
				<code>
					{OWNER}/{REPO}
				</code>{" "}
				on GitHub. Create a fine-grained{" "}
				<a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer">
					Personal Access Token
				</a>{" "}
				scoped to just this repo, with <strong>Contents: Read and write</strong> permission, and paste it below. It's
				stored only in this browser (localStorage) — never sent anywhere except api.github.com.
			</p>

			<div className="admin-field">
				<label className="admin-label" htmlFor="pat">
					Personal Access Token
				</label>
				<input
					id="pat"
					type="password"
					className="admin-input"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="github_pat_..."
				/>
			</div>

			<div style={{ display: "flex", gap: 8 }}>
				<button className="admin-btn admin-btn--ghost" onClick={handleTest} disabled={!draft || testing}>
					{testing ? "Testing…" : "Test connection"}
				</button>
				<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={!draft}>
					Save token
				</button>
			</div>
		</div>
	);
}
