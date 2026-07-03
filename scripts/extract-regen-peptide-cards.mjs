#!/usr/bin/env node
/**
 * Extract vial images from regen-peptide-cards.html into public/regen-site/assets.
 *
 *   node scripts/extract-regen-peptide-cards.mjs /path/to/regen-peptide-cards.html
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAP = {
  "regen-sermorelin": "prod-sermorelin-regen.png",
  "regen-cjc-ipamorelin": "prod-cjc-ipamorelin-regen.png",
  "regen-tesamorelin-ipamorelin": "prod-tesamorelin-regen.png",
  "regen-bpc-157": "prod-bpc157-regen.png",
  "regen-tb-500": "prod-tb500-regen.png",
  "regen-wolverine-stack": "prod-wolverine-stack-regen.png",
  "regen-klow": "prod-klow-regen.png",
  "regen-nad-plus": "prod-nad-regen.png",
  "regen-ghk-cu": "prod-ghkcu-regen.png",
  "regen-semax": "prod-semax-regen.png",
  "regen-selank": "prod-selank-regen.png",
};

const htmlPath = process.argv[2];
if (!htmlPath) {
  console.error("Usage: node scripts/extract-regen-peptide-cards.mjs <regen-peptide-cards.html>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/regen-site/assets");
const html = readFileSync(htmlPath, "utf8");
const articles = html.split('<article class="card"').slice(1);

for (const chunk of articles) {
  const id = chunk.match(/data-file="([^"]+)"/)?.[1];
  const src = chunk.match(/<img class="vial" src="(data:image\/[^;]+;base64,[^"]+)"/)?.[1];
  const out = id && MAP[id];
  if (!out || !src) continue;

  const b64 = src.split(",")[1];
  const buf = Buffer.from(b64, "base64");
  const png = await sharp(buf).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(join(outDir, out), png);
  console.log(`wrote ${out} (${png.length} bytes)`);
}

console.log("Done.");
