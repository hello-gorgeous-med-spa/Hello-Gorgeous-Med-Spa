// ============================================================
// API: CLIENTS - Full CRUD with service role (bypasses RLS)
// Integrated with Square: when no DB or as merge, load customers from Square
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSquareCustomers, isSquareConfigured } from '@/lib/square-clients';

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
    // createClient imported at top
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

  // If no DB: try Square first, then in-memory store
  if (!supabase) {
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '100')));
    const offset = parseInt(searchParams.get('offset') || '0');

    // Load all from Square when configured (SQUARE_ACCESS_TOKEN or SQUARE_TOKEN)
    const squareClients = await fetchAllSquareCustomers();
    let allClients: any[] = [...squareClients];

    // Merge in-memory store (any clients added via POST when no DB)
    const localClients = Array.from(clientStore.values());
    for (const c of localClients) {
      if (!allClients.some((s: any) => s.id === c.id)) allClients.push(c);
    }

    // Search filter (first name, last name, email)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allClients = allClients.filter(
        (c: any) =>
          c.first_name?.toLowerCase().includes(q) ||
          c.last_name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }

    if (id) {
      const client = allClients.find((c: any) => c.id === id) ?? clientStore.get(id);
      if (client) {
        return NextResponse.json({ client });
      }
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Paginate
    const total = allClients.length;
    const clients = allClients.slice(offset, offset + limit);
    const res: { clients: any[]; total: number; source: string; square_configured?: boolean } = {
      clients,
      total,
      source: squareClients.length ? 'square' : 'local',
    };
    if (total === 0) res.square_configured = isSquareConfigured();
    return NextResponse.json(res);
  }

  try {
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get single client by ID (or by email/slug if id is not a UUID)
    if (id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let client: any = null;
      let clientError: any = null;

      if (isUuid) {
        const result = await supabase.from('clients').select('*').eq('id', id).single();
        client = result.data;
        clientError = result.error;
      }

      // Fallback: find by user email (e.g. id is "danielleglazi" and user email is danielleglazi@...)
      if ((!isUuid || clientError || !client) && id) {
        let userId: string | null = null;
        const { data: byEmail } = await supabase.from('users').select('id').eq('email', id).limit(1);
        userId = byEmail?.[0]?.id ?? null;
        if (!userId) {
          const { data: byPrefix } = await supabase.from('users').select('id').ilike('email', `${id}@%`).limit(1);
          userId = byPrefix?.[0]?.id ?? null;
        }
        if (userId) {
          const result = await supabase.from('clients').select('*').eq('user_id', userId).single();
          client = result.data;
          clientError = result.error;
        }
      }

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

      // Flatten the data (include Client Intelligence fields)
      const ltvCents = client.total_lifetime_value_cents ?? client.lifetime_value_cents ?? 0;
      const visits = client.total_visits ?? client.visit_count ?? 0;
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
        source: client.source || client.referral_source,
        internal_notes: client.internal_notes,
        allergies_summary: client.allergies_summary,
        medications_summary: client.medications_summary,
        medical_conditions_summary: client.medical_conditions_summary,
        created_at: client.created_at,
        last_visit_at: client.last_visit_date || client.last_visit_at,
        total_spent: ltvCents ? ltvCents / 100 : 0,
        total_visits: visits,
        visit_count: visits,
        is_vip: client.is_vip || false,
        tags: client.tags || [],
        square_customer_id: client.square_customer_id || null,
      };

      return NextResponse.json({ client: flatClient });
    }

    // Get all clients - simple query without joins (include Client Intelligence fields)
    // Support sorting by name or created_at
    const sortBy = searchParams.get('sort') || 'created_at';
    const sortOrder = searchParams.get('order') || 'desc';
    
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' });
    
    // Apply sorting - support 'name' for alphabetical, 'created_at' for newest first
    if (sortBy === 'name') {
      query = query.order('first_name', { ascending: sortOrder !== 'desc' })
                   .order('last_name', { ascending: sortOrder !== 'desc' });
    } else {
      query = query.order(sortBy, { ascending: sortOrder !== 'desc' });
    }

    const sourceFilter = searchParams.get('source');
    if (sourceFilter && sourceFilter.trim()) {
      query = query.eq('source', sourceFilter.trim());
    }

    // Server-side search: filter in DB so pagination and total are correct
    if (search && search.trim()) {
      const term = search.trim();
      query = query.or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
      );
    }

    query = query.range(offset, offset + limit - 1);
    const { data: clientsData, error: clientsError, count } = await query;

    // Some Supabase setups don't return count when using range() + filters; fetch total separately if missing
    let totalCount: number | null = typeof count === 'number' ? count : null;
    if (totalCount === null && !clientsError) {
      let countQuery = supabase.from('clients').select('*', { count: 'exact', head: true });
      if (sourceFilter && sourceFilter.trim()) {
        countQuery = countQuery.eq('source', sourceFilter.trim());
      }
      if (search && search.trim()) {
        const term = search.trim();
        countQuery = countQuery.or(
          `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
        );
      }
      const { count: fallbackCount } = await countQuery;
      totalCount = typeof fallbackCount === 'number' ? fallbackCount : (clientsData?.length ?? 0);
    } else if (totalCount === null) {
      totalCount = 0;
    }

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      // Try Square so the list isn't empty when DB fails
      const squareClients = await fetchAllSquareCustomers();
      if (squareClients.length > 0) {
        let squareList = squareClients;
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          squareList = squareList.filter(
            (c: any) =>
              c.first_name?.toLowerCase().includes(q) ||
              c.last_name?.toLowerCase().includes(q) ||
              c.email?.toLowerCase().includes(q)
          );
        }
        const total = squareList.length;
        const limitNum = parseInt(searchParams.get('limit') || '100');
        const offsetNum = parseInt(searchParams.get('offset') || '0');
        const list = squareList.slice(offsetNum, offsetNum + limitNum);
        return NextResponse.json({
          clients: list,
          total,
          source: 'square',
          warning: 'Database error; showing Square customers.',
        });
      }
      return NextResponse.json({
        clients: [],
        total: 0,
        error: clientsError.message,
        warning: 'Database error loading clients. Check connection and tables.',
      });
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

    // Combine client and user data (include Client Intelligence: source, LTV, visits)
    let clients = (clientsData || []).map((c: any) => {
      const user = usersMap[c.user_id] || {};
      const ltvCents = c.total_lifetime_value_cents ?? c.lifetime_value_cents ?? 0;
      const visits = c.total_visits ?? c.visit_count ?? 0;
      return {
        id: c.id,
        user_id: c.user_id,
        first_name: user.first_name || c.first_name || '',
        last_name: user.last_name || c.last_name || '',
        email: user.email || c.email,
        phone: user.phone || c.phone,
        date_of_birth: c.date_of_birth,
        created_at: c.created_at,
        last_visit: c.last_visit_date || c.last_visit_at,
        total_spent: ltvCents ? ltvCents / 100 : 0,
        visit_count: visits,
        is_vip: c.is_vip || false,
        source: c.source || c.referral_source || null,
      };
    });

    // Re-sort after joining with users data if sorting by name
    // (DB sort won't work properly since names come from users table)
    if (sortBy === 'name') {
      clients.sort((a: any, b: any) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase().trim();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase().trim();
        // Put empty names at the end
        if (!nameA && nameB) return 1;
        if (nameA && !nameB) return -1;
        return sortOrder === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      });
    }

    // When DB has no clients, load from Square so the list isn't empty
    const dbTotal = totalCount ?? 0;
    if (dbTotal === 0 && clients.length === 0) {
      const squareClients = await fetchAllSquareCustomers();
      if (squareClients.length > 0) {
        let squareList = squareClients;
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          squareList = squareList.filter(
            (c: any) =>
              c.first_name?.toLowerCase().includes(q) ||
              c.last_name?.toLowerCase().includes(q) ||
              c.email?.toLowerCase().includes(q)
          );
        }
        const total = squareList.length;
        const limitNum = parseInt(searchParams.get('limit') || '100');
        const offsetNum = parseInt(searchParams.get('offset') || '0');
        clients = squareList.slice(offsetNum, offsetNum + limitNum);
        return NextResponse.json({
          clients,
          total,
          source: 'square',
        });
      }
    }

    const res: { clients: any[]; total: number; square_configured?: boolean } = {
      clients,
      total: dbTotal,
    };
    if (clients.length === 0 && dbTotal === 0) {
      res.square_configured = isSquareConfigured();
    }
    return NextResponse.json(res);
  } catch (error) {
    console.error('Clients API error:', error);
    // Return 200 with empty list so the app keeps working
    return NextResponse.json({
      clients: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch clients',
      warning: 'Unable to load clients. You can still use the rest of the app.',
    });
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
    // Include name/email/phone directly on clients table for easier querying
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
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

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    // Get the client to find user_id
    const { data: client } = await supabase
      .from('clients')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Prepare update data (map camelCase to snake_case)
    const clientUpdate: any = {};
    const userUpdate: any = {};

    // Fields that go on clients table
    if (updateData.first_name || updateData.firstName) {
      clientUpdate.first_name = updateData.first_name || updateData.firstName;
      userUpdate.first_name = clientUpdate.first_name;
    }
    if (updateData.last_name || updateData.lastName) {
      clientUpdate.last_name = updateData.last_name || updateData.lastName;
      userUpdate.last_name = clientUpdate.last_name;
    }
    if (updateData.email !== undefined) {
      clientUpdate.email = updateData.email?.toLowerCase()?.trim() || null;
      userUpdate.email = clientUpdate.email;
    }
    if (updateData.phone !== undefined) {
      clientUpdate.phone = updateData.phone || null;
      userUpdate.phone = clientUpdate.phone;
    }
    if (updateData.date_of_birth !== undefined) clientUpdate.date_of_birth = updateData.date_of_birth;
    if (updateData.gender !== undefined) clientUpdate.gender = updateData.gender;
    if (updateData.address_line1 !== undefined) clientUpdate.address_line1 = updateData.address_line1;
    if (updateData.address_line2 !== undefined) clientUpdate.address_line2 = updateData.address_line2;
    if (updateData.city !== undefined) clientUpdate.city = updateData.city;
    if (updateData.state !== undefined) clientUpdate.state = updateData.state;
    if (updateData.postal_code !== undefined) clientUpdate.postal_code = updateData.postal_code;
    if (updateData.emergency_contact_name !== undefined) clientUpdate.emergency_contact_name = updateData.emergency_contact_name;
    if (updateData.emergency_contact_phone !== undefined) clientUpdate.emergency_contact_phone = updateData.emergency_contact_phone;
    if (updateData.referral_source !== undefined) clientUpdate.referral_source = updateData.referral_source;
    if (updateData.internal_notes !== undefined) clientUpdate.internal_notes = updateData.internal_notes;
    if (updateData.allergies_summary !== undefined) clientUpdate.allergies_summary = updateData.allergies_summary;
    if (updateData.medications_summary !== undefined) clientUpdate.medications_summary = updateData.medications_summary;
    if (updateData.medical_conditions_summary !== undefined) clientUpdate.medical_conditions_summary = updateData.medical_conditions_summary;
    if (updateData.is_vip !== undefined) clientUpdate.is_vip = updateData.is_vip;
    if (updateData.tags !== undefined) clientUpdate.tags = updateData.tags;

    // Update clients table
    if (Object.keys(clientUpdate).length > 0) {
      const { error: clientError } = await supabase
        .from('clients')
        .update(clientUpdate)
        .eq('id', id);

      if (clientError) {
        console.error('Client update error:', clientError);
        return NextResponse.json({ error: clientError.message }, { status: 500 });
      }
    }

    // Update users table if we have user data and a user_id
    if (client.user_id && Object.keys(userUpdate).length > 0) {
      await supabase
        .from('users')
        .update(userUpdate)
        .eq('id', client.user_id);
    }

    // Fetch updated client
    const { data: updatedClient } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    if (permanent) {
      // Permanent delete - only for Owner role (should be checked by middleware)
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Soft delete - mark as inactive/deleted
      const { error } = await supabase
        .from('clients')
        .update({ 
          is_active: false,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}

// Merge duplicate clients
export async function PATCH(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { action, primaryId, mergeIds } = body;

    if (action !== 'merge') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!primaryId || !mergeIds || !Array.isArray(mergeIds) || mergeIds.length === 0) {
      return NextResponse.json({ error: 'Primary ID and merge IDs required' }, { status: 400 });
    }

    // Get all clients to merge
    const { data: clientsToMerge } = await supabase
      .from('clients')
      .select('*')
      .in('id', [primaryId, ...mergeIds]);

    if (!clientsToMerge || clientsToMerge.length < 2) {
      return NextResponse.json({ error: 'Not enough clients found to merge' }, { status: 404 });
    }

    const primary = clientsToMerge.find(c => c.id === primaryId);
    if (!primary) {
      return NextResponse.json({ error: 'Primary client not found' }, { status: 404 });
    }

    // Merge data - take non-null values from other clients if primary is null
    const mergeClients = clientsToMerge.filter(c => c.id !== primaryId);
    const mergedData: any = { ...primary };

    for (const mc of mergeClients) {
      // Fill in missing data from merged clients
      if (!mergedData.phone && mc.phone) mergedData.phone = mc.phone;
      if (!mergedData.date_of_birth && mc.date_of_birth) mergedData.date_of_birth = mc.date_of_birth;
      if (!mergedData.address_line1 && mc.address_line1) mergedData.address_line1 = mc.address_line1;
      if (!mergedData.city && mc.city) mergedData.city = mc.city;
      if (!mergedData.state && mc.state) mergedData.state = mc.state;
      if (!mergedData.postal_code && mc.postal_code) mergedData.postal_code = mc.postal_code;
      
      // Combine visit counts and spending
      mergedData.visit_count = (mergedData.visit_count || 0) + (mc.visit_count || 0);
      mergedData.lifetime_value_cents = (mergedData.lifetime_value_cents || 0) + (mc.lifetime_value_cents || 0);
      
      // Combine tags
      if (mc.tags && Array.isArray(mc.tags)) {
        mergedData.tags = [...new Set([...(mergedData.tags || []), ...mc.tags])];
      }
      
      // Append notes
      if (mc.internal_notes) {
        mergedData.internal_notes = (mergedData.internal_notes || '') + 
          `\n\n[Merged from ${mc.first_name} ${mc.last_name}]: ${mc.internal_notes}`;
      }
    }

    // Update primary client with merged data
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        phone: mergedData.phone,
        date_of_birth: mergedData.date_of_birth,
        address_line1: mergedData.address_line1,
        city: mergedData.city,
        state: mergedData.state,
        postal_code: mergedData.postal_code,
        visit_count: mergedData.visit_count,
        lifetime_value_cents: mergedData.lifetime_value_cents,
        tags: mergedData.tags,
        internal_notes: mergedData.internal_notes,
      })
      .eq('id', primaryId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update appointments to point to primary client
    await supabase
      .from('appointments')
      .update({ client_id: primaryId })
      .in('client_id', mergeIds);

    // Soft delete merged clients
    await supabase
      .from('clients')
      .update({ 
        is_active: false,
        deleted_at: new Date().toISOString(),
        internal_notes: supabase.sql`COALESCE(internal_notes, '') || '\n[MERGED INTO ' || ${primaryId} || ']'`
      })
      .in('id', mergeIds);

    return NextResponse.json({ 
      success: true, 
      message: `Merged ${mergeIds.length} clients into primary client`,
      primaryId,
      mergedCount: mergeIds.length,
    });
  } catch (error) {
    console.error('Merge clients error:', error);
    return NextResponse.json({ error: 'Failed to merge clients' }, { status: 500 });
  }
}
