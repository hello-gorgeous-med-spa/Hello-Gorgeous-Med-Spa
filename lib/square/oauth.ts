// ============================================================
// SQUARE OAUTH UTILITIES
// OAuth 2.0 flow for Square merchant authorization
// ============================================================
// SECURITY REQUIREMENTS:
// - All Square secrets are SERVER-ONLY
// - NEVER use NEXT_PUBLIC_* for Square credentials
// - Only NEXT_PUBLIC_BASE_URL is allowed
// - Tokens stored encrypted with key versioning
// ============================================================

import { encryptToken, decryptToken } from './encryption';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

// Square OAuth endpoints
const SQUARE_OAUTH_BASE = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
};

const SQUARE_API_BASE = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
};

// ============================================================
// LEAST PRIVILEGE: Minimum required OAuth scopes
// Only request scopes needed for Terminal integration
// 
// DEV NOTE: Verify exact scope constants from Square SDK/docs
// These cover: Terminal/Devices, Orders, Payments, Merchant profile
// ============================================================
const REQUIRED_SCOPES = [
  'MERCHANT_PROFILE_READ',  // Includes location access
  'PAYMENTS_WRITE',
  'PAYMENTS_READ',
  'ORDERS_WRITE',
  'ORDERS_READ',
  'DEVICES_READ',
  'DEVICE_CREDENTIAL_MANAGEMENT',
].join(' ');

export interface SquareOAuthConfig {
  appId: string;
  appSecret: string;
  environment: 'sandbox' | 'production';
  redirectUri: string;
}

export interface SquareTokenResponse {
  access_token: string;
  token_type: string;
  expires_at: string;
  merchant_id: string;
  refresh_token?: string;
}

export interface SquareConnection {
  id: string;
  merchant_id: string;
  business_name: string | null;
  location_id: string | null;
  location_name: string | null;
  default_device_id: string | null;
  status: string;
  environment: string;
  connected_at: string;
  last_webhook_at: string | null;
}

/**
 * Get OAuth configuration from environment
 * 
 * SECURITY: All these vars must be server-only (no NEXT_PUBLIC_ prefix)
 * BASE_URL is the canonical server URL for OAuth callbacks
 * (NEXT_PUBLIC_BASE_URL is optional, for UI display only)
 */
