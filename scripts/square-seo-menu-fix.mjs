#!/usr/bin/env node
/**
 * Square menu + SEO hygiene (production):
 * - Archive ghosts (hide from booking, unindex) — never delete (order history)
 * - Clinic no longer offers BioTE pellets — archive leftover pellet SKUs, do not restore
 * - Restore Kybella so the site page has a bookable SKU
 * - Categorize uncategorized FlowWave packs + hormone lab panel
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-seo-menu-fix.mjs --dry-run
 *   node --env-file=.env.local scripts/square-seo-menu-fix.mjs --apply
 */

import crypto from "node:crypto";

const APPLY = process.argv.includes("--apply");
const DRY_RUN = !APPLY;

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
};

/** Archive (not delete) — garbled leftovers, duplicates, never-client-visible. */
const ARCHIVE_RES = [
  /^retatrutide/i,
  /^\(hylanex\) lip dissolver/i,
  /morpheus8 burst \(full face\)/i,
  /^the dani,? fix me trifecta$/i,
  /^tirzepatide \(zepbound\/mounjaro\)/i,
  /^vitamin injections \(alt\)$/i,
  /^prepaid injection- weight loss/i,
  /^pellet therapy/i,
];

const FLOW_CATEGORY = "FlowWave";
const FILLER_CATEGORY = "Dermal Fillers";
const CONSULT_CATEGORY = "Medical Consultations";

const RESTORE = [
  {
    name: "Kybella",
    price: 60000,
    duration: 30,
    category: FILLER_CATEGORY,
    team: [TEAM.danielle, TEAM.ryan],
    description:
      "FDA-approved Kybella for submental fullness (double chin) in Oswego, IL. Series often recommended. Swelling is expected — we plan around your calendar. Hello Gorgeous Med Spa.",
  },
];

async function square(method, apiPath, body) {
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
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = json?.errors?.[0];
    throw new Error(err?.detail || err?.code || `HTTP ${res.status}`);
  }
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
    if (!res.ok) throw new Error(JSON.stringify(json.errors || json));
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function upsert(object, prefix) {
  return square("POST", "/catalog/object", {
    idempotency_key: `${prefix}-${crypto.randomBytes(4).toString("hex")}`,
    object,
  });
}

async function archiveItem(item) {
  const name = item.item_data?.name ?? item.id;
  const already = item.item_data?.is_archived && item.item_data?.ecom_visibility === "UNINDEXED";
  console.log(`  ARCHIVE ${name}${already ? " (already)" : ""}`);
  if (DRY_RUN || already) return;
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
  await upsert(object, "hg-seo-archive");
  console.log("    ✓");
  await sleep(180);
}

async function assignCategory(item, categoryId, label) {
  const d = item.item_data || {};
  const has = d.category_id === categoryId || (d.categories || []).some((c) => c.id === categoryId);
  if (has) return;
  console.log(`  CATEGORY ${d.name} → ${label}`);
  if (DRY_RUN) return;
  const object = structuredClone(item);
  object.item_data.category_id = categoryId;
  object.item_data.categories = [{ id: categoryId }];
  await upsert(object, "hg-seo-cat-assign");
  console.log("    ✓");
  await sleep(150);
}

async function restoreService(svc, categoryId, items) {
  const existing = items.find(
    (o) => (o.item_data?.name || "").toLowerCase() === svc.name.toLowerCase() && !o.is_deleted,
  );
  if (existing) {
    const archived = existing.item_data?.is_archived;
    console.log(`  KEEP ${svc.name}${archived ? " — unarchive + bookable" : ""}`);
    if (DRY_RUN || !archived) return;
    const object = structuredClone(existing);
    object.item_data.is_archived = false;
    object.item_data.ecom_available = true;
    object.item_data.ecom_visibility = "VISIBLE";
    if (categoryId) {
      object.item_data.category_id = categoryId;
      object.item_data.categories = [{ id: categoryId }];
    }
    for (const v of object.item_data.variations || []) {
      v.item_variation_data = {
        ...v.item_variation_data,
        available_for_booking: true,
        team_member_ids: svc.team,
      };
    }
    await upsert(object, "hg-seo-restore");
    console.log("    ✓ restored");
    await sleep(180);
    return;
  }

  console.log(`  CREATE ${svc.name}  $${svc.price / 100}`);
  if (DRY_RUN) return;
  const slug = svc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 36);
  const itemTemp = `#seo-${slug}-item`;
  const varTemp = `#seo-${slug}-var`;
  await upsert(
    {
      type: "ITEM",
      id: itemTemp,
      present_at_all_locations: true,
      item_data: {
        name: svc.name,
        description: svc.description,
        product_type: "APPOINTMENTS_SERVICE",
        ...(categoryId ? { categories: [{ id: categoryId }], category_id: categoryId } : {}),
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varTemp,
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemTemp,
              name: "Regular",
              pricing_type: "FIXED_PRICING",
              price_money: { amount: svc.price, currency: "USD" },
              service_duration: svc.duration * 60_000,
              available_for_booking: true,
              team_member_ids: svc.team,
            },
          },
        ],
      },
    },
    "hg-seo-create",
  );
  console.log("    ✓ created");
  await sleep(180);
}

async function main() {
  console.log(`\nSquare SEO menu fix ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"} · ${HOST}\n`);

  const [categories, rawItems] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const items = rawItems.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE" && !o.is_deleted);

  console.log("1. Archive ghosts (unindex + hide from booking)\n");
  const toArchive = items.filter((o) => ARCHIVE_RES.some((re) => re.test(o.item_data?.name || "")));
  if (!toArchive.length) console.log("  none matched");
  for (const item of toArchive) await archiveItem(item);

  console.log("\n2. Categories for hormone labs + FlowWave packs\n");
  const consultId = categories.find((c) => c.category_data?.name === CONSULT_CATEGORY)?.id;
  const flowId = categories.find((c) => c.category_data?.name === FLOW_CATEGORY)?.id;
  const hormonePanel = items.find((o) => /hormone lab panel/i.test(o.item_data?.name || ""));
  if (hormonePanel && consultId) await assignCategory(hormonePanel, consultId, CONSULT_CATEGORY);
  if (flowId) {
    for (const item of items) {
      const n = item.item_data?.name || "";
      if (/^flowwave shockwave — (5|10)-session/i.test(n)) {
        await assignCategory(item, flowId, FLOW_CATEGORY);
      }
    }
  }

  const emptyJuly = categories.find((c) => c.category_data?.name === "End of July Specials" && !c.is_deleted);
  if (emptyJuly) {
    const used = items.some(
      (o) =>
        o.item_data?.category_id === emptyJuly.id ||
        (o.item_data?.categories || []).some((c) => c.id === emptyJuly.id),
    );
    console.log(`  End of July Specials category ${used ? "still has items — leave" : "empty — delete"}`);
    if (!used && APPLY) {
      await fetch(`${HOST}/v2/catalog/object/${emptyJuly.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
      });
      console.log("    ✓ category deleted");
    }
  }

  console.log("\n3. Restore bookable SKU (Kybella only — no pellets)\n");
  const fillerId = categories.find((c) => c.category_data?.name === FILLER_CATEGORY)?.id;
  for (const svc of RESTORE) {
    await restoreService(svc, fillerId, items);
  }

  console.log(DRY_RUN ? "\nDry-run only. Re-run with --apply to write Square.\n" : "\nDone.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
