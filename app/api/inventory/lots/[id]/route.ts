// ============================================================
// PATCH /api/inventory/lots/[id] — update lot metadata (e.g. link to protocol)
// Phase 3: Lot tracking link to protocols/safety
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lotId } = await params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: { related_protocol_id?: string | null } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.related_protocol_id !== undefined) {
    updates.related_protocol_id = body.related_protocol_id || null;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('inventory_lots')
    .update(updates)
    .eq('id', lotId)
    .select()
    .single();

  if (error) {
    console.error('[inventory/lots PATCH]', error);
    return NextResponse.json({ error: 'Failed to update lot' }, { status: 500 });
  }
  return NextResponse.json({ lot: data });
}
