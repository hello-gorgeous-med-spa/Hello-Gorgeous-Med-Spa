// ============================================================
// API: PROVIDER SCHEDULES
// Manage provider working hours
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Default schedule template
const DEFAULT_SCHEDULE = {
  monday: { enabled: true, start: '09:00', end: '17:00' },
  tuesday: { enabled: true, start: '09:00', end: '17:00' },
  wednesday: { enabled: true, start: '09:00', end: '17:00' },
  thursday: { enabled: true, start: '09:00', end: '17:00' },
  friday: { enabled: true, start: '09:00', end: '15:00' },
  saturday: { enabled: false, start: '10:00', end: '14:00' },
  sunday: { enabled: false, start: '', end: '' },
};

// GET /api/provider-schedules - Get all provider schedules
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    let query = supabase
      .from('provider_schedules')
      .select(`
        id,
        provider_id,
        schedule,
        providers!inner(id, credentials, users(first_name, last_name))
      `);

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    const { data: schedules, error } = await query;

    if (error) {
      console.error('Schedules fetch error:', error);
      return NextResponse.json({ schedules: [] });
    }

    // Format response
    const formatted = (schedules || []).map(s => ({
      id: s.id,
      provider_id: s.provider_id,
      provider_name: `${s.providers?.users?.first_name || ''} ${s.providers?.users?.last_name || ''}`.trim(),
      credentials: s.providers?.credentials,
      schedule: s.schedule || DEFAULT_SCHEDULE,
    }));

    return NextResponse.json({ schedules: formatted });
  } catch (error) {
    console.error('Schedules GET error:', error);
    return NextResponse.json({ schedules: [] });
  }
}

// POST /api/provider-schedules - Create schedule for provider
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { provider_id, schedule } = body;

    if (!provider_id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    // Check if schedule exists
    const { data: existing } = await supabase
      .from('provider_schedules')
      .select('id')
      .eq('provider_id', provider_id)
      .single();

    if (existing) {
      // Update instead
      const { error } = await supabase
        .from('provider_schedules')
        .update({ schedule: schedule || DEFAULT_SCHEDULE })
        .eq('id', existing.id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Schedule updated' });
    }

    // Create new
    const { data: newSchedule, error } = await supabase
      .from('provider_schedules')
      .insert({
        provider_id,
        schedule: schedule || DEFAULT_SCHEDULE,
      })
      .select()
      .single();

    if (error) {
      console.error('Schedule create error:', error);
      return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }

    return NextResponse.json({ success: true, schedule: newSchedule });
  } catch (error) {
    console.error('Schedules POST error:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

// PUT /api/provider-schedules - Update provider schedule
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { provider_id, schedule } = body;

    if (!provider_id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    // Upsert - update if exists, create if not
    const { data: existing } = await supabase
      .from('provider_schedules')
      .select('id')
      .eq('provider_id', provider_id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('provider_schedules')
        .update({ 
          schedule,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('provider_schedules')
        .insert({
          provider_id,
          schedule,
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: 'Schedule saved' });
  } catch (error) {
    console.error('Schedules PUT error:', error);
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 });
  }
}
