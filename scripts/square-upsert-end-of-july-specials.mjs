#!/usr/bin/env node
/**
 * Create Square booking category "End of July Specials" + 3 bookable promo SKUs.
 *
 *   node --env-file=.env.local scripts/square-upsert-end-of-july-specials.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-end-of-july-specials.mjs --apply
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APPLY = process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";
const MARISSA_ID = "TMjZzrkoSsBocyWm";
const IMAGE = "public/images/marketing/end-of-july-specials-2026.png";

const CATEGORY_NAME = "End of July Specials";
const CATEGORY_ORDINAL = 0;
const LABEL_COLOR = "FF2D8E";

const SPECIALS = [
  {
    name: "July Special: 40 Units + 20 FREE",
    aliases: ["40 units get 20 free", "End of July Injectables"],
    price: 48000, // $12/unit × 40 paid units
    durationMin: 45,
    teamMemberIds: null, // any injectable provider
    description: [
      "END OF JULY SPECIAL — BOOK BY JULY 31",
      "",
      "INJECTABLES: Book 40 units, get 20 FREE",
      "Savings: $12/unit × 20 = $240 value",
      "You pay for 40 units ($480) · receive 60 units total",
      "",
      "MD Oversight · Nurse Practitioner On Site (FNP-BC)",
      "Hello Gorgeous Med Spa · 74 W Washington St, Oswego",
      "(630) 636-6193 · hellogorgeousmedspa.com/book?ref=july31",
    ].join("\n"),
  },
  {
    name: "July Special: Laser Hair — Any Area $59",
    aliases: ["Laser any area $59", "End of July Laser"],
    price: 5900,
    durationMin: 30,
    teamMemberIds: null,
    description: [
      "END OF JULY SPECIAL — BOOK BY JULY 31",
      "",
      "LASER HAIR REMOVAL — Any Area $59",
      "",
      "MD Oversight · Nurse Practitioner On Site (FNP-BC)",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
      "hellogorgeousmedspa.com/book?ref=july31",
    ].join("\n"),
  },
  {
    name: "July Special: HydraFacial BOGO $99 (Marissa)",
    aliases: ["HydraFacial BOGO $99", "Buy HydraFacial get one free"],
    price: 9900,
    durationMin: 60,
    teamMemberIds: [MARISSA_ID],
    description: [
      "END OF JULY SPECIAL — BOOK BY JULY 31",
      "",
      "HYDRAFACIAL — Buy one, get one FREE · $99",
      "With Marissa only",
      "",
      "MD Oversight · Nurse Practitioner On Site (FNP-BC)",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
      "hellogorgeousmedspa.com/book?ref=july31",
    ].join("\n"),
  },
];

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function squareFetch(method, apiPath, body) {
  const res = await fetch(`${HOST}/v2${apiPath}`, {
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
    const err = data?.errors?.[0];
    throw new Error(err?.detail || err?.code || JSON.stringify(data) || `HTTP ${res.status}`);
  }
  return data;
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
  return out.filter((o) => !o.is_deleted);
}

async function ensureCategory(existingCats) {
  const found = existingCats.find((c) => c.category_data?.name === CATEGORY_NAME);
  if (found) {
    console.log("Category exists:", found.id, CATEGORY_NAME);
    if (APPLY && found.category_data?.ordinal !== CATEGORY_ORDINAL) {
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: `hg-july-cat-${Date.now()}`,
        object: {
          type: "CATEGORY",
          id: found.id,
          version: found.version,
          present_at_all_locations: true,
          category_data: {
            name: CATEGORY_NAME,
            ordinal: CATEGORY_ORDINAL,
          },
        },
      });
      console.log("  ✓ updated ordinal →", CATEGORY_ORDINAL);
    }
    return found.id;
  }
  console.log(APPLY ? "CREATE category" : "Would create category", CATEGORY_NAME);
  if (!APPLY) return "#pending-category";
  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: `hg-july-cat-new-${Date.now()}`,
    object: {
      type: "CATEGORY",
      id: "#july-specials-cat",
      present_at_all_locations: true,
      category_data: {
        name: CATEGORY_NAME,
        ordinal: CATEGORY_ORDINAL,
      },
    },
  });
  const id = data.catalog_object?.id;
  console.log("  ✓ category", id);
  return id;
}

async function uploadImage(objectId) {
  const abs = path.join(ROOT, IMAGE);
  if (!fs.existsSync(abs)) {
    console.warn("  (no flyer image on disk — skip upload)");
    return null;
  }
  const idempotencyKey = `hg-july-img-${objectId.slice(-8)}-${Date.now().toString(36).slice(-5)}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`.slice(0, 46),
      image_data: { name: "End of July Specials", caption: "Hello Gorgeous Med Spa" },
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
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.image?.id;
}

async function upsertItem(spec, categoryId, byName) {
  const keys = [spec.name, ...(spec.aliases || [])].map((n) => n.trim().toLowerCase());
  let existing = null;
  for (const k of keys) {
    if (byName.has(k)) {
      existing = byName.get(k);
      break;
    }
  }
  console.log(existing ? "UPDATE" : "CREATE ", spec.name, existing ? `(${existing.id})` : "");
  if (!APPLY) return;

  const key = `hg-july-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const itemId = existing?.id || `#${key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#${key}-var`;

  const variationData = {
    item_id: itemId,
    name: "Regular",
    pricing_type: "FIXED_PRICING",
    price_money: { amount: spec.price, currency: "USD" },
    service_duration: spec.durationMin * 60_000,
    available_for_booking: true,
  };
  if (spec.teamMemberIds?.length) {
    variationData.team_member_ids = spec.teamMemberIds;
  }

  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: key,
    object: {
      type: "ITEM",
      id: itemId,
      ...(existing?.version != null ? { version: existing.version } : {}),
      present_at_all_locations: true,
      present_at_location_ids: [LOCATION_ID],
      item_data: {
        name: spec.name,
        description: spec.description,
        product_type: "APPOINTMENTS_SERVICE",
        category_id: categoryId,
        categories: [{ id: categoryId, ordinal: -Number(String(Date.now()).slice(-6)) }],
        label_color: LABEL_COLOR,
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varId,
            ...(existingVar?.version != null ? { version: existingVar.version } : {}),
            present_at_all_locations: true,
            item_variation_data: variationData,
          },
        ],
      },
    },
  });
  const id = data.catalog_object?.id || itemId;
  console.log("  ✓ saved", id, `$${(spec.price / 100).toFixed(0)}`);
  try {
    await uploadImage(id);
    console.log("  ✓ flyer image attached");
  } catch (e) {
    console.warn("  image upload:", e.message || e);
  }
}

async function main() {
  console.log(`\n🔥 End of July Specials (${APPLY ? "APPLY" : "DRY-RUN"})\n`);
  const cats = await listCatalog("CATEGORY");
  const categoryId = await ensureCategory(cats);
  const items = (await listCatalog("ITEM")).filter(
    (o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );
  const byName = new Map(items.map((o) => [(o.item_data?.name || "").trim().toLowerCase(), o]));
  for (const spec of SPECIALS) {
    await upsertItem(spec, categoryId, byName);
  }
  console.log("\nDone. Clients can book under “End of July Specials” on Square Appointments.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
