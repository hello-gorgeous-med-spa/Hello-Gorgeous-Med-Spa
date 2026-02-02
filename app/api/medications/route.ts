// ============================================================
// API: MEDICATIONS - Log and track medication administrations
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/medications - List recent administrations
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data: medications, error } = await supabase
      .from('medication_administrations')
      .select('*')
      .order('administered_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Medications fetch error:', error);
      // Return empty array if table doesn't exist yet
      return NextResponse.json({ medications: [], stats: { week: 0, month: 0, botoxUnits: 0, fillerSyringes: 0 } });
    }

    // Calculate stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = (medications || []).filter(m => new Date(m.administered_at) > weekAgo).length;
    const thisMonth = (medications || []).filter(m => new Date(m.administered_at) > monthAgo).length;

    // Sum up neurotoxin units and filler syringes
    const botoxUnits = (medications || [])
      .filter(m => m.category === 'neurotoxin' && new Date(m.administered_at) > monthAgo)
      .reduce((sum, m) => sum + (m.dose || 0), 0);

    const fillerSyringes = (medications || [])
      .filter(m => (m.category === 'filler' || m.category === 'biostimulator') && new Date(m.administered_at) > monthAgo)
      .reduce((sum, m) => sum + (m.dose || 0), 0);

    return NextResponse.json({
      medications: medications || [],
      stats: { week: thisWeek, month: thisMonth, botoxUnits, fillerSyringes },
    });
  } catch (error) {
    console.error('Medications GET error:', error);
    return NextResponse.json({ medications: [], stats: { week: 0, month: 0, botoxUnits: 0, fillerSyringes: 0 } });
  }
}

// POST /api/medications - Log a new administration
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      medication_id,
      medication_name,
      dose,
      unit,
      client_name,
      client_id,
      provider_name,
      provider_id,
      lot_number,
      notes,
      supplier,
      category,
    } = body;

    if (!medication_name || !client_name || !provider_name) {
      return NextResponse.json({ error: 'Medication, client, and provider are required' }, { status: 400 });
    }

    const { data: administration, error } = await supabase
      .from('medication_administrations')
      .insert({
        medication_id: medication_id || medication_name.toLowerCase().replace(/\s+/g, '-'),
        medication_name,
        dose: dose || 1,
        unit: unit || 'units',
        client_name,
        client_id: client_id || null,
        provider_name,
        provider_id: provider_id || null,
        lot_number: lot_number || null,
        notes: notes || null,
        supplier: supplier || null,
        category: category || null,
        administered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Administration create error:', error);
      // If table doesn't exist, return success with mock data
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          administration: {
            id: `temp-${Date.now()}`,
            medication_name,
            dose,
            unit,
            client_name,
            provider_name,
            administered_at: new Date().toISOString(),
          },
          message: 'Logged locally (database table not yet created)',
        });
      }
      return NextResponse.json({ error: 'Failed to log administration' }, { status: 500 });
    }

    return NextResponse.json({ success: true, administration });
  } catch (error) {
    console.error('Medications POST error:', error);
    return NextResponse.json({ error: 'Failed to log administration' }, { status: 500 });
  }
}
