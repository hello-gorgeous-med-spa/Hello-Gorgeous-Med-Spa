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
    title: 'Owner & Nurse Practitioner',
    credentials: 'FNP-BC',
    bio: 'Danielle is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With years of experience in medical aesthetics, she specializes in creating natural, beautiful results.',
    philosophy: 'I believe in enhancing your natural beauty, not changing who you are.',
    headshot_url: '/images/team/danielle-glazier-alcala.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/1',
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
