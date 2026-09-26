import { github, LIVE_BRANCH } from "../config.js";
import { appendChangelogEntry } from "./logChange.js";

// A "content path" is always relative to the content root, e.g.
// "pages/home.json" or "siteSettings.json" — never a full repo path.
// That one relative path maps to two different real paths, because the
// two branches hold different things:
//
//   main branch     = source tree   → apps/main-site/public/content/<path>
//   gh-pages branch = built dist/   → content/<path>
//                      (Vite copies apps/main-site/public/* to the dist
//                      root at build time, so "public/" drops out of
//                      the path on the built/live side)
//
// Editors never need to know this — they just pass "pages/home.json".
function sourcePath(contentPath) {
	return `apps/main-site/public/content/${contentPath}`;
}
function livePath(contentPath) {
	return `content/${contentPath}`;
}

/**
 * The one function every page editor calls to save. Writes to both
 * branches and logs the diff to the activity log.
 *
 *   await savePageContent({
 *     token, contentPath: "pages/home.json",
 *     before: originalData, after: formData,
 *     page: "Home", userEmail,
 *   })
 */
export async function savePageContent({ token, contentPath, before, after, page, section, userEmail }) {
	const message = `CMS: update ${page}${section ? ` / ${section}` : ""}`;
	const json = JSON.stringify(after, null, 2);

	const mainSha = await github.getFileSha(sourcePath(contentPath), { branch: "main", token });
	await github.writeFile(sourcePath(contentPath), json, {
		message: `${message} [skip ci]`,
		sha: mainSha,
		branch: "main",
		token,
	});

	const liveSha = await github.getFileSha(livePath(contentPath), { branch: LIVE_BRANCH, token });
	await github.writeFile(livePath(contentPath), json, {
		message,
		sha: liveSha,
		branch: LIVE_BRANCH,
		token,
	});

	await appendChangelogEntry(github, token, { page, section, before, after, userEmail });
}

/** Reads from the main branch (source of truth) using the same relative content path. */
export async function loadPageContent(contentPath, token) {
	const { content } = await github.readFile(sourcePath(contentPath), { branch: "main", token });
	return JSON.parse(content);
}

/**
 * Uploads an image to both branches so it's immediately visible on the live site.
 * imagePath is relative to the public root, e.g. "images/gallery/hero/bg.jpg"
 *
 *   await uploadImage("images/gallery/hero/bg.jpg", base64, { token, message: "..." })
 */
export async function uploadImage(imagePath, base64, { token, message }) {
	const mainFullPath = `apps/main-site/public/${imagePath}`;
	const liveFullPath = imagePath;

	const mainSha = await github.getFileSha(mainFullPath, { branch: "main", token });
	await github.writeFileBase64(mainFullPath, base64, {
		message: `${message} [skip ci]`,
		sha: mainSha,
		branch: "main",
		token,
	});

	const liveSha = await github.getFileSha(liveFullPath, { branch: LIVE_BRANCH, token });
	await github.writeFileBase64(liveFullPath, base64, {
		message,
		sha: liveSha,
		branch: LIVE_BRANCH,
		token,
	});
}
