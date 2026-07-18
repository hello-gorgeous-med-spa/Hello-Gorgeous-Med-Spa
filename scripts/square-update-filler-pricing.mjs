#!/usr/bin/env node
/**
 * Update Square Appointments filler pricing:
 *   Half syringe / 0.5ml $300 · Full syringe / 1ml $599 · 2 syringes $1,098 (save $100)
 *
 *   node --env-file=.env.local scripts/square-update-filler-pricing.mjs --dry-run
 *   node --env-file=.env.local scripts/square-update-filler-pricing.mjs --apply
 */

const DRY_RUN = process.argv.includes("--dry-run") || !process.argv.includes("--apply");
const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function square(method, path, body) {
  const res = await fetch(`${HOST}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`${method} ${path}: ${JSON.stringify(json.errors || json)}`);
  }
  return json;
}

async function listAppointmentItems() {
  const objects = [];
  let cursor;
  do {
    const q = new URLSearchParams({ types: "ITEM", limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await square("GET", `/v2/catalog/list?${q}`);
    for (const obj of page.objects || []) {
      if (obj.type !== "ITEM" || obj.is_deleted) continue;
      if (obj.item_data?.product_type && obj.item_data.product_type !== "APPOINTMENTS_SERVICE") continue;
      objects.push(obj);
    }
    cursor = page.cursor;
  } while (cursor);
  return objects;
}

function priceForName(name) {
  const n = name.trim();
  if (/0\.5\s*ml|half\s*syringe|½\s*syringe|1\/2\s*syringe/i.test(n)) {
    return { priceCents: 30000, label: "half / 0.5ml → $300" };
  }
  if (/2\s*syringe|two\s*syringe|buy\s*2/i.test(n)) {
    return { priceCents: 109800, label: "2 syringes → $1,098" };
  }
  if (/filler|juvederm|restylane|revanesse|\brha\b|1\s*ml/i.test(n)) {
    return { priceCents: 59900, label: "full syringe → $599" };
  }
  return null;
}

function isFillerCandidate(name) {
  return /filler|juvederm|restylane|revanesse|\brha\b|half\s*syringe|0\.5\s*ml/i.test(name);
}

async function findCategoryId(nameWanted) {
  let cursor;
  do {
    const q = new URLSearchParams({ types: "CATEGORY", limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await square("GET", `/v2/catalog/list?${q}`);
    for (const obj of page.objects || []) {
      if (obj.category_data?.name?.toLowerCase() === nameWanted.toLowerCase()) return obj.id;
    }
    cursor = page.cursor;
  } while (cursor);
  return null;
}

async function upsertTwoSyringe(categoryId) {
  const name = "Filler — 2 Syringes (Save $100)";
  const items = await listAppointmentItems();
  const existing = items.find((o) => /2\s*syringe/i.test(o.item_data?.name || ""));
  if (existing) {
    console.log(`2-syringe already exists: ${existing.item_data?.name}`);
    return existing;
  }

  const body = {
    idempotency_key: `filler-2-syringe-${Date.now()}`,
    object: {
      type: "ITEM",
      id: "#filler-2-syringe",
      item_data: {
        name,
        description:
          "Two syringes of premium HA filler — buy 2, save $100. $1,098 total (vs $1,198). Lips or dermal areas. Free consult · Hello Gorgeous Med Spa Oswego.",
        product_type: "APPOINTMENTS_SERVICE",
        categories: categoryId ? [{ id: categoryId }] : undefined,
        variations: [
          {
            type: "ITEM_VARIATION",
            id: "#filler-2-syringe-var",
            item_variation_data: {
              name: "Regular",
              pricing_type: "FIXED_PRICING",
              price_money: { amount: 109800, currency: "USD" },
              service_duration: 60 * 60 * 1000,
              available_for_booking: true,
            },
          },
        ],
      },
    },
  };

  if (DRY_RUN) {
    console.log(`Would CREATE: ${name} @ $1,098`);
    return null;
  }

  const res = await square("POST", "/v2/catalog/object", body);
  console.log(`✓ CREATED ${res.catalog_object?.item_data?.name} @ $1,098`);
  return res.catalog_object;
}

async function main() {
  console.log(`Square env: ${envName} · ${DRY_RUN ? "DRY RUN" : "APPLY"}`);
  const items = await listAppointmentItems();
  const candidates = items.filter((o) => isFillerCandidate(o.item_data?.name || ""));
  console.log(`Found ${candidates.length} filler-related appointment items:`);
  for (const o of candidates) {
    const cents = o.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount;
    console.log(`  · ${o.item_data?.name} @ $${(cents ?? 0) / 100}`);
  }

  const updates = [];
  for (const item of candidates) {
    const name = item.item_data?.name || "";
    const rule = priceForName(name);
    if (!rule) {
      console.log(`  SKIP (no rule): ${name}`);
      continue;
    }
    for (const v of item.item_data?.variations || []) {
      const cur = v.item_variation_data?.price_money?.amount ?? null;
      if (cur === rule.priceCents) {
        console.log(`  OK $${rule.priceCents / 100}: ${name}`);
        continue;
      }
      updates.push({ item, variation: v, rule, from: cur });
      console.log(`  UPDATE ${name} · $${(cur ?? 0) / 100} → $${rule.priceCents / 100} (${rule.label})`);
    }
  }

  const categoryId = await findCategoryId("Fillers");
  console.log(`Fillers category: ${categoryId || "(not found — will create without category)"}`);

  if (DRY_RUN) {
    await upsertTwoSyringe(categoryId);
    console.log(`\nDry run — ${updates.length} price update(s) pending. Re-run with --apply.`);
    return;
  }

  for (const { item, variation, rule } of updates) {
    const retrieved = await square("GET", `/v2/catalog/object/${item.id}`);
    const fresh = retrieved.object;
    const vars = fresh.item_data?.variations || [];
    const target = vars.find((v) => v.id === variation.id) || vars[0];
    if (!target?.item_variation_data) continue;
    target.item_variation_data.price_money = { amount: rule.priceCents, currency: "USD" };
    target.item_variation_data.pricing_type = "FIXED_PRICING";
    await square("POST", "/v2/catalog/object", {
      idempotency_key: `filler-price-${target.id}-${rule.priceCents}-${Date.now()}`,
      object: fresh,
    });
    console.log(`  ✓ ${fresh.item_data?.name} → $${rule.priceCents / 100}`);
  }

  await upsertTwoSyringe(categoryId);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
