import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(req: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const client_id = req.nextUrl.searchParams.get('client_id');
  if (!client_id) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const { data: vouchers, error } = await supabase
    .from('vouchers')
    .select('id, code, purchase_amount, credit_amount, remaining_balance, status, purchased_at, expires_at, note')
    .eq('client_id', client_id)
    .eq('status', 'active')
    .order('purchased_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ vouchers: vouchers ?? [] });
}
