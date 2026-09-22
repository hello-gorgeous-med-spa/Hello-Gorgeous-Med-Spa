/**
 * REGEN RX phone consult — before a therapy purchase.
 * Single source for price, booking URL, and credit-toward-therapy copy.
 */

import {
  PROGRAM_CONSULT_FEE_USD,
  SQUARE_RX_TELEHEALTH_BOOKING_URL,
} from "@/lib/flows";

export const REGEN_TELEHEALTH_FEE_USD = PROGRAM_CONSULT_FEE_USD;

/** Public consult door — Ryan Kent $49 phone visit on Square. */
export const REGEN_TELEHEALTH_BOOKING_URL = SQUARE_RX_TELEHEALTH_BOOKING_URL;

/** On-site explainer. */
export const REGEN_TELEHEALTH_PATH = "/consult";

export const REGEN_TELEHEALTH_PROVIDER = "Ryan Kent, FNP-BC";

export const REGEN_TELEHEALTH_SERVICE_NAME = "Telehealth Phone Visit — Ryan Kent, FNP-BC";

export const REGEN_TELEHEALTH_DURATION = "15-minute phone visit";

export function regenTelehealthPriceLabel(prefix = "$"): string {
  return `${prefix}${REGEN_TELEHEALTH_FEE_USD}`;
}

export const REGEN_TELEHEALTH_CTA = `Book a consult — ${regenTelehealthPriceLabel()}`;

export const REGEN_TELEHEALTH_CREDIT_LINE = `The ${regenTelehealthPriceLabel()} visit is credited toward your first REGEN therapy order if a clinician prescribes and you move forward.`;

export const REGEN_TELEHEALTH_CREDIT_SHORT = `${regenTelehealthPriceLabel()} credited toward therapy if prescribed`;

export const REGEN_TELEHEALTH_BLURB =
  `Can't come in? Ryan Kent, FNP-BC calls you at your appointment time. If he prescribes, we credit the ${regenTelehealthPriceLabel()} visit toward your first therapy order.`;
