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

// Lazy-load Square to prevent build-time crashes when env vars are missing
let _staticClient: SquareClient = null;
let _staticInitialized = false;

/**
 * Initialize Square client with static environment token (legacy)
 */
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

/**
 * Get static Square client (for legacy code)
 */
function getStaticClient(): SquareClient {
  if (!_staticInitialized) {
    _staticClient = initStaticClient();
    _staticInitialized = true;
  }
  return _staticClient;
}

/**
 * Create Square client with a specific access token
 */
export function createSquareClientWithToken(accessToken: string): SquareClient {
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

/**
 * Get Square client with OAuth token from database
 * Falls back to static token if OAuth not available
 */
export async function getSquareClientAsync(): Promise<SquareClient> {
  // Try OAuth token first
  const oauthToken = await getAccessToken();
  if (oauthToken) {
    return createSquareClientWithToken(oauthToken);
  }
  
  // Fall back to static token
  return getStaticClient();
}

// ============================================================
// LEGACY SYNC GETTERS (for backward compatibility)
// ============================================================

// Export getter functions for APIs (lazy initialization with static token)
export const getGiftCardsApi = () => getStaticClient()?.giftCardsApi ?? null;
export const getGiftCardActivitiesApi = () => getStaticClient()?.giftCardActivitiesApi ?? null;
export const getPaymentsApi = () => getStaticClient()?.paymentsApi ?? null;
export const getCustomersApi = () => getStaticClient()?.customersApi ?? null;
export const getOrdersApi = () => getStaticClient()?.ordersApi ?? null;

// Legacy exports for backwards compatibility (use getters above for new code)
export const squareClient = null as SquareClient; // Deprecated
export const giftCardsApi = null; // Deprecated - use getGiftCardsApi()
export const giftCardActivitiesApi = null; // Deprecated - use getGiftCardActivitiesApi()
export const paymentsApi = null; // Deprecated - use getPaymentsApi()
export const customersApi = null; // Deprecated - use getCustomersApi()
export const ordersApi = null; // Deprecated - use getOrdersApi()

// ============================================================
// ASYNC API GETTERS (use OAuth token from database)
// ============================================================

/**
 * Get Payments API with OAuth token
 */
export async function getPaymentsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.paymentsApi ?? null;
}

/**
 * Get Orders API with OAuth token
 */
export async function getOrdersApiAsync() {
  const client = await getSquareClientAsync();
  return client?.ordersApi ?? null;
}

/**
 * Get Terminal API with OAuth token
 */
export async function getTerminalApiAsync() {
  const client = await getSquareClientAsync();
  return client?.terminalApi ?? null;
}

/**
 * Get Devices API with OAuth token
 */
export async function getDevicesApiAsync() {
  const client = await getSquareClientAsync();
  return client?.devicesApi ?? null;
}

/**
 * Get Locations API with OAuth token
 */
export async function getLocationsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.locationsApi ?? null;
}

/**
 * Get Merchants API with OAuth token
 */
export async function getMerchantsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.merchantsApi ?? null;
}

/**
 * Get Refunds API with OAuth token
 */
export async function getRefundsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.refundsApi ?? null;
}

/**
 * Get Customers API with OAuth token
 */
export async function getCustomersApiAsync() {
  const client = await getSquareClientAsync();
  return client?.customersApi ?? null;
}

/**
 * Get Gift Cards API with OAuth token
 */
export async function getGiftCardsApiAsync() {
  const client = await getSquareClientAsync();
  return client?.giftCardsApi ?? null;
}

/**
 * Get Gift Card Activities API with OAuth token
 */
export async function getGiftCardActivitiesApiAsync() {
  const client = await getSquareClientAsync();
  return client?.giftCardActivitiesApi ?? null;
}

// ============================================================
// TYPES
// ============================================================

export interface SquareGiftCard {
  id: string;
  gan: string; // Gift card account number (last 4 shown)
  state: 'ACTIVE' | 'DEACTIVATED' | 'BLOCKED' | 'PENDING';
  balanceMoney: {
    amount: bigint;
    currency: string;
  };
  type: 'DIGITAL' | 'PHYSICAL';
  createdAt: string;
  customerIds?: string[];
}

