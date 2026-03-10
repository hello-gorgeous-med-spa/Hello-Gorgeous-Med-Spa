// ============================================================
// API: MEMBERSHIPS [id] — GET one, PATCH update
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { membershipStore } from '../store';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  try {
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch {
    return null;
  }
}

function toRow(raw: any): Record<string, unknown> {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug ?? '',
    monthly_price_cents: raw.monthly_price_cents != null ? Number(raw.monthly_price_cents) : 0,
    monthly_price: (raw.monthly_price_cents != null ? Number(raw.monthly_price_cents) : 0) / 100,
    initiation_fee_cents: raw.initiation_fee_cents ?? null,
    benefits: raw.benefits ?? null,
    monthly_credits: raw.monthly_credits ?? null,
    rollover: raw.rollover === true,
    discounts: raw.discounts ?? null,
    eligible_services: raw.eligible_services ?? null,
    pause_cancel_rules: raw.pause_cancel_rules ?? null,
    contract: raw.contract ?? null,
    auto_billing: raw.auto_billing === true,
    active: raw.active !== false,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();

  if (!supabase) {
    const one = membershipStore.get(id);
    if (!one) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ membership: toRow(one) });
  }

  try {
    const { data, error } = await supabase.from('memberships').select('*').eq('id', id).single();
    if (error && error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error) throw error;
    return NextResponse.json({ membership: toRow(data) });
  } catch (err) {
    console.error('Membership GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch membership' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const allowed = [
    'name', 'slug', 'monthly_price_cents', 'monthly_price', 'initiation_fee_cents',
    'benefits', 'monthly_credits', 'rollover', 'discounts', 'eligible_services',
    'pause_cancel_rules', 'contract', 'auto_billing', 'active',
  ];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'monthly_price') {
        updates.monthly_price_cents = Math.round(Number(body.monthly_price) * 100);
      } else {
        (updates as any)[key] = body[key];
      }
    }
  }
  delete (updates as any).monthly_price;

  const supabase = getSupabase();
  if (!supabase) {
    const existing = membershipStore.get(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const merged = { ...existing, ...updates };
    membershipStore.set(id, merged as Record<string, unknown>);
    return NextResponse.json({ membership: toRow(merged) });
  }

  try {
    const { data, error } = await supabase.from('memberships').update(updates).eq('id', id).select('*').single();
    if (error && error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error) throw error;
    return NextResponse.json({ membership: toRow(data) });
  } catch (err) {
    console.error('Membership PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update membership' }, { status: 500 });
  }
}
