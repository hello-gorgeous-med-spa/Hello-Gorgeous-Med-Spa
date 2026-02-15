// ============================================================
// API: PROVIDER MEDIA
// Video & Before/After management for provider pages
// Uses existing schema with media_type ENUM
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const SERVICE_TAGS = [
  { id: 'botox', label: 'Botox' },
  { id: 'lip_filler', label: 'Lip Filler' },
  { id: 'prp', label: 'PRP' },
  { id: 'hormone_therapy', label: 'Hormone Therapy' },
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'microneedling', label: 'Microneedling' },
  { id: 'laser', label: 'Laser' },
  { id: 'other', label: 'Other' },
];

// GET - Fetch provider media
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider_id = searchParams.get('provider_id');
  const provider_slug = searchParams.get('slug');
  const type = searchParams.get('type');
  const service_tag = searchParams.get('service_tag');
  const featured = searchParams.get('featured');
  const consent_only = searchParams.get('consent_only') !== 'false';

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    if (searchParams.get('tags') === 'true') {
      return NextResponse.json({ tags: SERVICE_TAGS });
    }

    let query = supabase.from('provider_media').select(`
      *,
      providers:provider_id (id, slug, display_name, headshot_url)
    `);

    if (provider_slug) {
      const { data: providerData } = await supabase
        .from('providers').select('id').eq('slug', provider_slug).single();
      if (providerData) query = query.eq('provider_id', providerData.id);
    } else if (provider_id) {
      query = query.eq('provider_id', provider_id);
    }

    if (type) query = query.eq('media_type', type);
    if (service_tag) query = query.eq('service_tag', service_tag);
    if (featured === 'true') query = query.eq('featured', true);
    if (consent_only) query = query.eq('status', 'published');

    query = query.order('featured', { ascending: false })
                 .order('sort_order', { ascending: true })
                 .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Provider media fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const media = (data || []).map((item: any) => ({
      ...item,
      type: item.media_type,
    }));

    return NextResponse.json({ media, tags: SERVICE_TAGS });
  } catch (error) {
    console.error('Provider media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// POST - Upload new media entry
export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      provider_id, type, video_url, thumbnail_url, before_image_url, after_image_url,
      title, description, service_tag, featured, consent_confirmed, watermark_enabled, alt_text,
    } = body;

    if (!provider_id || !type) {
      return NextResponse.json({ error: 'provider_id and type are required' }, { status: 400 });
    }

    if (type === 'before_after' && !consent_confirmed) {
      return NextResponse.json({ error: 'Before/after photos require consent confirmation' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('provider_media')
      .insert({
        provider_id,
        media_type: type,
        status: consent_confirmed ? 'published' : 'draft',
        video_url: video_url || null,
        thumbnail_url: thumbnail_url || null,
        before_image_url: before_image_url || null,
        after_image_url: after_image_url || null,
        title: title || 'Untitled',
        description: description || null,
        service_tag: service_tag || 'other',
        featured: featured || false,
        consent_confirmed: consent_confirmed || false,
        watermark_enabled: watermark_enabled !== false,
        alt_text: alt_text || `${type === 'video' ? 'Video' : 'Before and after'} - ${title || 'treatment'}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Provider media insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, media: { ...data, type: data.media_type } });
  } catch (error) {
    console.error('Provider media POST error:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}

// PUT - Update media
export async function PUT(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, type, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Map type to media_type if provided
    if (type) updates.media_type = type;

    const { data, error } = await supabase
      .from('provider_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Provider media update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, media: { ...data, type: data.media_type } });
  } catch (error) {
    console.error('Provider media PUT error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// DELETE - Remove media
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { error } = await supabase.from('provider_media').delete().eq('id', id);
    if (error) {
      console.error('Provider media delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Provider media DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
