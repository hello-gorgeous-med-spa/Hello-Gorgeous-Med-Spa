import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Map existing providers table fields to our expected format
function mapProvider(p: any) {
  return {
    id: p.id,
    name: p.display_name || `${p.first_name} ${p.last_name}`,
    slug: p.slug,
    credentials: p.credentials,
    short_bio: p.short_bio,
    full_bio: p.bio || p.short_bio,
    philosophy: p.philosophy,
    headshot_url: p.headshot_url,
    intro_video_url: p.intro_video_url,
    booking_url: p.booking_url,
    is_active: p.is_active,
    display_order: p.id === 'b7e6f872-3628-418a-aefb-aca2101f7cb2' ? 1 : 2, // Danielle first
    tagline: p.tagline,
  };
}

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { searchParams } = new URL(request.url);
  
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  const includeMedia = searchParams.get('media') === 'true';

  try {
    if (slug || id) {
      let query = supabase.from('providers').select('*');
      if (slug) query = query.eq('slug', slug);
      else if (id) query = query.eq('id', id);
      
      const { data: provider, error } = await query.single();
      if (error || !provider) {
        return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
      }

      let media: any[] = [];
      if (includeMedia) {
        const { data: mediaData } = await supabase
          .from('provider_media')
          .select('*')
          .eq('provider_id', provider.id)
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('display_order', { ascending: true });
        media = mediaData || [];
      }
      return NextResponse.json({ provider: mapProvider(provider), media });
    }

    const { data: providers, error } = await supabase
      .from('providers')
      .select('*')
      .eq('is_active', true);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    // Sort by display order (Danielle first)
    const mapped = (providers || []).map(mapProvider).sort((a, b) => a.display_order - b.display_order);
    return NextResponse.json({ providers: mapped });
  } catch (err) {
    console.error('Providers API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await request.json();
    const { id, name, short_bio, full_bio, philosophy, headshot_url, intro_video_url, booking_url, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });

    // Map back to existing table structure
    const updates: any = { ...rest };
    if (short_bio !== undefined) updates.short_bio = short_bio;
    if (full_bio !== undefined) updates.bio = full_bio;
    if (philosophy !== undefined) updates.philosophy = philosophy;
    if (headshot_url !== undefined) updates.headshot_url = headshot_url;
    if (intro_video_url !== undefined) updates.intro_video_url = intro_video_url;
    if (booking_url !== undefined) updates.booking_url = booking_url;

    const { data, error } = await supabase.from('providers').update(updates).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ provider: mapProvider(data) });
  } catch (err) {
    console.error('Update provider error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
