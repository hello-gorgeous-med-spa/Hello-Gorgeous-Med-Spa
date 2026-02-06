// ============================================================
// API: KIOSK CONSENT - Get kiosk session data
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

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { token } = params;

    // Get token record
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('appointment_consent_tokens')
      .select('*')
      .eq('token', token)
      .eq('token_type', 'kiosk')
      .eq('is_valid', true)
      .single();

    if (tokenError || !tokenRecord) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid kiosk session',
      }, { status: 404 });
    }

    // Check expiration
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        expired: true,
        error: 'This kiosk session has expired',
      });
    }

    // Check if already used
    if (tokenRecord.used_at) {
      return NextResponse.json({
        valid: false,
        error: 'This kiosk session has already been used',
      });
    }

    // Get outstanding consent packets
    const { data: packets, error: packetsError } = await supabase
      .from('consent_packets')
      .select('id, template_name, template_content, status')
      .eq('appointment_id', tokenRecord.appointment_id)
      .not('status', 'in', '("signed","voided","expired")')
      .order('created_at', { ascending: true });

    if (packetsError) {
      return NextResponse.json({ error: 'Failed to load consents' }, { status: 500 });
    }

    // Get client name
    const { data: client } = await supabase
      .from('clients')
      .select('users(first_name, last_name)')
      .eq('id', tokenRecord.client_id)
      .single();

    return NextResponse.json({
      valid: true,
      client_name: client?.users
        ? `${client.users.first_name} ${client.users.last_name}`
        : 'Patient',
      packets: packets || [],
    });

  } catch (error) {
    console.error('Kiosk API error:', error);
    return NextResponse.json({ error: 'Failed to load kiosk session' }, { status: 500 });
  }
}
