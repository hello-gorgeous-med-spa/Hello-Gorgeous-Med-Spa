#!/usr/bin/env node
/**
 * Add July Recovery Stack (BPC-157 + Shockwave) to Square Appointments
 * and write print-ready QR codes for marketing.
 *
 * Usage:
 *   node --env-file=.env.local scripts/add-july-recovery-stack-to-square.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const BOOKING_URL =
  "https://app.squareup.com/appointments/book/pf2o75yphk7vw6/L3QDRS4DX9ZE4/start";
const BOOK_PAGE_URL =
  "https://www.hellogorgeousmedspa.com/book?utm_source=qr&utm_medium=print&utm_campaign=july_recovery_stack";

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST =
  envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const CAT_NAME = "July Promotions - Recovery Stack";

/** Flyer shows 1-mo $899 + 3-mo $1799; 6-mo extended package for marketing request. */
const SERVICES = [
  {
    name: "July Recovery Stack - 1 Month (5 Shockwave + BPC-157)",
    price: 89900,
    duration: 30,
    description: [
      "JULY RECOVERY STACK - 1 MONTH",
      "",
      "5 FlowWave / Shockwave therapy sessions + 1 month RE GEN BPC-157 peptide support.",
      "",
      "Pain relief · Recovery support · Mobility",
      "NP-directed · Medically screened · No downtime",
      "",
      "Call/Text (630) 636-6193",
      "Wellness support only. Individual results may vary.",
    ].join("\n"),
  },
  {
    name: "July Recovery Stack - 3 Months (10 Shockwave + BPC-157)",
    price: 179900,
    duration: 30,
    description: [
      "JULY RECOVERY STACK - 3 MONTHS",
      "",
      "10 FlowWave / Shockwave therapy sessions + 3 months RE GEN BPC-157 peptide support.",
      "",
      "Pain relief · Recovery support · Mobility",
      "NP-directed · Medically screened · No downtime",
      "",
      "Call/Text (630) 636-6193",
      "Wellness support only. Individual results may vary.",
    ].join("\n"),
  },
  {
    name: "July Recovery Stack - 6 Months (20 Shockwave + BPC-157)",
    price: 329900,
    duration: 30,
    description: [
      "JULY RECOVERY STACK - 6 MONTHS",
      "",
      "20 FlowWave / Shockwave therapy sessions + 6 months RE GEN BPC-157 peptide support.",
      "",
      "Extended package for ongoing pain relief, recovery support, and mobility.",
      "NP-directed · Medically screened · No downtime",
      "",
      "Call/Text (630) 636-6193",
      "Wellness support only. Individual results may vary.",
    ].join("\n"),
  },
  {
    name: "FlowWave Shockwave Therapy - Single Session",
    price: 14900,
    duration: 20,
    description: [
      "Single FlowWave FOCUS shockwave therapy session for deep-tissue pain, recovery, and mobility.",
      "NP-directed · Medically screened · No downtime.",
      "Intro special pricing may apply - ask about first-session offers.",
    ].join("\n"),
  },
  {
    name: "BPC-157 Peptide Support - Monthly Protocol",
    price: 0,
    duration: 15,
    description: [
      "RE GEN BPC-157 peptide support - monthly protocol.",
      "Sterile · For subcutaneous use · NP-prescribed after medical screening.",
      "Pair with FlowWave shockwave as part of the July Recovery Stack, or book as a standalone peptide consult.",
      "Price confirmed after NP evaluation.",
    ].join("\n"),
  },
];

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

async function listObjects(types) {
  const all = [];
  let cursor = null;
  do {
    const body = { object_types: types, include_deleted_objects: false, limit: 100 };
    if (cursor) body.cursor = cursor;
    const data = await squareFetch("POST", "/catalog/search", body);
    all.push(...(data.objects || []));
    cursor = data.cursor || null;
  } while (cursor);
  return all;
}

async function ensureCategory() {
  const cats = await listObjects(["CATEGORY"]);
  const existing = cats.find((c) => (c.category_data?.name || "") === CAT_NAME);
  if (existing) {
    console.log("category:", existing.id);
    return existing.id;
  }
  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: `july-rec-stack-cat-${Date.now()}`,
    object: {
      type: "CATEGORY",
      id: "#july-rec-stack-cat",
      present_at_all_locations: true,
      category_data: { name: CAT_NAME },
    },
  });
  console.log("created category:", data.catalog_object.id);
  return data.catalog_object.id;
}

async function upsertServices(categoryId) {
  const items = await listObjects(["ITEM"]);
  const byName = new Map();
  for (const o of items) {
    if (o.item_data?.product_type !== "APPOINTMENTS_SERVICE") continue;
    byName.set((o.item_data?.name || "").trim().toLowerCase(), o);
  }

  for (const svc of SERVICES) {
    const existing = byName.get(svc.name.toLowerCase());
    const key = `july-rec-${slug(svc.name)}-${Date.now()}`;
    const itemId = existing?.id || `#${key}`;
    const existingVar = existing?.item_data?.variations?.[0];
    const varId = existingVar?.id || `#${key}-var`;
    try {
      const data = await squareFetch("POST", "/catalog/object", {
        idempotency_key: key.slice(0, 128),
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
                  pricing_type: svc.price > 0 ? "FIXED_PRICING" : "VARIABLE_PRICING",
                  ...(svc.price > 0
                    ? { price_money: { amount: svc.price, currency: "USD" } }
                    : {}),
                  service_duration: svc.duration * 60000,
                  available_for_booking: true,
                },
              },
            ],
          },
        },
      });
      console.log(
        existing ? "updated" : "created",
        svc.name,
        "->",
        data.catalog_object?.id || itemId,
        `$${(svc.price / 100).toFixed(2)}`,
      );
    } catch (e) {
      console.log("FAILED", svc.name, e.message);
    }
    await sleep(150);
  }
}

async function writeQrCodes() {
  const dir = path.join(ROOT, "public/marketing/july-recovery-stack");
  fs.mkdirSync(dir, { recursive: true });

  const squarePath = path.join(dir, "square-booking-qr.png");
  const bookPath = path.join(dir, "book-page-qr.png");
  const urlsPath = path.join(dir, "BOOKING-LINKS.txt");

  await QRCode.toFile(squarePath, BOOKING_URL, {
    width: 1024,
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  await QRCode.toFile(bookPath, BOOK_PAGE_URL, {
    width: 1024,
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  fs.writeFileSync(
    urlsPath,
    [
      "Hello Gorgeous - July Recovery Stack booking links",
      "",
      "SQUARE DIRECT BOOKING (use on flyers):",
      BOOKING_URL,
      "",
      "WEBSITE /book WITH UTM (embed + brand page):",
      BOOK_PAGE_URL,
      "",
      "QR FILES:",
      "- square-booking-qr.png  -> Square start URL",
      "- book-page-qr.png       -> hellogorgeousmedspa.com/book",
      "",
    ].join("\n"),
  );

  console.log("QR written:", squarePath);
  console.log("QR written:", bookPath);
  console.log("Links file:", urlsPath);
}

async function main() {
  console.log("Writing QR codes...");
  await writeQrCodes();
  console.log("\nUpserting Square Appointments services...");
  const catId = await ensureCategory();
  await upsertServices(catId);
  console.log("\nDone. Confirm under Square Dashboard -> Appointments -> Services.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
