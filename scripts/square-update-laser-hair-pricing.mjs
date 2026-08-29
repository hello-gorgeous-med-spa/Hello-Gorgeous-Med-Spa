#!/usr/bin/env node
/**
 * Laser hair removal — Square prices + staff.
 *
 *   Small  $69  chin / upper lip
 *   Medium $89  underarms, upper legs, lower legs, bikini
 *   Large  $129 Brazilian, back, full legs
 *   Staff: Danielle + Ryan + Michelle
 *
 *   node --env-file=.env.local scripts/square-update-laser-hair-pricing.mjs --dry-run
 *   node --env-file=.env.local scripts/square-update-laser-hair-pricing.mjs --apply
 */

import crypto from "node:crypto";

const DRY_RUN = process.argv.includes("--dry-run") || !process.argv.includes("--apply");
const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LASER_CAT = "GPGREUHVUXJF5FWYF5DHHNB3";
const LABEL_COLOR = "0EA5E9";

const TEAM = {
  ryan: "TM1IptWCrgxkY4p7",
  danielle: "TMqnS9cNU-3s3lUR",
  michelle: "TMqy8tRlmyMRkQ25",
};
const STAFF = [TEAM.danielle, TEAM.ryan, TEAM.michelle];

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const USD = (dollars) => ({ amount: Math.round(dollars * 100), currency: "USD" });
const MIN = (n) => n * 60 * 1000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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

