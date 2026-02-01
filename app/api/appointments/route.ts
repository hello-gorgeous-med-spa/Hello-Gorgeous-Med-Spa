// ============================================================
// API: APPOINTMENTS - Full CRUD with service role (bypasses RLS)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
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
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    // Calculate ends_at from starts_at and duration
    const startsAt = new Date(body.starts_at);
    const duration = body.duration_minutes || 30;
    const endsAt = new Date(startsAt.getTime() + duration * 60000);

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id: body.client_id,
        provider_id: body.provider_id,
        service_id: body.service_id,
        starts_at: body.starts_at,
        ends_at: endsAt.toISOString(),
        status: 'scheduled',
        notes: body.notes || null,
        source: body.source || 'admin',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
    }

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
