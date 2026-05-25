#!/usr/bin/env node
/** Build brow consultation intake HTML — strips embedded base64, uses local assets. */
import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source =
  process.argv[2] ||
  join(process.env.HOME || "", "Downloads", "4-digital-intake (2).html");
const outDir = join(root, "public/forms");
const vendorDir = join(root, "public/vendor");
const out = join(outDir, "brow-consultation-intake.html");
const jspdfSrc = join(root, "node_modules/jspdf/dist/jspdf.umd.min.js");
const jspdfDest = join(vendorDir, "jspdf.umd.min.js");

if (!existsSync(source)) {
  console.warn("[build-brow-intake] source not found:", source);
  console.warn("Skipping — keep existing public/forms/brow-consultation-intake.html");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(vendorDir, { recursive: true });
if (existsSync(jspdfSrc)) cpSync(jspdfSrc, jspdfDest, { force: true });

let html = readFileSync(source, "utf8");
html = html.replace(
  /<img class="shapesimg" src="data:image[^"]*"[^>]*>/,
  '<img class="shapesimg" src="/handouts/education/brow-shapes-7-reference.png" alt="7 brow shape reference">',
);
html = html.replace(
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "/vendor/jspdf.umd.min.js",
);

writeFileSync(out, html);
console.log("[build-brow-intake] →", out, `(${statSync(out).size} bytes)`);
