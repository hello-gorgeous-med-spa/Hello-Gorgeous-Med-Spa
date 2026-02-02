// ============================================================
// MIDDLEWARE - SECURITY LOCKDOWN
// ALL internal routes require authentication + role verification
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // Check if route requires protection
  const requiredRoles = getRequiredRoles(pathname);
  
  if (!requiredRoles) {
    // Not a protected route
    return NextResponse.next();
  }

  // ============================================================
  // AUTHENTICATION CHECK
  // ============================================================

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Not authenticated - redirect to login
  if (authError || !user) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // For page routes, redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ============================================================
  // AUTHORIZATION CHECK (ROLE-BASED)
  // ============================================================

  // Get user profile with role from database
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const userRole = (profile?.role as UserRole) || 'client';

  // Check if user has required role
  const hasAccess = requiredRoles.includes(userRole);

  if (!hasAccess) {
    // For API routes, return 403
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'You do not have permission to access this resource',
          requiredRoles,
          userRole,
        },
        { status: 403 }
      );
    }
    
    // For page routes, redirect to unauthorized page
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('required', requiredRoles.join(','));
    unauthorizedUrl.searchParams.set('current', userRole);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // ============================================================
  // ACCESS GRANTED - Add security headers
  // ============================================================

  // Add security headers for protected routes
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  
  // Add user info to request headers for downstream use
  response.headers.set('X-User-ID', user.id);
  response.headers.set('X-User-Role', userRole);

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
