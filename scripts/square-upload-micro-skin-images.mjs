#!/usr/bin/env node
/**
 * Upload microneedling + microdermabrasion creatives to Square Appointments.
 *
 *   node --env-file=.env.local scripts/square-upload-micro-skin-images.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upload-micro-skin-images.mjs --apply
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run") || !process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

/** Most-specific first. Leaves AnteAGE / PRP / Baby Tox SKUs alone. */
const RULES = [
  {
    re: /^microdermabrasion$/i,
    path: "public/images/square-appointments/microdermabrasion-treatment.jpg",
    label: "Microdermabrasion",
  },
  {
    re: /^microneedling$/i,
    path: "public/images/square-appointments/microneedling-treatment.jpg",
    label: "Microneedling",
  },
  {
    re: /^nano[- ]?needling$/i,
    path: "public/images/square-appointments/nano-needling-treatment.jpg",
    label: "Nano Needling",
  },
  {
    re: /^oxygen facial$/i,
    path: "public/images/square-appointments/oxygen-facial-treatment.jpg",
    label: "Oxygen Facial",
  },
];

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

async function uploadImage(objectId, imagePath, displayName) {
  const abs = path.join(ROOT, imagePath);
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const idempotencyKey = `hg-micro-${objectId.slice(-10)}-${Date.now().toString(36).slice(-5)}`;
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
  form.append("file", new Blob([fs.readFileSync(abs)], { type: mime }), path.basename(abs));
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
  console.log(`\nMicroneedling / microdermabrasion Square images ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  let ok = 0;
  for (const rule of RULES) {
    const abs = path.join(ROOT, rule.path);
    if (!fs.existsSync(abs)) {
      console.log(`✕ missing file ${rule.path}`);
      continue;
    }
    const hits = items.filter((o) => rule.re.test(o.item_data?.name || ""));
    if (!hits.length) {
      console.log(`· no match for ${rule.label}`);
      continue;
    }
    for (const item of hits) {
      console.log(`→ ${item.item_data.name} ← ${path.basename(rule.path)}`);
      if (DRY_RUN) continue;
      try {
        await uploadImage(item.id, rule.path, rule.label);
        ok++;
        await new Promise((r) => setTimeout(r, 300));
      } catch (e) {
        console.error(`  ✕ ${e instanceof Error ? e.message.slice(0, 200) : e}`);
      }
    }
  }
  if (!DRY_RUN) console.log(`\nUploaded ${ok} images.`);
  else console.log("\nDry-run only. Re-run with --apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
