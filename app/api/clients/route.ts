// ============================================================
// CLIENTS API
// CRUD operations for clients
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/clients - List clients with search and pagination
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const status = searchParams.get('status');
  const isVip = searchParams.get('vip');

  try {
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('last_name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (isVip === 'true') {
      query = query.eq('is_vip', true);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      clients: data,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create new client
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      emergency_contact_name,
      emergency_contact_phone,
      source,
      notes,
      tags,
    } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'first_name and last_name are required' },
        { status: 400 }
      );
    }

    // Check for existing client with same email
    if (email) {
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'Client with this email already exists', existingId: existing.id },
          { status: 409 }
        );
      }
    }

    // Create client
    const { data, error } = await supabase
      .from('clients')
      .insert({
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        client_type: 'regular',
        status: 'active',
        source: source || 'walk-in',
        notes,
        tags: tags || [],
        is_vip: false,
        total_visits: 0,
        total_spent: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ client: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
