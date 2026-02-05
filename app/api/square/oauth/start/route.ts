// ============================================================
// SQUARE OAUTH START
// Initiates the OAuth flow by redirecting to Square
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuthUrl, generateOAuthState } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Generate a secure state parameter
    const state = generateOAuthState();
    
    // Store state in a cookie for validation on callback
    // Using httpOnly and secure cookies for security
    const cookieStore = await cookies();
    cookieStore.set('square_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    
    // Get the return URL from query params (where to redirect after OAuth)
    const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/admin/settings/payments';
    cookieStore.set('square_oauth_return_url', returnUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });
    
    // Generate the OAuth URL and redirect
    const authUrl = getOAuthUrl(state);
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Square OAuth start error:', error);
    
    // Redirect back to settings with error
    const errorUrl = new URL('/admin/settings/payments', request.url);
    errorUrl.searchParams.set('error', 'oauth_start_failed');
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Failed to start OAuth');
    
    return NextResponse.redirect(errorUrl);
  }
}
