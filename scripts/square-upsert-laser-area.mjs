#!/usr/bin/env node
/**
 * One Square laser booking: pick Small $79 / Medium $99 / Large $129.
 * Danielle + Ryan. Old per-area SKUs are deleted.
 *
 *   node --env-file=.env.local scripts/square-upsert-laser-area.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-laser-area.mjs --apply
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

const DANIELLE = "TMqnS9cNU-3s3lUR";
const RYAN = "TM1IptWCrgxkY4p7";
const STAFF = [DANIELLE, RYAN];
const CATEGORY_NAME = "Laser Hair Removal";
const LABEL_COLOR = "0EA5E9";

const SERVICE = {
  name: "Laser Hair Removal — Pick Your Area",
  aliases: ["Laser Hair Removal", "Laser — Pick Your Area"],
  description: [
    "Book by area size. Zemits DuoCratus. Danielle or Ryan.",
    "",
    "Small $79 — chin, upper lip, or a small face spot. About 20 minutes.",
    "Medium $99 — underarms, bikini, upper legs, or lower legs. About 30 minutes.",
    "Large $129 — Brazilian, back, or full legs. About 45 minutes.",
    "",
    "Most areas need a series. How much hair stays gone varies. Illinois only. Not an emergency visit.",
    "",
    "Policies: hellogorgeousmedspa.com/service-policy · hellogorgeousmedspa.com/cancellation-policy — 24-hour cancel (48 hours for CO₂ / Morpheus8). Late cancel $50 or 50%. No-show $100 or 100%.",
  ].join("\n"),
};

const SIZES = [
  { key: "small", name: "Small area", price: 79, durationMin: 20 },
  { key: "medium", name: "Medium area", price: 99, durationMin: 30 },
  { key: "large", name: "Large area", price: 129, durationMin: 45 },
];

const KEEP = [/^laser hair removal — pick your area$/i, /^laser hair removal consultation/i];

const DELETE = [
  /^laser hair removal — /i,
  /^laser hair removal - /i,
  /^laser brazilian/i,
  /3-month package/i,
  /^professional brazilian laser/i,
];

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;

async function square(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${pathname}: ${JSON.stringify(data.errors || data).slice(0, 800)}`);
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

function findByName(objects, name, field) {
  const n = name.toLowerCase();
  return objects.find((o) => (o[field]?.name || "").trim().toLowerCase() === n);
}

function isLaserHair(name) {
  const n = String(name || "").toLowerCase();
  if (/ipl|photofacial|solaria|morpheus|quantum|carbon laser/.test(n)) return false;
  return /laser hair|brazilian laser|duocratus/.test(n);
}

async function main() {
  console.log(`\nLaser hair — pick your area ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [items, categories] = await Promise.all([listCatalog("ITEM"), listCatalog("CATEGORY")]);
  const category = findByName(categories, CATEGORY_NAME, "category_data");
  if (!category) throw new Error(`Missing Square category: ${CATEGORY_NAME}`);

  const appt = items.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  const names = new Set([SERVICE.name, ...SERVICE.aliases].map((n) => n.toLowerCase()));
  const existing = appt.find((o) => names.has((o.item_data?.name || "").trim().toLowerCase()));
  const itemId = existing?.id || "#hg-lhr-area";
  const existingVars = existing?.item_data?.variations || [];

  const variations = SIZES.map((size) => {
    const prev = existingVars.find((v) =>
      (v.item_variation_data?.name || "").toLowerCase().includes(size.key),
    );
    return {
      type: "ITEM_VARIATION",
      id: prev?.id || `#hg-lhr-${size.key}`,
      present_at_all_locations: true,
      ...(prev?.version != null ? { version: prev.version } : {}),
      item_variation_data: {
        item_id: itemId,
        name: size.name,
        pricing_type: "FIXED_PRICING",
        price_money: USD(size.price),
        service_duration: MIN(size.durationMin),
        available_for_booking: true,
        sellable: true,
        team_member_ids: STAFF,
      },
    };
  });

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
      variations,
    },
  };

  console.log(`${existing ? "update" : "create"}: ${SERVICE.name}`);
  for (const s of SIZES) console.log(`  • ${s.name} $${s.price} / ${s.durationMin} min`);
  console.log("staff: Danielle + Ryan");

  if (!DRY_RUN) {
    const res = await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-lhr-area-${crypto.randomBytes(4).toString("hex")}`,
        object,
      },
    });
    const saved = res.catalog_object;
    console.log(`  ✓ item ${saved?.id}`);
    for (const v of saved?.item_data?.variations || []) {
      const cents = v.item_variation_data?.price_money?.amount;
      console.log(
        `  ✓ ${v.item_variation_data?.name} ${v.id} $${cents != null ? cents / 100 : "?"}`,
      );
      console.log(
        `    book: https://book.squareup.com/appointments/pf2o75yphk7vw6/location/L3QDRS4DX9ZE4/services/${v.id}`,
      );
    }
  }

  const doomed = appt.filter((o) => {
    const name = o.item_data?.name || "";
    if (!isLaserHair(name)) return false;
    if (KEEP.some((re) => re.test(name))) return false;
    return DELETE.some((re) => re.test(name));
  });

  console.log(`\nDelete old laser SKUs (${doomed.length}):`);
  for (const o of doomed) console.log(`  - ${o.item_data?.name}`);
  if (!DRY_RUN && doomed.length) {
    await square("/v2/catalog/batch-delete", {
      method: "POST",
      body: { object_ids: doomed.map((o) => o.id) },
    });
    console.log("  ✓ deleted");
  }

  if (DRY_RUN) console.log("\nRe-run with --apply to write to Square.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
