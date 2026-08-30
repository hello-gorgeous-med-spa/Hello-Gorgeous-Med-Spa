#!/usr/bin/env node
/**
 * Square Appointments — Fall Makeover packages (no published price).
 *
 * Category + 4 bookable consults, VARIABLE_PRICING. Ryan maps the plan.
 *
 *   node --env-file=.env.local scripts/square-upsert-fall-makeover.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-fall-makeover.mjs --apply
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APPLY = process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";
const BOOKING_SITE = "pf2o75yphk7vw6";
const RYAN = "TM1IptWCrgxkY4p7";

const CATEGORY_NAME = "Fall Makeover";
const LABEL_COLOR = "FF2D8E";
const DURATION_MIN = 30;

const SERVICES = [
  {
    key: "consult",
    name: "Fall Makeover Consult",
    aliases: ["Fall Makeover", "Fall Makeover — Consult"],
    image: "public/images/marketing/fall-makeover/social-v2.png",
    description:
      "Fall Makeover consult with Ryan Kent, FNP-BC at Hello Gorgeous Med Spa, Oswego. Pick Repair, Prevent, or Lose. He maps candidacy, downtime, and your real number. Prescription pieces need clearance. Savings apply at consult — not a checkout coupon. Not billed to insurance.",
  },
  {
    key: "repair",
    name: "Fall Makeover — Repair",
    aliases: ["Repair Fall Makeover", "Fall Makeover Repair"],
    image: "public/images/marketing/fall-makeover/repair-v2.png",
    description:
      "Fall Makeover Repair — fade leftover pigment from the inside and the outside. IPL series, Solaria CO₂, medical-grade lightener, and GHK-Cu when prescribed. Ryan Kent, FNP-BC maps the plan at consult. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "prevent",
    name: "Fall Makeover — Prevent",
    aliases: ["Prevent Fall Makeover", "Fall Makeover Prevent"],
    image: "public/images/marketing/fall-makeover/prevent-v2.png",
    description:
      "Fall Makeover Prevent — hold the line on aging this season. K-Glow peptide, retinoid cream, Xeomin, one Morpheus8, and Glow facials. Ryan Kent, FNP-BC maps the plan at consult. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "lose",
    name: "Fall Makeover — Lose",
    aliases: ["Lose Fall Makeover", "Fall Makeover Lose"],
    image: "public/images/marketing/fall-makeover/lose-v2.png",
    description:
      "Fall Makeover Lose — medical weight loss plus tightening so skin stays in the conversation. GLP-1 program, MIC + B12, Morpheus8, and a Glow facial. Ryan Kent, FNP-BC maps the plan at consult. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
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
  if (found) {
    console.log(`Category exists: ${found.id}  ${CATEGORY_NAME}`);
    return found.id;
  }
  console.log(APPLY ? "CREATE category" : "Would create category", CATEGORY_NAME);
  if (!APPLY) return "#pending-fall-makeover-cat";
  const data = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-fall-cat-${crypto.randomBytes(4).toString("hex")}`,
      object: {
        type: "CATEGORY",
        id: "#fall-makeover-cat",
        present_at_all_locations: true,
        category_data: { name: CATEGORY_NAME, ordinal: 0 },
      },
    },
  });
  const id = data.catalog_object?.id;
  console.log(`  ✓ category ${id}`);
  return id;
}

async function uploadImage(objectId, relPath, caption) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    console.warn(`  (no image ${relPath} — skip)`);
    return null;
  }
  const idempotencyKey = `hg-fall-img-${objectId.slice(-8)}-${Date.now().toString(36).slice(-5)}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`.slice(0, 46),
      image_data: { name: caption, caption: "Hello Gorgeous Med Spa" },
    },
  };
  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(requestBody)], { type: "application/json" }));
  form.append("file", new Blob([fs.readFileSync(abs)], { type: "image/png" }), path.basename(abs));
  const res = await fetch(`${HOST}/v2/catalog/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.errors?.[0]?.detail || JSON.stringify(json));
  return json.image?.id;
}

function findExisting(items, spec) {
  const names = new Set([spec.name, ...spec.aliases].map((n) => n.toLowerCase()));
  return items.find((o) => names.has((o.item_data?.name || "").trim().toLowerCase()));
}

async function upsertService(spec, categoryId, items) {
  const existing = findExisting(items, spec);
  const itemId = existing?.id || `#hg-fall-${spec.key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#hg-fall-${spec.key}-var`;

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
      categories: [{ id: categoryId }],
      ecom_available: true,
      ecom_visibility: "VISIBLE",
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
            name: "Consult",
            pricing_type: "VARIABLE_PRICING",
            service_duration: MIN(DURATION_MIN),
            available_for_booking: true,
            sellable: true,
            team_member_ids: [RYAN],
          },
        },
      ],
    },
  };

  if (!APPLY) {
    console.log(`  ${DURATION_MIN} min · Ryan · no price`);
    return { key: spec.key, name: spec.name };
  }

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-fall-${spec.key}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
  const saved = res.catalog_object;
  const variation = saved?.item_data?.variations?.[0];
  const book = `https://book.squareup.com/appointments/${BOOKING_SITE}/location/${LOCATION_ID}/services/${variation?.id}`;
  console.log(`  ✓ item ${saved?.id}`);
  console.log(`    variation ${variation?.id}`);
  console.log(`    book ${book}`);

  try {
    await uploadImage(saved.id, spec.image, spec.name);
    console.log("    ✓ image attached");
  } catch (err) {
    console.warn("    image:", err instanceof Error ? err.message : err);
  }

  return {
    key: spec.key,
    name: spec.name,
    itemId: saved?.id,
    variationId: variation?.id,
    book,
  };
}

async function main() {
  console.log(`\nFall Makeover Square ${APPLY ? "(APPLY)" : "(DRY RUN)"}\n`);
  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const services = items.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  const categoryId = await ensureCategory(categories);
  const results = [];
  for (const spec of SERVICES) {
    results.push(await upsertService(spec, categoryId, services));
  }
  console.log("\nDone. Clients book under “Fall Makeover” on Square Appointments — no price shown.\n");
  if (APPLY) {
    console.log(JSON.stringify(results, null, 2));
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
