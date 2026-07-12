#!/usr/bin/env node
/**
 * Create Oswego year-end specials in Square Appointments:
 * - Full-set lashes $89 (Marissa)
 * - Laser hair $59 listed areas
 * - IPL photofacial $79 (Zemits DuoCratus)
 *
 * Usage:
 *   node --env-file=.env.local scripts/add-oswego-specials-to-square.mjs
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
const MARISSA = "TMjZzrkoSsBocyWm";

const SERVICES = [
  {
    name: "Full Set Eyelash Extensions Special with Marissa — $89",
    category: "Lash Spa",
    price: 8900,
    duration: 105,
    team: [MARISSA],
    image: "public/images/square-appointments/keratin-lash-lift-before-after.jpg",
    description: [
      "FULL SET LASH EXTENSIONS — $89 SPECIAL",
      "",
      "Classic or hybrid full set with Marissa Murray, certified lash artist.",
      "Custom mapping · soft natural glam · aftercare included.",
      "",
      "Price locked through December 31, 2026.",
      "Book at hellogorgeousmedspa.com/oswego-specials",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Laser Hair Removal Special — Underarms $59",
    category: "Body Spa",
    price: 5900,
    duration: 20,
    team: null,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    description: yearEndLaserDesc("Underarms"),
  },
  {
    name: "Laser Hair Removal Special — Bikini $59",
    category: "Body Spa",
    price: 5900,
    duration: 25,
    team: null,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    description: yearEndLaserDesc("Bikini"),
  },
  {
    name: "Laser Hair Removal Special — Brazilian $59",
    category: "Body Spa",
    price: 5900,
    duration: 30,
    team: null,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    description: yearEndLaserDesc("Brazilian"),
  },
  {
    name: "Laser Hair Removal Special — Upper Legs $59",
    category: "Body Spa",
    price: 5900,
    duration: 35,
    team: null,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    description: yearEndLaserDesc("Upper legs"),
  },
  {
    name: "Laser Hair Removal Special — Lower Legs $59",
    category: "Body Spa",
    price: 5900,
    duration: 35,
    team: null,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    description: yearEndLaserDesc("Lower legs"),
  },
  {
    name: "Laser Hair Removal Special — Chin / Neck / Face $59",
    category: "Body Spa",
    price: 5900,
    duration: 20,
    team: null,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    description: yearEndLaserDesc("Chin / neck / face"),
  },
  {
    name: "IPL Photofacial Special — Zemits DuoCratus $79",
    category: "Skin Spa",
    price: 7900,
    duration: 40,
    team: [MARISSA],
    image: "public/images/square-appointments/ipl-photofacial-zemits-530nm.jpg",
    description: [
      "IPL PHOTOFACIAL — $79 SPECIAL",
      "",
      "Zemits DuoCratus IPL / SHR platform with sapphire contact cooling.",
      "Filter selection referenced from DuoCratis IPL guide for photorejuvenation,",
      "pigment, vascular tone, or congestion support when appropriate.",
      "",
      "Skin assessment required. Price locked through December 31, 2026.",
      "hellogorgeousmedspa.com/oswego-specials",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
];

function yearEndLaserDesc(area) {
  return [
    `LASER HAIR REMOVAL — ${area.toUpperCase()} $59`,
    "",
    "Year-end special · Zemits DuoCratus medical-grade platform.",
    "Price locked through December 31, 2026 · per session · listed area.",
    "Series recommended for lasting reduction.",
    "",
    "hellogorgeousmedspa.com/oswego-specials",
    "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
  ].join("\n");
}

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
  const abs = path.join(ROOT, imagePath);
  if (!fs.existsSync(abs)) {
    console.log("  ⚠ missing image", imagePath);
    return null;
  }
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const idempotencyKey = `hg-osw-${objectId.slice(-10)}-${path.basename(abs).replace(/\W/g, "")}-${Date.now().toString(36).slice(-5)}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`.slice(0, 46),
      image_data: { name: displayName.slice(0, 80), caption: `${displayName} — Hello Gorgeous` },
    },
  };
  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(requestBody)], { type: "application/json" }));
  form.append("file", new Blob([fs.readFileSync(abs)], { type: mime }), path.basename(abs));
  const res = await fetch(`${HOST}/v2/catalog/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.image?.id;
}

async function main() {
  console.log("\n✨ Oswego specials → Square Appointments\n");
  const cats = await listCatalog("CATEGORY");
  const catIds = new Map(cats.map((c) => [c.category_data?.name, c.id]));
  const items = await listCatalog("ITEM");
  const byName = new Map(
    items
      .filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE")
      .map((o) => [(o.item_data?.name || "").trim().toLowerCase(), o]),
  );

  for (const svc of SERVICES) {
    const categoryId = catIds.get(svc.category);
    if (!categoryId) {
      console.log("✕ missing category", svc.category, "— skip", svc.name);
      continue;
    }
    const existing = byName.get(svc.name.toLowerCase());
    const key = `hg-osw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const itemId = existing?.id || `#${key}`;
    const existingVar = existing?.item_data?.variations?.[0];
    const varId = existingVar?.id || `#${key}-var`;
    try {
      const data = await squareFetch("POST", "/catalog/object", {
        idempotency_key: key,
        object: {
          type: "ITEM",
          id: itemId,
          ...(existing?.version != null ? { version: existing.version } : {}),
          present_at_all_locations: true,
          item_data: {
            name: svc.name,
            description: svc.description,
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
                  price_money: { amount: svc.price, currency: "USD" },
                  service_duration: svc.duration * 60000,
                  available_for_booking: true,
                  ...(svc.team ? { team_member_ids: svc.team } : {}),
                },
              },
            ],
          },
        },
      });
      const id = data.catalog_object?.id || itemId;
      console.log(existing ? "updated" : "created", svc.name, "->", id);
      await uploadImage(id, svc.image, svc.name);
      console.log("  🖼 image set");
      await sleep(180);
    } catch (e) {
      console.log("FAILED", svc.name, e.message);
    }
  }

  console.log("\nDone. See /oswego-specials + Square Appointments.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
