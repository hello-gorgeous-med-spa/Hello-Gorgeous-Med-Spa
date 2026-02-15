// ============================================================
// API: WAITLIST MANAGEMENT
// Aesthetic Record-style waitlist system
// Turn cancellations into conversions with smart waitlist
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch waitlist entries with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const service_id = searchParams.get('service_id');
  const provider_id = searchParams.get('provider_id');
  const limit = parseInt(searchParams.get('limit') || '50');

  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    let query = supabase
      .from('waitlist')
      .select(`
        *,
        clients:client_id (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        services:service_id (
          id,
          name
        ),
        providers:provider_id (
          id,
          users (
            first_name,
            last_name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }
    if (service_id) {
      query = query.eq('service_id', service_id);
    }
    if (provider_id) {
      query = query.eq('provider_id', provider_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Waitlist fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data for easier consumption
    const entries = (data || []).map((entry: any) => ({
      ...entry,
      client_name: entry.clients 
        ? `${entry.clients.first_name || ''} ${entry.clients.last_name || ''}`.trim() 
        : 'Unknown',
      client_email: entry.clients?.email,
      client_phone: entry.clients?.phone,
      service_name: entry.services?.name,
      provider_name: entry.providers?.users
        ? `${entry.providers.users.first_name || ''} ${entry.providers.users.last_name || ''}`.trim()
        : null,
    }));

    // Stats
    const stats = {
      total: entries.length,
      waiting: entries.filter((e: any) => e.status === 'waiting').length,
      contacted: entries.filter((e: any) => e.status === 'contacted').length,
      booked: entries.filter((e: any) => e.status === 'booked').length,
    };

    return NextResponse.json({ entries, stats });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}

// POST - Add new entry to waitlist
export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      service_id,
      provider_id,
      preferred_days,
      preferred_time,
      notes,
      card_on_file,
      priority,
    } = body;

    if (!client_id) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        client_id,
        service_id: service_id || null,
        provider_id: provider_id || null,
        preferred_days: preferred_days || [],
        preferred_time: preferred_time || 'any',
        notes: notes || null,
        card_on_file: card_on_file || false,
        priority: priority || 'normal',
        status: 'waiting',
      })
      .select()
      .single();

    if (error) {
      console.error('Waitlist insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error) {
    console.error('Waitlist POST error:', error);
    return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 });
  }
}

// PUT - Update waitlist entry
export async function PUT(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Add timestamps for status changes
    if (updates.status === 'contacted' && !updates.contacted_at) {
      updates.contacted_at = new Date().toISOString();
    }
    if (updates.status === 'booked' && !updates.booked_at) {
      updates.booked_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('waitlist')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Waitlist update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error) {
    console.error('Waitlist PUT error:', error);
    return NextResponse.json({ error: 'Failed to update waitlist entry' }, { status: 500 });
  }
}

// DELETE - Remove from waitlist
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Waitlist delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove from waitlist' }, { status: 500 });
  }
}
