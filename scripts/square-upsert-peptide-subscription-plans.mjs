#!/usr/bin/env node
/**
 * Create Square Subscription plans for popular RE GEN peptide monthly refills.
 * Writes plan IDs to data/peptide-subscription-plans.json for checkout lookup.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-upsert-peptide-subscription-plans.mjs --dry-run
 *   node --env-file=.env.local scripts/square-upsert-peptide-subscription-plans.mjs --apply
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data/peptide-subscription-plans.json");

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

/** Keep in sync with lib/regen/peptide-subscription-plans.ts + peptide-retail-pricing */
const SHIPPING = 35;
const PLANS = [
  { retailId: "sermorelin", name: "Sermorelin (injectable)", fromMo: 149 },
  { retailId: "bpc-157", name: "BPC-157 (injectable)", fromMo: 169 },
  { retailId: "tb-500", name: "TB-500", fromMo: 169 },
  { retailId: "ghk-cu", name: "GHK-Cu", fromMo: 169 },
  { retailId: "nad-plus", name: "NAD+ (injectable protocol)", fromMo: 169 },
  { retailId: "pt-141", name: "PT-141", fromMo: 209 },
  { retailId: "tesamorelin", name: "Tesamorelin", fromMo: 229 },
  { retailId: "cjc-ipamorelin", name: "CJC-1295 / Ipamorelin (blend)", fromMo: 249 },
  { retailId: "recovery-blend", name: "Recovery Blend", fromMo: 229 },
  { retailId: "heal-blend", name: "HEAL Blend", fromMo: 229 },
  { retailId: "sermorelin-troche", name: "Sermorelin (sublingual troche)", fromMo: 160 },
  { retailId: "bpc-157-caps", name: "BPC-157 (oral capsules)", fromMo: 115 },
].map((p) => {
  const templateId = `peptide-${p.retailId}`;
  const membershipId = `peptide-refill-${templateId}`;
  const priceDollars = p.fromMo + SHIPPING;
  return {
    ...p,
    templateId,
    membershipId,
    planName: `RE GEN — ${p.name} (Monthly)`,
    priceDollars,
    priceCents: priceDollars * 100,
  };
});

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
  if (!res.ok) throw new Error(`${method} ${pathname}: ${JSON.stringify(json.errors || json).slice(0, 600)}`);
  return json;
}

async function listSubscriptionPlans() {
  const out = [];
  let cursor;
  do {
    const url = new URL(`${HOST}/v2/catalog/list`);
    url.searchParams.set("types", "SUBSCRIPTION_PLAN");
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

async function upsertPlan(def, existingByName) {
  const existing = existingByName.get(def.planName);
  const tempPlanId = existing?.id || `#hg-regen-sub-${def.retailId}`;
  const existingVar = existing?.subscription_plan_data?.subscription_plan_variations?.[0];
  const tempVarId = existingVar?.id || `#hg-regen-sub-${def.retailId}-mo`;

  const object = {
    type: "SUBSCRIPTION_PLAN",
    id: tempPlanId,
    ...(existing?.version ? { version: existing.version } : {}),
    subscription_plan_data: {
      name: def.planName,
      subscription_plan_variations: [
        {
          type: "SUBSCRIPTION_PLAN_VARIATION",
          id: tempVarId,
          ...(existingVar?.version ? { version: existingVar.version } : {}),
          subscription_plan_variation_data: {
            name: "Monthly auto-pay",
            phases: [
              {
                cadence: "MONTHLY",
                ordinal: 0,
                pricing: {
                  type: "STATIC",
                  price_money: { amount: def.priceCents, currency: "USD" },
                },
              },
            ],
          },
        },
      ],
    },
  };

  console.log(`  ${existing ? "update" : "create"}: ${def.planName} — $${def.priceDollars}/mo`);

  if (DRY_RUN) {
    return {
      membershipId: def.membershipId,
      templateId: def.templateId,
      planId: existing?.id || tempPlanId,
      variationId: existingVar?.id || tempVarId,
      name: def.planName,
      priceCents: def.priceCents,
    };
  }

  const res = await square("/v2/catalog/object", {
    method: "POST",
    body: {
      idempotency_key: `hg-regen-sub-${def.retailId}-${crypto.randomBytes(3).toString("hex")}`,
      object,
    },
  });
  const obj = res.catalog_object;
  const variationId = obj?.subscription_plan_data?.subscription_plan_variations?.[0]?.id;
  if (!obj?.id || !variationId) throw new Error(`No plan IDs returned for ${def.planName}`);
  console.log(`  ✓ ${obj.id}`);
  await sleep(200);
  return {
    membershipId: def.membershipId,
    templateId: def.templateId,
    planId: obj.id,
    variationId,
    name: def.planName,
    priceCents: def.priceCents,
  };
}

async function main() {
  console.log(`\n🔁 RE GEN peptide subscription plans ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);
  console.log(`Monthly = retail from $/mo + $${SHIPPING} shipping\n`);

  const existing = await listSubscriptionPlans();
  const existingByName = new Map(existing.map((p) => [p.subscription_plan_data?.name, p]));
  console.log(`Existing subscription plans in Square: ${existing.length}\n`);

  const map = {};
  let ok = 0;
  let fail = 0;
  for (const def of PLANS) {
    try {
      const row = await upsertPlan(def, existingByName);
      map[row.membershipId] = row;
      // Also key by templateId for convenience
      map[`template:${row.templateId}`] = row;
      ok++;
    } catch (err) {
      fail++;
      console.error(`  ✕ ${def.planName}:`, err instanceof Error ? err.message.slice(0, 300) : err);
    }
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    note: "Generated by scripts/square-upsert-peptide-subscription-plans.mjs — used by lib/square/membership-checkout.ts",
    shippingUsd: SHIPPING,
    plans: map,
  };

  if (DRY_RUN) {
    console.log(`\nWould write ${ok} plans to data/peptide-subscription-plans.json (failed=${fail})`);
    console.log("Re-run with --apply to create plans + write the ID map.\n");
    return;
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + "\n");
  console.log(`\nWrote ${OUT_FILE}`);
  console.log(`Done. ok=${ok} failed=${fail}`);
  console.log("Patients enroll via peptide refill → Monthly auto-pay (Care Hub / peptide request).\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
