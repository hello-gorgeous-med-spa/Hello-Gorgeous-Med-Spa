// ============================================================
// API: CONSENT STATUS
// Get consent status for an appointment
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
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
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointment_id');
    const clientId = searchParams.get('client_id');

    if (!appointmentId && !clientId) {
      return NextResponse.json(
        { error: 'appointment_id or client_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('consent_packets')
      .select(`
        id,
        template_name,
        status,
        sent_at,
        viewed_at,
        signed_at,
        send_error,
        resend_count
      `)
      .order('created_at', { ascending: true });

    if (appointmentId) {
      query = query.eq('appointment_id', appointmentId);
    } else if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data: packets, error } = await query;

    if (error) {
      console.error('Consent status error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate overall status
    const total = packets?.length || 0;
    const signed = packets?.filter(p => p.status === 'signed').length || 0;
    const pending = packets?.filter(p => ['sent', 'viewed'].includes(p.status)).length || 0;
    const draft = packets?.filter(p => p.status === 'draft').length || 0;
    const failed = packets?.filter(p => p.send_error).length || 0;

    let overallStatus: 'complete' | 'pending' | 'missing' | 'none' = 'none';
    if (total === 0) {
      overallStatus = 'none';
    } else if (signed === total) {
      overallStatus = 'complete';
    } else if (pending > 0 || signed > 0) {
      overallStatus = 'pending';
    } else {
      overallStatus = 'missing';
    }

    return NextResponse.json({
      packets: packets || [],
      summary: {
        total,
        signed,
        pending,
        draft,
        failed,
        overall_status: overallStatus,
      },
    });

  } catch (error) {
    console.error('Consent status API error:', error);
    return NextResponse.json(
      { error: 'Failed to get consent status' },
      { status: 500 }
    );
  }
}
