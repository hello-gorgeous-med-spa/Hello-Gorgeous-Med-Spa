#!/usr/bin/env node
/**
 * Square Appointments — Xeomin (Merz), $12/unit, Ryan only.
 *
 *   node --env-file=.env.local scripts/square-upsert-xeomin.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-xeomin.mjs --apply
 */

import crypto from "node:crypto";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const RYAN = "TM1IptWCrgxkY4p7";
const CATEGORY_NAME = "Botox";
const LABEL_COLOR = "14B8A6";

const SERVICE = {
  name: "Xeomin — $12/unit",
  price: 12,
  durationMin: 30,
  aliases: ["Xeomin", "Xeomin (per unit)", "Xeomin — per unit"],
  description:
    "Xeomin (incobotulinumtoxinA) by Merz Aesthetics — purified neurotoxin, $12/unit. Units mapped at visit with Ryan Kent, FNP-BC. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
};

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;

async function square(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
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

async function listCatalog(type) {
  const out = [];
  let cursor;
  do {
    const qs = new URLSearchParams({ types: type });
    if (cursor) qs.set("cursor", cursor);
    const json = await square(`/v2/catalog/list?${qs}`);
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function findExisting(items) {
  const names = new Set([SERVICE.name, ...SERVICE.aliases].map((n) => n.toLowerCase()));
  return items.find((o) => names.has((o.item_data?.name || "").trim().toLowerCase()));
}

async function main() {
  console.log(`\nXeomin ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const category = categories.find((c) => (c.category_data?.name || "") === CATEGORY_NAME);
  if (!category) throw new Error(`Missing Square category: ${CATEGORY_NAME}`);

  const existing = findExisting(items.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE"));
  const itemId = existing?.id || "#hg-xeomin";
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || "#hg-xeomin-var";

  const object = {
    type: "ITEM",
    id: itemId,
    present_at_all_locations: true,
    ...(existing?.version != null ? { version: existing.version } : {}),
    item_data: {
      name: SERVICE.name,
      description: SERVICE.description,
      product_type: "APPOINTMENTS_SERVICE",
      label_color: LABEL_COLOR,
      category_id: category.id,
      categories: [{ id: category.id }],
      ecom_available: true,
      ecom_visibility: "VISIBLE",
      is_taxable: true,
      is_archived: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          present_at_all_locations: true,
          ...(existingVar?.version != null ? { version: existingVar.version } : {}),
          item_variation_data: {
            item_id: itemId,
            name: existingVar?.item_variation_data?.name || "Per unit",
            pricing_type: "FIXED_PRICING",
            price_money: USD(SERVICE.price),
            service_duration: MIN(SERVICE.durationMin),
            available_for_booking: true,
            sellable: true,
            team_member_ids: [RYAN],
          },
        },
      ],
    },
  };

  console.log(`${existing ? "update" : "create"}: ${SERVICE.name} — $${SERVICE.price} / ${SERVICE.durationMin} min`);

  if (DRY_RUN) {
    console.log("\nRe-run with --apply to write to Square.\n");
    return;
  }

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-xeomin-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });

  const saved = res.catalog_object;
  const variation = saved?.item_data?.variations?.[0];
  console.log(`\n✓ ${saved?.item_data?.name}`);
  console.log(`  item: ${saved?.id}`);
  console.log(`  variation: ${variation?.id}`);
  console.log(
    `  book: https://book.squareup.com/appointments/pf2o75yphk7vw6/location/L3QDRS4DX9ZE4/services/${variation?.id}\n`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