export function getOAuthConfig(): SquareOAuthConfig {
  // Server-only secrets - NEVER prefix with NEXT_PUBLIC_
  const appId = process.env.SQUARE_OAUTH_CLIENT_ID;
  const appSecret = process.env.SQUARE_OAUTH_CLIENT_SECRET;
  
  // Normalize environment (case-insensitive)
  const envValue = (process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
  const environment: 'sandbox' | 'production' = envValue === 'production' ? 'production' : 'sandbox';
  
  // Prefer server BASE_URL for OAuth redirects (prevents client tampering)
  // Fall back to NEXT_PUBLIC_BASE_URL only if BASE_URL not set
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  if (!appId || !appSecret) {
    throw new Error(
      'Square OAuth credentials not configured. ' +
      'Set SQUARE_OAUTH_CLIENT_ID and SQUARE_OAUTH_CLIENT_SECRET (server-only, no NEXT_PUBLIC_)'
    );
  }
  
  return {
    appId,
    appSecret,
    environment,
    redirectUri: `${baseUrl}/api/square/oauth/callback`,
  };
}

/**
 * Generate Square OAuth authorization URL
 * 
 * Required params per Square docs:
 * - client_id: Application ID
 * - response_type: Must be "code" for authorization code flow
 * - redirect_uri: Where Square sends user after authorization
 * - scope: Space-separated list of permissions
 * - state: CSRF protection token
 */
export function getOAuthUrl(state: string): string {
  const config = getOAuthConfig();
  const baseUrl = SQUARE_OAUTH_BASE[config.environment];
  
  const params = new URLSearchParams({
    client_id: config.appId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: REQUIRED_SCOPES,
    session: 'false',
    state,
  });
  
  return `${baseUrl}/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<SquareTokenResponse> {
  const config = getOAuthConfig();
  const baseUrl = SQUARE_API_BASE[config.environment];
  
  const response = await fetch(`${baseUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    },
    body: JSON.stringify({
      client_id: config.appId,
      client_secret: config.appSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Square OAuth token exchange failed:', data);
    throw new Error(data.message || data.error_description || 'Failed to exchange code for tokens');
  }
  
  return data as SquareTokenResponse;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshTokenEncrypted: string): Promise<SquareTokenResponse> {
  const config = getOAuthConfig();
  const baseUrl = SQUARE_API_BASE[config.environment];
  
  const refreshToken = decryptToken(refreshTokenEncrypted);
  
  const response = await fetch(`${baseUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    },
    body: JSON.stringify({
      client_id: config.appId,
      client_secret: config.appSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Square token refresh failed:', data);
    throw new Error(data.message || data.error_description || 'Failed to refresh token');
  }
  
  return data as SquareTokenResponse;
}

/**
 * Revoke Square OAuth tokens
 */
export async function revokeTokens(accessTokenEncrypted: string): Promise<boolean> {
  const config = getOAuthConfig();
  const baseUrl = SQUARE_API_BASE[config.environment];
  
  const accessToken = decryptToken(accessTokenEncrypted);
  
  const response = await fetch(`${baseUrl}/oauth2/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
      'Authorization': `Client ${config.appSecret}`,
    },
    body: JSON.stringify({
      client_id: config.appId,
      access_token: accessToken,
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Square token revocation failed:', data);
    return false;
  }
  
  return data.success === true;
}

/**
 * Store OAuth tokens in database
 */
export async function storeConnection(
  tokens: SquareTokenResponse,
  businessName?: string,
  locationId?: string,
  locationName?: string
): Promise<string> {
  const config = getOAuthConfig();
  // Use admin client to bypass RLS for storing encrypted tokens
  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    throw new Error('Database not configured - missing SUPABASE_SERVICE_ROLE_KEY');
  }
  
  // Encrypt tokens
  const accessTokenEncrypted = encryptToken(tokens.access_token);
  const refreshTokenEncrypted = tokens.refresh_token 
    ? encryptToken(tokens.refresh_token) 
    : null;
  
  // Check if connection already exists
  const { data: existing } = await supabase
    .from('square_connections')
    .select('id')
    .eq('merchant_id', tokens.merchant_id)
    .single();
  
  if (existing) {
    // Update existing connection
    console.log('[Square OAuth] Updating existing connection:', existing.id);
    const { error } = await supabase
      .from('square_connections')
      .update({
        access_token_encrypted: accessTokenEncrypted,
        refresh_token_encrypted: refreshTokenEncrypted,
        token_expires_at: tokens.expires_at,
        token_type: tokens.token_type,
        business_name: businessName || null,
        location_id: locationId || null,
        location_name: locationName || null,
        status: 'active',
        environment: config.environment,
        last_token_refresh_at: new Date().toISOString(),
        disconnected_at: null,
      })
      .eq('id', existing.id);
    
    if (error) {
      console.error('[Square OAuth] Update error:', error.message, error.code, error.details);
      throw new Error(`Database update failed: ${error.message}`);
    }
    return existing.id;
  } else {
    // Create new connection
    console.log('[Square OAuth] Creating new connection for merchant:', tokens.merchant_id);
    const { data, error } = await supabase
      .from('square_connections')
      .insert({
        merchant_id: tokens.merchant_id,
        access_token_encrypted: accessTokenEncrypted,
        refresh_token_encrypted: refreshTokenEncrypted,
        token_expires_at: tokens.expires_at,
        token_type: tokens.token_type,
        business_name: businessName || null,
        location_id: locationId || null,
        location_name: locationName || null,
        status: 'active',
        environment: config.environment,
        scopes: REQUIRED_SCOPES.split(' '),
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('[Square OAuth] Insert error:', error.message, error.code, error.details);
      throw new Error(`Database insert failed: ${error.message}`);
    }
    return data.id;
  }
}

/**
 * Get active Square connection
 */
export async function getActiveConnection(): Promise<SquareConnection | null> {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase
    .from('square_connections')
    .select('*')
    .eq('status', 'active')
    .order('connected_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as SquareConnection;
}

/**
 * Get decrypted access token for API calls
 */
export async function getAccessToken(connectionId?: string): Promise<string | null> {
  const supabase = createAdminSupabaseClient();
  
  let query = supabase
    .from('square_connections')
    .select('id, access_token_encrypted, refresh_token_encrypted, token_expires_at')
    .eq('status', 'active');
  
  if (connectionId) {
    query = query.eq('id', connectionId);
  }
  
  const { data, error } = await query.order('connected_at', { ascending: false }).limit(1).single();
  
  if (error || !data) {
    return null;
  }
  
  // Check if token is expired (with 5 min buffer)
  const expiresAt = new Date(data.token_expires_at);
  const now = new Date();
  const bufferMs = 5 * 60 * 1000;
  
  if (expiresAt.getTime() - now.getTime() < bufferMs && data.refresh_token_encrypted) {
    // Token is expired or expiring soon, refresh it
    try {
      const newTokens = await refreshAccessToken(data.refresh_token_encrypted);
      await storeConnection(newTokens);
      return newTokens.access_token;
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      // Mark connection as expired
      await supabase
        .from('square_connections')
        .update({ status: 'expired' })
        .eq('id', data.id);
      return null;
    }
  }
  
  return decryptToken(data.access_token_encrypted);
}

/**
 * Disconnect Square account
 */
export async function disconnectSquare(connectionId: string): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  
  // Get the connection to revoke tokens
  const { data: connection } = await supabase
    .from('square_connections')
    .select('access_token_encrypted')
    .eq('id', connectionId)
    .single();
  
  if (connection?.access_token_encrypted) {
    // Attempt to revoke tokens (don't fail if this doesn't work)
    await revokeTokens(connection.access_token_encrypted).catch(console.error);
  }
  
  // Mark as disconnected
  const { error } = await supabase
    .from('square_connections')
    .update({
      status: 'disconnected',
      disconnected_at: new Date().toISOString(),
    })
    .eq('id', connectionId);
  
  if (error) {
    console.error('Failed to disconnect Square:', error);
    return false;
  }
  
  // Log to audit
  await supabase.from('audit_log').insert({
    entity_type: 'square_connection',
    entity_id: connectionId,
    action: 'disconnect',
    details: { reason: 'user_initiated' },
  });
  
  return true;
}

/**
 * Generate a secure random state for OAuth
 */
export function generateOAuthState(): string {
  return crypto.randomUUID();
}
