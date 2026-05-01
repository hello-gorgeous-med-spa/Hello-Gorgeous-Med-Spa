// Shared TwiML helpers for AI Concierge voice routes.
// Centralizing greeting + Gather XML so /voice/incoming and /voice/dial-status
// stay in sync (same greeting, same gather URL, same Polly voice).

import { NextResponse, type NextRequest } from "next/server";

export const SARAH_GREETING =
  "Hello! Thank you for calling Hello Gorgeous Med Spa. This is Sarah. How can I help you today?";

export const SARAH_GREETING_AFTER_RING =
  "Sorry we missed you. This is Sarah, the Hello Gorgeous Med Spa assistant. How can I help you today?";

export function twimlResponse(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Greeting + Gather speech, looping back to /voice/gather. */
export function buildSarahGreetingTwiml(
  request: NextRequest,
  greeting: string = SARAH_GREETING,
): string {
  const gatherUrl = new URL(
    "/api/ai-concierge/voice/gather",
    request.nextUrl.origin,
  ).toString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${escapeXml(greeting)}</Say>
  <Gather input="speech" action="${escapeXml(gatherUrl)}" method="POST" language="en-US" speechTimeout="auto" inputTimeout="5">
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">I did not catch that. Please call back or text us, and we will help you right away. Goodbye.</Say>
  <Hangup/>
</Response>`;
}
