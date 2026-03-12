// ============================================================
// API: APPOINTMENT CONSENT STATUS
// Check consent signing status for appointments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    // Get appointment IDs from query params
    const appointmentIds = request.nextUrl.searchParams.get('ids');
    
    if (!appointmentIds) {
      return NextResponse.json({ error: 'ids parameter required' }, { status: 400 });
    }

    const ids = appointmentIds.split(',').filter(Boolean);
    
    if (ids.length === 0) {
      return NextResponse.json({ statuses: {} });
    }

    // Get consent packets for these appointments
    const { data: packets, error } = await supabase
      .from('consent_packets')
      .select('appointment_id, status, template_name')
      .in('appointment_id', ids);

    if (error) {
      console.error('Error fetching consent status:', error);
      return NextResponse.json({ error: 'Failed to fetch consent status' }, { status: 500 });
    }

    // Group by appointment_id
    const statusMap: Record<string, {
      total: number;
      signed: number;
      pending: number;
      status: 'complete' | 'partial' | 'pending' | 'none';
    }> = {};

    // Initialize all requested IDs with 'none'
    for (const id of ids) {
      statusMap[id] = { total: 0, signed: 0, pending: 0, status: 'none' };
    }

    // Process packets
    for (const packet of packets || []) {
      const apptId = packet.appointment_id;
      if (!statusMap[apptId]) {
        statusMap[apptId] = { total: 0, signed: 0, pending: 0, status: 'none' };
      }
      
      statusMap[apptId].total++;
      
      if (packet.status === 'signed') {
        statusMap[apptId].signed++;
      } else {
        statusMap[apptId].pending++;
      }
    }

    // Calculate final status for each appointment
    for (const id of Object.keys(statusMap)) {
      const s = statusMap[id];
      if (s.total === 0) {
        s.status = 'none';
      } else if (s.signed === s.total) {
        s.status = 'complete';
      } else if (s.signed > 0) {
        s.status = 'partial';
      } else {
        s.status = 'pending';
      }
    }

    return NextResponse.json({ statuses: statusMap });

  } catch (error) {
    console.error('Consent status error:', error);
    return NextResponse.json({ error: 'Failed to check consent status' }, { status: 500 });
  }
}
