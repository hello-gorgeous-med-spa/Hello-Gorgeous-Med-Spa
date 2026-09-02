/**
 * Square Payment Terms (Aug 2026 information request):
 * card-not-present is not allowed for prescription products/services.
 * In-person Terminal (swipe / dip / tap) remains allowed. Spa services stay on Square.
 */

export const SQUARE_RX_CNP_BLOCKED = true;

export const SQUARE_RX_CNP_ERROR =
  "Square no longer allows remote card payments for prescription items. Collect this charge in person on the Terminal (swipe, dip, or tap) at 74 W. Washington, Oswego. Same price. (630) 636-6193.";

export const SQUARE_RX_CNP_DESK =
  "Medication and RX consult fees: Terminal only — tap, dip, or swipe. Do not text, email, or phone a Square pay link. Do not use card on file. Botox, facials, and other spa services are unchanged.";

export type SquarePaymentLinkPurpose = "prescription" | "non_prescription";

export function squareRxCnpBlocked(purpose: SquarePaymentLinkPurpose = "prescription"): boolean {
  return SQUARE_RX_CNP_BLOCKED && purpose === "prescription";
}