export interface GiftCardActivity {
  id: string;
  type: 'ACTIVATE' | 'LOAD' | 'REDEEM' | 'CLEAR_BALANCE' | 'DEACTIVATE' | 'ADJUST_INCREMENT' | 'ADJUST_DECREMENT';
  locationId: string;
  giftCardId: string;
  giftCardGan: string;
  giftCardBalanceMoney: {
    amount: bigint;
    currency: string;
  };
  createdAt: string;
}

export interface CreateGiftCardParams {
  idempotencyKey: string;
  locationId: string;
  giftCard: {
    type: 'DIGITAL' | 'PHYSICAL';
  };
}

export interface ActivateGiftCardParams {
  idempotencyKey: string;
  giftCardId: string;
  locationId: string;
  activateActivityDetails: {
    amountMoney: {
      amount: bigint;
      currency: string;
    };
    orderId?: string;
    buyerPaymentInstrumentIds?: string[];
  };
}

export interface RedeemGiftCardParams {
  idempotencyKey: string;
  giftCardId: string;
  locationId: string;
  redeemActivityDetails: {
    amountMoney: {
      amount: bigint;
      currency: string;
    };
    paymentId?: string;
    referenceId?: string;
  };
}

// ============================================================
// GIFT CARD FUNCTIONS
// ============================================================

/**
 * Create a new gift card in Square
 */
export async function createSquareGiftCard(
  locationId: string,
  type: 'DIGITAL' | 'PHYSICAL' = 'DIGITAL'
): Promise<SquareGiftCard | null> {
  const api = getGiftCardsApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.createGiftCard({
      idempotencyKey: crypto.randomUUID(),
      locationId,
      giftCard: { type },
    });

    if (response.result.giftCard) {
      const gc = response.result.giftCard;
      return {
        id: gc.id!,
        gan: gc.gan!,
        state: gc.state as SquareGiftCard['state'],
        balanceMoney: {
          amount: gc.balanceMoney?.amount || BigInt(0),
          currency: gc.balanceMoney?.currency || 'USD',
        },
        type: gc.type as 'DIGITAL' | 'PHYSICAL',
        createdAt: gc.createdAt || new Date().toISOString(),
        customerIds: gc.customerIds,
      };
    }
    return null;
  } catch (error) {
    console.error('Square create gift card error:', error);
    return null;
  }
}

/**
 * Activate a gift card with initial value
 */
