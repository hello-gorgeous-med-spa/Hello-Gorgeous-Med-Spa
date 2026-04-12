import twilio from "twilio";
import type { NextRequest } from "next/server";

/** Twilio posts application/x-www-form-urlencoded; validate X-Twilio-Signature. */
export function twilioSignatureValid(
  request: NextRequest,
  rawBody: string,
  formObject: Record<string, string>,
): boolean {
  if (process.env.TWILIO_WEBHOOK_SKIP_SIGNATURE === "1") {
    return true;
  }
  const token = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get("x-twilio-signature");
  if (!token || !signature) return false;

  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  if (!host) return false;

  const path = request.nextUrl.pathname;
  const url = `${proto}://${host}${path}`;

  return twilio.validateRequest(token, signature, url, formObject);
}
