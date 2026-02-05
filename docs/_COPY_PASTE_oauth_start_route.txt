// ============================================================
// SQUARE OAUTH START
// Initiates the OAuth flow by redirecting to Square
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuthUrl, generateOAuthState, getOAuthConfig } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

/**
 * Validate OAuth URL contains all required parameters
 * Per Square OAuth spec: https://developer.squareup.com/docs/oauth-api/create-urls-for-square-authorization
 */
function validateOAuthUrl(url: string): { valid: boolean; missing: string[] } {
  const parsed = new URL(url);
  const required = ['client_id', 'response_type', 'redirect_uri', 'scope', 'state'];
  const missing = required.filter(param => !parsed.searchParams.has(param));
  
  // Validate response_type is 'code'
  if (parsed.searchParams.get('response_type') !== 'code') {
    missing.push('response_type=code');
  }
  
  return { valid: missing.length === 0, missing };
}

/**
 * Log OAuth URL for debugging (redacts sensitive parts)
 */
function logOAuthUrl(url: string): void {
  const parsed = new URL(url);
  console.log('[Square OAuth] Authorize URL:', {
    base: `${parsed.origin}${parsed.pathname}`,
    client_id: parsed.searchParams.get('client_id')?.slice(0, 10) + '...',
    response_type: parsed.searchParams.get('response_type'),
    redirect_uri: parsed.searchParams.get('redirect_uri'),
    scope: parsed.searchParams.get('scope'),
    state: parsed.searchParams.get('state')?.slice(0, 8) + '...',
    session: parsed.searchParams.get('session'),
  });
}

export async function GET(request: NextRequest) {
  try {
    // Validate config is available
    const config = getOAuthConfig();
    console.log('[Square OAuth] Environment:', config.environment);
    console.log('[Square OAuth] Redirect URI:', config.redirectUri);
    
    // Generate a secure state parameter
    const state = generateOAuthState();
    
    // Store state in a cookie for validation on callback
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
    
    // Generate the OAuth URL
    const authUrl = getOAuthUrl(state);
    
    // Validate URL has all required params before redirecting
    const validation = validateOAuthUrl(authUrl);
    if (!validation.valid) {
      console.error('[Square OAuth] Invalid authorize URL - missing params:', validation.missing);
      throw new Error(`OAuth URL missing required params: ${validation.missing.join(', ')}`);
    }
    
    // Log for debugging (no secrets)
    logOAuthUrl(authUrl);
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('[Square OAuth] Start error:', error);
    
    // Redirect back to settings with detailed error
    const errorUrl = new URL('/admin/settings/payments', request.url);
    errorUrl.searchParams.set('error', 'oauth_start_failed');
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Failed to start OAuth');
    
    return NextResponse.redirect(errorUrl);
  }
}
