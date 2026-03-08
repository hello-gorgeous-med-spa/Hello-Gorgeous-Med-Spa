// ============================================================
// GET /api/protocols — list protocols (Protocol Center)
// POST /api/protocols — create protocol
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
      .from('protocols')
      .select('protocol_id, title, version, status, review_due_date, approved_by_provider_id, approval_date, attachment_url')
      .order('title')
      .order('version', { ascending: false });

    if (error) {
      console.warn('[protocols GET]', error.message);
      return NextResponse.json({ protocols: [] });
    }

    return NextResponse.json({ protocols: data || [] });
  } catch (e) {
    console.warn('[protocols GET]', e);
    return NextResponse.json({ protocols: [] });
  }
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const version = typeof body.version === 'string' ? body.version.trim() || '1.0' : '1.0';
    const status = body.status === 'active' || body.status === 'archived' ? body.status : 'draft';
    const review_due_date = body.review_due_date || null;
    if (!review_due_date || typeof review_due_date !== 'string') {
      return NextResponse.json({ error: 'Review due date is required' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      title,
      version,
      status,
      review_due_date,
      updated_at: new Date().toISOString(),
    };
    if (typeof body.attachment_url === 'string' && body.attachment_url) payload.attachment_url = body.attachment_url;
    if (body.approved_by_provider_id) payload.approved_by_provider_id = body.approved_by_provider_id;
    if (body.approval_date) payload.approval_date = body.approval_date;

    const { data, error } = await supabase.from('protocols').insert(payload).select('protocol_id, title, version, status, review_due_date, approved_by_provider_id, approval_date, attachment_url').single();

    if (error) {
      console.warn('[protocols POST]', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ protocol: data });
  } catch (e) {
    console.warn('[protocols POST]', e);
    return NextResponse.json({ error: 'Failed to create protocol' }, { status: 500 });
  }
}
