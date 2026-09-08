/**
 * REGEN RX video consult — Ryan on Square, before a therapy purchase.
 * Single source for price, booking URL, and credit-toward-therapy copy.
 */

import {
  PROGRAM_CONSULT_BOOKING_URL,
  PROGRAM_CONSULT_FEE_USD,
} from "@/lib/flows";

/** Square Medical Visit with Ryan Kent, FNP-BC. */
export const REGEN_TELEHEALTH_FEE_USD = PROGRAM_CONSULT_FEE_USD;

export const REGEN_TELEHEALTH_BOOKING_URL = PROGRAM_CONSULT_BOOKING_URL;

/** On-site explainer. The actual calendar is Square. */
export const REGEN_TELEHEALTH_PATH = "/consult";

export const REGEN_TELEHEALTH_PROVIDER = "Ryan Kent, FNP-BC";

export const REGEN_TELEHEALTH_SERVICE_NAME = "Medical Visit with Ryan Kent, FNP-BC";

export const REGEN_TELEHEALTH_DURATION = "15-minute video visit";

export function regenTelehealthPriceLabel(prefix = "$"): string {
  return `${prefix}${REGEN_TELEHEALTH_FEE_USD}`;
}

export const REGEN_TELEHEALTH_CTA = `Book Ryan — ${regenTelehealthPriceLabel()}`;

export const REGEN_TELEHEALTH_CREDIT_LINE = `The ${regenTelehealthPriceLabel()} visit is credited toward your first REGEN therapy order if Ryan prescribes and you move forward.`;

export const REGEN_TELEHEALTH_CREDIT_SHORT = `${regenTelehealthPriceLabel()} credited toward therapy if prescribed`;

export const REGEN_TELEHEALTH_BLURB =
  `Talk to ${REGEN_TELEHEALTH_PROVIDER} on video before you buy. Pick a time on his calendar. If he prescribes, we credit the ${regenTelehealthPriceLabel()} visit toward your first therapy order.`;
