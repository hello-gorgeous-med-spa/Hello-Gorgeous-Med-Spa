#!/usr/bin/env npx tsx
/**
 * Hello Gorgeous RX™ — Square Item Library for Invoices & POS
 *
 * Creates invoice-ready catalog items (not appointment services):
 *   • NP consult & telehealth fees (fixed or variable)
 *   • All peptide Rx line items (variable pricing — set per client at invoice time)
 *
 * Usage:
 *   npm run import-square-hg-rx:dry-run
 *   npm run import-square-hg-rx:local
 *
 * Env: SQUARE_ACCESS_TOKEN, optional SQUARE_ENVIRONMENT=sandbox
 *
 * Safe to re-run — stable idempotency keys per slug.
 * Manifest written to data/square-hg-rx-catalog-manifest.json (Square item + variation IDs).
 */

import fs from "fs";
import path from "path";

import {
  PEPTIDE_CONSULT_FEE_USD,
  PEPTIDE_REQUEST_ITEMS,
} from "../lib/peptide-request-menu";

const DRY_RUN = process.argv.includes("--dry-run");
const SQUARE_VERSION = "2024-11-20";
const ROOT_CATEGORY = "Hello Gorgeous RX™";

type CatalogRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  price_cents: number;
  sku?: string;
};

function apiRoot(): string {
  const env = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
  return env === "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";
}

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENV = apiRoot();

function buildCatalogRows(): CatalogRow[] {
  const feeDescription =
    "Hello Gorgeous RX™ — NP-supervised. Requires telehealth evaluation. Not a prescription until approved.";

  const fees: CatalogRow[] = [
    {
      id: "peptide-consult",
      name: "Hello Gorgeous RX™ — Peptide Consult (NP)",
      category: `${ROOT_CATEGORY} — Fees`,
      description: `$${PEPTIDE_CONSULT_FEE_USD} NP telehealth evaluation for new peptide protocols. Medication priced separately after approval. ${feeDescription}`,
      price_cents: PEPTIDE_CONSULT_FEE_USD * 100,
      sku: "HG-RX-CONSULT-49",
    },
    {
      id: "telehealth-refill-review",
      name: "Hello Gorgeous RX™ — Telehealth Refill Review",
      category: `${ROOT_CATEGORY} — Fees`,
      description: `Required NP telehealth visit to approve peptide refills. Set fee per visit if applicable. ${feeDescription}`,
      price_cents: 0,
      sku: "HG-RX-REFILL-TH",
    },
    {
      id: "pharmacy-shipping",
      name: "Hello Gorgeous RX™ — Pharmacy / Shipping",
      category: `${ROOT_CATEGORY} — Fees`,
      description: "Compounded peptide pharmacy fulfillment, shipping, or handling — price varies by protocol.",
      price_cents: 0,
      sku: "HG-RX-SHIP",
    },
  ];

  const peptides: CatalogRow[] = PEPTIDE_REQUEST_ITEMS.map((p) => ({
    id: p.id,
    name: `Hello Gorgeous RX™ — ${p.name}`,
    category: `${ROOT_CATEGORY} — ${p.category}`,
    description: `${p.benefit}. Compounded Rx peptide — variable pricing per protocol. ${feeDescription}`,
    price_cents: 0,
    sku: `HG-RX-${p.id.toUpperCase().replace(/-/g, "")}`,
  }));

  return [...fees, ...peptides];
}

async function squarePost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${ENV}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { errors?: Array<{ detail?: string; code?: string }> };
  if (!res.ok || data.errors?.length) {
    throw new Error(data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText);
  }
  return data;
}

async function findCategoryIdByName(name: string): Promise<string | null> {
  const data = await squarePost<{
    objects?: Array<{ type: string; id: string; category_data?: { name?: string } }>;
  }>("/catalog/search", {
    object_types: ["CATEGORY"],
    query: { exact_query: { attribute_name: "name", attribute_value: name } },
    limit: 10,
  });
  for (const o of data.objects || []) {
    if (o.type === "CATEGORY" && o.category_data?.name === name) return o.id;
  }
  return null;
}

