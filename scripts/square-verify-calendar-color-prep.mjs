#!/usr/bin/env node
/**
 * Verifies API-side category + POS label_color prep for the Dashboard
 * calendar color checklist in docs/SQUARE_BOOKING_MENU_COLORS.md.
 *
 * Does NOT set calendar colors (Dashboard-only). Prints a punch-list.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-verify-calendar-color-prep.mjs
 *   node --env-file=.env.local scripts/square-verify-calendar-color-prep.mjs --fix-labels
 */

const args = process.argv.slice(2);
const FIX = args.includes("--fix-labels");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

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

const SPOT = [
  { label: "Vitamins → pink", re: /^b12 injection$/i, cat: "Vitamin Injections" },
  { label: "Weight loss → red", re: /semaglutide|tirzepatide/i, cat: "Weight Loss Injections" },
  { label: "FlowWave → purple", re: /flowwave shockwave — single/i, cat: "FlowWave" },
  { label: "Devices → orange", re: /morpheus8 burst — 3 session|morpheus8 burst x3/i, cat: "Body Contouring & Devices" },
  { label: "Laser → sky blue", re: /laser hair removal — brazilian|laser brazilian/i, cat: "Laser Hair Removal" },
  { label: "Lashes → lavender", re: /hybrid full set|lash lift & tint/i, cat: "Lash Spa" },
  { label: "Consults → charcoal", re: /medical visit with ryan|^consultation$/i, cat: "Medical Consultations" },
];

if (!TOKEN || TOKEN.length < 10) {
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
  return out;
}

async function main() {
  console.log("\n🎨 Calendar color prep verify (Dashboard still required for service Color)\n");

  const cats = (await listCatalog("CATEGORY")).filter((c) => !c.is_deleted);
  const catById = new Map(cats.map((c) => [c.id, c.category_data?.name]));
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  let mismatch = 0;
  const byCat = new Map();
  for (const o of items) {
    const cid = o.item_data.categories?.[0]?.id || o.item_data.category_id;
    const catName = catById.get(cid);
    if (!catName || !CATEGORY_META[catName]) continue;
    if (!byCat.has(catName)) byCat.set(catName, { ok: 0, bad: 0, sampleBad: [] });
    const want = CATEGORY_META[catName].label_color.toUpperCase();
    const got = (o.item_data.label_color || "").toUpperCase();
    if (got === want) byCat.get(catName).ok++;
    else {
      byCat.get(catName).bad++;
      mismatch++;
      if (byCat.get(catName).sampleBad.length < 2) {
        byCat.get(catName).sampleBad.push(`${o.item_data.name} (#${got || "none"})`);
      }
    }
  }

  console.log("POS label_color by category:");
  for (const [name, meta] of Object.entries(CATEGORY_META)) {
    const row = byCat.get(name) || { ok: 0, bad: 0, sampleBad: [] };
    const status = row.bad === 0 && row.ok > 0 ? "✓" : row.ok + row.bad === 0 ? "—" : "✕";
    console.log(
      `  ${status} ${name.padEnd(36)} calendar→ ${meta.calendarHint.padEnd(22)} POS #${meta.label_color}  (${row.ok} ok / ${row.bad} need fix)`,
    );
    row.sampleBad.forEach((s) => console.log(`      e.g. ${s}`));
  }

  console.log("\nSpot-check services (category membership):");
  for (const s of SPOT) {
    const hit = items.find((o) => s.re.test(o.item_data.name));
    if (!hit) {
      console.log(`  — ${s.label}: not found`);
      continue;
    }
    const cid = hit.item_data.categories?.[0]?.id || hit.item_data.category_id;
    const cat = catById.get(cid);
    const color = hit.item_data.label_color || "none";
    const ok = cat === s.cat;
    console.log(`  ${ok ? "✓" : "✕"} ${s.label}: ${hit.item_data.name.slice(0, 48)} → ${cat} · POS #${color}`);
  }

  console.log(`\nDashboard punch-list (you must click these):`);
  console.log(`  1. Items → Service library → set Color per category (same color within category)`);
  console.log(`  2. Appointments → Calendar → settings → Color code by Service → Save`);
  console.log(`  3. Spot-check vitamins pink ≠ weight loss red ≠ FlowWave purple`);
  console.log(`\nPOS label mismatches: ${mismatch}`);
  if (FIX && mismatch > 0) {
    console.log(`\nRe-run: node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --apply`);
  } else if (mismatch > 0) {
    console.log(`Fix POS labels: node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --apply`);
  } else {
    console.log(`POS labels look good. Finish Dashboard Color + Color code by Service.`);
  }
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
