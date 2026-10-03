import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = join(__dirname, "..", "public");

await sharp(join(PUB, "silbo_logo.png"))
	.resize(284, 80, { fit: "inside", withoutEnlargement: true })
	.webp({ quality: 90 })
	.toFile(join(PUB, "silbo_logo.webp"));
console.log("✓  silbo_logo.webp");

await sharp(join(PUB, "make_in_india.png"))
	.resize(80, 80, { fit: "inside", withoutEnlargement: true })
	.webp({ quality: 90 })
	.toFile(join(PUB, "make_in_india.webp"));
console.log("✓  make_in_india.webp");
