// ============================================================
// APPOINTMENTS API
// CRUD operations for appointments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/appointments - List appointments with filters
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const providerId = searchParams.get('providerId');
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(id, first_name, last_name, email, phone),
        provider:staff(id, first_name, last_name, title),
        service:services(id, name, price, duration_minutes)
      `)
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (date) {
      query = query
        .gte('scheduled_at', `${date}T00:00:00`)
        .lt('scheduled_at', `${date}T23:59:59`);
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ appointments: data });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      provider_id,
      service_id,
      location_id,
      scheduled_at,
      duration_minutes,
      notes,
      type = 'service',
    } = body;

    // Validate required fields
    if (!client_id || !scheduled_at) {
      return NextResponse.json(
        { error: 'client_id and scheduled_at are required' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const appointmentEnd = new Date(new Date(scheduled_at).getTime() + (duration_minutes || 30) * 60000);
    
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('provider_id', provider_id)
      .neq('status', 'cancelled')
      .gte('scheduled_at', new Date(scheduled_at).toISOString())
      .lt('scheduled_at', appointmentEnd.toISOString());

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Time slot conflicts with existing appointment' },
        { status: 409 }
      );
    }

    // Create appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id,
        provider_id,
        service_id,
        location_id,
        scheduled_at,
        duration_minutes: duration_minutes || 30,
        notes,
        type,
        status: 'booked',
      })
      .select(`
        *,
        client:clients(id, first_name, last_name),
        provider:staff(id, first_name, last_name),
        service:services(id, name, price)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ appointment: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
