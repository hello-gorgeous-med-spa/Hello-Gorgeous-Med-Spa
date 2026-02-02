// ============================================================
// CMS NAVIGATION API
// Header, footer, mobile menu control - NO DEV REQUIRED
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

// ============================================================
// GET - Get navigation menus
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    let query = supabase.from('cms_navigation').select('*');

    if (location) {
      query = query.eq('location', location);
    }

    const { data: navigation, error } = await query;

    if (error) {
      console.error('Navigation fetch error:', error);
      return NextResponse.json({ navigation: [] });
    }

    // If requesting single location, return just that
    if (location) {
      const nav = navigation?.[0];
      return NextResponse.json({ navigation: nav || { location, items: [] } });
    }

    return NextResponse.json({ navigation: navigation || [] });
  } catch (error) {
    console.error('CMS navigation GET error:', error);
    return NextResponse.json({ navigation: [] });
  }
}

// ============================================================
// PUT - Update navigation
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { location, items, is_active, updated_by } = body;

    if (!location) {
      return NextResponse.json({ error: 'Location required' }, { status: 400 });
    }

    // Validate items structure
    if (items && !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    // Check if navigation exists
    const { data: existing } = await supabase
      .from('cms_navigation')
      .select('id')
      .eq('location', location)
      .single();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
      updated_by,
    };

    if (items !== undefined) updates.items = items;
    if (is_active !== undefined) updates.is_active = is_active;

    if (existing) {
      // Update
      const { error } = await supabase
        .from('cms_navigation')
        .update(updates)
        .eq('location', location);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabase
        .from('cms_navigation')
        .insert({
          location,
          ...updates,
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS navigation PUT error:', error);
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 });
  }
}

// Navigation item structure:
// {
//   id: string,
//   label: string,
//   url: string,
//   type: 'link' | 'dropdown' | 'button' | 'divider',
//   children: NavItem[], // for dropdowns
//   icon?: string,
//   badge?: string, // e.g., "NEW"
//   highlight?: boolean, // for promos
//   target?: '_blank' | '_self',
//   style?: 'default' | 'primary' | 'outline',
//   visible?: boolean,
// }
