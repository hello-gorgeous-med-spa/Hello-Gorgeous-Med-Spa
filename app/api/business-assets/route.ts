// ============================================================
// GET /api/business-assets — list
// POST /api/business-assets — create
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const ASSET_TYPES = [
  'device',
  'domain',
  'social_account',
  'vendor_account',
  'treatment_protocol',
  'website',
  'photography_library',
  'marketing_asset',
  'product_inventory_account',
];

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('business_assets')
    .select('*')
    .order('asset_type')
    .order('name');

  if (error) {
    console.error('[business-assets GET]', error);
    return NextResponse.json({ error: 'Failed to list assets' }, { status: 500 });
  }

  return NextResponse.json({ assets: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: { asset_type: string; name: string; owner_entity?: string; reference_id?: string; metadata?: Record<string, unknown> } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { asset_type, name, owner_entity, reference_id, metadata } = body;
  if (!asset_type || !ASSET_TYPES.includes(asset_type)) {
    return NextResponse.json({ error: 'Valid asset_type required' }, { status: 400 });
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('business_assets')
    .insert({
      asset_type,
      name: name.trim(),
      owner_entity: owner_entity?.trim() || 'Hello Gorgeous Med Spa',
      reference_id: reference_id?.trim() || null,
      metadata: metadata || {},
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('[business-assets POST]', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }

  return NextResponse.json({ asset: data });
}
