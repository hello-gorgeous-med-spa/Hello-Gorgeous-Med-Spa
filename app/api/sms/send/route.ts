// ============================================================
// API: Send single SMS (test or one-off) via Twilio
// POST body: { to: string, message: string, mediaUrl?: string }
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import { requireMarketingAccess } from "@/lib/api-auth";
import { ensureOptOutLanguage, sendSMS } from "@/lib/hgos/sms-marketing";
import { getTwilioSmsConfig, isTwilioConfigured } from "@/lib/hgos/twilio-config";
import { normalizeToE164 } from "@/lib/phone-e164";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  if (!isTwilioConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_MESSAGING_SERVICE_SID (or TWILIO_PHONE_NUMBER).",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const toRaw = body?.to?.trim();
    const message = body?.message?.trim();
    const mediaUrl = body?.mediaUrl?.trim() || undefined;

    if (!toRaw || !message) {
      return NextResponse.json({ success: false, error: 'Missing "to" or "message".' }, { status: 400 });
    }

    const to = normalizeToE164(toRaw);
    if (!to) {
      return NextResponse.json({ success: false, error: "Invalid phone number" }, { status: 400 });
    }

    const config = getTwilioSmsConfig();
    const result = await sendSMS(
      { to, body: ensureOptOutLanguage(message), mediaUrl },
      config,
    );

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  } catch (e) {
    console.error("[sms/send]", e);
    return NextResponse.json({ success: false, error: "Failed to send SMS" }, { status: 500 });
  }
}
