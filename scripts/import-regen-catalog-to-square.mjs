#!/usr/bin/env node
/**
 * RE GEN pharmacy catalog → Square Item Library (invoices & POS)
 *
 * Reads data/regen-best-prices.json (645 SKUs) and creates invoice-ready items with:
 *   • 30-day retail variation (default billing price)
 *   • 90-day retail variation (10% prepay discount baked in)
 *   • Categories by RE GEN menu (peptides, hormones, weight-loss, …)
 *   • Pharmacy + wholesale in description for margin reference at checkout
 *
 * Usage:
 *   npm run import-square-regen-catalog:dry-run
 *   npm run import-square-regen-catalog:local
 *   node scripts/import-regen-catalog-to-square.mjs --limit=20
 *
 * Env: SQUARE_ACCESS_TOKEN, optional SQUARE_ENVIRONMENT=sandbox
 * Manifest: data/square-regen-catalog-manifest.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = (() => {
  const hit = process.argv.find((a) => a.startsWith("--limit="));
  return hit ? Math.max(1, parseInt(hit.split("=")[1], 10)) : null;
})();

const SQUARE_VERSION = "2024-11-20";
const ROOT_CATEGORY_PREFIX = "RE GEN Catalog";
const CATALOG_PATH = path.join(ROOT, "data/regen-best-prices.json");
const MANIFEST_PATH = path.join(ROOT, "data/square-regen-catalog-manifest.json");

const CATEGORY_LABELS = {
  "weight-loss": "Weight Loss",
  peptides: "Peptides",
  vitamins: "Vitamins & Wellness",
  hormones: "Hormones",
  "sexual-health": "Sexual Health",
  "hair-skin": "Hair & Skin",
  wellness: "Wellness",
};

function apiRoot() {
  const env = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
  return env === "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";
}

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENV = apiRoot();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function truncate(str, max) {
  const s = String(str || "").trim();
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

function slugKey(id) {
  return String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48);
}

function dollars(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function loadCatalog() {
  const raw = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  return raw.products || [];
}

function buildFeeRows() {
  const shipping = Math.round((rawShippingUsd() || 30) * 100);
  return [
    {
      id: "regen-shipping",
      name: "RE GEN — Pharmacy Shipping (flat)",
      category: `${ROOT_CATEGORY_PREFIX} — Fees`,
      description: "Flat-rate compounded Rx shipping for RE GEN online & in-clinic orders.",
      variations: [
        { key: "30d", label: "Standard", price_cents: shipping },
      ],
    },
    {
      id: "regen-consult",
      name: "RE GEN — NP Consult (peptide / Rx)",
      category: `${ROOT_CATEGORY_PREFIX} — Fees`,
      description: "NP evaluation for new peptide or RE GEN protocol. Medication priced separately.",
      variations: [{ key: "30d", label: "Standard", price_cents: 4900 }],
    },
  ];
}

function rawShippingUsd() {
  try {
    const raw = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
    return raw.shippingFlat;
  } catch {
    return 30;
  }
}

function productToRow(p) {
  const catLabel = CATEGORY_LABELS[p.category] || "Other";
  const strength = p.concentration || p.size || "";
  const displayName = truncate(
    `${p.compound}${strength ? ` — ${strength}` : ""}`,
    200,
  );
  const flags = [
    p.pharmacy,
    p.controlled ? "controlled" : null,
    p.coldShip ? "cold ship" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const description = truncate(
    [
      `RE GEN catalog · ${flags}`,
      `Wholesale: $${p.wholesale}`,
      `30-day retail: $${p.retail30} · 90-day: $${p.retail90}`,
      `Form: ${p.form || p.route || "Rx"}`,
      `Catalog ID: ${p.id}`,
    ].join(" · "),
    900,
  );

  const retail30Cents = Math.round(Number(p.retail30) * 100);
  const retail90Cents = Math.round(Number(p.retail90) * 100);

  const variations = [];
  if (retail30Cents > 0) {
    variations.push({ key: "30d", label: "30-day supply", price_cents: retail30Cents });
  }
  if (retail90Cents > 0 && retail90Cents !== retail30Cents) {
    variations.push({ key: "90d", label: "90-day supply", price_cents: retail90Cents });
  }
  if (!variations.length) {
    variations.push({ key: "30d", label: "Custom price", price_cents: 0 });
  }

  return {
    id: p.id,
    name: displayName,
    category: `${ROOT_CATEGORY_PREFIX} — ${catLabel}`,
    description,
    sku: p.id,
    pharmacy: p.pharmacy,
    wholesale: p.wholesale,
    variations,
  };
}

function buildRows(products) {
  const slice = LIMIT ? products.slice(0, LIMIT) : products;
  return [...buildFeeRows(), ...slice.map(productToRow)];
}

async function squarePost(endpoint, body) {
  const res = await fetch(`${ENV}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.errors?.length) {
    throw new Error(data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText);
  }
  return data;
}

async function findCategoryIdByName(name) {
  const data = await squarePost("/catalog/search", {
    object_types: ["CATEGORY"],
    query: { exact_query: { attribute_name: "name", attribute_value: name } },
    limit: 10,
  });
  for (const o of data.objects || []) {
    if (o.type === "CATEGORY" && o.category_data?.name === name) return o.id;
  }
  return null;
}

async function resolveCategory(name, categoryMap) {
  if (categoryMap.has(name)) return categoryMap.get(name);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
  const idempotencyKey = `regen-cat-${slug}`;
  try {
    const res = await squarePost("/catalog/object", {
      idempotency_key: idempotencyKey,
      object: {
        type: "CATEGORY",
        id: `#${idempotencyKey}`,
        present_at_all_locations: true,
        category_data: { name },
      },
    });
    categoryMap.set(name, res.catalog_object.id);
    return res.catalog_object.id;
  } catch {
    const found = await findCategoryIdByName(name);
    if (found) {
      categoryMap.set(name, found);
      return found;
    }
    throw new Error(`Could not create or find category: ${name}`);
  }
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return new Map();
  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    return new Map((parsed.items || []).map((e) => [e.catalog_id, e]));
  } catch {
    return new Map();
  }
}

async function retrieveCatalogObject(objectId) {
  const res = await fetch(`${ENV}/catalog/object/${encodeURIComponent(objectId)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
    },
  });
  const data = await res.json();
  if (!res.ok || data.errors?.length) {
    throw new Error(data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText);
  }
  return data.object;
}

async function upsertRow(row, categoryId, prior) {
  let itemVersion;
  let itemId = prior?.square_item_id || `#regen-item-${slugKey(row.id)}`;
  const varMeta = [];

  if (prior?.square_item_id) {
    try {
      const live = await retrieveCatalogObject(prior.square_item_id);
      itemVersion = live.version;
      const liveVars = live.item_data?.variations || [];
      row.variations.forEach((v, i) => {
        const lv = liveVars[i];
        varMeta.push({
          square_variation_id: lv?.id || `#regen-var-${slugKey(row.id)}-${v.key}`,
          version: lv?.version,
        });
      });
    } catch {
      itemId = `#regen-item-${slugKey(row.id)}`;
      row.variations.forEach((v) => {
        varMeta.push({ square_variation_id: `#regen-var-${slugKey(row.id)}-${v.key}` });
      });
    }
  } else {
    row.variations.forEach((v) => {
      varMeta.push({ square_variation_id: `#regen-var-${slugKey(row.id)}-${v.key}` });
    });
  }

  const idempotencyKey = `regen-upsert-${slugKey(row.id)}-${Date.now()}`;
  const object = {
    type: "ITEM",
    id: itemId,
    ...(itemVersion != null ? { version: itemVersion } : {}),
    present_at_all_locations: true,
    item_data: {
      name: row.name,
      description: row.description,
      ...(categoryId ? { category_id: categoryId } : {}),
      available_online: false,
      variations: row.variations.map((v, i) => ({
        type: "ITEM_VARIATION",
        id: varMeta[i].square_variation_id,
        ...(varMeta[i].version != null ? { version: varMeta[i].version } : {}),
        present_at_all_locations: true,
        item_variation_data: {
          item_id: itemId,
          name: v.label,
          pricing_type: v.price_cents > 0 ? "FIXED_PRICING" : "VARIABLE_PRICING",
          ...(v.price_cents > 0
            ? { price_money: { amount: v.price_cents, currency: "USD" } }
            : {}),
          sku: `${row.sku || row.id}-${v.key}`,
        },
      })),
    },
  };

  const res = await squarePost("/catalog/object", {
    idempotency_key: idempotencyKey,
    object,
  });

  const item = res.catalog_object;
  const variations = (item.item_data?.variations || []).map((v, i) => ({
    key: row.variations[i]?.key || `v${i}`,
    label: row.variations[i]?.label || v.item_variation_data?.name,
    price_cents: row.variations[i]?.price_cents ?? 0,
    square_variation_id: v.id,
  }));

  return {
    catalog_id: row.id,
    name: row.name,
    category: row.category,
    pharmacy: row.pharmacy,
    wholesale: row.wholesale,
    square_item_id: item.id,
    version: item.version,
    variations,
  };
}

async function main() {
  const products = loadCatalog();
  const rows = buildRows(products);
  const categories = [...new Set(rows.map((r) => r.category))];

  console.log("\n🧪 RE GEN catalog → Square Item Library");
  console.log(`   Source: ${CATALOG_PATH}`);
  console.log(`   Products in JSON: ${products.length}`);
  console.log(`   Importing rows: ${rows.length}${LIMIT ? ` (limit ${LIMIT})` : ""}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   API: ${ENV.replace("/v2", "")}\n`);

  if (DRY_RUN) {
    console.log("Dry run — sample rows:\n");
    for (const r of rows.slice(0, 5)) {
      const prices = r.variations.map((v) => `${v.label}: ${v.price_cents ? dollars(v.price_cents) : "variable"}`).join(" · ");
      console.log(`  • [${r.category}] ${r.name}`);
      console.log(`    ${prices}`);
    }
    console.log(`\n  … and ${rows.length - 5} more`);
    console.log("\nRun: npm run import-square-regen-catalog:local\n");
    return;
  }

  if (!TOKEN || TOKEN.length < 10) {
    console.error("❌ Set SQUARE_ACCESS_TOKEN (npm run import-square-regen-catalog:local)");
    process.exit(1);
  }

  const categoryMap = new Map();
  console.log("📁 Categories…");
  for (const cat of categories) {
    await resolveCategory(cat, categoryMap);
    console.log(`  ✓ ${cat}`);
    await sleep(60);
  }

  const prior = loadManifest();
  const manifest = [];
  let ok = 0;
  let failed = 0;

  console.log(`\n💊 Items (${rows.length})…\n`);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const entry = await upsertRow(row, categoryMap.get(row.category), prior.get(row.id));
      manifest.push(entry);
      const priceSummary = entry.variations
        .map((v) => `${v.label}: ${v.price_cents ? dollars(v.price_cents) : "var"}`)
        .join(" · ");
      console.log(`  ✓ [${i + 1}/${rows.length}] ${truncate(row.name, 56)} — ${priceSummary}`);
      ok++;
      await sleep(100);
    } catch (e) {
      console.log(`  ✕ [${i + 1}/${rows.length}] ${row.name}: ${e instanceof Error ? e.message : e}`);
      const fallback = prior.get(row.id);
      if (fallback) manifest.push(fallback);
      failed++;
      await sleep(200);
    }
  }

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        imported_at: new Date().toISOString(),
        square_environment: (process.env.SQUARE_ENVIRONMENT || "production").toLowerCase(),
        source_catalog_generated_at: JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")).generatedAt,
        item_count: manifest.length,
        items: manifest,
      },
      null,
      2,
    ),
  );

  console.log(`\n✅ Done: ${ok}/${rows.length} (${failed} failed)`);
  console.log(`📄 Manifest: data/square-regen-catalog-manifest.json`);
  console.log("\n📱 Bill in Square:");
  console.log("   Dashboard → Invoices or POS → Items");
  console.log("   Filter: RE GEN Catalog — …");
  console.log("   Pick 30-day or 90-day variation per protocol.\n");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
