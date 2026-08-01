/**
 * Shared hgos_session cookie parsing — Edge middleware + Node API routes + client sync.
 * Protected owner emails always resolve to role `owner` (Danielle must not land as staff).
 */

import { isProtectedOwner } from "@/lib/permissions";
import type { UserRole } from "@/lib/hgos/auth";

export const HGOS_SESSION_COOKIE_NAME = "hgos_session";

export const HGOS_VALID_ROLES = [
  "owner",
  "admin",
  "staff",
  "provider",
  "client",
  "readonly",
] as const satisfies readonly UserRole[];

export type HgosSessionPayload = {
  userId?: string;
  role?: string;
  email?: string;
};

export function parseHgosSessionCookie(
  raw: string | undefined | null,
): HgosSessionPayload | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as HgosSessionPayload;
  } catch {
    try {
      return JSON.parse(raw) as HgosSessionPayload;
    } catch {
      return null;
    }
  }
}

/** Canonical role for RBAC — protected owner emails always win. */
export function resolveSessionRole(
  role: string | undefined | null,
  email: string | undefined | null,
): UserRole | null {
  if (email && isProtectedOwner(email)) return "owner";
  if (role && (HGOS_VALID_ROLES as readonly string[]).includes(role)) {
    return role as UserRole;
  }
  return null;
}

export function isOwnerOrAdminRole(role: string | null | undefined): boolean {
  return role === "owner" || role === "admin";
}

export function buildHgosSessionCookieValue(user: {
  id: string;
  role: UserRole;
  email: string;
}): string {
  const role = resolveSessionRole(user.role, user.email) ?? user.role;
  return JSON.stringify({
    userId: user.id,
    role,
    email: user.email,
  });
}
