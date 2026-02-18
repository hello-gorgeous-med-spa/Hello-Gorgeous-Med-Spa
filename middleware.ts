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

  // .well-known (Apple Pay, etc.) — never redirect, never auth
  if (pathname.startsWith('/.well-known/')) {
    return NextResponse.next();
  }

  // Portal login/verify — always publicly accessible (magic link flow)
  if (pathname === '/portal/login' || pathname === '/portal/verify') {
    return NextResponse.next();
  }

  // /login is always publicly accessible — never redirect unauthenticated users away
  if (pathname === '/login' || pathname.startsWith('/login/')) {
  const sessionCookie = request.cookies.get('hgos_session');
  const portalSessionCookie = request.cookies.get('portal_session');
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
  const portalSessionCookie = request.cookies.get('portal_session');
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

  // For /portal/* (excluding login/verify), portal_session counts as authenticated
  const isPortalRoute = pathname === '/portal' || (pathname.startsWith('/portal/') && pathname !== '/portal/login' && pathname !== '/portal/verify');
  if (isPortalRoute && !isAuthenticated && portalSessionCookie?.value) {
    isAuthenticated = true;
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

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const isPortalRoute = pathname === '/portal' || pathname.startsWith('/portal/');
    const loginPath = isPortalRoute ? '/portal/login' : '/login';
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('returnTo', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access: /admin and /pos require admin-level roles; clients must not access
  if (isProtectedRoute && isAuthenticated && sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
      const role = sessionData.role;
      const adminRoles = ['owner', 'admin', 'staff'];

      // /admin/* — only owner, admin, staff. Redirect clients and providers to /
      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        if (!adminRoles.includes(role)) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      // /pos/* — only owner, admin, staff
      if (pathname === '/pos' || pathname.startsWith('/pos/')) {
        if (!adminRoles.includes(role)) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      // /provider/* — owner, admin, staff, provider. Clients cannot access.
      if (pathname === '/provider' || pathname.startsWith('/provider/')) {
        if (role === 'client') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      // /portal/* — clients and admin roles (for support). Providers have own area.
      if (pathname === '/portal' || pathname.startsWith('/portal/')) {
        if (role === 'provider') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch {
      // Invalid session — redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run middleware on specific paths — .well-known excluded so Apple Pay verification is never touched
export const config = {
  matcher: ['/((?!\\.well-known).*)'],
};
