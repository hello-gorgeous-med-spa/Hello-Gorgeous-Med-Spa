#!/usr/bin/env node
/**
 * Lean Lash Spa menu — keep only these extension SKUs, delete the rest.
 *
 *   Hybrid Full Set $150 · Fill $75 · Removal $40 · Mini $40 · Classic $120 · Volume $200
 *
 *   node --env-file=.env.local scripts/square-revise-lash-menu.mjs --dry-run
 *   node --env-file=.env.local scripts/square-revise-lash-menu.mjs --apply
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run") || !process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const IMAGE = path.join(ROOT, "public/images/square-appointments/hybrid-lash-extensions.jpg");

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

/** Keepers: match existing Square name → target name/price/duration/description */
const KEEPERS = [
  {
    match: /^Hybrid Lash Extensions — Full Set$/i,
    name: "Hybrid Lash Extensions — Full Set",
    priceCents: 15000,
    durationMs: 90 * 60 * 1000,
    description:
      "Hybrid lash extensions full set — mix of classic + volume for natural-with-drama fullness. Most popular style. 90 minutes. Hello Gorgeous Med Spa · Oswego.",
  },
  {
    match: /^Hybrid Lash Fill$/i,
    name: "Lash Fill",
    priceCents: 7500,
    durationMs: 60 * 60 * 1000,
    description:
      "Lash extension fill (classic, hybrid, or volume sets). Restores fall-out and refreshes your look. 60 minutes. Book every 2–3 weeks.",
  },
  {
    match: /^Lash Removal$/i,
    name: "Lash Removal",
    priceCents: 4000,
    durationMs: 30 * 60 * 1000,
    description:
      "Professional removal of eyelash extensions. Safe dissolve — protects natural lashes. 30 minutes.",
  },
  {
    match: /^Lash Mini Fill/i,
    name: "Lash Mini Fill",
    priceCents: 4000,
    durationMs: 30 * 60 * 1000,
    description:
      "Quick mini fill for small gaps (typically within 7 days of your set). 30 minutes.",
  },
  {
    match: /^Classic Lash Extensions — Full Set$/i,
    name: "Classic Lash Extensions — Full Set",
    priceCents: 12000,
    durationMs: 90 * 60 * 1000,
    description:
      "Classic one-to-one lash extensions — natural, mascara-look fullness. Perfect for first-timers. 90 minutes.",
  },
  {
    match: /^Volume Lash Extensions — Full Set$/i,
    name: "Volume Lash Extensions — Full Set",
    priceCents: 20000,
    durationMs: 120 * 60 * 1000,
    description:
      "Volume lash extensions full set — multiple ultra-light lashes per natural lash for soft, fluffy fullness. 2-hour application.",
  },
  {
    match: /^Lash Lift & Tint$/i,
    name: "Lash Lift & Tint",
    priceCents: 8900,
    durationMs: 60 * 60 * 1000,
    description:
      "Classic lash lift + tint — curls and darkens your natural lashes for a mascara-look that lasts 6–8 weeks. No extensions. $89 · 60 minutes.",
  },
  {
    match: /^Korean Lash Lift & Tint$/i,
    name: "Korean Lash Lift & Tint",
    priceCents: 12900,
    durationMs: 75 * 60 * 1000,
    description:
      "Korean lash lift + tint — premium lift technique for a softer, lifted natural-lash look with tint. $129 · 75 minutes.",
  },
];

function isLashSpaService(name) {
  if (!/lash|extension|classic|hybrid|volume|mink|mega volume/i.test(name)) return false;
  // Keep brow services out
  if (/brow|laser|facial|filler|botox|morpheus|ipl|hair removal|dermaplan/i.test(name)) return false;
  return true;
}

