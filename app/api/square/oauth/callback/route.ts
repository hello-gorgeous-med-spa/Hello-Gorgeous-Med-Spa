// ============================================================
// SQUARE OAUTH CALLBACK
// Handles the OAuth callback from Square
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForTokens, storeConnection, getOAuthConfig } from '@/lib/square/oauth';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // Get cookies
  const cookieStore = await cookies();
  const storedState = cookieStore.get('square_oauth_state')?.value;
  const returnUrl = cookieStore.get('square_oauth_return_url')?.value || '/admin/settings/payments';
  
  // Clear OAuth cookies
  cookieStore.delete('square_oauth_state');
  cookieStore.delete('square_oauth_return_url');
  
  // Build redirect URL helper
  const buildRedirectUrl = (path: string, params: Record<string, string>) => {
    const url = new URL(path, request.url);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url;
  };
  
  try {
    // Log all callback params for debugging
    console.log('[Square OAuth Callback] Params:', {
      code: code ? `${code.slice(0, 10)}...` : null,
      state: state?.slice(0, 8),
      storedState: storedState?.slice(0, 8),
      error,
      errorDescription,
    });
    
    // Check for OAuth error from Square
    if (error) {
      console.error('[Square OAuth] Error from Square:', { error, errorDescription });
      return NextResponse.redirect(
        buildRedirectUrl(returnUrl, {
          error: 'oauth_denied',
          message: `Square: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`,
        })
      );
    }
    
    // Validate code
    if (!code) {
      return NextResponse.redirect(
        buildRedirectUrl(returnUrl, {
          error: 'missing_code',
          message: 'No authorization code received',
        })
      );
    }
    
    // Validate state (CSRF protection)
    if (!state || state !== storedState) {
      console.error('State mismatch:', { received: state, expected: storedState });
      return NextResponse.redirect(
        buildRedirectUrl(returnUrl, {
          error: 'invalid_state',
          message: 'Invalid state parameter - possible CSRF attack',
        })
      );
    }
    
    // Exchange code for tokens
    console.log('[Square OAuth] Exchanging code for tokens...');
    let tokens;
    try {
      tokens = await exchangeCodeForTokens(code);
      console.log('[Square OAuth] Token exchange successful, merchant_id:', tokens.merchant_id);
    } catch (tokenError) {
      console.error('[Square OAuth] Token exchange FAILED:', tokenError);
      throw new Error(`Token exchange failed: ${tokenError instanceof Error ? tokenError.message : 'Unknown error'}`);
    }
    
    // Get Square API base URL
    const config = getOAuthConfig();
    const baseUrl = config.environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    // Fetch merchant info to get business name
    let businessName: string | undefined;
    try {
      const merchantResponse = await fetch(`${baseUrl}/v2/merchants/${tokens.merchant_id}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Square-Version': '2024-01-18',
        },
      });
      
      if (merchantResponse.ok) {
        const merchantData = await merchantResponse.json();
        businessName = merchantData.merchant?.business_name;
        console.log('[Square OAuth] Business name:', businessName);
      }
    } catch (merchantError) {
      console.warn('Could not fetch merchant info:', merchantError);
    }
    
    // ========================================================
    // FETCH LOCATIONS - Critical for terminal payments
    // ========================================================
    let locationId: string | undefined;
    let locationName: string | undefined;
    
    try {
      console.log('[Square OAuth] Fetching locations...');
      const locationsResponse = await fetch(`${baseUrl}/v2/locations`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Square-Version': '2024-01-18',
        },
      });
      
      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        const locations = locationsData.locations || [];
        console.log('[Square OAuth] Found', locations.length, 'locations');
        
        // Find the first active location (preferably the main one)
        const activeLocation = locations.find((loc: any) => 
          loc.status === 'ACTIVE' && loc.type !== 'MOBILE'
        ) || locations.find((loc: any) => loc.status === 'ACTIVE') || locations[0];
        
        if (activeLocation) {
          locationId = activeLocation.id;
          locationName = activeLocation.name;
          console.log('[Square OAuth] Selected location:', locationName, '(', locationId, ')');
        } else {
          console.warn('[Square OAuth] No active locations found');
        }
      } else {
        const errorData = await locationsResponse.json();
        console.error('[Square OAuth] Failed to fetch locations:', errorData);
      }
    } catch (locationError) {
      console.error('[Square OAuth] Location fetch error:', locationError);
    }
    
    // Store connection in database (including location)
    console.log('[Square OAuth] Storing connection with location...');
    let connectionId;
    try {
      connectionId = await storeConnection(tokens, businessName, locationId, locationName);
      console.log('[Square OAuth] Connection stored, id:', connectionId);
    } catch (storeError) {
      console.error('[Square OAuth] Store connection FAILED:', storeError);
      throw new Error(`Store connection failed: ${storeError instanceof Error ? storeError.message : 'Unknown error'}`);
    }
    
    // Log to audit
    const supabase = createServerSupabaseClient();
    await supabase.from('audit_log').insert({
      entity_type: 'square_connection',
      entity_id: connectionId,
      action: 'connect',
      details: {
        merchant_id: tokens.merchant_id,
        business_name: businessName,
        location_id: locationId,
        location_name: locationName,
        environment: config.environment,
      },
    });
    
    // Redirect back to settings with success
    return NextResponse.redirect(
      buildRedirectUrl(returnUrl, {
        success: 'true',
        message: locationId 
          ? `Square connected! Location: ${locationName || locationId}` 
          : 'Square connected (no location found - please check Square Dashboard)',
      })
    );
    
  } catch (err) {
    console.error('Square OAuth callback error:', err);
    console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    
    // Include more detail in the error message for debugging
    const errorMessage = err instanceof Error 
      ? `${err.message}${err.cause ? ` (${err.cause})` : ''}`
      : 'Failed to complete authorization';
    
    return NextResponse.redirect(
      buildRedirectUrl(returnUrl, {
        error: 'oauth_failed',
        message: errorMessage,
      })
    );
  }
}
