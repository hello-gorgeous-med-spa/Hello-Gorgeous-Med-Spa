// ============================================================
// API: RESOURCES (Rooms & Devices)
// GET: list all resources, POST: create new resource
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ 
      resources: [],
      source: 'local',
      message: 'Database not configured'
    });
  }

  const { searchParams } = new URL(request.url);
  const resourceType = searchParams.get('type'); // room, device, equipment
  const activeOnly = searchParams.get('active') !== 'false';

  try {
    let query = supabase
      .from('resources')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name');

    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Resources fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      resources: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Resources API error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, resource_type, description, capacity, device_model, color_hex } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { data, error } = await supabase
      .from('resources')
      .insert({
        name,
        slug,
        resource_type: resource_type || 'room',
        description: description || null,
        capacity: capacity || 1,
        device_model: device_model || null,
        color_hex: color_hex || '#6B7280',
      })
      .select()
      .single();

    if (error) {
      console.error('Resource create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resource: data }, { status: 201 });
  } catch (error) {
    console.error('Resource POST error:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
