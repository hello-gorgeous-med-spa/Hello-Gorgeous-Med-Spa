#!/usr/bin/env node
/**
 * Catalog hygiene for Square Appointments:
 * - Report $0 ghosts / likely Fresha duplicates
 * - Optionally archive (delete) named ghosts
 * - Pin package SKUs to the top of key categories via ordinal
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-catalog-hygiene.mjs
 *   node --env-file=.env.local scripts/square-catalog-hygiene.mjs --apply
 *   node --env-file=.env.local scripts/square-catalog-hygiene.mjs --apply --archive-ghosts
 */

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const ARCHIVE_GHOSTS = args.includes("--archive-ghosts");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

const BODY_CAT = "Body Contouring & Devices";
const LASER_CAT = "Laser Hair Removal";
const FLOW_CAT = "FlowWave";

/** Names that should sit at the top of their category (lower ordinal = earlier). */
const PIN_TOP = [
  { re: /^Morpheus8 Burst — 3 Session Package$/i, cat: BODY_CAT, ordinal: -2251799813685248 },
  { re: /^Quantum RF — Neck Package/i, cat: BODY_CAT, ordinal: -2251799812000000 },
  { re: /^Quantum RF — Abdomen Package/i, cat: BODY_CAT, ordinal: -2251799810314752 },
  { re: /^Solaria CO₂ — Face Treatment/i, cat: BODY_CAT, ordinal: -2251799808629504 },
  { re: /^The Trifecta$/i, cat: BODY_CAT, ordinal: -2251799806944256 },
  { re: /^Laser Brazilian — 3-Month Package$/i, cat: LASER_CAT, ordinal: -2251799813685248 },
  { re: /^FlowWave Shockwave — 6-Session Package$/i, cat: FLOW_CAT, ordinal: -2251799813685248 },
  { re: /^FlowWave Shockwave — 12-Session Package$/i, cat: FLOW_CAT, ordinal: -2251799812000000 },
  { re: /^Recovery Stack — 1 Month/i, cat: FLOW_CAT, ordinal: -2251799810314752 },
];

/** Safe-to-archive ghosts when --archive-ghosts (exact name match). Keep intentional $0 consults. */
const ARCHIVE_EXACT = new Set(
  [
    // Add known Fresha leftovers here after dry-run review — keep prepaid visit + free consults.
  ].map((s) => s.toLowerCase()),
);

/** Hide from online booking (keep in library for history) — messy / superseded SKUs. */
const HIDE_FROM_BOOKING = [
  /morpheus8 burst \(full face\)\s*-/i, // garbled name leftover
  /^the dani,? fix me trifecta$/i,
  /^morpheus8 burst — buy one area/i, // promo noise; keep VIP + package + combo
];

/** Report-only: zero-price services that are expected to stay. */
const KEEP_ZERO = [/prepaid package visit/i, /^consultation$/i, /consultation — free/i, /free$/i, /prepaid injection/i];

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

function money(item) {
  return item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount ?? null;
}

