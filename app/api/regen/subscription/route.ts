import { NextRequest, NextResponse } from 'next/server';
import { stripeRetiredPayload } from '@/lib/regen/charm-payments';
import { PUBLIC_SUBSCRIPTION_TIERS } from '@/lib/regen/subscriptions/subscription-tiers';

export async function POST() {
  return NextResponse.json(
    {
      ...stripeRetiredPayload(),
      hint: 'Bill recurring REGEN programs as Charm invoices with Bluefin. Do not open a Stripe subscription.',
    },
    { status: 410 },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');
  const category = searchParams.get('category');

  if (customerId) {
    return NextResponse.json({ subscriptions: [] });
  }

  let tiers = PUBLIC_SUBSCRIPTION_TIERS;
  if (category) {
    tiers = tiers.filter((t) => t.category === category);
  }

  return NextResponse.json({ tiers });
}
