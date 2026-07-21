// ============================================================
// API: SMS Stats — true marketing opt-in count for Text Studio
// ============================================================

import { NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getTwilioDisplayPhone, isTwilioConfigured } from "@/lib/hgos/twilio-config";
import { countRecentSmsOptIns, countSmsStudioOptIns } from "@/lib/sms-studio";

export const dynamic = "force-dynamic";

export async function GET() {
  const twilioConfigured = isTwilioConfigured();
  const messagingServiceConfigured = !!process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  const displayPhone = getTwilioDisplayPhone();

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      smsOptInCount: 0,
      provider: "twilio",
      twilioConfigured,
      messagingServiceConfigured,
      displayPhone,
      note: "Service role key not configured",
    });
  }

  try {
    const [smsOptInCount, recentOptIns] = await Promise.all([
      countSmsStudioOptIns(supabase),
      countRecentSmsOptIns(supabase),
    ]);

    return NextResponse.json({
      smsOptInCount,
      recentOptIns,
      provider: "twilio",
      twilioConfigured,
      messagingServiceConfigured,
      displayPhone,
      source: "clients_opt_in",
      joinKeyword: "JOIN",
    });
  } catch (e) {
    console.error("[sms/stats]", e);
    return NextResponse.json({
      smsOptInCount: 0,
      provider: "twilio",
      twilioConfigured,
      messagingServiceConfigured,
      displayPhone,
      error: "Server error",
    });
  }
}
