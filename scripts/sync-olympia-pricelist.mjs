#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const pdfPath =
  process.argv[2] ||
  path.join(repoRoot, "data/source/olympia-pricelist-2026-06-29.pdf");

const buf = fs.readFileSync(pdfPath);
const parser = new PDFParse({ data: buf });
const result = await parser.getText();
await parser.destroy();

const outTxt = path.join(repoRoot, "data/olympia-pricelist.extract.txt");
fs.writeFileSync(outTxt, result.text);
console.log("Wrote", outTxt, "chars", result.text.length);

// chain to tab parser
const { spawnSync } = await import("node:child_process");
const r = spawnSync("node", [path.join(__dirname, "parse-olympia-pricelist.mjs"), outTxt], {
  stdio: "inherit",
  cwd: repoRoot,
});
process.exit(r.status ?? 1);
