#!/usr/bin/env node
/**
 * Import BoomRx Illinois formulary + Hello Gorgeous peptide pricing PDFs
 * into data/pharmacy-catalog-raw.json and rebuild data/regen-best-prices.json.
 *
 * Usage:
 *   node scripts/import-boomrx-catalog.mjs \
 *     --standard="/path/to/Standard Catalog Pricing - Hello Gorgeous Illinois 7_7.pdf" \
 *     --peptides="/path/to/Peptide Catalog Hello Gorgeous.pdf"
 *
 * Defaults to data/source/*.txt if PDFs already extracted.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const args = process.argv.slice(2);
const getArg = (name) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : null;
};

const STANDARD_PDF =
  getArg("--standard") ||
  path.join(ROOT, "data/source/boomrx-illinois-catalog-2026-07.pdf");
const PEPTIDE_PDF =
  getArg("--peptides") ||
  path.join(ROOT, "data/source/boomrx-peptide-catalog-2026-07.pdf");

const RAW_PATH = path.join(ROOT, "data/pharmacy-catalog-raw.json");
const PEPTIDE_OUT = path.join(ROOT, "data/source/boomrx-peptide-catalog-2026-07.json");
const STANDARD_OUT = path.join(ROOT, "data/source/boomrx-illinois-catalog-2026-07.json");

async function pdfToText(filePath) {
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buf });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

function parsePrice(raw) {
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normKey(name, strength, form) {
  return `${name}|${strength}|${form}`.toLowerCase().replace(/\s+/g, " ").trim();
}

function mapCategory(cat, name) {
  const c = (cat || "").toLowerCase();
  const n = (name || "").toLowerCase();
  if (c.includes("weight")) return "GLP-1 / Weight Loss";
  if (c.includes("peptide")) return "Peptide Therapy";
  if (c.includes("hrt") || c.includes("hormone") || c.includes("hgh")) return "Hormone Therapy";
  if (c.includes("sexual")) return "Sexual Health";
  if (c.includes("hair")) return "Hair Loss";
  if (c.includes("cosmetic") || c.includes("cream")) return "Hair Loss";
  if (c.includes("wellness") || c.includes("vitamin") || c.includes("anti-aging")) return "Wellness";
  if (c.includes("supplies") || c.includes("device")) return "Wellness";
  if (c.includes("addiction")) return "Wellness";
  if (n.includes("semaglutide") || n.includes("tirzepatide")) return "GLP-1 / Weight Loss";
  return "Wellness";
}

function mapRoute(form) {
  const f = (form || "").toLowerCase();
  if (f.includes("inject")) return "Injectable";
  if (f.includes("cream") || f.includes("gel") || f.includes("emulsion")) return "Topical";
  if (f.includes("troche") || f.includes("odt") || f.includes("rdt") || f.includes("sol")) return "Troche";
  if (f.includes("capsule") || f.includes("tab") || f.includes("tablet")) return "Capsule";
  if (f.includes("patch")) return "Patch";
  if (f.includes("spray")) return "Spray";
  if (f.includes("device") || f.includes("syringe") || f.includes("each")) return "Supplies";
  return form || "Other";
}

function parseCatalogText(text, sourceLabel) {
  const rows = [];
  const lines = text.split(/\r?\n/);
  let id = 0;

  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("--") || /^BoomRx Formulary/i.test(t)) continue;
    if (/^Product Name/i.test(t)) continue;
    if (/^Confidential/i.test(t)) continue;
    if (/^Generated /i.test(t)) continue;
    if (/^Vince /i.test(t)) continue;
    if (t === "ViOS") continue;

    // Tab-separated: Name, Category, Form, Strength, Price
    const parts = t.split("\t").map((p) => p.trim()).filter(Boolean);
    if (parts.length < 5) continue;

    const price = parsePrice(parts[parts.length - 1]);
    if (price == null) continue;

    const productName = parts[0];
    const category = parts[1];
    const form = parts[2];
    const strength = parts.slice(3, -1).join(" ");

    rows.push({
      pharmacy: "BoomRx",
      sku: null,
      name: productName,
      size: strength.includes("mL") || strength.includes("Vial") || strength.includes("dose")
        ? strength.split(";").pop()?.trim() || strength
        : strength,
      conc: strength,
      budDays: null,
      controlled: /oxandrolone|stanozolol|testosterone|nandrolone|phentermine|ketamine|hcg/i.test(
        productName,
      ),
      coldShip: /nad\+|sermorelin|semaglutide|tirzepatide|bpc|peptide/i.test(productName),
      category: mapCategory(category, productName),
      route: mapRoute(form),
      cost: price,
      id: `brx-${sourceLabel}-${id++}`,
      _source: sourceLabel,
      _form: form,
    });
  }

  return rows;
}

function dedupeRows(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = normKey(row.name, row.conc, row._form);
    const existing = map.get(key);
    if (!existing || row.cost < existing.cost) {
      map.set(key, row);
    }
  }
  return [...map.values()];
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log(" Import BoomRx catalogs (Illinois Jul 2026 + HG peptides)");
  console.log("═══════════════════════════════════════════════════\n");

  let standardText;
  let peptideText;

  if (fs.existsSync(STANDARD_PDF)) {
    console.log("📄 Reading standard formulary PDF…");
    standardText = await pdfToText(STANDARD_PDF);
    fs.writeFileSync(
      path.join(ROOT, "data/source/boomrx-illinois-catalog-2026-07.txt"),
      standardText,
    );
  } else {
    standardText = fs.readFileSync(
      path.join(ROOT, "data/source/boomrx-illinois-catalog-2026-07.txt"),
      "utf8",
    );
  }

  if (fs.existsSync(PEPTIDE_PDF)) {
    console.log("📄 Reading Hello Gorgeous peptide PDF…");
    peptideText = await pdfToText(PEPTIDE_PDF);
    fs.writeFileSync(
      path.join(ROOT, "data/source/boomrx-peptide-catalog-2026-07.txt"),
      peptideText,
    );
  } else {
    peptideText = fs.readFileSync(
      path.join(ROOT, "data/source/boomrx-peptide-catalog-2026-07.txt"),
      "utf8",
    );
  }

  const standardRows = dedupeRows(parseCatalogText(standardText, "std"));
  const peptideRows = dedupeRows(parseCatalogText(peptideText, "pep"));

  // Peptide tailored prices override standard where keys match
  const peptidePriceByKey = new Map(
    peptideRows.map((r) => [normKey(r.name, r.conc, r._form), r.cost]),
  );

  let overrideCount = 0;
  for (const row of standardRows) {
    const key = normKey(row.name, row.conc, row._form);
    const pepPrice = peptidePriceByKey.get(key);
    if (pepPrice != null && pepPrice < row.cost) {
      row.cost = pepPrice;
      row._hgPeptidePrice = true;
      overrideCount++;
    }
  }

  // Add peptide-only SKUs not in standard
  const standardKeys = new Set(standardRows.map((r) => normKey(r.name, r.conc, r._form)));
  const peptideOnly = peptideRows.filter(
    (r) => !standardKeys.has(normKey(r.name, r.conc, r._form)),
  );

  const boomrxRows = [...standardRows, ...peptideOnly].map(({ _source, _form, _hgPeptidePrice, ...r }) => r);

  fs.writeFileSync(STANDARD_OUT, JSON.stringify(standardRows, null, 2));
  fs.writeFileSync(PEPTIDE_OUT, JSON.stringify(peptideRows, null, 2));

  console.log(`   Standard rows (deduped): ${standardRows.length}`);
  console.log(`   Peptide rows (deduped):  ${peptideRows.length}`);
  console.log(`   HG peptide price overrides: ${overrideCount}`);
  console.log(`   Peptide-only additions: ${peptideOnly.length}`);
  console.log(`   Total BoomRx SKUs: ${boomrxRows.length}\n`);

  const existing = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));
  const nonBoom = existing.filter((p) => p.pharmacy !== "BoomRx");
  const merged = [...nonBoom, ...boomrxRows];
  fs.writeFileSync(RAW_PATH, JSON.stringify(merged, null, 2));
  console.log(`✅ Updated ${RAW_PATH}`);
  console.log(`   Kept ${nonBoom.length} non-BoomRx + ${boomrxRows.length} BoomRx = ${merged.length} total\n`);

  console.log("🔧 Rebuilding regen-best-prices.json…");
  execSync("node scripts/build-regen-catalog.js", { cwd: ROOT, stdio: "inherit" });

  console.log("\n✅ Done. Admin /admin/rx/catalog and Rx Ops formulary use regen-best-prices.json.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
