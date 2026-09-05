import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

/**
 * GET /api/regen/fullscript/oauth/callback
 * 
 * OAuth callback handler for Fullscript authorization.
 * Receives authorization code and exchanges it for access/refresh tokens.
 */

const FULLSCRIPT_TOKEN_URL = process.env.NODE_ENV === 'production'
  ? 'https://us.fullscript.io/oauth/token'
  : 'https://us-snd.fullscript.io/oauth/token';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('[fullscript-oauth] Error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/ops?error=fullscript_auth_failed&message=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/ops?error=no_auth_code', request.url)
    );
  }

  try {
    const clientId = process.env.FULLSCRIPT_PUBLIC_KEY;
    const clientSecret = process.env.FULLSCRIPT_SECRET_KEY || process.env.FULLSCRIPT_CLIENT_SECRET;
    
    if (!clientId) {
      throw new Error('FULLSCRIPT_PUBLIC_KEY not configured');
    }

    // Determine the redirect URI (must match what was used in authorize request)
    const redirectUri = process.env.FULLSCRIPT_REDIRECT_URI || 
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tryregenrx.com'}/api/regen/fullscript/oauth/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(FULLSCRIPT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        ...(clientSecret && { client_secret: clientSecret }),
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[fullscript-oauth] Token exchange failed:', tokenResponse.status, errorText);
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokens = await tokenResponse.json();
    
    console.log('[fullscript-oauth] Token exchange successful:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in,
      scope: tokens.scope,
    });

    // Store tokens in database
    const supabase = getSupabase();
    
    const { error: upsertError } = await supabase
      .from('regen_integrations')
      .upsert({
        provider: 'fullscript',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_in 
          ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          : null,
        scope: tokens.scope,
        token_type: tokens.token_type,
        raw_response: tokens,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'provider',
      });

    if (upsertError) {
      console.error('[fullscript-oauth] Failed to store tokens:', upsertError);
      // Don't fail - tokens were received, just storage failed
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/ops?success=fullscript_connected', request.url)
    );

  } catch (error) {
    console.error('[fullscript-oauth] Error:', error);
    return NextResponse.redirect(
      new URL(`/ops?error=fullscript_token_exchange_failed&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.url)
    );
  }
}
