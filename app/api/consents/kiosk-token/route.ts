// ============================================================
// API: KIOSK TOKEN
// Generate short-lived token for iPad kiosk signing
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) return null;
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function generateKioskToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { appointment_id, staff_user_id } = body;

    if (!appointment_id) {
      return NextResponse.json(
        { error: 'appointment_id is required' },
        { status: 400 }
      );
    }

    // Get appointment and client info
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select(`
        id,
        client_id,
        service:services(name)
      `)
      .eq('id', appointment_id)
      .single();

    if (aptError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check for outstanding consent packets
    const { data: packets, error: packetsError } = await supabase
      .from('consent_packets')
      .select('id, template_name, status')
      .eq('appointment_id', appointment_id)
      .not('status', 'in', '("signed","voided","expired")');

    if (packetsError) {
      console.error('Packets fetch error:', packetsError);
      return NextResponse.json({ error: 'Failed to check consents' }, { status: 500 });
    }

    if (!packets || packets.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No outstanding consent forms for this appointment',
        outstanding_count: 0,
      });
    }

    // Generate kiosk token (15-minute expiry, one-time use)
    const kioskToken = generateKioskToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate any existing kiosk tokens for this appointment
    await supabase
      .from('appointment_consent_tokens')
      .update({ is_valid: false })
      .eq('appointment_id', appointment_id)
      .eq('token_type', 'kiosk');

    // Create new kiosk token
    const { error: tokenError } = await supabase
      .from('appointment_consent_tokens')
      .insert({
        appointment_id,
        client_id: appointment.client_id,
        token: kioskToken,
        token_type: 'kiosk',
        expires_at: expiresAt.toISOString(),
        is_valid: true,
      });

    if (tokenError) {
      console.error('Token create error:', tokenError);
      return NextResponse.json({ error: 'Failed to create kiosk token' }, { status: 500 });
    }

    // Log kiosk start event for each packet
    for (const packet of packets) {
      await supabase
        .from('consent_events')
        .insert({
          packet_id: packet.id,
          event: 'kiosk_started',
          actor_type: 'staff',
          actor_user_id: staff_user_id || null,
          meta: { kiosk_token: kioskToken },
        });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.hellogorgeousmedspa.com';

    return NextResponse.json({
      success: true,
      url: `${baseUrl}/kiosk/consents/${kioskToken}`,
      token: kioskToken,
      expires_at: expiresAt.toISOString(),
      expires_in_minutes: 15,
      outstanding_consents: packets.map(p => p.template_name),
      outstanding_count: packets.length,
    });

  } catch (error) {
    console.error('Kiosk token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate kiosk token' },
      { status: 500 }
    );
  }
}
