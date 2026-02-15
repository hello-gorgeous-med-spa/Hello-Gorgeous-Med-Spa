// ============================================================
// API: GET PROVIDERS FOR A SERVICE
// Returns providers who can perform a specific service
// Checks database first, falls back to logic-based assignment
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from '@/lib/provider-credentials';

// ============================================================
// ONLY THESE TWO PROVIDERS - Ryan Kent and Danielle Alcala
// NO HARDCODED SCHEDULES - Always fetch from database
// ============================================================
const PROVIDER_METADATA = [
  {
    id: 'ryan-kent',
    name: 'Ryan Kent',
    title: RYAN_CREDENTIALS,
    color: '#3b82f6',
    serviceKeywords: ['botox', 'filler', 'jeuveau', 'dysport', 'lip', 'semaglutide', 'tirzepatide', 'retatrutide', 'weight', 'iv', 'vitamin', 'prp', 'pellet', 'hormone', 'bhrt', 'medical', 'trigger', 'kybella', 'consult', 'laser', 'ipl', 'photofacial', 'anteage', 'hydra', 'peel', 'facial', 'skin'],
  },
  {
    id: 'danielle-alcala',
    name: 'Danielle Alcala',
    title: DANIELLE_CREDENTIALS,
    color: '#ec4899',
    serviceKeywords: ['lash', 'brow', 'facial', 'dermaplanning', 'hydra', 'peel', 'lamination', 'wax', 'extension', 'lift', 'tint', 'glow', 'geneo', 'frequency', 'botox', 'filler', 'lip', 'consult'],
  },
];

// Helper to check if a provider name is allowed
function isAllowedProvider(name: string): boolean {
  const n = name.toLowerCase();
  return (
    (n.includes('ryan') && n.includes('kent')) ||
    (n.includes('danielle') && (n.includes('alcala') || n.includes('glazier')))
  );
}

