/**
 * Hello Gorgeous consumer pricing from BoomRx wholesale.
 * Product: wholesale × 2.5. 90-day product gets an extra 10% off.
 * Shipping is charged separately at checkout ($35 cold-chain).
 */

import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

/** BoomRx wholesale × 2.5 — client product price (before shipping). */
export const BOOMRX_CONSUMER_MULTIPLIER = 2.5;

/** Extra discount on 90-day product subtotal. */
export const BOOMRX_90DAY_DISCOUNT_PERCENT = 10;

export const BOOMRX_CONSUMER_SHIPPING_USD = PEPTIDE_PHARMACY_SHIPPING_USD;

export const BOOMRX_CONSUMER_PRICING_NOTE =
  "Checkout = (BoomRx wholesale × 2.5) + $35 shipping. 90-day product receives an additional 10% off before shipping.";

/** Product portion only — no shipping. */
export function boomrxConsumerProductUsd(
  wholesaleUsd: number,
  supplyCycle: RxSupplyCycleId,
): number {
  let product = wholesaleUsd * BOOMRX_CONSUMER_MULTIPLIER;
  if (supplyCycle === "90-day") {
    product *= 1 - BOOMRX_90DAY_DISCOUNT_PERCENT / 100;
  }
  return Math.round(product);
}

export function boomrxConsumerShippingUsd(): number {
  return BOOMRX_CONSUMER_SHIPPING_USD;
}

/** Full checkout total for one order line (product + shipping). */
export function boomrxConsumerCheckoutUsd(
  wholesaleUsd: number,
  supplyCycle: RxSupplyCycleId,
): number {
  return boomrxConsumerProductUsd(wholesaleUsd, supplyCycle) + boomrxConsumerShippingUsd();
}

/** Monthly product price shown on menus — 30-day pack × 2.5. */
export function boomrxConsumerMonthlyUsd(wholesale30DayUsd: number): number {
  return boomrxConsumerProductUsd(wholesale30DayUsd, "30-day");
}

export function boomrxConsumerPriceLabel(totalUsd: number, supplyCycle: RxSupplyCycleId): string {
  if (supplyCycle === "90-day") {
    return `$${totalUsd} / 3 mo`;
  }
  return `$${totalUsd}/mo`;
}

export function boomrx90DaySavingsNote(
  wholesale30DayUsd: number,
  wholesale90DayUsd: number,
): string {
  const ship = boomrxConsumerShippingUsd();
  const threeMonthlyCheckout =
    (boomrxConsumerProductUsd(wholesale30DayUsd, "30-day") + ship) * 3;
  const ninetyCheckout = boomrxConsumerProductUsd(wholesale90DayUsd, "90-day") + ship;
  const save = threeMonthlyCheckout - ninetyCheckout;
  if (save <= 0) {
    return `${BOOMRX_90DAY_DISCOUNT_PERCENT}% off 90-day product + one shipping fee`;
  }
  return `${BOOMRX_90DAY_DISCOUNT_PERCENT}% off 90-day · save $${save} vs three monthly orders`;
}

export function boomrxConsumerMarginPct(wholesaleUsd: number, checkoutUsd: number): number {
  if (checkoutUsd <= 0) return 0;
  return Math.round(((checkoutUsd - wholesaleUsd) / checkoutUsd) * 1000) / 10;
}
