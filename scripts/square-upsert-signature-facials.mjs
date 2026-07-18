#!/usr/bin/env node
/**
 * Upsert HYDRA Perfection MD Signature Facial protocols to Square Appointments.
 * Source: Downloads/Multi-Modality Med Spa Facials (Signature Facial Menu).
 *
 *   node --env-file=.env.local scripts/square-upsert-signature-facials.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-signature-facials.mjs --apply
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APPLY = process.argv.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

const CATEGORY = "Skin Spa";
const LABEL = "FB7185";
/** Marissa Murray — Licensed Esthetician (these protocols are hers). */
const MARISSA = "TMjZzrkoSsBocyWm";

/** Prices/durations aligned to Signature Facial Menu.dc.html */
const FACIALS = [
  {
    name: "Signature Facial — The Clarity Protocol",
    aliases: ["The Clarity Protocol", "Clarity Protocol"],
    price: 9900,
    durationMin: 50,
    image: "public/images/square-appointments/signature-facials/fac-clarity.jpg",
    description: [
      "THE CLARITY PROTOCOL — $99 · 50 MIN · 6 MODALITIES",
      "Best for: Acne & Congestion",
      "",
      "Clarifying Deep-Detox on the HYDRA Perfection MD 14-in-1 system.",
      "Ultrasonic scrub · Detox bubble pen · Vacuum · High frequency · Blue LED · Oxygen infusion.",
      "",
      "No harsh peel. No downtime. Customized by your esthetician.",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Signature Facial — The Collagen Reset",
    aliases: ["The Collagen Reset", "Collagen Reset"],
    price: 18900,
    durationMin: 75,
    image: "public/images/square-appointments/signature-facials/fac-collagen.jpg",
    description: [
      "THE COLLAGEN RESET — $189 · 75 MIN · 6 MODALITIES",
      "Best for: Fine Lines & Firmness",
      "",
      "Firming RF & micro-collagen protocol on the HYDRA Perfection MD.",
      "Hydro dermabrasion · 3-pole RF · Ultrasound · Bio-electric · Oxygen · Cool seal.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Signature Facial — The Gorgeous Glow",
    aliases: ["The Gorgeous Glow", "Gorgeous Glow", "Hydra-Infusion Radiance"],
    price: 12900,
    durationMin: 60,
    image: "public/images/square-appointments/signature-facials/fac-glow.jpg",
    description: [
      "THE GORGEOUS GLOW — $129 · 60 MIN · 6 MODALITIES",
      "Best for: Hydration & Radiance · Most Booked",
      "",
      "Hydra-infusion radiance — event-ready glow with oxygen, essence, and hydro-infusion.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Signature Facial — The Poreless Polish",
    aliases: ["The Poreless Polish", "Poreless Polish"],
    price: 11900,
    durationMin: 55,
    image: "public/images/square-appointments/signature-facials/fac-pore.jpg",
    description: [
      "THE PORELESS POLISH — $119 · 55 MIN · 5 MODALITIES",
      "Best for: Pores & Texture",
      "",
      "Diamond resurfacing & refine — tighter-looking pores, smoother texture.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Signature Facial — The Calm Restore",
    aliases: ["The Calm Restore", "Calm Restore"],
    price: 8900,
    durationMin: 45,
    image: "public/images/square-appointments/signature-facials/fac-calm.jpg",
    description: [
      "THE CALM RESTORE — $89 · 45 MIN · 5 MODALITIES",
      "Best for: Sensitive & Redness",
      "",
      "Barrier-repair & de-flush — gentle, no abrasion, no downtime.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Signature Facial — The Luminous Reveal",
    aliases: ["The Luminous Reveal", "Luminous Reveal"],
    price: 13900,
    durationMin: 60,
    image: "public/images/square-appointments/signature-facials/fac-lumin.jpg",
    description: [
      "THE LUMINOUS REVEAL — $139 · 60 MIN · 6 MODALITIES",
      "Best for: Dullness & Uneven Tone",
      "",
      "Brightening tone-correct protocol with layered exfoliation and multi-wavelength LED.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
];

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function squareFetch(method, apiPath, body) {
  const res = await fetch(`${HOST}/v2${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.errors?.[0]?.detail || data?.errors?.[0]?.code || res.status);
  return data;
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

async function uploadImage(objectId, imagePath, displayName) {
  const abs = path.join(ROOT, imagePath);
  if (!fs.existsSync(abs)) {
    console.log("  ⚠ missing", imagePath);
    return null;
  }
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  const key = `hg-sigfac-${objectId.slice(-10)}-${Date.now().toString(36).slice(-5)}`;
  const form = new FormData();
  form.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          idempotency_key: key,
          object_id: objectId,
          is_primary: true,
          image: {
            type: "IMAGE",
            id: `#${key}`.slice(0, 46),
            image_data: { name: displayName.slice(0, 80), caption: `${displayName} — Hello Gorgeous` },
          },
        }),
      ],
      { type: "application/json" },
    ),
  );
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

function findExisting(byName, svc) {
  for (const key of [svc.name, ...(svc.aliases || [])].map((n) => n.toLowerCase())) {
    if (byName.has(key)) return byName.get(key);
  }
  return null;
}

async function main() {
  console.log(`\n✨ Signature Facials → Square (${APPLY ? "APPLY" : "DRY-RUN"})\n`);
  const cats = (await listCatalog("CATEGORY")).filter((c) => !c.is_deleted);
  const catId = cats.find((c) => c.category_data?.name === CATEGORY)?.id;
  if (!catId) throw new Error(`Missing category ${CATEGORY}`);
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );
  const byName = new Map(items.map((o) => [(o.item_data?.name || "").trim().toLowerCase(), o]));

  for (const svc of FACIALS) {
    const existing = findExisting(byName, svc);
    console.log(existing ? "UPDATE" : "CREATE ", svc.name, existing ? `(was ${existing.item_data.name})` : "");
    if (!APPLY) continue;
    const key = `hg-sigfac-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const itemId = existing?.id || `#${key}`;
    const existingVar = existing?.item_data?.variations?.[0];
    const varId = existingVar?.id || `#${key}-var`;
    try {
      const data = await squareFetch("POST", "/catalog/object", {
        idempotency_key: key,
        object: {
          type: "ITEM",
          id: itemId,
          ...(existing?.version != null ? { version: existing.version } : {}),
          present_at_all_locations: true,
          item_data: {
            name: svc.name,
            description: svc.description,
            product_type: "APPOINTMENTS_SERVICE",
            category_id: catId,
            categories: [{ id: catId }],
            label_color: LABEL,
            variations: [
              {
                type: "ITEM_VARIATION",
                id: varId,
                ...(existingVar?.version != null ? { version: existingVar.version } : {}),
                present_at_all_locations: true,
                item_variation_data: {
                  item_id: itemId,
                  name: "Regular",
                  pricing_type: "FIXED_PRICING",
                  price_money: { amount: svc.price, currency: "USD" },
                  service_duration: svc.durationMin * 60000,
                  available_for_booking: true,
                  team_member_ids: [MARISSA],
                },
              },
            ],
          },
        },
      });
      const id = data.catalog_object?.id || itemId;
      console.log("  ✓", id);
      await uploadImage(id, svc.image, svc.name);
      console.log("  🖼 image");
      await new Promise((r) => setTimeout(r, 220));
    } catch (e) {
      console.log("  FAILED", e.message);
    }
  }

  // Refresh generic Signature Facial description to point at protocol menu
  const generic = byName.get("signature facial");
  if (generic && APPLY) {
    try {
      const v = generic.item_data.variations?.[0];
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: `hg-sigfac-generic-${Date.now()}`,
        object: {
          type: "ITEM",
          id: generic.id,
          version: generic.version,
          present_at_all_locations: true,
          item_data: {
            ...generic.item_data,
            description: [
              "SIGNATURE FACIAL — CUSTOM PROTOCOL · FROM $89",
              "",
              "Built on the HYDRA Perfection MD 14-modality system.",
              "Prefer a named protocol? Book Clarity, Collagen Reset, Gorgeous Glow,",
              "Poreless Polish, Calm Restore, or Luminous Reveal from the Skin Spa menu.",
              "",
              "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
            ].join("\n"),
            label_color: LABEL,
            variations: v
              ? [
                  {
                    ...v,
                    item_variation_data: {
                      ...v.item_variation_data,
                      available_for_booking: true,
                    },
                  },
                ]
              : generic.item_data.variations,
          },
        },
      });
      console.log("UPDATE Signature Facial (generic) description");
      const glow = "public/images/square-appointments/signature-facials/fac-glow.jpg";
      if (fs.existsSync(path.join(ROOT, glow))) {
        await uploadImage(generic.id, glow, "Signature Facial");
        console.log("  🖼 Signature Facial image ← Gorgeous Glow");
      }
    } catch (e) {
      console.log("generic update failed", e.message);
    }
  }

  console.log(APPLY ? "\nDone.\n" : "\nDry-run only. Re-run with --apply.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
