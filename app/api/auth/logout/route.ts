// ============================================================
// LOGOUT API ROUTE
// Clears session cookie
// ============================================================

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set('hgos_session', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
  });
  
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
