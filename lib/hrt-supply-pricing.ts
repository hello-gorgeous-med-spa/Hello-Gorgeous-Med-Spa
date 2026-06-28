/**
 * HRT client pricing — Formulation wholesale × 2.5 + shipping (same as GLP-1 / peptides).
 * Strength is provider-selected; published prices use typical 30-day Formulation packs.
 */

import {
  BOOMRX_CONSUMER_MULTIPLIER,
  BOOMRX_CONSUMER_PRICING_NOTE,
} from "@/lib/boomrx-consumer-pricing";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";

export const HRT_PRICING_DISCLAIMER =
  "Pricing reflects a typical 30-day compounded supply (wholesale × 2.5) plus shipping. Your provider sets strength and form after labs — final checkout may differ.";

export const HRT_PRICING_NOTE = BOOMRX_CONSUMER_PRICING_NOTE.replace("BoomRx", "Formulation");

export function hrtProductUsd(wholesaleUsd: number): number {
  return Math.round(wholesaleUsd * BOOMRX_CONSUMER_MULTIPLIER);
}

export function hrtShippingUsd(): number {
  return PEPTIDE_PHARMACY_SHIPPING_USD;
}

export function hrtCheckoutUsd(wholesaleUsd: number): number {
  return hrtProductUsd(wholesaleUsd) + hrtShippingUsd();
}

export function hrtMonthlyPriceLabel(wholesaleUsd: number): string {
  return `$${hrtProductUsd(wholesaleUsd)}/mo`;
}

export function hrtCheckoutPriceLabel(wholesaleUsd: number): string {
  return `$${hrtCheckoutUsd(wholesaleUsd)} (${hrtMonthlyPriceLabel(wholesaleUsd)} + $${hrtShippingUsd()} ship)`;
}

export function hrtFromMonthlyUsd(wholesaleOptions: number[]): number {
  if (wholesaleOptions.length === 0) return 0;
  return Math.min(...wholesaleOptions.map(hrtProductUsd));
}
