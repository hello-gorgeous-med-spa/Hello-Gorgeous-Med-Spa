// ============================================================
// INJECTION MAPS API
// Create and retrieve injection mapping records
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ maps: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const appointmentId = searchParams.get('appointment_id');

    let query = supabase
      .from('injection_maps')
      .select(`
        *,
        injection_points(*),
        clients(id, user_id, user_profiles:user_id(first_name, last_name)),
        providers(id, user_id, user_profiles:user_id(first_name, last_name))
      `)
      .order('created_at', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (appointmentId) {
      query = query.eq('appointment_id', appointmentId);
    }

    const { data: maps, error } = await query.limit(50);

    if (error) {
      console.error('Fetch injection maps error:', error);
      return NextResponse.json({ maps: [] });
    }

    // Format the response
    const formattedMaps = (maps || []).map((map: any) => ({
      ...map,
      client_name: map.clients?.user_profiles 
        ? `${map.clients.user_profiles.first_name} ${map.clients.user_profiles.last_name}`
        : 'Unknown',
      provider_name: map.providers?.user_profiles
        ? `${map.providers.user_profiles.first_name} ${map.providers.user_profiles.last_name}`
        : 'Unknown',
      points: map.injection_points || [],
    }));

    return NextResponse.json({ maps: formattedMaps });
  } catch (error) {
    console.error('Injection maps API error:', error);
    return NextResponse.json({ maps: [] });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { 
      treatment_record_id, 
      appointment_id, 
      client_id, 
      provider_id, 
      diagram_type = 'face_front',
      notes,
      points = []
    } = body;

    if (!client_id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Create the injection map
    const { data: map, error: mapError } = await supabase
      .from('injection_maps')
      .insert({
        treatment_record_id,
        appointment_id,
        client_id,
        provider_id,
        diagram_type,
        notes,
      })
      .select()
      .single();

    if (mapError) {
      console.error('Create injection map error:', mapError);
      return NextResponse.json({ error: mapError.message }, { status: 500 });
    }

    // Add injection points
    if (points.length > 0) {
      const pointsToInsert = points.map((p: any) => ({
        injection_map_id: map.id,
        x_position: p.x_position,
        y_position: p.y_position,
        product_name: p.product_name,
        product_id: p.product_id || null,
        lot_number: p.lot_number || null,
        expiration_date: p.expiration_date || null,
        units: p.units || null,
        volume_ml: p.volume_ml || null,
        injection_depth: p.injection_depth || null,
        technique: p.technique || null,
        area_label: p.area_label,
      }));

      const { error: pointsError } = await supabase
        .from('injection_points')
        .insert(pointsToInsert);

      if (pointsError) {
        console.error('Create injection points error:', pointsError);
        // Don't fail the whole request, map was created
      }
    }

    return NextResponse.json({ map, success: true });
  } catch (error) {
    console.error('Create injection map API error:', error);
    return NextResponse.json({ error: 'Failed to create injection map' }, { status: 500 });
  }
}
