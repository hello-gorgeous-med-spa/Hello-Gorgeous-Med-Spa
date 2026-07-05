#!/usr/bin/env node
/**
 * Unpack a Cursor/DC bundled HTML export into public/flowwave-site/
 *
 * Usage:
 *   node scripts/unpack-flowwave-bundle.mjs [path/to/bundled.html]
 *
 * Default source: data/source/flowwave-shockwave-therapy.html
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, "..");
const DEFAULT_SRC = path.join(APP_DIR, "data/source/flowwave-shockwave-therapy.html");
const DEFAULT_DEST_NAME = "flowwave-site";

const MIME_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "text/javascript": "js",
  "application/javascript": "js",
  "font/woff2": "woff2",
  "font/woff": "woff",
};

function extForMime(mime) {
  return MIME_EXT[mime] ?? mime.split("/").pop() ?? "bin";
}

function decodeEntry(entry) {
  let bytes = Buffer.from(entry.data, "base64");
  if (entry.compressed) {
    bytes = zlib.gunzipSync(bytes);
  }
  return bytes;
}

function extract(html, destName) {
  const DEST = path.join(APP_DIR, "public", destName);
  const ASSETS = path.join(DEST, "assets");
  const publicPrefix = `/${destName}`;
  const manifestMatch = html.match(
    /<script type="__bundler\/manifest">([\s\S]*?)<\/script>/,
  );
  const templateMatch = html.match(
    /<script type="__bundler\/template">([\s\S]*?)<\/script>/,
  );
  if (!manifestMatch || !templateMatch) {
    throw new Error("Missing __bundler/manifest or __bundler/template script tags");
  }

  const manifest = JSON.parse(manifestMatch[1]);
  let template = JSON.parse(templateMatch[1]);
  const uuids = Object.keys(manifest);

  fs.mkdirSync(ASSETS, { recursive: true });

  for (const uuid of uuids) {
    const entry = manifest[uuid];
    const ext = extForMime(entry.mime);
    const filename = `${uuid}.${ext}`;
    const assetPath = `${publicPrefix}/assets/${filename}`;
    const bytes = decodeEntry(entry);
    fs.writeFileSync(path.join(ASSETS, filename), bytes);

    // Replace bare UUID references (script src, url(), etc.)
    template = template.split(uuid).join(assetPath);
  }

  // Sanity: no bare UUIDs left in common attribute contexts
  const leftover = [
    ...template.matchAll(
      /(?:src|href)=["']([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi,
    ),
  ];
  if (leftover.length) {
    console.warn(`⚠️  ${leftover.length} unresolved UUID reference(s) in template`);
  }

  fs.writeFileSync(path.join(DEST, "index.html"), template, "utf8");

  const types = {};
  for (const entry of Object.values(manifest)) {
    const ext = extForMime(entry.mime);
    types[ext] = (types[ext] ?? 0) + 1;
  }

  return { assetCount: uuids.length, types, htmlBytes: Buffer.byteLength(template, "utf8"), destName, DEST };
}

function main() {
  const src = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SRC;
  const destName = process.argv[3] || DEFAULT_DEST_NAME;
  if (!fs.existsSync(src)) {
    console.error(`❌ Source not found: ${src}`);
    process.exit(1);
  }

  console.log(`📦 Unpacking FlowWave bundle`);
  console.log(`   Source: ${src}`);
  console.log(`   Dest:   public/${destName}/`);

  const html = fs.readFileSync(src, "utf8");
  const result = extract(html, destName);

  console.log(`✅ Wrote index.html (${(result.htmlBytes / 1024).toFixed(1)} KB)`);
  console.log(`✅ Extracted ${result.assetCount} assets → assets/`);
  console.log(`   ${Object.entries(result.types).map(([k, v]) => `${v} ${k}`).join(", ")}`);
  console.log(`\n🎉 Ready at /${destName}/index.html`);
  if (destName === "flowwave-site") {
    console.log(`   Review: npm run dev → http://localhost:3000/services/flowwave`);
  } else if (destName === "flowwave-brochure-site") {
    console.log(`   Review: npm run dev → http://localhost:3000/services/flowwave/brochure`);
  }
}

main();
