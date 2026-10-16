#!/usr/bin/env node
/**
 * Peptide Bar menu → Square register.
 *
 * One category, "Peptide Bar", at the same prices as the kiosk and poster.
 * These are register items, not online checkout and not appointment services.
 * Descriptions stay client-safe: no pharmacy cost.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-peptide-bar-to-square.mjs --dry-run
 *   node --env-file=.env.local scripts/import-peptide-bar-to-square.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "data/square-peptide-bar-manifest.json");
const CATEGORY = "Peptide Bar";
const SQUARE_VERSION = "2024-11-20";
const DRY_RUN = process.argv.includes("--dry-run");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const API = envName === "sandbox" ? "https://connect.squareupsandbox.com/v2" : "https://connect.squareup.com/v2";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;

const NOTE = "Compounded. A clinician reviews before this is dispensed. Add Peptide Bar · Cold ship once per order.";

function cents(usd) {
  return Math.round(Number(usd) * 100);
}

function vial(id, name, spec, usd) {
  return {
    id,
    name: `Peptide Bar · ${name}`,
    description: `${spec}. ${NOTE}`,
    variations: [{ key: "each", label: spec, price_cents: cents(usd) }],
  };
}

const ROWS = [
  vial("bpc-157", "BPC-157", "3 mg/mL · 5 mL", 175),
  vial("tb-500", "TB-500", "3 mg/mL · 5 mL", 175),
  vial("ghk-cu", "GHK-Cu", "10 mg/mL · 5 mL", 175),
  vial("pt-141", "PT-141", "2 mg/mL · 5 mL", 175),
  vial("mots-c", "MOTS-c", "20 mg/mL · 5 mL", 175),
  vial("tesamorelin", "Tesamorelin", "3 mg/mL · 5 mL", 175),
  vial("aod-9604", "AOD-9604", "2 mg/mL · 5 mL", 175),
  vial("igf-lr3", "IGF-LR3", "200 mcg/mL · 5 mL", 175),
  vial("thymosin-a1", "Thymosin Alpha-1", "5 mg/mL · 5 mL", 175),
  vial("nad", "NAD+", "100 mg/mL · 10 mL", 150),
  vial("cjc-ipa", "CJC-1295 / Ipamorelin", "1.2 mg / 2 mg per mL · 5 mL", 200),
  vial("bpc-tb", "BPC-157 / TB-500", "3 mg / 3 mg per mL · 5 mL", 200),
  vial("bpc-kpv-tb", "BPC-157 / KPV / TB-500", "3 / 3 / 3 mg per mL · 5 mL", 200),
  vial("bpc-tb-ghk", "BPC-157 / TB-500 / GHK-Cu", "3 / 3 / 10 mg per mL · 5 mL", 200),
  vial("recovery", "Recovery Blend", "BPC-157, GHK-Cu, KPV, TB-500 · 5 mL", 200),
  vial("tesa-ipa", "Tesamorelin / Ipamorelin", "3 mg / 2 mg per mL · 5 mL", 200),
  vial("mots-tesa", "MOTS-c / Tesamorelin", "4 mg / 3 mg per mL · 5 mL", 200),
  vial("b12", "B12 Methylcobalamin", "5 mg/mL · 10 mL take-home vial", 180),
  vial("micc", "MICC lipo", "30 mL take-home vial", 230),
  vial("glutathione", "Glutathione", "200 mg/mL · 30 mL take-home vial", 208),
  vial("biotin", "Biotin", "10 mg/mL · 10 mL take-home vial", 207),
  vial("tri-immune", "Tri-Immune", "Vitamin C, glutathione, and zinc · 30 mL", 215),
  vial("brightening", "Brightening cream", "Hyperpigmentation and melasma · hydroquinone, tretinoin, azelaic acid · 30 g", 238),
  vial("clarity", "Clarity acne cream", "Acne and rosacea · azelaic acid, tretinoin, niacinamide · 30 g", 210),
  vial("hair", "Minoxidil / finasteride", "Hair restoration · 7% / 0.25% / arginine 2% · 30 mL", 210),
  vial("ghk-topical", "GHK-Cu topical", "Anti-aging · copper peptide 0.25% · 30 mL", 195),
  vial("sermorelin", "Sermorelin", "6 mL · 1 mg/mL", 188),
  vial("ldn", "Low-dose naltrexone", "30 capsules · dose set by the clinician", 178),
  vial("vitamin-d", "Vitamin D3", "50,000 IU/mL · 30 mL · IM only · dose follows labs", 210),
  {
    id: "semaglutide",
    name: "Peptide Bar · Semaglutide / Glycine",
    description: `4-week vial. ${NOTE}`,
    variations: [
      { key: "025", label: "0.25 mg/week", price_cents: cents(100) },
      { key: "05", label: "0.5 mg/week", price_cents: cents(137.5) },
      { key: "10", label: "1 mg/week", price_cents: cents(150) },
      { key: "17", label: "1.7 mg/week", price_cents: cents(262.5) },
      { key: "24", label: "2.4 mg/week", price_cents: cents(262.5) },
    ],
  },
  {
    id: "tirzepatide",
    name: "Peptide Bar · Tirzepatide / Glycine",
    description: `4-week vial. Not brand-name tirzepatide. ${NOTE}`,
    variations: [
      { key: "25", label: "2.5 mg/week", price_cents: cents(187.5) },
      { key: "5", label: "5 mg/week", price_cents: cents(250) },
      { key: "75", label: "7.5 mg/week", price_cents: cents(337.5) },
      { key: "10", label: "10 mg/week", price_cents: cents(375) },
      { key: "125", label: "12.5 mg/week", price_cents: cents(425) },
    ],
  },
  {
    id: "cold-ship",
    name: "Peptide Bar · Cold ship",
    description: "Add once per order. Do not add a second shipping item.",
    variations: [{ key: "once", label: "Once per order", price_cents: cents(30) }],
  },
];

function money(centsAmount) {
  return Number.isInteger(centsAmount / 100) ? `$${centsAmount / 100}` : `$${(centsAmount / 100).toFixed(2)}`;
}

async function square(method, endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.errors?.length) {
    throw new Error(data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText);
  }
  return data;
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return new Map();
  const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return new Map((parsed.items || []).map((row) => [row.catalog_id, row]));
}

async function ensureCategory() {
  const found = await square("POST", "/catalog/search", {
    object_types: ["CATEGORY"],
    query: { exact_query: { attribute_name: "name", attribute_value: CATEGORY } },
    limit: 5,
  });
  const existing = (found.objects || []).find((o) => o.category_data?.name === CATEGORY);
  if (existing) return existing.id;
  const created = await square("POST", "/catalog/object", {
    idempotency_key: "peptide-bar-category",
    object: {
      type: "CATEGORY",
      id: "#peptide-bar-category",
      present_at_all_locations: true,
      category_data: { name: CATEGORY },
    },
  });
  return created.catalog_object.id;
}

async function upsert(row, categoryId, prior) {
  let itemId = prior?.square_item_id || `#pb-${row.id}`;
  let itemVersion;
  const liveVars = [];
  if (prior?.square_item_id) {
    const live = await square("GET", `/catalog/object/${prior.square_item_id}`);
    itemVersion = live.object.version;
    liveVars.push(...(live.object.item_data?.variations || []));
  }

  const object = {
    type: "ITEM",
    id: itemId,
    ...(itemVersion != null ? { version: itemVersion } : {}),
    present_at_all_locations: true,
    item_data: {
      name: row.name,
      description: row.description,
      category_id: categoryId,
      product_type: "REGULAR",
      available_online: false,
      variations: row.variations.map((variation, index) => {
        const live = liveVars[index];
        const variationId = live?.id || `#pb-${row.id}-${variation.key}`;
        return {
          type: "ITEM_VARIATION",
          id: variationId,
          ...(live?.version != null ? { version: live.version } : {}),
          present_at_all_locations: true,
          item_variation_data: {
            item_id: itemId,
            name: variation.label,
            pricing_type: "FIXED_PRICING",
            price_money: { amount: variation.price_cents, currency: "USD" },
            sku: `pb-${row.id}-${variation.key}`,
          },
        };
      }),
    },
  };

  const saved = await square("POST", "/catalog/object", {
    idempotency_key: `pb-${row.id}-${Date.now()}`,
    object,
  });
  const item = saved.catalog_object;
  return {
    catalog_id: row.id,
    name: row.name,
    square_item_id: item.id,
    variations: (item.item_data?.variations || []).map((variation, index) => ({
      key: row.variations[index].key,
      label: row.variations[index].label,
      price_cents: row.variations[index].price_cents,
      square_variation_id: variation.id,
    })),
  };
}

async function main() {
  console.log(`Peptide Bar → Square (${envName}) · ${ROWS.length} items`);
  if (DRY_RUN) {
    for (const row of ROWS) {
      const prices = row.variations.map((v) => `${v.label} ${money(v.price_cents)}`).join(" · ");
      console.log(`  ${row.name} — ${prices}`);
    }
    return;
  }
  if (!TOKEN) {
    console.error("Missing SQUARE_ACCESS_TOKEN");
    process.exit(1);
  }
  const categoryId = await ensureCategory();
  console.log(`Category ${CATEGORY} ${categoryId}`);
  const prior = loadManifest();
  const items = [];
  for (const row of ROWS) {
    const saved = await upsert(row, categoryId, prior.get(row.id));
    items.push(saved);
    const prices = saved.variations.map((v) => `${v.label} ${money(v.price_cents)}`).join(" · ");
    console.log(`  ✓ ${saved.name} — ${prices}`);
  }
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify({ imported_at: new Date().toISOString(), square_environment: envName, category: CATEGORY, item_count: items.length, items }, null, 2),
  );
  console.log(`Saved ${items.length} items to data/square-peptide-bar-manifest.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
