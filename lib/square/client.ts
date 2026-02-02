// ============================================================
// SQUARE SDK CLIENT
// Full integration for payments and gift cards
// ============================================================

// Lazy-load Square to prevent build-time crashes when env vars are missing
let _squareClient: ReturnType<typeof initSquareClient> = null;
let _initialized = false;

function initSquareClient() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) return null;
  
  try {
    // Dynamic import to prevent build-time access to Environment enum
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

function getSquareClient() {
  if (!_initialized) {
    _squareClient = initSquareClient();
    _initialized = true;
  }
  return _squareClient;
}

// Export getter functions for APIs (lazy initialization)
export const getGiftCardsApi = () => getSquareClient()?.giftCardsApi ?? null;
export const getGiftCardActivitiesApi = () => getSquareClient()?.giftCardActivitiesApi ?? null;
export const getPaymentsApi = () => getSquareClient()?.paymentsApi ?? null;
export const getCustomersApi = () => getSquareClient()?.customersApi ?? null;
export const getOrdersApi = () => getSquareClient()?.ordersApi ?? null;

// Legacy exports for backwards compatibility (use getters above for new code)
export const squareClient = null as ReturnType<typeof initSquareClient>; // Deprecated
export const giftCardsApi = null; // Deprecated - use getGiftCardsApi()
export const giftCardActivitiesApi = null; // Deprecated - use getGiftCardActivitiesApi()
export const paymentsApi = null; // Deprecated - use getPaymentsApi()
export const customersApi = null; // Deprecated - use getCustomersApi()
export const ordersApi = null; // Deprecated - use getOrdersApi()

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
 * Check if Square is configured
 */
export function isSquareConfigured(): boolean {
  return !!getSquareClient();
}

/**
 * Get Square location ID from environment
 */
export function getSquareLocationId(): string {
  return process.env.SQUARE_LOCATION_ID || '';
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
