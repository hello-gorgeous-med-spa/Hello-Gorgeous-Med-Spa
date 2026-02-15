import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Map existing table fields to our expected format
function mapMedia(m: any) {
  return {
    id: m.id,
    provider_id: m.provider_id,
    type: m.media_type, // 'video' or 'before_after'
    video_url: m.video_url,
    video_thumbnail_url: m.thumbnail_url,
    before_image_url: m.before_image_url,
    after_image_url: m.after_image_url,
    title: m.title,
    description: m.description,
    service_tag: m.service_tag,
    is_featured: m.featured,
    consent_confirmed: m.consent_confirmed,
    has_watermark: m.watermark_enabled,
    display_order: m.sort_order,
    is_active: m.status === 'published',
  };
}

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { searchParams } = new URL(request.url);
  
  const providerId = searchParams.get('provider_id');
  const type = searchParams.get('type'); // 'video' or 'before_after'
  const serviceTag = searchParams.get('service_tag');

  try {
    let query = supabase.from('provider_media').select('*, providers(display_name, slug, first_name, last_name)').eq('status', 'published');

    if (providerId) query = query.eq('provider_id', providerId);
    if (type) query = query.eq('media_type', type);
    if (serviceTag) query = query.eq('service_tag', serviceTag);

    // For before/after, only show if consent confirmed
    if (type === 'before_after' || !type) {
      query = query.or('media_type.eq.video,consent_confirmed.eq.true');
    }

    const { data, error } = await query.order('featured', { ascending: false }).order('sort_order', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: (data || []).map(mapMedia) });
  } catch (err) {
    console.error('Provider media API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await request.json();
    const { 
      provider_id, type, video_url, video_thumbnail_url, 
      before_image_url, after_image_url, title, description, 
      service_tag, is_featured, consent_confirmed, has_watermark, display_order 
    } = body;

    if (!provider_id || !type) {
      return NextResponse.json({ error: 'provider_id and type are required' }, { status: 400 });
    }

    if (type === 'before_after' && !consent_confirmed) {
      return NextResponse.json({ error: 'Client consent must be confirmed for before/after photos' }, { status: 400 });
    }

    // Map to existing table structure
    const { data, error } = await supabase
      .from('provider_media')
      .insert({
        provider_id,
        media_type: type,
        video_url,
        thumbnail_url: video_thumbnail_url,
        before_image_url,
        after_image_url,
        title,
        description,
        service_tag,
        featured: is_featured || false,
        consent_confirmed: consent_confirmed || false,
        watermark_enabled: has_watermark !== false,
        sort_order: display_order || 0,
        status: 'published',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: mapMedia(data) });
  } catch (err) {
    console.error('Create media error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await request.json();
    const { id, type, is_featured, consent_confirmed, has_watermark, display_order, video_thumbnail_url, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });

    // Map fields to existing table structure
    const updates: any = { ...rest };
    if (type !== undefined) updates.media_type = type;
    if (is_featured !== undefined) updates.featured = is_featured;
    if (consent_confirmed !== undefined) updates.consent_confirmed = consent_confirmed;
    if (has_watermark !== undefined) updates.watermark_enabled = has_watermark;
    if (display_order !== undefined) updates.sort_order = display_order;
    if (video_thumbnail_url !== undefined) updates.thumbnail_url = video_thumbnail_url;

    const { data, error } = await supabase.from('provider_media').update(updates).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: mapMedia(data) });
  } catch (err) {
    console.error('Update media error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });

  try {
    // Soft delete - set status to 'archived'
    const { error } = await supabase.from('provider_media').update({ status: 'archived' }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete media error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
