// ============================================================
// GET /api/exports/requests
// List export requests (pending first). Super_owner only in production.
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('export_requests')
      .select('id, type, scope, requested_by, status, approved_by, denied_by, resolved_at, result_url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[exports/requests]', error);
      return NextResponse.json({ error: 'Failed to list requests' }, { status: 500 });
    }

    const pending = (data || []).filter((r: { status: string }) => r.status === 'pending');
    const resolved = (data || []).filter((r: { status: string }) => r.status !== 'pending');

    return NextResponse.json({ requests: data, pending, resolved });
  } catch (e) {
    console.error('[exports/requests]', e);
    return NextResponse.json({ error: 'Failed to list requests' }, { status: 500 });
  }
}
