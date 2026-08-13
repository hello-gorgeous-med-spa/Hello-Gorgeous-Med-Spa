#!/usr/bin/env node
/**
 * Two owner-approved corrections to the in-clinic vitamin injection menu:
 *
 * 1. One price for every vitamin shot: $25. MIC/Lipo-B and Glutathione were
 *    $35 while B12, B-Complex, and the Vitamin Injection Bar were $25, so the
 *    published "vitamin injections are $25" promise did not match the register.
 *
 * 2. Archive "Vitamin Injections (Alt)" — a same-price duplicate of
 *    "Vitamin Injection Bar — Choose Your Shot" that only adds a way to
 *    mis-book.
 *
 * These are the in-clinic *services* (a nurse gives the shot). They are not the
 * pharmacy-shipped vials on /rx/wellness, which the pharmacy sends straight to
 * the patient's home and which are priced from the compounding cost.
 *
 * Existing objects are updated in place with their current `version`, so
 * Square's optimistic concurrency rejects a conflicting edit rather than
 * silently clobbering it. Nothing here creates or deletes catalog objects.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-normalize-vitamin-injection-pricing.mjs --dry-run
 *   node --env-file=.env.local scripts/square-normalize-vitamin-injection-pricing.mjs --apply
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

const VITAMIN_SHOT_USD = 25;

/** Services to reprice to $25, keyed by ITEM id with the price we expect to find. */
const REPRICE_ITEM_IDS = {
  OHPKEP4L5YTSGW4EGNY3KQPK: { label: "MIC/Lipo-B Injection", wasUsd: 35 },
  TBXL5YIAWTAYB3OKBOFAPJAZ: { label: "Glutathione Injection", wasUsd: 35 },
};

/** Same-price duplicate of the Vitamin Injection Bar. */
const ARCHIVE_ITEM_IDS = {
  TQ7RH2FXU6ZDF5PSUIIYORJK: { label: "Vitamin Injections (Alt)" },
};

/** Left alone — already $25. Asserted so a rename or repricing shows up here. */
const EXPECT_ALREADY_25 = {
  J3IKBXLEPNQR57UHMNZG35OZ: "B12 Injection",
  UCMYUEW5UWNTGHJ7FQCSAPQ7: "B-Complex Injection",
  FMUB3FRBJ24B5QV2JAQVRKAR: "Vitamin Injection Bar — Choose Your Shot",
};

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const dollars = (money) => (money?.amount ?? 0) / 100;

async function square(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${pathname}: ${JSON.stringify(json.errors || json).slice(0, 500)}`);
  return json;
}

async function listCatalog(type) {
  const out = [];
  let cursor;
  do {
    const url = new URL(`${HOST}/v2/catalog/list`);
    url.searchParams.set("types", type);
    if (cursor) url.searchParams.set("cursor", cursor);
    const json = await square(url.pathname + url.search);
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
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

async function repriceToFlatRate(item, expected) {
  const name = item.item_data?.name ?? item.id;
  const variations = item.item_data?.variations || [];

  const needsChange = variations.some((v) => {
    const d = v.item_variation_data || {};
    return d.pricing_type !== "FIXED_PRICING" || dollars(d.price_money) !== VITAMIN_SHOT_USD;
  });

  for (const v of variations) {
    const d = v.item_variation_data || {};
    console.log(
      `  ${name} / "${d.name}": $${dollars(d.price_money)} ${d.pricing_type} → $${VITAMIN_SHOT_USD} FIXED_PRICING`,
    );
  }

  if (!needsChange) {
    console.log(`    · already $${VITAMIN_SHOT_USD} fixed — skipping`);
    return { changed: false, ok: true };
  }
  if (DRY_RUN) return { changed: true, ok: true };

  const object = structuredClone(item);
  for (const v of object.item_data.variations || []) {
    v.item_variation_data = {
      ...v.item_variation_data,
      pricing_type: "FIXED_PRICING",
      price_money: USD(VITAMIN_SHOT_USD),
    };
  }

  try {
    await upsert(object, "hg-vitamin-flat-rate");
    console.log(`    ✓ updated (was $${expected.wasUsd})`);
    await sleep(220);
    return { changed: true, ok: true };
  } catch (err) {
    console.error(`    ✕ ${name}:`, err instanceof Error ? err.message.slice(0, 320) : err);
    return { changed: true, ok: false };
  }
}

async function archiveItem(item) {
  const name = item.item_data?.name ?? item.id;
  console.log(`  ${name} (${item.id}): archived=${!!item.item_data?.is_archived} → true`);
  for (const v of item.item_data?.variations || []) {
    console.log(`    var ${v.id} bookable=${v.item_variation_data?.available_for_booking} → false`);
  }

  if (item.item_data?.is_archived) {
    console.log(`    · already archived — skipping`);
    return { changed: false, ok: true };
  }
  if (DRY_RUN) return { changed: true, ok: true };

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
    };
  }

  try {
    await upsert(object, "hg-vitamin-archive-dupe");
    console.log(`    ✓ archived`);
    await sleep(220);
    return { changed: true, ok: true };
  } catch (err) {
    console.error(`    ✕ ${name}:`, err instanceof Error ? err.message.slice(0, 320) : err);
    return { changed: true, ok: false };
  }
}

async function main() {
  console.log(`\n💉 Vitamin injection menu — one price, no duplicate ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const items = await listCatalog("ITEM");
  const byId = new Map(items.filter((o) => !o.is_deleted).map((o) => [o.id, o]));

  // Abort before writing if the catalog no longer looks the way we reviewed it.
  const missing = [...Object.keys(REPRICE_ITEM_IDS), ...Object.keys(ARCHIVE_ITEM_IDS)].filter(
    (id) => !byId.has(id),
  );
  if (missing.length) {
    console.error(`Aborting — expected items not found in the catalog: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log("Already $25, left untouched:");
  for (const [id, label] of Object.entries(EXPECT_ALREADY_25)) {
    const item = byId.get(id);
    if (!item) {
      console.log(`  ? ${label} (${id}) — not found`);
      continue;
    }
    const prices = (item.item_data?.variations || []).map((v) => dollars(v.item_variation_data?.price_money));
    const drifted = prices.some((p) => p !== VITAMIN_SHOT_USD);
    console.log(`  ${drifted ? "!" : "·"} ${item.item_data?.name} — $${prices.join(", $")}`);
  }

  console.log(`\nReprice to $${VITAMIN_SHOT_USD}:\n`);
  let ok = 0;
  let fail = 0;
  for (const [id, expected] of Object.entries(REPRICE_ITEM_IDS)) {
    const res = await repriceToFlatRate(byId.get(id), expected);
    if (res.ok) ok++;
    else fail++;
  }

  console.log(`\nArchive duplicates:\n`);
  for (const id of Object.keys(ARCHIVE_ITEM_IDS)) {
    const res = await archiveItem(byId.get(id));
    if (res.ok) ok++;
    else fail++;
  }

  console.log(`\nDone. ok=${ok} failed=${fail}`);
  if (DRY_RUN) console.log("Re-run with --apply to write to Square.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
