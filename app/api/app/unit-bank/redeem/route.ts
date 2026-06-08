// POST /api/app/unit-bank/redeem
// Called by staff at checkout when client redeems units.
// Body: { client_id, units_to_redeem, note, created_by }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, units_to_redeem, note, created_by } = body;

  if (!client_id || !units_to_redeem) {
    return NextResponse.json({ error: 'client_id and units_to_redeem required' }, { status: 400 });
  }

  const toRedeem = Number(units_to_redeem);

  // Get current balance
  const { data: current } = await supabase
    .from('unit_bank_balances')
    .select('balance')
    .eq('client_id', client_id)
    .maybeSingle();

  const currentBalance = current?.balance ?? 0;

  if (currentBalance < toRedeem) {
    return NextResponse.json({
      error: `Insufficient balance. Client has ${currentBalance} units, tried to redeem ${toRedeem}.`,
      balance: currentBalance,
    }, { status: 400 });
  }

  const newBalance = currentBalance - toRedeem;

  const { data, error } = await supabase
    .from('unit_bank')
    .insert({
      client_id,
      type: 'redeemed',
      units: -toRedeem,  // negative = deduction
      balance_after: newBalance,
      note: note ?? `Redeemed ${toRedeem} unit${toRedeem !== 1 ? 's' : ''} toward treatment`,
      created_by: created_by ?? 'staff',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    redeemed: toRedeem,
    value_dollars: toRedeem * 10,  // $10/unit
    new_balance: newBalance,
    transaction: data,
    message: `💉 ${toRedeem} unit${toRedeem !== 1 ? 's' : ''} redeemed! ($${toRedeem * 10} value). Remaining balance: ${newBalance} units.`,
  });
}
