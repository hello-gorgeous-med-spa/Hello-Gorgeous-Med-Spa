// Twilio Voice — Dial action callback for the ring-first flow.
//
// /voice/incoming returns <Dial action="/voice/dial-status">. When the dial
// finishes (answered, no-answer, busy, failed, canceled), Twilio POSTs back
// here with `DialCallStatus`. If staff didn't pick up, we hand off to Sarah's
// greeting + Gather. If staff did answer, we hang up cleanly so Twilio doesn't
// continue executing the rest of the original TwiML.

import { NextRequest, NextResponse } from "next/server";

import {
  SARAH_GREETING_AFTER_RING,
  buildSarahGreetingTwiml,
  twimlResponse,
} from "@/lib/ai-concierge/voice-twiml";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

export const dynamic = "force-dynamic";

const PICKED_UP = new Set(["completed", "answered"]);
const FELL_THROUGH = new Set(["no-answer", "busy", "failed", "canceled"]);

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const form = new URLSearchParams(raw);
  const formObject = Object.fromEntries(form.entries());

  if (!twilioSignatureValid(request, raw, formObject)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const callSid = form.get("CallSid") ?? "";
  const dialStatus = (form.get("DialCallStatus") ?? "").toLowerCase();
  const dialDuration = form.get("DialCallDuration");

  const admin = getSupabaseAdminClient();
  if (admin && callSid) {
    await admin
      .from("ai_concierge_calls")
      .update({
        action_taken: PICKED_UP.has(dialStatus)
          ? "ring_first_picked_up"
          : "ring_first_no_answer",
        summary: `Ring-first dial: ${dialStatus || "unknown"}${dialDuration ? ` · ${dialDuration}s` : ""}`,
      })
      .eq("call_sid", callSid);
  }

  if (PICKED_UP.has(dialStatus)) {
    return twimlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`);
  }

  if (!FELL_THROUGH.has(dialStatus) && dialStatus !== "") {
    console.warn(`[ai-concierge] dial-status: unexpected DialCallStatus="${dialStatus}"; falling through to Sarah`);
  }

  return twimlResponse(buildSarahGreetingTwiml(request, SARAH_GREETING_AFTER_RING));
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "AI Concierge dial-status (ring-first fallback)",
    method: "POST (Twilio only); validates X-Twilio-Signature",
  });
}
