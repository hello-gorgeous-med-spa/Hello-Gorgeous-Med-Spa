/**
 * AI Concierge voice (Twilio + Sarah) — opt-in via env.
 * Jul 2026: front desk uses Comcast voicemail; voice is off by default.
 */

export function isAiConciergeVoiceEnabled(): boolean {
  const raw = process.env.AI_CONCIERGE_VOICE_ENABLED?.trim().toLowerCase();
  if (!raw) return false;
  if (["1", "true", "yes", "on"].includes(raw)) return true;
  if (["0", "false", "no", "off"].includes(raw)) return false;
  return false;
}

export const VOICE_DISABLED_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`;
