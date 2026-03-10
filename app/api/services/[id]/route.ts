// ============================================================
// API: SERVICES [id] — GET one, PATCH update, DELETE
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { serviceStore } from '../store';

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

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'service';
}

function toServiceRow(raw: any): Record<string, unknown> {
  const priceCents = raw.price_cents != null ? Number(raw.price_cents) : Math.round((Number(raw.price) || 0) * 100);
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug || slugify(String(raw.name || '')),
    category: raw.category ?? null,
    description: raw.description ?? null,
    duration_minutes: raw.duration_minutes != null ? Number(raw.duration_minutes) : 60,
    cleanup_minutes: raw.cleanup_minutes != null ? Number(raw.cleanup_minutes) : 0,
    price_cents: priceCents,
    price: priceCents / 100,
    deposit_cents: raw.deposit_cents != null ? Number(raw.deposit_cents) : null,
    online_booking: raw.online_booking !== false,
    membership_eligible: raw.membership_eligible === true,
    package_eligible: raw.package_eligible === true,
    consent_required: raw.consent_required === true,
    intake_form_id: raw.intake_form_id ?? null,
    aftercare_id: raw.aftercare_id ?? null,
    active: raw.active !== false,
    archived: raw.archived === true,
    sort_order: raw.sort_order != null ? Number(raw.sort_order) : 0,
    upsells: raw.upsells ?? null,
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
    const one = serviceStore.get(id);
    if (!one) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ service: toServiceRow(one) });
  }

  try {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error && error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error) throw error;
    return NextResponse.json({ service: toServiceRow(data) });
  } catch (err) {
    console.error('Service GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
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
    'name', 'slug', 'category', 'description', 'duration_minutes', 'cleanup_minutes',
    'price_cents', 'price', 'deposit_cents', 'online_booking', 'membership_eligible',
    'package_eligible', 'consent_required', 'intake_form_id', 'aftercare_id',
    'active', 'archived', 'sort_order', 'upsells',
  ];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'price' && body.price !== undefined) {
        updates.price_cents = Math.round(Number(body.price) * 100);
      } else {
        (updates as any)[key] = body[key];
      }
    }
  }
  delete updates.price; // store price_cents only if both sent

  const supabase = getSupabase();
  if (!supabase) {
    const existing = serviceStore.get(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const merged = { ...existing, ...updates };
    if (updates.name && !updates.slug) (merged as any).slug = slugify(String(updates.name));
    serviceStore.set(id, merged as Record<string, unknown>);
    return NextResponse.json({ service: toServiceRow(merged) });
  }

  try {
    const { data, error } = await supabase.from('services').update(updates).eq('id', id).select('*').single();
    if (error && error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error) throw error;
    return NextResponse.json({ service: toServiceRow(data) });
  } catch (err) {
    console.error('Service PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();

  if (!supabase) {
    if (!serviceStore.has(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const existing = serviceStore.get(id) as any;
    // Soft delete: set archived
    existing.archived = true;
    existing.active = false;
    existing.updated_at = new Date().toISOString();
    serviceStore.set(id, existing);
    return NextResponse.json({ service: toServiceRow(existing) });
  }

  try {
    const { error } = await supabase.from('services').update({ archived: true, active: false, updated_at: new Date().toISOString() }).eq('id', id);
    if (error && error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Service DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
