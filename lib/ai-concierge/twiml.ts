/** Escape text inside Twilio <Say> TwiML (speech). */
export function escapeTwiMLSayText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Strip markdown-ish asterisks and collapse whitespace for spoken output. */
export function sanitizeSpeechText(raw: string): string {
  return raw.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().slice(0, 4500);
}
