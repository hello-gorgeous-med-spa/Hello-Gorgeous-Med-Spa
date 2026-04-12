// WhatsApp sender: Twilio-approved WhatsApp number (E.164, no whatsapp: prefix in env)

export function getTwilioWhatsAppFromAddress(): string | null {
  const raw = process.env.TWILIO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const n = raw.startsWith("whatsapp:") ? raw.slice("whatsapp:".length).trim() : raw;
  return n || null;
}

export function isTwilioWhatsAppConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    getTwilioWhatsAppFromAddress()
  );
}
