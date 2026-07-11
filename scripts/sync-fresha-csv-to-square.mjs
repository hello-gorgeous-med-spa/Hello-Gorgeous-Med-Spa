#!/usr/bin/env node
/**
 * Sync Fresha export_service_list CSV → Square Appointments catalog.
 * - Creates services in CSV that are not already in Square (fuzzy name match)
 * - Updates descriptions with CSV copy + square-service-content.mjs SEO overlay
 * - Maps Fresha categories → Square reporting categories
 * - Optionally runs image polish after sync
 *
 * Usage:
 *   node --env-file=.env.local scripts/sync-fresha-csv-to-square.mjs \
 *     --csv=/Users/danid/Downloads/export_service_list_2026-07-11.csv --dry-run
 *
 *   node --env-file=.env.local scripts/sync-fresha-csv-to-square.mjs \
 *     --csv=/Users/danid/Downloads/export_service_list_2026-07-11.csv --apply
 *
 *   ... --apply --polish-images   # also upload category hero images for new items
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SERVICE_CONTENT } from "./square-service-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const getArg = (name) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : null;
};
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");
const POLISH_IMAGES = args.includes("--polish-images");
const CSV_PATH = getArg("--csv");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!CSV_PATH || !fs.existsSync(CSV_PATH)) {
  console.error("Usage: --csv=/path/to/export_service_list.csv [--dry-run|--apply]");
  process.exit(1);
}
if (!DRY_RUN && (!TOKEN || TOKEN.length < 10)) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

/** Fresha Category Name → Square catalog category (must exist or will be created). */
const FRESHA_CATEGORY_MAP = {
  "spring specials": "Spring Specials",
  "microblading consultation": "Brow Spa",
  "inmode advanced face & body resurfacing": "Exclusive Model Specials",
  "bioidentical hormone therapy (bhrt) & peptide therapy": "Bioidentical Hormone Therapy (BHRT)",
  "weight loss injections": "Weight Loss Injections",
  "trigger point injections": "Trigger Point Injections",
  "glowtox facial ( our signature)": "GlowTox Facial",
  "anteage-  the future of skin regeneration is here": "AnteAGE Skin Regeneration",
  "dermal fillers": "Dermal Fillers",
  "vitamin injections": "Vitamin Injections",
  "iv drip package deals": "IV Drip Package Deals",
  "medical visit with ryan kent, aprn, fnp-bc, fpa": "Medical Consultations",
  botox: "Botox",
  "skin spa": "Skin Spa",
  "prp injections": "PRP Injections",
  "lash spa": "Lash Spa",
  "brow spa": "Brow Spa",
  "body spa": "Body Spa",
};

/** Manual CSV name → existing Square item name (same service, different Fresha label). */
const CSV_TO_SQUARE_ALIASES = {
  // InMode / resurfacing
  "morpheus8 + co₂ combo ($1,499) — most popular": "Morpheus8 + CO₂ Combo — Most Popular",
  "solaria co₂ laser  - under eye": "Solaria CO₂ Laser — Under Eye",
  "solaria co₂ laser  - neck & chin or full chest": "Solaria CO₂ Laser — Neck Only",
  "solaria co₂ laser": "Solaria CO₂ Laser",
  "morpheus8 burst (full face)": "Morpheus8 Burst Full Face + Free Neck — VIP Model Special",
  "morpheus8 burst (full face)  - morpheus 8 burst x3": "Morpheus8 Burst x3 Package",
  "professional brazilian laser hair removal": "Professional Brazilian Laser Hair Removal",

  // BHRT / labs
  "17 hormone panel -results within 36 hours": "Hormone Lab Panel — Women",
  "microblading consultation  free": "Brow Microblading Consultation",

  // Weight loss — starter tiers only (distinct plans stay as new creates)
  "semaglutide (wegovy/ozempic)  - from": "Semaglutide — Initial Consult + First Injection",
  "tirzepatide (zepbound/mounjaro)  - up to 5 ml per injection - from": "Tirzepatide — Initial Consult + First Injection",

  // Trigger point
  "multi-site session": "Trigger Point Injection — Multiple Sites",
  "intro offer": "Trigger Point Injection — Single Site",

  // GlowTox / signature facial
  "the glass glow facial (hydra + dermaplanning + baby tox )": "GlowTox Facial — Our Signature",

  // AnteAGE — map to closest live Square item for description refresh
  "anteage growth factor undereye mesotherapy treatment": "Anteage Growth Factor Under Eye Mesotherapy",

  // IV drips
  "reboot (hangover)  iv therapy": "IV Drip — Hangover Recovery",
  "iv beauty": "IV Drip — Beauty Glow",
  "myer's cocktail": "IV Drip — Myers' Cocktail (45min)",
  "iv jet lag": "IV Drip — Immunity Boost",
  "b-lean iv kit": "IV Drip — Energy & Performance",

  // Medical / injectables
  "medical visit with ryan kent aprn , fnp": "Medical Visit with Ryan Kent, FNP-BC",
  "(hylanex) lip dissolver - from": "Lip Dissolver (Hylanex)",
  "lip flip special": "Lip Flip",

  // Skin spa — existing Square items
  "2 in 1 hydra pen micro-channeling & hydra facial": "2-in-1 Hydra Pen Micro-channeling & Hydra Facial",
  "prp facial (vampire facial)": "PRP — Facial (Vampire Facial)",
  "chemical peel facial": "Chemical Peel",
  "one joint( single session)": "PRP — Joint / Body",
  "platelet rich fibrin (prf) injection for hair loss": "PRP — Hair Restoration",

  // Lashes — full sets + lift tint already in Square
  "full set eyelash extensions - classic full set": "Classic Lash Extensions — Full Set",
  "full set eyelash extensions - volume full set": "Volume Lash Extensions — Full Set",
  "lash lift  - lash lift - with tint": "Lash Lift & Tint",

  // Brows
  "brow shaping/wax": "Brow Wax & Shape",
};

