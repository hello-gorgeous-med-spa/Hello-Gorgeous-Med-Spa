// ============================================================
// LOGOUT API ROUTE
// Clears session cookie
// INCLUDES: HIPAA audit logging for logout events
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { auditAuthLogout, getSessionFromRequest } from '@/lib/audit/middleware';

export async function POST(request: NextRequest) {
  // Get session before clearing
  const session = await getSessionFromRequest(request);
  
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set('hgos_session', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
  });
  
  // AUDIT LOG: Logout event
  if (session.userId) {
    await auditAuthLogout(session.userId, request);
  }
  
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hellogorgeousmedspa.com'));
  
  // Clear the session cookie
  response.cookies.set('hgos_session', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
  });
  
  return response;
}
