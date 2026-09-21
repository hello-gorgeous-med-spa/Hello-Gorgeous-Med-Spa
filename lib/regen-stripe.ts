// ============================================================
// REGEN STRIPE — RETIRED
// ============================================================
//
// Owner decision: Charm + Bluefin is the REGEN card processor.
// Square stays spa booking. Do not create Stripe sessions, invoices,
// or payment links.
//
// See: lib/regen/charm-payments.ts
// Staff: /staff/protocols/guides/Charm-Bluefin-Take-a-Payment.html
// ============================================================

import { STRIPE_RETIRED_MESSAGE } from '@/lib/regen/charm-payments';

export const REGEN_STRIPE_ENABLED = false;

export function isRegenStripeConfigured(): boolean {
  return false;
}

export function getRegenStripe(): never {
  throw new Error(STRIPE_RETIRED_MESSAGE);
}
