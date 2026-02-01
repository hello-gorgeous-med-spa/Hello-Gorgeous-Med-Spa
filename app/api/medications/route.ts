// ============================================================
// MEDICATIONS ADMINISTERED API
// Track all injectables and treatments with lot numbers
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/medications - List medications administered
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('clientId');
  const providerId = searchParams.get('providerId');
  const medicationType = searchParams.get('type');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let query = supabase
      .from('medications_administered')
      .select(`
        *,
        client:clients(id, user:users(first_name, last_name)),
        provider:providers(id, user:users(first_name, last_name, title))
      `)
      .order('administered_at', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (medicationType) {
      query = query.eq('medication_type', medicationType);
    }

    if (startDate) {
      query = query.gte('administered_at', startDate);
    }

    if (endDate) {
      query = query.lte('administered_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const medications = data || [];
    const stats = {
      week: medications.filter(m => new Date(m.administered_at) >= weekAgo).length,
      month: medications.filter(m => new Date(m.administered_at) >= monthAgo).length,
      botoxUnits: medications
        .filter(m => m.medication_type === 'neurotoxin')
        .reduce((sum, m) => sum + (m.quantity || 0), 0),
      fillerSyringes: medications
        .filter(m => m.medication_type === 'filler')
        .reduce((sum, m) => sum + (m.quantity || 0), 0),
    };

    return NextResponse.json({ medications, stats });
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 });
  }
}

// POST /api/medications - Record new medication administration
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      appointment_id,
      chart_note_id,
      client_id,
      provider_id,
      medication_name,
      medication_type,
      brand,
      quantity,
      unit_type = 'units',
      lot_number,
      expiration_date,
      inventory_lot_id,
      treatment_areas,
      injection_sites,
      notes,
      recorded_by,
    } = body;

    if (!client_id || !provider_id || !medication_name || !quantity) {
      return NextResponse.json(
        { error: 'Client, provider, medication name, and quantity are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('medications_administered')
      .insert({
        appointment_id,
        chart_note_id,
        client_id,
        provider_id,
        medication_name,
        medication_type,
        brand,
        quantity,
        unit_type,
        lot_number,
        expiration_date,
        inventory_lot_id,
        treatment_areas,
        injection_sites,
        notes,
        recorded_by,
        administered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Decrement inventory if lot_id provided
    if (inventory_lot_id) {
      await supabase.rpc('decrement_lot_quantity', {
        lot_uuid: inventory_lot_id,
        amount: quantity,
      });
    }

    return NextResponse.json({ medication: data }, { status: 201 });
  } catch (error) {
    console.error('Error recording medication:', error);
    return NextResponse.json({ error: 'Failed to record medication' }, { status: 500 });
  }
}
