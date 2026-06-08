// POST /api/app/unit-bank/earn
// Credits points to a client after a purchase.
// Body: { client_id, dollars_spent, service, tier, note, created_by }
//   OR for bonus/manual: { client_id, _override_points, note, created_by }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculatePointsEarned, type LoyaltyTierId } from '@/lib/unit-bank';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    client_id,
    dollars_spent,
    // legacy field names still accepted
    units_purchased,
    toxin,
    service,
    tier = 'bronze',
    note,
    created_by,
    _override_units,
    _override_points,
  } = body;

  if (!client_id) {
    return NextResponse.json({ error: 'client_id required' }, { status: 400 });
  }

  // Support override (bonus/manual credit) — bypasses earn rate
  const overrideAmt = _override_points ?? _override_units;
  const spent = dollars_spent ?? units_purchased ?? 0;

  const pointsEarned = overrideAmt != null
    ? Number(overrideAmt)
    : calculatePointsEarned(Number(spent), tier as LoyaltyTierId);

  if (pointsEarned === 0) {
    return NextResponse.json({ earned: 0, message: 'No points earned — check amount.' });
  }

  const recordType = overrideAmt != null ? 'bonus' : 'earned';

  // Get current balance
  const { data: current } = await supabase
    .from('unit_bank_balances')
    .select('balance')
    .eq('client_id', client_id)
    .maybeSingle();

  const currentBalance = current?.balance ?? 0;
  const newBalance = currentBalance + pointsEarned;

  const { data, error } = await supabase
    .from('unit_bank')
    .insert({
      client_id,
      type: recordType,
      units: pointsEarned,
      balance_after: newBalance,
      toxin: toxin ?? service ?? null,
      units_purchased: Number(spent),
      note: note ?? `${spent ? `$${spent} spent` : 'Bonus points'}`,
      created_by: created_by ?? 'staff',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const dollarsValue = (newBalance / 100).toFixed(2);

  return NextResponse.json({
    earned: pointsEarned,
    new_balance: newBalance,
    dollars_value: dollarsValue,
    transaction: data,
    message: `🌟 ${pointsEarned} points added! New balance: ${newBalance} pts ($${dollarsValue} value).`,
  });
}
