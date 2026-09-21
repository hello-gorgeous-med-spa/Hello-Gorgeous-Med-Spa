import { NextResponse } from 'next/server';
import { stripeRetiredPayload } from '@/lib/regen/charm-payments';

export async function POST() {
  return NextResponse.json(
    {
      ...stripeRetiredPayload(),
      hint: 'Pause, cancel, or refund REGEN plans in Charm. There is no Stripe customer portal.',
    },
    { status: 410 },
  );
}
