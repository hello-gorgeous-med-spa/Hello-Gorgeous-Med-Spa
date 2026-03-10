// ============================================================
// GET /api/auth/session — Admin/staff session from hgos_session cookie
// Returns { role, userId } for role-based nav and UI. No PII.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

const VALID_ROLES = ['owner', 'admin', 'staff', 'provider', 'client', 'readonly'] as const;

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('hgos_session')?.value;
    if (!cookie) {
      return NextResponse.json({ role: null, userId: null });
    }
    const sessionData = JSON.parse(decodeURIComponent(cookie));
    const role = sessionData?.role && VALID_ROLES.includes(sessionData.role) ? sessionData.role : null;
    const userId = sessionData?.userId ?? null;
    return NextResponse.json({ role, userId });
  } catch {
    return NextResponse.json({ role: null, userId: null });
  }
}
