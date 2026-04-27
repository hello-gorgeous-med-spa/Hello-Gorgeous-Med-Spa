// Twilio Voice — "A call comes in" webhook (POST form-urlencoded)
// https://www.twilio.com/docs/voice/twiml

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

export const dynamic = "force-dynamic";

const SARAH_GREETING =
  "Hello! Thank you for calling Hello Gorgeous Med Spa. This is Sarah. How can I help you today?";

function twimlResponse(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

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

  const gatherUrl = new URL("/api/ai-concierge/voice/gather", request.nextUrl.origin).toString();

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${escapeXml(SARAH_GREETING)}</Say>
  <Gather input="speech" action="${escapeXml(
    gatherUrl,
  )}" method="POST" language="en-US" speechTimeout="auto" inputTimeout="5">
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">I did not catch that. Please call back or text us, and we will help you right away. Goodbye.</Say>
  <Hangup/>
</Response>`;

  return twimlResponse(twiml);
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
    method: "POST (Twilio only); validates X-Twilio-Signature",
  });
}
