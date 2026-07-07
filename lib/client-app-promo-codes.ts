/**
 * Client app promo codes — validated server-side, applied to Square checkout totals.
 */

import { BESTIE_SQUARE_DISCOUNT } from "@/lib/square/bestie-discount";

export type ClientAppPromoContext = "vitamin" | "membership" | "regen" | "any";

export type ClientAppPromoDefinition = {
  code: string;
  label: string;
  amountUsd: number;
  /** Minimum subtotal before discount (pre-shipping). */
  minSubtotalUsd: number;
  contexts: ClientAppPromoContext[];
  squareDiscountId?: string;
};

export const CLIENT_APP_PROMOS: ClientAppPromoDefinition[] = [
  {
    code: BESTIE_SQUARE_DISCOUNT.code,
    label: BESTIE_SQUARE_DISCOUNT.posName,
    amountUsd: BESTIE_SQUARE_DISCOUNT.amountUsd,
    minSubtotalUsd: 100,
    contexts: ["any", "vitamin", "membership", "regen"],
    squareDiscountId: BESTIE_SQUARE_DISCOUNT.discountId,
  },
];

export type PromoValidationResult =
  | {
      ok: true;
      code: string;
      label: string;
      discountUsd: number;
      subtotalUsd: number;
      finalUsd: number;
      squareDiscountId?: string;
    }
  | { ok: false; error: string };

export function validateClientAppPromoCode(input: {
  code: string;
  subtotalUsd: number;
  context?: ClientAppPromoContext;
}): PromoValidationResult {
  const normalized = input.code.trim().toUpperCase();
  if (!normalized) {
    return { ok: false, error: "Enter a promo code." };
  }

  const promo = CLIENT_APP_PROMOS.find((p) => p.code === normalized);
  if (!promo) {
    return { ok: false, error: "That code isn’t valid in the app." };
  }

  const ctx = input.context ?? "any";
  if (ctx !== "any" && !promo.contexts.includes(ctx) && !promo.contexts.includes("any")) {
    return { ok: false, error: "This code can’t be used for that purchase." };
  }

  const subtotalUsd = Math.round(input.subtotalUsd * 100) / 100;
  if (subtotalUsd < promo.minSubtotalUsd) {
    return {
      ok: false,
      error: `Minimum order $${promo.minSubtotalUsd.toFixed(0)} before ${promo.code} can be applied.`,
    };
  }

  const discountUsd = Math.min(promo.amountUsd, subtotalUsd);
  const finalUsd = Math.max(0, Math.round((subtotalUsd - discountUsd) * 100) / 100);

  return {
    ok: true,
    code: promo.code,
    label: promo.label,
    discountUsd,
    subtotalUsd,
    finalUsd,
    squareDiscountId: promo.squareDiscountId,
  };
}

export function applyPromoToUsd(subtotalUsd: number, promoCode?: string | null): PromoValidationResult | null {
  if (!promoCode?.trim()) return null;
  const result = validateClientAppPromoCode({ code: promoCode, subtotalUsd, context: "any" });
  return result.ok ? result : null;
}

/** Browser storage key for applied promo in the client PWA. */
export const CLIENT_APP_PROMO_STORAGE_KEY = "hg-app-promo-code";

export const CLIENT_APP_PROMO_EVENT = "hg-app-promo-change";
