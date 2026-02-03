// ============================================================
// MIDDLEWARE
// Handle subdomain routing for book.hellogorgeousmedspa.com
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
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
