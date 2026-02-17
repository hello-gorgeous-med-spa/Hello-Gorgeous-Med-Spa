// ============================================================
// SQUARE SDK CLIENT
// Full integration for payments, gift cards, terminal, and devices
// Supports both OAuth tokens and static environment tokens
// ============================================================

import { getAccessToken } from './oauth';

// Square SDK types
type SquareClient = any;

// ============================================================
// CLIENT INITIALIZATION
// ============================================================

/**
 * Create Square client with a specific access token
 * Uses square/legacy - v44 main export has different API; legacy matches our code
 */
export async function createSquareClientWithToken(accessToken: string): Promise<SquareClient> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Client, Environment } = require('square/legacy');

    if (!Client) {
      console.error('[Square Client] Client not found in square/legacy');
      return null;
    }

    const isProd = process.env.SQUARE_ENVIRONMENT === 'production';

    const client = new Client({
      accessToken,
      environment: isProd ? Environment.Production : Environment.Sandbox,
    });

    return client;
  } catch (error: any) {
    console.error('[Square Client] Failed to create client:', error.message);
    return null;
  }
}

/**
 * Get Square client with OAuth token from database
 */
export async function getSquareClientAsync(): Promise<SquareClient> {
  console.log('[Square Client] getSquareClientAsync called');
  
  // Get OAuth token from database
  const oauthToken = await getAccessToken();
  console.log('[Square Client] OAuth token:', oauthToken ? 'Found' : 'Not found');
  
  if (oauthToken) {
    return await createSquareClientWithToken(oauthToken);
  }
  
  console.log('[Square Client] No OAuth token available');
  return null;
}

// ============================================================
// ASYNC API GETTERS (use OAuth token from database)
// SDK v44 uses client.payments, client.devices etc.
// Legacy SDK used client.paymentsApi, client.devicesApi etc.
// We check for both for compatibility
// ============================================================

/**
 * Get Payments API with OAuth token
 */
export async function getPaymentsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.payments ?? client?.paymentsApi ?? null;
}

/**
 * Get Orders API with OAuth token
 */
export async function getOrdersApiAsync() {
  const client = await getSquareClientAsync();
  return client?.orders ?? client?.ordersApi ?? null;
}

/**
 * Get Terminal API with OAuth token
 */
export async function getTerminalApiAsync() {
  const client = await getSquareClientAsync();
  return client?.terminal ?? client?.terminalApi ?? null;
}

/**
 * Get Devices API with OAuth token
 */
export async function getDevicesApiAsync() {
  const client = await getSquareClientAsync();
  return client?.devices ?? client?.devicesApi ?? null;
}

/**
 * Get Locations API with OAuth token
 */
export async function getLocationsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.locations ?? client?.locationsApi ?? null;
}

/**
 * Get Merchants API with OAuth token
 */
export async function getMerchantsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.merchants ?? client?.merchantsApi ?? null;
}

/**
 * Get Refunds API with OAuth token
 */
export async function getRefundsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.refunds ?? client?.refundsApi ?? null;
}

/**
 * Get Customers API with OAuth token
 */
export async function getCustomersApiAsync() {
  const client = await getSquareClientAsync();
  return client?.customers ?? client?.customersApi ?? null;
}

/**
 * Get Gift Cards API with OAuth token
 */
export async function getGiftCardsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.giftCards ?? client?.giftCardsApi ?? null;
}

/**
 * Get Gift Card Activities API with OAuth token
 */
export async function getGiftCardActivitiesApiAsync() {
  const client = await getSquareClientAsync();
  return client?.giftCardActivities ?? client?.giftCardActivitiesApi ?? null;
}

// ============================================================
// LEGACY SYNC GETTERS (for backward compatibility)
// These use static token from env var, not OAuth
// ============================================================

let _staticClient: SquareClient = null;
let _staticInitialized = false;

function initStaticClient(): SquareClient {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) return null;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Client, Environment } = require('square');
    const environment = process.env.SQUARE_ENVIRONMENT === 'production' 
      ? Environment.Production 
      : Environment.Sandbox;
    
    return new Client({
      accessToken,
      environment,
    });
  } catch (error) {
    console.warn('Square SDK not available:', error);
    return null;
  }
}

function getStaticClient(): SquareClient {
  if (!_staticInitialized) {
    _staticClient = initStaticClient();
    _staticInitialized = true;
  }
  return _staticClient;
}

// Export getter functions for APIs (lazy initialization with static token)
export const getGiftCardsApi = () => getStaticClient()?.giftCardsApi ?? null;
export const getGiftCardActivitiesApi = () => getStaticClient()?.giftCardActivitiesApi ?? null;
export const getPaymentsApi = () => getStaticClient()?.paymentsApi ?? null;
export const getCustomersApi = () => getStaticClient()?.customersApi ?? null;
export const getOrdersApi = () => getStaticClient()?.ordersApi ?? null;

// Legacy exports for backwards compatibility
export const squareClient = null as SquareClient;
export const giftCardsApi = null;
export const giftCardActivitiesApi = null;
export const paymentsApi = null;
export const customersApi = null;
export const ordersApi = null;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if Square is configured (async, checks OAuth connection)
 */
export async function isSquareConfiguredAsync(): Promise<boolean> {
  const client = await getSquareClientAsync();
  return !!client;
}

/**
 * Check if Square is configured (sync, uses static token)
 */
export function isSquareConfigured(): boolean {
  return !!getStaticClient();
}

/**
 * Get Square location ID from environment (legacy)
 */
export function getSquareLocationId(): string {
  return process.env.SQUARE_LOCATION_ID || '';
}

/**
 * Get Square location ID from database connection
 */
export async function getSquareLocationIdAsync(): Promise<string | null> {
  const { getActiveConnection } = await import('./oauth');
  const connection = await getActiveConnection();
  return connection?.location_id || process.env.SQUARE_LOCATION_ID || null;
}

/**
 * Get default device ID from database connection
 */
export async function getDefaultDeviceIdAsync(): Promise<string | null> {
  const { getActiveConnection } = await import('./oauth');
  const connection = await getActiveConnection();
  return connection?.default_device_id || null;
}

/**
 * Convert cents to dollars for display
 */
export function centsToDollars(cents: number | bigint): number {
  const value = typeof cents === 'bigint' ? Number(cents) : cents;
  return value / 100;
}

/**
 * Convert dollars to cents for Square API
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}
