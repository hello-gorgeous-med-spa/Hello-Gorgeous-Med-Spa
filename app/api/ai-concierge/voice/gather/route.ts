// Twilio Voice — <Gather> speech → Claude (Sarah) → TwiML
// Requires ANTHROPIC_API_KEY; without it, falls back to stub.

import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages/messages";
import { NextRequest, NextResponse } from "next/server";
import { getConciergeTransferE164Async } from "@/lib/ai-concierge/constants";
import { loadKnowledgeSnippets, parseTranscript, saveBookingRequest, stringifyTranscript, updateCallTranscript, type BookingToolInput, type TranscriptTurn } from "@/lib/ai-concierge/db";
import { sendBookingEmailToStaff } from "@/lib/ai-concierge/email";
import { sendBookingSmsToStaff } from "@/lib/ai-concierge/sms";
import { buildSarahSystemPrompt } from "@/lib/ai-concierge/prompt";
import { sarahTools } from "@/lib/ai-concierge/tools";
import { escapeTwiMLSayText, sanitizeSpeechText } from "@/lib/ai-concierge/twiml";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function twimlResponse(xml: string) {
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function stubHangupXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Thanks! Our team will call you back shortly. Goodbye.</Say>
  <Hangup/>
</Response>`;
}

function transferXml(toE164: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Absolutely! Let me connect you with our team right now. Please hold.</Say>
  <Dial>${escapeTwiMLSayText(toE164)}</Dial>
</Response>`;
}

async function transferXmlAsync(): Promise<string> {
  const n = await getConciergeTransferE164Async();
  return transferXml(n);
}

function sayGatherXml(request: NextRequest, innerSay: string): string {
  const gatherUrl = new URL("/api/ai-concierge/voice/gather", request.nextUrl.origin).toString();
  const safe = escapeTwiMLSayText(sanitizeSpeechText(innerSay));
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${safe}</Say>
  <Gather input="speech" action="${escapeTwiMLSayText(gatherUrl)}" method="POST" language="en-US" speechTimeout="auto" inputTimeout="5">
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">Sorry, I did not catch that. Goodbye.</Say>
  <Hangup/>
</Response>`;
}

function bookingCompleteXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Perfect! I have sent your request to our team. You should get a text within about ten minutes to confirm your appointment time. Thank you for calling Hello Gorgeous Med Spa!</Say>
  <Hangup/>
</Response>`;
}

function turnsToApiMessages(turns: TranscriptTurn[]): MessageParam[] {
  return turns.map((t) => ({ role: t.role, content: t.content }));
}

function toolInput(obj: unknown): Record<string, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj) ? (obj as Record<string, unknown>) : {};
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const form = new URLSearchParams(raw);
  const formObject = Object.fromEntries(form.entries());

  if (!twilioSignatureValid(request, raw, formObject)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const callSid = form.get("CallSid") ?? "";
  const from = form.get("From") ?? "";
  const speechResult = (form.get("SpeechResult") ?? "").trim();

  if (!callSid) {
    return NextResponse.json({ error: "Missing CallSid" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[ai-concierge] ANTHROPIC_API_KEY unset — stub TwiML");
    return twimlResponse(stubHangupXml());
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return twimlResponse(await transferXmlAsync());
  }

  const { data: callRow } = await admin
    .from("ai_concierge_calls")
    .select("transcript, started_at")
    .eq("call_sid", callSid)
    .maybeSingle();

  let turns = parseTranscript(callRow?.transcript ?? null);

  if (!speechResult) {
    const reprompt = "I did not hear anything. Could you repeat that in a few words?";
    const t = [...turns, { role: "user" as const, content: "(caller was silent)" }];
    await updateCallTranscript(callSid, t);
    return twimlResponse(sayGatherXml(request, reprompt));
  }

  turns = [...turns, { role: "user", content: speechResult }];

  let kb = "";
  try {
    kb = await loadKnowledgeSnippets();
  } catch {
    kb = "";
  }

  const system = buildSarahSystemPrompt(kb);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-20250514";

  try {
    const msg = await anthropic.messages.create({
      model,
      max_tokens: 900,
      system,
      messages: turnsToApiMessages(turns),
      tools: sarahTools(),
    });

    // Prefer tool calls over plain text when both are present
    const toolFirst = [...msg.content].sort((a, b) =>
      a.type === "tool_use" ? -1 : b.type === "tool_use" ? 1 : 0,
    );

    for (const block of toolFirst) {
      if (block.type === "tool_use") {
        if (block.name === "transfer_call") {
          const transferTo = await getConciergeTransferE164Async();
          await admin
            .from("ai_concierge_calls")
            .update({
              action_taken: "transferred",
              transferred_to: transferTo,
              transcript: stringifyTranscript(turns),
            })
            .eq("call_sid", callSid);
          return twimlResponse(transferXml(transferTo));
        }

        if (block.name === "collect_booking_info") {
          const input = toolInput(block.input);
          const booking: BookingToolInput = {
            client_name: String(input.client_name ?? "").trim(),
            client_phone: String(input.client_phone ?? "").trim(),
            service: String(input.service ?? "").trim(),
            preferred_date: input.preferred_date != null ? String(input.preferred_date) : undefined,
            preferred_time: input.preferred_time != null ? String(input.preferred_time) : undefined,
            is_new_client: typeof input.is_new_client === "boolean" ? input.is_new_client : undefined,
          };

          if (!booking.client_name || !booking.client_phone || !booking.service) {
            const fix =
              "I still need your full name, best phone number, and which service. Could you tell me those now?";
            turns = [...turns, { role: "assistant", content: fix }];
            await updateCallTranscript(callSid, turns);
            return twimlResponse(sayGatherXml(request, fix));
          }

          const saved = await saveBookingRequest(callSid, booking);
          if (!saved.ok) {
            return twimlResponse(await transferXmlAsync());
          }

          await sendBookingSmsToStaff(booking, { recordingUrl: null });
          await sendBookingEmailToStaff(booking, {
            callSid,
            fromNumber: from,
            startedAt: callRow?.started_at ?? null,
          });

          const thanks =
            "Perfect! I have sent your request to our team. You should get a text within about ten minutes to confirm.";
          turns = [...turns, { role: "assistant", content: thanks }];
          await updateCallTranscript(callSid, turns, {
            summary: `Booking: ${booking.service} — ${booking.client_name}`,
          });
          return twimlResponse(bookingCompleteXml());
        }
      }
    }

    const textParts: string[] = [];
    for (const block of msg.content) {
      if (block.type === "text") textParts.push(block.text);
    }
    const reply = sanitizeSpeechText(textParts.join("\n")) || "How else can I help you today?";
    turns = [...turns, { role: "assistant", content: reply }];
    await updateCallTranscript(callSid, turns, { action_taken: "answered_question" });
    return twimlResponse(sayGatherXml(request, reply));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown gather error";
    console.error("[ai-concierge] gather Claude error:", e);
    const transferTo = await getConciergeTransferE164Async();
    try {
      await admin
        .from("ai_concierge_calls")
        .update({
          action_taken: "gather_error_transferred",
          transferred_to: transferTo,
          transcript: stringifyTranscript(turns),
          summary: `Gather failed → transferred. ${errorMessage}`.slice(0, 500),
        })
        .eq("call_sid", callSid);
    } catch (dbErr) {
      console.error("[ai-concierge] failed to record gather-error transfer:", dbErr);
    }
    return twimlResponse(transferXml(transferTo));
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "AI Concierge gather (Claude)", method: "POST (Twilio only)" });
}
