// ============================================================
// STRIPE WEBHOOK - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision)
// Primary Processor: SQUARE
// 
// Configure Square webhooks instead.
// ============================================================

import { NextResponse } from 'next/server';

export async function POST() {
  // Log for monitoring - helps detect if Stripe is still trying to call us
  console.warn('⚠️  DEPRECATED: Stripe webhook called but Stripe is no longer used');
  
  return NextResponse.json(
    { 
      error: 'STRIPE_DEPRECATED',
      message: 'Stripe webhooks are no longer processed. Square is the sole payment processor.',
    },
    { status: 410 }
  );
}
