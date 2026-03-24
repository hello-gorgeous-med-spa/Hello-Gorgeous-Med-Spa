#!/usr/bin/env node
/**
 * Renders service-menu-26x36.html to a 26"×36" print-ready PNG (150 DPI = 3900×5400 px)
 * Saves to ~/Desktop/hello-gorgeous-service-menu-26x36.png
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 26" × 36" at 150 DPI (print quality)
const WIDTH = 3900;
const HEIGHT = 5400;

const htmlPath = path.resolve(__dirname, "service-menu-26x36.html");
const outPath = path.resolve(process.env.HOME || "/Users/danid", "Desktop", "hello-gorgeous-service-menu-26x36.png");

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: WIDTH, height: HEIGHT });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });

await page.screenshot({
  path: outPath,
  type: "png",
  clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
});

await browser.close();
console.log("Saved 26×36 service menu (3900×5400 px @ 150 DPI) to:", outPath);
