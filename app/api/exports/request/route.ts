// ============================================================
// POST /api/exports/request
// Create export request (requires super_owner approval to run)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['patient_list', 'chart_export', 'report', 'marketing_list', 'photo_library'];

export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: { type: string; scope?: Record<string, unknown>; requested_by?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, scope, requested_by } = body;
  if (!type || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid or missing type' }, { status: 400 });
  }

  const requestedBy = requested_by || (request.headers.get('x-user-id') ?? null);
  if (!requestedBy) {
    return NextResponse.json({ error: 'requested_by or x-user-id required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('export_requests')
      .insert({
        type,
        scope: scope || {},
        requested_by: requestedBy,
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .select('id, type, status, created_at')
      .single();

    if (error) {
      console.error('[exports/request]', error);
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }

    return NextResponse.json({ request: data });
  } catch (e) {
    console.error('[exports/request]', e);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