async function square(method, pathname, body) {
  const res = await fetch(`${HOST}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${pathname}: ${JSON.stringify(json).slice(0, 400)}`);
  return json;
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

async function uploadImage(objectId, displayName) {
  const idempotencyKey = `hg-lash-${objectId.slice(-10)}-${Date.now().toString(36).slice(-5)}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`.slice(0, 46),
      image_data: {
        name: displayName,
        caption: `${displayName} — Hello Gorgeous Med Spa`,
      },
    },
  };
  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(requestBody)], { type: "application/json" }));
  form.append("file", new Blob([fs.readFileSync(IMAGE)], { type: "image/jpeg" }), path.basename(IMAGE));
  const res = await fetch(`${HOST}/v2/catalog/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json).slice(0, 300));
  return json.image?.id;
}

async function upsertKeeper(item, keeper) {
  const obj = JSON.parse(JSON.stringify(item));
  const data = obj.item_data;
  data.name = keeper.name;
  data.description = keeper.description;
  delete data.description_html;
  delete data.description_plaintext;

  const variation =
    data.variations?.find((v) => !v.is_deleted) || data.variations?.[0];
  if (!variation?.item_variation_data) throw new Error(`No variation on ${item.id}`);
  variation.item_variation_data.price_money = {
    amount: keeper.priceCents,
    currency: "USD",
  };
  variation.item_variation_data.pricing_type = "FIXED_PRICING";
  variation.item_variation_data.service_duration = keeper.durationMs;
  if (variation.item_variation_data.name) {
    variation.item_variation_data.name = "Regular";
  }

  await square("POST", "/v2/catalog/object", {
    idempotency_key: `hg-lash-keep-${item.id}-${Date.now()}`,
    object: obj,
  });
}

async function main() {
  console.log(`\nRevise Lash Spa menu ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  if (!fs.existsSync(IMAGE)) {
    console.error("Missing image:", IMAGE);
    process.exit(1);
  }

  const items = (await listCatalog("ITEM")).filter(
    (o) =>
      o.item_data?.product_type === "APPOINTMENTS_SERVICE" &&
      !o.is_deleted &&
      isLashSpaService(o.item_data?.name || ""),
  );

  console.log(`Found ${items.length} lash-related services\n`);

  const keepIds = new Set();
  const matchedKeepers = [];

  for (const keeper of KEEPERS) {
    const hit = items.find((o) => keeper.match.test(o.item_data.name));
    if (!hit) {
      console.log(`  ⚠ missing keeper match: ${keeper.name}`);
      continue;
    }
    keepIds.add(hit.id);
    matchedKeepers.push({ item: hit, keeper });
    const cents = hit.item_data.variations?.[0]?.item_variation_data?.price_money?.amount;
    console.log(
      `  KEEP  ${hit.item_data.name} → ${keeper.name}  $${(cents ?? 0) / 100} → $${keeper.priceCents / 100}`,
    );
  }

  // Prefer Volume Full Set over Mega Volume; if Volume Full Set missing, promote Mega
  if (![...matchedKeepers].some((m) => m.keeper.name.startsWith("Volume"))) {
    const mega = items.find((o) => /mega volume/i.test(o.item_data.name));
    if (mega) {
      const keeper = KEEPERS.find((k) => k.name.startsWith("Volume"));
      keepIds.add(mega.id);
      matchedKeepers.push({ item: mega, keeper });
      console.log(`  KEEP  ${mega.item_data.name} → ${keeper.name} (promoted from Mega)`);
    }
  }

  const toDelete = items.filter((o) => !keepIds.has(o.id));
  console.log(`\nDELETE ${toDelete.length} services:`);
  for (const o of toDelete) console.log(`  ✕ ${o.item_data.name}`);

  if (DRY_RUN) {
    console.log("\nDry run only — re-run with --apply to push.");
    return;
  }

  for (const { item, keeper } of matchedKeepers) {
    process.stdout.write(`  → upsert ${keeper.name}... `);
    await upsertKeeper(item, keeper);
    await uploadImage(item.id, keeper.name);
    console.log("ok");
    await new Promise((r) => setTimeout(r, 250));
  }

  // Batch delete leftovers (object_ids)
  const deleteIds = toDelete.map((o) => o.id);
  for (let i = 0; i < deleteIds.length; i += 100) {
    const chunk = deleteIds.slice(i, i + 100);
    if (!chunk.length) continue;
    const res = await square("POST", "/v2/catalog/batch-delete", {
      object_ids: chunk,
    });
    console.log(`  Deleted ${chunk.length} (batch ${i / 100 + 1})`, res.deleted_object_ids?.length ?? "");
  }

  console.log(`\nDone. Kept ${matchedKeepers.length}, deleted ${toDelete.length}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