// Helper to fetch schedules from database for a provider
async function getProviderScheduleFromDB(supabase: any, providerId: string): Promise<{ [day: number]: { start: string; end: string } | null }> {
  const { data: schedules } = await supabase
    .from('provider_schedules')
    .select('*')
    .eq('provider_id', providerId);

  const schedule: { [day: number]: { start: string; end: string } | null } = {
    0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
  };

  if (schedules && schedules.length > 0) {
    for (const s of schedules) {
      if (s.is_working && s.start_time && s.end_time) {
        schedule[s.day_of_week] = {
          start: s.start_time.slice(0, 5),
          end: s.end_time.slice(0, 5),
        };
      }
    }
  }

  return schedule;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');
  const serviceSlug = searchParams.get('serviceSlug');

  if (!serviceId && !serviceSlug) {
    return NextResponse.json(
      { error: 'serviceId or serviceSlug required' },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerSupabaseClient();

    // Try to get service from database
    let service = null;
    if (serviceId) {
      const { data } = await supabase
        .from('services')
        .select('id, slug, provider_ids')
        .eq('id', serviceId)
        .single();
      service = data;
    } else if (serviceSlug) {
      const { data } = await supabase
        .from('services')
        .select('id, slug, provider_ids')
        .eq('slug', serviceSlug)
        .single();
      service = data;
    }

    // If service has provider_ids in database, fetch those providers
    if (service?.provider_ids && service.provider_ids.length > 0) {
      const { data: providers } = await supabase
        .from('providers')
        .select(`
          id,
          color_hex,
          users!inner(first_name, last_name),
          credentials
        `)
        .in('id', service.provider_ids);

      // Get schedules for these providers
      const { data: schedules } = await supabase
        .from('provider_schedules')
        .select('*')
        .in('provider_id', service.provider_ids);

      if (providers && providers.length > 0) {
        const DEFAULT_SCHEDULE_DB: { [day: number]: { start: string; end: string } | null } = {
          0: null, 1: { start: '09:00', end: '17:00' }, 2: { start: '09:00', end: '17:00' },
          3: { start: '09:00', end: '17:00' }, 4: { start: '09:00', end: '17:00' },
          5: { start: '09:00', end: '15:00' }, 6: null,
        };
        const formattedProviders = providers
          .filter((p: any) => isAllowedProvider(`${p.users.first_name} ${p.users.last_name}`))
          .map((p: any) => {
            const providerSchedules = schedules?.filter((s: any) => s.provider_id === p.id) || [];
            const schedule: any = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
            for (let day = 0; day <= 6; day++) {
              const daySchedule = providerSchedules.find((s: any) => s.day_of_week === day);
              if (daySchedule?.is_working && daySchedule?.start_time && daySchedule?.end_time) {
                const start = String(daySchedule.start_time).slice(0, 5);
                const end = String(daySchedule.end_time).slice(0, 5);
                if (start && end) schedule[day] = { start, end };
              }
            }
            // If no valid working days in DB, use default so booking still works
            const hasAny = Object.values(schedule).some((v) => v !== null);
            const finalSchedule = hasAny ? schedule : DEFAULT_SCHEDULE_DB;

            return {
              id: p.id,
              name: `${p.users.first_name} ${p.users.last_name}`,
              title: p.credentials || 'Provider',
              color: p.color_hex || '#EC4899',
              schedule: finalSchedule,
            };
          });

        if (formattedProviders.length > 0) {
          return NextResponse.json({ providers: formattedProviders, source: 'database' });
        }
      }
    }

    // Fallback: Use keyword matching but ALWAYS fetch schedules from database
    const slug = (service?.slug || serviceSlug || '').toLowerCase();

    // Lash Spa services (full set, fill, lash perm & tint, mini fill) — Danielle only
    const isLashService = slug.includes('lash');
    if (isLashService) {
      const danielleOnly = PROVIDER_METADATA.filter((p) => p.name.includes('Danielle'));
      if (danielleOnly.length > 0) {
        const providers = danielleOnly;
        const { data: dbProviders } = await supabase
          .from('providers')
          .select(`id, color_hex, users!inner(first_name, last_name), credentials`);

        const { data: allSchedules } = await supabase
          .from('provider_schedules')
          .select('*');

        const DEFAULT_SCHEDULE: { [day: number]: { start: string; end: string } | null } = {
          0: null, 1: { start: '09:00', end: '17:00' }, 2: { start: '09:00', end: '17:00' },
          3: { start: '09:00', end: '17:00' }, 4: { start: '09:00', end: '17:00' },
          5: { start: '09:00', end: '15:00' }, 6: null,
        };

        function hasValidWorkingDays(s: { [k: number]: { start: string; end: string } | null }) {
          return Object.values(s).some((v) => v !== null && v?.start && v?.end);
        }

        const cleanProviders = providers.map((provider) => {
          const wantFirst = provider.name.split(' ')[0]?.toLowerCase() || '';
          const wantLast = provider.name.split(' ').slice(1).join(' ').toLowerCase() || '';
          const dbProvider = dbProviders?.find((p: any) => {
            const first = String(p.users?.first_name ?? '').trim().toLowerCase();
            const last = String(p.users?.last_name ?? '').trim().toLowerCase();
            return first === wantFirst && last === wantLast;
          });
          let schedule: { [day: number]: { start: string; end: string } | null } = {
            0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null,
          };
          if (dbProvider && allSchedules) {
            const providerSchedules = allSchedules.filter((s: any) => s.provider_id === dbProvider.id);
            for (const s of providerSchedules) {
              if (s.is_working && s.start_time && s.end_time) {
                const start = String(s.start_time).slice(0, 5);
                const end = String(s.end_time).slice(0, 5);
                if (start && end) schedule[s.day_of_week] = { start, end };
              }
            }
          }
          if (!hasValidWorkingDays(schedule)) schedule = { ...DEFAULT_SCHEDULE };
          return {
            id: dbProvider?.id || provider.id,
            name: dbProvider ? `${dbProvider.users.first_name} ${dbProvider.users.last_name}` : provider.name,
            title: dbProvider?.credentials || provider.title,
            color: dbProvider?.color_hex || provider.color,
            schedule,
          };
        });

        return NextResponse.json({ providers: cleanProviders, source: 'lash-danielle-only' });
      }
    }

    const matchingProviders = PROVIDER_METADATA.filter((provider) =>
      provider.serviceKeywords.some((keyword) => slug.includes(keyword))
    );

    // If no matches, return all providers
    const providers = matchingProviders.length > 0 ? matchingProviders : PROVIDER_METADATA;

    // Fetch all providers from database to get their real IDs and schedules
    const { data: dbProviders } = await supabase
      .from('providers')
      .select(`
        id,
        color_hex,
        users!inner(first_name, last_name),
        credentials
      `);

    // Fetch ALL provider schedules
    const { data: allSchedules } = await supabase
      .from('provider_schedules')
      .select('*');

    // Default schedule (Mon-Thu 9-5, Fri 9-3) - used when no valid DB schedule exists
    const DEFAULT_SCHEDULE: { [day: number]: { start: string; end: string } | null } = {
      0: null, // Sunday - closed
      1: { start: '09:00', end: '17:00' }, // Monday
      2: { start: '09:00', end: '17:00' }, // Tuesday
      3: { start: '09:00', end: '17:00' }, // Wednesday
      4: { start: '09:00', end: '17:00' }, // Thursday
      5: { start: '09:00', end: '15:00' }, // Friday (9-3)
      6: null, // Saturday - closed
    };

    function hasValidWorkingDays(schedule: { [day: number]: { start: string; end: string } | null }): boolean {
      return Object.values(schedule).some((v) => v !== null && v.start && v.end);
    }

    // Match fallback providers to database providers and get their schedules
    const cleanProviders = providers.map((provider) => {
      // Find matching DB provider by full name (so Ryan Kent -> real UUID)
      const wantFirst = provider.name.split(' ')[0]?.toLowerCase() || '';
      const wantLast = provider.name.split(' ').slice(1).join(' ').toLowerCase() || '';
      const dbProvider = dbProviders?.find((p: any) => {
        const first = String(p.users?.first_name ?? '').trim().toLowerCase();
        const last = String(p.users?.last_name ?? '').trim().toLowerCase();
        return first === wantFirst && last === wantLast;
      });

      // Build schedule from database 
      let schedule: { [day: number]: { start: string; end: string } | null } = {
        0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
      };
      let hasDBSchedule = false;

      if (dbProvider && allSchedules) {
        const providerSchedules = allSchedules.filter((s: any) => s.provider_id === dbProvider.id);
        for (const s of providerSchedules) {
          if (s.is_working && s.start_time && s.end_time) {
            const start = String(s.start_time).slice(0, 5);
            const end = String(s.end_time).slice(0, 5);
            if (start && end) {
              schedule[s.day_of_week] = { start, end };
              hasDBSchedule = true;
            }
          }
        }
      }

      // If no valid working days from DB, use default business hours so booking works
      if (!hasDBSchedule || !hasValidWorkingDays(schedule)) {
        schedule = { ...DEFAULT_SCHEDULE };
      }

      return {
        id: dbProvider?.id || provider.id,
        name: dbProvider ? `${dbProvider.users.first_name} ${dbProvider.users.last_name}` : provider.name,
        title: dbProvider?.credentials || provider.title,
        color: dbProvider?.color_hex || provider.color,
        schedule,
      };
    });

    return NextResponse.json({ providers: cleanProviders, source: 'database-fallback' });
  } catch (error) {
    console.error('Error fetching providers:', error);
    
    // On error, return providers with DEFAULT business hours so clients can still book
    const DEFAULT_SCHEDULE = {
      0: null, // Sunday
      1: { start: '09:00', end: '17:00' }, // Monday
      2: { start: '09:00', end: '17:00' }, // Tuesday
      3: { start: '09:00', end: '17:00' }, // Wednesday
      4: { start: '09:00', end: '17:00' }, // Thursday
      5: { start: '09:00', end: '15:00' }, // Friday
      6: null, // Saturday
    };
    
    const cleanProviders = PROVIDER_METADATA.map(({ serviceKeywords, ...rest }) => ({
      ...rest,
      schedule: DEFAULT_SCHEDULE
    }));
    return NextResponse.json({ 
      providers: cleanProviders, 
      source: 'error-fallback'
    });
  }
}
