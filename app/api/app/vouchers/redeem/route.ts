import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  let body: { voucher_id?: string; amount_to_redeem?: number; redeemed_by?: string; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { voucher_id, amount_to_redeem, redeemed_by, note } = body;
  if (!voucher_id) return NextResponse.json({ error: 'voucher_id required' }, { status: 400 });
  if (!amount_to_redeem || amount_to_redeem <= 0) return NextResponse.json({ error: 'amount_to_redeem must be > 0' }, { status: 400 });

  // Fetch voucher
  const { data: voucher, error: fetchErr } = await supabase
    .from('vouchers')
    .select('*')
    .eq('id', voucher_id)
    .single();

  if (fetchErr || !voucher) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
  if (voucher.status !== 'active') return NextResponse.json({ error: `Voucher is ${voucher.status}` }, { status: 400 });
  if (voucher.remaining_balance < amount_to_redeem) {
    return NextResponse.json({ error: `Insufficient balance. Available: $${voucher.remaining_balance}` }, { status: 400 });
  }

  const balance_before = voucher.remaining_balance;
  const balance_after = balance_before - amount_to_redeem;
  const new_status = balance_after === 0 ? 'depleted' : 'active';

  // Insert redemption record
  const { data: redemption, error: redErr } = await supabase
    .from('voucher_redemptions')
    .insert({
      voucher_id,
      client_id: voucher.client_id,
      amount_used: amount_to_redeem,
      balance_before,
      balance_after,
      redeemed_by: redeemed_by ?? 'staff',
      note: note ?? null,
    })
    .select()
    .single();

  if (redErr) return NextResponse.json({ error: redErr.message }, { status: 500 });

  // Update voucher balance + status
  const { data: updatedVoucher, error: updateErr } = await supabase
    .from('vouchers')
    .update({ remaining_balance: balance_after, status: new_status })
    .eq('id', voucher_id)
    .select()
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ voucher: updatedVoucher, redemption });
}
