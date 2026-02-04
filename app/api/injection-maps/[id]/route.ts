// ============================================================
// INJECTION MAP API - Single map operations
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const { data: map, error } = await supabase
      .from('injection_maps')
      .select(`
        *,
        injection_points(*),
        clients(id, user_id, user_profiles:user_id(first_name, last_name)),
        providers(id, user_id, user_profiles:user_id(first_name, last_name))
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Fetch injection map error:', error);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      map: {
        ...map,
        client_name: map.clients?.user_profiles 
          ? `${map.clients.user_profiles.first_name} ${map.clients.user_profiles.last_name}`
          : 'Unknown',
        provider_name: map.providers?.user_profiles
          ? `${map.providers.user_profiles.first_name} ${map.providers.user_profiles.last_name}`
          : 'Unknown',
        points: map.injection_points || [],
      }
    });
  } catch (error) {
    console.error('Injection map API error:', error);
    return NextResponse.json({ error: 'Failed to fetch injection map' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { notes, points } = body;

    // Update the map
    const { error: mapError } = await supabase
      .from('injection_maps')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (mapError) {
      console.error('Update injection map error:', mapError);
      return NextResponse.json({ error: mapError.message }, { status: 500 });
    }

    // Replace all points
    if (points !== undefined) {
      // Delete existing points
      await supabase
        .from('injection_points')
        .delete()
        .eq('injection_map_id', params.id);

      // Insert new points
      if (points.length > 0) {
        const pointsToInsert = points.map((p: any) => ({
          injection_map_id: params.id,
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

        await supabase
          .from('injection_points')
          .insert(pointsToInsert);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update injection map API error:', error);
    return NextResponse.json({ error: 'Failed to update injection map' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    // Points will be deleted via CASCADE
    const { error } = await supabase
      .from('injection_maps')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete injection map error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete injection map API error:', error);
    return NextResponse.json({ error: 'Failed to delete injection map' }, { status: 500 });
  }
}
