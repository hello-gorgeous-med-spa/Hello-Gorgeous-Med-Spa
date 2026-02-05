// ============================================================
import { createClient } from '@supabase/supabase-js';
// AFTERCARE TEMPLATES API
// CRUD for aftercare instruction templates
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ templates: [] });
  }

  try {
    const { data: templates, error } = await supabase
      .from('aftercare_templates')
      .select(`
        *,
        services(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch templates error:', error);
      return NextResponse.json({ templates: [] });
    }

    // Flatten service name
    const formattedTemplates = (templates || []).map((t: any) => ({
      ...t,
      service_name: t.services?.name || null,
    }));

    return NextResponse.json({ templates: formattedTemplates });
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json({ templates: [] });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { service_id, name, content, send_via, send_delay_minutes, is_active } = body;

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    const { data: template, error } = await supabase
      .from('aftercare_templates')
      .insert({
        service_id: service_id || null,
        name,
        content,
        send_via: send_via || 'email',
        send_delay_minutes: send_delay_minutes || 0,
        is_active: is_active !== false,
      })
      .select()
      .single();

    if (error) {
      console.error('Create template error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template, success: true });
  } catch (error) {
    console.error('Create template API error:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
