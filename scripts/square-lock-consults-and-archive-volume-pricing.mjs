#!/usr/bin/env node
/**
 * Two owner-approved Square catalog corrections:
 *
 * 1. Peptide consults are prescribing visits. Every service in the
 *    "RE GEN Peptide Therapy" category becomes 15 min and bookable by
 *    Ryan Kent, FNP-BC only — he is the sole prescriber, so a client must never
 *    land on a peptide consult held by a non-prescriber.
 *
 * 2. Archive the volume-priced weight-loss services. Letting staff pick a price
 *    by injection volume at the counter undercharged a real order (10 ml across
 *    four syringes billed as $299). Archiving (never deleting) keeps order
 *    history intact while removing the services from booking + the storefront.
 *
 * Existing objects are updated in place with their current `version` so Square's
 * optimistic concurrency catches a conflicting edit instead of silently
 * clobbering it. Nothing here creates or deletes catalog objects.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-lock-consults-and-archive-volume-pricing.mjs --dry-run
 *   node --env-file=.env.local scripts/square-lock-consults-and-archive-volume-pricing.mjs --apply
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

const TEAM = {
  ryan: "TM1IptWCrgxkY4p7",
  danielle: "TMqnS9cNU-3s3lUR",
  michelle: "TMqy8tRlmyMRkQ25",
};
const TEAM_NAMES = Object.fromEntries(
  Object.entries(TEAM).map(([name, id]) => [id, name[0].toUpperCase() + name.slice(1)]),
);

/** Prescribing visit — only the NP may hold these. */
const PRESCRIBER_ONLY = [TEAM.ryan];

const CATEGORY_NAME = "RE GEN Peptide Therapy";
const CONSULT_DURATION_MIN = 15;

const MIN = (n) => n * 60 * 1000;

/**
 * Volume-priced weight-loss services to archive, keyed by ITEM_VARIATION id.
 * Each resolves to its parent ITEM at runtime — archiving the variation alone
 * would leave the item bookable.
 */
const ARCHIVE_VARIATION_IDS = [
  "WALSF34PRQB5BS4C4YTRGFIC", // Tirzepatide — up to 5 ml per injection ($349)
  "CUS44L6KX2OZQV6A5PXCYFHJ", // Tirzepatide — 5ml-10 ml per injection ($500)
  "J6ARQW65RQGTDEXJGFR5ZQVW", // Tirzepatide — 12 ML-15ML ($550)
  "63DGFSFFUDUDFUMUJOW6XDCS", // Prepaid injection- weight loss - Free ($0)
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

const who = (ids) => (ids || []).map((id) => TEAM_NAMES[id] || id).join(", ") || "(none)";
const mins = (ms) => (ms == null ? "—" : `${ms / 60000}min`);

async function upsert(object, keyPrefix) {
  return square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `${keyPrefix}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
}

/** Set every variation of a peptide service to 15 min, NP-only. */
async function lockConsultToPrescriber(item) {
  const name = item.item_data?.name ?? item.id;
  const variations = item.item_data?.variations || [];
  const needsChange = variations.some((v) => {
    const d = v.item_variation_data || {};
    const team = [...(d.team_member_ids || [])].sort();
    return (
      d.service_duration !== MIN(CONSULT_DURATION_MIN) ||
      team.length !== PRESCRIBER_ONLY.length ||
      team.join() !== [...PRESCRIBER_ONLY].sort().join()
    );
  });

  for (const v of variations) {
    const d = v.item_variation_data || {};
    console.log(
      `  ${name} / "${d.name}": ${mins(d.service_duration)} → ${CONSULT_DURATION_MIN}min · [${who(d.team_member_ids)}] → [${who(PRESCRIBER_ONLY)}]`,
    );
  }

  if (!needsChange) {
    console.log(`    · already 15min / NP-only — skipping`);
    return { changed: false, ok: true };
  }
  if (DRY_RUN) return { changed: true, ok: true };

  const object = structuredClone(item);
  for (const v of object.item_data.variations || []) {
    v.item_variation_data = {
      ...v.item_variation_data,
      service_duration: MIN(CONSULT_DURATION_MIN),
      team_member_ids: [...PRESCRIBER_ONLY],
    };
  }

  try {
    await upsert(object, "hg-pep-consult-lock");
    console.log(`    ✓ updated`);
    await sleep(220);
    return { changed: true, ok: true };
  } catch (err) {
    console.error(`    ✕ ${name}:`, err instanceof Error ? err.message.slice(0, 320) : err);
    return { changed: true, ok: false };
  }
}

/** Archive a parent item and pull every variation out of booking. */
async function archiveItem(item) {
  const name = item.item_data?.name ?? item.id;
  console.log(
    `  ${name} (${item.id}): archived=${!!item.item_data?.is_archived} → true · ecom_visibility=${item.item_data?.ecom_visibility} → UNINDEXED`,
  );
  for (const v of item.item_data?.variations || []) {
    console.log(
      `    var ${v.id} bookable=${v.item_variation_data?.available_for_booking} → false`,
    );
  }

  if (DRY_RUN) return { ok: true };

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
    await upsert(object, "hg-wl-archive");
    console.log(`    ✓ archived`);
    await sleep(220);
    return { ok: true };
  } catch (err) {
    console.error(`    ✕ ${name}:`, err instanceof Error ? err.message.slice(0, 320) : err);
    return { ok: false };
  }
}

async function main() {
  console.log(`\n🔒 Square consult lock + volume-pricing archive ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const live = items.filter((o) => o.type === "ITEM" && !o.is_deleted);

  console.log(`1. ${CATEGORY_NAME} → ${CONSULT_DURATION_MIN}min, bookable by ${who(PRESCRIBER_ONLY)} only\n`);
  const category = categories.find((c) => c.category_data?.name === CATEGORY_NAME);
  if (!category) {
    console.error(`  ✕ category "${CATEGORY_NAME}" not found — aborting`);
    process.exit(1);
  }

  // Membership by category id, not by name pattern: the protocol services are
  // named "<Peptide> Protocol — Start" and a name regex would miss them.
  const peptideItems = live.filter((i) => {
    const d = i.item_data || {};
    return (
      (d.categories || []).some((c) => c.id === category.id) ||
      d.reporting_category?.id === category.id ||
      d.category_id === category.id
    );
  });
  console.log(`  ${peptideItems.length} service(s) in category ${category.id}\n`);

  let locked = 0;
  let lockFail = 0;
  for (const item of peptideItems) {
    const res = await lockConsultToPrescriber(item);
    if (!res.ok) lockFail++;
    else if (res.changed) locked++;
  }

  console.log(`\n2. Archive volume-priced weight-loss services\n`);
  const archiveTargets = [];
  for (const varId of ARCHIVE_VARIATION_IDS) {
    const parent = live.find((i) => (i.item_data?.variations || []).some((v) => v.id === varId));
    if (!parent) {
      console.error(`  ✕ no parent ITEM found for variation ${varId} — aborting before any archive`);
      process.exit(1);
    }
    if (!archiveTargets.some((t) => t.id === parent.id)) archiveTargets.push(parent);
  }

  let archived = 0;
  let archiveFail = 0;
  for (const item of archiveTargets) {
    const res = await archiveItem(item);
    if (res.ok) archived++;
    else archiveFail++;
  }

  console.log(`\nDone. consults_updated=${locked} consult_failures=${lockFail} archived=${archived} archive_failures=${archiveFail}`);
  console.log("Archived items keep their order history — nothing was deleted.");
  if (DRY_RUN) console.log("\nRe-run with --apply to write to Square.\n");
  else console.log("");

  if (lockFail || archiveFail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
