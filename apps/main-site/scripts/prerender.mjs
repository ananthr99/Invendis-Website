import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const BASE = (process.env.VITE_BASE || "/").replace(/\/$/, "");
const PORT = 4173;

const ROUTES = [
	"/",
	"/sectors",
	"/products",
	"/products/product-selector",
	"/case-studies",
	"/company",
	"/contact",
	"/resources",
	"/careers",
	"/silbo",
	"/gallery",
	"/privacy",
	"/terms",
];

const MIME = {
	".html": "text/html; charset=utf-8",
	".js":   "text/javascript",
	".css":  "text/css",
	".json": "application/json",
	".png":  "image/png",
	".jpg":  "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".svg":  "image/svg+xml",
	".woff2":"font/woff2",
	".woff": "font/woff",
	".ico":  "image/x-icon",
};

function startServer() {
	return new Promise((resolve) => {
		const server = createServer((req, res) => {
			let urlPath = req.url.split("?")[0];

			// Strip the base path prefix to get the dist-relative path
			if (BASE && urlPath.startsWith(BASE)) {
				urlPath = urlPath.slice(BASE.length) || "/";
			}

			const ext = extname(urlPath);

			// Routes (no extension) → SPA shell
			// Static assets (has extension) → serve directly
			const filePath = ext
				? join(DIST, urlPath)
				: join(DIST, "index.html");

			if (existsSync(filePath)) {
				res.setHeader("Content-Type", ext ? (MIME[ext] || "application/octet-stream") : MIME[".html"]);
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.end(readFileSync(filePath));
			} else {
				res.writeHead(404);
				res.end("Not found");
			}
		});

		server.listen(PORT, () => {
			console.log(`Prerender server → http://localhost:${PORT}${BASE}/`);
			resolve(server);
		});
	});
}

async function main() {
	console.log(`\nPrerendering ${ROUTES.length} routes (BASE="${BASE}")\n`);

	const server = await startServer();

	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
	});

	for (const route of ROUTES) {
		const url = `http://localhost:${PORT}${BASE}${route}`;
		const page = await browser.newPage();

		try {
			await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

			const html = await page.content();

			const segments = route.split("/").filter(Boolean);
			const outDir = segments.length ? join(DIST, ...segments) : DIST;
			mkdirSync(outDir, { recursive: true });
			writeFileSync(join(outDir, "index.html"), html, "utf-8");

			console.log(`  ✓  ${route}`);
		} catch (err) {
			console.error(`  ✗  ${route}: ${err.message}`);
		}

		await page.close();
	}

	await browser.close();
	server.close();
	console.log("\nPrerendering complete.\n");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
