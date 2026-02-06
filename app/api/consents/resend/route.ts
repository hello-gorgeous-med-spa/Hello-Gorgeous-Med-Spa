// ============================================================
// API: CONSENT RESEND
// Staff-triggered resend of consent SMS
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendConsentSms } from '@/lib/notifications/telnyx';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) return null;
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
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

    // Get outstanding packets for this appointment
    const { data: packets, error: packetsError } = await supabase
      .from('consent_packets')
      .select(`
        *,
        client:clients(
          id,
          users(first_name, last_name, phone, email)
        )
      `)
      .eq('appointment_id', appointment_id)
      .not('status', 'in', '("signed","voided","expired")');

    if (packetsError || !packets || packets.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No outstanding consent packets found for this appointment',
      });
    }

    const client = packets[0].client;
    const clientName = client?.users?.first_name || 'Patient';
    const clientPhone = client?.users?.phone;

    if (!clientPhone) {
      return NextResponse.json({
        success: false,
        error: 'Client has no phone number on file',
      }, { status: 400 });
    }

    // Get or use existing wizard token
    const wizardToken = packets[0].wizard_token;
    if (!wizardToken) {
      return NextResponse.json({
        success: false,
        error: 'No wizard token found. Create new consent packets first.',
      }, { status: 400 });
    }

    // Build wizard link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'https://www.hellogorgeousmedspa.com';
    const wizardLink = `${baseUrl}/consents/wizard/${wizardToken}`;

    // Send SMS
    const smsResult = await sendConsentSms(clientPhone, clientName, wizardLink);

    // Update packets
    const updateData: any = {
      last_resend_at: new Date().toISOString(),
      resend_count: packets[0].resend_count + 1,
    };

    if (smsResult.success) {
      updateData.status = 'sent';
      updateData.sent_at = new Date().toISOString();
      updateData.sent_to = smsResult.to;
      updateData.sms_message_id = smsResult.providerMessageId;
      updateData.send_error = null;
    } else {
      updateData.send_error = smsResult.error;
    }

    await supabase
      .from('consent_packets')
      .update(updateData)
      .eq('appointment_id', appointment_id)
      .not('status', 'in', '("signed","voided","expired")');

    // Log resend events
    for (const packet of packets) {
      await supabase
        .from('consent_events')
        .insert({
          packet_id: packet.id,
          event: 'resent',
          actor_type: 'staff',
          actor_user_id: staff_user_id || null,
          meta: {
            provider: 'telnyx',
            message_id: smsResult.providerMessageId,
            to: smsResult.to,
            error: smsResult.error,
            resend_count: updateData.resend_count,
          },
        });
    }

    return NextResponse.json({
      success: smsResult.success,
      message: smsResult.success ? 'Consent SMS resent successfully' : 'Failed to resend SMS',
      sms_error: smsResult.error,
      packets_updated: packets.length,
      resend_count: updateData.resend_count,
    });

  } catch (error) {
    console.error('Consent resend error:', error);
    return NextResponse.json(
      { error: 'Failed to resend consent SMS' },
      { status: 500 }
    );
  }
}
