// Outbound WhatsApp via Twilio Messages API (session / staff chat — no SMS marketing footer)

import { getTwilioSmsConfig } from "@/lib/hgos/twilio-config";
import { getTwilioWhatsAppFromAddress, isTwilioWhatsAppConfigured } from "@/lib/hgos/twilio-whatsapp-config";
import { normalizeToE164 } from "@/lib/phone-e164";

export type SendWhatsAppResult = {
  success: boolean;
  providerMessageId: string | null;
  to: string;
  error?: string;
};

export async function sendWhatsApp(toRaw: string, text: string): Promise<SendWhatsAppResult> {
  if (!isTwilioWhatsAppConfigured()) {
    return {
      success: false,
      providerMessageId: null,
      to: toRaw,
      error:
        "WhatsApp via Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER.",
    };
  }

  const e164 = normalizeToE164(toRaw);
  if (!e164) {
    return { success: false, providerMessageId: null, to: toRaw, error: "Invalid phone number" };
  }

  const fromNum = getTwilioWhatsAppFromAddress()!;
  const config = getTwilioSmsConfig();
  if (!config.twilioAccountSid || !config.twilioAuthToken) {
    return { success: false, providerMessageId: null, to: toRaw, error: "Twilio credentials missing" };
  }

  const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString("base64");
  const body = new URLSearchParams({
    To: `whatsapp:${e164}`,
    From: `whatsapp:${fromNum}`,
    Body: text,
  });

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      },
    );
    const data = (await response.json()) as { sid?: string; message?: string; code?: number };
    if (response.ok && data.sid) {
      return { success: true, providerMessageId: data.sid, to: e164 };
    }
    const err = [data.message, data.code != null ? `[${data.code}]` : ""].filter(Boolean).join(" ");
    return { success: false, providerMessageId: null, to: e164, error: err || "Twilio WhatsApp send failed" };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, providerMessageId: null, to: e164, error: message };
  }
}
