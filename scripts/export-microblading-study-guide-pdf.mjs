#!/usr/bin/env node
/**
 * Export microblading study guide HTML → PDF on Desktop.
 * Usage: node scripts/export-microblading-study-guide-pdf.mjs
 */

import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML = join(ROOT, "public/handouts/education/microblading-study-guide.html");
const DESKTOP = join(process.env.HOME || "", "Desktop");
const PDF_OUT = join(DESKTOP, "Hello-Gorgeous-Microblading-Study-Guide.pdf");
const HTML_OUT = join(DESKTOP, "Hello-Gorgeous-Microblading-Study-Guide.html");

async function main() {
  if (!existsSync(HTML)) {
    console.error("Missing:", HTML);
    process.exit(1);
  }

  copyFileSync(HTML, HTML_OUT);
  console.log("Copied HTML →", HTML_OUT);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${HTML}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: PDF_OUT,
    format: "Letter",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
  });
  await browser.close();

  console.log("Saved PDF  →", PDF_OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
