// ============================================================
// Get owner session from hgos_session cookie (API routes)
// Used for Admin Commands and other owner-only APIs
// ============================================================

import { cookies } from 'next/headers';
import { parseHgosSessionCookie, resolveSessionRole } from '@/lib/hgos-session';

export interface OwnerSession {
  userId: string;
  role: 'owner';
  email: string;
}

/**
 * Returns owner session if the request has a valid owner cookie; otherwise null.
 * Use in API routes that must be owner-only.
 */
export async function getOwnerSession(): Promise<OwnerSession | null> {
  const cookieStore = await cookies();
  const parsed = parseHgosSessionCookie(cookieStore.get('hgos_session')?.value);
  if (!parsed?.userId) return null;
  const email = typeof parsed.email === 'string' ? parsed.email : '';
  const role = resolveSessionRole(parsed.role, email);
  if (role === 'owner' && parsed.userId) {
    return {
      userId: parsed.userId,
      role: 'owner',
      email,
    };
  }
  return null;
}