async function listAppointmentItems() {
  const objects = [];
  let cursor;
  do {
    const q = new URLSearchParams({ types: "ITEM", limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await square("GET", `/v2/catalog/list?${q}`);
    for (const obj of page.objects || []) {
      if (obj.type !== "ITEM" || obj.is_deleted) continue;
      if (obj.item_data?.product_type && obj.item_data.product_type !== "APPOINTMENTS_SERVICE") continue;
      objects.push(obj);
    }
    cursor = page.cursor;
  } while (cursor);
  return objects;
}

function isLaserHair(name) {
  const n = norm(name);
  if (/ipl|photofacial|solaria|morpheus|quantum|carbon laser/.test(n)) return false;
  if (/3.?month package/.test(n)) return false;
  return /laser hair|brazilian laser|duocratus/.test(n);
}

function planFor(name) {
  const n = norm(name);
  if (/consult/.test(n)) {
    return { action: "staff-only", name: "Laser Hair Removal Consultation — Free" };
  }
  if (/special/.test(n) && /brazilian|underarm|bikini|chin|neck|face/.test(n) && !/upper legs|lower legs/.test(n)) {
    return { action: "archive", reason: "expired $59 special — regular item covers this area" };
  }
  if (/july special|any area/.test(n)) {
    return { action: "archive", reason: "expired any-area $59 promo" };
  }
  if (/upper lip|chin/.test(n) && !/legs|back|brazilian|bikini|underarm/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Upper Lip or Chin", price: 69, durationMin: 15 };
  }
  if (/underarm/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Underarms", price: 89, durationMin: 15 };
  }
  if (/\bbikini\b/.test(n) && !/brazilian/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Bikini", price: 89, durationMin: 25 };
  }
  if (/upper legs/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Upper Legs", price: 89, durationMin: 35 };
  }
  if (/lower legs/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Lower Legs", price: 89, durationMin: 35 };
  }
  if (/brazilian/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Brazilian", price: 129, durationMin: 30 };
  }
  if (/\bback\b/.test(n) && !/lower back/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Back", price: 129, durationMin: 40 };
  }
  if (/full legs|legs or arms/.test(n)) {
    return { action: "upsert", name: "Laser Hair Removal — Full Legs", price: 129, durationMin: 45 };
  }
  return { action: "skip", reason: "no matching area rule" };
}

function idsEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((id, i) => id === sb[i]);
}

async function upsertItem(existing, spec) {
  const retrieved = existing ? await square("GET", `/v2/catalog/object/${existing.id}`) : { object: null };
  const fresh = retrieved.object;
  const existingVar = fresh?.item_data?.variations?.[0];
  const itemId = fresh?.id || `#hg-lhr-${spec.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const varId = existingVar?.id || `${itemId}-var`;

  const object = {
    type: "ITEM",
    id: itemId,
    present_at_all_locations: true,
    ...(fresh?.version != null ? { version: fresh.version } : {}),
    item_data: {
      ...(fresh?.item_data || {}),
      name: spec.name,
      product_type: "APPOINTMENTS_SERVICE",
      label_color: LABEL_COLOR,
      categories: [{ id: LASER_CAT }],
      ecom_available: true,
      ecom_visibility: "VISIBLE",
      is_archived: false,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: varId,
          present_at_all_locations: true,
          ...(existingVar?.version != null ? { version: existingVar.version } : {}),
          item_variation_data: {
            ...(existingVar?.item_variation_data || {}),
            item_id: itemId,
            name: existingVar?.item_variation_data?.name || "Regular",
            pricing_type: spec.price == null ? "VARIABLE_PRICING" : "FIXED_PRICING",
            ...(spec.price != null ? { price_money: USD(spec.price) } : {}),
            service_duration: MIN(spec.durationMin || 15),
            available_for_booking: true,
            sellable: true,
            team_member_ids: STAFF,
          },
        },
      ],
    },
  };

  if (DRY_RUN) {
    const from = existingVar?.item_variation_data?.price_money?.amount;
    console.log(
      `  WOULD ${fresh ? "UPDATE" : "CREATE"} ${spec.name} · $${spec.price ?? "var"} · Danielle/Ryan/Michelle` +
        (from != null ? ` (was $${from / 100})` : ""),
    );
    return;
  }

  await square("POST", "/v2/catalog/object", {
    idempotency_key: `hg-lhr-${itemId}-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`.slice(0, 128),
    object,
  });
  console.log(`  ✓ ${spec.name} · $${spec.price ?? "var"}`);
  await sleep(120);
}

async function archiveItem(item, reason) {
  if (DRY_RUN) {
    console.log(`  WOULD ARCHIVE ${item.item_data?.name} — ${reason}`);
    return;
  }
  const retrieved = await square("GET", `/v2/catalog/object/${item.id}`);
  const object = retrieved.object;
  object.item_data = {
    ...object.item_data,
    is_archived: true,
    ecom_available: false,
    ecom_visibility: "UNINDEXED",
  };
  for (const v of object.item_data.variations || []) {
    v.item_variation_data = {
      ...v.item_variation_data,
      available_for_booking: false,
    };
  }
  await square("POST", "/v2/catalog/object", {
    idempotency_key: `hg-lhr-archive-${item.id}-${Date.now()}`.slice(0, 128),
    object,
  });
  console.log(`  ✓ archived ${object.item_data?.name}`);
  await sleep(120);
}

async function staffOnly(item, name) {
  const retrieved = await square("GET", `/v2/catalog/object/${item.id}`);
  const object = retrieved.object;
  let changed = object.item_data?.name !== name;
  object.item_data.name = name;
  for (const v of object.item_data.variations || []) {
    const current = v.item_variation_data?.team_member_ids || [];
    if (!idsEqual(current, STAFF) || v.item_variation_data?.available_for_booking === false) {
      changed = true;
    }
    v.item_variation_data = {
      ...v.item_variation_data,
      team_member_ids: STAFF,
      available_for_booking: true,
    };
  }
  if (!changed) {
    console.log(`  OK consult already staffed: ${name}`);
    return;
  }
  if (DRY_RUN) {
    console.log(`  WOULD STAFF consult → Danielle/Ryan/Michelle`);
    return;
  }
  await square("POST", "/v2/catalog/object", {
    idempotency_key: `hg-lhr-consult-${item.id}-${Date.now()}`.slice(0, 128),
    object,
  });
  console.log(`  ✓ consult staffed`);
  await sleep(120);
}

async function main() {
  console.log(`\nLaser hair Square update · ${DRY_RUN ? "DRY RUN" : "APPLY"}\n`);
  const items = (await listAppointmentItems()).filter((o) => isLaserHair(o.item_data?.name || ""));

  const needed = {
    "Laser Hair Removal — Upper Lip or Chin": { price: 69, durationMin: 15 },
    "Laser Hair Removal — Underarms": { price: 89, durationMin: 15 },
    "Laser Hair Removal — Bikini": { price: 89, durationMin: 25 },
    "Laser Hair Removal — Upper Legs": { price: 89, durationMin: 35 },
    "Laser Hair Removal — Lower Legs": { price: 89, durationMin: 35 },
    "Laser Hair Removal — Brazilian": { price: 129, durationMin: 30 },
    "Laser Hair Removal — Back": { price: 129, durationMin: 40 },
    "Laser Hair Removal — Full Legs": { price: 129, durationMin: 45 },
  };

  const seenTargets = new Set();

  for (const item of items) {
    const name = item.item_data?.name || "";
    const plan = planFor(name);
    console.log(`• ${name} → ${plan.action}${plan.name ? ` as ${plan.name}` : ""}${plan.reason ? ` (${plan.reason})` : ""}`);
    if (plan.action === "archive") {
      await archiveItem(item, plan.reason);
    } else if (plan.action === "staff-only") {
      await staffOnly(item, plan.name);
    } else if (plan.action === "upsert") {
      seenTargets.add(plan.name);
      await upsertItem(item, plan);
    }
  }

  for (const [name, spec] of Object.entries(needed)) {
    if (seenTargets.has(name)) continue;
    const existing = items.find((o) => (o.item_data?.name || "") === name);
    if (existing) continue;
    console.log(`• missing ${name} → create`);
    await upsertItem(null, { name, ...spec });
  }

  console.log(DRY_RUN ? "\nRe-run with --apply to write to Square.\n" : "\nDone.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
