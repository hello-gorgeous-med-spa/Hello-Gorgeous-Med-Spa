// ============================================================
// API: CLIENTS - Full CRUD with service role (bypasses RLS)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get clients with user info
    let query = supabase
      .from('clients')
      .select(`
        *,
        users!inner(id, first_name, last_name, email, phone)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten the data
    const clients = (data || []).map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      first_name: c.users?.first_name,
      last_name: c.users?.last_name,
      email: c.users?.email,
      phone: c.users?.phone,
      date_of_birth: c.date_of_birth,
      created_at: c.created_at,
      last_visit: c.last_visit_at,
      total_spent: c.lifetime_value_cents ? c.lifetime_value_cents / 100 : 0,
      visit_count: c.visit_count || 0,
    }));

    // Filter by search if provided
    let filteredClients = clients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = clients.filter((c: any) => 
        c.first_name?.toLowerCase().includes(searchLower) ||
        c.last_name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(search)
      );
    }

    return NextResponse.json({
      clients: filteredClients,
      total: count || 0,
    });
  } catch (error) {
    console.error('Clients API error:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const email = body.email?.toLowerCase()?.trim();

    // Check if user with this email already exists
    if (email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Check if they already have a client record
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', existingUser.id)
          .single();

        if (existingClient) {
          return NextResponse.json({ 
            error: 'A client with this email already exists',
            existingClientId: existingClient.id 
          }, { status: 409 });
        }

        // User exists but no client record - create client
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .insert({
            user_id: existingUser.id,
            date_of_birth: body.dateOfBirth || null,
            gender: body.gender || null,
            referral_source: body.referralSource || null,
          })
          .select()
          .single();

        if (clientError) {
          return NextResponse.json({ error: clientError.message }, { status: 500 });
        }

        return NextResponse.json({ client, user: existingUser, existed: true });
      }
    }

    // Create new user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        email: email,
        phone: body.phone,
        role: 'client',
      })
      .select('id')
      .single();

    if (userError) {
      // Handle duplicate email more gracefully
      if (userError.message.includes('duplicate') || userError.message.includes('unique')) {
        return NextResponse.json({ 
          error: 'A client with this email already exists. Please use a different email or search for the existing client.' 
        }, { status: 409 });
      }
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Create client record
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        date_of_birth: body.dateOfBirth || null,
        gender: body.gender || null,
        referral_source: body.referralSource || null,
      })
      .select()
      .single();

    if (clientError) {
      return NextResponse.json({ error: clientError.message }, { status: 500 });
    }

    return NextResponse.json({ client, user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
