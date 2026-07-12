#!/usr/bin/env node
/**
 * Create Marissa’s $129 HydraFacial + Dermaplaning Glow Special in Square,
 * assign Marissa as bookable staff, and attach Rejuva Fresh images to HydraFacial services.
 *
 * Usage:
 *   node --env-file=.env.local scripts/add-hydrafacial-marissa-special-to-square.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";
const MARISSA_TEAM_ID = "TMjZzrkoSsBocyWm";

const CAT_NAME = "Skin Spa";
const SERVICE = {
  name: "HydraFacial + Dermaplaning Glow Special with Marissa — $129",
  price: 12900,
  duration: 70,
  description: [
    "MARISSA’S GLOW SPECIAL — $129",
    "",
    "Rejuva Fresh HydraFacial + dermaplaning + hydrogen-oxygen spray included.",
    "Choose any 2 premium machine add-ons:",
    "High Frequency · Cold Hammer · Ultrasonic Scrubber · Bipolar RF · LED Mask · Microcurrent/V-Lift · Facial Ultrasound · Oxygen Bubble Pen",
    "",
    "Book with Marissa Murray, licensed esthetician.",
    "Zero downtime · Oswego · (630) 636-6193",
  ].join("\n"),
};

const DEVICE_IMAGE = path.join(ROOT, "public/images/square-appointments/rejuva-fresh-hydra-spa-device.jpg");
const TREATMENT_IMAGE = path.join(ROOT, "public/images/square-appointments/rejuva-fresh-treatment-chair.jpg");

const HYDRA_NAME_RE = /hydra|dermaplan|glowtox|diamond glow|geneo|rejuva/i;

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
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

async function uploadImage(objectId, imagePath, displayName) {
  const idempotencyKey = `hg-hydra-${objectId.slice(-12)}-${path.basename(imagePath).replace(/\W/g, "")}-${Date.now().toString(36).slice(-5)}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`.slice(0, 46),
      image_data: {
        name: displayName.slice(0, 80),
        caption: `${displayName} — Hello Gorgeous Med Spa`,
      },
    },
  };
  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(requestBody)], { type: "application/json" }));
  form.append("file", new Blob([fs.readFileSync(imagePath)], { type: "image/jpeg" }), path.basename(imagePath));
  const res = await fetch(`${HOST}/v2/catalog/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.image?.id;
}

async function ensureCategoryId() {
  const cats = await listCatalog("CATEGORY");
  const existing = cats.find((c) => (c.category_data?.name || "") === CAT_NAME);
  if (existing) return existing.id;
  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: `hg-skin-spa-cat-${Date.now()}`,
    object: {
      type: "CATEGORY",
      id: "#hg-skin-spa",
      present_at_all_locations: true,
      category_data: { name: CAT_NAME },
    },
  });
  return data.catalog_object.id;
}

async function upsertSpecial(categoryId) {
  const items = await listCatalog("ITEM");
  const existing = items.find(
    (o) =>
      o.item_data?.product_type === "APPOINTMENTS_SERVICE" &&
      (o.item_data?.name || "").trim().toLowerCase() === SERVICE.name.toLowerCase(),
  );
  const key = `hg-hydra129-${Date.now()}`;
  const itemId = existing?.id || `#${key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#${key}-var`;

  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: key,
    object: {
      type: "ITEM",
      id: itemId,
      ...(existing?.version != null ? { version: existing.version } : {}),
      present_at_all_locations: true,
      item_data: {
        name: SERVICE.name,
        description: SERVICE.description,
        product_type: "APPOINTMENTS_SERVICE",
        category_id: categoryId,
        categories: [{ id: categoryId }],
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varId,
            ...(existingVar?.version != null ? { version: existingVar.version } : {}),
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemId,
              name: "Regular",
              pricing_type: "FIXED_PRICING",
              price_money: { amount: SERVICE.price, currency: "USD" },
              service_duration: SERVICE.duration * 60000,
              available_for_booking: true,
              team_member_ids: [MARISSA_TEAM_ID],
            },
          },
        ],
      },
    },
  });

  const createdId = data.catalog_object?.id || itemId;
  console.log(existing ? "updated" : "created", SERVICE.name, "->", createdId);
  return createdId;
}

async function attachHydraImages() {
  const items = await listCatalog("ITEM");
  const hydraItems = items.filter(
    (o) =>
      o.type === "ITEM" &&
      !o.is_deleted &&
      o.item_data?.product_type === "APPOINTMENTS_SERVICE" &&
      HYDRA_NAME_RE.test(o.item_data?.name || ""),
  );

  let n = 0;
  for (const item of hydraItems) {
    const name = item.item_data?.name || "";
    const imagePath = /special|\$129|marissa/i.test(name) ? TREATMENT_IMAGE : DEVICE_IMAGE;
    try {
      await uploadImage(item.id, imagePath, name);
      console.log("🖼 ", name);
      n++;
      await sleep(160);
    } catch (e) {
      console.log("⚠", name, e.message);
    }
  }
  console.log(`Images attached: ${n}/${hydraItems.length}`);
}

async function main() {
  console.log("\n✨ HydraFacial Marissa $129 → Square\n");
  console.log("Location:", LOCATION_ID);
  if (!fs.existsSync(DEVICE_IMAGE) || !fs.existsSync(TREATMENT_IMAGE)) {
    console.error("Missing Rejuva Fresh images under public/images/square-appointments/");
    process.exit(1);
  }

  const catId = await ensureCategoryId();
  const itemId = await upsertSpecial(catId);
  await uploadImage(itemId, TREATMENT_IMAGE, SERVICE.name);
  console.log("🖼  special primary image set");
  await attachHydraImages();
  console.log("\nDone. Confirm in Square Dashboard → Appointments → Services.");
  console.log("Book: https://www.hellogorgeousmedspa.com/book?ref=hydrafacial_129_marissa\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
