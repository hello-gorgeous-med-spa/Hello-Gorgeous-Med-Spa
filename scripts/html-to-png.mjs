#!/usr/bin/env node
/**
 * Converts HTML file to PNG using Playwright
 * Usage: node scripts/html-to-png.mjs <html-path> <png-path>
 */
import { chromium } from "playwright";
import path from "path";

const htmlPath = process.argv[2] || path.join(process.cwd(), "birthday-invitation.html");
const pngPath = process.argv[3] || htmlPath.replace(/\.html?$/i, ".png");

const absHtml = path.resolve(htmlPath);
const absPng = path.resolve(pngPath);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 816, height: 1056 });
await page.goto(`file://${absHtml}`, { waitUntil: "networkidle" });
await page.screenshot({
  path: absPng,
  type: "png",
  clip: { x: 0, y: 0, width: 816, height: 1056 },
});
await browser.close();
console.log("PNG saved to:", absPng);
