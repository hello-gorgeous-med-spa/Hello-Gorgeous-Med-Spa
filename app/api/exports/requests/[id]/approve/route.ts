// ============================================================
// POST /api/exports/requests/[id]/approve
// Super_owner approves request; run export and log
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const approvedBy = request.headers.get('x-user-id') ?? null;

  const { data: row, error: fetchErr } = await supabase
    .from('export_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !row) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }
  if (row.status !== 'pending') {
    return NextResponse.json({ error: 'Request already resolved' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const resultUrl = `/admin/export?export_id=${id}`;

  await supabase
    .from('export_requests')
    .update({
      status: 'approved',
      approved_by: approvedBy,
      resolved_at: now,
      result_url: resultUrl,
      updated_at: now,
    })
    .eq('id', id);

  await supabase.from('governance_audit_log').insert({
    action: 'export_approved',
    entity_type: 'export_request',
    entity_id: id,
    actor_id: approvedBy,
    metadata: { type: row.type, resolved_at: now },
  });

  return NextResponse.json({
    ok: true,
    request_id: id,
    result_url: resultUrl,
  });
}
