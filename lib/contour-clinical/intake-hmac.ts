import { createHmac, timingSafeEqual } from "crypto";

const MSG = (caseId: string, exp: number) => `${caseId}.${exp}`;

function getSecret(): string {
  const s = process.env.CLINIC_INTAKE_HMAC_SECRET?.trim();
  if (s && s.length >= 16) return s;
  const fallback = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (process.env.NODE_ENV !== "production" && fallback && fallback.length >= 32) {
    return `dev:${createHmac("sha256", "clinic-intake").update(fallback).digest("hex")}`;
  }
  return "";
}

export function isIntakeHmacConfigured(): boolean {
  return getSecret().length > 0;
}

export function signClIntakeToken(caseId: string, expUnixSeconds: number): string {
  const secret = getSecret();
  if (!secret) throw new Error("CLINIC_INTAKE_HMAC_SECRET is not set");
  return createHmac("sha256", secret).update(MSG(caseId, expUnixSeconds)).digest("hex");
}

export function verifyClIntakeToken(caseId: string, expUnixSeconds: number, signatureHex: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  if (Date.now() / 1000 > expUnixSeconds) return false;
  const expected = createHmac("sha256", secret).update(MSG(caseId, expUnixSeconds)).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signatureHex.trim(), "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function hashClientFingerprint(secret: string, label: "ip" | "ua", value: string): string {
  const v = (value || "").trim().slice(0, 512);
  return createHmac("sha256", secret).update(`${label}:${v}`).digest("hex").slice(0, 48);
}

/** Same secret as link signing; returns nulls if HMAC is not configured. */
export function hashIntakeRequestMeta(ip: string, userAgent: string): { ip_hash: string | null; user_agent_hash: string | null } {
  const s = getSecret();
  if (!s) return { ip_hash: null, user_agent_hash: null };
  return {
    ip_hash: hashClientFingerprint(s, "ip", ip),
    user_agent_hash: hashClientFingerprint(s, "ua", userAgent),
  };
}
