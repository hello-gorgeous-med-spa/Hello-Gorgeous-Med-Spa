// ============================================================
// RE GEN STRIPE - Telehealth/RX Payment Processing
// ============================================================
//
// Stripe for Re Gen only. Hello Gorgeous Med Spa uses Square.
// This module handles:
//   - Invoicing (what Square blocked)
//   - Subscriptions (GLP-1, HRT, peptide programs)
//   - One-time payments (labs, consults)
//   - Customer portal management
//
// Env vars required:
//   STRIPE_SECRET_KEY (or REGEN_STRIPE_SECRET_KEY for separation)
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
//   STRIPE_WEBHOOK_SECRET
// ============================================================

import Stripe from 'stripe';

// Use separate Re Gen keys if available, fall back to main Stripe keys
const STRIPE_SECRET = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET) {
  console.warn('⚠️  Re Gen Stripe: No API key configured. Set REGEN_STRIPE_SECRET_KEY or STRIPE_SECRET_KEY.');
}

// Initialize Stripe client (lazy - only when needed)
let _stripe: Stripe | null = null;

export function getRegenStripe(): Stripe {
  if (!STRIPE_SECRET) {
    throw new Error('Re Gen Stripe not configured. Set REGEN_STRIPE_SECRET_KEY in environment.');
  }
  if (!_stripe) {
    _stripe = new Stripe(STRIPE_SECRET, {
      apiVersion: '2024-06-20',
      appInfo: {
        name: 'Re Gen RX',
        version: '1.0.0',
      },
    });
  }
  return _stripe;
}

export function isRegenStripeConfigured(): boolean {
  return Boolean(STRIPE_SECRET);
}

// ============================================================
// CUSTOMER MANAGEMENT
// ============================================================

export interface RegenCustomerParams {
  email: string;
  name: string;
  phone?: string;
  metadata?: {
    patientId?: string;
    intakeDate?: string;
    program?: string;
  };
}

export async function getOrCreateRegenCustomer(
  params: RegenCustomerParams
): Promise<Stripe.Customer> {
  const stripe = getRegenStripe();

  // Check for existing customer by email
  const existing = await stripe.customers.list({
    email: params.email,
    limit: 1,
  });

  if (existing.data.length > 0) {
    // Update existing customer with new info
    return stripe.customers.update(existing.data[0].id, {
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    });
  }

  // Create new customer
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    phone: params.phone,
    metadata: {
      source: 'regen',
      ...params.metadata,
    },
  });
}

// ============================================================
// INVOICING (What Square blocked!)
// ============================================================

export interface RegenInvoiceItem {
  description: string;
  amount: number; // in dollars
  quantity?: number;
}

export interface CreateRegenInvoiceParams {
  customerId: string;
  items: RegenInvoiceItem[];
  dueDate?: Date; // defaults to 7 days
  memo?: string;
  metadata?: Record<string, string>;
  autoSend?: boolean; // email invoice immediately
}

export async function createRegenInvoice(
  params: CreateRegenInvoiceParams
): Promise<Stripe.Invoice> {
  const stripe = getRegenStripe();

  // Add invoice items
  for (const item of params.items) {
    const quantity = item.quantity || 1;
    await stripe.invoiceItems.create({
      customer: params.customerId,
      // Use unit_amount with quantity, or just amount for single items
      unit_amount: Math.round(item.amount * 100), // cents per unit
      currency: 'usd',
      description: item.description,
      quantity,
    });
  }

  // Create the invoice
  const dueDate = params.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invoice = await stripe.invoices.create({
    customer: params.customerId,
    collection_method: 'send_invoice',
    days_until_due: Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
    description: params.memo,
    metadata: {
      source: 'regen',
      ...params.metadata,
    },
  });

  // Finalize and optionally send
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id);

  if (params.autoSend !== false) {
    await stripe.invoices.sendInvoice(finalized.id);
  }

  return finalized;
}

// ============================================================
// SUBSCRIPTIONS (GLP-1, HRT, Peptide Programs)
// ============================================================

