// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: PROVIDER SCHEDULES - Manage provider working hours
// These schedules directly control booking availability
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
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Default schedules
const DEFAULT_SCHEDULE = [
  { day_of_week: 0, day_name: 'Sunday', is_working: false, start_time: null, end_time: null },
  { day_of_week: 1, day_name: 'Monday', is_working: true, start_time: '09:00', end_time: '17:00' },
  { day_of_week: 2, day_name: 'Tuesday', is_working: true, start_time: '09:00', end_time: '17:00' },
  { day_of_week: 3, day_name: 'Wednesday', is_working: true, start_time: '09:00', end_time: '17:00' },
  { day_of_week: 4, day_name: 'Thursday', is_working: true, start_time: '09:00', end_time: '17:00' },
  { day_of_week: 5, day_name: 'Friday', is_working: true, start_time: '09:00', end_time: '17:00' },
  { day_of_week: 6, day_name: 'Saturday', is_working: false, start_time: null, end_time: null },
];

// GET /api/providers/[id]/schedules - Get provider's weekly schedule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const providerId = params.id;
  const supabase = getSupabase();

  if (!supabase) {
    // Return default schedule if no DB
    return NextResponse.json({
      provider_id: providerId,
      schedules: DEFAULT_SCHEDULE,
    });
  }

  try {
    const { data: schedules, error } = await supabase
      .from('provider_schedules')
      .select('*')
      .eq('provider_id', providerId)
      .order('day_of_week');

    if (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json({
        provider_id: providerId,
        schedules: DEFAULT_SCHEDULE,
      });
    }

    // If no schedules exist, return defaults
    if (!schedules || schedules.length === 0) {
      return NextResponse.json({
        provider_id: providerId,
        schedules: DEFAULT_SCHEDULE,
      });
    }

    // Add day names to the response
    const schedulesWithNames = schedules.map(s => ({
      ...s,
      day_name: DAY_NAMES[s.day_of_week],
    }));

    // Fill in missing days with defaults
    const fullSchedule = DAY_NAMES.map((dayName, index) => {
      const existing = schedulesWithNames.find(s => s.day_of_week === index);
      if (existing) return existing;
      return {
        day_of_week: index,
        day_name: dayName,
        is_working: false,
        start_time: null,
        end_time: null,
        provider_id: providerId,
      };
    });

    return NextResponse.json({
      provider_id: providerId,
      schedules: fullSchedule,
    });
  } catch (error) {
    console.error('Schedules GET error:', error);
    return NextResponse.json({
      provider_id: providerId,
      schedules: DEFAULT_SCHEDULE,
    });
  }
}

// PUT /api/providers/[id]/schedules - Update provider's schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const providerId = params.id;
  const body = await request.json();
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    // Body should be an array of schedules or a single schedule
    const schedules = Array.isArray(body) ? body : [body];

    for (const schedule of schedules) {
      const { day_of_week, start_time, end_time, is_working } = schedule;

      if (day_of_week === undefined || day_of_week < 0 || day_of_week > 6) {
        continue; // Skip invalid days
      }

      // Upsert the schedule
      const { error } = await supabase
        .from('provider_schedules')
        .upsert({
          provider_id: providerId,
          day_of_week,
          start_time: is_working ? start_time : null,
          end_time: is_working ? end_time : null,
          is_working: is_working ?? true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'provider_id,day_of_week',
        });

      if (error) {
        console.error('Error upserting schedule:', error);
        return NextResponse.json(
          { error: `Failed to update schedule for day ${day_of_week}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Schedules updated' });
  } catch (error) {
    console.error('Schedules PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update schedules' },
      { status: 500 }
    );
  }
}

// POST /api/providers/[id]/schedules - Initialize default schedule for provider
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const providerId = params.id;
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    // Create default schedule for all 7 days
    const schedules = DEFAULT_SCHEDULE.map(s => ({
      provider_id: providerId,
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
      is_working: s.is_working,
    }));

    const { error } = await supabase
      .from('provider_schedules')
      .upsert(schedules, {
        onConflict: 'provider_id,day_of_week',
      });

    if (error) {
      console.error('Error creating default schedules:', error);
      return NextResponse.json(
        { error: 'Failed to create schedules' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Default schedules created',
      schedules: DEFAULT_SCHEDULE,
    });
  } catch (error) {
    console.error('Schedules POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create schedules' },
      { status: 500 }
    );
  }
}
