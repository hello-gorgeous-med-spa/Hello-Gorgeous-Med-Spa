#!/usr/bin/env node
/**
 * Upload Dermalogica chemical peel creatives onto peel Square services.
 *
 *   node --env-file=.env.local scripts/square-upload-chemical-peel-images.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upload-chemical-peel-images.mjs --apply
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

const RULES = [
  {
    re: /vi peel|powerclear|acne peel|purify peel/i,
    path: "public/images/square-appointments/dermalogica-powerclear-peel-ba.jpg",
    label: "PowerClear Peel",
  },
  {
    re: /age.?reversal|anti.?age peel|renewal peel/i,
    path: "public/images/square-appointments/dermalogica-agereversal-peel-ba.jpg",
    label: "AGEreversal Peel",
  },
  {
    re: /chemical peel|dermalogica|glycolic peel|jessner|tca peel|mandelic|salicylic peel|skinceuticals peel|\bpeel\b/i,
    path: "public/images/square-appointments/dermalogica-peel-treatment.jpg",
    label: "Chemical Peel",
  },
];

const EXCLUDE = /hydra|hydrafacial|geneo|microneedling|ipl|photofacial|anteage|carbon laser/i;

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
  const idempotencyKey = `hg-peel-${objectId.slice(-10)}-${Date.now().toString(36).slice(-5)}`;
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
  form.append("file", new Blob([fs.readFileSync(abs)], { type: "image/jpeg" }), path.basename(abs));
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
  console.log(`\nChemical peel Square image upload ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  const items = await listCatalog("ITEM");
  const peels = items.filter((o) => {
    const name = o.item_data?.name || "";
    return (
      o.item_data?.product_type === "APPOINTMENTS_SERVICE" &&
      !o.is_deleted &&
      /\bpeel\b|chemical peel|vi peel|dermalogica/i.test(name) &&
      !EXCLUDE.test(name)
    );
  });

  console.log(`Found ${peels.length} peel services\n`);
  let ok = 0;
  for (const item of peels) {
    const name = item.item_data.name;
    const rule = RULES.find((r) => r.re.test(name));
    if (!rule) {
      console.log(`  · skip (no rule): ${name}`);
      continue;
    }
    console.log(`  → ${name}`);
    console.log(`      ${rule.label} ← ${path.basename(rule.path)}`);
    if (DRY_RUN) continue;
    try {
      await uploadImage(item.id, rule.path, rule.label);
      ok++;
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error(`      ✕ ${e instanceof Error ? e.message.slice(0, 200) : e}`);
    }
  }
  if (!DRY_RUN) console.log(`\nUploaded ${ok} images.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
