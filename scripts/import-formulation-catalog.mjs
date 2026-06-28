#!/usr/bin/env node
/**
 * Parse Formulation wholesale export (TSV) → data/formulation-pharmacy-catalog.json
 *
 * Usage:
 *   npm run import:formulation-catalog
 *   node scripts/import-formulation-catalog.mjs path/to/export.tsv
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_IN = path.join(ROOT, "data/formulation-pharmacy-catalog.tsv");
const OUT = path.join(ROOT, "data/formulation-pharmacy-catalog.json");

const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_IN;

if (!fs.existsSync(inputPath)) {
  console.error(`Missing input: ${inputPath}`);
  console.error("Save your Formulation export as data/formulation-pharmacy-catalog.tsv");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const lines = raw.split(/\r?\n/);

const items = [];
let pending = null;

function flushPending() {
  if (!pending) return;
  items.push(pending);
  pending = null;
}

function parsePrice(line) {
  const m = line.match(/\$([\d,]+(?:\.\d{2})?)/);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ""));
}

for (const line of lines) {
  if (!line.trim()) continue;
  if (/^SKU\t/i.test(line)) continue;

  const skuMatch = line.match(/^(\d+)\t/);
  if (skuMatch) {
    flushPending();
    const cols = line.split("\t");
    pending = {
      sku: cols[0].trim(),
      product: (cols[1] || "").trim(),
      size: (cols[2] || "").trim(),
      concentration: (cols[3] || "").trim(),
      form: (cols[4] || "").trim(),
      bud: (cols[5] || "").trim() || null,
      category: (cols[6] || "").trim(),
      flags: [],
      wholesaleUsd: parsePrice(line) ?? 0,
      controlled: /controlled/i.test(line),
    };
    const trailing = cols.slice(7).join(" ").trim();
    if (trailing && !trailing.startsWith("$")) {
      pending.flags.push(...trailing.split(/\s*·\s*/).filter(Boolean));
    }
    continue;
  }

  if (!pending) continue;

  const price = parsePrice(line);
  if (price != null) {
    pending.wholesaleUsd = price;
    continue;
  }

  const trimmed = line.trim();
  if (/controlled/i.test(trimmed)) pending.controlled = true;
  if (trimmed && !trimmed.startsWith("$")) {
    pending.flags.push(trimmed.replace(/^❄\s*/, "").trim());
  }
}

flushPending();

const deduped = new Map();
for (const item of items) {
  if (item.sku && item.product) deduped.set(item.sku, item);
}

const out = [...deduped.values()].sort((a, b) => a.sku.localeCompare(b.sku, undefined, { numeric: true }));

fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${out.length} SKUs → ${OUT}`);
