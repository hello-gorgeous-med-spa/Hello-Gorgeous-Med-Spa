/**
 * Square fixed-amount discounts — catalog discount + pricing rule for POS / manual apply.
 *
 * Note: Square does not expose public CreateDiscountCode API for most merchants.
 * Customer-enterable codes must be added in Square Dashboard → Discounts → Discount codes,
 * linked to the returned pricing_rule_id.
 */

import { randomUUID } from "crypto";

import {
  dollarsToCents,
  getSquareApiHost,
  squareApiFetch,
} from "@/lib/square/discount-code-http";

export type CreateSquareFixedDiscountInput = {
  /** Shown in Square POS discount list, e.g. BESTIE100 */
  code: string;
  /** Full display name */
  name: string;
  amountUsd: number;
  idempotencyKey?: string;
};

export type CreateSquareFixedDiscountResult = {
  code: string;
  name: string;
  discountId: string;
  productSetId: string;
  pricingRuleId: string;
  amountUsd: number;
  /** How to apply until a Dashboard discount code is linked */
  posInstructions: string;
  dashboardInstructions: string;
};

type BatchUpsertResponse = {
  objects?: Array<{ type?: string; id?: string }>;
  id_mappings?: Array<{ client_object_id?: string; object_id?: string }>;
};

function mapClientIds(
  idMappings: BatchUpsertResponse["id_mappings"],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of idMappings ?? []) {
    if (m.client_object_id && m.object_id) out[m.client_object_id] = m.object_id;
  }
  return out;
}

/** Create a $-off discount in Square Catalog (POS: Discounts → search by name/code). */
export async function createSquareFixedAmountDiscount(
  input: CreateSquareFixedDiscountInput,
): Promise<CreateSquareFixedDiscountResult> {
  const code = input.code.trim().toUpperCase();
  if (!code) throw new Error("code is required");
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    throw new Error("amountUsd must be greater than 0");
  }

  const displayName = input.name.includes(code) ? input.name : `${code} — ${input.name}`;
  const amountCents = dollarsToCents(input.amountUsd);
  const batchKey = input.idempotencyKey ?? randomUUID();
  const discountClientId = "#hgDiscount";
  const productSetClientId = "#hgProductSet";
  const pricingRuleClientId = "#hgPricingRule";

  const catalogRes = await squareApiFetch<BatchUpsertResponse>("/v2/catalog/batch-upsert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idempotency_key: `catalog-${batchKey}`,
      batches: [
        {
          objects: [
            {
              type: "DISCOUNT",
              id: discountClientId,
              discount_data: {
                name: displayName,
                discount_type: "FIXED_AMOUNT",
                amount_money: { amount: amountCents, currency: "USD" },
              },
            },
            {
              type: "PRODUCT_SET",
              id: productSetClientId,
              product_set_data: {
                name: `${displayName} — all items`,
                all_products: true,
              },
            },
            {
              type: "PRICING_RULE",
              id: pricingRuleClientId,
              pricing_rule_data: {
                name: displayName,
                discount_id: discountClientId,
                match_products_id: productSetClientId,
                application_mode: "ATTACHED",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!catalogRes.ok) {
    throw new Error(`Square catalog upsert failed: ${catalogRes.error}`);
  }

  const ids = mapClientIds(catalogRes.data.id_mappings);
  const discountId = ids[discountClientId];
  const productSetId = ids[productSetClientId];
  const pricingRuleId = ids[pricingRuleClientId];

  if (!discountId || !productSetId || !pricingRuleId) {
    throw new Error("Square catalog upsert did not return expected object IDs");
  }

  return {
    code,
    name: displayName,
    discountId,
    productSetId,
    pricingRuleId,
    amountUsd: input.amountUsd,
    posInstructions: `Square POS → Discounts → search "${code}" or "${displayName}" → apply $${input.amountUsd} off.`,
    dashboardInstructions:
      `Square Dashboard → Items & services → Discounts → Create discount code → Code: ${code} → ` +
      `Link to pricing rule ${pricingRuleId} (if Dashboard prompts). ` +
      `Square's public API does not create redeemable codes on all accounts yet.`,
  };
}

export { getSquareApiHost };
