#!/usr/bin/env node
/**
 * Batch-render RE GEN product vial PNGs from data/regen-vial-catalog.json.
 * Uses your BPC-157 / GHK-CU renders as gold standard when skip:true.
 *
 *   node scripts/generate-regen-vial-images.mjs
 *   node scripts/generate-regen-vial-images.mjs --force   # overwrite existing
 */
import { readFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalog = JSON.parse(readFileSync(join(root, "data/regen-vial-catalog.json"), "utf8"));
const outDir = join(root, "public/regen-site/assets");
const templatePath = join(__dirname, "regen-vial-template.html");
const force = process.argv.includes("--force");

/** User-provided gold-standard vials (from chat uploads) */
const SOURCE_VIALS = {
  "prod-bpc157-regen.png":
    "/Users/danid/.cursor/projects/Users-danid-Hello-Gorgeous-Med-Spa-hello-gorgeous-med-spa/assets/Screenshot_2026-07-03_at_7.43.52_AM-5df43dc9-9b04-4a7e-bfaf-f8f2326ffe83.png",
  "prod-ghkcu-regen.png":
    "/Users/danid/.cursor/projects/Users-danid-Hello-Gorgeous-Med-Spa-hello-gorgeous-med-spa/assets/Screenshot_2026-07-03_at_7.37.34_AM-dccfcba2-80d5-4847-9875-6d7d3ab3a680.png",
};

for (const [file, src] of Object.entries(SOURCE_VIALS)) {
  if (existsSync(src)) {
    copyFileSync(src, join(outDir, file));
    console.log(`copied gold-standard ${file}`);
  }
}

const toRender = catalog.filter((item) => {
  if (item.skip) return false;
  const dest = join(outDir, item.file);
  if (!force && existsSync(dest)) return false;
  return true;
});

if (toRender.length === 0) {
  console.log("No vials to render (all exist — use --force to regenerate).");
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.goto(`file://${templatePath}`);

for (const item of toRender) {
  await page.evaluate((p) => window.setVial(p), {
    name: item.name,
    category: item.category,
    dose: item.dose,
    usage: item.usage,
    form: item.form || "vial",
  });
  await page.waitForTimeout(80);
  const dest = join(outDir, item.file);
  await page.screenshot({ path: dest, type: "png" });
  console.log(`rendered ${item.file}`);
}

await browser.close();
console.log(`Done — ${toRender.length} vial image(s).`);