async function main() {
  console.log(`\n🧹 Square catalog hygiene (${APPLY ? "APPLY" : "DRY-RUN"}${ARCHIVE_GHOSTS ? " + archive" : ""})\n`);

  const cats = (await listCatalog("CATEGORY")).filter((c) => !c.is_deleted);
  const catByName = new Map(cats.map((c) => [c.category_data?.name, c.id]));
  const catById = new Map(cats.map((c) => [c.id, c.category_data?.name]));
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  // Multi-category / missing category report
  const noCat = items.filter((o) => !(o.item_data.categories?.length || o.item_data.category_id));
  console.log(`Services: ${items.length}`);
  console.log(`Missing category: ${noCat.length}`);
  noCat.slice(0, 15).forEach((o) => console.log("  ?", o.item_data.name));

  const zeros = items.filter((o) => {
    const c = money(o);
    return c === 0 || c == null;
  });
  console.log(`\n$0 / null price: ${zeros.length}`);
  for (const o of zeros) {
    const keep = KEEP_ZERO.some((re) => re.test(o.item_data.name));
    console.log(keep ? "  KEEP" : "  LOOK", `$${(money(o) ?? 0) / 100}`, o.item_data.name);
  }

  // Duplicate-ish names (normalized)
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const buckets = new Map();
  for (const o of items) {
    const k = norm(o.item_data.name);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(o);
  }
  const dups = [...buckets.values()].filter((g) => g.length > 1);
  console.log(`\nExact-normalized duplicate name groups: ${dups.length}`);
  dups.slice(0, 20).forEach((g) => {
    console.log("  DUP", g.map((o) => o.item_data.name).join(" | "));
  });

  // Pin packages
  console.log("\nPin packages to top of categories:");
  for (const pin of PIN_TOP) {
    const catId = catByName.get(pin.cat);
    if (!catId) {
      console.log("  ✕ no category", pin.cat);
      continue;
    }
    const hit = items.find((o) => pin.re.test(o.item_data.name));
    if (!hit) {
      console.log("  — not found", pin.re);
      continue;
    }
    const cur = hit.item_data.categories?.find((c) => c.id === catId)?.ordinal;
    const needs = String(cur) !== String(pin.ordinal);
    console.log(needs ? "  PIN" : "  ok ", hit.item_data.name, `ordinal ${cur} → ${pin.ordinal}`);
    if (!APPLY || !needs) continue;
    try {
      const categories = [{ id: catId, ordinal: pin.ordinal }];
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: `hg-hygiene-pin-${hit.id}-${Date.now()}`,
        object: {
          type: "ITEM",
          id: hit.id,
          version: hit.version,
          present_at_all_locations: hit.present_at_all_locations !== false,
          item_data: {
            ...hit.item_data,
            category_id: catId,
            categories,
          },
        },
      });
      console.log("    ✓ pinned");
      await sleep(150);
    } catch (e) {
      console.log("    FAILED", e.message);
    }
  }

  // Hide superseded SKUs from online booking
  console.log("\nHide from online booking:");
  for (const o of items) {
    if (!HIDE_FROM_BOOKING.some((re) => re.test(o.item_data.name))) continue;
    const v = o.item_data.variations?.[0];
    const avail = v?.item_variation_data?.available_for_booking;
    console.log(avail === false ? "  ok " : "  HIDE", o.item_data.name);
    if (!APPLY || avail === false || !v) continue;
    try {
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: `hg-hygiene-hide-${o.id}-${Date.now()}`,
        object: {
          type: "ITEM",
          id: o.id,
          version: o.version,
          present_at_all_locations: o.present_at_all_locations !== false,
          item_data: {
            ...o.item_data,
            variations: [
              {
                ...v,
                item_variation_data: {
                  ...v.item_variation_data,
                  available_for_booking: false,
                },
              },
            ],
          },
        },
      });
      console.log("    ✓ unavailable for booking");
      await sleep(150);
    } catch (e) {
      console.log("    FAILED", e.message);
    }
  }

  if (ARCHIVE_GHOSTS) {
    console.log("\nArchive ghosts:");
    for (const o of items) {
      if (!ARCHIVE_EXACT.has(o.item_data.name.toLowerCase())) continue;
      console.log("  ARCHIVE", o.item_data.name, o.id);
      if (!APPLY) continue;
      try {
        const res = await fetch(`${HOST}/v2/catalog/object/${o.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.errors?.[0]?.detail || res.status);
        console.log("    ✓ deleted");
        await sleep(150);
      } catch (e) {
        console.log("    FAILED", e.message);
      }
    }
  }

  // Category membership spot-check for color map
  console.log("\nSpot-check samples (category):");
  const samples = [
    [/b12 injection/i, "Vitamin Injections"],
    [/semaglutide|tirzepatide/i, "Weight Loss Injections"],
    [/flowwave shockwave — single/i, "FlowWave"],
    [/morpheus8 burst — 3 session/i, "Body Contouring & Devices"],
    [/laser hair removal — brazilian \(single/i, "Laser Hair Removal"],
    [/hybrid full set|lash lift/i, "Lash Spa"],
    [/medical visit with ryan|^consultation$/i, "Medical Consultations"],
  ];
  for (const [re, expect] of samples) {
    const hit = items.find((o) => re.test(o.item_data.name));
    if (!hit) {
      console.log("  — missing", re);
      continue;
    }
    const cid = hit.item_data.categories?.[0]?.id || hit.item_data.category_id;
    const name = catById.get(cid) || "?";
    const ok = name === expect;
    console.log(ok ? "  ✓" : "  ✕", hit.item_data.name.slice(0, 50), "→", name, ok ? "" : `(want ${expect})`);
  }

  console.log(APPLY ? "\nDone.\n" : "\nDry-run only. Re-run with --apply to pin packages.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
