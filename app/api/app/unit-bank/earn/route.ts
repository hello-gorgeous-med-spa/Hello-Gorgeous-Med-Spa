// POST /api/app/unit-bank/earn
// Called by staff after a neurotoxin treatment to credit units to the client's bank.
// Body: { client_id, units_purchased, toxin, tier, note, created_by }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateUnitsEarned, type LoyaltyTierId } from '@/lib/unit-bank';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, units_purchased, toxin, tier = 'bronze', note, created_by } = body;

  if (!client_id || !units_purchased) {
    return NextResponse.json({ error: 'client_id and units_purchased required' }, { status: 400 });
  }

  const unitsEarned = calculateUnitsEarned(Number(units_purchased), tier as LoyaltyTierId);
  if (unitsEarned === 0) {
    return NextResponse.json({ earned: 0, message: 'Not enough units purchased to earn a reward yet.' });
  }

  // Get current balance
  const { data: current } = await supabase
    .from('unit_bank_balances')
    .select('balance')
    .eq('client_id', client_id)
    .maybeSingle();

  const currentBalance = current?.balance ?? 0;
  const newBalance = currentBalance + unitsEarned;

  // Insert earn record
  const { data, error } = await supabase
    .from('unit_bank')
    .insert({
      client_id,
      type: 'earned',
      units: unitsEarned,
      balance_after: newBalance,
      toxin: toxin ?? null,
      units_purchased: Number(units_purchased),
      note: note ?? `${units_purchased} units of ${toxin ?? 'neurotoxin'} purchased`,
      created_by: created_by ?? 'staff',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    earned: unitsEarned,
    new_balance: newBalance,
    transaction: data,
    message: `✨ ${unitsEarned} unit${unitsEarned !== 1 ? 's' : ''} added to Unit Bank! New balance: ${newBalance} units.`,
  });
}
