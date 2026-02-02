// ============================================================
// CMS SITE SETTINGS API
// Global design system, branding, features - NO DEV REQUIRED
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

const DEFAULT_SETTINGS = {
  site_name: 'Hello Gorgeous Med Spa',
  tagline: 'Your Premier Medical Spa',
  color_primary: '#ec4899',
  color_secondary: '#000000',
  color_accent: '#ffffff',
  color_background: '#ffffff',
  color_text: '#1f2937',
  font_heading: 'Inter',
  font_body: 'Inter',
  font_size_base: 16,
  max_content_width: 1280,
  header_style: 'fixed',
  footer_style: 'standard',
  social_links: {},
  business_hours: {},
  features: {
    booking_enabled: true,
    telehealth_enabled: true,
    memberships_enabled: true,
    gift_cards_enabled: true,
    reviews_enabled: true,
    chat_enabled: false,
    waitlist_enabled: false,
    pricing_visible: true,
  },
  maintenance_mode: false,
};

// ============================================================
// GET - Get site settings
// ============================================================
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: settings, error } = await supabase
      .from('cms_site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Settings fetch error:', error);
    }

    return NextResponse.json({ 
      settings: { ...DEFAULT_SETTINGS, ...settings }
    });
  } catch (error) {
    console.error('CMS settings GET error:', error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

// ============================================================
// PUT - Update site settings
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { updated_by, ...updates } = body;

    // Get existing settings
    const { data: existing } = await supabase
      .from('cms_site_settings')
      .select('id')
      .single();

    const allowedFields = [
      'site_name', 'tagline', 'logo_url', 'favicon_url',
      'color_primary', 'color_secondary', 'color_accent', 'color_background', 'color_text',
      'font_heading', 'font_body', 'font_size_base',
      'max_content_width', 'header_style', 'footer_style',
      'phone', 'email', 'address',
      'social_links', 'business_hours', 'features',
      'default_meta_title', 'default_meta_description',
      'google_analytics_id', 'facebook_pixel_id',
      'maintenance_mode', 'maintenance_message',
    ];

    const cleanUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
      updated_by,
    };

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        cleanUpdates[field] = updates[field];
      }
    }

    if (existing) {
      const { error } = await supabase
        .from('cms_site_settings')
        .update(cleanUpdates)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cms_site_settings')
        .insert({
          id: crypto.randomUUID(),
          ...cleanUpdates,
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
