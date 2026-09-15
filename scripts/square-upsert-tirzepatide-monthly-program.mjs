#!/usr/bin/env node
/**
 * Square — tirzepatide monthly program (4-week fills by milligram).
 *
 * Creates / updates the four bookable SKUs, archives every live tirzepatide
 * appointment that still sells $349 / $299-flat / $600, and sets the RX shop
 * “from” price to $299 so the online store matches the desk card.
 *
 *   node --env-file=.env.local scripts/square-upsert-tirzepatide-monthly-program.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-tirzepatide-monthly-program.mjs --apply
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

/** Danielle (owner) + Michelle — Ryan is not assigned on new GLP-1 SKUs. */
const STAFF = ["TMqnS9cNU-3s3lUR", "TMqy8tRlmyMRkQ25"];
const CATEGORY_NAME = "Weight Loss Injections";
const LABEL_COLOR = "DC2626";

const SKUS = [
  {
    key: "starter",
    name: "Tirzepatide Program — 2.5 mg (4 weeks)",
    aliases: [],
    priceUsd: 299,
    durationMin: 30,
    description:
      "Tirzepatide program — 2.5 mg weekly for 4 weeks (one month). Medication included. Consult required. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "standard",
    name: "Tirzepatide Program — 5–7.5 mg (4 weeks)",
    aliases: ["Tirzepatide Program — 5-7.5 mg (4 weeks)"],
    priceUsd: 399,
    durationMin: 15,
    description:
      "Tirzepatide program — 5 mg or 7.5 mg weekly for 4 weeks (one month). Same price for either dose. Medication included. Consult required. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "high",
    name: "Tirzepatide Program — 10 mg (4 weeks)",
    aliases: [],
    priceUsd: 450,
    durationMin: 15,
    description:
      "Tirzepatide program — 10 mg weekly for 4 weeks (one month). Medication included. Only when the clinician steps the dose up. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "max",
    name: "Tirzepatide Program — 12.5 mg (4 weeks)",
    aliases: [],
    priceUsd: 499,
    durationMin: 15,
    description:
      "Tirzepatide program — 12.5 mg weekly for 4 weeks (one month). Clinic max dose. Medication included. Consult required. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
];

const RETIRE_EXACT = new Set(
  [
    "4-Week Tirzepatide Program",
    "Tirzepatide — Initial Consult + First Injection",
    "Tirzepatide — Monthly Maintenance",
    "Tirzepitide 10 week program",
  ].map((n) => n.toLowerCase()),
);

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    throw new Error(err?.detail || err?.code || JSON.stringify(data.errors || data) || `HTTP ${res.status}`);
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
  return out.filter((o) => !o.is_deleted);
}

function findByNames(items, names) {
  const set = new Set(names.map((n) => n.toLowerCase()));
  return items.find((o) => set.has((o.item_data?.name || "").trim().toLowerCase()));
}

async function upsert(object, keyPrefix) {
  return square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `${keyPrefix}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
}

async function archiveItem(item) {
  const name = item.item_data?.name ?? item.id;
  const already = !!item.item_data?.is_archived &&
    (item.item_data?.variations || []).every((v) => v.item_variation_data?.available_for_booking === false);
  console.log(`  ARCHIVE  ${name}${already ? " (already)" : ""}`);
  if (DRY_RUN || already) return;
  const object = structuredClone(item);
  object.item_data = {
    ...object.item_data,
    is_archived: true,
    ecom_available: false,
    ecom_visibility: "UNINDEXED",
  };
  for (const v of object.item_data.variations || []) {
    v.item_variation_data = {
      ...v.item_variation_data,
      available_for_booking: false,
      sellable: false,
    };
  }
  await upsert(object, "hg-tirz-retire");
  await sleep(220);
}

async function upsertSku(items, categoryId, sku) {
  const existing = findByNames(items, [sku.name, ...sku.aliases]);
  const itemId = existing?.id || `#hg-tirz-${sku.key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#hg-tirz-${sku.key}-var`;

  console.log(
    `  ${existing ? "UPDATE" : "CREATE"}  ${sku.name}  $${sku.priceUsd}  ${sku.durationMin}min`,
  );

  const object = {
    type: "ITEM",
    id: itemId,
    present_at_all_locations: true,
    ...(existing?.version != null ? { version: existing.version } : {}),
    item_data: {
      name: sku.name,
      description: sku.description,
      product_type: "APPOINTMENTS_SERVICE",
      label_color: LABEL_COLOR,
      category_id: categoryId,
      categories: [{ id: categoryId }],
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
            name: existingVar?.item_variation_data?.name || "4-week fill",
            pricing_type: "FIXED_PRICING",
            price_money: USD(sku.priceUsd),
            service_duration: MIN(sku.durationMin),
            available_for_booking: true,
            sellable: true,
            team_member_ids: [...STAFF],
          },
        },
      ],
    },
  };

  if (DRY_RUN) return;
  const res = await upsert(object, `hg-tirz-${sku.key}`);
  const saved = res.catalog_object;
  const variation = saved?.item_data?.variations?.[0];
  console.log(`    item=${saved?.id}  var=${variation?.id}`);
  await sleep(220);
}

