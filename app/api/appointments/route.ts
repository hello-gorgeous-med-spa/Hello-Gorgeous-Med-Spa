// ============================================================
// API: APPOINTMENTS - Full CRUD with service role (bypasses RLS)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Helper to safely create supabase client
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// In-memory store for when DB is unavailable
const appointmentStore: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  // If no DB, return empty or in-memory appointments
  if (!supabase) {
    const appointments = Array.from(appointmentStore.values());
    return NextResponse.json({ appointments, source: 'local' });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const providerId = searchParams.get('provider_id');
    const clientId = searchParams.get('client_id');

    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(
          id,
          user_id,
          users(first_name, last_name, email, phone)
        ),
        provider:providers(
          id,
          credentials,
          color_hex,
          users(first_name, last_name)
        ),
        service:services(id, name, price_cents, duration_minutes)
      `)
      .order('starts_at', { ascending: false });

    if (date) {
      query = query
        .gte('starts_at', `${date}T00:00:00`)
        .lt('starts_at', `${date}T23:59:59`)
        .order('starts_at', { ascending: true });
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten nested data for easier use
    const appointments = (data || []).map((apt: any) => ({
      ...apt,
      client_name: apt.client?.users ? 
        `${apt.client.users.first_name} ${apt.client.users.last_name}` : 'Unknown',
      client_email: apt.client?.users?.email,
      client_phone: apt.client?.users?.phone,
      provider_name: apt.provider?.users ?
        `${apt.provider.users.first_name} ${apt.provider.users.last_name}` : 'Unknown',
      provider_color: apt.provider?.color_hex || '#EC4899',
      service_name: apt.service?.name || 'Service',
      service_price: apt.service?.price_cents ? apt.service.price_cents / 100 : 0,
      duration: apt.service?.duration_minutes || 30,
    }));

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Appointments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();

  // If no DB, store locally and return success
  if (!supabase) {
    const appointment = {
      id: `apt-${Date.now()}`,
      ...body,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };
    appointmentStore.set(appointment.id, appointment);
    return NextResponse.json({ appointment, source: 'local' });
  }

  try {

    // Calculate ends_at from starts_at and duration
    const startsAt = new Date(body.starts_at);
    const duration = body.duration_minutes || 30;
    const endsAt = new Date(startsAt.getTime() + duration * 60000);

    // CHECK FOR DOUBLE BOOKING - Critical safety check
    if (body.provider_id) {
      const { data: existingAppointments, error: conflictError } = await supabase
        .from('appointments')
        .select('id, starts_at, ends_at')
        .eq('provider_id', body.provider_id)
        .neq('status', 'cancelled')
        .neq('status', 'no_show')
        .or(`and(starts_at.lt.${endsAt.toISOString()},ends_at.gt.${startsAt.toISOString()})`);

      if (!conflictError && existingAppointments && existingAppointments.length > 0) {
        return NextResponse.json(
          { 
            error: 'This provider already has an appointment at this time. Please select a different time slot.',
            conflictType: 'double_booking',
            conflictingAppointment: existingAppointments[0].id
          },
          { status: 409 }
        );
      }
    }

    // Build insert object with only valid columns
    // Valid status values: pending, confirmed, checked_in, in_progress, completed, cancelled, no_show
    const insertData: any = {
      client_id: body.client_id || null,
      provider_id: body.provider_id,
      service_id: body.service_id,
      starts_at: body.starts_at,
      ends_at: endsAt.toISOString(),
      status: 'confirmed',
    };

    // Try to insert - if notes column doesn't exist, retry without it
    let data, error;
    
    // First try with notes
    const result1 = await supabase
      .from('appointments')
      .insert({ ...insertData, notes: body.notes || null })
      .select()
      .single();

    if (result1.error && result1.error.message.includes('notes')) {
      // notes column doesn't exist, try without it
      console.log('Notes column not found, inserting without notes');
      const result2 = await supabase
        .from('appointments')
        .insert(insertData)
        .select()
        .single();
      data = result2.data;
      error = result2.error;
    } else {
      data = result1.data;
      error = result1.error;
    }

    if (error) {
      console.error('Appointment insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
  }

  // If no DB, update local store
  if (!supabase) {
    const existing = appointmentStore.get(id);
    if (existing) {
      const updated = { ...existing, ...updateData };
      appointmentStore.set(id, updated);
      return NextResponse.json({ appointment: updated, source: 'local' });
    }
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
