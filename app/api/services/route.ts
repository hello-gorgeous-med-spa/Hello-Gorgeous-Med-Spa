// ============================================================
// API: SERVICES — Service Builder (Phase 4)
// GET: list (optional ?active=true), POST: create
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

import { serviceStore, nextServiceId } from './store';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'service';
}

function toServiceRow(raw: any): Record<string, unknown> {
  const priceCents = raw.price_cents != null ? Number(raw.price_cents) : Math.round((Number(raw.price) || 0) * 100);
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug || slugify(String(raw.name || '')),
    category: raw.category ?? raw.category_id ?? null,
    category_id: raw.category_id ?? null,
    description: raw.description ?? null,
    short_description: raw.short_description ?? null,
    duration_minutes: raw.duration_minutes != null ? Number(raw.duration_minutes) : 60,
    buffer_before_minutes: raw.buffer_before_minutes ?? 0,
    buffer_after_minutes: raw.buffer_after_minutes ?? 0,
    price_cents: priceCents,
    price: raw.price ?? (priceCents / 100),
    price_display: raw.price_display ?? null,
    deposit_required: raw.deposit_required === true,
    deposit_amount_cents: raw.deposit_amount_cents ?? null,
    allow_online_booking: raw.allow_online_booking !== false,
    requires_consult: raw.requires_consult === true,
    requires_consent: raw.requires_consent === true,
    requires_intake: raw.requires_intake === true,
    is_active: raw.is_active !== false,
    is_featured: raw.is_featured === true,
    display_order: raw.display_order != null ? Number(raw.display_order) : 0,
    image_url: raw.image_url ?? null,
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
    const all = Array.from(serviceStore.values()).map((r) => toServiceRow(r));
    if (id) {
      const one = serviceStore.get(id);
      if (!one) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ service: toServiceRow(one) });
    }
    let list = all.sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0) || String(a.name).localeCompare(String(b.name)));
    if (activeOnly) list = list.filter((s: any) => s.is_active && !s.archived);
    return NextResponse.json({ services: list, total: list.length, source: 'local' });
  }

  try {
    if (id) {
      const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ service: toServiceRow(data) });
    }

    let query = supabase.from('services').select('*').order('display_order', { ascending: true }).order('name');
    if (activeOnly) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    const list = (data || []).map(toServiceRow);
    return NextResponse.json({ services: list, total: list.length });
  } catch (err) {
    console.error('Services GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
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
  const row = {
    name,
    slug: body.slug ? String(body.slug).trim() : slugify(name),
    category: body.category ?? null,
    description: body.description ?? null,
    duration_minutes: body.duration_minutes != null ? Number(body.duration_minutes) : 60,
    cleanup_minutes: body.cleanup_minutes != null ? Number(body.cleanup_minutes) : 0,
    price_cents: body.price_cents != null ? Number(body.price_cents) : Math.round((Number(body.price) || 0) * 100),
    deposit_cents: body.deposit_cents ?? null,
    online_booking: body.online_booking !== false,
    membership_eligible: body.membership_eligible === true,
    package_eligible: body.package_eligible === true,
    consent_required: body.consent_required === true,
    intake_form_id: body.intake_form_id ?? null,
    aftercare_id: body.aftercare_id ?? null,
    active: body.active !== false,
    archived: body.archived === true,
    sort_order: body.sort_order != null ? Number(body.sort_order) : 0,
    upsells: body.upsells ?? null,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (!supabase) {
    const id = nextServiceId();
    const record = { id, ...row };
    serviceStore.set(id, record as Record<string, unknown>);
    return NextResponse.json({ service: toServiceRow(record) }, { status: 201 });
  }

  try {
    const insertRow = { ...row } as Record<string, unknown>;
    const { data, error } = await supabase.from('services').insert(insertRow).select('*').single();
    if (error) throw error;
    return NextResponse.json({ service: toServiceRow(data) }, { status: 201 });
  } catch (err) {
    console.error('Services POST error:', err);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
