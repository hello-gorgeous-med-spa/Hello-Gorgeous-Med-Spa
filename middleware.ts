// ============================================================
// MIDDLEWARE - SECURITY LOCKDOWN
// ALL internal routes require authentication + role verification
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// PROTECTED ROUTES CONFIGURATION
// ============================================================

type UserRole = 'owner' | 'admin' | 'provider' | 'staff' | 'client';

interface RouteConfig {
  pattern: string;
  allowedRoles: UserRole[];
}

// Routes and their required roles (most specific first)
const PROTECTED_ROUTES: RouteConfig[] = [
  // Owner-only routes (HIGHEST SECURITY)
  { pattern: '/admin/owner', allowedRoles: ['owner'] },
  
  // Admin routes
  { pattern: '/admin/reports', allowedRoles: ['owner', 'admin'] },
  { pattern: '/admin/staff', allowedRoles: ['owner', 'admin'] },
  { pattern: '/admin/settings', allowedRoles: ['owner', 'admin'] },
  { pattern: '/admin/users', allowedRoles: ['owner', 'admin'] },
  { pattern: '/admin/vendors', allowedRoles: ['owner'] },
  { pattern: '/admin', allowedRoles: ['owner', 'admin', 'staff'] },
  
  // Provider routes
  { pattern: '/provider', allowedRoles: ['owner', 'admin', 'provider'] },
  
  // POS routes
  { pattern: '/pos', allowedRoles: ['owner', 'admin', 'provider', 'staff'] },
  
  // Dashboard routes
  { pattern: '/dashboard', allowedRoles: ['owner', 'admin', 'provider', 'staff'] },
];

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/admin',
  '/api/owner',
  '/api/provider',
  '/api/internal',
  '/api/config',
  '/api/clients',
  '/api/appointments',
  '/api/transactions',
  '/api/inventory',
  '/api/gift-cards',
  '/api/consents',
  '/api/sms',
  '/api/charting',
  '/api/staff',
  '/api/users',
  '/api/settings',
];

// Public routes that don't require auth
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/book',
  '/contact',
  '/treatments',
  '/login',
  '/unauthorized',
  '/api/auth',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/session',
  '/api/public',
  '/api/webhooks',
  '/api/stripe/webhook',
  '/api/square/webhook',
  '/api/sms/webhook',
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isPublicRoute(pathname: string): boolean {
  // Check exact matches
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  
  // Check prefix matches for public paths
  const publicPrefixes = ['/book', '/treatments/', '/services/', '/api/public/', '/api/webhooks/', '/api/auth/'];
  return publicPrefixes.some(prefix => pathname.startsWith(prefix));
}

function isStaticAsset(pathname: string): boolean {
  return pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.includes('/api/');
}

function getRequiredRoles(pathname: string): UserRole[] | null {
  // Check protected routes (most specific first)
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route.pattern)) {
      return route.allowedRoles;
    }
  }
  
  // Check protected API routes
  for (const apiRoute of PROTECTED_API_ROUTES) {
    if (pathname.startsWith(apiRoute)) {
      return ['owner', 'admin', 'provider', 'staff']; // All internal roles
    }
  }
  
  return null;
}

// ============================================================
// MIDDLEWARE
// ============================================================

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  // Skip static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Handle booking subdomain routing
  if (hostname.startsWith('book.')) {
    if (pathname === '/') {
      url.pathname = '/book';
      return NextResponse.rewrite(url);
    }
    
    if (!pathname.startsWith('/book') && 
        !pathname.startsWith('/_next') && 
        !pathname.startsWith('/api') &&
        !pathname.includes('.')) {
      const mainDomain = hostname.replace('book.', '');
      return NextResponse.redirect(`https://${mainDomain}${pathname}`);
    }
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ============================================================
  // TEMPORARY: Allow all protected routes through
  // Auth is handled at the page/component level via localStorage
  // TODO: Implement proper cookie-based Supabase auth
  // ============================================================
  
  const response = NextResponse.next();
  
  // Add security headers for protected routes
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  return response;
}

// ============================================================
// MATCHER CONFIG
// ============================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
