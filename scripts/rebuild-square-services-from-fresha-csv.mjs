#!/usr/bin/env node
/**
 * Rebuild Square Appointments services from a Fresha service-list CSV.
 *
 * USAGE (from repo root):
 *   node --env-file=.env.local scripts/rebuild-square-services-from-fresha-csv.mjs \
 *     --csv=/path/to/export_service_list_YYYY-MM-DD.csv --dry-run
 *
 *   node --env-file=.env.local scripts/rebuild-square-services-from-fresha-csv.mjs \
 *     --csv=/path/to/export_service_list_YYYY-MM-DD.csv --replace
 *
 * Flags:
 *   --dry-run     Parse + report only (default if no --apply / --replace)
 *   --apply       Upsert by name (create missing, update matching)
 *   --replace     Archive ALL existing APPOINTMENTS_SERVICE items, then create from CSV
 *   --csv=PATH    Fresha export CSV (required)
 *
 * Preserves non-appointment catalog (REGULAR RX/retail, CLASS_TICKET, EVENT).
 */

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const getArg = (name) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : null;
};
const has = (flag) => args.includes(flag);

const DRY_RUN = has("--dry-run") || (!has("--apply") && !has("--replace"));
const REPLACE = has("--replace");
const APPLY = has("--apply") || REPLACE;
const CSV_PATH = getArg("--csv");
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "PYYB8NKD45N8P";

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST =
  envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!CSV_PATH) {
  console.error("❌ Missing --csv=/path/to/export_service_list.csv");
  process.exit(1);
}
if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌ CSV not found: ${CSV_PATH}`);
  process.exit(1);
}
if (APPLY && (!TOKEN || TOKEN.length < 10)) {
  console.error("❌ Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

function parseCSV(text) {
  const rows = [];
  let field = "";
  let row = [];
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1 && !rows[i][0]) continue;
    const o = {};
    headers.forEach((h, j) => (o[h] = (rows[i][j] ?? "").trim()));
    out.push(o);
  }
  return out;
}

function parseDurationMinutes(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (!s) return 30;
  let total = 0;
  const h = s.match(/(\d+)\s*h/);
  const m = s.match(/(\d+)\s*m/);
  if (h) total += parseInt(h[1], 10) * 60;
  if (m) total += parseInt(m[1], 10);
  if (total > 0) return total;
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 30;
}

function parsePriceCents(raw) {
  const n = parseFloat(String(raw ?? "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

function slugKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/** Stable unique key — Fresha Service ID when present, else full name hash. */
function serviceIdemKey(svc) {
  if (svc.freshaId) return `hg-fresha-svc-${svc.freshaId}`;
  let h = 0;
  const s = svc.name;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `hg-fresha-svc-h${(h >>> 0).toString(16)}`;
}

function loadServices(csvPath) {
  const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
  const services = [];
  const skipped = [];
  for (const r of rows) {
    const name = (r["Service Name"] || "").trim();
    if (!name) {
      skipped.push({ reason: "empty name", row: r });
      continue;
    }
    const online = (r["Online Booking"] || "").trim().toLowerCase();
    // Still import Disabled into catalog; flag available_for_booking false
    services.push({
      name,
      priceCents: parsePriceCents(r["Retail Price"]),
      durationMin: parseDurationMinutes(r["Duration"]),
      description: (r["Description"] || "").trim(),
      category: (r["Category Name"] || "Uncategorized").trim() || "Uncategorized",
      freshaId: (r["Service ID"] || "").trim(),
      onlineBooking: online === "enabled" || online === "",
    });
  }
  return { services, skipped, rawCount: rows.length };
}

async function squareFetch(method, apiPath, body) {
  const res = await fetch(`${HOST}/v2${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data?.errors?.[0];
    throw new Error(err?.detail || err?.code || `HTTP ${res.status}`);
  }
  return data;
}

