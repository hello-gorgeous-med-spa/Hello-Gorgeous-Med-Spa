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

// ============================================================
// GIFT CARD HELPERS (wrap Square API for gift-cards routes)
// ============================================================

function newIdempotencyKey(): string {
  return `hg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Retrieve a gift card by ID. Returns the card or null. */
export async function getSquareGiftCard(giftCardId: string): Promise<{ id: string; gan?: string | null; balanceMoney?: { amount: number } } | null> {
  const api = await getGiftCardsApiAsync();
  if (!api?.retrieveGiftCard) return null;
  try {
    const res = await api.retrieveGiftCard(giftCardId);
    const card = (res as any)?.result?.giftCard ?? (res as any)?.giftCard;
    return card ? { id: card.id, gan: card.gan, balanceMoney: card.balanceMoney } : null;
  } catch (e) {
    console.warn('[Square] getSquareGiftCard error', e);
    return null;
  }
}

/** Retrieve a gift card by GAN. Returns the card or null. */
export async function getSquareGiftCardByGan(gan: string): Promise<{ id: string; gan?: string | null; balanceMoney?: { amount: number } } | null> {
  const api = await getGiftCardsApiAsync();
  if (!api?.retrieveGiftCardFromGAN) return null;
  try {
    const res = await api.retrieveGiftCardFromGAN({ gan });
    const card = (res as any)?.result?.giftCard ?? (res as any)?.giftCard;
    return card ? { id: card.id, gan: card.gan, balanceMoney: card.balanceMoney } : null;
  } catch (e) {
    console.warn('[Square] getSquareGiftCardByGan error', e);
    return null;
  }
}

/** Create a new gift card in Square (PENDING). Returns created card or null. */
export async function createSquareGiftCard(
  locationId: string,
  type: 'PHYSICAL' | 'DIGITAL'
): Promise<{ id: string; gan?: string | null } | null> {
  const api = await getGiftCardsApiAsync();
  if (!api?.createGiftCard) return null;
  try {
    const res = await api.createGiftCard({
      idempotencyKey: newIdempotencyKey(),
      locationId,
      giftCard: { type },
    });
    const card = (res as any)?.result?.giftCard ?? (res as any)?.giftCard;
    return card ? { id: card.id, gan: card.gan ?? null } : null;
  } catch (e) {
    console.warn('[Square] createSquareGiftCard error', e);
    return null;
  }
}

/** Activate a gift card with initial balance. Returns activity or null. */
export async function activateSquareGiftCard(
  giftCardId: string,
  amountMoneyCents: number,
  locationId: string,
  orderId?: string | null
): Promise<{ id: string } | null> {
  const activitiesApi = await getGiftCardActivitiesApiAsync();
  if (!activitiesApi?.createGiftCardActivity) return null;
  try {
    const res = await activitiesApi.createGiftCardActivity({
      idempotencyKey: newIdempotencyKey(),
      giftCardActivity: {
        type: 'ACTIVATE',
        locationId,
        giftCardId,
        activateActivityDetails: {
          amountMoney: { amount: amountMoneyCents, currency: 'USD' },
          orderId: orderId ?? undefined,
        },
      },
    });
    const activity = (res as any)?.result?.giftCardActivity ?? (res as any)?.giftCardActivity;
    return activity ? { id: activity.id } : null;
  } catch (e) {
    console.warn('[Square] activateSquareGiftCard error', e);
    return null;
  }
}

/** Redeem (decrement) balance. Returns activity or null. */
export async function redeemSquareGiftCard(
  giftCardId: string,
  amountMoneyCents: number,
  locationId: string,
  paymentId?: string | null,
  referenceId?: string | null
): Promise<{ id: string } | null> {
  const activitiesApi = await getGiftCardActivitiesApiAsync();
  if (!activitiesApi?.createGiftCardActivity) return null;
  try {
    const res = await activitiesApi.createGiftCardActivity({
      idempotencyKey: newIdempotencyKey(),
      giftCardActivity: {
        type: 'REDEEM',
        locationId,
        giftCardId,
        redeemActivityDetails: {
          amountMoney: { amount: amountMoneyCents, currency: 'USD' },
          paymentId: paymentId ?? undefined,
          referenceId: referenceId ?? undefined,
        },
      },
    });
    const activity = (res as any)?.result?.giftCardActivity ?? (res as any)?.giftCardActivity;
    return activity ? { id: activity.id } : null;
  } catch (e) {
    console.warn('[Square] redeemSquareGiftCard error', e);
    return null;
  }
}

/** Deactivate a gift card. Returns activity or null. */
export async function deactivateSquareGiftCard(
  giftCardId: string,
  locationId: string,
  reason: string
): Promise<{ id: string } | null> {
  const activitiesApi = await getGiftCardActivitiesApiAsync();
  if (!activitiesApi?.createGiftCardActivity) return null;
  try {
    const res = await activitiesApi.createGiftCardActivity({
      idempotencyKey: newIdempotencyKey(),
      giftCardActivity: {
        type: 'DEACTIVATE',
        locationId,
        giftCardId,
        deactivateActivityDetails: { reason },
      },
    });
    const activity = (res as any)?.result?.giftCardActivity ?? (res as any)?.giftCardActivity;
    return activity ? { id: activity.id } : null;
  } catch (e) {
    console.warn('[Square] deactivateSquareGiftCard error', e);
    return null;
  }
}

/** Adjust balance (increment or decrement). Returns activity or null. */
export async function adjustSquareGiftCardBalance(
  giftCardId: string,
  amountMoneyCents: number,
  locationId: string,
  reason: string,
  isIncrement: boolean
): Promise<{ id: string } | null> {
  const activitiesApi = await getGiftCardActivitiesApiAsync();
  if (!activitiesApi?.createGiftCardActivity) return null;
  const type = isIncrement ? 'ADJUST_INCREMENT' : 'ADJUST_DECREMENT';
  const amountMoney = { amount: amountMoneyCents, currency: 'USD' as const };
  const base = { type, locationId, giftCardId };
  const activityPayload = isIncrement
    ? { ...base, adjustIncrementActivityDetails: { amountMoney, reason } }
    : { ...base, adjustDecrementActivityDetails: { amountMoney, reason } };
  try {
    const res = await activitiesApi.createGiftCardActivity({
      idempotencyKey: newIdempotencyKey(),
      giftCardActivity: activityPayload,
    });
    const activity = (res as any)?.result?.giftCardActivity ?? (res as any)?.giftCardActivity;
    return activity ? { id: activity.id } : null;
  } catch (e) {
    console.warn('[Square] adjustSquareGiftCardBalance error', e);
    return null;
  }
}

/** Link a customer to a gift card. */
export async function linkGiftCardToCustomer(giftCardId: string, customerId: string): Promise<boolean> {
  const api = await getGiftCardsApiAsync();
  if (!api?.linkCustomerToGiftCard) return false;
  try {
    await api.linkCustomerToGiftCard(giftCardId, { customerId });
    return true;
  } catch (e) {
    console.warn('[Square] linkGiftCardToCustomer error', e);
    return false;
  }
}

/** List activities for a gift card. Returns array of activities. */
export async function listGiftCardActivities(
  giftCardId: string,
  options?: { type?: string; locationId?: string; limit?: number }
): Promise<Array<{ id: string; type: string; createdAt?: string }>> {
  const api = await getGiftCardActivitiesApiAsync();
  if (!api?.listGiftCardActivities) return [];
  try {
    const res = await api.listGiftCardActivities(
      giftCardId,
      options?.type,
      options?.locationId,
      undefined,
      undefined,
      options?.limit ?? 50
    );
    const list = (res as any)?.result?.activities ?? (res as any)?.activities ?? [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.warn('[Square] listGiftCardActivities error', e);
    return [];
  }
}
