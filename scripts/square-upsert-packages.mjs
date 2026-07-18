#!/usr/bin/env node
/**
 * Upsert sellable Square Appointments package SKUs (Morpheus8 Burst ×3 first),
 * plus Prepaid Package Visit ($0) for follow-up redemptions.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-upsert-packages.mjs
 *   node --env-file=.env.local scripts/square-upsert-packages.mjs --apply
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

/** Match existing catalog names (case-insensitive) so we update instead of duplicating. */
const PACKAGES = [
  {
    name: "Morpheus8 Burst — 3 Session Package",
    aliases: ["Morpheus8 Burst x3 Package", "Morpheus8 Burst ×3 Package", "Morpheus8 Burst - 3 Session Package"],
    category: "Body Contouring & Devices",
    price: 199900,
    durationMin: 60,
    image: "public/images/square-appointments/morpheus8-burst-results-flyer.jpg",
    imageFallbacks: ["public/images/homepage-services/morpheus8-burst-verified-provider.png"],
    label_color: "EA580C",
    pinOrdinal: -2251799813685248,
    description: [
      "MORPHEUS8 BURST — 3 SESSION PACKAGE · $1,999",
      "",
      "Prepaid package of three Morpheus8 Burst RF microneedling sessions.",
      "Savings vs three singles. Face / face+neck per provider plan.",
      "",
      "Visit 1: book & pay this package SKU.",
      "Visits 2–3: book “Prepaid Package Visit — $0” and note visit number on the customer card.",
      "",
      "hellogorgeousmedspa.com/morpheus8-burst-oswego",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Quantum RF — Neck Package (+ FREE Morpheus8 Burst)",
    aliases: ["Quantum RF Lipo — Neck", "Quantum RF Neck Package"],
    category: "Body Contouring & Devices",
    price: 249900,
    durationMin: 90,
    image: "public/images/square-appointments/quantum-rf10-jawline-before-after.jpg",
    imageFallbacks: ["public/images/square-appointments/quantum-rf-10-before-after.jpg"],
    label_color: "EA580C",
    pinOrdinal: -2251799812000000,
    description: [
      "QUANTUM RF — NECK PACKAGE · $2,499",
      "",
      "Subdermal Quantum RF contouring for the neck.",
      "Includes FREE Morpheus8 Burst (promotional value per current menu).",
      "",
      "hellogorgeousmedspa.com/quantum-rf-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Quantum RF — Abdomen Package (+ FREE Morpheus8 Burst)",
    aliases: ["Quantum RF Lipo — Abdomen (Full)", "Quantum RF Abdomen Package"],
    category: "Body Contouring & Devices",
    price: 399900,
    durationMin: 120,
    image: "public/images/square-appointments/quantum-rf-10-before-after.jpg",
    imageFallbacks: [],
    label_color: "EA580C",
    pinOrdinal: -2251799810314752,
    description: [
      "QUANTUM RF — ABDOMEN PACKAGE · $3,999",
      "",
      "Full abdomen Quantum RF contouring package.",
      "Includes FREE Morpheus8 Burst (promotional value per current menu).",
      "",
      "hellogorgeousmedspa.com/quantum-rf-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Solaria CO₂ — Face Treatment (BOGO Area)",
    aliases: ["Solaria CO₂ Laser", "Solaria CO2 Laser"],
    category: "Body Contouring & Devices",
    price: 89900,
    durationMin: 60,
    image: "public/images/square-appointments/solaria-inmode-machine.jpg",
    imageFallbacks: [
      "public/images/square-appointments/solaria-inmode-device.jpg",
      "public/images/solaria/solaria-inmode-machine.jpg",
    ],
    label_color: "EA580C",
    pinOrdinal: -2251799808629504,
    description: [
      "SOLARIA CO₂ — FACE TREATMENT · $899",
      "",
      "Fractional CO₂ resurfacing. Current offer: buy one area, get one free area when applicable.",
      "Series of 2–3 sessions may be recommended for deeper goals — ask at consult.",
      "",
      "hellogorgeousmedspa.com/solaria-co2-oswego",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Laser Brazilian — 3-Month Package",
    aliases: ["Professional Brazilian Laser Hair Removal", "Brazilian 3-month package"],
    category: "Laser Hair Removal",
    price: 49900,
    durationMin: 30,
    image: "public/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    imageFallbacks: ["public/images/square-appointments/diode-laser-underarm-treatment.jpg"],
    label_color: "0EA5E9",
    pinOrdinal: -2251799813685248,
    description: [
      "LASER BRAZILIAN — 3-MONTH PACKAGE · $499",
      "",
      "Prepaid Brazilian laser hair removal package (seasonal / standard package pricing).",
      "Book follow-ups as Prepaid Package Visit — $0 and note visit number.",
      "Single-session Brazilian remains available à la carte.",
      "",
      "hellogorgeousmedspa.com/laser-hair-removal-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Prepaid Package Visit — $0",
    aliases: ["Package visit", "Prepaid Package Visit"],
    category: "Medical Consultations",
    price: 0,
    durationMin: 60,
    image: null,
    imageFallbacks: [],
    label_color: "111827",
    pinOrdinal: null,
    availableForBooking: true,
    description: [
      "PREPAID PACKAGE VISIT — $0",
      "",
      "Use for follow-up sessions already paid inside a package SKU",
      "(Morpheus8 Burst ×3, laser packages, FlowWave programs, etc.).",
      "",
      "Staff: put “Package visit X of Y — [package name]” in the seller note.",
      "Do NOT open a blank POS sale and re-charge the package.",
      "Checkout from this appointment so the calendar closes cleanly (cart may be $0).",
    ].join("\n"),
  },
];

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

function resolveImage(pkg) {
  const candidates = [pkg.image, ...(pkg.imageFallbacks || [])].filter(Boolean);
  for (const rel of candidates) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) return rel;
  }
  return null;
}

async function uploadImage(objectId, imagePath, displayName) {
  const abs = path.join(ROOT, imagePath);
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const idempotencyKey = `hg-pkg-${objectId.slice(-10)}-${path.basename(abs).replace(/\W/g, "")}-${Date.now().toString(36).slice(-5)}`;
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

function findExisting(byName, pkg) {
  const keys = [pkg.name, ...(pkg.aliases || [])].map((n) => n.trim().toLowerCase());
  for (const key of keys) {
    if (byName.has(key)) return byName.get(key);
  }
  return null;
}

async function main() {
  console.log(`\n📦 Square package upsert (${APPLY ? "APPLY" : "DRY-RUN"})\n`);

  const cats = (await listCatalog("CATEGORY")).filter((c) => !c.is_deleted);
  const catIds = new Map(cats.map((c) => [c.category_data?.name, c.id]));
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );
  const byName = new Map(items.map((o) => [(o.item_data?.name || "").trim().toLowerCase(), o]));

  for (const pkg of PACKAGES) {
    const categoryId = catIds.get(pkg.category);
    if (!categoryId) {
      console.log("✕ missing category", pkg.category, "— skip", pkg.name);
      continue;
    }
    const existing = findExisting(byName, pkg);
    const cents = existing?.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount;
    const img = resolveImage(pkg);
    console.log(
      existing ? "UPDATE" : "CREATE ",
      pkg.name,
      existing ? `(was: ${existing.item_data.name}, $${(cents ?? 0) / 100})` : "",
      img ? `img=${img}` : "no-image",
    );

    if (!APPLY) continue;

    const key = `hg-pkg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const itemId = existing?.id || `#${key}`;
    const existingVar = existing?.item_data?.variations?.[0];
    const varId = existingVar?.id || `#${key}-var`;
    const categories = [{ id: categoryId }];
    if (pkg.pinOrdinal != null) {
      categories[0].ordinal = pkg.pinOrdinal;
    }

    try {
      const data = await squareFetch("POST", "/catalog/object", {
        idempotency_key: key,
        object: {
          type: "ITEM",
          id: itemId,
          ...(existing?.version != null ? { version: existing.version } : {}),
          present_at_all_locations: true,
          item_data: {
            name: pkg.name,
            description: pkg.description,
            product_type: "APPOINTMENTS_SERVICE",
            category_id: categoryId,
            categories,
            ...(pkg.label_color ? { label_color: pkg.label_color } : {}),
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
                  price_money: { amount: pkg.price, currency: "USD" },
                  service_duration: pkg.durationMin * 60000,
                  available_for_booking: pkg.availableForBooking !== false,
                },
              },
            ],
          },
        },
      });
      const id = data.catalog_object?.id || itemId;
      console.log("  ✓ saved", id);
      if (img) {
        await uploadImage(id, img, pkg.name);
        console.log("  🖼 image set");
      }
      // refresh name map so later aliases don't collide
      byName.delete((existing?.item_data?.name || "").trim().toLowerCase());
      byName.set(pkg.name.toLowerCase(), data.catalog_object || existing);
      await sleep(200);
    } catch (e) {
      console.log("  FAILED", e.message);
    }
  }

  console.log(APPLY ? "\nDone. Verify online booking under Body Contouring / Laser.\n" : "\nDry-run only. Re-run with --apply.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
