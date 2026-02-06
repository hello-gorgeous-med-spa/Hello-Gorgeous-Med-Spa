// ============================================================
// API: KIOSK CONSENT - Sign packet from kiosk
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

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { token } = params;
    const body = await request.json();
    const { packet_id, signature_image } = body;

    if (!packet_id || !signature_image) {
      return NextResponse.json(
        { error: 'packet_id and signature_image are required' },
        { status: 400 }
      );
    }

    // Verify kiosk token
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('appointment_consent_tokens')
      .select('*')
      .eq('token', token)
      .eq('token_type', 'kiosk')
      .eq('is_valid', true)
      .single();

    if (tokenError || !tokenRecord) {
      return NextResponse.json({ error: 'Invalid kiosk session' }, { status: 404 });
    }

    // Check expiration
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Kiosk session expired' }, { status: 410 });
    }

    // Verify packet belongs to this appointment
    const { data: packet, error: packetError } = await supabase
      .from('consent_packets')
      .select('id, appointment_id, status')
      .eq('id', packet_id)
      .single();

    if (packetError || !packet) {
      return NextResponse.json({ error: 'Consent not found' }, { status: 404 });
    }

    if (packet.appointment_id !== tokenRecord.appointment_id) {
      return NextResponse.json({ error: 'Consent does not match session' }, { status: 403 });
    }

    if (packet.status === 'signed') {
      return NextResponse.json({ error: 'Already signed' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'kiosk';
    const userAgent = request.headers.get('user-agent') || 'kiosk';

    // Sign the packet
    const { error: updateError } = await supabase
      .from('consent_packets')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signature_image,
        signature_ip: ip,
        signature_user_agent: userAgent,
      })
      .eq('id', packet_id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 });
    }

    // Log event
    await supabase
      .from('consent_events')
      .insert({
        packet_id,
        event: 'signed',
        actor_type: 'client',
        ip_address: ip,
        user_agent: userAgent,
        meta: { source: 'kiosk', kiosk_token: token },
      });

    // Check if all packets for this appointment are signed
    const { data: remainingPackets } = await supabase
      .from('consent_packets')
      .select('id')
      .eq('appointment_id', tokenRecord.appointment_id)
      .not('status', 'in', '("signed","voided","expired")');

    // If all signed, mark kiosk token as used
    if (!remainingPackets || remainingPackets.length === 0) {
      await supabase
        .from('appointment_consent_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token', token);
    }

    return NextResponse.json({
      success: true,
      message: 'Consent signed successfully',
    });

  } catch (error) {
    console.error('Kiosk sign error:', error);
    return NextResponse.json({ error: 'Failed to sign consent' }, { status: 500 });
  }
}