async function listCatalogObjects(types) {
  const all = [];
  let cursor = null;
  do {
    const body = {
      object_types: types,
      include_deleted_objects: false,
      limit: 100,
    };
    if (cursor) body.cursor = cursor;
    const data = await squareFetch("POST", "/catalog/search", body);
    all.push(...(data.objects || []));
    cursor = data.cursor || null;
  } while (cursor);
  return all;
}

async function batchUpsert(objects, idempotencyKey) {
  // Square allows up to 10k objects but keep batches small
  const BATCH = 50;
  const results = [];
  for (let i = 0; i < objects.length; i += BATCH) {
    const chunk = objects.slice(i, i + BATCH);
    const data = await squareFetch("POST", "/catalog/batch-upsert", {
      idempotency_key: `${idempotencyKey}-${i}`,
      batches: [{ objects: chunk }],
    });
    results.push(data);
    await sleep(150);
  }
  return results;
}

async function batchDelete(objectIds) {
  const BATCH = 200;
  for (let i = 0; i < objectIds.length; i += BATCH) {
    const chunk = objectIds.slice(i, i + BATCH);
    await squareFetch("POST", "/catalog/batch-delete", { object_ids: chunk });
    await sleep(200);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildItemObject({
  svc,
  categoryId,
  existingItemId,
  existingVariationId,
  existingItemVersion,
  existingVariationVersion,
}) {
  const key = slugKey(svc.freshaId || svc.name);
  const itemId = existingItemId || `#hg-svc-${key}`;
  const varId = existingVariationId || `#hg-svc-${key}-var`;
  return {
    type: "ITEM",
    id: itemId,
    ...(existingItemVersion != null ? { version: existingItemVersion } : {}),
    present_at_all_locations: true,
    item_data: {
      name: svc.name,
      description: svc.description || undefined,
      product_type: "APPOINTMENTS_SERVICE",
      ...(categoryId ? { categories: [{ id: categoryId }] } : {}),
      ...(categoryId ? { category_id: categoryId } : {}),
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          ...(existingVariationVersion != null ? { version: existingVariationVersion } : {}),
          present_at_all_locations: true,
          item_variation_data: {
            item_id: itemId,
            name: "Regular",
            pricing_type: svc.priceCents > 0 ? "FIXED_PRICING" : "VARIABLE_PRICING",
            ...(svc.priceCents > 0
              ? { price_money: { amount: svc.priceCents, currency: "USD" } }
              : {}),
            service_duration: svc.durationMin * 60_000,
            available_for_booking: svc.onlineBooking,
          },
        },
      ],
    },
  };
}

