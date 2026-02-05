// ============================================================
import { createClient } from '@supabase/supabase-js';
// CHART-TO-CART SESSIONS API
// Persist treatment sessions; show in Active Sessions & client profile
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// GET - List sessions (all or by client_id / status)
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ sessions: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let query = supabase
      .from('chart_to_cart_sessions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (clientId) query = query.eq('client_id', clientId);
    if (status) query = query.eq('status', status);

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Chart-to-cart sessions fetch error:', error);
      return NextResponse.json({ sessions: [] });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (err) {
    console.error('Chart-to-cart sessions API error:', err);
    return NextResponse.json({ sessions: [] });
  }
}

// POST - Create session (from New Session flow; persists to DB and client profile)
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      client_name,
      provider = 'Staff',
      status = 'in_progress',
      treatment_summary,
      products = [],
      total = 0,
      paperwork = { consents: false, questionnaires: false },
      notes,
    } = body;

    if (!client_id) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 });
    }

    const { data: session, error } = await supabase
      .from('chart_to_cart_sessions')
      .insert({
        client_id,
        client_name: client_name || null,
        provider,
        status,
        started_at: new Date().toISOString(),
        treatment_summary: treatment_summary || null,
        products: Array.isArray(products) ? products : [],
        total: Number(total) || 0,
        paperwork,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Chart-to-cart session create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (err) {
    console.error('Chart-to-cart sessions POST error:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
