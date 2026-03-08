// ============================================================
// PATCH /api/protocols/[id] — update protocol
// DELETE /api/protocols/[id] — delete protocol
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Protocol ID required' }, { status: 400 });

  try {
    const body = await request.json();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (typeof body.title === 'string') payload.title = body.title.trim();
    if (typeof body.version === 'string') payload.version = body.version.trim();
    if (body.status === 'draft' || body.status === 'active' || body.status === 'archived') payload.status = body.status;
    if (typeof body.review_due_date === 'string') payload.review_due_date = body.review_due_date;
    if (body.attachment_url !== undefined) payload.attachment_url = body.attachment_url || null;
    if (body.approved_by_provider_id !== undefined) payload.approved_by_provider_id = body.approved_by_provider_id || null;
    if (body.approval_date !== undefined) payload.approval_date = body.approval_date || null;

    const { data, error } = await supabase
      .from('protocols')
      .update(payload)
      .eq('protocol_id', id)
      .select('protocol_id, title, version, status, review_due_date, approved_by_provider_id, approval_date, attachment_url')
      .single();

    if (error) {
      console.warn('[protocols PATCH]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ protocol: data });
  } catch (e) {
    console.warn('[protocols PATCH]', e);
    return NextResponse.json({ error: 'Failed to update protocol' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Protocol ID required' }, { status: 400 });

  try {
    const { error } = await supabase.from('protocols').delete().eq('protocol_id', id);
    if (error) {
      console.warn('[protocols DELETE]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.warn('[protocols DELETE]', e);
    return NextResponse.json({ error: 'Failed to delete protocol' }, { status: 500 });
  }
}