async function resolveCategory(name: string, categoryMap: Map<string, string>): Promise<string | undefined> {
  if (categoryMap.has(name)) return categoryMap.get(name);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
  const idempotencyKey = `hg-rx-cat-${slug}`;
  try {
    const res = await squarePost<{ catalog_object: { id: string } }>("/catalog/object", {
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

type ManifestEntry = {
  slug: string;
  name: string;
  category: string;
  sku?: string;
  price_cents: number;
  square_item_id: string;
  square_variation_id: string;
};

async function upsertItem(row: CatalogRow, categoryId?: string): Promise<ManifestEntry> {
  const idempotencyKey = `hg-rx-item-${row.id}`;
  const itemTempId = `#${idempotencyKey}-item`;
  const varTempId = `#${idempotencyKey}-var`;

  const res = await squarePost<{
    catalog_object: {
      id: string;
      item_data?: { variations?: Array<{ id: string }> };
    };
  }>("/catalog/object", {
    idempotency_key: idempotencyKey,
    object: {
      type: "ITEM",
      id: itemTempId,
      present_at_all_locations: true,
      item_data: {
        name: row.name,
        description: row.description,
        ...(categoryId ? { category_id: categoryId } : {}),
        ...(row.sku ? { sku: row.sku } : {}),
        available_online: false,
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varTempId,
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemTempId,
              name: row.price_cents > 0 ? "Standard" : "Custom price",
              pricing_type: row.price_cents > 0 ? "FIXED_PRICING" : "VARIABLE_PRICING",
              ...(row.price_cents > 0
                ? { price_money: { amount: row.price_cents, currency: "USD" } }
                : {}),
              ...(row.sku ? { sku: row.sku } : {}),
            },
          },
        ],
      },
    },
  });

  const variationId = res.catalog_object.item_data?.variations?.[0]?.id;
  if (!variationId) throw new Error(`No variation returned for ${row.name}`);

  return {
    slug: row.id,
    name: row.name,
    category: row.category,
    sku: row.sku,
    price_cents: row.price_cents,
    square_item_id: res.catalog_object.id,
    square_variation_id: variationId,
  };
}

async function main() {
  const rows = buildCatalogRows();
  const categories = [...new Set(rows.map((r) => r.category))];

  console.log(`\n🧬 Hello Gorgeous RX™ → Square Item Library`);
  console.log(`   ${rows.length} items · ${categories.length} categories · ${ENV.replace("/v2", "")}\n`);

  if (DRY_RUN) {
    console.log("Dry run — sample rows:");
    rows.slice(0, 4).forEach((r) => {
      const price =
        r.price_cents > 0 ? `$${(r.price_cents / 100).toFixed(2)}` : "variable (set at invoice)";
      console.log(`  • ${r.name} — ${price} · ${r.category}`);
    });
    console.log(`  … and ${rows.length - 4} more`);
    console.log("\nRun: npm run import-square-hg-rx:local\n");
    return;
  }

  if (!TOKEN || TOKEN.length < 10) {
    console.error("❌ Set SQUARE_ACCESS_TOKEN (or use npm run import-square-hg-rx:local with .env.local)");
    process.exit(1);
  }

  const categoryMap = new Map<string, string>();
  console.log("📁 Categories…");
  for (const cat of categories) {
    await resolveCategory(cat, categoryMap);
    console.log(`  ✓ ${cat}`);
    await sleep(80);
  }

  console.log(`\n💊 Items (${rows.length})…\n`);
  const manifest: ManifestEntry[] = [];
  let ok = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const categoryId = categoryMap.get(row.category);
      const entry = await upsertItem(row, categoryId);
      manifest.push(entry);
      const price =
        row.price_cents > 0 ? `$${(row.price_cents / 100).toFixed(2)}` : "variable";
      console.log(`  ✓ ${row.name} — ${price}`);
      ok += 1;
      await sleep(120);
    } catch (e) {
      console.log(`  ✕ ${row.name}: ${e instanceof Error ? e.message : e}`);
      failed += 1;
    }
  }

  const manifestPath = path.join(process.cwd(), "data/square-hg-rx-catalog-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        imported_at: new Date().toISOString(),
        square_environment: (process.env.SQUARE_ENVIRONMENT || "production").toLowerCase(),
        item_count: manifest.length,
        items: manifest,
      },
      null,
      2,
    ),
  );

  console.log(`\n✅ Done: ${ok}/${rows.length} items (${failed} failed)`);
  console.log(`📄 Manifest: data/square-hg-rx-catalog-manifest.json`);
  console.log("\n📱 Invoice a client in Square:");
  console.log("   Dashboard → Invoices → Create → Add item from library");
  console.log("   Filter category: Hello Gorgeous RX™");
  console.log("   Peptide lines use VARIABLE pricing — enter protocol price per invoice.\n");

  process.exit(failed > 0 ? 1 : 0);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
