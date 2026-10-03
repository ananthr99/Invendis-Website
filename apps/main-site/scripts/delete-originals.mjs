import { readdir, unlink, stat } from "fs/promises";
import { join, extname, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(dirname(__dirname), "public", "images");
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const e of entries) {
		const full = join(dir, e.name);
		if (e.isDirectory()) files.push(...await walk(full));
		else if (IMAGE_EXTS.has(extname(e.name).toLowerCase())) files.push(full);
	}
	return files;
}

const files = await walk(IMAGES_DIR);
let deleted = 0, freedBytes = 0;

for (const file of files) {
	const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
	try {
		await stat(webp); // only delete if WebP exists
		const size = (await stat(file)).size;
		await unlink(file);
		freedBytes += size;
		deleted++;
		console.log(`Deleted: ${relative(IMAGES_DIR, file)}`);
	} catch {
		console.log(`Skipped (no WebP): ${relative(IMAGES_DIR, file)}`);
	}
}

console.log(`\nDeleted ${deleted} files, freed ${(freedBytes / 1024 / 1024).toFixed(1)} MB`);
