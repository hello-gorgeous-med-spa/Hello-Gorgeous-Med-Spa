#!/usr/bin/env node
/**
 * Create high-ROI Square modifier sets and attach them to appointment services.
 * Also upserts "numb window" combo services (Morpheus / Solaria + FlowWave).
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-upsert-service-modifiers.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-service-modifiers.mjs --apply
 */

import crypto from "node:crypto";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;

/** @type {{ key: string, name: string, selection: "MULTIPLE"|"SINGLE", max?: number, modifiers: { key: string, name: string, price: number }[], attachTo: RegExp[] }[]} */
const MODIFIER_SETS = [
  {
    key: "facial-boosters",
    name: "Facial Boosters",
    selection: "MULTIPLE",
    max: 4,
    modifiers: [
      { key: "b12", name: "Add B12 Injection", price: 25 },
      { key: "lipo", name: "Add MIC / Lipo-B Injection", price: 40 },
      { key: "glut", name: "Add Glutathione Injection", price: 50 },
      { key: "biotin", name: "Add Biotin Shot", price: 25 },
      { key: "derma", name: "Add Dermaplaning", price: 50 },
      { key: "babytox", name: "Add Baby Tox Glow", price: 149 },
      { key: "biosomes", name: "Add AnteAGE Biosomes / Exosomes", price: 149 },
    ],
    attachTo: [
      /facial/i,
      /hydra/i,
      /dermaplan/i,
      /chemical peel|vi peel|carbon laser peel/i,
      /geneo|salmon dna|oxygen facial|diamond glow|microderm|nano.?needl|^microneedling$/i,
      /signature facial|clarity protocol|collagen reset|gorgeous glow|poreless|calm restore|luminous/i,
      /\bipl\b|photofacial/i,
      /glowtox/i,
    ],
  },
  {
    key: "regen-upgrades",
    name: "Regenerative Upgrades",
    selection: "MULTIPLE",
    max: 3,
    modifiers: [
      { key: "exo", name: "Upgrade — Exosomes / Biosomes", price: 199 },
      { key: "prp", name: "Add PRP Topical", price: 200 },
      { key: "led", name: "Add LED / Oxygen Finish", price: 35 },
    ],
    attachTo: [
      /anteage/i,
      /exosome|biosome|hair restoration with exosome/i,
      /microneedl/i,
      /\bprp\b/i,
      /\bipl\b|photofacial|chemical peel|vi peel/i,
    ],
  },
  {
    key: "device-numb-window",
    name: "While You're Numbing",
    selection: "MULTIPLE",
    max: 3,
    modifiers: [
      {
        key: "fw-numb",
        name: "Add FlowWave During Numbing (1 area)",
        price: 99,
      },
      {
        key: "fw-numb-2",
        name: "Add 2nd FlowWave Area During Numbing",
        price: 75,
      },
      { key: "b12-wait", name: "Add B12 While Waiting", price: 25 },
      { key: "lipo-wait", name: "Add MIC / Lipo-B While Waiting", price: 40 },
    ],
    attachTo: [/morpheus8|solaria|quantum rf|co₂|co2 laser|trifecta|dani,? fix me/i],
  },
  {
    key: "injectable-boosters",
    name: "Visit Boosters",
    selection: "MULTIPLE",
    max: 3,
    modifiers: [
      { key: "b12-inj", name: "Add B12 Injection", price: 25 },
      { key: "lipo-inj", name: "Add MIC / Lipo-B Injection", price: 40 },
      { key: "glut-inj", name: "Add Glutathione Injection", price: 50 },
      { key: "mini-facial", name: "Add Mini Glow Facial Finish", price: 89 },
    ],
    attachTo: [/botox|jeuveau|dysport|xeomin|daxxify|lip flip|filler|hylanex|hylenex|dissolver/i],
  },
];

