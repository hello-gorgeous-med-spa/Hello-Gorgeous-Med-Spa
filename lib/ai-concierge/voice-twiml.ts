// Shared TwiML helpers for AI Concierge voice routes.
// Centralizing greeting + Gather XML so /voice/incoming and /voice/dial-status
// stay in sync. Also the single source of truth for Sarah's voice — change
// SARAH_VOICE here and every TwiML <Say> across the concierge picks it up.

import { NextResponse, type NextRequest } from "next/server";

// Twilio Neural Polly — order-of-magnitude more natural than the base voices.
// Swap to "Polly.Ruth-Generative" for Twilio's newest generative TTS, or wire
// ElevenLabs via Media Streams when we want premium voice.
export const SARAH_VOICE = "Polly.Joanna-Neural";

export const SARAH_GREETING =
  "Hi, this is Sarah at Hello Gorgeous. Dani's with a client right now — happy to help, or I can take a message. What's going on?";

export const SARAH_GREETING_AFTER_RING =
  "Hey — sorry we missed you. This is Sarah, Dani's assistant. What can I help with?";

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
  <Say voice="${SARAH_VOICE}" language="en-US">${escapeXml(greeting)}</Say>
  <Gather input="speech" action="${escapeXml(gatherUrl)}" method="POST" language="en-US" speechTimeout="auto" inputTimeout="5">
  </Gather>
  <Say voice="${SARAH_VOICE}" language="en-US">Didn't catch that. Try us back or send a text — we'll get right back to you.</Say>
  <Hangup/>
</Response>`;
}
