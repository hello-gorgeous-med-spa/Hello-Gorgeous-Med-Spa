// ============================================================
// TELNYX WEBHOOK SIGNATURE VERIFICATION (Ed25519)
// Message = timestamp + "|" + rawBody. Headers: telnyx-timestamp, telnyx-signature-ed25519.
// Public key from: https://portal.telnyx.com/#/api-keys/public-key
// ============================================================

import crypto from 'crypto';

const TIMESTAMP_TOLERANCE_SEC = 300; // 5 minutes

/**
 * Verify Telnyx webhook signature.
 * Returns true if valid or if verification is skipped (no key/signature). Returns false if verification fails.
 */
export function verifyTelnyxWebhook(
  rawBody: string,
  timestampHeader: string | null,
  signatureHeader: string | null,
  publicKeyPem: string | undefined
): boolean {
  if (!publicKeyPem?.trim()) return true; // skip verification when key not set
  if (!timestampHeader || !signatureHeader) return false;

  const timestamp = timestampHeader.trim();
  const signatureB64 = signatureHeader.trim();
  if (!timestamp || !signatureB64) return false;

  // Replay: timestamp within tolerance
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > TIMESTAMP_TOLERANCE_SEC) return false;

  const message = timestamp + '|' + rawBody;
  let key: string | Buffer = publicKeyPem.trim();
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');

  try {
    const sig = Buffer.from(signatureB64, 'base64');
    return crypto.verify('ed25519', Buffer.from(message, 'utf8'), key, sig);
  } catch {
    return false;
  }
}
