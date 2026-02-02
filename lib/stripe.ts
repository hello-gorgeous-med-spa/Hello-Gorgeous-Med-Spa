// ============================================================
// STRIPE CONFIGURATION
// Server-side Stripe instance with lazy initialization
// ============================================================

import Stripe from 'stripe';

// Lazy-initialized Stripe instance to avoid build-time errors
let _stripe: Stripe | null = null;

// Get Stripe instance (lazy initialization)
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    });
  }
  return _stripe;
}

// Legacy export for backward compatibility (use getStripe() instead)
export const stripe = {
  get paymentIntents() { return getStripe().paymentIntents; },
  get refunds() { return getStripe().refunds; },
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
} as unknown as Stripe;

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

// Format amount for Stripe (converts dollars to cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

// Format amount from Stripe (converts cents to dollars)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

// Currency configuration
export const CURRENCY = 'usd';
export const MIN_AMOUNT = 1.00; // Minimum charge amount in dollars
export const MAX_AMOUNT = 10000.00; // Maximum charge amount in dollars

// Payment method types we accept
export const PAYMENT_METHOD_TYPES: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
  'card',
];
