// ============================================================
// STRIPE REFUND - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision)
// Primary Processor: SQUARE
// 
// Process refunds through Square Dashboard or Square API.
// ============================================================

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { 
      error: 'STRIPE_DEPRECATED',
      message: 'Stripe is no longer used. Process refunds through Square.',
    },
    { status: 410 }
  );
}
