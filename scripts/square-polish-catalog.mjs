#!/usr/bin/env node
/**
 * Polish Square Appointments catalog for customer-facing booking:
 * - Assign reporting categories
 * - Push SEO descriptions + optional name cleanups from square-service-content.mjs
 * - Attach category hero images where missing
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-polish-catalog.mjs --dry-run
 *   node --env-file=.env.local scripts/square-polish-catalog.mjs --apply
 *   node --env-file=.env.local scripts/square-polish-catalog.mjs --apply --images-only
 *   node --env-file=.env.local scripts/square-polish-catalog.mjs --apply --images-only --force-images
 *   node --env-file=.env.local scripts/square-polish-catalog.mjs --apply --meta-only
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SERVICE_CONTENT } from "./square-service-content.mjs";
import { SERVICES } from "./import-services-to-square.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");
const IMAGES_ONLY = args.includes("--images-only");
const META_ONLY = args.includes("--meta-only");
/** Re-upload category heroes even when the item already has image_ids. */
const FORCE_IMAGES = args.includes("--force-images");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!DRY_RUN && (!TOKEN || TOKEN.length < 10)) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

/** Category → branded thumbnail (relative to repo root). */
const CATEGORY_IMAGES = {
  "Spring Specials": "public/images/square-appointments/solaria-inmode-intro-flyer.jpg",
  "Exclusive Model Specials": "public/images/square-appointments/morpheus8-burst-results-flyer.jpg",
  "Bioidentical Hormone Therapy (BHRT)": "public/images/square-appointments/biote-certified-provider-seal.jpg",
  Botox: "public/images/homepage-services/botox-cosmetic-authentic-vial.png",
  "Dermal Fillers": "public/images/homepage-buyer-paths/injectables.png",
  "Skin Spa": "public/images/square-appointments/ipl-photofacial-zemits-530nm.jpg",
  "GlowTox Facial": "public/images/homepage-services/botox-cosmetic-authentic-vial.png",
  "Body Spa": "public/images/square-appointments/quantum-rf-10-before-after.jpg",
  "Lash Spa": "public/images/square-appointments/keratin-lash-lift-before-after.jpg",
  "Brow Spa": "public/images/square-appointments/brow-styles-guide.png",
  "AnteAGE Skin Regeneration": "public/images/square-appointments/anteage-mdx-hair-before-after.jpg",
  "IV Drip Package Deals": "public/images/square-appointments/nad-plus-drip-flyer.png",
  "PRP Injections": "public/images/homepage-services/vamp-skin-revitalization.png",
  "Weight Loss Injections": "public/images/square-appointments/tirzepatide-regen-vial.jpg",
  "Vitamin Injections": "public/images/homepage-services/vitamin-injections-fruit-syringe.png",
  "Trigger Point Injections": "public/images/homepage-services/trigger-point-injections-body-pain-grid.png",
  "Medical Consultations": "public/images/homepage-services/rx-prescription-care-pad-bottle.png",
  "Hello Gorgeous RX™ — Fees": "public/images/homepage-services/rx-prescription-care-pad-bottle.png",
  "Hello Gorgeous RX™ — Recovery & Healing": "public/images/square-appointments/july-recovery-stack-flyer.png",
  "Hello Gorgeous RX™ — Skin & Aesthetics": "public/images/square-appointments/ghk-cu-regen-vial.jpg",
  "Hello Gorgeous RX™ — Weight & Metabolic": "public/images/square-appointments/semaglutide-regen-vial.jpg",
  "Hello Gorgeous RX™ — Hormones & Vitality": "public/images/square-appointments/biote-certified-provider-seal.jpg",
  "Hello Gorgeous RX™ — Peptides": "public/images/square-appointments/peptide-vial-lineup.png",
  FlowWave: "public/images/square-appointments/stemwave-shockwave-banner.png",
};

/** Per-service image overrides (matched against item name). Applied before category heroes. */
const SERVICE_IMAGE_OVERRIDES = [
  {
    re: /hylenex|hylanex|lip dissolver|hyaluronidase/i,
    path: "public/images/square-appointments/hylenex-4-pack-carton.jpg",
    label: "Hylenex",
  },
];

