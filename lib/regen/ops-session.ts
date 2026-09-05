import { NextRequest, NextResponse } from 'next/server';
import { OPS_STAFF, getOpsStaff, type OpsStaffId } from '@/lib/regen/ops-staff';

export const OPS_SESSION_COOKIE = 'regen_ops_session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type OpsStaffMember = (typeof OPS_STAFF)[number];

function getSecret(): string {
  return (
    process.env.REGEN_OPS_SESSION_SECRET ||
    process.env.HUB_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 48) ||
    'dev-regen-ops-session-change-me'
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', hash, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signOpsSession(staffId: OpsStaffId): Promise<string> {
  const exp = Date.now() + MAX_AGE_MS;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ u: staffId, exp })));
  const key = await importHmacKey(getSecret());
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

export async function verifyOpsSessionToken(token?: string | null): Promise<OpsStaffMember | null> {
  if (!token || !token.includes('.')) return null;
  const dot = token.lastIndexOf('.');
  const payload = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!payload || !sigB64) return null;
  try {
    const key = await importHmacKey(getSecret());
    const ok = await crypto.subtle.verify('HMAC', key, fromBase64Url(sigB64), new TextEncoder().encode(payload));
    if (!ok) return null;
    const json = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { u?: string; exp?: number };
    if (!json.exp || Date.now() > json.exp) return null;
    return getOpsStaff(json.u);
  } catch {
    return null;
  }
}

export function passwordsForStaff(id: OpsStaffId): string[] {
  const specific = process.env[`REGEN_OPS_PASSWORD_${id.toUpperCase()}`];
  if (specific) return [specific];
  if (process.env.REGEN_OPS_PASSWORD) return [process.env.REGEN_OPS_PASSWORD];
  return ['regenrx2026', 'gorgeous'];
}

export function passwordMatches(id: OpsStaffId, password: string): boolean {
  return passwordsForStaff(id).includes(password);
}

export function opsSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  };
}

export async function getOpsSessionFromRequest(request: NextRequest): Promise<OpsStaffMember | null> {
  return verifyOpsSessionToken(request.cookies.get(OPS_SESSION_COOKIE)?.value);
}

export async function requireOpsAuth(request: NextRequest): Promise<
  { staff: OpsStaffMember; error?: undefined } | { staff?: undefined; error: NextResponse }
> {
  const staff = await getOpsSessionFromRequest(request);
  if (!staff) {
    return { error: NextResponse.json({ error: 'Staff sign-in required' }, { status: 401 }) };
  }
  return { staff };
}
