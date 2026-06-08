import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HGV-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  let body: { client_id?: string; tier?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { client_id, tier } = body;
  if (!client_id) return NextResponse.json({ error: 'client_id required' }, { status: 400 });
  if (tier !== '1000' && tier !== '2000') return NextResponse.json({ error: 'tier must be 1000 or 2000' }, { status: 400 });

  const purchase_amount = tier === '1000' ? 1000 : 2000;
  const credit_amount = tier === '1000' ? 1100 : 2225;

  // Generate unique code (retry up to 5x on collision)
  let code = '';
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateCode();
    const { data: existing } = await supabase.from('vouchers').select('id').eq('code', candidate).maybeSingle();
    if (!existing) { code = candidate; break; }
  }
  if (!code) return NextResponse.json({ error: 'Could not generate unique code' }, { status: 500 });

  const { data: voucher, error } = await supabase
    .from('vouchers')
    .insert({ client_id, code, purchase_amount, credit_amount, remaining_balance: credit_amount })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ voucher }, { status: 201 });
}
