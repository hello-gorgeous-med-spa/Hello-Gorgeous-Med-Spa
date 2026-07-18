#!/usr/bin/env node
/**
 * Create Microblading category + Jen Vokoun services (regular, hybrid, color refresher + Meet Jen specials).
 * Jen only — TMTwajwlTLQgz8mI
 *
 * Prices from lib/brow-journey-marketing.ts BROW_JOURNEY_PRICING.
 *
 *   node --env-file=.env.local scripts/square-upsert-jen-microblading.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-jen-microblading.mjs --apply
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

const JEN = "TMTwajwlTLQgz8mI";
const CATEGORY = "Microblading";
const LABEL = "B45309"; // warm amber — distinct from Brow Spa

const SERVICES = [
  {
    name: "Microblading — Regular (Hair Stroke)",
    aliases: [
      "Microblading Fine Line, Shade, or Powder",
      "Microblading",
      "Microblading — Regular",
    ],
    price: 45000,
    durationMin: 150,
    image: "public/images/square-appointments/jen-microblading-regular.jpg",
    imageFallbacks: [
      "public/images/brow-journey/pmu-microblade.jpg",
      "public/images/brow-journey/brow-microblade2.png",
    ],
    pinOrdinal: -2251799813685248,
    description: [
      "MICROBLADING — REGULAR HAIR STROKE · $450",
      "With Jen Vokoun · Permanent Makeup Artist",
      "",
      "Fine, crisp individual strokes drawn by hand to mimic real brow hairs.",
      "Most natural, barely-there look. Perfecting touch-up included with initial session.",
      "",
      "hellogorgeousmedspa.com/microblading-brow-pmu-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Hybrid / Combo Brows",
    aliases: ["Combo Brows", "Hybrid Brows", "Combo / Hybrid Brows"],
    price: 55000,
    durationMin: 165,
    image: "public/images/square-appointments/jen-microblading-hybrid.jpg",
    imageFallbacks: [
      "public/images/brow-journey/brow-mapping.png",
      "public/images/brow-journey/pmu-shading.jpg",
    ],
    pinOrdinal: -2251799812000000,
    description: [
      "HYBRID / COMBO BROWS · $550",
      "With Jen Vokoun · Permanent Makeup Artist",
      "",
      "Hair strokes through the front for realism + soft ombré shading through the body and tail.",
      "Natural and defined. Perfecting touch-up included with initial session.",
      "",
      "hellogorgeousmedspa.com/microblading-brow-pmu-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Microblading Color Refresher",
    aliases: ["Yearly Refresher", "Color Refresher", "Brow Color Refresher", "Annual Color Refresher"],
    price: 25000,
    durationMin: 90,
    image: "public/images/square-appointments/jen-microblading-refresher.jpg",
    imageFallbacks: [
      "public/images/brow-journey/pmu-natural.jpg",
      "public/images/square-appointments/brow-before-after-sparse-to-filled.jpg",
    ],
    pinOrdinal: -2251799810314752,
    description: [
      "MICROBLADING COLOR REFRESHER · $250",
      "With Jen Vokoun · Permanent Makeup Artist",
      "",
      "Annual (or as-needed) color refresh to keep brows looking their best.",
      "For existing clients who previously had microblading / brow PMU with us or an equivalent heal.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Meet Jen Special — Microblading $350",
    aliases: ["Meet Jen Microblading", "Meet Jen Special Microblading"],
    price: 35000,
    durationMin: 150,
    image: "public/images/square-appointments/jen-microblading-special.jpg",
    imageFallbacks: [
      "public/images/brow-journey/jen-vokoun.jpg",
      "public/images/brow-journey/pmu-microblade.jpg",
    ],
    pinOrdinal: -2251799813686000,
    description: [
      "MEET JEN SPECIAL — MICROBLADING · $350",
      "With Jen Vokoun · Permanent Makeup Artist",
      "",
      "Introductory special while Jen builds her book at Hello Gorgeous.",
      "Regular microblading hair-stroke brows · perfecting touch-up included.",
      "Limited availability — book while the Meet Jen pricing is open.",
      "",
      "hellogorgeousmedspa.com/microblading-brow-pmu-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Meet Jen Special — Hybrid / Combo $400",
    aliases: ["Meet Jen Combo", "Meet Jen Hybrid"],
    price: 40000,
    durationMin: 165,
    image: "public/images/square-appointments/jen-microblading-special-hybrid.jpg",
    imageFallbacks: [
      "public/images/brow-journey/jen-vokoun-2.jpg",
      "public/images/brow-journey/brow-mapping.png",
    ],
    pinOrdinal: -2251799813685800,
    description: [
      "MEET JEN SPECIAL — HYBRID / COMBO · $400",
      "With Jen Vokoun · Permanent Makeup Artist",
      "",
      "Introductory special for combo / hybrid brows (strokes + shading).",
      "Regular price $550 · Meet Jen special $400 while available.",
      "",
      "hellogorgeousmedspa.com/microblading-brow-pmu-oswego-il",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
  {
    name: "Microblading Consultation with Jen — Free",
    aliases: [
      "Brow Microblading Consultation",
      "Microblading Consultation — Free",
      "Microblading Consultation",
    ],
    price: 0,
    durationMin: 30,
    image: "public/images/square-appointments/jen-microblading-consult.jpg",
    imageFallbacks: ["public/images/brow-journey/jen-vokoun.jpg"],
    pinOrdinal: -2251799808629504,
    description: [
      "MICROBLADING CONSULTATION WITH JEN — FREE",
      "",
      "Shape mapping, technique recommendation (microblading vs hybrid vs powder),",
      "pigment discussion, and pricing. No pressure — just a clear plan for your brows.",
      "",
      "Hello Gorgeous Med Spa · Oswego IL · (630) 636-6193",
    ].join("\n"),
  },
];

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

function resolveImage(svc) {
  for (const rel of [svc.image, ...(svc.imageFallbacks || [])]) {
    if (rel && fs.existsSync(path.join(ROOT, rel))) return rel;
  }
  return null;
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

async function ensureCategory(cats) {
  const hit = cats.find((c) => !c.is_deleted && c.category_data?.name === CATEGORY);
  if (hit) return hit.id;
  if (!APPLY) {
    console.log("Would create category:", CATEGORY);
    return "#microblading-cat";
  }
  const key = `hg-microblad-cat-${Date.now()}`;
  const data = await squareFetch("POST", "/catalog/object", {
    idempotency_key: key,
    object: {
      type: "CATEGORY",
      id: `#${key}`,
      category_data: { name: CATEGORY },
    },
  });
  console.log("✓ created category Microblading", data.catalog_object?.id);
  return data.catalog_object.id;
}

async function uploadImage(objectId, imagePath, displayName) {
  const abs = path.join(ROOT, imagePath);
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const key = `hg-jen-mb-${objectId.slice(-10)}-${Date.now().toString(36).slice(-5)}`;
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
            image_data: { name: displayName.slice(0, 80), caption: `${displayName} — Jen Vokoun · Hello Gorgeous` },
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
  if (!res.ok) throw new Error(json?.errors?.[0]?.detail || JSON.stringify(json));
  return json.image?.id;
}

function findExisting(byName, svc) {
  for (const key of [svc.name, ...(svc.aliases || [])].map((n) => n.trim().toLowerCase())) {
    if (byName.has(key)) return byName.get(key);
  }
  return null;
}

async function main() {
  console.log(`\n✏️  Jen Microblading → Square (${APPLY ? "APPLY" : "DRY-RUN"})\n`);

  // Prepare JPEG copies for Square
  const copies = [
    ["public/images/brow-journey/pmu-microblade.jpg", "public/images/square-appointments/jen-microblading-regular.jpg"],
    ["public/images/brow-journey/brow-mapping.png", "public/images/square-appointments/jen-microblading-hybrid.jpg"],
    ["public/images/brow-journey/pmu-natural.jpg", "public/images/square-appointments/jen-microblading-refresher.jpg"],
    ["public/images/brow-journey/jen-vokoun.jpg", "public/images/square-appointments/jen-microblading-special.jpg"],
    ["public/images/brow-journey/jen-vokoun-2.jpg", "public/images/square-appointments/jen-microblading-special-hybrid.jpg"],
    ["public/images/brow-journey/jen-vokoun.jpg", "public/images/square-appointments/jen-microblading-consult.jpg"],
  ];
  for (const [src, dest] of copies) {
    const absSrc = path.join(ROOT, src);
    const absDest = path.join(ROOT, dest);
    if (!fs.existsSync(absSrc)) continue;
    if (src.endsWith(".png") || src.endsWith(".webp")) {
      // defer to sips via shell in apply path — for now copy if jpg exists else skip
      continue;
    }
    fs.mkdirSync(path.dirname(absDest), { recursive: true });
    if (!fs.existsSync(absDest)) fs.copyFileSync(absSrc, absDest);
  }

  const cats = await listCatalog("CATEGORY");
  const catId = await ensureCategory(cats);
  const items = (await listCatalog("ITEM")).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );
  const byName = new Map(items.map((o) => [(o.item_data?.name || "").trim().toLowerCase(), o]));

  for (const svc of SERVICES) {
    const existing = findExisting(byName, svc);
    const img = resolveImage(svc);
    console.log(
      existing ? "UPDATE" : "CREATE ",
      svc.name,
      `$${(svc.price / 100).toFixed(0)}`,
      existing ? `(was: ${existing.item_data.name})` : "",
      img ? path.basename(img) : "no-img",
    );
    if (!APPLY) continue;

    const key = `hg-jen-mb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const itemId = existing?.id || `#${key}`;
    const existingVar = existing?.item_data?.variations?.[0];
    const varId = existingVar?.id || `#${key}-var`;
    const categories = [{ id: catId }];
    if (svc.pinOrdinal != null) categories[0].ordinal = svc.pinOrdinal;

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
            categories,
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
                  team_member_ids: [JEN],
                },
              },
            ],
          },
        },
      });
      const id = data.catalog_object?.id || itemId;
      console.log("  ✓", id, "→ Jen only");
      if (img) {
        await uploadImage(id, img, svc.name);
        console.log("  🖼");
      }
      byName.set(svc.name.toLowerCase(), data.catalog_object || existing);
      await new Promise((r) => setTimeout(r, 220));
    } catch (e) {
      console.log("  FAILED", e.message);
    }
  }

  console.log(APPLY ? "\nDone. Microblading category → Jen only.\n" : "\nDry-run. Re-run with --apply.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
