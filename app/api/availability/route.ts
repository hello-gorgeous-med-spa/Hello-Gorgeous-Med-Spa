// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: AVAILABILITY - Dynamic slot generation based on provider schedules
// This is the SOURCE OF TRUTH for bookable time slots
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
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// NO HARDCODED SCHEDULES - Always use database as source of truth
// If schedule not found in database, provider is NOT available

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_TO_NAME: Record<string, string> = {
  'ryan-kent': 'Ryan Kent',
  'danielle-alcala': 'Danielle Alcala',
};

/** If provider_id is a slug (e.g. from booking widget), resolve to real provider UUID. */
async function resolveProviderId(supabase: NonNullable<ReturnType<typeof getSupabase>>, providerId: string): Promise<string> {
  if (UUID_REGEX.test(providerId)) return providerId;
  const name = SLUG_TO_NAME[providerId.toLowerCase()];
  if (!name) return providerId;
  const { data: providers } = await supabase
    .from('providers')
    .select('id, users!inner(first_name, last_name)');
  const match = (providers as any[])?.find((p: any) => {
    if (!p?.users) return false;
    const full = `${String(p.users.first_name).trim()} ${String(p.users.last_name).trim()}`;
    return full.toLowerCase() === name.toLowerCase();
  });
  return match?.id ?? providerId;
}

interface TimeSlot {
  time: string; // "9:00 AM"
  datetime: string; // ISO string
  available: boolean;
  reason?: string; // Why unavailable
}

interface AvailabilityResponse {
  date: string;
  provider_id: string;
  provider_name?: string;
  is_working: boolean;
  working_hours?: { start: string; end: string };
  slots: TimeSlot[];
  service_duration: number;
}

// Convert 24h time string to minutes from midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes from midnight to 12h format
function minutesToDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Generate time slots for a given schedule
function generateSlots(
  date: string,
  startTime: string,
  endTime: string,
  serviceDuration: number,
  bufferMinutes: number,
  existingAppointments: any[]
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const slotInterval = 15; // Generate slots every 15 minutes
  
  // Convert existing appointments to blocked time ranges
  const blockedRanges = existingAppointments
    .filter(apt => apt.status !== 'cancelled' && apt.status !== 'no_show')
    .map(apt => {
      const aptStart = new Date(apt.starts_at);
      const aptEnd = apt.ends_at ? new Date(apt.ends_at) : new Date(aptStart.getTime() + 30 * 60000);
      return {
        start: aptStart.getHours() * 60 + aptStart.getMinutes(),
        end: aptEnd.getHours() * 60 + aptEnd.getMinutes(),
      };
    });

  for (let mins = startMinutes; mins <= endMinutes - serviceDuration; mins += slotInterval) {
    const slotStart = mins;
    const slotEnd = mins + serviceDuration;
    
    // Check if this slot overlaps with any existing appointment
    const isBlocked = blockedRanges.some(range => {
      // Slot overlaps if: slotStart < range.end AND slotEnd > range.start
      return slotStart < range.end && slotEnd > range.start;
    });

    // Create datetime for this slot
    const slotDate = new Date(date);
    slotDate.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
    
    // Check if slot is in the past
    const now = new Date();
    const isPast = slotDate < now;

    slots.push({
      time: minutesToDisplay(mins),
      datetime: slotDate.toISOString(),
      available: !isBlocked && !isPast,
      reason: isPast ? 'past' : isBlocked ? 'booked' : undefined,
    });
  }

  return slots;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('provider_id');
  const date = searchParams.get('date'); // YYYY-MM-DD format
  const serviceDuration = parseInt(searchParams.get('duration') || '30');
  const bufferMinutes = parseInt(searchParams.get('buffer') || '0');

  if (!providerId || !date) {
    return NextResponse.json(
      { error: 'provider_id and date are required' },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const dateObj = new Date(date + 'T00:00:00');
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

  // Resolve slug (e.g. "ryan-kent") to real provider UUID so schedule lookup works
  let resolvedProviderId = providerId;
  if (supabase && !UUID_REGEX.test(providerId)) {
    resolvedProviderId = await resolveProviderId(supabase, providerId);
  }

  let schedule: any = null;
  let existingAppointments: any[] = [];
  let providerName = '';

  if (supabase) {
    try {
      // Fetch provider schedule for this day (use resolved UUID)
      const { data: scheduleData } = await supabase
        .from('provider_schedules')
        .select('*')
        .eq('provider_id', resolvedProviderId)
        .eq('day_of_week', dayOfWeek)
        .single();

      if (scheduleData) {
        schedule = scheduleData;
      }

      // Fetch existing appointments for this provider on this date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, starts_at, ends_at, status')
        .eq('provider_id', resolvedProviderId)
        .gte('starts_at', `${date}T00:00:00`)
        .lt('starts_at', `${date}T23:59:59`);

      if (appointments) {
        existingAppointments = appointments;
      }

      // Get provider name
      const { data: provider } = await supabase
        .from('providers')
        .select('users(first_name, last_name)')
        .eq('id', resolvedProviderId)
        .single();

      if (provider?.users) {
        providerName = `${provider.users.first_name} ${provider.users.last_name}`;
      }
    } catch (error) {
      console.error('Error fetching availability data:', error);
    }
  }

  // NO FALLBACK SCHEDULES - If not found in database, provider is NOT working
  // This ensures the admin schedule settings are always respected
  if (!schedule) {
    console.log(`No schedule found for provider ${resolvedProviderId} on day ${dayOfWeek} - marking as not working`);
    schedule = {
      day_of_week: dayOfWeek,
      start_time: null,
      end_time: null,
      is_working: false,
    };
  }

  // If provider is not working this day, return empty slots
  if (!schedule.is_working || !schedule.start_time || !schedule.end_time) {
    const response: AvailabilityResponse = {
      date,
      provider_id: resolvedProviderId,
      provider_name: providerName,
      is_working: false,
      slots: [],
      service_duration: serviceDuration,
    };
    return NextResponse.json(response);
  }

  // Generate available slots
  const slots = generateSlots(
    date,
    schedule.start_time,
    schedule.end_time,
    serviceDuration,
    bufferMinutes,
    existingAppointments
  );

  const response: AvailabilityResponse = {
    date,
    provider_id: resolvedProviderId,
    provider_name: providerName,
    is_working: true,
    working_hours: {
      start: schedule.start_time,
      end: schedule.end_time,
    },
    slots,
    service_duration: serviceDuration,
  };

  return NextResponse.json(response);
}
