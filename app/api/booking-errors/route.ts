// ============================================================
// API: BOOKING ERRORS - Track and monitor booking failures
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET - Fetch booking errors (for Owner Command Center)
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ errors: [], total: 0 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const unresolvedOnly = searchParams.get('unresolved') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = supabase
      .from('booking_errors')
      .select('*', { count: 'exact' })
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unresolvedOnly) {
      query = query.eq('resolved', false);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching booking errors:', error);
      return NextResponse.json({ errors: [], total: 0 });
    }

    return NextResponse.json({ 
      errors: data || [], 
      total: count || 0,
      unresolvedCount: (data || []).filter((e: any) => !e.resolved).length
    });
  } catch (error) {
    console.error('Booking errors API error:', error);
    return NextResponse.json({ errors: [], total: 0 });
  }
}

// POST - Log a new booking error
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    
    const errorData = {
      error_code: body.error_code || 'UNKNOWN_ERROR',
      error_message: body.error_message || 'Unknown error occurred',
      appointment_id: body.appointment_id || null,
      client_id: body.client_id || null,
      service_id: body.service_id || null,
      provider_id: body.provider_id || null,
      resource_id: body.resource_id || null,
      requested_time: body.requested_time || null,
      context: body.context || null,
      stack_trace: body.stack_trace || null,
    };

    const { data, error } = await supabase
      .from('booking_errors')
      .insert(errorData)
      .select()
      .single();

    if (error) {
      console.error('Error logging booking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error_log: data });
  } catch (error) {
    console.error('Booking errors POST error:', error);
    return NextResponse.json({ error: 'Failed to log booking error' }, { status: 500 });
  }
}

// PATCH - Resolve a booking error
export async function PATCH(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, resolved_by, resolution_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Error ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('booking_errors')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by,
        resolution_notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error_log: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve error' }, { status: 500 });
  }
}
