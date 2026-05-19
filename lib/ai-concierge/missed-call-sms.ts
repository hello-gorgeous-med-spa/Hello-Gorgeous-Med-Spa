// Missed-call text-back. When ring-first falls through (busy / no-answer /
// failed / canceled) we fire one branded SMS to the caller within ~60s so the
// lead doesn't drift to a competitor while waiting on us. Idempotent per call:
// stamps `missed_sms_sent_at` on the call row so retries don't double-text.

import { sendSms } from "@/lib/notifications/sms-outbound";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { normalizeToE164 } from "@/lib/phone-e164";
import { BOOKING_URL } from "@/lib/flows";

const FALLBACK_BOOK_URL = "https://www.hellogorgeousmedspa.com/book";

function buildMissedCallText(bookingUrl: string): string {
  return [
    "Hello Gorgeous Med Spa: Sorry we missed your call!",
    `Book online: ${bookingUrl}`,
    "Or reply here and we'll text you back ASAP. — Hello Gorgeous",
  ].join(" ");
}

export type MissedCallSendResult = {
  ok: boolean;
  reason?:
    | "missing_caller"
    | "missing_callsid"
    | "twilio_failed"
    | "already_sent"
    | "db_error";
  twilioMessageId?: string | null;
  to?: string;
};

/**
 * Send the missed-call text-back. Safe to call from a Twilio webhook — never
 * throws, always resolves with a structured result.
 */
export async function sendMissedCallSms(input: {
  callSid: string;
  fromNumber: string | null | undefined;
}): Promise<MissedCallSendResult> {
  const callSid = input.callSid?.trim();
  if (!callSid) return { ok: false, reason: "missing_callsid" };

  const callerE164 = normalizeToE164(input.fromNumber ?? null);
  if (!callerE164) return { ok: false, reason: "missing_caller" };

  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      const { data: existing } = await admin
        .from("ai_concierge_calls")
        .select("missed_sms_sent_at")
        .eq("call_sid", callSid)
        .maybeSingle();
      if (existing && (existing as { missed_sms_sent_at?: string | null }).missed_sms_sent_at) {
        return { ok: true, reason: "already_sent", to: callerE164 };
      }
    } catch (err) {
      console.warn("[missed-call-sms] dedupe lookup failed:", err);
    }
  }

  const bookingUrl = BOOKING_URL || FALLBACK_BOOK_URL;

  const text = buildMissedCallText(bookingUrl);
  const result = await sendSms(callerE164, text);

  if (admin && result.success) {
    try {
      await admin
        .from("ai_concierge_calls")
        .update({
          missed_sms_sent_at: new Date().toISOString(),
          missed_sms_message_id: result.providerMessageId ?? null,
        })
        .eq("call_sid", callSid);
    } catch (err) {
      console.warn("[missed-call-sms] failed to stamp missed_sms_sent_at:", err);
    }
  }

  if (!result.success) {
    console.error("[missed-call-sms] Twilio send failed:", result.error);
    return { ok: false, reason: "twilio_failed", to: callerE164 };
  }

  return { ok: true, twilioMessageId: result.providerMessageId, to: callerE164 };
}
