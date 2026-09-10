/**
 * REGEN RX video consult — before a therapy purchase.
 * Single source for price, booking URL, and credit-toward-therapy copy.
 */

import {
  PROGRAM_CONSULT_FEE_USD,
} from "@/lib/flows";
import { LICENSED_CLINICIAN_PHRASE } from "@/lib/medical-authority";

export const REGEN_TELEHEALTH_FEE_USD = PROGRAM_CONSULT_FEE_USD;

/** Public consult door — do not deep-link a departed clinician's Square calendar. */
export const REGEN_TELEHEALTH_BOOKING_URL = "/contact";

/** On-site explainer. */
export const REGEN_TELEHEALTH_PATH = "/consult";

export const REGEN_TELEHEALTH_PROVIDER = "a licensed Illinois clinician";

export const REGEN_TELEHEALTH_SERVICE_NAME = "REGEN RX medical consult";

export const REGEN_TELEHEALTH_DURATION = "15-minute video visit";

export function regenTelehealthPriceLabel(prefix = "$"): string {
  return `${prefix}${REGEN_TELEHEALTH_FEE_USD}`;
}

export const REGEN_TELEHEALTH_CTA = `Book a consult — ${regenTelehealthPriceLabel()}`;

export const REGEN_TELEHEALTH_CREDIT_LINE = `The ${regenTelehealthPriceLabel()} visit is credited toward your first REGEN therapy order if a clinician prescribes and you move forward.`;

export const REGEN_TELEHEALTH_CREDIT_SHORT = `${regenTelehealthPriceLabel()} credited toward therapy if prescribed`;

export const REGEN_TELEHEALTH_BLURB =
  `Talk to ${LICENSED_CLINICIAN_PHRASE} on video before you buy. If they prescribe, we credit the ${regenTelehealthPriceLabel()} visit toward your first therapy order.`;
