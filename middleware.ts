// ============================================================
// MIDDLEWARE
// Handle subdomain routing and authentication
// ============================================================
// CLIENT LOGIN: /login is client-only (magic link). Never apply admin auth to /login.
// Admin auth guard applies ONLY to /admin and /admin/* (and /provider, /portal, /pos).
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication (admin guard applies only to these)
const PROTECTED_ROUTES = ['/admin', '/provider', '/portal', '/pos'];
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  // /login is always publicly accessible — never redirect unauthenticated users away
  if (pathname === '/login' || pathname.startsWith('/login/')) {
    const sessionCookie = request.cookies.get('hgos_session');
    let isAuthenticated = false;
    if (sessionCookie?.value) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
        const validRoles = ['owner', 'admin', 'staff', 'provider', 'client'];
        isAuthenticated = !!(sessionData.userId && sessionData.role && validRoles.includes(sessionData.role));
      } catch {
        isAuthenticated = false;
      }
    }
    // Only redirect clients to portal; allow staff/admin to reach /login so they can use "Staff sign in" or see client form
    if (isAuthenticated && sessionCookie?.value) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
        if (sessionData.role === 'client') {
          return NextResponse.redirect(new URL('/portal', request.url));
        }
      } catch {
        // ignore
      }
      // Staff/admin/provider: allow through to /login (page will redirect only if returnTo indicates admin)
    }
    return NextResponse.next();
  }

  // Check for auth session cookie and validate it has required data
  const sessionCookie = request.cookies.get('hgos_session');
  let isAuthenticated = false;

  if (sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
      const validRoles = ['owner', 'admin', 'staff', 'provider', 'client'];
      isAuthenticated = !!(sessionData.userId && sessionData.role && validRoles.includes(sessionData.role));
    } catch {
      isAuthenticated = false;
    }
  }

  // Check if accessing from book.hellogorgeousmedspa.com subdomain
  if (hostname.startsWith('book.')) {
    // If they're on the booking subdomain and NOT already on /book
    if (url.pathname === '/') {
      // Rewrite root to /book
      url.pathname = '/book';
      return NextResponse.rewrite(url);
    }
    
    // If they try to access other pages from booking subdomain
    // Allow /book paths but redirect others to main domain
    if (!url.pathname.startsWith('/book') && 
        !url.pathname.startsWith('/_next') && 
        !url.pathname.startsWith('/api') &&
        !url.pathname.includes('.')) {
      // Redirect to main domain for non-booking pages
      const mainDomain = hostname.replace('book.', '');
      return NextResponse.redirect(`https://${mainDomain}${url.pathname}`);
    }
  }
  
  // Check if this is a protected route (admin, provider, portal, pos only)
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    url.pathname === route || url.pathname.startsWith(`${route}/`)
  );

  // Redirect to /login (client login) if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
