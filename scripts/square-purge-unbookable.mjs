#!/usr/bin/env node
/**
 * Delete leftover Square appointment SKUs that are off the book.
 * Keeps IV Hour, Vitamin Injection Bar, and consult/promo items that may come back.
 *
 *   node --env-file=.env.local scripts/square-purge-unbookable.mjs --dry-run
 *   node --env-file=.env.local scripts/square-purge-unbookable.mjs --apply
 */

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

const KEEP = [
  /^iv hour/i,
  /vitamin injection bar/i,
  /^microblading consultation$/i,
  /^prp — joint/i,
  /^wax — lip/i,
  /^morpheus8 burst — buy one area/i,
  /^the dani,? fix me trifecta$/i,
];

const DELETE = [
  /^iv drip — /i,
  /^iv drip – /i,
  /^vitamin injections \(alt\)$/i,
  /^\(hylanex\) lip dissolver/i,
  /^4-week tirzepatide program$/i,
  /^tirzepatide — initial consult/i,
  /^tirzepatide — monthly maintenance$/i,
  /^tirzepatide \(zepbound/i,
  /^tirzepitide 10 week/i,
  /^prepaid injection- weight loss/i,
  /^retatrutide/i,
  /^laser hair removal special — /i,
  /^morpheus8 burst \(full face\)/i,
  /protocol — start$/i,
];

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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${pathname}: ${JSON.stringify(data.errors || data).slice(0, 500)}`);
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
  return out;
}

function shouldDelete(name) {
  if (KEEP.some((re) => re.test(name))) return false;
  return DELETE.some((re) => re.test(name));
}

async function main() {
  const items = (await listCatalog("ITEM")).filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  const doomed = items
    .filter((o) => shouldDelete(o.item_data?.name || ""))
    .sort((a, b) => (a.item_data?.name || "").localeCompare(b.item_data?.name || ""));

  console.log(`\nSquare unbookable purge ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  for (const o of doomed) {
    const book = (o.item_data?.variations || []).some((v) => v.item_variation_data?.available_for_booking);
    console.log(`  ${book ? "BOOK?" : "DEAD"}  ${o.item_data?.name}`);
  }
  console.log(`\nWould delete: ${doomed.length}`);

  if (DRY_RUN || !doomed.length) {
    if (DRY_RUN) console.log("Re-run with --apply to delete from Square.\n");
    return;
  }

  const ids = doomed.map((o) => o.id);
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const result = await square("/v2/catalog/batch-delete", {
      method: "POST",
      body: { object_ids: chunk },
    });
    const deleted = result.deleted_object_ids || chunk;
    console.log(`  ✓ deleted ${deleted.length}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
