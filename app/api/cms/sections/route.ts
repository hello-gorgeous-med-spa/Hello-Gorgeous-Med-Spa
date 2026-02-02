// ============================================================
// CMS SECTIONS API
// Reusable content blocks - NO DEV REQUIRED
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Section type definitions for the builder
export const SECTION_TYPES = {
  hero: {
    name: 'Hero',
    icon: '🎯',
    fields: ['headline', 'subheadline', 'image_url', 'video_url', 'cta_text', 'cta_url', 'overlay_opacity'],
  },
  services_grid: {
    name: 'Services Grid',
    icon: '🏥',
    fields: ['title', 'subtitle', 'columns', 'show_prices', 'show_duration', 'category_filter'],
  },
  pricing: {
    name: 'Pricing Cards',
    icon: '💰',
    fields: ['title', 'subtitle', 'plans'],
  },
  providers: {
    name: 'Provider Bios',
    icon: '👩‍⚕️',
    fields: ['title', 'subtitle', 'display', 'provider_ids'],
  },
  testimonials: {
    name: 'Testimonials',
    icon: '⭐',
    fields: ['title', 'subtitle', 'display', 'testimonials'],
  },
  faq: {
    name: 'FAQ',
    icon: '❓',
    fields: ['title', 'subtitle', 'items'],
  },
  promo_banner: {
    name: 'Promo Banner',
    icon: '🎉',
    fields: ['promotion_id', 'style', 'dismissible'],
  },
  booking: {
    name: 'Booking Widget',
    icon: '📅',
    fields: ['title', 'subtitle', 'service_filter', 'provider_filter'],
  },
  text: {
    name: 'Text Block',
    icon: '📝',
    fields: ['title', 'content', 'alignment'],
  },
  image: {
    name: 'Image',
    icon: '🖼️',
    fields: ['image_url', 'alt_text', 'caption', 'width', 'link_url'],
  },
  video: {
    name: 'Video',
    icon: '🎬',
    fields: ['video_url', 'thumbnail_url', 'autoplay', 'loop'],
  },
  gallery: {
    name: 'Gallery',
    icon: '📸',
    fields: ['title', 'images', 'columns', 'lightbox'],
  },
  contact: {
    name: 'Contact Section',
    icon: '📞',
    fields: ['show_map', 'show_hours', 'show_form'],
  },
  cta: {
    name: 'CTA Block',
    icon: '🔗',
    fields: ['headline', 'subheadline', 'cta_text', 'cta_url', 'background'],
  },
  divider: {
    name: 'Divider',
    icon: '➖',
    fields: ['style', 'spacing'],
  },
  html: {
    name: 'Custom HTML',
    icon: '🔧',
    fields: ['html'],
  },
};

// ============================================================
// GET - List sections or get templates
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const templates = searchParams.get('templates') === 'true';
    const type = searchParams.get('type');

    let query = supabase
      .from('cms_sections')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (templates) {
      query = query.eq('is_template', true);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data: sections, error } = await query;

    if (error) {
      console.error('Sections fetch error:', error);
      return NextResponse.json({ sections: [], types: SECTION_TYPES });
    }

    return NextResponse.json({ 
      sections: sections || [],
      types: SECTION_TYPES,
    });
  } catch (error) {
    console.error('CMS sections GET error:', error);
    return NextResponse.json({ sections: [], types: SECTION_TYPES });
  }
}

// ============================================================
// POST - Create section template
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      name,
      type,
      content = {},
      is_global = false,
      is_template = false,
    } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type required' }, { status: 400 });
    }

    if (!SECTION_TYPES[type as keyof typeof SECTION_TYPES]) {
      return NextResponse.json({ error: 'Invalid section type' }, { status: 400 });
    }

    const { data: section, error } = await supabase
      .from('cms_sections')
      .insert({
        name,
        type,
        content,
        is_global,
        is_template,
      })
      .select()
      .single();

    if (error) {
      console.error('Section create error:', error);
      return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
    }

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error('CMS sections POST error:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update section
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID required' }, { status: 400 });
    }

    const allowedFields = ['name', 'content', 'is_global', 'is_template', 'status'];
    const cleanUpdates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        cleanUpdates[field] = updates[field];
      }
    }

    const { data: section, error } = await supabase
      .from('cms_sections')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error('CMS sections PUT error:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Delete section
// ============================================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Section ID required' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('cms_sections')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS sections DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
