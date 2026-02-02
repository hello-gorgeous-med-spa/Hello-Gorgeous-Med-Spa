// ============================================================
// STRIPE REFUND API
// Process full or partial refunds via Stripe
// ============================================================

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentIntentId, amount, reason } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    // Create refund parameters
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      reason: reason === 'fraudulent' ? 'fraudulent' :
              reason === 'duplicate' ? 'duplicate' :
              'requested_by_customer',
    };

    // If amount is specified, do partial refund (amount should be in cents)
    if (amount && amount > 0) {
      refundParams.amount = Math.round(amount);
    }

    // Process the refund
    const refund = await stripe.refunds.create(refundParams);

    // Log the refund for audit purposes
    console.log(`[REFUND] Processed refund ${refund.id} for payment ${paymentIntentId}`, {
      amount: refund.amount,
      reason: refund.reason,
      status: refund.status,
    });

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100, // Convert back to dollars
        status: refund.status,
        reason: refund.reason,
      },
    });
  } catch (error: any) {
    console.error('[REFUND ERROR]', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}
