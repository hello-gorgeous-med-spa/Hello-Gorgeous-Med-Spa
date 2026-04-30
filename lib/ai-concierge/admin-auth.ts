// Cookie-based admin auth helper for AI Concierge diagnostics / settings APIs.
// Mirrors the role gate in middleware.ts (`hgos_session` JSON cookie).

import { cookies } from "next/headers";

export type AiConciergeStaffRole = "owner" | "admin" | "staff";

export interface AiConciergeStaffSession {
  userId: string;
  role: AiConciergeStaffRole;
  email?: string;
}

const STAFF_ROLES: ReadonlySet<string> = new Set(["owner", "admin", "staff"]);

/** Returns staff session if the request has a valid owner|admin|staff cookie; otherwise null. */
export async function getAiConciergeStaffSession(): Promise<AiConciergeStaffSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("hgos_session")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      userId?: string;
      role?: string;
      email?: string;
    };
    if (!parsed.userId || !parsed.role || !STAFF_ROLES.has(parsed.role)) return null;
    return {
      userId: parsed.userId,
      role: parsed.role as AiConciergeStaffRole,
      email: parsed.email,
    };
  } catch {
    return null;
  }
}
