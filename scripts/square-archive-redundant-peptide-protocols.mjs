#!/usr/bin/env node
/**
 * Archive the nine "<Peptide> Protocol — Start" booking services.
 *
 * After the consult lock (see square-lock-consults-and-archive-volume-pricing.mjs)
 * all ten services in the "RE GEN Peptide Therapy" category were identical —
 * $49, 15 min, Ryan-only — differing only by the peptide in the title. The
 * intake form already captures which peptide the client wants, so nine extra
 * calendar options were redundant and an easy mis-book. The single
 * "RE GEN Peptide Consult" is the one front door and must stay bookable.
 *
 * The archive set is *derived* from category membership minus the consult,
 * then cross-checked against an explicit id allowlist, so a mis-tagged category
 * can never sweep an unexpected service into the archive.
 *
 * Archive only — nothing is deleted, so order history stays intact.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-archive-redundant-peptide-protocols.mjs --dry-run
 *   node --env-file=.env.local scripts/square-archive-redundant-peptide-protocols.mjs --apply
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

const RYAN = "TM1IptWCrgxkY4p7";
const CATEGORY_NAME = "RE GEN Peptide Therapy";

/** The one service that must survive, bookable / 15 min / Ryan-only. */
const KEEP_VARIATION_ID = "7QOZ5JWUYXB2622D5XZWJ6FR";
const KEEP_ITEM_ID = "IIN6FBION24UJTUZE7UF2VP5";
const CONSULT_DURATION_MS = 15 * 60 * 1000;

/** Expected archive set — cross-check against what category membership derives. */
const EXPECTED_ARCHIVE_ITEM_IDS = new Set([
  "UGYVSSHGWVIC7VRULBYRZ7GX", // BPC-157 Protocol — Start
  "65O6AARNN5TZWOSQS72G3DN5", // Sermorelin Protocol — Start
  "NS3NYHMOCHMV3MTIEO6UKNKK", // NAD+ Protocol — Start
  "UC6NSJ7QSSLFEYBDTDEV7COF", // GHK-Cu Protocol — Start
  "PTITEXBMG42VH2X6ZUVYY3JB", // TB-500 Protocol — Start
  "TWHTMUKDC6EA2UFBZ63JRU4H", // PT-141 Protocol — Start
  "6KGQPBUO63HSAJHGSEWQBAKX", // Tesamorelin Protocol — Start
  "LBXPRB4FPMZIAOZFH3OM4WGL", // CJC / Ipamorelin Protocol — Start
  "XT5JBKMVFCEF6X6ZXTOAADRS", // Recovery Blend Protocol — Start
]);

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

async function archiveItem(item) {
  const d = item.item_data || {};
  console.log(`  ${d.name} (${item.id})`);
  console.log(`      archived=${!!d.is_archived} → true`);
  for (const v of d.variations || []) {
    console.log(`      var ${v.id} bookable=${v.item_variation_data?.available_for_booking} → false`);
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
    v.item_variation_data = { ...v.item_variation_data, available_for_booking: false };
  }

  try {
    await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-pep-protocol-archive-${crypto.randomBytes(4).toString("hex")}`,
        object,
      },
    });
    console.log(`      ✓ archived`);
    await sleep(220);
    return { ok: true };
  } catch (err) {
    console.error(`      ✕`, err instanceof Error ? err.message.slice(0, 320) : err);
    return { ok: false };
  }
}

function assertConsultHealthy(item, label) {
  const d = item?.item_data;
  const v = d?.variations?.find((x) => x.id === KEEP_VARIATION_ID);
  const vd = v?.item_variation_data;
  const problems = [];
  if (!d) problems.push("consult item missing");
  if (!vd) problems.push(`variation ${KEEP_VARIATION_ID} missing`);
  if (d?.is_archived) problems.push("consult is archived");
  if (vd && vd.available_for_booking !== true) problems.push("consult not bookable");
  if (vd && vd.service_duration !== CONSULT_DURATION_MS) {
    problems.push(`duration ${vd.service_duration} != 15min`);
  }
  if (vd && (vd.team_member_ids || []).join() !== RYAN) {
    problems.push(`team [${(vd.team_member_ids || []).join(", ")}] != Ryan only`);
  }
  if (problems.length) {
    console.error(`  ✕ ${label}: ${problems.join("; ")}`);
    return false;
  }
  console.log(
    `  ✓ ${label}: "${d.name}" $${(vd.price_money?.amount ?? 0) / 100} · 15min · Ryan only · bookable · archived=false`,
  );
  return true;
}

async function main() {
  console.log(`\n🗄  Archive redundant peptide protocol services ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const live = items.filter((o) => o.type === "ITEM" && !o.is_deleted);

  const category = categories.find((c) => c.category_data?.name === CATEGORY_NAME);
  if (!category) {
    console.error(`  ✕ category "${CATEGORY_NAME}" not found — aborting`);
    process.exit(1);
  }

  const inCategory = live.filter((i) => {
    const d = i.item_data || {};
    return (
      (d.categories || []).some((c) => c.id === category.id) ||
      d.reporting_category?.id === category.id ||
      d.category_id === category.id
    );
  });

  const consult = live.find((i) =>
    (i.item_data?.variations || []).some((v) => v.id === KEEP_VARIATION_ID),
  );
  if (!consult || consult.id !== KEEP_ITEM_ID) {
    console.error(`  ✕ RE GEN Peptide Consult (${KEEP_ITEM_ID}) not found — aborting`);
    process.exit(1);
  }

  console.log(`Pre-flight — the service that must survive:`);
  if (!assertConsultHealthy(consult, "before")) process.exit(1);

  const targets = inCategory.filter((i) => i.id !== consult.id && !i.item_data?.is_archived);
  const already = inCategory.filter((i) => i.id !== consult.id && i.item_data?.is_archived);

  // Derived set must match the reviewed allowlist exactly — no surprises.
  const unexpected = [...targets, ...already].filter((i) => !EXPECTED_ARCHIVE_ITEM_IDS.has(i.id));
  if (unexpected.length) {
    console.error(`\n  ✕ unexpected item(s) in category, not on the approved list — aborting:`);
    for (const i of unexpected) console.error(`      ${i.id} "${i.item_data?.name}"`);
    process.exit(1);
  }
  const missing = [...EXPECTED_ARCHIVE_ITEM_IDS].filter(
    (id) => ![...targets, ...already].some((i) => i.id === id),
  );
  if (missing.length) {
    console.error(`\n  ✕ approved item(s) not found in category — aborting: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log(`\nArchiving ${targets.length} redundant service(s)${already.length ? ` (${already.length} already archived)` : ""}\n`);

  let ok = 0;
  let fail = 0;
  for (const item of targets) {
    const res = await archiveItem(item);
    if (res.ok) ok++;
    else fail++;
  }

  if (!DRY_RUN) {
    console.log(`\nPost-flight verification:`);
    const fresh = (await listCatalog("ITEM")).filter((o) => !o.is_deleted);
    const freshConsult = fresh.find((i) => i.id === KEEP_ITEM_ID);
    if (!assertConsultHealthy(freshConsult, "after")) process.exit(1);
  }

  console.log(`\nDone. archived=${ok} failed=${fail}`);
  console.log("Nothing deleted — archived services keep their order history.");
  if (DRY_RUN) console.log("\nRe-run with --apply to write to Square.\n");
  else console.log("");
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
