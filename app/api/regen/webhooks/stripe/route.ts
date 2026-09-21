import { NextResponse } from 'next/server';
import { stripeRetiredPayload } from '@/lib/regen/charm-payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    { ...stripeRetiredPayload(), received: false },
    { status: 410 },
  );
}
