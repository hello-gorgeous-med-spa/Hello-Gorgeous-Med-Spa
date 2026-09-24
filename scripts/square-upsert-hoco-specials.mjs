#!/usr/bin/env node
/**
 * Square Appointments — HOCO (Homecoming) specials, Danielle only.
 *
 *   node --env-file=.env.local scripts/square-upsert-hoco-specials.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-hoco-specials.mjs --apply
 */

import crypto from "node:crypto";

const APPLY = process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";
const BOOKING_SITE = "pf2o75yphk7vw6";
const DANIELLE = "TMqnS9cNU-3s3lUR";

const CATEGORY_NAME = "HOCO Specials";
const CATEGORY_ORDINAL = 0;
const LABEL_COLOR = "FF2D8E";
/** Square Online + Appointments booking channels (Skin Spa uses both). */
const CHANNELS = [
  "CH_dyZoNlKiODbKbbkck77Qg2mcKEn9t9NNtqZ58UR29945o",
  "CH_weIWklklJtWFDV1DY0mEg2mcKEn9t9NNtqZ58UR29945o",
];

const CATEGORY_DESCRIPTION = [
  "Homecoming glow, without the guesswork.",
  "Dance-ready skin, lashes, and brows — booked with Danielle at Hello Gorgeous Med Spa in downtown Oswego.",
  "Limited-time HOCO menu. Arrive with a clean face. No outcome is guaranteed — we customize to your skin the day of.",
  "74 W. Washington St · (630) 636-6193 · hellogorgeousmedspa.com",
].join(" ");

const FOOTER = [
  "",
  "With Danielle · Hello Gorgeous Med Spa · 74 W. Washington St, Oswego",
  "(630) 636-6193 · hellogorgeousmedspa.com/book",
  "Results vary. Not billed to insurance. Under 18: a parent or guardian must attend.",
].join("\n");

const SERVICES = [
  {
    key: "signature",
    ordinal: 0,
    name: "HOCO Signature Facial",
    aliases: ["HOCO Signature Facial $99", "Homecoming Signature Facial"],
    price: 9900,
    durationMin: 60,
    description: [
      "HOCO SPECIAL — $99 · 60 MIN",
      "",
      "Signature Facial with complimentary dermaplaning.",
      "A full customized facial plus a free dermaplane pass so makeup sits smoother for pictures and the dance.",
      "",
      "Best booked 3–7 days before homecoming. Tell us about retinoids, recent sun, or active breakouts at check-in.",
      FOOTER,
    ].join("\n"),
  },
  {
    key: "lash-brow",
    ordinal: 1,
    name: "HOCO Lash & Brow Glow Up",
    aliases: ["Lash and Brow Glow Up", "HOCO Lash and Brow", "Homecoming Lash Brow"],
    price: 12000,
    durationMin: 60,
    description: [
      "HOCO SPECIAL — $120 · 60 MIN",
      "",
      "Lash & Brow Glow Up — lifted, tinted, camera-ready lashes and brows in one visit with Danielle.",
      "The HOCO picture package: open-eye lashes plus a clean brow shape so you skip the morning makeup scramble.",
      "",
      "Arrive with lashes and brows product-free. Patch-test tints if you have sensitive eyes.",
      FOOTER,
    ].join("\n"),
  },
  {
    key: "glow",
    ordinal: 2,
    name: "HOCO Glow Facial",
    aliases: ["HOCO Glow Facial $99", "Homecoming Glow Facial"],
    price: 9900,
    durationMin: 60,
    description: [
      "HOCO SPECIAL — $99 · 60 MIN",
      "",
      "HOCO Glow Facial — event-ready radiance. Cleanse, gentle polish, hydration, and a glow finish so skin looks lit from within under flash and gym lighting.",
      "",
      "Ideal 2–5 days before the dance. Skip if you have open wounds or a fresh peel/laser.",
      FOOTER,
    ].join("\n"),
  },
  {
    key: "acne",
    ordinal: 3,
    name: "HOCO High School Acne Facial",
    aliases: ["High School Acne Facial", "HOCO Acne Facial", "Homecoming Acne Facial"],
    price: 12900,
    durationMin: 60,
    description: [
      "HOCO SPECIAL — $129 · 60 MIN",
      "",
      "High School Acne Facial — Hydra cleanse + extractions + high frequency + a mild salicylic peel.",
      "Built for congested, breakout-prone teen and high-school skin before the big night. We treat what we see that day — this is not a diagnosis or a cure for acne.",
      "",
      "Expect possible redness after extractions and the peel. Book at least 5–7 days before photos when you can. No guaranteed clearing.",
      FOOTER,
    ].join("\n"),
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
    ordinal: CATEGORY_ORDINAL,
    online_visibility: true,
    is_top_level: true,
    channels: CHANNELS,
    ecom_seo_data: {
      page_title: "HOCO Specials | Hello Gorgeous Med Spa",
      page_description: CATEGORY_DESCRIPTION,
      permalink: "hoco-specials",
    },
  };

  if (found) {
    console.log(`Category exists: ${found.id}  ${CATEGORY_NAME}`);
    if (!APPLY) return found.id;
    const res = await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-hoco-cat-${crypto.randomBytes(4).toString("hex")}`,
        object: {
          type: "CATEGORY",
          id: found.id,
          version: found.version,
          present_at_all_locations: true,
          category_data: { ...found.category_data, ...categoryData },
        },
      },
    });
    console.log(`  ✓ updated category ${res.catalog_object?.id}`);
    return res.catalog_object?.id || found.id;
  }

  console.log(APPLY ? "CREATE category" : "Would create category", CATEGORY_NAME);
  console.log(`  ${CATEGORY_DESCRIPTION}`);
  if (!APPLY) return "#pending-hoco-cat";

  const data = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-hoco-cat-new-${crypto.randomBytes(4).toString("hex")}`,
      object: {
        type: "CATEGORY",
        id: "#hoco-specials-cat",
        present_at_all_locations: true,
        category_data: categoryData,
      },
    },
  });
  const id = data.catalog_object?.id;
  console.log(`  ✓ category ${id}`);
  return id;
}

