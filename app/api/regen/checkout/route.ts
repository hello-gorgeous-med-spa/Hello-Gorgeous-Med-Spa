import { NextResponse } from 'next/server';
import { stripeRetiredPayload } from '@/lib/regen/charm-payments';

export async function POST() {
  return NextResponse.json(stripeRetiredPayload(), { status: 410 });
}

export async function GET() {
  return NextResponse.json(stripeRetiredPayload(), { status: 410 });
}
