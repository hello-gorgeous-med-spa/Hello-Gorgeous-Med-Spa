#!/usr/bin/env node
/**
 * Extract vial images + education copy from regen-peptide-cards.html.
 *
 *   npm run sync:regen-peptide-cards
 *   node scripts/extract-regen-peptide-cards.mjs /path/to/regen-peptide-cards.html
 *   node scripts/extract-regen-peptide-cards.mjs --force   # overwrite skip:true vials
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
  "regen-5-amino-1mq": "prod-5amino1mq-regen.png",
  "regen-ss-31": "prod-ss31-regen.png",
  "regen-glutathione": "prod-glutathione-regen.png",
  "regen-methylene-blue": "prod-methylene-blue-regen.png",
  "regen-thymosin-alpha-1": "prod-thymosin-a1-regen.png",
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/regen-site/assets");
const contentOut = join(root, "data/regen-peptide-cards-content.json");
const publicContentOut = join(root, "public/regen-site/data/regen-peptide-cards-content.json");
const defaultHtml = join(root, "data/source/regen-peptide-cards.html");

const args = process.argv.slice(2);
const force = args.includes("--force");
const htmlPath = args.find((a) => !a.startsWith("--")) || defaultHtml;

const catalog = JSON.parse(readFileSync(join(root, "data/regen-vial-catalog.json"), "utf8"));
const skipFiles = new Set(
  catalog.filter((e) => e.skip).map((e) => e.file),
);

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseCards(html) {
  const articles = html.split('<article class="card"').slice(1);
  const cards = [];

  for (const chunk of articles) {
    const id = chunk.match(/data-file="([^"]+)"/)?.[1];
    if (!id) continue;

    const hasJpeg = /<img class="vial" src="data:image\/jpeg/.test(chunk);
    const hasSvg = /<svg class="vial ph"/.test(chunk);
    const name = stripHtml(chunk.match(/<h2 class="name[^"]*">([\s\S]*?)<\/h2>/)?.[1] || "");
    const chip = stripHtml(chunk.match(/<span class="chip">([\s\S]*?)<\/span>/)?.[1] || "");
    const what = stripHtml(chunk.match(/<p class="what">([\s\S]*?)<\/p>/)?.[1] || "");
    const studiedFor = [...chunk.matchAll(/<ul class="actions">([\s\S]*?)<\/ul>/g)].flatMap((m) =>
      [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => stripHtml(x[1])),
    );
    const note = stripHtml(chunk.match(/<p class="note">([\s\S]*?)<\/p>/)?.[1] || "") || undefined;
    const specs = [...chunk.matchAll(/<span class="spec[^"]*">([\s\S]*?)<\/span>/g)].map((m) =>
      stripHtml(m[1]),
    );

    cards.push({
      id,
      storefrontFile: MAP[id] ?? null,
      name,
      chip,
      what,
      studiedFor,
      ...(note ? { note } : {}),
      specs,
      vial: hasJpeg ? "jpeg" : hasSvg ? "svg-placeholder" : "none",
    });
  }

  return cards;
}

const html = readFileSync(htmlPath, "utf8");
const cards = parseCards(html);
const contentJson = `${JSON.stringify(cards, null, 2)}\n`;
writeFileSync(contentOut, contentJson);
writeFileSync(publicContentOut, contentJson);
console.log(`wrote ${contentOut} (${cards.length} cards)`);
console.log(`wrote ${publicContentOut}`);

const articles = html.split('<article class="card"').slice(1);
let wrote = 0;
let skipped = 0;

for (const chunk of articles) {
  const id = chunk.match(/data-file="([^"]+)"/)?.[1];
  const src = chunk.match(/<img class="vial" src="(data:image\/[^;]+;base64,[^"]+)"/)?.[1];
  const out = id && MAP[id];
  if (!out || !src) continue;

  if (skipFiles.has(out) && !force) {
    console.log(`skip ${out} (gold-standard protected; use --force to overwrite)`);
    skipped++;
    continue;
  }

  const b64 = src.split(",")[1];
  const buf = Buffer.from(b64, "base64");
  const png = await sharp(buf).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(join(outDir, out), png);
  console.log(`wrote ${out} (${png.length} bytes)`);
  wrote++;
}

console.log(`Done. ${wrote} vials written, ${skipped} skipped.`);
