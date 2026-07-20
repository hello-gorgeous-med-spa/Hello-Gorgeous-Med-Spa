/**
 * AI Concierge voice (Twilio + Sarah) — opt-in via env.
 * Default OFF: front desk uses Xfinity/Comcast + staff mobiles. Twilio must not
 * answer or hang up callers — if a stray webhook still hits us, bridge to the
 * published shop line so Xfinity handles the call.
 */

/** Published Xfinity main line (SITE.phone) — E.164 for TwiML &lt;Dial&gt;. */
const XFINITY_MAIN_E164 = "+16306366193";

export function isAiConciergeVoiceEnabled(): boolean {
  const raw = process.env.AI_CONCIERGE_VOICE_ENABLED?.trim().toLowerCase();
  if (!raw) return false;
  if (["1", "true", "yes", "on"].includes(raw)) return true;
  if (["0", "false", "no", "off"].includes(raw)) return false;
  return false;
}

/** When voice AI is off: bridge to Xfinity (never silent hangup). */
export const VOICE_DISABLED_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="45" answerOnBridge="true">${XFINITY_MAIN_E164}</Dial>
</Response>`;
