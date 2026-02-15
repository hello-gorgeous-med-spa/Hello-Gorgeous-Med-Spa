// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/hgos/supabase-admin';
import { PROVIDER_FALLBACKS } from '@/lib/providers/fallback';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

const FALLBACK_PROVIDER_LIST = Object.values(PROVIDER_FALLBACKS).map((provider) => ({
  id: provider.id,
  first_name: provider.first_name,
  last_name: provider.last_name,
  email: provider.email,
  credentials: provider.credentials,
  color_hex: provider.color_hex,
  is_active: true,
  slug: provider.slug,
  display_name: provider.display_name,
  headshot_url: provider.headshot_url,
  tagline: provider.tagline,
  booking_url: provider.booking_url,
}));

const ALLOWED_IDS = new Set(FALLBACK_PROVIDER_LIST.map((p) => p.id));
const ALLOWED_SLUGS = new Set(Object.values(PROVIDER_FALLBACKS).map((p) => p.slug));

// GET /api/providers - List ONLY Ryan and Danielle
export async function GET() {
  // Always return fallback if Supabase not configured
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ providers: FALLBACK_PROVIDER_LIST });
  }

  try {
    // Try to get providers - support both direct columns and users join
    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        user_id,
        slug,
        display_name,
        first_name,
        last_name,
        email,
        credentials,
        color_hex,
        is_active,
        headshot_url,
        tagline,
        booking_url
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Providers fetch error:', error);
      return NextResponse.json({ providers: FALLBACK_PROVIDER_LIST });
    }

    // Format providers - merge with fallback data for reliable names
    if (providers && providers.length > 0) {
      // Map DB providers to formatted providers with fallback data
      const formatted = providers.map(p => {
        // Get fallback data by slug or id for reliable names
        const fallback = p.slug ? PROVIDER_FALLBACKS[p.slug] : 
          Object.values(PROVIDER_FALLBACKS).find(f => f.id === p.id);
        
        // Check if we need to use fallback names
        const needsFallbackName = !p.first_name || p.first_name === 'Provider' || p.first_name.trim() === '';
        
        return {
          id: p.id,
          user_id: p.user_id,
          // Use fallback names if DB has generic "Provider" or empty
          first_name: needsFallbackName ? (fallback?.first_name || 'Provider') : p.first_name,
          last_name: needsFallbackName ? (fallback?.last_name || '') : (p.last_name || ''),
          email: p.email || fallback?.email,
          credentials: p.credentials || fallback?.credentials,
          color_hex: p.color_hex || fallback?.color_hex || '#EC4899',
          is_active: p.is_active,
          slug: p.slug || fallback?.slug,
          display_name: p.display_name || fallback?.display_name,
          headshot_url: p.headshot_url || fallback?.headshot_url,
          tagline: p.tagline || fallback?.tagline,
          booking_url: p.booking_url || fallback?.booking_url,
        };
      });
      
      // Check if any providers still have bad names - if so, return fallback list
      const allHaveBadNames = formatted.every(p => 
        !p.first_name || p.first_name === 'Provider' || p.first_name.trim() === ''
      );
      
      if (allHaveBadNames) {
        console.log('[Providers API] All providers have bad names, returning fallback');
        return NextResponse.json({ providers: FALLBACK_PROVIDER_LIST });
      }
      
      if (formatted.length > 0) {
        return NextResponse.json({ providers: formatted });
      }
    }

    return NextResponse.json({ providers: FALLBACK_PROVIDER_LIST });
  } catch (error) {
    console.error('Providers GET error:', error);
    return NextResponse.json({ providers: FALLBACK_PROVIDER_LIST });
  }
}

// POST /api/providers - Create new provider
export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const { user_id, credentials, color_hex } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Check if already a provider
    const { data: existing } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (existing) {
      // Reactivate if exists
      const { error } = await supabase
        .from('providers')
        .update({ is_active: true, credentials, color_hex })
        .eq('id', existing.id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Provider reactivated' });
    }

    // Create new provider
    const { data: newProvider, error } = await supabase
      .from('providers')
      .insert({
        user_id,
        credentials: credentials || null,
        color_hex: color_hex || '#EC4899',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Provider create error:', error);
      return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, provider: newProvider });
  } catch (error) {
    console.error('Providers POST error:', error);
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
  }
}

// PUT /api/providers - Update provider
export async function PUT(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const { id, credentials, color_hex, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const update: any = {};
    if (credentials !== undefined) update.credentials = credentials;
    if (color_hex !== undefined) update.color_hex = color_hex;
    if (is_active !== undefined) update.is_active = is_active;
    update.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('providers')
      .update(update)
      .eq('id', id);

    if (error) {
      console.error('Provider update error:', error);
      return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Provider updated' });
  } catch (error) {
    console.error('Providers PUT error:', error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}

// DELETE /api/providers - Soft delete (deactivate) provider
export async function DELETE(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Soft delete - just deactivate
    const { error } = await supabase
      .from('providers')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Provider delete error:', error);
      return NextResponse.json({ error: 'Failed to remove provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Provider removed' });
  } catch (error) {
    console.error('Providers DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove provider' }, { status: 500 });
  }
}
