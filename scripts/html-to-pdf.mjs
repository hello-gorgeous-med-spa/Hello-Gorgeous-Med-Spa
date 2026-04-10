#!/usr/bin/env node
/**
 * Converts HTML file to PDF using Playwright
 * Usage: node scripts/html-to-pdf.mjs <html-path> <pdf-path>
 */
import { chromium } from "playwright";
import path from "path";

const htmlPath = process.argv[2] || path.join(process.cwd(), "birthday-invitation.html");
const pdfPath = process.argv[3] || htmlPath.replace(/\.html?$/i, ".pdf");

const absHtml = path.resolve(htmlPath);
const absPdf = path.resolve(pdfPath);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${absHtml}`, { waitUntil: "networkidle" });
await page.pdf({
  path: absPdf,
  format: "Letter",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await browser.close();
console.log("PDF saved to:", absPdf);