const CATEGORY_KEYWORDS = [
  { cat: "FlowWave", re: /flowwave|shockwave|recovery stack/i },
  { cat: "Botox", re: /botox|jeuveau|dysport|lip flip|neuromodulator|glowtox|baby tox|babytox/i },
  { cat: "Dermal Fillers", re: /filler|syringe|hylanex|dissolver|per syringe/i },
  { cat: "AnteAGE Skin Regeneration", re: /anteage|anteage|exosome|biosome|stem cell growth|scalp treatment/i },
  { cat: "Bioidentical Hormone Therapy (BHRT)", re: /pellet|hormone|bhrt|biote|lab panel/i },
  { cat: "Weight Loss Injections", re: /tirzepatide|semaglutide|retatrutide|glp|weight loss|lipo-mino|phentermine|contrave|metabolic/i },
  { cat: "Vitamin Injections", re: /b12|b-complex|biotin injection|vitamin injection|vitamin d|glutathione injection|mic.?lipo|lipo.?shot/i },
  { cat: "IV Drip Package Deals", re: /iv drip|iv therapy|immunity infusion|myers|nad drip/i },
  { cat: "PRP Injections", re: /prp|prf|vampire|vamp|platelet/i },
  { cat: "Trigger Point Injections", re: /trigger point|multi-site session|intro offer/i },
  { cat: "Lash Spa", re: /lash|volume extension|classic extension|hybrid extension/i },
  { cat: "Brow Spa", re: /brow|lamination|henna|brow tint|brow wax/i },
  { cat: "Body Spa", re: /body contour|quantum rf|morpheus8|solaria|co₂|co2|mommy makeover|trifecta|laser hair|brazilian/i },
  { cat: "Skin Spa", re: /hydra|facial|peel|microneedling|nano needling|dermaplan|photofacial|ipl|carbon laser|diamond glow|signature facial|vi peel|oxygen facial|microderm|geneo|acne facial/i },
  { cat: "Medical Consultations", re: /consultation|medical visit|telehealth|follow-up|intake/i },
  { cat: "Hello Gorgeous RX™ — Peptides", re: /bpc-157|peptide|sermorelin|tesamorelin|ipamorelin|cjc|ghk|semax|selank|epithalon|mots-c|pt-141|heal blend/i },
  { cat: "Hello Gorgeous RX™ — Recovery & Healing", re: /recovery blend|healing|post-procedure/i },
  { cat: "Exclusive Model Specials", re: /vip model|model special|most popular combo|trifecta|burst x3|buy one area/i },
  { cat: "Spring Specials", re: /spring special|april|march special/i },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

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

function buildNameCategoryMap() {
  const map = new Map();
  for (const svc of SERVICES) map.set(svc.name, svc.category);
  for (const [name, content] of Object.entries(SERVICE_CONTENT)) {
    if (content.cat) map.set(name, content.cat);
    if (content.n) map.set(content.n, content.cat || map.get(name));
  }
  return map;
}

function resolveCategory(name, categoryByName, categoryIds) {
  const content = SERVICE_CONTENT[name];
  if (content?.cat && categoryIds.has(content.cat)) return content.cat;

  const fromImport = categoryByName.get(name);
  if (fromImport && categoryIds.has(fromImport)) return fromImport;

  const renamed = content?.n;
  if (renamed) {
    const fromRename = categoryByName.get(renamed);
    if (fromRename && categoryIds.has(fromRename)) return fromRename;
  }

  for (const rule of CATEGORY_KEYWORDS) {
    if (rule.re.test(name) && categoryIds.has(rule.cat)) return rule.cat;
  }

  if (/hello gorgeous rx|rx™|regen|prescription|refill|shipping/i.test(name)) {
    if (/weight|glp|tirzepatide|semaglutide/i.test(name) && categoryIds.has("Hello Gorgeous RX™ — Weight & Metabolic")) {
      return "Hello Gorgeous RX™ — Weight & Metabolic";
    }
    if (/hormone|testosterone|estrogen|hrt|trt/i.test(name) && categoryIds.has("Hello Gorgeous RX™ — Hormones & Vitality")) {
      return "Hello Gorgeous RX™ — Hormones & Vitality";
    }
    if (/peptide|bpc|sermorelin/i.test(name) && categoryIds.has("Hello Gorgeous RX™ — Peptides")) {
      return "Hello Gorgeous RX™ — Peptides";
    }
    if (/skin|aesthetic|topical/i.test(name) && categoryIds.has("Hello Gorgeous RX™ — Skin & Aesthetics")) {
      return "Hello Gorgeous RX™ — Skin & Aesthetics";
    }
    if (/fee|consult|shipping|program/i.test(name) && categoryIds.has("Hello Gorgeous RX™ — Fees")) {
      return "Hello Gorgeous RX™ — Fees";
    }
  }

  return null;
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function uploadImage(objectId, imagePath, displayName) {
  const base = path.basename(imagePath).replace(/\W/g, "");
  const idempotencyKey = FORCE_IMAGES
    ? `hg-polish-f-${objectId.slice(-12)}-${base}-${Date.now().toString(36).slice(-6)}`
    : `hg-polish-${objectId.slice(-12)}-${base}`;
  const requestBody = {
    idempotency_key: idempotencyKey,
    object_id: objectId,
    is_primary: true,
    image: {
      type: "IMAGE",
      id: `#${idempotencyKey}`.slice(0, 46),
      image_data: {
        name: displayName,
        caption: `${displayName} — Hello Gorgeous Med Spa`,
      },
    },
  };

  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(requestBody)], { type: "application/json" }));
  const bytes = fs.readFileSync(imagePath);
  form.append("file", new Blob([bytes], { type: mimeFor(imagePath) }), path.basename(imagePath));

  const res = await fetch(`${HOST}/v2/catalog/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Square-Version": SQUARE_VERSION },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.image?.id;
}

async function main() {
  console.log(`\n✨ Square catalog polish ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}`);
  console.log(`   Host: ${HOST}\n`);

  const categoryByName = buildNameCategoryMap();
  const categories = DRY_RUN ? [] : await listCatalog("CATEGORY");
  const categoryIds = new Map(categories.map((c) => [c.category_data?.name, c.id]));

  const items = DRY_RUN ? [] : await listCatalog("ITEM");
  const appointmentItems = items.filter(
    (o) => o.type === "ITEM" && o.item_data?.product_type === "APPOINTMENTS_SERVICE" && !o.is_deleted,
  );

  if (DRY_RUN) {
    console.log("Dry run — would process live appointment services on --apply.");
    console.log(`Source categories mapped: ${categoryByName.size} service names`);
    console.log(`Category images ready: ${Object.keys(CATEGORY_IMAGES).length}`);
    console.log(`Force replace images: ${FORCE_IMAGES ? "yes" : "no (only missing)"}`);
    let missing = 0;
    for (const [cat, rel] of Object.entries(CATEGORY_IMAGES)) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) {
        console.log(`  ✕ missing file for ${cat}: ${rel}`);
        missing++;
      } else {
        console.log(`  ✓ ${cat} ← ${path.basename(rel)}`);
      }
    }
    if (missing) console.log(`\n⚠ ${missing} category image file(s) missing`);
    return;
  }

  let metaUpdated = 0;
  let imagesUploaded = 0;
  let skipped = 0;
  const unmatched = [];

  for (const item of appointmentItems) {
    const name = item.item_data?.name || "";
    const content = SERVICE_CONTENT[name];
    const categoryName = resolveCategory(name, categoryByName, categoryIds);
    const categoryId = categoryName ? categoryIds.get(categoryName) : null;

    let changed = false;
    const obj = JSON.parse(JSON.stringify(item));
    const data = obj.item_data;

    if (!META_ONLY) {
      const needsImage = FORCE_IMAGES || !(data.image_ids?.length);
      const override = SERVICE_IMAGE_OVERRIDES.find((o) => o.re.test(name));
      const rel = override?.path || (categoryName ? CATEGORY_IMAGES[categoryName] : null);
      const abs = rel ? path.join(ROOT, rel) : null;
      if (needsImage && abs && fs.existsSync(abs)) {
        try {
          const label = override?.label || categoryName || name.slice(0, 80);
          console.log(
            `  🖼  ${name} ← ${label}${FORCE_IMAGES && data.image_ids?.length ? " (replace)" : ""}`,
          );
          await uploadImage(item.id, abs, (override?.label || name).slice(0, 80));
          imagesUploaded++;
          await sleep(150);
        } catch (e) {
          console.log(`  ⚠ image ${name}: ${e.message}`);
        }
      }
    }

    if (!IMAGES_ONLY) {
      const newName = content?.n;
      const newDesc = content?.d;
      const descTooShort = (data.description || "").length < 40;

      if (newName && newName !== name) {
        data.name = newName;
        changed = true;
      }
      if (newDesc && (descTooShort || newDesc.length > (data.description || "").length + 20)) {
        data.description = newDesc;
        delete data.description_html;
        delete data.description_plaintext;
        changed = true;
      }
      if (categoryId) {
        const hasCat =
          data.category_id === categoryId ||
          data.categories?.some((c) => c.id === categoryId);
        if (!hasCat) {
          data.category_id = categoryId;
          data.categories = [{ id: categoryId }];
          changed = true;
        }
      } else if (!categoryName) {
        unmatched.push(name);
      }

      if (changed) {
        try {
          await squarePost("/v2/catalog/object", {
            idempotency_key: `hg-polish-meta-${item.id}-${Date.now()}`,
            object: obj,
          });
          console.log(`  ✓ ${data.name}${categoryName ? ` · ${categoryName}` : ""}`);
          metaUpdated++;
          await sleep(120);
        } catch (e) {
          console.log(`  ✕ ${name}: ${e.message}`);
        }
      } else {
        skipped++;
      }
    }
  }

  console.log(`\nDone.`);
  console.log(`  Metadata updated: ${metaUpdated}`);
  console.log(`  Images uploaded:  ${imagesUploaded}`);
  console.log(`  Unchanged:        ${skipped}`);
  if (unmatched.length) {
    console.log(`  Unmatched category (${unmatched.length}):`);
    unmatched.slice(0, 15).forEach((n) => console.log(`    - ${n}`));
  }
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