function parseCSV(text) {
  const rows = [];
  let field = "";
  let row = [];
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1 && !rows[i][0]) continue;
    const o = {};
    headers.forEach((h, j) => (o[h] = (rows[i][j] ?? "").trim()));
    out.push(o);
  }
  return out;
}

function parseDurationMinutes(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (!s) return 30;
  let total = 0;
  const h = s.match(/(\d+)\s*h/);
  const m = s.match(/(\d+)\s*m/);
  if (h) total += parseInt(h[1], 10) * 60;
  if (m) total += parseInt(m[1], 10);
  if (total > 0) return total;
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 30;
}

function parsePriceCents(raw) {
  const n = parseFloat(String(raw ?? "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugKey(s) {
  return norm(s).replace(/\s+/g, "-").slice(0, 48);
}

function stripMatchNoise(s) {
  return String(s || "")
    .replace(/\s*-\s*from\s*$/i, "")
    .replace(/\s*-\s*free\s*$/i, "")
    .replace(/\s*\(alt\)\s*$/i, "")
    .trim();
}

/** Fresha/SEO label → Square catalog name (when they differ). Manual aliases win. */
function buildAliasMap() {
  const map = new Map();
  for (const [key, val] of Object.entries(SERVICE_CONTENT)) {
    const squareName = stripMatchNoise(val.n || key);
    map.set(norm(key), squareName);
    if (val.n) map.set(norm(val.n), squareName);
  }
  for (const [k, v] of Object.entries(CSV_TO_SQUARE_ALIASES)) {
    map.set(norm(k), v);
  }
  return map;
}

const ALIAS_TO_SQUARE = buildAliasMap();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function pickSeoContent(csvName) {
  const exact = SERVICE_CONTENT[csvName];
  if (exact) return exact;
  for (const [key, val] of Object.entries(SERVICE_CONTENT)) {
    if (val.n && norm(val.n) === norm(csvName)) return val;
    if (norm(key) === norm(csvName)) return val;
  }
  return null;
}

function pickDescription(csvName, csvDesc) {
  const seo = pickSeoContent(csvName);
  const candidates = [seo?.d, csvDesc].filter(Boolean);
  return candidates.sort((a, b) => b.length - a.length)[0] || "";
}

function pickDisplayName(csvName) {
  const seo = pickSeoContent(csvName);
  return seo?.n || csvName.trim();
}

function mapCategory(freshaCategory, csvName) {
  const seo = pickSeoContent(csvName);
  if (seo?.cat) return seo.cat;
  const key = norm(freshaCategory);
  return FRESHA_CATEGORY_MAP[key] || freshaCategory.trim();
}

async function squareFetch(method, apiPath, body) {
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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data?.errors?.[0];
    throw new Error(err?.detail || err?.code || `HTTP ${res.status}`);
  }
  return data;
}

async function listCatalog(types) {
  const all = [];
  let cursor = null;
  do {
    const body = { object_types: types, limit: 100 };
    if (cursor) body.cursor = cursor;
    const data = await squareFetch("POST", "/catalog/search", body);
    all.push(...(data.objects || []));
    cursor = data.cursor || null;
  } while (cursor);
  return all;
}

async function getBookableTeamMemberIds() {
  const data = await squareFetch("GET", "/bookings/team-member-booking-profiles");
  return (data.team_member_booking_profiles || [])
    .filter((p) => p.is_bookable)
    .map((p) => p.team_member_id);
}

function resolveSquareLookupName(csvName) {
  const n = norm(stripMatchNoise(csvName));
  if (ALIAS_TO_SQUARE.has(n)) return ALIAS_TO_SQUARE.get(n);

  const seo = pickSeoContent(csvName);
  if (seo?.n) return stripMatchNoise(seo.n);
  if (SERVICE_CONTENT[csvName]) return stripMatchNoise(csvName);

  return stripMatchNoise(csvName);
}

function findSquareMatch(csvName, displayName, squareByNorm) {
  const candidates = [
    csvName,
    displayName,
    resolveSquareLookupName(csvName),
    stripMatchNoise(csvName),
    stripMatchNoise(displayName),
  ];

  for (const raw of candidates) {
    const n = norm(raw);
    if (squareByNorm.has(n)) return squareByNorm.get(n);
  }

  return null;
}

function buildItemObject({ svc, categoryId, existing, teamMemberIds }) {
  const key = slugKey(svc.freshaId || svc.displayName);
  const existingVar =
    existing?.item_data?.variations?.find((v) => !v.is_deleted) ||
    existing?.item_data?.variations?.[0];

  const itemId = existing?.id || `#hg-fresha-${key}`;
  const varId = existingVar?.id || `#hg-fresha-${key}-var`;

  return {
    type: "ITEM",
    id: itemId,
    ...(existing?.version != null ? { version: existing.version } : {}),
    present_at_all_locations: true,
    item_data: {
      name: svc.displayName,
      description: svc.description || undefined,
      product_type: "APPOINTMENTS_SERVICE",
      ...(categoryId ? { category_id: categoryId, categories: [{ id: categoryId }] } : {}),
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          ...(existingVar?.version != null ? { version: existingVar.version } : {}),
          present_at_all_locations: true,
          item_variation_data: {
            item_id: itemId,
            name: "Regular",
            pricing_type: svc.priceCents > 0 ? "FIXED_PRICING" : "VARIABLE_PRICING",
            ...(svc.priceCents > 0
              ? { price_money: { amount: svc.priceCents, currency: "USD" } }
              : {}),
            service_duration: svc.durationMin * 60_000,
            available_for_booking: svc.onlineBooking,
            ...(svc.onlineBooking && teamMemberIds.length
              ? { team_member_ids: teamMemberIds }
              : {}),
          },
        },
      ],
    },
  };
}

