// ============================================================
// AI WATCHDOG API — Log and list AI interactions (audit + compliance)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    const { searchParams } = new URL(request.url);
    const flaggedOnly = searchParams.get('flagged') === 'true';
    const source = searchParams.get('source') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    let q = supabase
      .from('ai_watchdog_logs')
      .select('id, source, channel, request_summary, response_summary, full_response_preview, flagged, flag_reason, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (flaggedOnly) q = q.eq('flagged', true);
    if (source) q = q.eq('source', source);

    const { data, error } = await q;

    if (error) {
      console.error('AI watchdog list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ logs: data || [] });
  } catch (e) {
    console.error('AI watchdog GET:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    const body = await request.json();
    const {
      source,
      channel,
      request_summary,
      response_summary,
      full_response_preview,
      flagged = false,
      flag_reason,
      metadata = {},
    } = body;

    if (!source) {
      return NextResponse.json({ error: 'source required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_watchdog_logs')
      .insert({
        source,
        channel: channel || null,
        request_summary: request_summary || null,
        response_summary: response_summary || null,
        full_response_preview:
          typeof full_response_preview === 'string'
            ? full_response_preview.slice(0, 500)
            : null,
        flagged: !!flagged,
        flag_reason: flag_reason || null,
        metadata,
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('AI watchdog insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('AI watchdog POST:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