// Re Gen program price IDs - create these in Stripe Dashboard
// or use stripe.prices.create() to generate programmatically
export const REGEN_PRICE_IDS = {
  // GLP-1 Programs
  semaglutide_maintenance: process.env.STRIPE_PRICE_SEMAGLUTIDE_MAINT || '',
  semaglutide_titration: process.env.STRIPE_PRICE_SEMAGLUTIDE_TITRATE || '',
  tirzepatide_maintenance: process.env.STRIPE_PRICE_TIRZEPATIDE_MAINT || '',
  tirzepatide_titration: process.env.STRIPE_PRICE_TIRZEPATIDE_TITRATE || '',

  // HRT Programs
  hrt_women_monthly: process.env.STRIPE_PRICE_HRT_WOMEN || '',
  trt_men_monthly: process.env.STRIPE_PRICE_TRT_MEN || '',

  // Peptide Programs
  peptide_bpc157: process.env.STRIPE_PRICE_BPC157 || '',
  peptide_sermorelin: process.env.STRIPE_PRICE_SERMORELIN || '',
  peptide_nad: process.env.STRIPE_PRICE_NAD || '',

  // Consults
  telehealth_consult: process.env.STRIPE_PRICE_CONSULT || '',
} as const;

export interface CreateRegenSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialDays?: number;
  couponId?: string;
}

export async function createRegenSubscription(
  params: CreateRegenSubscriptionParams
): Promise<Stripe.Subscription> {
  const stripe = getRegenStripe();

  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: params.customerId,
    items: [{ price: params.priceId }],
    metadata: {
      source: 'regen',
      ...params.metadata,
    },
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  };

  if (params.trialDays) {
    subscriptionParams.trial_period_days = params.trialDays;
  }

  if (params.couponId) {
    subscriptionParams.coupon = params.couponId;
  }

  return stripe.subscriptions.create(subscriptionParams);
}

export async function cancelRegenSubscription(
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription> {
  const stripe = getRegenStripe();

  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  // Cancel at period end (more patient-friendly)
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function getCustomerSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  const stripe = getRegenStripe();

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  return subscriptions.data;
}

// ============================================================
// ONE-TIME PAYMENTS (Labs, Single Consults)
// ============================================================

export interface CreateRegenPaymentParams {
  customerId: string;
  amount: number; // in dollars
  description: string;
  metadata?: Record<string, string>;
  receiptEmail?: string;
}

export async function createRegenPaymentIntent(
  params: CreateRegenPaymentParams
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const stripe = getRegenStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    customer: params.customerId,
    amount: Math.round(params.amount * 100), // cents
    currency: 'usd',
    description: params.description,
    receipt_email: params.receiptEmail,
    metadata: {
      source: 'regen',
      ...params.metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}

// ============================================================
// CUSTOMER PORTAL (Self-service billing management)
// ============================================================

export async function createRegenPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getRegenStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

// ============================================================
// CHECKOUT SESSION (Hosted payment page)
// ============================================================

export interface RegenCheckoutParams {
  customerId?: string;
  customerEmail?: string;
  lineItems: Array<{
    name: string;
    amount: number; // dollars
    quantity?: number;
  }>;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createRegenCheckoutSession(
  params: RegenCheckoutParams
): Promise<string> {
  const stripe = getRegenStripe();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: params.mode,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true, // Enable promo codes like GORGEOUS20
    line_items: params.lineItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.amount * 100),
        ...(params.mode === 'subscription' ? { recurring: { interval: 'month' } } : {}),
      },
      quantity: item.quantity || 1,
    })),
    metadata: {
      source: 'regen',
      ...params.metadata,
    },
  };

  if (params.customerId) {
    sessionParams.customer = params.customerId;
  } else if (params.customerEmail) {
    sessionParams.customer_email = params.customerEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session.url!;
}

// ============================================================
// PAYMENT LINKS (Shareable URLs)
// ============================================================

export interface CreatePaymentLinkParams {
  name: string;
  amount: number; // dollars
  description?: string;
  quantity?: number;
  allowQuantityAdjust?: boolean;
  collectPhone?: boolean;
  collectAddress?: boolean;
  metadata?: Record<string, string>;
}

export async function createRegenPaymentLink(
  params: CreatePaymentLinkParams
): Promise<{ url: string; id: string }> {
  const stripe = getRegenStripe();

  // Create a product and price on the fly
  const product = await stripe.products.create({
    name: params.name,
    description: params.description,
    metadata: {
      source: 'regen',
      ...params.metadata,
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(params.amount * 100),
    currency: 'usd',
  });

  // Create the payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: params.quantity || 1,
        adjustable_quantity: params.allowQuantityAdjust
          ? { enabled: true, minimum: 1, maximum: 10 }
          : undefined,
      },
    ],
    phone_number_collection: {
      enabled: params.collectPhone ?? true,
    },
    metadata: {
      source: 'regen',
      productName: params.name,
      ...params.metadata,
    },
  });

  return {
    url: paymentLink.url,
    id: paymentLink.id,
  };
}

