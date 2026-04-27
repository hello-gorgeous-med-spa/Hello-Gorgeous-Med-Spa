// Twilio Voice — <Gather> speech callback (Phase 1 stub: polite exit until Claude loop ships)

import { NextRequest, NextResponse } from "next/server";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

export const dynamic = "force-dynamic";

function twimlResponse(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const form = new URLSearchParams(raw);
  const formObject = Object.fromEntries(form.entries());

  if (!twilioSignatureValid(request, raw, formObject)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  // SpeechResult / Digits / Stability — logged in Phase 2+ with Claude
  if (process.env.NODE_ENV === "development") {
    const speech = form.get("SpeechResult");
    if (speech) {
      console.log("[ai-concierge] gather SpeechResult (dev):", speech.slice(0, 200));
    }
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Thanks! Our team is still finishing this line. A receptionist will call you back shortly. Goodbye.</Say>
  <Hangup/>
</Response>`;

  return twimlResponse(twiml);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "AI Concierge gather (speech callback)",
    method: "POST (Twilio only)",
  });
}
