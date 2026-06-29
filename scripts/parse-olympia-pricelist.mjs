#!/usr/bin/env node
/**
 * Parse Olympia doctor pricelist text extract (tabs from pdf-parse).
 * Chained by: node scripts/sync-olympia-pricelist.mjs
 */
import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/parse-olympia-pricelist.mjs <extract.txt>");
  process.exit(1);
}

const lines = fs
  .readFileSync(inputPath, "utf8")
  .split(/\r?\n/)
  .map((l) => l.trimEnd());

const skipLine = (l) => {
  const t = l.trim();
  if (!t) return true;
  return (
    t.includes("Prescription Form") ||
    t.includes("print_pricing") ||
    t.includes("DOCTOR'S PRICE") ||
    t.includes("DOCTOR INFORMATION") ||
    t.includes("PRODUCT INFORMATION") ||
    t.includes("Doctor Name:") ||
    t.includes("User Name:") ||
    t.includes("Clinic Name:") ||
    t === "Ryan Kent" ||
    t === "HELLO45844" ||
    t === "HELLO GORGEOUS PC" ||
    t === "#" ||
    t === "Product" ||
    t === "Concentration" ||
    t === "Dispense Size" ||
    t === "Discounted" ||
    t === "Price" ||
    t.startsWith("# ") ||
    t.includes("olympiapharmacy.com |") ||
    /^-- \d+ of \d+ --$/.test(t)
  );
};

const isPrice = (s) => /^\d+\.\d{2}$/.test(s.trim());
const isSkuOnly = (s) => /^\d{1,3}$/.test(s.trim());

function tabParts(line) {
  return line.split("\t").map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
}

/** @type {Array<{sku:number,name:string,concentration:string,dispenseSize:string,wholesaleUsd:number,coldShip?:boolean,signatureRequired?:boolean}>} */
const products = [];
let cur = null;

function flush() {
  if (!cur) return;
  const blob = `${cur.name} ${cur.concentration}`;
  const row = {
    sku: cur.sku,
    name: cur.name.replace(/\s+/g, " ").trim(),
    concentration: cur.concentration.replace(/\s+/g, " ").trim(),
    dispenseSize: cur.dispenseSize.replace(/\s+/g, " ").trim(),
    wholesaleUsd: cur.wholesaleUsd,
  };
  if (/cold ship/i.test(blob)) row.coldShip = true;
  if (/signature req/i.test(blob)) row.signatureRequired = true;
  if (row.name && row.wholesaleUsd > 0) products.push(row);
  cur = null;
}

function assignTail(parts) {
  if (parts.length === 0) return;
  if (parts.length === 1) {
    if (isPrice(parts[0])) cur.wholesaleUsd = Number(parts[0]);
    else if (!cur.dispenseSize) cur.dispenseSize = parts[0];
    else cur.concentration = `${cur.concentration} ${parts[0]}`.trim();
    return;
  }
  const price = parts[parts.length - 1];
  if (!isPrice(price)) {
    cur.concentration = `${cur.concentration} ${parts.join(" ")}`.trim();
    return;
  }
  cur.wholesaleUsd = Number(price);
  const body = parts.slice(0, -1);
  if (body.length === 1) cur.dispenseSize = body[0];
  else if (body.length === 2) {
    cur.concentration = cur.concentration ? `${cur.concentration} ${body[0]}`.trim() : body[0];
    cur.dispenseSize = body[1];
  } else {
    cur.concentration = `${cur.concentration} ${body.slice(0, -1).join(" ")}`.trim();
    cur.dispenseSize = body[body.length - 1];
  }
}

for (const line of lines) {
  if (skipLine(line)) continue;
  const trimmed = line.trim();
  if (!trimmed) continue;

  if (isSkuOnly(trimmed)) {
    flush();
    cur = { sku: Number(trimmed), name: "", concentration: "", dispenseSize: "", wholesaleUsd: 0 };
    continue;
  }

  if (isPrice(trimmed) && cur) {
    cur.wholesaleUsd = Number(trimmed);
    flush();
    continue;
  }

  const skuTab = trimmed.match(/^(\d{1,3})\t(.+)$/);
  const skuSpaceProduct = trimmed.match(/^(\d{1,3})\s+([A-Z0-9(].+)$/);

  if (skuTab || skuSpaceProduct) {
    flush();
    const sku = Number((skuTab ?? skuSpaceProduct)[1]);
    const rest = (skuTab ?? skuSpaceProduct)[2];
    cur = { sku, name: "", concentration: "", dispenseSize: "", wholesaleUsd: 0 };

    if (rest.includes("\t")) {
      const parts = tabParts(rest);
      cur.name = parts[0] ?? "";
      if (parts.length > 1 && isPrice(parts[parts.length - 1])) {
        assignTail(parts.slice(1));
        flush();
      }
    } else {
      cur.name = rest.trim();
    }
    continue;
  }

  if (!cur) continue;

  // Price at end of line without tabs (e.g. "30ML 115.00", "2.Amino Blend 30ml 149.49")
  const trailingPrice = trimmed.match(/^(.+?)\s+(\d+\.\d{2})$/);
  if (trailingPrice && !trimmed.includes("\t")) {
    const before = trailingPrice[1].trim();
    if (cur.concentration) cur.concentration = `${cur.concentration} ${before}`.trim();
    else if (cur.name && before.length < 80) cur.concentration = before;
    else if (!cur.name) cur.name = before;
    else cur.concentration = `${cur.concentration} ${before}`.trim();
    cur.wholesaleUsd = Number(trailingPrice[2]);
    flush();
    continue;
  }

  if (trimmed.includes("\t")) {
    const parts = tabParts(trimmed);
    if (parts.length && isPrice(parts[parts.length - 1])) {
      assignTail(parts);
      flush();
      continue;
    }
  }

  if (!cur.name) cur.name = trimmed;
  else cur.concentration = cur.concentration ? `${cur.concentration} ${trimmed}` : trimmed;
}

flush();

products.sort((a, b) => a.sku - b.sku);

const meta = {
  source: "olympiapharmacy.drscriptportal.com/reports/print_pricing",
  sourcePdf: "data/source/olympia-pricelist-2026-06-29.pdf",
  clinic: "HELLO GORGEOUS PC",
  doctor: "Ryan Kent",
  username: "HELLO45844",
  exportedAt: "2026-06-29",
  productCount: products.length,
};

const jsonPath = path.join(process.cwd(), "data", "olympia-pricelist.json");
fs.writeFileSync(jsonPath, JSON.stringify({ ...meta, products }, null, 2));

console.log(`Wrote ${products.length} products to ${jsonPath}`);
if (products.length !== 331) {
  const have = new Set(products.map((p) => p.sku));
  const missing = [];
  for (let i = 1; i <= 331; i++) if (!have.has(i)) missing.push(i);
  console.warn(`Expected 331, got ${products.length}. Missing: ${missing.join(", ")}`);
}
