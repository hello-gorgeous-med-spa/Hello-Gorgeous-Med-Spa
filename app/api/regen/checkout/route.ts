import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateRegenCustomer,
  createRegenCheckoutSession,
  createRegenPaymentIntent,
  isRegenStripeConfigured,
} from '@/lib/regen-stripe';

// POST /api/regen/checkout
// Create a Stripe checkout session or payment intent for Re Gen
export async function POST(request: NextRequest) {
  try {
    if (!isRegenStripeConfigured()) {
      return NextResponse.json(
        { error: 'Re Gen Stripe not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      patient,
      email, // Allow direct email for simpler API
      name,  // Allow direct name for simpler API
      items,
      mode = 'payment', // 'payment' or 'subscription'
      successUrl,
      cancelUrl,
      useHostedCheckout = true, // false for embedded/custom checkout
    } = body;

    // Normalize patient info (accept either patient object or direct email/name)
    const patientInfo = patient || (email ? { email, name } : undefined);

    // Validate
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hellogorgeousmedspa.com';
    const finalSuccessUrl = successUrl || `${baseUrl}/rx/checkout/success`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/rx/checkout/cancel`;

    // Get or create customer if patient info provided
    let customerId: string | undefined;
    if (patientInfo?.email) {
      const customer = await getOrCreateRegenCustomer({
        email: patientInfo.email,
        name: patientInfo.name || patientInfo.email,
        phone: patientInfo.phone,
        metadata: {
          program: patientInfo.program,
        },
      });
      customerId = customer.id;
    }

    if (useHostedCheckout) {
      // Stripe Checkout (hosted page)
      const checkoutUrl = await createRegenCheckoutSession({
        customerId,
        customerEmail: patientInfo?.email,
        lineItems: items.map((item: { name: string; amount: number; quantity?: number }) => ({
          name: item.name,
          amount: item.amount,
          quantity: item.quantity || 1,
        })),
        mode: mode as 'payment' | 'subscription',
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
        metadata: {
          patientEmail: patientInfo?.email || '',
          program: patientInfo?.program || '',
        },
      });

      return NextResponse.json({
        success: true,
        type: 'checkout_session',
        url: checkoutUrl,
      });
    } else {
      // Payment Intent (for embedded/custom checkout)
      if (!customerId) {
        return NextResponse.json(
          { error: 'Patient email required for embedded checkout' },
          { status: 400 }
        );
      }

      const total = items.reduce(
        (sum: number, item: { amount: number; quantity?: number }) =>
          sum + item.amount * (item.quantity || 1),
        0
      );

      const description = items
        .map((item: { name: string }) => item.name)
        .join(', ');

      const { clientSecret, paymentIntentId } = await createRegenPaymentIntent({
        customerId,
        amount: total,
        description,
        receiptEmail: patientInfo?.email,
        metadata: {
          items: JSON.stringify(items.map((i: { name: string }) => i.name)),
          program: patientInfo?.program || '',
        },
      });

      return NextResponse.json({
        success: true,
        type: 'payment_intent',
        clientSecret,
        paymentIntentId,
      });
    }
  } catch (error) {
    console.error('Re Gen checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
