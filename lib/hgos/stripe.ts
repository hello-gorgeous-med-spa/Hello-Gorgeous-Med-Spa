// ============================================================
// STRIPE - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision - Effective Immediately)
// Primary Processor: SQUARE
// 
// All functions return null or throw errors.
// Do NOT enable or use Stripe in production flows.
// 
// See: /lib/square/client.ts for active payment processing
// ============================================================

const STRIPE_DEPRECATED_ERROR = 'STRIPE_DEPRECATED: Hello Gorgeous uses Square as the sole payment processor. Do not use Stripe.';

// Feature flag - MUST remain false
export const STRIPE_ENABLED = false;

// Stripe instance is null - deprecated
export const stripe = null;

// ============================================================
// TYPES (kept for backwards compatibility)
// ============================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
  clientSecret?: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
  receiptEmail?: string;
}

export interface RefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}

export interface CustomerParams {
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

// ============================================================
// DEPRECATED FUNCTIONS - ALL RETURN NULL OR THROW
// ============================================================

export async function createPaymentIntent(_params: CreatePaymentParams): Promise<PaymentIntent | null> {
  console.error(STRIPE_DEPRECATED_ERROR);
  return null;
}

export async function confirmPaymentIntent(
  _paymentIntentId: string,
  _paymentMethodId: string
): Promise<PaymentIntent | null> {
  console.error(STRIPE_DEPRECATED_ERROR);
  return null;
}

export async function createRefund(_params: RefundParams): Promise<{ id: string; status: string } | null> {
  console.error(STRIPE_DEPRECATED_ERROR);
  return null;
}

export async function getOrCreateCustomer(_params: CustomerParams): Promise<string | null> {
  console.error(STRIPE_DEPRECATED_ERROR);
  return null;
}

export async function getPaymentMethods(_customerId: string) {
  console.error(STRIPE_DEPRECATED_ERROR);
  return [];
}

export async function attachPaymentMethod(_paymentMethodId: string, _customerId: string): Promise<boolean> {
  console.error(STRIPE_DEPRECATED_ERROR);
  return false;
}

export async function createSubscription(_params: CreateSubscriptionParams) {
  console.error(STRIPE_DEPRECATED_ERROR);
  return null;
}

export async function cancelSubscription(_subscriptionId: string): Promise<boolean> {
  console.error(STRIPE_DEPRECATED_ERROR);
  return false;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function isStripeConfigured(): boolean {
  return false; // Always false - Stripe is deprecated
}

// Log deprecation warning on module load
if (typeof window === 'undefined') {
  console.warn('⚠️  lib/hgos/stripe.ts loaded - STRIPE IS DEPRECATED. Use Square instead.');
}
