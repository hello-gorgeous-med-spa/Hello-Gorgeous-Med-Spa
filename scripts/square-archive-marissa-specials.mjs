#!/usr/bin/env node
/**
 * Archive Square Appointments services tied to Marissa specials / her name.
 *
 *   node --env-file=.env.local scripts/square-archive-marissa-specials.mjs
 *   node --env-file=.env.local scripts/square-archive-marissa-specials.mjs --apply
 */

const APPLY = process.argv.includes("--apply");
const envName = (process.env.SQUARE_ENVIRONMENT || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const MARISSA_TEAM_ID = "TMjZzrkoSsBocyWm";

/** Match only catalog *names* that include Marissa (never description-only). */

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
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

async function batchDelete(objectIds) {
  const res = await fetch(`${HOST}/v2/catalog/batch-delete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ object_ids: objectIds }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

/** Only archive promo SKUs that name Marissa — not every service she was assigned to. */
function serviceMentionsMarissa(item) {
  const name = item.item_data?.name || "";
  return /marissa/i.test(name);
}

async function main() {
  console.log(`\nSquare archive Marissa specials (${APPLY ? "APPLY" : "DRY-RUN"})\n`);
  const items = (await listCatalog("ITEM")).filter(
    (o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  const hits = items.filter(serviceMentionsMarissa);
  if (!hits.length) {
    console.log("No Marissa-named appointment services found.");
    // Still list anything with Marissa in name for visibility
    const loose = items.filter((o) => /marissa/i.test(o.item_data?.name || ""));
    for (const o of loose) console.log(`  (name only) ${o.id}  ${o.item_data?.name}`);
    return;
  }

  for (const o of hits) {
    console.log(`  ${APPLY ? "ARCHIVE" : "WOULD ARCHIVE"}  ${o.id}  ${o.item_data?.name}`);
  }

  if (!APPLY) {
    console.log("\nRe-run with --apply to archive these catalog items.\n");
    return;
  }

  const ids = hits.map((o) => o.id);
  // Square batch-delete max 1000; we have a handful
  const result = await batchDelete(ids);
  console.log("\nDeleted:", result.deleted_object_ids?.length ?? 0, "objects");
  if (result.errors?.length) console.error(result.errors);
  console.log("Done.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
