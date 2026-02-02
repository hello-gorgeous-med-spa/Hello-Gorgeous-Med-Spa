// ============================================================
// MEMBERSHIPS API - Package & Membership Management
// Track units, expiration, and usage
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/memberships - Get client memberships
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('clientId');
  const membershipId = searchParams.get('id');

  try {
    // Try to fetch from memberships table
    let query = supabase
      .from('client_memberships')
      .select(`
        *,
        membership:memberships(id, name, description, type, price_cents)
      `)
      .eq('status', 'active');

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (membershipId) {
      query = query.eq('id', membershipId);
    }

    const { data, error } = await query;

    if (error) {
      // Table might not exist - return empty
      console.log('Memberships query error (table may not exist):', error.message);
      return NextResponse.json({ memberships: [], membership: null });
    }

    // Transform data
    const memberships = (data || []).map((m: any) => ({
      id: m.id,
      client_id: m.client_id,
      name: m.membership?.name || m.name || 'Membership',
      type: m.membership?.type || m.type || 'package',
      status: m.status,
      units_total: m.units_total || 0,
      units_remaining: m.units_remaining || 0,
      units_used: (m.units_total || 0) - (m.units_remaining || 0),
      started_at: m.started_at || m.created_at,
      expires_at: m.expires_at,
      auto_renew: m.auto_renew || false,
      price_cents: m.membership?.price_cents || m.price_cents,
    }));

    return NextResponse.json({ 
      memberships,
      membership: memberships[0] || null,
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json({ memberships: [], membership: null });
  }
}

// POST /api/memberships - Create or assign membership
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      membership_id,
      units_total,
      expires_at,
      auto_renew,
      created_by,
    } = body;

    if (!client_id) {
      return NextResponse.json({ error: 'client_id required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('client_memberships')
      .insert({
        client_id,
        membership_id: membership_id || null,
        units_total: units_total || 0,
        units_remaining: units_total || 0,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expires_at || null,
        auto_renew: auto_renew || false,
        created_by,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ membership: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating membership:', error);
    return NextResponse.json({ error: 'Failed to create membership' }, { status: 500 });
  }
}

// PUT /api/memberships - Use units from membership
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      id,
      action, // 'use_units', 'add_units', 'cancel'
      units,
      appointment_id,
      used_by,
    } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'id and action required' }, { status: 400 });
    }

    // Get current membership
    const { data: membership, error: fetchError } = await supabase
      .from('client_memberships')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case 'use_units':
        if (membership.units_remaining < units) {
          return NextResponse.json({ 
            error: 'Insufficient units',
            available: membership.units_remaining,
            requested: units,
          }, { status: 400 });
        }
        updateData.units_remaining = membership.units_remaining - units;
        
        // Log usage
        await supabase
          .from('membership_usage_log')
          .insert({
            client_membership_id: id,
            units_used: units,
            appointment_id: appointment_id || null,
            used_by,
            used_at: new Date().toISOString(),
          });
        break;

      case 'add_units':
        updateData.units_remaining = membership.units_remaining + units;
        updateData.units_total = membership.units_total + units;
        break;

      case 'cancel':
        updateData.status = 'cancelled';
        updateData.cancelled_at = new Date().toISOString();
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('client_memberships')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      membership: data,
      message: action === 'use_units' 
        ? `Used ${units} units. ${data.units_remaining} remaining.`
        : action === 'add_units'
        ? `Added ${units} units.`
        : 'Membership updated.',
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    return NextResponse.json({ error: 'Failed to update membership' }, { status: 500 });
  }
}
