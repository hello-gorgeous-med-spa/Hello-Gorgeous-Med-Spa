// ============================================================
// STRIPE - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision - Effective Immediately)
// Primary Processor: SQUARE
// 
// This file remains for reference only. All functions throw errors.
// Do NOT enable or use Stripe in production flows.
// 
// See: /lib/square/client.ts for active payment processing
// ============================================================

const STRIPE_DEPRECATED_ERROR = 'STRIPE_DEPRECATED: Hello Gorgeous uses Square as the sole payment processor. Do not use Stripe.';

// Feature flag - MUST remain false
export const STRIPE_ENABLED = false;

// This will throw if anyone tries to use Stripe
export const stripe = null;

export function isStripeConfigured(): boolean {
  console.warn(STRIPE_DEPRECATED_ERROR);
  return false; // Always return false
}

export function formatAmountForStripe(_amount: number): number {
  throw new Error(STRIPE_DEPRECATED_ERROR);
}

export function formatAmountFromStripe(_amount: number): number {
  throw new Error(STRIPE_DEPRECATED_ERROR);
}

export const CURRENCY = 'usd';
export const MIN_AMOUNT = 1.00;
export const MAX_AMOUNT = 10000.00;
export const PAYMENT_METHOD_TYPES = ['card'];

// Log deprecation warning on module load
if (typeof window === 'undefined') {
  console.warn('⚠️  lib/stripe.ts loaded - STRIPE IS DEPRECATED. Use Square instead.');
}
