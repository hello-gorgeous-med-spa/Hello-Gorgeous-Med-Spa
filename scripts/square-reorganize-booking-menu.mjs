#!/usr/bin/env node
/**
 * Reorganize Square Appointments booking menu into clean categories.
 *
 * Fixes the booking-site "Other" dump: categories without an `ordinal`
 * (and items missing legacy `category_id`) often land in Other even when
 * `categories[]` is set correctly.
 *
 * Also sets CatalogItem.label_color (POS label).
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
 * Guest-facing booking categories.
 * ordinal = display order on Square booking (lower = earlier).
 * label_color = hex for Square POS item label.
 */
const CATEGORY_META = {
  "Skin Spa": { ordinal: 1, label_color: "FB7185", calendarHint: "Soft rose / pink" },
  "AnteAGE Skin Regeneration": { ordinal: 2, label_color: "10B981", calendarHint: "Green" },
  FlowWave: { ordinal: 3, label_color: "7C3AED", calendarHint: "Purple" },
  "RE GEN Peptide Therapy": { ordinal: 4, label_color: "8B5CF6", calendarHint: "Violet" },
  Botox: { ordinal: 5, label_color: "14B8A6", calendarHint: "Teal" },
  "Dermal Fillers": { ordinal: 6, label_color: "F97316", calendarHint: "Orange" },
  "Body Contouring & Devices": { ordinal: 7, label_color: "EA580C", calendarHint: "Deep orange" },
  "Laser Hair Removal": { ordinal: 8, label_color: "0EA5E9", calendarHint: "Sky blue" },
  Microblading: { ordinal: 9, label_color: "B45309", calendarHint: "Amber / brown" },
  "Brow Spa": { ordinal: 10, label_color: "A16207", calendarHint: "Brown / gold" },
  "Lash Spa": { ordinal: 11, label_color: "A78BFA", calendarHint: "Lavender" },
  "GlowTox Facial": { ordinal: 12, label_color: "EC4899", calendarHint: "Pink" },
  "PRP Injections": { ordinal: 13, label_color: "9F1239", calendarHint: "Burgundy" },
  "Vitamin Injections": { ordinal: 14, label_color: "E6007E", calendarHint: "Hot pink / magenta" },
  "IV Drip Package Deals": { ordinal: 15, label_color: "2563EB", calendarHint: "Blue" },
  "Weight Loss Injections": { ordinal: 16, label_color: "DC2626", calendarHint: "Red" },
  "Bioidentical Hormone Therapy (BHRT)": { ordinal: 17, label_color: "D4AF37", calendarHint: "Gold / amber" },
  "Trigger Point Injections": { ordinal: 18, label_color: "64748B", calendarHint: "Slate gray" },
  "Medical Consultations": { ordinal: 19, label_color: "111827", calendarHint: "Black / charcoal" },
  "Exclusive Model Specials": { ordinal: 20, label_color: "FF2D8E", calendarHint: "Bright pink" },
};

