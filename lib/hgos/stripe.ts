// ============================================================
// STRIPE INTEGRATION
// Payment processing for Hello Gorgeous Med Spa
// ============================================================

import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null;

// ============================================================
// TYPES
// ============================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
  clientSecret?: string;
}

export interface CreatePaymentParams {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
  receiptEmail?: string;
}

export interface RefundParams {
  paymentIntentId: string;
  amount?: number; // partial refund in cents, full if omitted
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}

export interface CustomerParams {
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

// ============================================================
// PAYMENT FUNCTIONS
// ============================================================

/**
 * Create a payment intent for processing
 */
export async function createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent | null> {
  if (!stripe) {
    console.warn('Stripe not configured - returning mock payment');
    return {
      id: `mock_pi_${Date.now()}`,
      amount: params.amount,
      status: 'succeeded',
      clientSecret: 'mock_client_secret',
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency || 'usd',
      customer: params.customerId,
      description: params.description,
      metadata: params.metadata,
      receipt_email: params.receiptEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status as PaymentIntent['status'],
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    return null;
  }
}

/**
 * Confirm a payment intent (for card on file or saved payment method)
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentIntent | null> {
  if (!stripe) {
    return {
      id: paymentIntentId,
      amount: 0,
      status: 'succeeded',
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status as PaymentIntent['status'],
    };
  } catch (error) {
    console.error('Stripe payment confirmation failed:', error);
    return null;
  }
}

/**
 * Process a refund
 */
export async function createRefund(params: RefundParams): Promise<{ id: string; status: string } | null> {
  if (!stripe) {
    return {
      id: `mock_refund_${Date.now()}`,
      status: 'succeeded',
    };
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: params.paymentIntentId,
      amount: params.amount,
      reason: params.reason,
    });

    return {
      id: refund.id,
      status: refund.status || 'unknown',
    };
  } catch (error) {
    console.error('Stripe refund failed:', error);
    return null;
  }
}

// ============================================================
// CUSTOMER FUNCTIONS
// ============================================================

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(params: CustomerParams): Promise<string | null> {
  if (!stripe) {
    return `mock_cus_${Date.now()}`;
  }

  try {
    // Check if customer exists by email
    const existingCustomers = await stripe.customers.list({
      email: params.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0].id;
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    });

    return customer.id;
  } catch (error) {
    console.error('Stripe customer operation failed:', error);
    return null;
  }
}

/**
 * Get saved payment methods for a customer
 */
export async function getPaymentMethods(customerId: string) {
  if (!stripe) {
    return [
      { id: 'mock_pm_1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2025 },
    ];
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || 'unknown',
      last4: pm.card?.last4 || '****',
      expMonth: pm.card?.exp_month || 0,
      expYear: pm.card?.exp_year || 0,
    }));
  } catch (error) {
    console.error('Failed to get payment methods:', error);
    return [];
  }
}

/**
 * Attach a payment method to a customer
 */
export async function attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<boolean> {
  if (!stripe) return true;

  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return true;
  } catch (error) {
    console.error('Failed to attach payment method:', error);
    return false;
  }
}

// ============================================================
// SUBSCRIPTION FUNCTIONS (for memberships)
// ============================================================

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

/**
 * Create a subscription for membership
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  if (!stripe) {
    return {
      id: `mock_sub_${Date.now()}`,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      metadata: params.metadata,
    });

    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  if (!stripe) return true;

  try {
    await stripe.subscriptions.cancel(subscriptionId);
    return true;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return false;
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Convert dollars to cents for Stripe
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars for display
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!stripe;
}
