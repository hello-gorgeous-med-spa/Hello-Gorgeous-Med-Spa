// ============================================================
// GET /api/emergency-response-log — list
// POST /api/emergency-response-log — log when emergency protocol used
// Phase 3: Emergency response logs
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

  try {
    const { data, error } = await supabase
      .from('emergency_response_log')
      .select(`
        id,
        protocol_id,
        protocol_slug,
        used_at,
        used_by_provider_id,
        patient_id,
        outcome,
        metadata,
        created_at,
        protocol:protocols(protocol_id, title),
        used_by:providers(id, first_name, last_name, name)
      `)
      .order('used_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[emergency-response-log GET]', error);
      return NextResponse.json({ error: 'Failed to list logs' }, { status: 500 });
    }

    return NextResponse.json({ logs: data || [] });
  } catch (e) {
    console.error('[emergency-response-log GET]', e);
    return NextResponse.json({ error: 'Failed to list logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: {
    protocol_id?: string;
    protocol_slug?: string;
    used_by_provider_id?: string;
    patient_id?: string;
    outcome?: string;
    metadata?: Record<string, unknown>;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('emergency_response_log')
      .insert({
        protocol_id: body.protocol_id || null,
        protocol_slug: body.protocol_slug || null,
        used_by_provider_id: body.used_by_provider_id || null,
        patient_id: body.patient_id || null,
        outcome: body.outcome || null,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('[emergency-response-log POST]', error);
      return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
    }

    return NextResponse.json({ log: data });
  } catch (e) {
    console.error('[emergency-response-log POST]', e);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}
