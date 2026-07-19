#!/usr/bin/env node
/**
 * Expose RE GEN on Square Appointments booking:
 * - Category: "RE GEN Peptide Therapy" (guest-facing)
 * - $49 consult + popular protocol "Start" visits (medication billed separately after NP review)
 * - Bookable by Ryan, Danielle, Michelle
 *
 * Purchase / manage therapy stays on the website Care Hub + RE GEN checkout
 * (orders monitored in /admin/rx). These bookings are the front door.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-upsert-peptide-therapy-booking.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-peptide-therapy-booking.mjs --apply
 */

import crypto from "node:crypto";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const TEAM = {
  ryan: "TM1IptWCrgxkY4p7",
  danielle: "TMqnS9cNU-3s3lUR",
  michelle: "TMqy8tRlmyMRkQ25",
};
const BOOKABLE_BY = [TEAM.ryan, TEAM.danielle, TEAM.michelle];

const CATEGORY_NAME = "RE GEN Peptide Therapy";
const CATEGORY_ORDINAL = 4; // after Skin Spa, AnteAGE, FlowWave
const LABEL_COLOR = "8B5CF6"; // violet — RE GEN signal

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;

const CARE_HUB_NOTE =
  "Medication is prescribed only after medical review — priced separately (often from the published monthly rate). Start or manage therapy anytime at hellogorgeousmedspa.com/rx/care · shop RE GEN at hellogorgeousmedspa.com/rx. Orders are fulfilled through Hello Gorgeous RX.";

/** Popular protocols — booking = start / consult visit, not OTC vial purchase. */
const PROTOCOL_SERVICES = [
  {
    key: "consult",
    name: "RE GEN Peptide Consult",
    price: 49,
    durationMin: 30,
    description: `NP-directed peptide consultation — goals, history, and protocol design. $${49} consult. ${CARE_HUB_NOTE}`,
    /** Also sync the legacy name */
    aliases: ["Peptide Therapy Consultation"],
  },
  {
    key: "bpc",
    name: "BPC-157 Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 169,
    description: `Start a BPC-157 recovery protocol consult (tissue, gut & repair support). From $169/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "sermorelin",
    name: "Sermorelin Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 149,
    description: `Start a Sermorelin GH-support protocol consult (sleep, energy, lean mass). From $149/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "nad",
    name: "NAD+ Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 169,
    description: `Start an NAD+ cellular energy protocol consult. From $169/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "ghk",
    name: "GHK-Cu Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 169,
    description: `Start a GHK-Cu skin / collagen / hair protocol consult. From $169/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "tb500",
    name: "TB-500 Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 169,
    description: `Start a TB-500 mobility & systemic repair protocol consult. From $169/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "pt141",
    name: "PT-141 Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 209,
    description: `Start a PT-141 intimacy / libido protocol consult (men & women). From $209/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "tesamorelin",
    name: "Tesamorelin Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 229,
    description: `Start a Tesamorelin body-composition / GH-axis protocol consult. From $229/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "cjc-ipa",
    name: "CJC / Ipamorelin Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 249,
    description: `Start a CJC-1295 / Ipamorelin GH-stack protocol consult. From $249/mo after approval. ${CARE_HUB_NOTE}`,
  },
  {
    key: "recovery-blend",
    name: "Recovery Blend Protocol — Start",
    price: 49,
    durationMin: 30,
    fromMo: 229,
    description: `Start a Recovery Blend protocol consult (BPC-157, GHK-Cu, KPV & TB-500). From $229/mo after approval. ${CARE_HUB_NOTE}`,
  },
];

async function square(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${pathname}: ${JSON.stringify(json.errors || json).slice(0, 500)}`);
  return json;
}

