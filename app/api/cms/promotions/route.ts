// ============================================================
// CMS PROMOTIONS API
// Offers, banners, campaigns - NO DEV REQUIRED
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// ============================================================
// GET - List promotions or get single
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get('id');
    const active = searchParams.get('active') === 'true';
    const location = searchParams.get('location');

    // Get single promotion
    if (id) {
      const { data: promo, error } = await supabase
        .from('cms_promotions')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !promo) {
        return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
      }

      return NextResponse.json({ promotion: promo });
    }

    // List promotions
    let query = supabase
      .from('cms_promotions')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (active) {
      const now = new Date().toISOString();
      query = query
        .eq('is_active', true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`);
    }

    if (location) {
      query = query.contains('display_locations', [location]);
    }

    const { data: promotions, error } = await query;

    if (error) {
      console.error('Promotions fetch error:', error);
      return NextResponse.json({ promotions: [] });
    }

    return NextResponse.json({ promotions: promotions || [] });
  } catch (error) {
    console.error('CMS promotions GET error:', error);
    return NextResponse.json({ promotions: [] });
  }
}

// ============================================================
// POST - Create promotion
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      name,
      headline,
      subheadline,
      description,
      terms,
      image_url,
      background_color,
      text_color,
      cta_text,
      cta_url,
      cta_service_id,
      cta_provider_id,
      promo_code,
      display_locations = ['homepage'],
      display_as = 'banner',
      starts_at,
      ends_at,
      is_active = false,
      priority = 0,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');

    const { data: promo, error } = await supabase
      .from('cms_promotions')
      .insert({
        name,
        slug,
        headline,
        subheadline,
        description,
        terms,
        image_url,
        background_color,
        text_color,
        cta_text,
        cta_url,
        cta_service_id,
        cta_provider_id,
        promo_code,
        display_locations,
        display_as,
        starts_at,
        ends_at,
        is_active,
        priority,
      })
      .select()
      .single();

    if (error) {
      console.error('Promotion create error:', error);
      return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
    }

    return NextResponse.json({ success: true, promotion: promo });
  } catch (error) {
    console.error('CMS promotions POST error:', error);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update promotion
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Promotion ID required' }, { status: 400 });
    }

    // Handle quick actions
    if (action === 'activate') {
      const { error } = await supabase
        .from('cms_promotions')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Promotion activated' });
    }

    if (action === 'deactivate') {
      const { error } = await supabase
        .from('cms_promotions')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Promotion deactivated' });
    }

    if (action === 'track_view') {
      await supabase.rpc('increment', { row_id: id, table_name: 'cms_promotions', column_name: 'views' }).catch(() => {
        // Fallback if RPC doesn't exist
        supabase.from('cms_promotions').update({ views: supabase.raw('views + 1') }).eq('id', id);
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'track_click') {
      await supabase.rpc('increment', { row_id: id, table_name: 'cms_promotions', column_name: 'clicks' }).catch(() => {
        supabase.from('cms_promotions').update({ clicks: supabase.raw('clicks + 1') }).eq('id', id);
      });
      return NextResponse.json({ success: true });
    }

    // Regular update
    const allowedFields = [
      'name', 'headline', 'subheadline', 'description', 'terms',
      'image_url', 'background_color', 'text_color',
      'cta_text', 'cta_url', 'cta_service_id', 'cta_provider_id', 'promo_code',
      'display_locations', 'display_as',
      'starts_at', 'ends_at', 'is_active', 'priority',
    ];

    const cleanUpdates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        cleanUpdates[field] = updates[field];
      }
    }

    const { data: promo, error } = await supabase
      .from('cms_promotions')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, promotion: promo });
  } catch (error) {
    console.error('CMS promotions PUT error:', error);
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Delete promotion
// ============================================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Promotion ID required' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('cms_promotions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS promotions DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
}
