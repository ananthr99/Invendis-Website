import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const OUT = join(PUBLIC, "images");

mkdirSync(OUT, { recursive: true });

const logoBase64 = readFileSync(join(PUBLIC, "invendis_logo.webp")).toString("base64");
const logoSrc = `data:image/webp;base64,${logoBase64}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #ffffff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  .border-accent {
    position: absolute; top: 0; left: 0; right: 0;
    height: 6px; background: #1e40af;
  }
  .content {
    position: relative; z-index: 10;
    text-align: center; padding: 60px;
    display: flex; flex-direction: column; align-items: center; gap: 32px;
  }
  img {
    height: 90px; width: auto;
  }
  .divider {
    width: 80px; height: 3px;
    background: #1e40af;
  }
  .tagline {
    font-size: 28px; color: #374151;
    font-weight: 400; letter-spacing: 0.5px;
  }
</style>
</head>
<body>
  <div class="border-accent"></div>
  <div class="content">
    <img src="${logoSrc}" alt="INVENDIS Technologies" />
    <div class="divider"></div>
    <div class="tagline">Industrial IoT Solutions &amp; Edge Hardware</div>
  </div>
</body>
</html>`;

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle0" });

const screenshot = await page.screenshot({ type: "png" });
writeFileSync(join(OUT, "og-default.png"), screenshot);

await browser.close();
console.log("✓  og-default.png → public/images/og-default.png");
