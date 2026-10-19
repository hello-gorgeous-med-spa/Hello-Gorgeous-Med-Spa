#!/usr/bin/env node
/**
 * HG-VIP-002 — Square catalog + payment link for eligible Golden Ticket packages.
 *
 * Face collection ($2,799) is eligible (device + injectables + vitamin products).
 * Body ($3,999) and Wellness ($1,199) contain tirzepatide/peptides — DO NOT create
 * payment links unless --include-rx is passed after clinical + Square policy approval.
 *
 *   node --env-file=.env.local scripts/square-upsert-golden-ticket.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-golden-ticket.mjs --apply
 */

const APPLY = process.argv.includes("--apply");
const INCLUDE_RX = process.argv.includes("--include-rx");
const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";
const REDIRECT = "https://www.hellogorgeousmedspa.com/golden-ticket?paid=1";

const FACE_TERMS = [
  "VIP GOLDEN TICKET — MOMMY MAKEOVER: FACE, NECK & UNDER-EYE · $2,799",
  "Advertised collection value $4,580 (flyer).",
  "",
  "Includes (promotional description — candidacy required):",
  "• GHK-Cu cream",
  "• Biotin Hair Skin Nails 10 mL",
  "• Glutathione Glow",
  "• Three Morpheus8 sessions with listed add-ons",
  "• One Solaria CO₂ treatment",
  "• 40 units of neurotoxin (listed separately from Morpheus8 add-ons)",
  "• Half-syringe filler",
  "",
  "Consult required. Results vary. Not a guaranteed prescription.",
  "Valid 18 months from purchase. See hellogorgeousmedspa.com/package-policy",
  "Hello Gorgeous Med Spa · 74 W Washington St, Oswego IL · (630) 636-6193",
].join("\n");

