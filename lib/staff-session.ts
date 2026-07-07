/**
 * Shared staff PIN gate — /staff hub, protocols, and static /staff/* assets.
 * Web Crypto HMAC-SHA256 (Edge + Node).
 */

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const STAFF_SESSION_COOKIE_NAME = "hg_staff_session";

function getSecret(): string {
  return (
    process.env.STAFF_SESSION_SECRET ||
    process.env.HUB_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 48) ||
    "dev-staff-session-change-me"
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
  return crypto.subtle.importKey("raw", hash, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function encodePayload(exp: number): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify({ staff: true, exp })));
}

export async function signStaffSession(): Promise<string> {
  const exp = Date.now() + MAX_AGE_MS;
  const payload = encodePayload(exp);
  const key = await importHmacKey(getSecret());
  const sigBuf = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

export async function verifyStaffSessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!payload || !sigB64) return false;
  try {
    const key = await importHmacKey(getSecret());
    const sigBytes = fromBase64Url(sigB64);
    const data = new TextEncoder().encode(payload);
    const ok = await crypto.subtle.verify({ name: "HMAC", hash: "SHA-256" }, key, sigBytes, data);
    if (!ok) return false;
    const json = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      staff?: boolean;
      exp?: number;
    };
    if (!json.staff) return false;
    if (!json.exp || Date.now() > json.exp) return false;
    return true;
  } catch {
    return false;
  }
}

/** Set STAFF_PORTAL_PIN in Vercel / .env.local (e.g. 070726). Gate is off if unset. */
export function getStaffPortalPin(): string | null {
  const pin = process.env.STAFF_PORTAL_PIN?.trim();
  return pin || null;
}

export function staffPortalGateEnabled(): boolean {
  return !!getStaffPortalPin();
}

export function pinMatches(input: string, expected: string): boolean {
  const a = input.trim();
  const b = expected.trim();
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isStaffProtectedPath(pathname: string): boolean {
  return pathname === "/staff" || pathname.startsWith("/staff/");
}

export function isStaffLoginPath(pathname: string): boolean {
  return pathname === "/staff/login" || pathname.startsWith("/staff/login/");
}

export const STAFF_ADMIN_BYPASS_ROLES = new Set(["owner", "admin", "staff", "provider"]);