// Create a payment link for a predefined Re Gen product
export async function createQuickPaymentLink(
  productKey: keyof typeof REGEN_QUICK_PRODUCTS,
  metadata?: Record<string, string>
): Promise<{ url: string; id: string }> {
  const product = REGEN_QUICK_PRODUCTS[productKey];
  return createRegenPaymentLink({
    ...product,
    metadata,
  });
}

// Predefined Re Gen products for quick link generation
export const REGEN_QUICK_PRODUCTS = {
  // Consults
  telehealth_consult: {
    name: 'NP Telehealth Consultation',
    amount: 49,
    description: 'Required consultation with Ryan Kent, FNP-BC',
  },

  // GLP-1 Programs
  semaglutide_maint: {
    name: 'Semaglutide Maintenance - 1 Month',
    amount: 195,
    description: 'GLP-1 weight loss program - maintenance dose',
  },
  semaglutide_titration: {
    name: 'Semaglutide Titration - 1 Month',
    amount: 245,
    description: 'GLP-1 weight loss program - titration phase',
  },
  tirzepatide_maint: {
    name: 'Tirzepatide Maintenance - 1 Month',
    amount: 295,
    description: 'GLP-1 weight loss program - maintenance dose',
  },
  tirzepatide_max: {
    name: 'Tirzepatide 15mg - 1 Month',
    amount: 395,
    description: 'GLP-1 weight loss program - maximum dose',
  },

  // Peptides
  bpc157: {
    name: 'BPC-157 Injectable - 1 Month',
    amount: 169,
    description: 'Recovery peptide protocol',
  },
  sermorelin: {
    name: 'Sermorelin Injectable - 1 Month',
    amount: 149,
    description: 'Growth hormone peptide protocol',
  },
  tb500: {
    name: 'TB-500 Injectable - 1 Month',
    amount: 169,
    description: 'Recovery peptide protocol',
  },
  nad_injection: {
    name: 'NAD+ Injectable Protocol - 1 Month',
    amount: 169,
    description: 'Longevity and energy protocol',
  },
  pt141: {
    name: 'PT-141 Injectable - 1 Month',
    amount: 209,
    description: 'Intimacy peptide protocol',
  },

  // HRT
  hrt_women: {
    name: "Women's HRT Compounded - 1 Month",
    amount: 150,
    description: 'Bioidentical hormone therapy for women',
  },
  trt_men: {
    name: "Men's TRT Injectable - 1 Month",
    amount: 200,
    description: 'Testosterone replacement therapy',
  },

  // Labs
  labs_peak: {
    name: 'Peak Performance Lab Panel',
    amount: 199,
    description: 'Comprehensive wellness labs',
  },
  labs_hrt: {
    name: 'HRT Baseline Lab Panel',
    amount: 299,
    description: 'Hormone therapy baseline labs',
  },
  labs_metabolic: {
    name: 'GLP-1 Metabolic Lab Panel',
    amount: 249,
    description: 'Weight loss program labs',
  },

  // Shipping
  shipping: {
    name: 'Pharmacy Shipping',
    amount: 35,
    description: 'Standard shipping for compounded medications',
  },
} as const;

// List all active payment links
export async function listRegenPaymentLinks(
  limit = 20
): Promise<Array<{ id: string; url: string; active: boolean; metadata: Record<string, string> }>> {
  const stripe = getRegenStripe();

  const links = await stripe.paymentLinks.list({
    limit,
    active: true,
  });

  return links.data.map((link) => ({
    id: link.id,
    url: link.url,
    active: link.active,
    metadata: (link.metadata as Record<string, string>) || {},
  }));
}

// Deactivate a payment link
export async function deactivatePaymentLink(paymentLinkId: string): Promise<void> {
  const stripe = getRegenStripe();
  await stripe.paymentLinks.update(paymentLinkId, { active: false });
}

// ============================================================
// UTILITIES
// ============================================================

export function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}