async function patchConsult(items) {
  const item = items.find((o) => (o.item_data?.name || "") === "Weight Loss Consultation");
  if (!item) {
    console.log("  SKIP  Weight Loss Consultation not found");
    return;
  }
  const desc =
    "Complimentary medical weight-loss consult at Hello Gorgeous Med Spa, Oswego. Review history, goals, and tirzepatide monthly pricing (2.5 mg $299 · 5–7.5 mg $399 · 10 mg $450 · 12.5 mg $499). Clinician decides dose. Compounded tirzepatide is not FDA-approved. Results vary.";
  console.log("  UPDATE  Weight Loss Consultation (copy + Danielle/Michelle)");
  if (DRY_RUN) return;
  const object = structuredClone(item);
  object.item_data.description = desc;
  object.item_data.is_archived = false;
  object.item_data.ecom_visibility = "VISIBLE";
  for (const v of object.item_data.variations || []) {
    v.item_variation_data = {
      ...v.item_variation_data,
      available_for_booking: true,
      sellable: true,
      team_member_ids: [...STAFF],
    };
  }
  await upsert(object, "hg-tirz-consult");
  await sleep(220);
}

async function patchRxFromPrice(items) {
  const item = items.find((o) => (o.item_data?.name || "") === "Hello Gorgeous RX™ — Tirzepatide");
  if (!item) {
    console.log("  SKIP  Hello Gorgeous RX™ — Tirzepatide not found");
    return;
  }
  const v = item.item_data?.variations?.[0];
  const current = v?.item_variation_data?.price_money?.amount;
  console.log(`  UPDATE  Hello Gorgeous RX™ — Tirzepatide  $${(current || 0) / 100} → $299`);
  if (DRY_RUN) return;
  const object = structuredClone(item);
  object.item_data.description =
    "Medically supervised tirzepatide. Published from $299/mo for 2.5 mg weekly (4-week fill). 5–7.5 mg $399 · 10 mg $450 · 12.5 mg $499. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous RX™. Requires clinician evaluation. Not billed to insurance.";
  for (const variation of object.item_data.variations || []) {
    variation.item_variation_data = {
      ...variation.item_variation_data,
      pricing_type: "FIXED_PRICING",
      price_money: USD(299),
    };
  }
  await upsert(object, "hg-tirz-rx-from");
  await sleep(220);
}

async function main() {
  console.log(`\nTirzepatide monthly program  ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const category = categories.find((c) => (c.category_data?.name || "") === CATEGORY_NAME);
  if (!category) throw new Error(`Missing Square category: ${CATEGORY_NAME}`);

  console.log("1) Archive retired bookable SKUs");
  const toRetire = items.filter((o) => RETIRE_EXACT.has((o.item_data?.name || "").trim().toLowerCase()));
  if (!toRetire.length) console.log("  (none found)");
  for (const item of toRetire) await archiveItem(item);

  console.log("\n2) Upsert four monthly program SKUs");
  for (const sku of SKUS) await upsertSku(items, category.id, sku);

  console.log("\n3) Align consult + RX shop from-price");
  await patchConsult(items);
  await patchRxFromPrice(items);

  console.log("\n4) Contradiction scan (live bookable tirzepatide)");
  const fresh = DRY_RUN ? items : await listCatalog("ITEM");
  const allowed = new Set(SKUS.map((s) => s.name.toLowerCase()));
  allowed.add("weight loss consultation");
  const leftover = fresh.filter((o) => {
    if (o.item_data?.is_archived) return false;
    if (o.item_data?.product_type !== "APPOINTMENTS_SERVICE") return false;
    const n = (o.item_data?.name || "").toLowerCase();
    if (!/tirzepatide|tirzepitide/.test(n)) return false;
    const book = o.item_data?.variations?.some((v) => v.item_variation_data?.available_for_booking);
    return book && !allowed.has(n);
  });
  if (leftover.length) {
    for (const o of leftover) {
      const v = o.item_data.variations[0]?.item_variation_data || {};
      const p = v.price_money?.amount != null ? `$${(v.price_money.amount / 100).toFixed(0)}` : v.pricing_type;
      console.log(`  STILL LIVE  ${p}  ${o.item_data.name}`);
    }
  } else {
    console.log("  none — booking menu is the 4 bands + consult");
  }

  if (DRY_RUN) console.log("\nRe-run with --apply to write to Square.\n");
  else console.log("\nDone. Square booking now uses the four-band tirzepatide program.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