const PACKAGES = [
  {
    key: "face",
    eligible: true,
    name: "VIP Golden Ticket — Mommy Makeover Face, Neck & Under-Eye",
    aliases: [
      "Golden Ticket Face",
      "Mommy Makeover Face Neck Under-Eye",
      "VIP Golden Ticket Face",
    ],
    priceCents: 279900,
    description: FACE_TERMS,
  },
  {
    key: "body",
    eligible: false,
    name: "VIP Golden Ticket — Mommy Makeover Body",
    aliases: ["Golden Ticket Body", "Mommy Makeover Body"],
    priceCents: 399900,
    description: "NOT FOR ONLINE CHECKOUT — tirzepatide / peptide collection. Consult first.",
  },
  {
    key: "wellness",
    eligible: false,
    name: "VIP Golden Ticket — Mommy Makeover Wellness",
    aliases: ["Golden Ticket Wellness", "Mommy Makeover Wellness"],
    priceCents: 119900,
    description: "NOT FOR ONLINE CHECKOUT — tirzepatide / peptide collection. Consult first.",
  },
];

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function square(method, path, body) {
  const res = await fetch(`${HOST}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`${method} ${path}: ${JSON.stringify(json.errors || json)}`);
  }
  return json;
}

async function listItems() {
  const objects = [];
  let cursor;
  do {
    const q = new URLSearchParams({ types: "ITEM", limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await square("GET", `/v2/catalog/list?${q}`);
    objects.push(...(page.objects || []).filter((o) => !o.is_deleted));
    cursor = page.cursor;
  } while (cursor);
  return objects;
}

function findExisting(items, pkg) {
  const keys = [pkg.name, ...(pkg.aliases || [])].map((n) => n.trim().toLowerCase());
  return items.find((o) => keys.includes((o.item_data?.name || "").trim().toLowerCase())) || null;
}

async function findCategoryId(nameWanted) {
  const objects = [];
  let cursor;
  do {
    const q = new URLSearchParams({ types: "CATEGORY", limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await square("GET", `/v2/catalog/list?${q}`);
    objects.push(...(page.objects || []));
    cursor = page.cursor;
  } while (cursor);
  const hit = objects.find((o) => o.category_data?.name?.toLowerCase() === nameWanted.toLowerCase());
  return hit?.id || null;
}

async function upsertItem(existing, pkg, categoryId) {
  const variationId = existing?.item_data?.variations?.[0]?.id || `#${pkg.key}-var`;
  const itemId = existing?.id || `#${pkg.key}-item`;
  const version = existing?.version;
  const varVersion = existing?.item_data?.variations?.[0]?.version;

  const object = {
    type: "ITEM",
    id: itemId,
    present_at_all_locations: true,
    ...(version ? { version } : {}),
    item_data: {
      name: pkg.name,
      description: pkg.description,
      product_type: "APPOINTMENTS_SERVICE",
      is_taxable: true,
      ...(categoryId ? { category_id: categoryId, categories: [{ id: categoryId }] } : {}),
      variations: [
        {
          type: "ITEM_VARIATION",
          id: variationId,
          present_at_all_locations: true,
          ...(varVersion ? { version: varVersion } : {}),
          item_variation_data: {
            item_id: itemId,
            name: "Regular",
            pricing_type: "FIXED_PRICING",
            price_money: { amount: pkg.priceCents, currency: "USD" },
            service_duration: 30 * 60000,
            available_for_booking: false,
            sellable: true,
          },
        },
      ],
    },
  };

  if (!APPLY) {
    console.log(`  DRY-RUN upsert ${pkg.name} @ $${pkg.priceCents / 100}`);
    return existing;
  }

  const result = await square("POST", "/v2/catalog/object", {
    idempotency_key: `golden-ticket-${pkg.key}-${Date.now()}`,
    object,
  });
  return result.catalog_object;
}

async function createPaymentLink(variationId, pkg) {
  if (!APPLY) {
    console.log(`  DRY-RUN payment link for ${pkg.name}`);
    return null;
  }
  const result = await square("POST", "/v2/online-checkout/payment-links", {
    idempotency_key: `golden-ticket-pay-${pkg.key}-${Date.now()}`,
    description: pkg.description.slice(0, 1000),
    checkout_options: {
      redirect_url: `${REDIRECT}&pkg=${pkg.key}`,
      ask_for_shipping_address: false,
      accepted_payment_methods: {
        apple_pay: true,
        google_pay: true,
        cash_app_pay: true,
      },
    },
    order: {
      location_id: LOCATION_ID,
      line_items: [
        {
          catalog_object_id: variationId,
          quantity: "1",
        },
      ],
    },
  });
  return result.payment_link?.url || result.payment_link?.long_url || null;
}

async function main() {
  console.log(`\nGolden Ticket Square (${APPLY ? "APPLY" : "DRY-RUN"} · ${envName})\n`);
  const items = await listItems();
  const categoryId = await findCategoryId("Body Contouring & Devices");
  console.log(`Category: ${categoryId || "(none)"}`);

  for (const pkg of PACKAGES) {
    const allowed = pkg.eligible || INCLUDE_RX;
    console.log(`\n• ${pkg.name}`);
    console.log(`  eligible checkout: ${pkg.eligible}  include-rx: ${INCLUDE_RX}`);

    const existing = findExisting(items, pkg);
    if (existing) {
      const amount = existing.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount;
      console.log(`  existing ${existing.id} @ $${(amount ?? 0) / 100}`);
    } else {
      console.log("  no existing catalog item");
    }

    if (!allowed) {
      console.log("  SKIP create/pay — medication collection (consult path only)");
      continue;
    }

    const saved = await upsertItem(existing, pkg, categoryId);
    const variationId = saved?.item_data?.variations?.[0]?.id;
    console.log(`  item ${saved?.id || "(dry-run)"}  variation ${variationId || "(dry-run)"}`);

    if (variationId) {
      const url = await createPaymentLink(variationId, pkg);
      console.log(`  payment link: ${url || "(dry-run / none)"}`);
    }
  }

  console.log("\nDone. Paste Face payment link into GOLDEN_TICKET_FACE_SQUARE.paymentLinkUrl.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
