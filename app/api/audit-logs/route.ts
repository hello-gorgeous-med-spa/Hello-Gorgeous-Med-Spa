// ============================================================
// API: AUDIT LOGS - Track all system actions
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

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ logs: [], total: 0, source: 'unavailable' });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const resourceType = searchParams.get('resource_type');
    const user = searchParams.get('user');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    const offset = (page - 1) * limit;

    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.ilike('action', `%${action}%`);
    }
    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }
    if (user) {
      query = query.or(`user_id.eq.${user},user_email.ilike.%${user}%`);
    }
    if (dateFrom) {
      query = query.gte('created_at', `${dateFrom}T00:00:00`);
    }
    if (dateTo) {
      query = query.lte('created_at', `${dateTo}T23:59:59`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Audit logs fetch error:', error);
      return NextResponse.json({ logs: [], total: 0, error: error.message });
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Audit logs API error:', error);
    return NextResponse.json({ logs: [], total: 0, error: 'Failed to fetch audit logs' });
  }
}

// POST - Create audit log entry (called by other APIs)
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    
    const entry = {
      user_id: body.user_id || null,
      user_email: body.user_email || null,
      action: body.action,
      resource_type: body.resource_type,
      resource_id: body.resource_id || null,
      description: body.description || null,
      old_values: body.old_values || null,
      new_values: body.new_values || null,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    };

    const { data, error } = await supabase
      .from('audit_logs')
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.error('Audit log insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, log: data });
  } catch (error) {
    console.error('Audit log POST error:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}
