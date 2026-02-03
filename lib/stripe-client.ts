// ============================================================
// STRIPE CLIENT - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision)
// Primary Processor: SQUARE
// 
// This file returns null. Do not use Stripe.
// ============================================================

const STRIPE_DEPRECATED_ERROR = 'STRIPE_DEPRECATED: Hello Gorgeous uses Square as the sole payment processor.';

// Feature flag - MUST remain false
export const STRIPE_ENABLED = false;

// Return null instead of Stripe instance
export function getStripe() {
  console.warn(STRIPE_DEPRECATED_ERROR);
  return null;
}

// Log deprecation on load
if (typeof window !== 'undefined') {
  console.warn('⚠️  Stripe client loaded but STRIPE IS DEPRECATED. Use Square instead.');
}
