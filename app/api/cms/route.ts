// ============================================================
// API: CMS - Database-driven content management
// No code deployment required for content changes
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Default content blocks (fallback when DB not available)
const DEFAULT_CONTENT: Record<string, any> = {
  'homepage_hero': {
    headline: 'Luxury Aesthetics. Real Results.',
    subheadline: 'Medical-grade treatments delivered with care',
    cta_text: 'Book Now',
    cta_link: '/book',
  },
  'homepage_about': {
    title: 'Welcome to Hello Gorgeous',
    description: 'We combine clinical expertise with a luxurious experience to help you look and feel your best.',
  },
  'contact_info': {
    phone: '630-636-6193',
    email: 'hellogorgeousskin@yahoo.com',
    address: '74 W. Washington Street, Oswego, IL 60543',
  },
  'business_hours': {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 7:00 PM',
    friday: '9:00 AM - 5:00 PM',
    saturday: 'By Appointment',
    sunday: 'Closed',
  },
};

// GET - Fetch content blocks
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const page = searchParams.get('page');

  // Return defaults if no DB
  if (!supabase) {
    if (key) {
      return NextResponse.json({ 
        content: DEFAULT_CONTENT[key] || null,
        source: 'default',
      });
    }
    return NextResponse.json({ 
      content: DEFAULT_CONTENT,
      source: 'default',
    });
  }

  try {
    let query = supabase.from('cms_content').select('*');
    
    if (key) {
      query = query.eq('key', key);
    }
    if (page) {
      query = query.eq('page', page);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      console.log('CMS fetch error, using defaults:', error.message);
      if (key) {
        return NextResponse.json({ content: DEFAULT_CONTENT[key] || null, source: 'default' });
      }
      return NextResponse.json({ content: DEFAULT_CONTENT, source: 'default' });
    }

    // If no data in DB, return defaults
    if (!data || data.length === 0) {
      if (key) {
        return NextResponse.json({ content: DEFAULT_CONTENT[key] || null, source: 'default' });
      }
      return NextResponse.json({ content: DEFAULT_CONTENT, source: 'default' });
    }

    // If single key requested, return that content
    if (key) {
      const item = data.find(d => d.key === key);
      return NextResponse.json({ 
        content: item ? JSON.parse(item.content || '{}') : DEFAULT_CONTENT[key],
        meta: item ? { id: item.id, updated_at: item.updated_at } : null,
      });
    }

    // Return all content as a map
    const contentMap: Record<string, any> = {};
    data.forEach((item: any) => {
      contentMap[item.key] = {
        ...JSON.parse(item.content || '{}'),
        _meta: { id: item.id, page: item.page, updated_at: item.updated_at },
      };
    });

    return NextResponse.json({ content: contentMap });
  } catch (error) {
    console.error('CMS API error:', error);
    return NextResponse.json({ content: DEFAULT_CONTENT, source: 'default' });
  }
}

// POST - Create new content block
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { key, page, content, label, content_type } = body;

    if (!key) {
      return NextResponse.json({ error: 'Content key required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cms_content')
      .insert({
        key,
        page: page || 'global',
        content: JSON.stringify(content || {}),
        label: label || key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        content_type: content_type || 'json',
      })
      .select()
      .single();

    if (error) {
      // If table doesn't exist, provide helpful message
      if (error.code === '42P01') {
        return NextResponse.json({ 
          error: 'CMS table not set up. Run the CMS migration.',
          details: error.message 
        }, { status: 500 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, content: data });
  } catch (error) {
    console.error('CMS POST error:', error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

// PUT - Update content block
export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, key, content, ...otherFields } = body;

    if (!id && !key) {
      return NextResponse.json({ error: 'Content ID or key required' }, { status: 400 });
    }

    const updateData: any = {
      content: JSON.stringify(content || {}),
      updated_at: new Date().toISOString(),
    };

    // Add other fields if provided
    if (otherFields.label) updateData.label = otherFields.label;
    if (otherFields.page) updateData.page = otherFields.page;
    if (otherFields.is_active !== undefined) updateData.is_active = otherFields.is_active;
    if (otherFields.sort_order !== undefined) updateData.sort_order = otherFields.sort_order;

    let query = supabase.from('cms_content').update(updateData);
    
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('key', key);
    }

    const { data, error } = await query.select().single();

    if (error) {
      // If no rows matched, try to insert (upsert behavior)
      if (error.code === 'PGRST116' && key) {
        const { data: insertData, error: insertError } = await supabase
          .from('cms_content')
          .insert({
            key,
            content: JSON.stringify(content || {}),
            page: otherFields.page || 'global',
            label: otherFields.label || key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          })
          .select()
          .single();

        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, content: insertData, created: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, content: data });
  } catch (error) {
    console.error('CMS PUT error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

// DELETE - Remove content block
export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const key = searchParams.get('key');

    if (!id && !key) {
      return NextResponse.json({ error: 'Content ID or key required' }, { status: 400 });
    }

    let query = supabase.from('cms_content').delete();
    
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('key', key);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
