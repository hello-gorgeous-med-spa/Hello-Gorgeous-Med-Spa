/**
 * HRT client pricing — Formulation wholesale × 2.5 + shipping (same as GLP-1 / peptides).
 * 90-day product receives an additional 10% off before shipping.
 * Strength is provider-selected; published prices use typical 30-day Formulation packs.
 */

import {
  boomrx90DaySavingsNote,
  boomrxConsumerPriceLabel,
  boomrxConsumerProductUsd,
  BOOMRX_CONSUMER_MULTIPLIER,
  BOOMRX_CONSUMER_PRICING_NOTE,
} from "@/lib/boomrx-consumer-pricing";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";
import { parseRxSupplyCycle, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export const HRT_PRICING_DISCLAIMER =
  "Pricing reflects a typical compounded supply (wholesale × 2.5) plus shipping. Your provider sets strength and form after labs — final checkout may differ. Payment is collected first; medication ships after your NP telehealth visit.";

export const HRT_PRICING_NOTE = BOOMRX_CONSUMER_PRICING_NOTE.replace("BoomRx", "Formulation");

export const HRT_PAYMENT_FIRST_COPY =
  "Pay at checkout, then book your NP telehealth visit on Fresha. Nothing ships until Ryan Kent, FNP-BC approves your protocol.";

export type HrtSupplyQuote = {
  supplyCycle: RxSupplyCycleId;
  wholesaleUsd: number;
  productUsd: number;
  shippingUsd: number;
  totalUsd: number;
  months: number;
  monthlyProductUsd: number;
  priceLabel: string;
  lineLabel: string;
  savingsNote?: string;
  /** Gross margin on product (retail product − wholesale). Shipping excluded. */
  productMarginUsd: number;
};

export function hrtWholesaleForCycle(wholesale30DayUsd: number, supplyCycle: RxSupplyCycleId): number {
  return wholesale30DayUsd * (supplyCycle === "90-day" ? 3 : 1);
}

export function hrtProductUsd(wholesaleUsd: number, supplyCycle: RxSupplyCycleId = "30-day"): number {
  return boomrxConsumerProductUsd(wholesaleUsd, supplyCycle);
}

export function hrtShippingUsd(): number {
  return PEPTIDE_PHARMACY_SHIPPING_USD;
}

export function hrtCheckoutUsd(
  wholesale30DayUsd: number,
  supplyCycle: RxSupplyCycleId = "30-day",
): number {
  const wholesale = hrtWholesaleForCycle(wholesale30DayUsd, supplyCycle);
  return hrtProductUsd(wholesale, supplyCycle) + hrtShippingUsd();
}

export function hrtMonthlyPriceLabel(wholesaleUsd: number): string {
  return `$${hrtProductUsd(wholesaleUsd, "30-day")}/mo`;
}

export function hrtCheckoutPriceLabel(
  wholesale30DayUsd: number,
  supplyCycle: RxSupplyCycleId = "30-day",
): string {
  const quote = computeHrtSupplyQuote(wholesale30DayUsd, supplyCycle);
  return `$${quote.totalUsd} (${quote.priceLabel} + $${quote.shippingUsd} ship)`;
}

export function hrtFromMonthlyUsd(wholesaleOptions: number[]): number {
  if (wholesaleOptions.length === 0) return 0;
  return Math.min(...wholesaleOptions.map((w) => hrtProductUsd(w, "30-day")));
}

export function computeHrtSupplyQuote(
  wholesale30DayUsd: number,
  supplyCycleRaw?: unknown,
): HrtSupplyQuote {
  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  const months = supplyCycle === "90-day" ? 3 : 1;
  const wholesaleUsd = hrtWholesaleForCycle(wholesale30DayUsd, supplyCycle);
  const productUsd = hrtProductUsd(wholesaleUsd, supplyCycle);
  const shippingUsd = hrtShippingUsd();
  const totalUsd = productUsd + shippingUsd;
  const monthlyProductUsd = hrtProductUsd(wholesale30DayUsd, "30-day");
  const wholesale90 = hrtWholesaleForCycle(wholesale30DayUsd, "90-day");

  return {
    supplyCycle,
    wholesaleUsd,
    productUsd,
    shippingUsd,
    totalUsd,
    months,
    monthlyProductUsd,
    priceLabel: boomrxConsumerPriceLabel(productUsd, supplyCycle),
    lineLabel: `${months === 1 ? "30-day" : "90-day"} compounded supply`,
    savingsNote:
      supplyCycle === "90-day"
        ? boomrx90DaySavingsNote(wholesale30DayUsd, wholesale90)
        : undefined,
    productMarginUsd: productUsd - wholesaleUsd,
  };
}

/** @deprecated Use BOOMRX_CONSUMER_MULTIPLIER — kept for copy in formulation catalog. */
export const HRT_FORMULATION_MULTIPLIER = BOOMRX_CONSUMER_MULTIPLIER;
