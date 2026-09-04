import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy init to avoid build-time errors
function getStripe() {
  const key = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe API key not configured');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

/**
 * POST /api/regen/subscription/manage
 * Manage existing subscriptions (pause, resume, cancel, update)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, subscriptionId, customerId } = body;

    if (!subscriptionId && !customerId) {
      return NextResponse.json(
        { error: 'Subscription ID or Customer ID required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'cancel': {
        // Cancel at end of billing period
        const subscription = await getStripe().subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        return NextResponse.json({
          success: true,
          message: 'Subscription will cancel at end of billing period',
          cancelAt: subscription.cancel_at,
        });
      }

      case 'cancel-immediately': {
        // Cancel immediately
        const subscription = await getStripe().subscriptions.cancel(subscriptionId);
        return NextResponse.json({
          success: true,
          message: 'Subscription cancelled immediately',
          status: subscription.status,
        });
      }

      case 'resume': {
        // Resume a subscription that was set to cancel
        const subscription = await getStripe().subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });
        return NextResponse.json({
          success: true,
          message: 'Subscription resumed',
          status: subscription.status,
        });
      }

      case 'pause': {
        // Pause collection (skip next payment)
        const subscription = await getStripe().subscriptions.update(subscriptionId, {
          pause_collection: {
            behavior: 'mark_uncollectible',
          },
        });
        return NextResponse.json({
          success: true,
          message: 'Subscription paused',
          pauseCollection: subscription.pause_collection,
        });
      }

      case 'unpause': {
        // Resume collection
        const subscription = await getStripe().subscriptions.update(subscriptionId, {
          pause_collection: null,
        });
        return NextResponse.json({
          success: true,
          message: 'Subscription resumed',
          status: subscription.status,
        });
      }

      case 'portal': {
        // Create Stripe Customer Portal session
        if (!customerId) {
          return NextResponse.json({ error: 'Customer ID required for portal' }, { status: 400 });
        }
        
        const session = await getStripe().billingPortal.sessions.create({
          customer: customerId,
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tryregenrx.com'}/account`,
        });
        
        return NextResponse.json({
          success: true,
          url: session.url,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[regen-subscription-manage] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}
