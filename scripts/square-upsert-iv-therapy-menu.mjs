#!/usr/bin/env node
/**
 * Upsert Hello Gorgeous IV Therapy appointment services into Square.
 * Category: "IV Drip Package Deals"
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-upsert-iv-therapy-menu.mjs
 *   node --env-file=.env.local scripts/square-upsert-iv-therapy-menu.mjs --apply
 */

const APPLY = process.argv.includes("--apply");
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENV =
  (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase() ===
  "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";
const VERSION = "2024-11-20";
const IV_CATEGORY = "IV Drip Package Deals";
const VITAMIN_CATEGORY = "Vitamin Injections";

/** Desired appointment menu — aligned with /services/iv-therapy landing. */
const IV_SERVICES = [
  {
    name: "IV Drip — New Client Intro ($99)",
    price: 9900,
    duration: 45,
    description:
      "New clients: any signature wellness drip for $99 including NP consult. Hello Gorgeous Med Spa, Oswego.",
  },
  {
    name: "IV Drip — Build Your Own Bag",
    price: 15000,
    duration: 45,
    description:
      "Custom IV bag — pick your base and boosts. Estimate confirmed by our NP at check-in. Book online, finalize in lounge.",
  },
  {
    name: "IV Drip — Dehydration",
    price: 15000,
    duration: 45,
    description: "Olympia Quench — rehydrate and combat fatigue from dehydration. Ascorbic Acid, Vita Complex, Mineral Blend.",
  },
  {
    name: "IV Drip — Energy Boost",
    price: 15000,
    duration: 45,
    description: "Olympia Get Up & Go — energized metabolism support with Vita Complex and Amino Blend.",
  },
  {
    name: "IV Drip — Immunity Boost",
    price: 15000,
    duration: 45,
    description: "Olympia Immunity — Vitamin C, Vita Complex, and Zinc for immune support.",
  },
  {
    name: "IV Drip — Recovery",
    price: 17500,
    duration: 45,
    description: "Olympia Recovery & Performance — vitamins, aminos, and minerals for athletic recovery.",
  },
  {
    name: "IV Drip — Beauty Glow",
    price: 17500,
    duration: 45,
    description: "Olympia Snow Bright — Alpha Lipoic Acid, Glutathione, and Vitamin C for bright, glowing skin.",
  },
  {
    name: "IV Drip — Inner Beauty",
    price: 17500,
    duration: 45,
    description: "Client favorite — Vitamin C, Biotin, and B-Complex for hair, skin, and nails from within.",
  },
  {
    name: "IV Drip — Myers' Cocktail (45min)",
    price: 15000,
    duration: 45,
    description: "Classic Myers Cocktail — Vitamin C, B-complex, magnesium, calcium, hydroxocobalamin.",
  },
  {
    name: "IV Drip — Hangover Recovery",
    price: 16500,
    duration: 45,
    description: "Olympia Reboot — anti-nausea plus vitamins and minerals to bounce back fast.",
  },
  {
    name: "IV Drip — Headache Relief",
    price: 15000,
    duration: 45,
    description: "Olympia Alleviate — calcium, magnesium, Vita Complex for headache and PMS discomfort.",
  },
  {
    name: "IV Drip — Mental Clarity",
    price: 16500,
    duration: 45,
    description: "Olympia Brainstorm — Alpha Lipoic Acid, L-Taurine, Pyridoxine for focus and clarity.",
  },
  {
    name: "IV Drip — Tri-Immune Boost",
    price: 15000,
    duration: 45,
    description: "Triple antioxidant immune boost — Ascorbic Acid, Glutathione, Zinc.",
  },
  {
    name: "IV Drip — NAD+",
    price: 35000,
    duration: 180,
    description: "NAD+ 500mg IV for cellular energy, focus, and recovery. NP-screened. 2–3 hour infusion.",
  },
];

const VITAMIN_SERVICES = [
  {
    name: "Vitamin Injection Bar — Choose Your Shot",
    price: 2500,
    duration: 10,
    description:
      "Every shot $25 — B12, Biotin, Vitamin D3, Glutathione, Vitamin C, Lipo-Mino, Amino Blend, Tri-Immune. Walk-in friendly.",
  },
];

async function square(method, path, body) {
  const res = await fetch(`${ENV}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json.errors || json));
  return json;
}

async function listAll(types) {
  const out = [];
  let cursor;
  do {
    const q = new URLSearchParams({ types });
    if (cursor) q.set("cursor", cursor);
    const data = await square("GET", `/catalog/list?${q}`);
    out.push(...(data.objects || []));
    cursor = data.cursor;
  } while (cursor);
  return out;
}

async function findCategoryId(name) {
  const cats = await listAll("CATEGORY");
  const hit = cats.find((c) => c.category_data?.name === name);
  return hit?.id || null;
}

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
}

function findItem(items, desiredName) {
  const n = norm(desiredName);
  // exact-ish
  let hit = items.find((o) => norm(o.item_data?.name) === n);
  if (hit) return hit;
  // fuzzy aliases
  const aliases = {
    "iv drip myers cocktail 45min": ["iv drip myers cocktail", "myers cocktail"],
    "iv drip energy boost": ["iv drip energy performance", "iv drip energy & performance"],
    "iv drip hangover recovery": ["iv drip hangover", "reboot hangover"],
  };
  for (const [key, list] of Object.entries(aliases)) {
    if (n.includes(key.replace("iv drip ", "")) || list.some((a) => n.includes(norm(a)))) {
      // continue
    }
  }
  if (n.includes("tri immune") || n.includes("tri-immune")) {
    hit = items.find((o) => /tri[- ]?immune/i.test(o.item_data?.name || ""));
    if (hit) return hit;
    return null; // do not fall through to Immunity Boost
  }
  if (n.includes("myers")) {
    hit = items.find((o) => /myers/i.test(o.item_data?.name || ""));
    if (hit) return hit;
  }
  if (n.includes("energy")) {
    hit = items.find((o) => /energy/i.test(o.item_data?.name || "") && /iv drip/i.test(o.item_data?.name || ""));
    if (hit) return hit;
  }
  if (n.includes("immunity boost") || (n.includes("immunity") && !n.includes("tri"))) {
    hit = items.find(
      (o) => /immunity boost/i.test(o.item_data?.name || "") && !/tri/i.test(o.item_data?.name || ""),
    );
    if (hit) return hit;
  }
  if (n.includes("hangover")) {
    hit = items.find((o) => /hangover|reboot/i.test(o.item_data?.name || "") && /iv/i.test(o.item_data?.name || ""));
    if (hit) return hit;
  }
  if (n.includes("beauty glow") || (n.includes("beauty") && !n.includes("inner"))) {
    hit = items.find((o) => /beauty glow|iv beauty/i.test(o.item_data?.name || ""));
    if (hit) return hit;
  }
  if (n.includes("nad+") && !n.includes("protocol")) {
    hit = items.find((o) => /^iv drip — nad\+$/i.test(o.item_data?.name || "") || o.item_data?.name === "IV Drip — NAD+");
    if (hit) return hit;
  }
  if (n.includes("vitamin injection bar")) {
    hit = items.find((o) => /vitamin injection bar/i.test(o.item_data?.name || ""));
    if (hit) return hit;
  }
  return null;
}

async function upsertService(svc, categoryId, existingItems) {
  const found = findItem(existingItems, svc.name);
  if (found) {
    const retrieved = await square("GET", `/catalog/object/${found.id}?include_related_objects=false`);
    const fresh = retrieved.object;
    const vars = fresh.item_data?.variations || [];
    const target = vars[0];
    if (!target?.item_variation_data) throw new Error(`No variation on ${svc.name}`);

    fresh.item_data.name = svc.name;
    fresh.item_data.description = svc.description;
    fresh.item_data.product_type = "APPOINTMENTS_SERVICE";
    if (categoryId) {
      fresh.item_data.categories = [{ id: categoryId }];
      fresh.item_data.category_id = categoryId;
    }
    target.item_variation_data.pricing_type = "FIXED_PRICING";
    target.item_variation_data.price_money = { amount: svc.price, currency: "USD" };
    target.item_variation_data.service_duration = svc.duration * 60_000;
    target.item_variation_data.available_for_booking = true;

    if (!APPLY) {
      console.log(`  WOULD UPDATE  ${svc.name}  $${svc.price / 100}  var=${target.id}`);
      return { name: svc.name, itemId: fresh.id, variationId: target.id, action: "update" };
    }

    await square("POST", "/catalog/object", {
      idempotency_key: `iv-upsert-${fresh.id}-${svc.price}-${Date.now()}`.slice(0, 128),
      object: fresh,
    });
    console.log(`  ✓ UPDATED  ${svc.name}  $${svc.price / 100}  var=${target.id}`);
    return { name: svc.name, itemId: fresh.id, variationId: target.id, action: "update" };
  }

  if (!APPLY) {
    console.log(`  WOULD CREATE  ${svc.name}  $${svc.price / 100}`);
    return { name: svc.name, itemId: null, variationId: null, action: "create" };
  }

  const slug = svc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  const itemTemp = `#iv-${slug}-item`;
  const varTemp = `#iv-${slug}-var`;
  const res = await square("POST", "/catalog/object", {
    idempotency_key: `iv-create-${slug}-${Date.now()}`.slice(0, 128),
    object: {
      type: "ITEM",
      id: itemTemp,
      present_at_all_locations: true,
      item_data: {
        name: svc.name,
        description: svc.description,
        product_type: "APPOINTMENTS_SERVICE",
        ...(categoryId ? { categories: [{ id: categoryId }], category_id: categoryId } : {}),
        variations: [
          {
            type: "ITEM_VARIATION",
            id: varTemp,
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemTemp,
              name: "Regular",
              pricing_type: "FIXED_PRICING",
              price_money: { amount: svc.price, currency: "USD" },
              service_duration: svc.duration * 60_000,
              available_for_booking: true,
            },
          },
        ],
      },
    },
  });
  const obj = res.catalog_object;
  const variationId = obj.item_data?.variations?.[0]?.id;
  console.log(`  ✓ CREATED  ${svc.name}  $${svc.price / 100}  var=${variationId}`);
  existingItems.push(obj);
  return { name: svc.name, itemId: obj.id, variationId, action: "create" };
}

async function main() {
  if (!TOKEN || TOKEN.length < 10) {
    console.error("Missing SQUARE_ACCESS_TOKEN");
    process.exit(1);
  }
  console.log(`\n🌸 Square IV Therapy upsert · ${APPLY ? "APPLY" : "DRY RUN"}\n`);

  const ivCatId = await findCategoryId(IV_CATEGORY);
  const vitCatId = await findCategoryId(VITAMIN_CATEGORY);
  console.log(`Category "${IV_CATEGORY}": ${ivCatId || "MISSING"}`);
  console.log(`Category "${VITAMIN_CATEGORY}": ${vitCatId || "MISSING"}\n`);

  const items = (await listAll("ITEM")).filter(
    (o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE" || o.item_data?.variations?.some((v) => v.item_variation_data?.service_duration),
  );

  const results = [];
  console.log("IV Drip Package Deals:");
  for (const svc of IV_SERVICES) {
    results.push(await upsertService(svc, ivCatId, items));
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log("\nVitamin Injections:");
  for (const svc of VITAMIN_SERVICES) {
    results.push(await upsertService(svc, vitCatId, items));
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log("\n—— Variation IDs (for lib/iv-therapy-marketing.ts) ——");
  for (const r of results) {
    if (r.variationId) console.log(`  ${r.name}: ${r.variationId}`);
  }

  if (!APPLY) console.log("\nRe-run with --apply to write to Square.\n");
  else console.log("\nDone.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