const COMBO_SERVICES = [
  {
    key: "m8-fw-numb",
    name: "Morpheus8 + FlowWave Numb Window",
    price: 0, // price at consult / base Morpheus — use modifier-style fixed stack price
    // Charge a clear stack premium on top of typical Morpheus visit — set as package price staff can adjust
    fixedPrice: 99, // FlowWave portion; Morpheus still booked/charged as primary — better: full stack note
    durationMin: 90,
    categoryName: "Body Contouring & Devices",
    description:
      "Book FlowWave into your Morpheus8 numbing window — focused shockwave on 1 area while topical anesthetic sets (typically ~30–45 min). Zero downtime add-on. NP-directed. Select your Morpheus8 treatment separately or ask us to build your full stack at consult.",
    // Actually for booking clarity, price the combo as FlowWave stack fee that pairs with Morpheus
    // Better product: priced as $99 add-on bookable service with 45 min duration
  },
  {
    key: "solaria-fw-numb",
    name: "Solaria CO₂ + FlowWave Numb Window",
    fixedPrice: 99,
    durationMin: 90,
    categoryName: "Body Contouring & Devices",
    description:
      "Add FlowWave (1 area) during Solaria CO₂ numbing time — productive wait, same visit. Focused shockwave, NP-directed, zero downtime. Book alongside your Solaria treatment.",
  },
  {
    key: "quantum-fw-numb",
    name: "Quantum RF + FlowWave Numb Window",
    fixedPrice: 99,
    durationMin: 75,
    categoryName: "Body Contouring & Devices",
    description:
      "Add FlowWave (1 area) during Quantum RF prep/numbing — same-visit recovery stack. Focused shockwave, NP-directed.",
  },
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
  if (!res.ok) {
    const msg = JSON.stringify(json.errors || json).slice(0, 500);
    throw new Error(`${method} ${pathname}: ${msg}`);
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
    const json = await square(url.pathname + url.search);
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function matchesAny(name, regexes) {
  return regexes.some((re) => re.test(name));
}

async function upsertModifierList(set, existingByName) {
  const existing = existingByName.get(set.name);
  const tempListId = existing?.id || `#ml-${set.key}`;
  const modifiers = set.modifiers.map((m, i) => {
    const existingMod = existing?.modifier_list_data?.modifiers?.find(
      (x) => x.modifier_data?.name === m.name,
    );
    return {
      type: "MODIFIER",
      id: existingMod?.id || `#mod-${set.key}-${m.key}`,
      ...(existingMod?.version ? { version: existingMod.version } : {}),
      modifier_data: {
        name: m.name,
        price_money: USD(m.price),
        on_by_default: false,
        ordinal: i,
      },
    };
  });

  const object = {
    type: "MODIFIER_LIST",
    id: tempListId,
    ...(existing?.version ? { version: existing.version } : {}),
    modifier_list_data: {
      name: set.name,
      selection_type: set.selection,
      modifiers,
    },
  };

  if (DRY_RUN) {
    console.log(`  [dry-run] upsert modifier list: ${set.name} (${modifiers.length} options)`);
    return { id: existing?.id || tempListId, created: !existing };
  }

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-modlist-${set.key}-${crypto.randomBytes(4).toString("hex")}`,
      object,
    },
  });
  const id = res.catalog_object?.id;
  console.log(`  ✓ modifier list: ${set.name} (${id})`);
  await sleep(200);
  return { id, created: !existing };
}

async function attachModifiersToServices(setsWithIds, appointmentItems) {
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of appointmentItems) {
    const name = item.item_data?.name || "";
    const listsToAttach = [];
    for (const set of setsWithIds) {
      if (matchesAny(name, set.attachTo)) {
        listsToAttach.push(set);
      }
    }
    if (!listsToAttach.length) {
      skipped++;
      continue;
    }

    const existingInfo = item.item_data.modifier_list_info || [];
    const byId = new Map(existingInfo.map((x) => [x.modifier_list_id, x]));
    let changed = false;
    const nextInfo = [...existingInfo];

    for (const set of listsToAttach) {
      const prev = byId.get(set.id);
      const desired = {
        modifier_list_id: set.id,
        enabled: true,
        min_selected_modifiers: 0,
        max_selected_modifiers: set.max ?? set.modifiers.length,
        allow_quantities: false,
      };
      if (!prev) {
        nextInfo.push(desired);
        changed = true;
      } else if (
        prev.enabled === false ||
        prev.max_selected_modifiers !== desired.max_selected_modifiers
      ) {
        Object.assign(prev, desired);
        changed = true;
      }
    }

    if (!changed) {
      skipped++;
      continue;
    }

    console.log(`  • ${name}`);
    console.log(`      + ${listsToAttach.map((s) => s.name).join(", ")}`);

    if (DRY_RUN) {
      updated++;
      continue;
    }

    try {
      const fresh = await square(`/v2/catalog/object/${item.id}`);
      const obj = fresh.object;
      obj.item_data.modifier_list_info = nextInfo.map((info) => ({
        modifier_list_id: info.modifier_list_id,
        enabled: info.enabled !== false,
        min_selected_modifiers: info.min_selected_modifiers ?? 0,
        max_selected_modifiers: info.max_selected_modifiers ?? 4,
      }));
      delete obj.item_data.reporting_category;
      await square("/v2/catalog/object", {
        method: "POST",
        body: {
          idempotency_key: `hg-modattach-${item.id.slice(-8)}-${crypto.randomBytes(3).toString("hex")}`,
          object: obj,
        },
      });
      updated++;
      await sleep(180);
    } catch (err) {
      failed++;
      console.error(`  ✕ ${name}:`, err instanceof Error ? err.message.slice(0, 280) : err);
    }
  }

  return { updated, skipped, failed };
}

async function upsertComboServices(categories, existingItems) {
  const catByName = new Map(categories.map((c) => [c.category_data?.name, c.id]));
  const byName = new Map(existingItems.map((i) => [i.item_data?.name, i]));

  // Staff who can run FlowWave / devices — Michelle FlowWave; Danielle + Ryan devices
  const TEAM = ["TMqy8tRlmyMRkQ25", "TMqnS9cNU-3s3lUR", "TM1IptWCrgxkY4p7"];

  let created = 0;
  for (const combo of COMBO_SERVICES) {
    const existing = byName.get(combo.name);
    const catId = catByName.get(combo.categoryName);
    const tempId = existing?.id || `#combo-${combo.key}`;
    const varId = existing?.item_data?.variations?.[0]?.id || `#combo-var-${combo.key}`;

    const object = {
      type: "ITEM",
      id: tempId,
      ...(existing?.version ? { version: existing.version } : {}),
      item_data: {
        name: combo.name,
        description: combo.description,
        product_type: "APPOINTMENTS_SERVICE",
        categories: catId ? [{ id: catId }] : undefined,
        label_color: "7C3AED",
        ecom_available: true,
        ecom_visibility: "VISIBLE",
        is_taxable: true,
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varId,
            ...(existing?.item_data?.variations?.[0]?.version
              ? { version: existing.item_data.variations[0].version }
              : {}),
            item_variation_data: {
              name: "Standard",
              pricing_type: "FIXED_PRICING",
              price_money: USD(combo.fixedPrice),
              service_duration: MIN(combo.durationMin),
              available_for_booking: true,
              sellable: true,
              team_member_ids: TEAM,
            },
          },
        ],
      },
    };

    console.log(
      `  ${existing ? "update" : "create"} combo: ${combo.name} — $${combo.fixedPrice} · ${combo.durationMin} min`,
    );

    if (DRY_RUN) {
      created++;
      continue;
    }

    try {
      await square("/v2/catalog/object", {
        method: "POST",
        body: {
          idempotency_key: `hg-combo-${combo.key}-${crypto.randomBytes(3).toString("hex")}`,
          object,
        },
      });
      created++;
      console.log(`  ✓ ${combo.name}`);
      await sleep(250);
    } catch (err) {
      console.error(`  ✕ ${combo.name}:`, err instanceof Error ? err.message.slice(0, 300) : err);
    }
  }
  return created;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`\n✨ Square service modifiers ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const [modLists, items, categories] = await Promise.all([
    listCatalog("MODIFIER_LIST"),
    listCatalog("ITEM"),
    listCatalog("CATEGORY"),
  ]);
  const existingByName = new Map(modLists.map((m) => [m.modifier_list_data?.name, m]));
  const appointmentItems = items.filter(
    (o) => o.type === "ITEM" && o.item_data?.product_type === "APPOINTMENTS_SERVICE" && !o.is_deleted,
  );

  console.log("1) Upsert modifier lists");
  const setsWithIds = [];
  for (const set of MODIFIER_SETS) {
    const { id } = await upsertModifierList(set, existingByName);
    setsWithIds.push({ ...set, id });
  }

  console.log("\n2) Attach to appointment services");
  const attach = await attachModifiersToServices(setsWithIds, appointmentItems);
  console.log(`   updated=${attach.updated} skipped=${attach.skipped} failed=${attach.failed}`);

  console.log("\n3) Upsert numb-window combo services (online bookable)");
  const combos = await upsertComboServices(categories, appointmentItems);
  console.log(`   combo upserts: ${combos}`);

  if (DRY_RUN) {
    console.log("\nRe-run with --apply to write to Square.\n");
  } else {
    console.log("\nDone. On POS/booking, boosters appear under each service.");
    console.log("Train: “While you’re numb / while you’re here…”\n");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
