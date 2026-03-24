import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

// Create supabase client inline
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Fallback provider data
const FALLBACK_PROVIDERS: Record<string, {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  title: string;
  credentials: string;
  bio: string;
  philosophy: string;
  headshot_url: string;
  booking_url: string;
  active: boolean;
}> = {
  'danielle': {
    id: 'b7e6f872-3628-418a-aefb-aca2101f7cb2',
    first_name: 'Danielle',
    last_name: 'Alcala',
    slug: 'danielle',
    title: 'Owner & Founder',
    credentials: 'Business Owner · Licensed Esthetician · RN Student · Phlebotomist · CMAA · CNA',
    bio: "Hi, I'm Danielle. I've owned and operated my med spa since 2017. I am nothing like you find out there—I practice and protect with heart. I don't believe in clients breaking the bank to make improvements on self-care. I care about my clients.\n\nIt all stemmed from the movie Steel Magnolias—family and friends getting together making a difference. It wasn't about how much money I could make. It never was.",
    philosophy: "Yes, there is a cost in doing business. But if you get to know me as much as I can get to know you, you will find a practitioner for life.",
    headshot_url: '/images/team/danielle-glazier-alcala.jpg',
    booking_url: 'https://hellogorgeousmedspa.com/book',
    active: true,
  },
  'ryan': {
    id: '47ab9361-4a68-4ab8-a860-c9c9fd64d26c',
    first_name: 'Ryan',
    last_name: 'Kent',
    slug: 'ryan',
    title: 'Medical Director & Nurse Practitioner',
    credentials: 'FNP-BC',
    bio: 'Ryan brings extensive medical experience to Hello Gorgeous Med Spa, specializing in weight loss management and hormone optimization.',
    philosophy: 'Healthcare should be personalized and accessible.',
    headshot_url: '/images/team/ryan-kent.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/2',
    active: true,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  
  try {
    const supabase = getSupabase();
    
    // If no database, use fallback
    if (!supabase) {
      const fallbackProvider = FALLBACK_PROVIDERS[param];
      if (fallbackProvider) {
        return NextResponse.json({
          provider: fallbackProvider,
          media: [],
          source: 'fallback',
        });
      }
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Try to get provider by slug first, then by ID
    let provider = null;
    
    // Try slug
    const { data: bySlug } = await supabase
      .from('providers')
      .select('*')
      .eq('slug', param)
      .eq('active', true)
      .single();
    
    if (bySlug) {
      provider = bySlug;
    } else {
      // Try ID
      const { data: byId } = await supabase
        .from('providers')
        .select('*')
        .eq('id', param)
        .eq('active', true)
        .single();
      
      provider = byId;
    }

    if (!provider) {
      // Use fallback
      const fallbackProvider = FALLBACK_PROVIDERS[param];
      if (fallbackProvider) {
        return NextResponse.json({
          provider: fallbackProvider,
          media: [],
          source: 'fallback',
        });
      }
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Get provider media
    const { data: media } = await supabase
      .from('provider_media')
      .select('*')
      .eq('provider_id', provider.id)
      .eq('is_active', true)
      .order('featured', { ascending: false })
      .order('display_order');

    return NextResponse.json({
      provider,
      media: media || [],
    });
  } catch (error) {
    console.error('Error in provider API:', error);
    
    // Return fallback on error
    const fallbackProvider = FALLBACK_PROVIDERS[param];
    if (fallbackProvider) {
      return NextResponse.json({
        provider: fallbackProvider,
        media: [],
        source: 'fallback',
      });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: governance fields (emergency_activation_flag, is_backup_candidate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param: id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: { emergency_activation_flag?: boolean; is_backup_candidate?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.emergency_activation_flag === 'boolean') updates.emergency_activation_flag = body.emergency_activation_flag;
  if (typeof body.is_backup_candidate === 'boolean') updates.is_backup_candidate = body.is_backup_candidate;

  if (Object.keys(updates).length === 1) {
    return NextResponse.json({ error: 'Provide at least one of emergency_activation_flag or is_backup_candidate' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('providers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[providers PATCH]', error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }

  return NextResponse.json({ provider: data });
}
