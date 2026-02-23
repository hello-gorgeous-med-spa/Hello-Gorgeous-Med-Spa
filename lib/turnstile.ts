/**
 * Cloudflare Turnstile server-side verification.
 * Call before running AI to block bots. When TURNSTILE_SECRET_KEY is set, token is required.
 */
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string | null | undefined): Promise<{
  success: boolean;
  error?: string;
}> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret?.trim()) {
    return { success: true };
  }
  if (!token || typeof token !== "string" || token.length > 2048) {
    return { success: false, error: "Missing or invalid Turnstile token" };
  }
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { success: true };
    const codes = data["error-codes"] ?? [];
    return { success: false, error: codes.length ? codes.join(", ") : "Turnstile verification failed" };
  } catch (e) {
    console.error("Turnstile verify error", e);
    return { success: false, error: "Verification service unavailable" };
  }
}