export async function activateSquareGiftCard(
  giftCardId: string,
  amountCents: number,
  locationId: string,
  orderId?: string
): Promise<GiftCardActivity | null> {
  const api = getGiftCardActivitiesApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.createGiftCardActivity({
      idempotencyKey: crypto.randomUUID(),
      giftCardActivity: {
        type: 'ACTIVATE',
        locationId,
        giftCardId,
        activateActivityDetails: {
          amountMoney: {
            amount: BigInt(amountCents),
            currency: 'USD',
          },
          orderId,
        },
      },
    });

    if (response.result.giftCardActivity) {
      const activity = response.result.giftCardActivity;
      return {
        id: activity.id!,
        type: activity.type as GiftCardActivity['type'],
        locationId: activity.locationId!,
        giftCardId: activity.giftCardId!,
        giftCardGan: activity.giftCardGan!,
        giftCardBalanceMoney: {
          amount: activity.giftCardBalanceMoney?.amount || BigInt(0),
          currency: activity.giftCardBalanceMoney?.currency || 'USD',
        },
        createdAt: activity.createdAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Square activate gift card error:', error);
    return null;
  }
}

/**
 * Load additional funds onto a gift card
 */
export async function loadSquareGiftCard(
  giftCardId: string,
  amountCents: number,
  locationId: string,
  orderId?: string
): Promise<GiftCardActivity | null> {
  const api = getGiftCardActivitiesApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.createGiftCardActivity({
      idempotencyKey: crypto.randomUUID(),
      giftCardActivity: {
        type: 'LOAD',
        locationId,
        giftCardId,
        loadActivityDetails: {
          amountMoney: {
            amount: BigInt(amountCents),
            currency: 'USD',
          },
          orderId,
        },
      },
    });

    if (response.result.giftCardActivity) {
      const activity = response.result.giftCardActivity;
      return {
        id: activity.id!,
        type: activity.type as GiftCardActivity['type'],
        locationId: activity.locationId!,
        giftCardId: activity.giftCardId!,
        giftCardGan: activity.giftCardGan!,
        giftCardBalanceMoney: {
          amount: activity.giftCardBalanceMoney?.amount || BigInt(0),
          currency: activity.giftCardBalanceMoney?.currency || 'USD',
        },
        createdAt: activity.createdAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Square load gift card error:', error);
    return null;
  }
}

/**
 * Redeem value from a gift card
 */
export async function redeemSquareGiftCard(
  giftCardId: string,
  amountCents: number,
  locationId: string,
  paymentId?: string,
  referenceId?: string
): Promise<GiftCardActivity | null> {
  const api = getGiftCardActivitiesApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.createGiftCardActivity({
      idempotencyKey: crypto.randomUUID(),
      giftCardActivity: {
        type: 'REDEEM',
        locationId,
        giftCardId,
        redeemActivityDetails: {
          amountMoney: {
            amount: BigInt(amountCents),
            currency: 'USD',
          },
          paymentId,
          referenceId,
        },
      },
    });

    if (response.result.giftCardActivity) {
      const activity = response.result.giftCardActivity;
      return {
        id: activity.id!,
        type: activity.type as GiftCardActivity['type'],
        locationId: activity.locationId!,
        giftCardId: activity.giftCardId!,
        giftCardGan: activity.giftCardGan!,
        giftCardBalanceMoney: {
          amount: activity.giftCardBalanceMoney?.amount || BigInt(0),
          currency: activity.giftCardBalanceMoney?.currency || 'USD',
        },
        createdAt: activity.createdAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Square redeem gift card error:', error);
    return null;
  }
}

/**
 * Get gift card by ID
 */
export async function getSquareGiftCard(giftCardId: string): Promise<SquareGiftCard | null> {
  const api = getGiftCardsApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.retrieveGiftCard(giftCardId);

    if (response.result.giftCard) {
      const gc = response.result.giftCard;
      return {
        id: gc.id!,
        gan: gc.gan!,
        state: gc.state as SquareGiftCard['state'],
        balanceMoney: {
          amount: gc.balanceMoney?.amount || BigInt(0),
          currency: gc.balanceMoney?.currency || 'USD',
        },
        type: gc.type as 'DIGITAL' | 'PHYSICAL',
        createdAt: gc.createdAt || new Date().toISOString(),
        customerIds: gc.customerIds,
      };
    }
    return null;
  } catch (error) {
    console.error('Square get gift card error:', error);
    return null;
  }
}

/**
 * Get gift card by GAN (Gift card Account Number)
 */
export async function getSquareGiftCardByGan(gan: string): Promise<SquareGiftCard | null> {
  const api = getGiftCardsApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.retrieveGiftCardFromGAN({
      gan,
    });

    if (response.result.giftCard) {
      const gc = response.result.giftCard;
      return {
        id: gc.id!,
        gan: gc.gan!,
        state: gc.state as SquareGiftCard['state'],
        balanceMoney: {
          amount: gc.balanceMoney?.amount || BigInt(0),
          currency: gc.balanceMoney?.currency || 'USD',
        },
        type: gc.type as 'DIGITAL' | 'PHYSICAL',
        createdAt: gc.createdAt || new Date().toISOString(),
        customerIds: gc.customerIds,
      };
    }
    return null;
  } catch (error) {
    console.error('Square get gift card by GAN error:', error);
    return null;
  }
}

/**
 * Link gift card to a customer
 */
export async function linkGiftCardToCustomer(
  giftCardId: string,
  customerId: string
): Promise<boolean> {
  const api = getGiftCardsApi();
  if (!api) {
    console.warn('Square not configured');
    return false;
  }

  try {
    await api.linkCustomerToGiftCard(giftCardId, {
      customerId,
    });
    return true;
  } catch (error) {
    console.error('Square link customer to gift card error:', error);
    return false;
  }
}

/**
 * Unlink gift card from customer
 */
export async function unlinkGiftCardFromCustomer(
  giftCardId: string,
  customerId: string
): Promise<boolean> {
  const api = getGiftCardsApi();
  if (!api) {
    console.warn('Square not configured');
    return false;
  }

  try {
    await api.unlinkCustomerFromGiftCard(giftCardId, {
      customerId,
    });
    return true;
  } catch (error) {
    console.error('Square unlink customer from gift card error:', error);
    return false;
  }
}

/**
 * List gift card activities
 */
export async function listGiftCardActivities(
  giftCardId?: string,
  locationId?: string,
  limit: number = 50
): Promise<GiftCardActivity[]> {
  const api = getGiftCardActivitiesApi();
  if (!api) {
    console.warn('Square not configured');
    return [];
  }

  try {
    const response = await api.listGiftCardActivities(
      giftCardId,
      undefined, // type filter
      locationId,
      undefined, // begin time
      undefined, // end time
      limit.toString()
    );

    return (response.result.giftCardActivities || []).map((activity) => ({
      id: activity.id!,
      type: activity.type as GiftCardActivity['type'],
      locationId: activity.locationId!,
      giftCardId: activity.giftCardId!,
      giftCardGan: activity.giftCardGan!,
      giftCardBalanceMoney: {
        amount: activity.giftCardBalanceMoney?.amount || BigInt(0),
        currency: activity.giftCardBalanceMoney?.currency || 'USD',
      },
      createdAt: activity.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Square list gift card activities error:', error);
    return [];
  }
}

/**
 * Deactivate a gift card (void)
 */
export async function deactivateSquareGiftCard(
  giftCardId: string,
  locationId: string,
  reason?: string
): Promise<GiftCardActivity | null> {
  const api = getGiftCardActivitiesApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const response = await api.createGiftCardActivity({
      idempotencyKey: crypto.randomUUID(),
      giftCardActivity: {
        type: 'DEACTIVATE',
        locationId,
        giftCardId,
        deactivateActivityDetails: {
          reason: reason || 'SUSPICIOUS_ACTIVITY',
        },
      },
    });

    if (response.result.giftCardActivity) {
      const activity = response.result.giftCardActivity;
      return {
        id: activity.id!,
        type: activity.type as GiftCardActivity['type'],
        locationId: activity.locationId!,
        giftCardId: activity.giftCardId!,
        giftCardGan: activity.giftCardGan!,
        giftCardBalanceMoney: {
          amount: activity.giftCardBalanceMoney?.amount || BigInt(0),
          currency: activity.giftCardBalanceMoney?.currency || 'USD',
        },
        createdAt: activity.createdAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Square deactivate gift card error:', error);
    return null;
  }
}

/**
 * Adjust gift card balance (increment or decrement)
 */
export async function adjustSquareGiftCardBalance(
  giftCardId: string,
  amountCents: number,
  locationId: string,
  reason?: string,
  increment: boolean = true
): Promise<GiftCardActivity | null> {
  const api = getGiftCardActivitiesApi();
  if (!api) {
    console.warn('Square not configured');
    return null;
  }

  try {
    const activityDetails = increment 
      ? { adjustIncrementActivityDetails: { amountMoney: { amount: BigInt(amountCents), currency: 'USD' }, reason: reason || 'SUPPORT_ISSUE' } }
      : { adjustDecrementActivityDetails: { amountMoney: { amount: BigInt(amountCents), currency: 'USD' }, reason: reason || 'SUPPORT_ISSUE' } };

    const response = await api.createGiftCardActivity({
      idempotencyKey: crypto.randomUUID(),
      giftCardActivity: {
        type: increment ? 'ADJUST_INCREMENT' : 'ADJUST_DECREMENT',
        locationId,
        giftCardId,
        ...activityDetails,
      },
    });

    if (response.result.giftCardActivity) {
      const activity = response.result.giftCardActivity;
      return {
        id: activity.id!,
        type: activity.type as GiftCardActivity['type'],
        locationId: activity.locationId!,
        giftCardId: activity.giftCardId!,
        giftCardGan: activity.giftCardGan!,
        giftCardBalanceMoney: {
          amount: activity.giftCardBalanceMoney?.amount || BigInt(0),
          currency: activity.giftCardBalanceMoney?.currency || 'USD',
        },
        createdAt: activity.createdAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Square adjust gift card balance error:', error);
    return null;
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if Square is configured (sync, uses static token)
 */
export function isSquareConfigured(): boolean {
  return !!getStaticClient();
}

/**
 * Check if Square is configured (async, checks OAuth connection)
 */
export async function isSquareConfiguredAsync(): Promise<boolean> {
  const client = await getSquareClientAsync();
  return !!client;
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
