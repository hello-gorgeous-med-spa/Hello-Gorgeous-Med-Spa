// POST /api/webhooks/square
// Square fires this the moment a payment completes on the register.
// We auto-credit HG Rewards points to the matching client.
//
// Setup in Square Developer Dashboard:
//   Webhook URL: https://hellogorgeousmedspa.com/api/webhooks/square
//   Events to subscribe: payment.completed, payment.updated
//
// Required env vars:
//   SQUARE_WEBHOOK_SIGNATURE_KEY   (from Square Developer > Webhooks)
//   SQUARE_ACCESS_TOKEN            (from Square Developer > Credentials)

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Points per dollar by loyalty tier
const POINTS_PER_DOLLAR: Record<string, number> = {
  bronze: 5,
  gold: 7,
  platinum: 10,
};

function getTierFromVisits(visits: number): string {
  if (visits >= 20) return 'platinum';
  if (visits >= 10) return 'gold';
  return 'bronze';
}

// Verify the request actually came from Square
function verifySquareSignature(
  body: string,
  signature: string | null,
  sigKey: string,
  notificationUrl: string
): boolean {
  if (!signature || !sigKey) return false;
  const hmac = createHmac('sha256', sigKey);
  hmac.update(notificationUrl + body);
  const expected = hmac.digest('base64');
  return expected === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-square-hmacsha256-signature');
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? '';
  const webhookUrl = 'https://hellogorgeousmedspa.com/api/webhooks/square';

  // Verify signature in production
  if (process.env.NODE_ENV === 'production' && sigKey) {
    const valid = verifySquareSignature(rawBody, signature, sigKey, webhookUrl);
    if (!valid) {
      console.error('[Square webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = event.type as string;

  // Only process completed payments
  if (eventType !== 'payment.completed' && eventType !== 'payment.updated') {
    return NextResponse.json({ skipped: true, reason: `Event type ${eventType} not handled` });
  }

  const data = event.data as Record<string, unknown> | undefined;
  const obj = data?.object as Record<string, unknown> | undefined;
  const payment = obj?.payment as Record<string, unknown> | undefined;

  if (!payment) {
    return NextResponse.json({ skipped: true, reason: 'No payment object' });
  }

  // Only credit on COMPLETED payments
  if (payment.status !== 'COMPLETED') {
    return NextResponse.json({ skipped: true, reason: `Payment status: ${payment.status}` });
  }

  // Check we haven't already processed this payment
  const paymentId = payment.id as string;
  const { data: existing } = await supabase
    .from('unit_bank')
    .select('id')
    .eq('note', `Square payment ${paymentId}`)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ skipped: true, reason: 'Already processed' });
  }

  // Get the dollar amount (Square stores in cents)
  const amountMoney = payment.amount_money as Record<string, unknown> | undefined;
  const totalCents = Number(amountMoney?.amount ?? 0);
  const totalDollars = totalCents / 100;

  if (totalDollars < 1) {
    return NextResponse.json({ skipped: true, reason: 'Amount too small' });
  }

  // Get Square customer ID from the payment
  const squareCustomerId = payment.customer_id as string | undefined;

  if (!squareCustomerId) {
    // No customer on file — log and skip (can't match without customer)
    console.log(`[Square webhook] Payment ${paymentId} has no customer_id — skipping points`);
    return NextResponse.json({ skipped: true, reason: 'No customer_id on payment' });
  }

  // Look up the customer in Square to get their phone/email
  let customerPhone: string | null = null;
  let customerEmail: string | null = null;

  try {
    const squareRes = await fetch(
      `https://connect.squareup.com/v2/customers/${squareCustomerId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Square-Version': '2024-01-18',
        },
      }
    );
    const squareData = await squareRes.json();
    const customer = squareData.customer;
    customerPhone = customer?.phone_number ?? null;
    customerEmail = customer?.email_address ?? null;
  } catch (err) {
    console.error('[Square webhook] Failed to fetch Square customer:', err);
  }

  // Normalize phone for matching (strip everything except digits)
  const normalizePhone = (p: string) => p.replace(/\D/g, '').slice(-10);

  // Find matching HG client
  let hgClient: { id: string; total_visits: number } | null = null;

  // Try email first (most reliable)
  if (customerEmail) {
    const { data } = await supabase
      .from('clients')
      .select('id, total_visits')
      .ilike('email', customerEmail.trim())
      .maybeSingle();
    hgClient = data;
  }

  // Fallback: try phone
  if (!hgClient && customerPhone) {
    const normalized = normalizePhone(customerPhone);
    const { data: all } = await supabase
      .from('clients')
      .select('id, total_visits, phone')
      .not('phone', 'is', null);

    hgClient = all?.find(c =>
      c.phone && normalizePhone(c.phone) === normalized
    ) ?? null;
  }

  if (!hgClient) {
    // Client not found in HG system — they may not have the app yet
    console.log(`[Square webhook] No HG client found for Square customer ${squareCustomerId}`);
    return NextResponse.json({
      skipped: true,
      reason: 'No matching HG client (not in app)',
      square_customer_id: squareCustomerId,
      email: customerEmail,
    });
  }

  // Calculate points
  const tier = getTierFromVisits(hgClient.total_visits ?? 0);
  const pointsEarned = Math.floor(totalDollars * (POINTS_PER_DOLLAR[tier] ?? 5));

  if (pointsEarned === 0) {
    return NextResponse.json({ skipped: true, reason: 'Zero points calculated' });
  }

  // Get current balance
  const { data: balanceRow } = await supabase
    .from('unit_bank_balances')
    .select('balance')
    .eq('client_id', hgClient.id)
    .maybeSingle();

  const currentBalance = balanceRow?.balance ?? 0;
  const newBalance = currentBalance + pointsEarned;

  // Credit the points
  const { error } = await supabase.from('unit_bank').insert({
    client_id: hgClient.id,
    type: 'earned',
    units: pointsEarned,
    balance_after: newBalance,
    units_purchased: totalDollars,
    note: `Square payment ${paymentId}`,
    created_by: 'square-webhook',
  });

  if (error) {
    console.error('[Square webhook] Failed to insert points:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(
    `[Square webhook] ✅ ${pointsEarned} pts credited to client ${hgClient.id} ` +
    `($${totalDollars} · ${tier} tier · balance: ${newBalance})`
  );

  return NextResponse.json({
    success: true,
    client_id: hgClient.id,
    points_earned: pointsEarned,
    new_balance: newBalance,
    dollars_charged: totalDollars,
    tier,
    payment_id: paymentId,
  });
}
