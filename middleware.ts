// ============================================================
// MIDDLEWARE
// Handle subdomain routing and authentication
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/provider', '/portal', '/pos'];
// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Check for auth session cookie and validate it has required data
  const sessionCookie = request.cookies.get('hgos_session');
  let isAuthenticated = false;
  
  if (sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
      // Must have userId and a valid role
      const validRoles = ['owner', 'admin', 'staff', 'provider', 'client'];
      isAuthenticated = !!(sessionData.userId && sessionData.role && validRoles.includes(sessionData.role));
    } catch {
      // Invalid cookie, treat as not authenticated
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
  
  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    url.pathname === route || url.pathname.startsWith(`${route}/`)
  );
  
  // Check if this is an auth route (login page)
  const isAuthRoute = AUTH_ROUTES.some(route => 
    url.pathname === route || url.pathname.startsWith(`${route}/`)
  );
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', url.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to admin if accessing login page while already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
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
