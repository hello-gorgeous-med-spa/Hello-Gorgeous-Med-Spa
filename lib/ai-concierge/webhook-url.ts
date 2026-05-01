// Canonical Twilio webhook URL derivation.
//
// Twilio's signature verification is host+path sensitive: the signing URL must
// match the URL Twilio actually calls. Diagnostics, the Copy button, and the
// self-test must all agree on a single canonical host so we don't compute one
// URL on `hub.*` and call a different one when Twilio dials in.

import type { NextRequest } from "next/server";

export const AI_CONCIERGE_INCOMING_PATH = "/api/ai-concierge/voice/incoming";

/**
 * Resolve the canonical public origin (scheme + host) for AI Concierge webhooks.
 *
 * Precedence:
 *   1. `NEXT_PUBLIC_AI_CONCIERGE_BASE_URL` — explicit override (e.g. preview deploys)
 *   2. `NEXT_PUBLIC_SITE_URL` — site-wide canonical
 *   3. Request host with `hub.` stripped (staff Command Center → main apex)
 *   4. Plain request host (last resort)
 *
 * Always returns `https://...` in production-like contexts; falls back to the
 * request's protocol locally.
 */
export function canonicalWebhookOrigin(request: NextRequest): string {
  const explicit =
    process.env.NEXT_PUBLIC_AI_CONCIERGE_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(explicit);
  }

  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (request.nextUrl.protocol === "https:" ? "https" : "http");
  const rawHost =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    new URL(request.url).host;

  const host = rawHost.toLowerCase().startsWith("hub.")
    ? rawHost.replace(/^hub\./i, "")
    : rawHost;

  return `${proto}://${host}`;
}

export function canonicalWebhookUrl(request: NextRequest): string {
  return `${canonicalWebhookOrigin(request)}${AI_CONCIERGE_INCOMING_PATH}`;
}

function stripTrailingSlash(s: string): string {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}
