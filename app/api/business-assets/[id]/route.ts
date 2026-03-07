// ============================================================
// PATCH /api/business-assets/[id] — update asset
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: { asset_type?: string; name?: string; owner_entity?: string; reference_id?: string; metadata?: Record<string, unknown> } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.asset_type !== undefined) {
    if (!ASSET_TYPES.includes(body.asset_type)) {
      return NextResponse.json({ error: 'Invalid asset_type' }, { status: 400 });
    }
    updates.asset_type = body.asset_type;
  }
  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.owner_entity !== undefined) updates.owner_entity = String(body.owner_entity).trim();
  if (body.reference_id !== undefined) updates.reference_id = body.reference_id ? String(body.reference_id).trim() : null;
  if (body.metadata !== undefined) updates.metadata = body.metadata;

  const { data, error } = await supabase
    .from('business_assets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[business-assets PATCH]', error);
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }

  return NextResponse.json({ asset: data });
}
