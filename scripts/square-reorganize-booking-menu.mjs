#!/usr/bin/env node
/**
 * Reorganize Square Appointments booking menu into clean categories.
 * Also sets CatalogItem.label_color (POS label) and prints a Dashboard
 * checklist for calendar colors (calendar palette is Dashboard-only).
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --dry-run
 *   node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --apply
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

/**
 * Target booking categories + calendar color guidance.
 * label_color = hex for Square POS item label (API-supported).
 * calendarHint = closest Square Appointments palette color to pick in Dashboard.
 */
const CATEGORY_META = {
  "Vitamin Injections": { label_color: "E6007E", calendarHint: "Hot pink / magenta" },
  "Weight Loss Injections": { label_color: "DC2626", calendarHint: "Red" },
  FlowWave: { label_color: "7C3AED", calendarHint: "Purple" },
  Botox: { label_color: "14B8A6", calendarHint: "Teal" },
  "Dermal Fillers": { label_color: "F97316", calendarHint: "Orange" },
  "Skin Spa": { label_color: "FB7185", calendarHint: "Soft rose / pink" },
  "Body Contouring & Devices": { label_color: "EA580C", calendarHint: "Deep orange" },
  "Laser Hair Removal": { label_color: "0EA5E9", calendarHint: "Sky blue" },
  "Lash Spa": { label_color: "A78BFA", calendarHint: "Lavender" },
  "Brow Spa": { label_color: "A16207", calendarHint: "Brown / gold" },
  "Bioidentical Hormone Therapy (BHRT)": { label_color: "D4AF37", calendarHint: "Gold / amber" },
  "IV Drip Package Deals": { label_color: "2563EB", calendarHint: "Blue" },
  "PRP Injections": { label_color: "9F1239", calendarHint: "Burgundy" },
  "AnteAGE Skin Regeneration": { label_color: "10B981", calendarHint: "Green" },
  "Trigger Point Injections": { label_color: "64748B", calendarHint: "Slate gray" },
  "Medical Consultations": { label_color: "111827", calendarHint: "Black / charcoal" },
  "Exclusive Model Specials": { label_color: "FF2D8E", calendarHint: "Bright pink" },
  "GlowTox Facial": { label_color: "EC4899", calendarHint: "Pink" },
};

/** Explicit moves (name match, case-insensitive substring or exact). */
const MOVE_RULES = [
  // Vitamins wrongly sitting under Weight Loss
  { re: /^b12 injection$/i, cat: "Vitamin Injections" },
  { re: /^b-complex injection$/i, cat: "Vitamin Injections" },
  { re: /^glutathione injection$/i, cat: "Vitamin Injections" },
  { re: /mic\/?lipo|lipo-b injection|lipo.?shot/i, cat: "Vitamin Injections" },
  { re: /vitamin injection/i, cat: "Vitamin Injections" },
  { re: /biotin shot|lash fill \+ biotin/i, cat: "Lash Spa" },

  // Weight loss stays for GLP-1 / programs
  { re: /tirzepatide|semaglutide|retatrutide|weight loss|body composition|medical weight/i, cat: "Weight Loss Injections" },

  // Shockwave
  { re: /flowwave|shockwave|recovery stack/i, cat: "FlowWave" },

  // AnteAGE first (so “AnteAGE + CO₂” stays AnteAGE, not devices)
  { re: /anteage|exosome|biosome|hair restoration with exosome/i, cat: "AnteAGE Skin Regeneration" },

  // Devices / contouring (out of random specials + body spa mix)
  { re: /morpheus8|quantum rf|solaria|co₂|co2 laser|trifecta|dani,? fix me/i, cat: "Body Contouring & Devices" },

  // Laser hair — own category so booking menu isn't one giant Body Spa dump
  { re: /laser hair/i, cat: "Laser Hair Removal" },

  // Consults
  { re: /^consultation$|medical visit with ryan|telehealth/i, cat: "Medical Consultations" },
  { re: /peptide therapy consultation/i, cat: "Medical Consultations" },
  { re: /weight loss consultation/i, cat: "Weight Loss Injections" },

  // Injectables
  { re: /botox|jeuveau|dysport|lip flip/i, cat: "Botox" },
  { re: /filler|hylanex|dissolver/i, cat: "Dermal Fillers" },

  // GlowTox
  { re: /glowtox/i, cat: "GlowTox Facial" },
];

