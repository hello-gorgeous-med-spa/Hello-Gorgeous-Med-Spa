#!/usr/bin/env node
/**
 * Upload Revanesse Lips+/Versa+ product shot onto lip/dermal filler services.
 *
 *   node --env-file=.env.local scripts/square-upload-lip-filler-image.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upload-lip-filler-image.mjs --apply
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
const IMAGE = "public/images/square-appointments/revanesse-lips-versa.jpg";

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const MATCH =
  /lip filler|lips?\+|revanesse|versa\+|dermal filler|cheek filler|jawline filler|chin filler|nasolabial|marionette|per syringe|filler —|filler -/i;
const EXCLUDE = /hylenex|hylanex|dissolver|hyaluronidase|lip flip|botox|glowtox/i;

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
  const idempotencyKey = `hg-lips-${objectId.slice(-10)}-${Date.now().toString(36).slice(-5)}`;
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
  console.log(`\nLip filler Square image upload ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  const items = await listCatalog("ITEM");
  const fillers = items.filter(
    (o) =>
      o.item_data?.product_type === "APPOINTMENTS_SERVICE" &&
      !o.is_deleted &&
      MATCH.test(o.item_data?.name || "") &&
      !EXCLUDE.test(o.item_data?.name || ""),
  );

  console.log(`Found ${fillers.length} filler services\n`);
  let ok = 0;
  for (const item of fillers) {
    const name = item.item_data.name;
    console.log(`  → ${name}`);
    if (DRY_RUN) continue;
    try {
      await uploadImage(item.id, IMAGE, "Revanesse Lips+ / Versa+");
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
