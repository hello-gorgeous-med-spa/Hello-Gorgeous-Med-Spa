// ============================================================
// API: GET PROVIDERS FOR A SERVICE
// Returns providers who can perform a specific service
// Checks database first, falls back to logic-based assignment
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// ============================================================
// ONLY THESE TWO PROVIDERS - Ryan Kent and Danielle Alcala
// NO HARDCODED SCHEDULES - Always fetch from database
// ============================================================
const PROVIDER_METADATA = [
  {
    id: 'ryan-kent',
    name: 'Ryan Kent',
    title: 'FNP-BC',
    color: '#3b82f6',
    serviceKeywords: ['botox', 'filler', 'jeuveau', 'dysport', 'lip', 'semaglutide', 'tirzepatide', 'retatrutide', 'weight', 'iv', 'vitamin', 'prp', 'pellet', 'hormone', 'bhrt', 'medical', 'trigger', 'kybella', 'consult', 'laser', 'ipl', 'photofacial', 'anteage', 'hydra', 'peel', 'facial', 'skin'],
  },
  {
    id: 'danielle-alcala',
    name: 'Danielle Alcala',
    title: 'RN-S, Owner',
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
        const formattedProviders = providers
          .filter((p: any) => isAllowedProvider(`${p.users.first_name} ${p.users.last_name}`))
          .map((p: any) => {
            // Build schedule object
            const providerSchedules = schedules?.filter((s: any) => s.provider_id === p.id) || [];
            const schedule: any = {};
            for (let day = 0; day <= 6; day++) {
              const daySchedule = providerSchedules.find((s: any) => s.day_of_week === day);
              if (daySchedule && daySchedule.is_working) {
                schedule[day] = {
                  start: daySchedule.start_time?.slice(0, 5),
                  end: daySchedule.end_time?.slice(0, 5),
                };
              } else {
                schedule[day] = null;
              }
            }

            return {
              id: p.id,
              name: `${p.users.first_name} ${p.users.last_name}`,
              title: p.credentials || 'Provider',
              color: p.color_hex || '#EC4899',
              schedule,
            };
          });

        // If we have allowed providers from DB, return them
        if (formattedProviders.length > 0) {
          return NextResponse.json({ providers: formattedProviders, source: 'database' });
        }
      }
    }

    // Fallback: Use keyword matching but ALWAYS fetch schedules from database
    const slug = service?.slug || serviceSlug || '';
    const matchingProviders = PROVIDER_METADATA.filter((provider) =>
      provider.serviceKeywords.some((keyword) => slug.toLowerCase().includes(keyword))
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

    // Match fallback providers to database providers and get their schedules
    const cleanProviders = providers.map((provider) => {
      // Find matching DB provider by name
      const dbProvider = dbProviders?.find((p: any) => {
        const fullName = `${p.users.first_name} ${p.users.last_name}`.toLowerCase();
        return fullName.includes(provider.name.split(' ')[0].toLowerCase());
      });

      // Build schedule from database (or empty if not found)
      const schedule: { [day: number]: { start: string; end: string } | null } = {
        0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
      };

      if (dbProvider && allSchedules) {
        const providerSchedules = allSchedules.filter((s: any) => s.provider_id === dbProvider.id);
        for (const s of providerSchedules) {
          if (s.is_working && s.start_time && s.end_time) {
            schedule[s.day_of_week] = {
              start: s.start_time.slice(0, 5),
              end: s.end_time.slice(0, 5),
            };
          }
        }
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
    
    // On error, return providers with EMPTY schedules (no hardcoded availability)
    // This prevents booking on days when we can't verify the schedule
    const cleanProviders = PROVIDER_METADATA.map(({ serviceKeywords, ...rest }) => ({
      ...rest,
      schedule: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }
    }));
    return NextResponse.json({ 
      providers: cleanProviders, 
      source: 'error-fallback',
      error: 'Could not load schedules - please contact us to book'
    });
  }
}
