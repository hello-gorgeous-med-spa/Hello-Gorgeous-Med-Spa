// ============================================================
// AI BUSINESS MEMORY API — In-house knowledge base you own
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    const { data, error } = await supabase
      .from('ai_business_memory')
      .select('id, type, title, content, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('AI memory list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ items: data || [] });
  } catch (e) {
    console.error('AI memory GET:', e);
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
    const { type = 'faq', title, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: 'title and content required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_business_memory')
      .insert({ type, title, content })
      .select('id, type, title, content, created_at, updated_at')
      .single();

    if (error) {
      console.error('AI memory insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('AI memory POST:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
