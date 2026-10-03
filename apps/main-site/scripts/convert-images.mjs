import sharp from "sharp";
import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join, extname, relative, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT        = join(__dirname, "..");
const IMAGES_DIR  = join(ROOT, "public", "images");
const CONTENT_DIR = join(ROOT, "public", "content");
const IMAGE_EXTS  = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir, exts) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const e of entries) {
		const full = join(dir, e.name);
		if (e.isDirectory()) files.push(...await walk(full, exts));
		else if (exts.has(extname(e.name).toLowerCase())) files.push(full);
	}
	return files;
}

// Detect which images need converting based on context:
//   CI deploy  → files changed in the last commit
//   git hook   → files currently staged
//   standalone → any image that has no .webp counterpart yet
function resolveTargets(allImages) {
	try {
		const out = execSync("git diff --name-only HEAD^ HEAD 2>/dev/null", { encoding: "utf8" });
		const files = out.split("\n").map(f => f.trim())
			.filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
			.map(f => join(ROOT, "..", "..", f))   // workspace root
			.filter(f => f.startsWith(IMAGES_DIR) && existsSync(f));
		if (files.length) { console.log("Mode: CI (last commit)\n"); return files; }
	} catch {}

	try {
		const out = execSync("git diff --cached --name-only 2>/dev/null", { encoding: "utf8" });
		const files = out.split("\n").map(f => f.trim())
			.filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
			.map(f => join(ROOT, "..", "..", f))
			.filter(f => f.startsWith(IMAGES_DIR) && existsSync(f));
		if (files.length) { console.log("Mode: git hook (staged files)\n"); return files; }
	} catch {}

	console.log("Mode: standalone (all images without WebP)\n");
	return allImages.filter(f => !existsSync(f.replace(/\.(png|jpe?g)$/i, ".webp")));
}

// ── Convert ──────────────────────────────────────────────────────
const allImages = await walk(IMAGES_DIR, IMAGE_EXTS);
const targets   = resolveTargets(allImages);

if (!targets.length) {
	console.log("No images to convert.");
	process.exit(0);
}

console.log(`Converting ${targets.length} image(s)...\n`);
let converted = 0, errors = 0, savedBytes = 0;

for (const file of targets) {
	const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");
	const origSize = (await stat(file)).size;
	try {
		await sharp(file).webp({ quality: 82 }).toFile(webpPath);
		const newSize = (await stat(webpPath)).size;
		savedBytes += origSize - newSize;
		converted++;
		const pct = Math.round((1 - newSize / origSize) * 100);
		console.log(`✓  ${relative(IMAGES_DIR, file)}  (${Math.round(origSize/1024)}KB → ${Math.round(newSize/1024)}KB, -${pct}%)`);
	} catch (err) {
		console.error(`✗  ${file}: ${err.message}`);
		errors++;
	}
}

console.log(`\nConverted: ${converted}  Errors: ${errors}  Saved: ${(savedBytes/1024/1024).toFixed(1)} MB\n`);

// ── Update JSON refs ──────────────────────────────────────────────
const jsonFiles = await walk(CONTENT_DIR, new Set([".json"]));
let updatedJson = 0;

for (const file of jsonFiles) {
	const before = await readFile(file, "utf8");
	const after  = before.replace(/\.(png|jpe?g)(?=")/gi, ".webp");
	if (after !== before) {
		await writeFile(file, after, "utf8");
		updatedJson++;
		console.log(`Updated refs: ${relative(CONTENT_DIR, file)}`);
	}
}

if (updatedJson) console.log(`\nUpdated ${updatedJson} JSON file(s).`);
