import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const supabase = createServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Get provider by slug
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Get provider media
    const { data: media, error: mediaError } = await supabase
      .from('provider_media')
      .select('*')
      .eq('provider_id', provider.id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('display_order');

    if (mediaError) {
      console.error('Error fetching provider media:', mediaError);
    }

    return NextResponse.json({
      provider,
      media: media || [],
    });
  } catch (error) {
    console.error('Error in provider API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
