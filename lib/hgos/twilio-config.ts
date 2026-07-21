// ============================================================
// Twilio config for SMS marketing (from env)
// Prefer Messaging Service (A2P) when TWILIO_MESSAGING_SERVICE_SID is set.
// ============================================================

import type { SMSConfig } from "./sms-marketing";

export function getTwilioSmsConfig(): SMSConfig {
  return {
    provider: "twilio",
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    twilioMessagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID?.trim() || undefined,
  };
}

/** SID + token + (Messaging Service OR From number). */
export function isTwilioConfigured(): boolean {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();
  const msid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  return !!(sid && token && (msid || from));
}

/** Public display for Text Studio / JOIN QR (Twilio DID). */
export function getTwilioDisplayPhone(): string {
  const raw = process.env.TWILIO_PHONE_NUMBER?.trim() || "+16308645231";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}
