#!/usr/bin/env node
/**
 * One Square IV booking: $150 / 60 min, Ryan + Kristina.
 * Customer picks a preset bag or build-your-own, optional NAD+ $25.
 * Old à-la-carte IV drips are deleted (see square-purge-unbookable.mjs).
 *
 *   node --env-file=.env.local scripts/square-upsert-iv-hour.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-iv-hour.mjs --apply
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
const KRISTINA = "TMHO9ZpVf-A62bgD";
const CATEGORY_NAME = "IV Drip Package Deals";
const LABEL_COLOR = "E6007E";

const SERVICE = {
  name: "IV Hour — Pick Your Bag",
  price: 150,
  durationMin: 60,
  aliases: ["IV Drip Hour", "The IV Hour", "IV Therapy Hour"],
  description: [
    "One hour. $150. Ryan Kent, FNP-BC or Kristina Huda, BSN, RN.",
    "",
    "Pick a popular preset — Hangover, Headache, Dehydration, Energy, Immunity, Myers' Cocktail, Beauty Glow, Recovery, Mental Clarity — or build your own bag at the chair.",
    "",
    "Add NAD+ for $25 if you want the cellular-energy boost.",
    "",
    "We screen you before the drip. Illinois only. Not an emergency visit. How you feel after a drip varies.",
    "",
    "Policies: hellogorgeousmedspa.com/service-policy · hellogorgeousmedspa.com/cancellation-policy — 24-hour cancel (48 hours for CO₂ / Morpheus8). Late cancel $50 or 50%. No-show $100 or 100%.",
  ].join("\n"),
};

const BAGS = [
  { key: "hangover", name: "Hangover Recovery" },
  { key: "headache", name: "Headache Relief" },
  { key: "dehydration", name: "Dehydration / Quench" },
  { key: "energy", name: "Energy Boost" },
  { key: "immunity", name: "Immunity" },
  { key: "myers", name: "Myers' Cocktail" },
  { key: "beauty", name: "Beauty Glow" },
  { key: "inner", name: "Inner Beauty" },
  { key: "recovery", name: "Recovery & Performance" },
  { key: "clarity", name: "Mental Clarity" },
  { key: "custom", name: "Build Your Own Bag" },
];

const RETIRE_FROM_BOOKING = [
  /^iv drip — /i,
  /^iv drip – /i,
];

const KEEP_BOOKABLE = [/^iv hour/i, /vitamin injection bar/i];

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;

async function square(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
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
    throw new Error(`${method} ${pathname}: ${JSON.stringify(data.errors || data).slice(0, 800)}`);
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

function findByName(objects, name, field) {
  const n = name.toLowerCase();
  return objects.find((o) => (o[field]?.name || "").trim().toLowerCase() === n);
}

async function upsertModifierList(existingLists, { key, name, selection, modifiers }) {
  const existing = findByName(existingLists, name, "modifier_list_data");
  const listId = existing?.id || `#ml-${key}`;
  const object = {
    type: "MODIFIER_LIST",
    id: listId,
    ...(existing?.version != null ? { version: existing.version } : {}),
    modifier_list_data: {
      name,
      selection_type: selection,
      modifiers: modifiers.map((m, i) => {
        const prev = existing?.modifier_list_data?.modifiers?.find((x) => x.modifier_data?.name === m.name);
        return {
          type: "MODIFIER",
          id: prev?.id || `#mod-${key}-${m.key}`,
          ...(prev?.version != null ? { version: prev.version } : {}),
          modifier_data: {
            name: m.name,
            price_money: USD(m.price),
            on_by_default: false,
            ordinal: i,
          },
        };
      }),
    },
  };

  if (DRY_RUN) {
    console.log(`  [dry-run] modifier list: ${name}`);
    return existing?.id || listId;
  }

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-iv-mod-${key}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
  console.log(`  ✓ modifier list: ${name} (${res.catalog_object?.id})`);
  return res.catalog_object.id;
}

async function main() {
  console.log(`\nIV Hour ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [categories, items, modifierLists] = await Promise.all([
    listCatalog("CATEGORY"),
    listCatalog("ITEM"),
    listCatalog("MODIFIER_LIST"),
  ]);
  const category = findByName(categories, CATEGORY_NAME, "category_data");
  if (!category) throw new Error(`Missing Square category: ${CATEGORY_NAME}`);

  const bagListId = await upsertModifierList(modifierLists, {
    key: "iv-bag",
    name: "Choose your IV bag",
    selection: "SINGLE",
    modifiers: BAGS.map((b) => ({ ...b, price: 0 })),
  });
  const nadListId = await upsertModifierList(modifierLists, {
    key: "iv-nad",
    name: "NAD+ upgrade",
    selection: "SINGLE",
    modifiers: [{ key: "nad", name: "Add NAD+ boost (+$25)", price: 25 }],
  });

  const appt = items.filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  const names = new Set([SERVICE.name, ...SERVICE.aliases].map((n) => n.toLowerCase()));
  const existing = appt.find((o) => names.has((o.item_data?.name || "").trim().toLowerCase()));
  const itemId = existing?.id || "#hg-iv-hour";
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || "#hg-iv-hour-var";

  const object = {
    type: "ITEM",
    id: itemId,
    present_at_all_locations: true,
    ...(existing?.version != null ? { version: existing.version } : {}),
    item_data: {
      name: SERVICE.name,
      description: SERVICE.description,
      product_type: "APPOINTMENTS_SERVICE",
      label_color: LABEL_COLOR,
      category_id: category.id,
      categories: [{ id: category.id }],
      ecom_available: true,
      ecom_visibility: "VISIBLE",
      is_taxable: true,
      is_archived: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          present_at_all_locations: true,
          ...(existingVar?.version != null ? { version: existingVar.version } : {}),
          item_variation_data: {
            item_id: itemId,
            name: existingVar?.item_variation_data?.name || "60 minutes",
            pricing_type: "FIXED_PRICING",
            price_money: USD(SERVICE.price),
            service_duration: MIN(SERVICE.durationMin),
            available_for_booking: true,
            sellable: true,
            team_member_ids: [RYAN, KRISTINA],
          },
        },
      ],
    },
  };

  console.log(`${existing ? "update" : "create"}: ${SERVICE.name} — $${SERVICE.price} / ${SERVICE.durationMin} min`);
  console.log("staff: Ryan Kent + Kristina Huda");

  let savedVarId = existingVar?.id;
  if (!DRY_RUN) {
    const res = await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-iv-hour-${crypto.randomBytes(4).toString("hex")}`,
        object,
      },
    });
    const saved = res.catalog_object;
    savedVarId = saved?.item_data?.variations?.[0]?.id;
    console.log(`  ✓ item ${saved?.id}`);
    console.log(`  ✓ variation ${savedVarId}`);

    if (saved?.id && !String(bagListId).startsWith("#") && !String(nadListId).startsWith("#")) {
      saved.item_data.modifier_list_info = [
        {
          modifier_list_id: bagListId,
          enabled: true,
          min_selected_modifiers: 1,
          max_selected_modifiers: 1,
        },
        {
          modifier_list_id: nadListId,
          enabled: true,
          min_selected_modifiers: 0,
          max_selected_modifiers: 1,
        },
      ];
      await square("/v2/catalog/object", {
        method: "POST",
        body: {
          idempotency_key: `hg-iv-hour-mods-${crypto.randomBytes(4).toString("hex")}`,
          object: saved,
        },
      });
      console.log("  ✓ attached bag + NAD modifiers");
    }

    console.log(
      `  book: https://book.squareup.com/appointments/pf2o75yphk7vw6/location/L3QDRS4DX9ZE4/services/${savedVarId}`,
    );
  }

  const doomed = [];
  for (const item of appt) {
    const name = item.item_data?.name || "";
    if (KEEP_BOOKABLE.some((re) => re.test(name))) continue;
    if (!RETIRE_FROM_BOOKING.some((re) => re.test(name))) continue;
    doomed.push({ id: item.id, name });
  }
  console.log(`\nDelete old IV drips (${doomed.length}):`);
  for (const n of doomed) console.log(`  - ${n.name}`);
  if (!DRY_RUN && doomed.length) {
    await square("/v2/catalog/batch-delete", {
      method: "POST",
      body: { object_ids: doomed.map((d) => d.id) },
    });
    console.log("  ✓ deleted");
  }
  if (DRY_RUN) console.log("\nRe-run with --apply to write to Square.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
