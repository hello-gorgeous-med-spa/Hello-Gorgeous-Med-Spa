#!/usr/bin/env node
/**
 * Square Appointments — Lunch Time Wellness vitamin shots from the $20 flyer.
 * Does not reprice the $25 Vitamin Injections menu.
 *
 *   node --env-file=.env.local scripts/square-upsert-lunch-wellness-shots.mjs
 *   node --env-file=.env.local scripts/square-upsert-lunch-wellness-shots.mjs --apply
 */

import crypto from "node:crypto";

const APPLY = process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";
const BOOKING_SITE = "pf2o75yphk7vw6";

/** Danielle and Kristina only. Angelene and Alexandria stay off this menu for now. */
const TEAM = [
  "TMqnS9cNU-3s3lUR", // Danielle
  "TMHO9ZpVf-A62bgD", // Kristina
];

const CATEGORY_NAME = "Lunch Time Wellness";
const CATEGORY_ORDINAL = 14;
const LABEL_COLOR = "FF1493";
const CHANNELS = [
  "CH_dyZoNlKiODbKbbkck77Qg2mcKEn9t9NNtqZ58UR29945o",
  "CH_weIWklklJtWFDV1DY0mEg2mcKEn9t9NNtqZ58UR29945o",
];

const FOOTER = [
  "",
  "$20 · 15 minutes · intramuscular · in clinic only.",
  "Administered by healthcare professionals only. Not self-administered.",
  "Shot window Mon–Fri 11am–6pm · Sat 10am–3pm.",
  "Hello Gorgeous Med Spa · 74 W. Washington St, Oswego · (630) 636-6193",
  "Results vary. A booking holds the visit. Screening happens at check-in.",
].join("\n");

const SHOTS = [
  {
    key: "b12-energy",
    ordinal: 0,
    name: "B12 Energy Shot",
    description: ["B12 Energy Shot — methylcobalamin.", "The lunch-menu energy shot. $20.", FOOTER].join("\n"),
  },
  {
    key: "lipo-skinny",
    ordinal: 1,
    name: "Lipo Skinny Shot",
    description: ["Lipo Skinny Shot — MICC + B12.", "The lunch-menu lipotropic shot. $20.", FOOTER].join("\n"),
  },
  {
    key: "glow-glutathione",
    ordinal: 2,
    name: "Glow Glutathione",
    description: ["Glow Glutathione — glutathione.", "The lunch-menu glow shot. $20.", FOOTER].join("\n"),
  },
  {
    key: "tri-immune",
    ordinal: 3,
    name: "Tri-Immune Boost",
    description: ["Tri-Immune Boost — vitamin C, glutathione, and zinc.", "The lunch-menu immunity shot. $20.", FOOTER].join("\n"),
  },
  {
    key: "biotin-beauty",
    ordinal: 4,
    name: "Biotin Beauty",
    description: ["Biotin Beauty — biotin + B-complex.", "Hair, skin, and nails. $20.", FOOTER].join("\n"),
  },
  {
    key: "d3-sunshine",
    ordinal: 5,
    name: "D3 Sunshine",
    description: ["D3 Sunshine — vitamin D3.", "The lunch-menu sunshine shot. $20.", FOOTER].join("\n"),
  },
];

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

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
    throw new Error(err?.detail || err?.code || JSON.stringify(data) || `HTTP ${res.status}`);
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

async function ensureCategory(categories) {
  const found = categories.find((c) => (c.category_data?.name || "") === CATEGORY_NAME);
  const categoryData = {
    name: CATEGORY_NAME,
    category_type: "REGULAR_CATEGORY",
    ordinal: CATEGORY_ORDINAL,
    online_visibility: true,
    is_top_level: true,
    channels: CHANNELS,
    ecom_seo_data: {
      page_title: "Lunch Time Wellness | Vitamin Shots | Hello Gorgeous",
      page_description: "Six $20 vitamin shots. 15-minute visit. In clinic at Hello Gorgeous Med Spa, Oswego.",
      permalink: "lunch-time-wellness",
    },
  };

  if (found) {
    console.log(`Category exists: ${found.id}  ${CATEGORY_NAME}`);
    if (!APPLY) return found.id;
    const res = await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-lunch-cat-${crypto.randomBytes(4).toString("hex")}`,
        object: {
          type: "CATEGORY",
          id: found.id,
          version: found.version,
          present_at_all_locations: true,
          category_data: { ...found.category_data, ...categoryData },
        },
      },
    });
    console.log(`  updated category ${res.catalog_object?.id}`);
    return res.catalog_object?.id || found.id;
  }

  console.log(APPLY ? "CREATE category" : "Would create category", CATEGORY_NAME);
  if (!APPLY) return "#pending-lunch-cat";

  const data = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-lunch-cat-new-${crypto.randomBytes(4).toString("hex")}`,
      object: {
        type: "CATEGORY",
        id: "#lunch-time-wellness-cat",
        present_at_all_locations: true,
        category_data: categoryData,
      },
    },
  });
  const id = data.catalog_object?.id;
  console.log(`  category ${id}`);
  return id;
}

function findExisting(items, name) {
  return items.find((o) => (o.item_data?.name || "").trim().toLowerCase() === name.toLowerCase());
}

async function upsertService(spec, categoryId, items) {
  const existing = findExisting(items, spec.name);
  const itemId = existing?.id || `#hg-lunch-${spec.key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#hg-lunch-${spec.key}-var`;

  console.log(`${existing ? "UPDATE" : "CREATE"}  ${spec.name}${existing ? `  (${existing.id})` : ""}`);

  const object = {
    type: "ITEM",
    id: itemId,
    present_at_all_locations: true,
    present_at_location_ids: [LOCATION_ID],
    ...(existing?.version != null ? { version: existing.version } : {}),
    item_data: {
      name: spec.name,
      description: spec.description,
      product_type: "APPOINTMENTS_SERVICE",
      label_color: LABEL_COLOR,
      category_id: categoryId,
      categories: [{ id: categoryId, ordinal: spec.ordinal }],
      ecom_available: true,
      ecom_visibility: "VISIBLE",
      channels: CHANNELS,
      is_taxable: false,
      is_archived: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          present_at_all_locations: true,
          ...(existingVar?.version != null ? { version: existingVar.version } : {}),
          item_variation_data: {
            item_id: itemId,
            name: "Regular",
            pricing_type: "FIXED_PRICING",
            price_money: { amount: 2000, currency: "USD" },
            service_duration: MIN(15),
            available_for_booking: true,
            sellable: true,
            team_member_ids: TEAM,
          },
        },
      ],
    },
  };

  if (!APPLY) return { name: spec.name };

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-lunch-${spec.key}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
  const saved = res.catalog_object;
  const variation = saved?.item_data?.variations?.[0];
  const book = `https://book.squareup.com/appointments/${BOOKING_SITE}/location/${LOCATION_ID}/services/${variation?.id}`;
  console.log(`  item ${saved?.id}`);
  console.log(`  book ${book}`);
  return {
    name: spec.name,
    itemId: saved?.id,
    variationId: variation?.id,
    price: variation?.item_variation_data?.price_money?.amount,
    book,
  };
}

async function main() {
  console.log(`\nLunch Time Wellness ${APPLY ? "(APPLY)" : "(DRY RUN)"}\n`);
  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const services = items.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  const categoryId = await ensureCategory(categories);
  const results = [];
  for (const spec of SHOTS) {
    results.push(await upsertService(spec, categoryId, services));
  }
  console.log("\nDone. $25 Vitamin Injections were not changed.\n");
  if (APPLY) console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
