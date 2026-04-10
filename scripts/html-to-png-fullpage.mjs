#!/usr/bin/env node
/**
 * Converts HTML file to PNG (full page) using Playwright
 * Usage: node scripts/html-to-png-fullpage.mjs <html-path> <png-path>
 */
import { chromium } from "playwright";
import path from "path";

const htmlPath = path.resolve(process.argv[2]);
const pngPath = path.resolve(process.argv[3] || process.argv[2].replace(/\.html?$/i, ".png"));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 650, height: 1200 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
await page.screenshot({
  path: pngPath,
  type: "png",
  fullPage: true,
});
await browser.close();
console.log("PNG saved to:", pngPath);
