#!/usr/bin/env node
/**
 * Converts PDF pages to PNG images for Remotion slide compositions.
 * Usage: node scripts/pdf-to-slides.mjs <pdf-path> [output-dir]
 *
 * Requires: poppler (brew install poppler) for pdftoppm
 * Output: public/morpheus8-clinical/ by default
 */
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = path.resolve(process.argv[2] || "");
const outDir = path.resolve(
  process.argv[3] || path.join(__dirname, "..", "public", "morpheus8-clinical")
);

if (!pdfPath || !fs.existsSync(pdfPath)) {
  console.error("Usage: node pdf-to-slides.mjs <pdf-path> [output-dir]");
  process.exit(1);
}

const pdftoppm = spawnSync("which", ["pdftoppm"], { encoding: "utf-8" });
if (pdftoppm.status !== 0) {
  console.error(
    "pdftoppm not found. Install poppler: brew install poppler"
  );
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const baseName = path.join(outDir, "slide");

console.log(`Converting ${path.basename(pdfPath)} to PNG slides...`);
execSync(
  `pdftoppm -png -r 150 "${pdfPath}" "${baseName}"`,
  { stdio: "inherit" }
);

const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".png"));
const numPages = files.length;

// Rename to slide-001.png, slide-002.png, etc.
files
  .sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ""), 10) || 0;
    const nb = parseInt(b.replace(/\D/g, ""), 10) || 0;
    return na - nb;
  })
  .forEach((f, i) => {
    const newName = `slide-${String(i + 1).padStart(3, "0")}.png`;
    if (f !== newName) {
      fs.renameSync(path.join(outDir, f), path.join(outDir, newName));
    }
  });

console.log(`Done. ${numPages} slides saved to ${outDir}`);
