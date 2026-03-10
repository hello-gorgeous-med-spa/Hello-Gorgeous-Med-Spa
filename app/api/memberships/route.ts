// ============================================================
// API: MEMBERSHIPS — Membership Builder (Phase 4)
// GET: list, POST: create
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

import { membershipStore, nextMembershipId } from './store';

function toRow(raw: any): Record<string, unknown> {
  const cents = raw.monthly_price_cents != null ? Number(raw.monthly_price_cents) : Math.round((Number(raw.monthly_price) || 0) * 100);
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug ?? (raw.name ? String(raw.name).toLowerCase().replace(/\s+/g, '-') : ''),
    monthly_price_cents: cents,
    monthly_price: cents / 100,
    initiation_fee_cents: raw.initiation_fee_cents ?? null,
    benefits: raw.benefits ?? null,
    monthly_credits: raw.monthly_credits ?? null,
    rollover: raw.rollover ?? false,
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const activeOnly = searchParams.get('active') === 'true';

  const supabase = getSupabase();

  if (!supabase) {
    const all = Array.from(membershipStore.values()).map(toRow);
    if (id) {
      const one = membershipStore.get(id);
      if (!one) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ membership: toRow(one) });
    }
    let list = all.sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
    if (activeOnly) list = list.filter((m: any) => m.active);
    return NextResponse.json({ memberships: list, total: list.length, source: 'local' });
  }

  try {
    if (id) {
      const { data, error } = await supabase.from('memberships').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ membership: toRow(data) });
    }
    let query = supabase.from('memberships').select('*').order('name');
    if (activeOnly) query = query.eq('active', true);
    const { data, error } = await query;
    if (error) throw error;
    const list = (data || []).map(toRow);
    return NextResponse.json({ memberships: list, total: list.length });
  } catch (err) {
    console.error('Memberships GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

  const now = new Date().toISOString();
  const slug = body.slug ? String(body.slug).trim() : name.toLowerCase().replace(/\s+/g, '-');
  const monthlyPriceCents = body.monthly_price_cents != null ? Number(body.monthly_price_cents) : Math.round((Number(body.monthly_price) || 0) * 100);
  const row = {
    name,
    slug,
    monthly_price_cents: monthlyPriceCents,
    initiation_fee_cents: body.initiation_fee_cents ?? null,
    benefits: body.benefits ?? null,
    monthly_credits: body.monthly_credits ?? null,
    rollover: body.rollover === true,
    discounts: body.discounts ?? null,
    eligible_services: body.eligible_services ?? null,
    pause_cancel_rules: body.pause_cancel_rules ?? null,
    contract: body.contract ?? null,
    auto_billing: body.auto_billing === true,
    active: body.active !== false,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (!supabase) {
    const id = nextMembershipId();
    const record = { id, ...row };
    membershipStore.set(id, record as Record<string, unknown>);
    return NextResponse.json({ membership: toRow(record) }, { status: 201 });
  }

  try {
    const { data, error } = await supabase.from('memberships').insert(row as Record<string, unknown>).select('*').single();
    if (error) throw error;
    return NextResponse.json({ membership: toRow(data) }, { status: 201 });
  } catch (err) {
    console.error('Memberships POST error:', err);
    return NextResponse.json({ error: 'Failed to create membership' }, { status: 500 });
  }
}
