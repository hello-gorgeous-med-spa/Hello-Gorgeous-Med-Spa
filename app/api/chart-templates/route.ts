// ============================================================
// API: CHART TEMPLATES - SOAP & Procedure Templates
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET /api/chart-templates - List active templates
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  // Default templates if no DB
  const defaultTemplates = [
    { id: 'default-soap', name: 'General SOAP Note', note_type: 'soap', is_default: true },
    { id: 'default-procedure', name: 'Injectable Procedure', note_type: 'procedure' },
    { id: 'default-followup', name: 'Follow-Up Note', note_type: 'follow_up' },
  ];

  if (!supabase) {
    return NextResponse.json({ templates: defaultTemplates, source: 'default' });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const noteType = searchParams.get('note_type');

    let query = supabase
      .from('chart_templates')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('name');

    if (category) {
      query = query.eq('category', category);
    }
    if (noteType) {
      query = query.eq('note_type', noteType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Templates fetch error:', error);
      return NextResponse.json({ templates: defaultTemplates, source: 'default' });
    }

    return NextResponse.json({ templates: data || defaultTemplates });
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json({ templates: defaultTemplates, source: 'default' });
  }
}

// POST /api/chart-templates - Create template
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('chart_templates')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Template create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template: data, success: true });
  } catch (error) {
    console.error('Template API error:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
