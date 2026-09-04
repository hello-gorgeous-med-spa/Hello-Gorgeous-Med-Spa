import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSubscriptionTierById, SUBSCRIPTION_TIERS } from '@/lib/regen/subscriptions/subscription-tiers';

// Lazy init to avoid build-time errors
function getStripe() {
  const key = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe API key not configured');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

/**
 * POST /api/regen/subscription
 * Create a Stripe Checkout session for a subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierId, email, prepayMonths, successUrl, cancelUrl } = body;

    if (!tierId) {
      return NextResponse.json({ error: 'Subscription tier ID required' }, { status: 400 });
    }

    const tier = getSubscriptionTierById(tierId);
    if (!tier) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    // Find or create customer
    let customer: Stripe.Customer | undefined;
    if (email) {
      const existingCustomers = await getStripe().customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await getStripe().customers.create({
          email,
          metadata: { source: 'regen-rx-subscription' },
        });
      }
    }

    // Find the product in Stripe
    const products = await getStripe().products.search({
      query: `metadata['regen_tier_id']:'${tierId}'`,
    });

    if (products.data.length === 0) {
      return NextResponse.json(
        { error: 'Subscription product not found in Stripe. Please contact support.' },
        { status: 500 }
      );
    }

    const product = products.data[0];

    // Get the appropriate price
    const prices = await getStripe().prices.list({
      product: product.id,
      active: true,
    });

    let price: Stripe.Price | undefined;

    if (prepayMonths && [3, 6, 12].includes(prepayMonths)) {
      // Find prepay price
      price = prices.data.find(p => p.metadata?.prepay_months === prepayMonths.toString());
    }

    // Default to monthly recurring price
    if (!price) {
      price = prices.data.find(p => p.recurring?.interval === 'month');
    }

    if (!price) {
      return NextResponse.json(
        { error: 'No active price found for this subscription' },
        { status: 500 }
      );
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: price.recurring ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      allow_promotion_codes: true, // Enable promo codes like GORGEOUS20
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tryregenrx.com'}/account?subscribed=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tryregenrx.com'}/pricing`,
      metadata: {
        regen_tier_id: tierId,
        prepay_months: prepayMonths?.toString() || '',
      },
      subscription_data: price.recurring ? {
        metadata: {
          regen_tier_id: tierId,
        },
      } : undefined,
    };

    if (customer) {
      sessionParams.customer = customer.id;
    } else {
      sessionParams.customer_email = email;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[regen-subscription] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/regen/subscription
 * Get subscription tiers or customer subscriptions
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');
  const category = searchParams.get('category');

  // If customerId provided, get their subscriptions
  if (customerId) {
    try {
      const subscriptions = await getStripe().subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.items.data.price.product'],
      });

      return NextResponse.json({
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          tier: sub.metadata?.regen_tier_id,
          items: sub.items.data.map(item => ({
            priceId: item.price.id,
            productId: typeof item.price.product === 'string' ? item.price.product : item.price.product?.id,
            productName: typeof item.price.product === 'object' ? item.price.product?.name : null,
          })),
        })),
      });
    } catch (error) {
      console.error('[regen-subscription] Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
  }

  // Otherwise return available tiers
  let tiers = SUBSCRIPTION_TIERS;
  
  if (category) {
    tiers = tiers.filter(t => t.category === category);
  }

  return NextResponse.json({ tiers });
}
