// ============================================================
// STRIPE CREATE PAYMENT INTENT - DEPRECATED
// ============================================================
// 
// ⚠️  STRIPE IS NO LONGER USED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision)
// Primary Processor: SQUARE
// 
// This endpoint returns an error. Use /api/pos/payment with Square.
// ============================================================

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { 
      error: 'STRIPE_DEPRECATED',
      message: 'Stripe is no longer used for Hello Gorgeous Med Spa. Use Square for all payments.',
      redirect: '/api/pos/payment',
    },
    { status: 410 } // 410 Gone
  );
}

export async function GET() {
  return NextResponse.json(
    { 
      error: 'STRIPE_DEPRECATED',
      message: 'Stripe is no longer used. Square is the sole payment processor.',
    },
    { status: 410 }
  );
}
