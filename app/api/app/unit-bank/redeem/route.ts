// POST /api/app/unit-bank/redeem
// Called by staff at checkout when client redeems points for dollars off.
// Body: { client_id, points_to_redeem, note, created_by }
// 100 points = $1 off any service (except memberships)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { pointsToDollars } from '@/lib/unit-bank';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Accept both new (points_to_redeem) and legacy (units_to_redeem) field names
  const { client_id, points_to_redeem, units_to_redeem, note, created_by } = body;
  const toRedeem = Number(points_to_redeem ?? units_to_redeem ?? 0);

  if (!client_id || !toRedeem) {
    return NextResponse.json({ error: 'client_id and points_to_redeem required' }, { status: 400 });
  }

  // Get current balance
  const { data: current } = await supabase
    .from('unit_bank_balances')
    .select('balance')
    .eq('client_id', client_id)
    .maybeSingle();

  const currentBalance = current?.balance ?? 0;

  if (currentBalance < toRedeem) {
    return NextResponse.json({
      error: `Insufficient points. Client has ${currentBalance} pts, tried to redeem ${toRedeem}.`,
      balance: currentBalance,
    }, { status: 400 });
  }

  const newBalance = currentBalance - toRedeem;
  const dollarsOff = pointsToDollars(toRedeem).toFixed(2);

  const { data, error } = await supabase
    .from('unit_bank')
    .insert({
      client_id,
      type: 'redeemed',
      units: -toRedeem,
      balance_after: newBalance,
      note: note ?? `Redeemed ${toRedeem} points ($${dollarsOff} off)`,
      created_by: created_by ?? 'staff',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    redeemed: toRedeem,
    value_dollars: dollarsOff,
    new_balance: newBalance,
    transaction: data,
    message: `✅ ${toRedeem} points redeemed! ($${dollarsOff} off). Remaining: ${newBalance} pts.`,
  });
}
