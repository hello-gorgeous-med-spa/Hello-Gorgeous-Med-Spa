/**
 * Hello Gorgeous Command Center — signed session cookie (Dani / Ryan).
 * Web Crypto HMAC-SHA256 only (works in Edge middleware and Node route handlers).
 */

export type HubUser = "dani" | "ryan";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const HUB_SESSION_COOKIE_NAME = "hg_hub_session";

function getSecret(): string {
  return (
    process.env.HUB_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 48) ||
    "dev-hub-session-change-me"
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", hash, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function encodePayload(user: HubUser, exp: number): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify({ u: user, exp })));
}

/** Create signed token: payloadBase64url.signatureBase64url */
export async function signHubSession(user: HubUser): Promise<string> {
  const exp = Date.now() + MAX_AGE_MS;
  const payload = encodePayload(user, exp);
  const key = await importHmacKey(getSecret());
  const sigBuf = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    key,
    new TextEncoder().encode(payload)
  );
  return `${payload}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

export async function verifyHubSessionToken(token: string | undefined | null): Promise<HubUser | null> {
  if (!token || !token.includes(".")) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!payload || !sigB64) return null;
  try {
    const key = await importHmacKey(getSecret());
    const sigBytes = fromBase64Url(sigB64);
    const data = new TextEncoder().encode(payload);
    const ok = await crypto.subtle.verify({ name: "HMAC", hash: "SHA-256" }, key, sigBytes, data);
    if (!ok) return null;
    const json = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { u?: string; exp?: number };
    if (json.u !== "dani" && json.u !== "ryan") return null;
    if (!json.exp || Date.now() > json.exp) return null;
    return json.u;
  } catch {
    return null;
  }
}

export function hubPasswordGateEnabled(): boolean {
  return !!(process.env.HUB_PASSWORD_DANI?.trim() || process.env.HUB_PASSWORD_RYAN?.trim());
}
