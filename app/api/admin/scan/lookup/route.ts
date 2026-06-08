import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(req: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

  // ── Client QR code scan ───────────────────────────────────────────────────
  if (code.startsWith('HGCLIENT:')) {
    const clientId = code.replace('HGCLIENT:', '').trim();

    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email, phone, total_visits, tier')
      .eq('id', clientId)
      .maybeSingle();

    if (clientErr) return NextResponse.json({ error: clientErr.message }, { status: 500 });
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    // Points balance
    const { data: unitBal } = await supabase
      .from('unit_bank_balances')
      .select('balance')
      .eq('client_id', clientId)
      .maybeSingle();

    // Active vouchers
    const { data: vouchers } = await supabase
      .from('vouchers')
      .select('id, code, purchase_amount, credit_amount, remaining_balance, status, purchased_at')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('purchased_at', { ascending: false });

    return NextResponse.json({
      type: 'client',
      client,
      points_balance: unitBal?.balance ?? 0,
      vouchers: vouchers ?? [],
    });
  }

  // ── Voucher code scan ────────────────────────────────────────────────────
  if (code.startsWith('HGV-')) {
    const { data: voucher, error: vErr } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .maybeSingle();

    if (vErr) return NextResponse.json({ error: vErr.message }, { status: 500 });
    if (!voucher) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });

    // Get client info
    const { data: client } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email, phone, total_visits, tier')
      .eq('id', voucher.client_id)
      .maybeSingle();

    // Points balance
    const { data: unitBal } = await supabase
      .from('unit_bank_balances')
      .select('balance')
      .eq('client_id', voucher.client_id)
      .maybeSingle();

    return NextResponse.json({
      type: 'voucher',
      voucher,
      client,
      points_balance: unitBal?.balance ?? 0,
    });
  }

  return NextResponse.json({ error: 'Unrecognized code format' }, { status: 400 });
}