async function listCatalog(type) {
  const out = [];
  let cursor;
  do {
    const url = new URL(`${HOST}/v2/catalog/list`);
    url.searchParams.set("types", type);
    if (cursor) url.searchParams.set("cursor", cursor);
    const json = await square(url.pathname + url.search);
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ensureCategory(categories) {
  const existing = categories.find((c) => c.category_data?.name === CATEGORY_NAME);
  if (existing) {
    const needsOrd = existing.category_data?.ordinal !== CATEGORY_ORDINAL;
    const needsOnline = existing.category_data?.online_visibility !== true;
    console.log(`Category exists: ${CATEGORY_NAME} (${existing.id})`);
    if (!needsOrd && !needsOnline) return existing.id;
    if (DRY_RUN) {
      console.log(`  [dry-run] would sync ordinal=${CATEGORY_ORDINAL}, online_visibility`);
      return existing.id;
    }
    const obj = structuredClone(existing);
    obj.category_data = {
      ...obj.category_data,
      name: CATEGORY_NAME,
      ordinal: CATEGORY_ORDINAL,
      online_visibility: true,
      is_top_level: true,
    };
    await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-pep-cat-${crypto.randomBytes(4).toString("hex")}`,
        object: obj,
      },
    });
    console.log(`  ✓ synced category ordinal / visibility`);
    await sleep(200);
    return existing.id;
  }

  console.log(`Create category: ${CATEGORY_NAME}`);
  if (DRY_RUN) return `#cat-peptide-therapy`;

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-pep-cat-new-${crypto.randomBytes(4).toString("hex")}`,
      object: {
        type: "CATEGORY",
        id: "#cat-regen-peptide-therapy",
        category_data: {
          name: CATEGORY_NAME,
          ordinal: CATEGORY_ORDINAL,
          online_visibility: true,
          is_top_level: true,
        },
      },
    },
  });
  const id = res.catalog_object?.id;
  console.log(`  ✓ created ${id}`);
  await sleep(200);
  return id;
}

function findExisting(itemsByName, service) {
  const names = [service.name, ...(service.aliases || [])];
  for (const n of names) {
    const hit = itemsByName.get(n);
    if (hit) return hit;
  }
  return null;
}

async function upsertService(service, categoryId, itemsByName) {
  const existing = findExisting(itemsByName, service);
  const tempId = existing?.id || `#pep-${service.key}`;
  const existingVar = existing?.item_data?.variations?.[0];
  const varId = existingVar?.id || `#pep-var-${service.key}`;

  // Prefer renaming legacy "Peptide Therapy Consultation" → RE GEN Peptide Consult
  const targetName = service.name;

  const object = {
    type: "ITEM",
    id: tempId,
    ...(existing?.version ? { version: existing.version } : {}),
    item_data: {
      name: targetName,
      description: service.description,
      description_html: `<p>${service.description}</p>`,
      product_type: "APPOINTMENTS_SERVICE",
      label_color: LABEL_COLOR,
      categories: [{ id: categoryId }],
      ecom_available: true,
      ecom_visibility: "VISIBLE",
      is_taxable: true,
      is_archived: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          ...(existingVar?.version ? { version: existingVar.version } : {}),
          item_variation_data: {
            name: existingVar?.item_variation_data?.name || "Standard",
            pricing_type: "FIXED_PRICING",
            price_money: USD(service.price),
            service_duration: MIN(service.durationMin),
            available_for_booking: true,
            sellable: true,
            team_member_ids: BOOKABLE_BY,
          },
        },
      ],
    },
  };

  const action = existing ? "update" : "create";
  const fromNote = service.fromMo ? ` · from $${service.fromMo}/mo` : "";
  console.log(`  ${action}: ${targetName} — $${service.price}${fromNote}`);

  if (DRY_RUN) return { ok: true, id: existing?.id };

  try {
    const res = await square("/v2/catalog/object", {
      method: "POST",
      body: {
        idempotency_key: `hg-pep-svc-${service.key}-${crypto.randomBytes(3).toString("hex")}`,
        object,
      },
    });
    console.log(`  ✓ ${targetName}`);
    await sleep(220);
    return { ok: true, id: res.catalog_object?.id };
  } catch (err) {
    console.error(`  ✕ ${targetName}:`, err instanceof Error ? err.message.slice(0, 320) : err);
    return { ok: false };
  }
}

async function main() {
  console.log(`\n🧬 RE GEN Peptide Therapy booking ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  console.log(`Bookable by: Ryan, Danielle, Michelle\n`);

  const [categories, items] = await Promise.all([listCatalog("CATEGORY"), listCatalog("ITEM")]);
  const apptItems = items.filter(
    (o) => o.type === "ITEM" && o.item_data?.product_type === "APPOINTMENTS_SERVICE" && !o.is_deleted,
  );
  const itemsByName = new Map(apptItems.map((i) => [i.item_data?.name, i]));

  const categoryId = await ensureCategory(categories);
  console.log(`\nUpsert ${PROTOCOL_SERVICES.length} bookable services → ${CATEGORY_NAME}\n`);

  let ok = 0;
  let fail = 0;
  for (const svc of PROTOCOL_SERVICES) {
    const res = await upsertService(svc, categoryId, itemsByName);
    if (res.ok) ok++;
    else fail++;
  }

  console.log(`\nDone. ok=${ok} failed=${fail}`);
  console.log("Guests book consult / protocol start → Care Hub + RE GEN for purchase & refill management.");
  console.log("Staff monitor orders in /admin/rx (regen-orders / ops).\n");
  if (DRY_RUN) console.log("Re-run with --apply to write to Square.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
