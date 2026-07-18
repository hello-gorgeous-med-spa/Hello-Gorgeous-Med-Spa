#!/usr/bin/env node
/**
 * Set CatalogItem.label_color from the service's CURRENT category
 * (does not move categories). Calendar Color remains Dashboard-only.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-fix-pos-label-colors.mjs
 *   node --env-file=.env.local scripts/square-fix-pos-label-colors.mjs --apply
 */

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

const CATEGORY_META = {
  "Vitamin Injections": "E6007E",
  "Weight Loss Injections": "DC2626",
  FlowWave: "7C3AED",
  Botox: "14B8A6",
  "Dermal Fillers": "F97316",
  "Skin Spa": "FB7185",
  "Body Contouring & Devices": "EA580C",
  "Laser Hair Removal": "0EA5E9",
  "Lash Spa": "A78BFA",
  "Brow Spa": "A16207",
  "Bioidentical Hormone Therapy (BHRT)": "D4AF37",
  "IV Drip Package Deals": "2563EB",
  "PRP Injections": "9F1239",
  "AnteAGE Skin Regeneration": "10B981",
  "Trigger Point Injections": "64748B",
  "Medical Consultations": "111827",
  "Exclusive Model Specials": "FF2D8E",
  "GlowTox Facial": "EC4899",
};

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function listCatalog(type) {
  const out = [];
  let cursor;
  do {
    const url = new URL(`${HOST}/v2/catalog/list`);
    url.searchParams.set("types", type);
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(json));
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

async function main() {
  console.log(`\n🏷  Fix POS label_color by current category (${APPLY ? "APPLY" : "DRY-RUN"})\n`);

  const cats = (await listCatalog("CATEGORY")).filter((c) => !c.is_deleted);
  const catById = new Map(cats.map((c) => [c.id, c.category_data?.name]));
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  const todos = [];
  for (const item of items) {
    const cid = item.item_data.categories?.[0]?.id || item.item_data.category_id;
    const catName = catById.get(cid);
    const want = catName ? CATEGORY_META[catName] : null;
    if (!want) continue;
    const got = (item.item_data.label_color || "").toUpperCase();
    if (got === want.toUpperCase()) continue;
    todos.push({ item, catName, want });
  }

  console.log(`Need update: ${todos.length}`);
  todos.slice(0, 30).forEach((t) =>
    console.log(`  • ${t.item.item_data.name.slice(0, 55)} → ${t.catName} #${t.want}`),
  );
  if (todos.length > 30) console.log(`  … +${todos.length - 30} more`);

  if (!APPLY) {
    console.log("\nRe-run with --apply\n");
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const t of todos) {
    try {
      const obj = structuredClone(t.item);
      obj.item_data.label_color = t.want;
      delete obj.item_data.reporting_category;
      const res = await fetch(`${HOST}/v2/catalog/object`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Square-Version": SQUARE_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: `hg-label-${t.item.id.slice(-10)}-${Date.now().toString(36).slice(-5)}`,
          object: obj,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.errors?.[0]?.detail || res.status);
      ok++;
      await new Promise((r) => setTimeout(r, 120));
    } catch (e) {
      fail++;
      console.log("  ✕", t.item.item_data.name, e.message);
    }
  }
  console.log(`\nDone. Updated ${ok}, failed ${fail}.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
