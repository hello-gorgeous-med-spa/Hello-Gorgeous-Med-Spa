// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: CONFIG AUDIT LOG - Track all configuration changes
// Version control for all settings with rollback capability
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    // createClient imported at top
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const table = searchParams.get('table');

  if (supabase) {
    try {
      let query = supabase
        .from('config_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(limit);

      if (table) {
        query = query.eq('table_name', table);
      }

      const { data, error } = await query;

      if (!error) {
        return NextResponse.json({ entries: data, source: 'database' });
      }
    } catch (error) {
      console.log('Audit log DB error:', error);
    }
  }

  return NextResponse.json({ entries: [], source: 'defaults' });
}

// POST - Log a configuration change
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { table_name, record_id, action, old_value, new_value, description } = body;

    if (!table_name || !action) {
      return NextResponse.json({ error: 'table_name and action required' }, { status: 400 });
    }

    const entry = {
      table_name,
      record_id,
      action,
      old_value,
      new_value,
      description,
      changed_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('config_audit_log')
        .insert(entry)
        .select()
        .single();

      if (!error) {
        return NextResponse.json({ success: true, entry: data });
      }
    }

    return NextResponse.json({ success: true, entry, source: 'local' });
  } catch (error: any) {
    console.error('Audit log POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