function findExisting(items, spec) {
  const names = new Set([spec.name, ...spec.aliases].map((n) => n.toLowerCase()));
  return items.find((o) => names.has((o.item_data?.name || "").trim().toLowerCase()));
}

async function upsertService(spec, categoryId, items) {
  const existing = findExisting(items, spec);
  const itemId = existing?.id || `#hg-hoco-${spec.key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#hg-hoco-${spec.key}-var`;

  console.log(`${existing ? "UPDATE" : "CREATE"}  ${spec.name}${existing ? `  (${existing.id})` : ""}`);
  console.log(`  $${(spec.price / 100).toFixed(0)} · ${spec.durationMin} min · Danielle only`);

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
            price_money: { amount: spec.price, currency: "USD" },
            service_duration: MIN(spec.durationMin),
            available_for_booking: true,
            sellable: true,
            team_member_ids: [DANIELLE],
          },
        },
      ],
    },
  };

  if (!APPLY) return { key: spec.key, name: spec.name };

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-hoco-${spec.key}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
  const saved = res.catalog_object;
  const variation = saved?.item_data?.variations?.[0];
  const book = `https://book.squareup.com/appointments/${BOOKING_SITE}/location/${LOCATION_ID}/services/${variation?.id}`;
  console.log(`  ✓ item ${saved?.id}`);
  console.log(`    book ${book}`);
  return {
    key: spec.key,
    name: spec.name,
    itemId: saved?.id,
    variationId: variation?.id,
    book,
  };
}

async function main() {
  console.log(`\nHOCO Specials Square ${APPLY ? "(APPLY)" : "(DRY RUN)"}\n`);
  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const services = items.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  const categoryId = await ensureCategory(categories);
  const results = [];
  for (const spec of SERVICES) {
    results.push(await upsertService(spec, categoryId, services));
  }
  console.log("\nDone. Clients book under “HOCO Specials” — Danielle only.\n");
  if (APPLY) console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