/** First match wins — keep specific rules above broad Skin Spa catch-alls. */
const MOVE_RULES = [
  // Shockwave / recovery
  { re: /flowwave|shockwave|recovery stack/i, cat: "FlowWave" },

  // RE GEN peptides (before AnteAGE / medical catch-alls)
  { re: /re gen peptide|peptide consult|peptide therapy|protocol — start|bpc-157 protocol|sermorelin protocol|nad\+ protocol|ghk-cu protocol|tb-500 protocol|pt-141 protocol|tesamorelin protocol|cjc\s*\/\s*ipamorelin protocol|recovery blend protocol/i, cat: "RE GEN Peptide Therapy" },
  { re: /\bpeptide\b/i, cat: "RE GEN Peptide Therapy" },

  // AnteAGE before devices (AnteAGE + CO₂ stays AnteAGE)
  { re: /anteage|exosome|biosome|hair restoration with exosome/i, cat: "AnteAGE Skin Regeneration" },

  // Devices / contouring
  { re: /morpheus8|quantum rf|solaria|co₂|co2 laser|trifecta|dani,? fix me/i, cat: "Body Contouring & Devices" },

  // Laser hair
  { re: /laser hair|laser brazilian/i, cat: "Laser Hair Removal" },

  // Microblading / Jen brows (before generic brow)
  { re: /microblading|hybrid\s*\/\s*combo|meet jen/i, cat: "Microblading" },

  // Injectables
  { re: /botox|jeuveau|dysport|lip flip|xeomin|daxxify/i, cat: "Botox" },
  { re: /filler|hylanex|hylenex|dissolver|revanesse|versa|restylane|juvederm/i, cat: "Dermal Fillers" },

  // Vitamins (before weight-loss catch-alls)
  { re: /^b12 injection$/i, cat: "Vitamin Injections" },
  { re: /^b-complex injection$/i, cat: "Vitamin Injections" },
  { re: /^glutathione injection$/i, cat: "Vitamin Injections" },
  { re: /mic\/?lipo|lipo-b injection|lipo.?shot/i, cat: "Vitamin Injections" },
  { re: /vitamin injection|biotin shot/i, cat: "Vitamin Injections" },

  // Weight loss
  { re: /tirzepatide|semaglutide|retatrutide|weight loss|body composition|medical weight/i, cat: "Weight Loss Injections" },

  // Lashes / brows / glowtox
  { re: /lash fill \+ biotin|lash extension|lash lift|lash tint|classic lash|hybrid lash|volume lash/i, cat: "Lash Spa" },
  { re: /brow lamination|brow tint|brow wax|brow shape|henna brow/i, cat: "Brow Spa" },
  { re: /glowtox/i, cat: "GlowTox Facial" },

  // PRP / IV / hormones / trigger / consults
  { re: /\bprp\b|platelet.?rich|vampire/i, cat: "PRP Injections" },
  { re: /\biv\b|nad\+|myers|drip package|hydration drip/i, cat: "IV Drip Package Deals" },
  { re: /hormone lab|biote|bhrt|hormone therapy|pellet/i, cat: "Bioidentical Hormone Therapy (BHRT)" },
  { re: /trigger point/i, cat: "Trigger Point Injections" },
  { re: /^consultation$|medical visit with ryan|telehealth|peptide therapy consultation/i, cat: "Medical Consultations" },
  { re: /weight loss consultation/i, cat: "Weight Loss Injections" },
  { re: /model special|vip model/i, cat: "Exclusive Model Specials" },

  // Skin Spa — facials, peels, Hydra, dermaplaning, IPL (not AnteAGE IPL — already matched)
  {
    re: /hydra|dermaplan|chemical peel|vi peel|facial|geneo|salmon dna|poreless|calm restore|clarity protocol|gorgeous glow|luminous reveal|collagen reset|signature facial|photofacial|ipl|microderm|nano.?needl|microneedl/i,
    cat: "Skin Spa",
  },
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
  const meta = CATEGORY_META[name];
  const res = await squarePost("/v2/catalog/object", {
    idempotency_key: `hg-reorg-cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    object: {
      type: "CATEGORY",
      id,
      category_data: {
        name,
        online_visibility: true,
        ...(meta?.ordinal != null ? { ordinal: meta.ordinal } : {}),
      },
    },
  });
  const realId = res.catalog_object?.id;
  if (!realId) throw new Error(`Failed creating category ${name}`);
  categoryIds.set(name, realId);
  console.log(`  ✓ created category: ${name}`);
  await new Promise((r) => setTimeout(r, 200));
  return realId;
}

async function syncCategoryOrdinals(categories, categoryIds) {
  const updates = [];
  for (const [name, meta] of Object.entries(CATEGORY_META)) {
    const id = categoryIds.get(name);
    if (!id || String(id).startsWith("#")) continue;
    const existing = categories.find((c) => c.id === id);
    if (!existing) continue;
    const current = existing.category_data?.ordinal;
    const needsOrdinal = current !== meta.ordinal;
    const needsOnline = existing.category_data?.online_visibility !== true;
    if (!needsOrdinal && !needsOnline) continue;
    updates.push({ existing, name, meta, needsOrdinal, needsOnline });
  }

  console.log(`Category ordinal / visibility updates: ${updates.length}`);
  for (const u of updates) {
    console.log(
      `  • ${u.name}: ordinal ${u.existing.category_data?.ordinal ?? "∅"} → ${u.meta.ordinal}` +
        (u.needsOnline ? " · online_visibility=true" : ""),
    );
  }

  if (DRY_RUN || updates.length === 0) return updates.length;

  let ok = 0;
  for (const u of updates) {
    try {
      const obj = structuredClone(u.existing);
      obj.category_data = {
        ...obj.category_data,
        name: u.name,
        ordinal: u.meta.ordinal,
        online_visibility: true,
        is_top_level: true,
      };
      await squarePost("/v2/catalog/object", {
        idempotency_key: `hg-reorg-catord-${obj.id.slice(-8)}-${Date.now().toString(36).slice(-4)}`,
        object: obj,
      });
      ok++;
      console.log(`  ✓ category ${u.name}`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ✕ category ${u.name}:`, err instanceof Error ? err.message.slice(0, 280) : err);
    }
  }
  return ok;
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

  for (const name of Object.keys(CATEGORY_META)) {
    await ensureCategory(name, categoryIds);
  }

  await syncCategoryOrdinals(categories, categoryIds);

  const moves = [];
  const unmatched = [];

  for (const item of appointmentItems) {
    const name = item.item_data?.name || "";
    const arrCatId = item.item_data?.categories?.[0]?.id;
    const legacyCatId = item.item_data?.category_id;
    const currentCatId = legacyCatId || arrCatId;
    const currentCat = currentCatId ? catNameById.get(currentCatId) || "(unknown)" : "(none)";
    const target = resolveTargetCategory(name) || (CATEGORY_META[currentCat] ? currentCat : null);

    if (!target) {
      unmatched.push({ name, currentCat });
      continue;
    }

    const targetId = categoryIds.get(target);
    const meta = CATEGORY_META[target];
    const needsMove = currentCat !== target;
    const needsLegacyId = !legacyCatId || legacyCatId !== targetId;
    const needsColor =
      meta && (item.item_data?.label_color || "").toUpperCase() !== meta.label_color.toUpperCase();

    // Always backfill category_id when missing — booking UI relies on it for some views
    if (!needsMove && !needsLegacyId && !needsColor) continue;

    moves.push({
      id: item.id,
      version: item.version,
      name,
      from: currentCat,
      to: target,
      targetId,
      label_color: meta?.label_color,
      needsMove,
      needsLegacyId,
      needsColor,
      object: item,
    });
  }

  console.log(`\nServices to update: ${moves.length}\n`);
  for (const m of moves) {
    const bits = [];
    if (m.needsMove) bits.push(`${m.from} → ${m.to}`);
    if (m.needsLegacyId && !m.needsMove) bits.push(`backfill category_id → ${m.to}`);
    if (m.needsColor) bits.push(`label_color #${m.label_color}`);
    console.log(`  • ${m.name}`);
    console.log(`      ${bits.join(" · ")}`);
  }

  if (unmatched.length) {
    console.log(`\n⚠ Unmatched appointment services (left as-is): ${unmatched.length}`);
    for (const u of unmatched.slice(0, 40)) {
      console.log(`  - [${u.currentCat}] ${u.name}`);
    }
    if (unmatched.length > 40) console.log(`  ... +${unmatched.length - 40} more`);
  }

  if (DRY_RUN) {
    console.log("\n--- Calendar color checklist (Dashboard-only) ---");
    console.log("Square Dashboard → Items → Service library → open each service → Color");
    console.log("Then Appointments → Calendar → ⚙ → Color code → By Service\n");
    for (const [cat, meta] of Object.entries(CATEGORY_META)) {
      console.log(
        `  ${String(meta.ordinal).padStart(2)}. ${cat.padEnd(40)} → ${meta.calendarHint}  (#${meta.label_color})`,
      );
    }
    console.log("\nRe-run with --apply to write categories, ordinals, and label colors.\n");
    return;
  }

  let updated = 0;
  let failed = 0;
  for (const m of moves) {
    try {
      // Re-fetch version to avoid stale conflicts on long runs
      const fresh = await squareGet(`/v2/catalog/object/${m.id}`);
      const obj = fresh.object || structuredClone(m.object);
      if (m.targetId) {
        obj.item_data.category_id = m.targetId;
        obj.item_data.categories = [{ id: m.targetId }];
      }
      if (m.label_color) {
        obj.item_data.label_color = m.label_color;
      }
      delete obj.item_data.reporting_category;
      await squarePost("/v2/catalog/object", {
        idempotency_key: `hg-reorg-${m.id.slice(-10)}-${Date.now().toString(36).slice(-5)}`,
        object: obj,
      });
      updated++;
      console.log(`  ✓ ${m.name}`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      failed++;
      console.error(`  ✕ ${m.name}:`, err instanceof Error ? err.message.slice(0, 300) : err);
    }
  }

  console.log(`\nDone. Updated ${updated}, failed ${failed}.`);
  console.log("Hard-refresh the Square booking page — FlowWave / devices / laser should leave Other.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
