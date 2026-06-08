import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('client_id');
  if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  // Get running balance
  const { data: balance, error: balErr } = await supabase
    .from('unit_bank_balances')
    .select('balance, total_earned, total_redeemed, last_activity')
    .eq('client_id', clientId)
    .maybeSingle();

  if (balErr) return NextResponse.json({ error: balErr.message }, { status: 500 });

  // Get last 10 transactions
  const { data: history } = await supabase
    .from('unit_bank')
    .select('id, type, units, balance_after, note, toxin, units_purchased, created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({
    balance: balance?.balance ?? 0,
    total_earned: balance?.total_earned ?? 0,
    total_redeemed: balance?.total_redeemed ?? 0,
    last_activity: balance?.last_activity ?? null,
    history: history ?? [],
  });
}
