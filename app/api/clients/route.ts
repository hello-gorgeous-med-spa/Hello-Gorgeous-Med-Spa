// ============================================================
// API: CLIENTS - Full CRUD with service role (bypasses RLS)
// Fixed: No foreign key joins - uses separate queries
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

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
const clientStore: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search');

  // If no DB, return local clients
  if (!supabase) {
    const allClients = Array.from(clientStore.values());
    
    if (id) {
      const client = clientStore.get(id);
      if (client) {
        return NextResponse.json({ client });
      }
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    
    let filtered = allClients;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = allClients.filter((c: any) =>
        c.first_name?.toLowerCase().includes(searchLower) ||
        c.last_name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({ clients: filtered, total: filtered.length, source: 'local' });
  }

  try {
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get single client by ID
    if (id) {
      // Get client record
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (clientError || !client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      // Get user data separately
      let userData = null;
      if (client.user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, phone')
          .eq('id', client.user_id)
          .single();
        userData = user;
      }

      // Flatten the data
      const flatClient = {
        id: client.id,
        user_id: client.user_id,
        first_name: userData?.first_name || client.first_name,
        last_name: userData?.last_name || client.last_name,
        email: userData?.email || client.email,
        phone: userData?.phone || client.phone,
        date_of_birth: client.date_of_birth,
        gender: client.gender,
        address_line1: client.address_line1,
        address_line2: client.address_line2,
        city: client.city,
        state: client.state,
        postal_code: client.postal_code,
        emergency_contact_name: client.emergency_contact_name,
        emergency_contact_phone: client.emergency_contact_phone,
        referral_source: client.referral_source,
        internal_notes: client.internal_notes,
        allergies_summary: client.allergies_summary,
        medications_summary: client.medications_summary,
        medical_conditions_summary: client.medical_conditions_summary,
        created_at: client.created_at,
        last_visit_at: client.last_visit_at,
        total_spent: client.lifetime_value_cents ? client.lifetime_value_cents / 100 : 0,
        total_visits: client.visit_count || 0,
        visit_count: client.visit_count || 0,
        is_vip: client.is_vip || false,
        tags: client.tags || [],
      };

      return NextResponse.json({ client: flatClient });
    }

    // Get all clients - simple query without joins
    const { data: clientsData, error: clientsError, count } = await supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      return NextResponse.json({ error: clientsError.message }, { status: 500 });
    }

    // Get user IDs from clients
    const userIds = (clientsData || [])
      .map((c: any) => c.user_id)
      .filter((id: any) => id);

    // Fetch user data in bulk if we have user IDs
    let usersMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, phone')
        .in('id', userIds);
      
      if (usersData) {
        usersData.forEach((u: any) => {
          usersMap[u.id] = u;
        });
      }
    }

    // Combine client and user data
    const clients = (clientsData || []).map((c: any) => {
      const user = usersMap[c.user_id] || {};
      return {
        id: c.id,
        user_id: c.user_id,
        first_name: user.first_name || c.first_name,
        last_name: user.last_name || c.last_name,
        email: user.email || c.email,
        phone: user.phone || c.phone,
        date_of_birth: c.date_of_birth,
        created_at: c.created_at,
        last_visit: c.last_visit_at,
        total_spent: c.lifetime_value_cents ? c.lifetime_value_cents / 100 : 0,
        visit_count: c.visit_count || 0,
        is_vip: c.is_vip || false,
      };
    });

    // Filter by search if provided (client-side since we're not using joins)
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
      total: search ? filteredClients.length : (count || 0),
    });
  } catch (error) {
    console.error('Clients API error:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();

  // Support both camelCase and snake_case field names
  const firstName = body.first_name || body.firstName;
  const lastName = body.last_name || body.lastName;
  const email = (body.email || '')?.toLowerCase()?.trim();
  const phone = body.phone;

  // If no DB, store locally
  if (!supabase) {
    const clientId = `client-${Date.now()}`;
    const client = {
      id: clientId,
      user_id: clientId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      date_of_birth: body.date_of_birth || body.dateOfBirth,
      created_at: new Date().toISOString(),
    };
    clientStore.set(clientId, client);
    return NextResponse.json({ client, success: true, source: 'local' });
  }

  try {
    const dateOfBirth = body.date_of_birth || body.dateOfBirth;
    const gender = body.gender;
    const addressLine1 = body.address_line1 || body.address;
    const city = body.city;
    const state = body.state;
    const postalCode = body.postal_code || body.zip;
    const emergencyContactName = body.emergency_contact_name || body.emergencyContactName;
    const emergencyContactPhone = body.emergency_contact_phone || body.emergencyContactPhone;
    const referralSource = body.referral_source || body.referralSource;
    const internalNotes = body.internal_notes || body.notes;

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
            date_of_birth: dateOfBirth || null,
            gender: gender || null,
            address_line1: addressLine1 || null,
            city: city || null,
            state: state || null,
            postal_code: postalCode || null,
            emergency_contact_name: emergencyContactName || null,
            emergency_contact_phone: emergencyContactPhone || null,
            referral_source: referralSource || null,
            internal_notes: internalNotes || null,
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
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
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

    // Create client record with all fields
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        address_line1: addressLine1 || null,
        city: city || null,
        state: state || null,
        postal_code: postalCode || null,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_phone: emergencyContactPhone || null,
        referral_source: referralSource || null,
        internal_notes: internalNotes || null,
      })
      .select()
      .single();

    if (clientError) {
      return NextResponse.json({ error: clientError.message }, { status: 500 });
    }

    return NextResponse.json({ client, user, success: true });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