async function squareGet(pathname) {
  const res = await fetch(`${HOST}${pathname}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function squarePost(pathname, body) {
  const res = await fetch(`${HOST}${pathname}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function listCatalog(type) {
  const out = [];
  let cursor;
  do {
    const url = new URL(`${HOST}/v2/catalog/list`);
    url.searchParams.set("types", type);
    if (cursor) url.searchParams.set("cursor", cursor);
    const json = await squareGet(url.pathname + url.search);
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function resolveTargetCategory(name) {
  for (const rule of MOVE_RULES) {
    if (rule.re.test(name)) return rule.cat;
  }
  return null;
}

async function ensureCategory(name, categoryIds) {
  if (categoryIds.has(name)) return categoryIds.get(name);
  if (DRY_RUN) {
    console.log(`  [dry-run] would create category: ${name}`);
    const fake = `#${name.replace(/\W/g, "").slice(0, 20)}`;
    categoryIds.set(name, fake);
    return fake;
  }
  const id = `#cat-${name.replace(/\W+/g, "-").toLowerCase()}`.slice(0, 46);
  const res = await squarePost("/v2/catalog/object", {
    idempotency_key: `hg-reorg-cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    object: {
      type: "CATEGORY",
      id,
      category_data: { name },
    },
  });
  const realId = res.catalog_object?.id;
  if (!realId) throw new Error(`Failed creating category ${name}`);
  categoryIds.set(name, realId);
  console.log(`  ✓ created category: ${name}`);
  await new Promise((r) => setTimeout(r, 200));
  return realId;
}

async function main() {
  console.log(`\n📚 Square booking menu reorganize ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const categories = await listCatalog("CATEGORY");
  const categoryIds = new Map(categories.map((c) => [c.category_data?.name, c.id]));
  const catNameById = new Map(categories.map((c) => [c.id, c.category_data?.name]));

  const items = await listCatalog("ITEM");
  const appointmentItems = items.filter(
    (o) => o.type === "ITEM" && o.item_data?.product_type === "APPOINTMENTS_SERVICE" && !o.is_deleted,
  );

  // Ensure all target categories exist
  for (const name of Object.keys(CATEGORY_META)) {
    await ensureCategory(name, categoryIds);
  }

  const moves = [];
  const colorUpdates = [];

  for (const item of appointmentItems) {
    const name = item.item_data?.name || "";
    const currentCatId = item.item_data?.category_id || item.item_data?.categories?.[0]?.id;
    const currentCat = currentCatId ? catNameById.get(currentCatId) || "(unknown)" : "(none)";
    const target = resolveTargetCategory(name);
    if (!target) continue;

    const targetId = categoryIds.get(target);
    const meta = CATEGORY_META[target];
    const needsMove = currentCat !== target;
    const needsColor = meta && item.item_data?.label_color?.toUpperCase() !== meta.label_color.toUpperCase();

    if (!needsMove && !needsColor) continue;

    moves.push({
      id: item.id,
      version: item.version,
      name,
      from: currentCat,
      to: target,
      targetId,
      label_color: meta?.label_color,
      needsMove,
      needsColor,
      object: item,
    });
  }

  console.log(`Services to update: ${moves.length}\n`);
  for (const m of moves) {
    const bits = [];
    if (m.needsMove) bits.push(`${m.from} → ${m.to}`);
    if (m.needsColor) bits.push(`label_color #${m.label_color}`);
    console.log(`  • ${m.name}`);
    console.log(`      ${bits.join(" · ")}`);
  }

  if (DRY_RUN) {
    console.log("\n--- Calendar color checklist (Dashboard-only) ---");
    console.log("Square Dashboard → Items → Service library → open each service → Color");
    console.log("Then Appointments → Calendar → ⚙ → Color code → By Service\n");
    for (const [cat, meta] of Object.entries(CATEGORY_META)) {
      console.log(`  ${cat.padEnd(40)} → ${meta.calendarHint}  (POS label #${meta.label_color})`);
    }
    console.log("\nRe-run with --apply to write categories + label colors.\n");
    return;
  }

  let updated = 0;
  let failed = 0;
  for (const m of moves) {
    try {
      const obj = structuredClone(m.object);
      obj.version = m.version;
      if (m.needsMove && m.targetId) {
        obj.item_data.category_id = m.targetId;
        obj.item_data.categories = [{ id: m.targetId }];
      }
      if (m.label_color) {
        obj.item_data.label_color = m.label_color;
      }
      // Remove read-only / problematic fields that cause upsert failures
      delete obj.item_data.reporting_category;
      await squarePost("/v2/catalog/object", {
        idempotency_key: `hg-reorg-${m.id.slice(-10)}-${Date.now().toString(36).slice(-5)}`,
        object: obj,
      });
      updated++;
      console.log(`  ✓ ${m.name}`);
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      failed++;
      console.error(`  ✕ ${m.name}:`, err instanceof Error ? err.message.slice(0, 300) : err);
    }
  }

  console.log(`\nDone. Updated ${updated}, failed ${failed}.`);
  console.log("\nNext (you, ~10 min): set calendar colors in Square Dashboard Service library,");
  console.log("then Calendar ⚙ → Color code by Service.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
