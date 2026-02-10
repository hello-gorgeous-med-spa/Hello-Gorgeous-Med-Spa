// ============================================================
// Get owner session from hgos_session cookie (API routes)
// Used for Admin Commands and other owner-only APIs
// ============================================================

import { cookies } from 'next/headers';

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
  const sessionCookie = cookieStore.get('hgos_session');
  if (!sessionCookie?.value) return null;
  try {
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (sessionData.role === 'owner' && sessionData.userId && sessionData.email) {
      return {
        userId: sessionData.userId,
        role: 'owner',
        email: sessionData.email,
      };
    }
  } catch {
    // ignore
  }
  return null;
}