async function ensureCategory(name, catByNorm) {
  const existing = catByNorm.get(norm(name));
  if (existing) return existing;

  const idem = `hg-sync-cat-${slugKey(name)}-${Date.now()}`;
  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: idem,
    object: {
      type: "CATEGORY",
      id: `#${idem}`,
      present_at_all_locations: true,
      category_data: { name },
    },
  });
  const id = data.catalog_object.id;
  catByNorm.set(norm(name), id);
  return id;
}

async function main() {
  const rows = parseCSV(fs.readFileSync(path.resolve(CSV_PATH), "utf8"));
  const services = rows
    .map((r) => {
      const csvName = (r["Service Name"] || "").trim();
      if (!csvName) return null;
      const online = (r["Online Booking"] || "").trim().toLowerCase();
      return {
        csvName,
        displayName: pickDisplayName(csvName),
        description: pickDescription(csvName, (r["Description"] || "").trim()),
        priceCents: parsePriceCents(r["Retail Price"]),
        durationMin: parseDurationMinutes(r["Duration"]),
        freshaCategory: (r["Category Name"] || "Uncategorized").trim(),
        squareCategory: mapCategory(r["Category Name"] || "Uncategorized", csvName),
        freshaId: (r["Service ID"] || "").trim(),
        onlineBooking: online === "enabled" || online === "",
      };
    })
    .filter(Boolean);

  console.log("\n📋 Fresha → Square sync");
  console.log(`   CSV:  ${CSV_PATH}`);
  console.log(`   Mode: ${DRY_RUN ? "DRY-RUN" : "APPLY"}`);
  console.log(`   Rows: ${services.length}\n`);

  let squareItems = [];
  let squareByNorm = new Map();
  let catByNorm = new Map();

  if (TOKEN && TOKEN.length > 10) {
    const objects = await listCatalog(["ITEM", "CATEGORY"]);
    squareItems = objects.filter(
      (o) => o.type === "ITEM" && !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
    );
    for (const o of squareItems) {
      const n = norm(o.item_data?.name);
      if (n) squareByNorm.set(n, o);
    }
    for (const c of objects.filter((o) => o.type === "CATEGORY" && !o.is_deleted)) {
      const n = norm(c.category_data?.name);
      if (n) catByNorm.set(n, c.id);
    }
    console.log(`   Square: ${squareItems.length} appointment services loaded\n`);
  } else if (!DRY_RUN) {
    console.error("Missing SQUARE_ACCESS_TOKEN");
    process.exit(1);
  }

  const plan = { create: [], update: [], skip: [] };

  for (const svc of services) {
    const existing = findSquareMatch(svc.csvName, svc.displayName, squareByNorm);
    if (existing) {
      const curDesc = (existing.item_data?.description || "").length;
      const needsDesc = svc.description && svc.description.length > curDesc + 20;
      const hasCat = !!(existing.item_data?.category_id || existing.item_data?.categories?.length);
      const existingVar = existing.item_data?.variations?.find((v) => !v.is_deleted);
      const curPrice = existingVar?.item_variation_data?.price_money?.amount ?? null;
      const curDur = existingVar?.item_variation_data?.service_duration ?? null;
      const needsPrice = svc.priceCents > 0 && curPrice !== svc.priceCents;
      const needsDur = svc.durationMin > 0 && curDur !== svc.durationMin * 60_000;
      if (needsDesc || !hasCat || needsPrice || needsDur) {
        plan.update.push({ svc, existing, needsDesc, needsCat: !hasCat, needsPrice, needsDur });
      } else {
        plan.skip.push({ svc, reason: "already complete" });
      }
    } else {
      plan.create.push(svc);
    }
  }

  console.log(`Plan: ${plan.create.length} create · ${plan.update.length} update · ${plan.skip.length} skip\n`);

  if (plan.create.length) {
    console.log("── CREATE (new in Square) ──");
    for (const s of plan.create) {
      console.log(`  + ${s.displayName}`);
      console.log(`      Fresha: ${s.csvName}`);
      console.log(`      Cat: ${s.squareCategory} · $${(s.priceCents / 100).toFixed(2)} · ${s.durationMin}m`);
      console.log(`      Desc: ${s.description.slice(0, 90)}${s.description.length > 90 ? "…" : ""}`);
    }
    console.log("");
  }

  if (plan.update.length) {
    console.log("── UPDATE (enrich existing) ──");
    for (const { svc, existing, needsDesc, needsCat } of plan.update.slice(0, 15)) {
      console.log(
        `  ↺ ${existing.item_data.name}${needsDesc ? " +desc" : ""}${needsCat ? " +cat" : ""} ← ${svc.csvName}`,
      );
    }
    if (plan.update.length > 15) console.log(`  … +${plan.update.length - 15} more`);
    console.log("");
  }

  if (DRY_RUN) {
    console.log("Re-run with --apply to push to Square.");
    if (plan.create.length || plan.update.length) {
      console.log("Then: npm run square:polish-catalog -- --apply --images-only");
    }
    return;
  }

  const teamIds = await getBookableTeamMemberIds();
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const svc of plan.create) {
    try {
      const categoryId = await ensureCategory(svc.squareCategory, catByNorm);
      const object = buildItemObject({ svc, categoryId, existing: null, teamMemberIds: teamIds });
      const idem = `hg-fresha-new-${svc.freshaId || slugKey(svc.displayName)}-${Date.now()}`;
      await squareFetch("POST", "/catalog/object", { idempotency_key: idem.slice(0, 128), object });
      squareByNorm.set(norm(svc.displayName), { item_data: { name: svc.displayName } });
      console.log(`  ✓ NEW ${svc.displayName}`);
      created++;
      await sleep(120);
    } catch (e) {
      console.log(`  ✕ NEW ${svc.displayName}: ${e.message}`);
      failed++;
    }
  }

  for (const { svc, existing, needsDesc, needsCat } of plan.update) {
    try {
      const categoryId = needsCat
        ? await ensureCategory(svc.squareCategory, catByNorm)
        : existing.item_data?.category_id || existing.item_data?.categories?.[0]?.id;

      const merged = {
        ...svc,
        displayName: existing.item_data.name,
        description: needsDesc ? svc.description : existing.item_data.description,
      };
      const object = buildItemObject({
        svc: merged,
        categoryId,
        existing,
        teamMemberIds: teamIds,
      });
      const idem = `hg-fresha-upd-${existing.id}-${Date.now()}`;
      await squareFetch("POST", "/catalog/object", { idempotency_key: idem.slice(0, 128), object });
      console.log(`  ↺ ${existing.item_data.name}`);
      updated++;
      await sleep(100);
    } catch (e) {
      console.log(`  ✕ UPD ${existing.item_data.name}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Sync complete — created ${created}, updated ${updated}, failed ${failed}`);

  if (POLISH_IMAGES && (created > 0 || updated > 0)) {
    console.log("\n🖼  Running image polish for items missing photos…");
    const { spawnSync } = await import("node:child_process");
    const r = spawnSync(
      process.execPath,
      ["--env-file=.env.local", path.join(__dirname, "square-polish-catalog.mjs"), "--apply", "--images-only"],
      { stdio: "inherit", cwd: path.join(__dirname, "..") },
    );
    if (r.status !== 0) console.warn("Image polish exited with", r.status);
  } else if (created > 0) {
    console.log("\nTip: npm run square:polish-catalog -- --apply --images-only");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
