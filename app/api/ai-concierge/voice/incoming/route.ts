// Twilio Voice — "A call comes in" webhook (POST form-urlencoded)
// https://www.twilio.com/docs/voice/twiml
//
// Pattern B (ring-first) when voice enabled: Dial staff, then Sarah on no-answer.
// Voice disabled (default): Xfinity/Comcast + staff mobiles own the phone tree.
// If Twilio still receives a stray call, bridge to the published Xfinity main line — never hang up.

import { NextRequest, NextResponse } from "next/server";

import { getRingFirstConfig } from "@/lib/ai-concierge/ring-first";
import {
  isAiConciergeVoiceEnabled,
  VOICE_DISABLED_TWIML,
} from "@/lib/ai-concierge/voice-enabled";
import {
  buildSarahGreetingTwiml,
  twimlResponse,
} from "@/lib/ai-concierge/voice-twiml";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

export const dynamic = "force-dynamic";

function mapCallStatus(v: string | null): string {
  if (!v) return "in_progress";
  const s = v.toLowerCase().replace(/-/g, "_");
  if (["ringing", "in_progress", "completed", "busy", "failed", "no_answer", "canceled"].includes(s)) {
    return s;
  }
  return "in_progress";
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const form = new URLSearchParams(raw);
  const formObject = Object.fromEntries(form.entries());

  if (!twilioSignatureValid(request, raw, formObject)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  if (!isAiConciergeVoiceEnabled()) {
    return twimlResponse(VOICE_DISABLED_TWIML);
  }

  const callSid = form.get("CallSid");
  const from = form.get("From");
  const to = form.get("To");
  const callStatus = form.get("CallStatus");

  if (!callSid || !from || !to) {
    return NextResponse.json({ error: "Missing CallSid, From, or To" }, { status: 400 });
  }

  const startedAt = new Date().toISOString();
  const admin = getSupabaseAdminClient();
  if (admin) {
    const { error } = await admin.from("ai_concierge_calls").upsert(
      {
        call_sid: callSid,
        from_number: from,
        to_number: to,
        started_at: startedAt,
        status: mapCallStatus(callStatus),
      },
      { onConflict: "call_sid" },
    );
    if (error) {
      console.error("[ai-concierge] ai_concierge_calls upsert:", error.message);
    }
  } else {
    console.warn("[ai-concierge] Supabase admin not configured; skip call log");
  }

  const ringFirst = await getRingFirstConfig();

  if (ringFirst.enabled) {
    if (admin) {
      await admin
        .from("ai_concierge_calls")
        .update({ action_taken: "ring_first_started" })
        .eq("call_sid", callSid);
    }

    const dialStatusUrl = new URL(
      "/api/ai-concierge/voice/dial-status",
      request.nextUrl.origin,
    ).toString();

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="${ringFirst.timeoutSeconds}" answerOnBridge="true" action="${escapeXml(dialStatusUrl)}" method="POST">${escapeXml(ringFirst.ringE164)}</Dial>
</Response>`;
    return twimlResponse(twiml);
  }

  return twimlResponse(buildSarahGreetingTwiml(request));
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "AI Concierge incoming voice",
    voiceEnabled: isAiConciergeVoiceEnabled(),
    method: "POST (Twilio only); validates X-Twilio-Signature",
  });
}
