// ============================================================
// AI BUSINESS MEMORY — Single item (get, update, delete)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const { id } = await params;
  const { data, error } = await supabase
    .from('ai_business_memory')
    .select('id, type, title, content, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.type !== undefined) updates.type = body.type;
  if (body.title !== undefined) updates.title = body.title;
  if (body.content !== undefined) updates.content = body.content;

  const { data, error } = await supabase
    .from('ai_business_memory')
    .update(updates)
    .eq('id', id)
    .select('id, type, title, content, created_at, updated_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const { id } = await params;
  const { error } = await supabase.from('ai_business_memory').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