async function main() {
  const abs = path.resolve(CSV_PATH);
  const { services, skipped, rawCount } = loadServices(abs);
  const categories = [...new Set(services.map((s) => s.category))];

  console.log("═══════════════════════════════════════════════════");
  console.log(" Square Appointments rebuild from Fresha CSV");
  console.log("═══════════════════════════════════════════════════");
  console.log(` CSV:        ${abs}`);
  console.log(` Env:        ${envName} @ ${HOST}`);
  console.log(` Location:   ${LOCATION_ID}`);
  console.log(` Mode:       ${DRY_RUN ? "DRY-RUN" : REPLACE ? "REPLACE" : "APPLY/upsert"}`);
  console.log(` Rows:       ${rawCount} → ${services.length} services (${skipped.length} skipped)`);
  console.log(` Categories: ${categories.length}`);
  console.log("");

  if (DRY_RUN) {
    const byCat = {};
    for (const s of services) byCat[s.category] = (byCat[s.category] || 0) + 1;
    console.log("Categories:");
    for (const [k, v] of Object.entries(byCat).sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`  ${k}: ${v}`);
    }
    console.log("\nSample:");
    for (const s of services.slice(0, 8)) {
      console.log(
        `  • ${s.name} — $${(s.priceCents / 100).toFixed(2)} · ${s.durationMin}m · book=${s.onlineBooking}`,
      );
    }
    console.log("\nRe-run with --replace (full wipe of APPOINTMENTS_SERVICE) or --apply (upsert).");
    return;
  }

  // Load existing catalog
  console.log("📥 Loading existing Square catalog…");
  const objects = await listCatalogObjects(["ITEM", "CATEGORY", "ITEM_VARIATION"]);
  const existingCats = objects.filter((o) => o.type === "CATEGORY" && !o.is_deleted);
  const existingItems = objects.filter(
    (o) =>
      o.type === "ITEM" &&
      !o.is_deleted &&
      o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  console.log(`   Categories: ${existingCats.length}`);
  console.log(`   Appointment services: ${existingItems.length}`);

  if (REPLACE && existingItems.length) {
    console.log(`\n🗑  Archiving ${existingItems.length} existing appointment services…`);
    const ids = existingItems.map((o) => o.id);
    // Also delete variations hanging off them (batch-delete cascades for many objects)
    const varIds = [];
    for (const item of existingItems) {
      for (const v of item.item_data?.variations || []) {
        if (v.id) varIds.push(v.id);
      }
    }
    await batchDelete([...ids, ...varIds]);
    console.log("   Done.");
  }

  // Resolve / create categories
  const catByName = new Map();
  for (const c of existingCats) {
    const name = c.category_data?.name;
    if (name) catByName.set(name.toLowerCase(), c.id);
  }

  console.log(`\n📁 Ensuring ${categories.length} categories…`);
  const categoryMap = {};
  for (const cat of categories) {
    const existing = catByName.get(cat.toLowerCase());
    if (existing && !REPLACE) {
      categoryMap[cat] = existing;
      console.log(`  ↺ ${cat}`);
      continue;
    }
    // After replace we still re-use same category objects by name when present
    if (existing) {
      categoryMap[cat] = existing;
      console.log(`  ↺ ${cat}`);
      continue;
    }
    const idem = `hg-fresha-cat-${slugKey(cat)}-${Date.now()}`;
    const data = await squareFetch("POST", "/catalog/object", {
      idempotency_key: idem,
      object: {
        type: "CATEGORY",
        id: `#${idem}`,
        present_at_all_locations: true,
        category_data: { name: cat },
      },
    });
    categoryMap[cat] = data.catalog_object.id;
    catByName.set(cat.toLowerCase(), data.catalog_object.id);
    console.log(`  ✓ ${cat}`);
    await sleep(80);
  }

  // Map existing services by normalized name (for upsert)
  const itemByName = new Map();
  if (!REPLACE) {
    // re-fetch if we didn't delete
    const fresh = await listCatalogObjects(["ITEM"]);
    for (const o of fresh) {
      if (o.item_data?.product_type !== "APPOINTMENTS_SERVICE") continue;
      const n = (o.item_data?.name || "").trim().toLowerCase();
      if (n) itemByName.set(n, o);
    }
  }

  console.log(`\n💆 Upserting ${services.length} services…`);
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const svc of services) {
    try {
      const existing = itemByName.get(svc.name.toLowerCase());
      const existingVar =
        existing?.item_data?.variations?.find((v) => !v.is_deleted) ||
        existing?.item_data?.variations?.[0];
      const object = buildItemObject({
        svc,
        categoryId: categoryMap[svc.category],
        existingItemId: existing?.id,
        existingVariationId: existingVar?.id,
        existingItemVersion: existing?.version,
        existingVariationVersion: existingVar?.version,
      });
      const idem = `${serviceIdemKey(svc)}-${existing ? "upd" : "new"}-v3-${Date.now()}`;
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: idem.slice(0, 128),
        object,
      });
      if (existing) {
        updated++;
        console.log(`  ↺ ${svc.name}`);
      } else {
        created++;
        console.log(
          `  ✓ ${svc.name} — $${(svc.priceCents / 100).toFixed(2)} · ${svc.durationMin}m`,
        );
      }
      await sleep(100);
    } catch (e) {
      failed++;
      console.log(`  ✕ ${svc.name}: ${e.message}`);
    }
  }

  console.log("\n✅ Services rebuild complete");
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Failed:  ${failed}`);
  console.log("\nNext: Square Dashboard → Appointments → confirm Online Booking + staff.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
