// ============================================================
// API: Send single SMS (test or one-off) via Twilio
// POST body: { to: string, message: string, mediaUrl?: string }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/hgos/sms-marketing';
import { getTwilioSmsConfig, isTwilioConfigured } from '@/lib/hgos/twilio-config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isTwilioConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const to = body?.to?.trim();
    const message = body?.message?.trim();
    const mediaUrl = body?.mediaUrl?.trim() || undefined;

    if (!to || !message) {
      return NextResponse.json({ success: false, error: 'Missing "to" or "message".' }, { status: 400 });
    }

    const config = getTwilioSmsConfig();
    const result = await sendSMS(
      { to, body: message, mediaUrl },
      config
    );

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  } catch (e) {
    console.error('[sms/send]', e);
    return NextResponse.json({ success: false, error: 'Failed to send SMS' }, { status: 500 });
  }
}
