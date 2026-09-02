/**
 * Export 24×36 PDFs for Quick Signs (Washington Street A-frames).
 * Run from repo root: node scripts/export-washington-yard-signs.mjs
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const ROOT = path.resolve("docs/print/washington-st-24x36");
const SIGNS = [
  "01-youre-here",
  "02-fall-makeover",
  "03-this-is-us",
  "04-botox",
  "05-pout-now",
  "06-alive-menu",
  "07-weight-loss",
  "08-chrome-welcome",
  "09-chrome-botox",
  "10-chrome-weight",
  "11-chrome-aframe",
  "12-financing-alive",
];

const browser = await chromium.launch();
const page = await browser.newPage();
await mkdir(ROOT, { recursive: true });

for (const name of SIGNS) {
  const html = path.join(ROOT, `${name}.html`);
  const pdf = path.join(ROOT, `${name}.pdf`);
  await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdf,
    width: "24in",
    height: "36in",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  console.log("wrote", pdf);
}

await browser.close();
