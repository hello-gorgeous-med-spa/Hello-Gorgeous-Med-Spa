// ============================================================
// SQUARE TERMINAL UTILITIES
// Terminal checkout creation and management
// ============================================================
// PHI COMPLIANCE:
// - Orders use only generic line items (Service/Product/Deposit)
// - Receipts (if printed/emailed by Square) must remain generic
// - Never include appointment details, provider names, or clinical info
// - Reference tokens are UUID-based (non-sequential)
// ============================================================

import { getTerminalApiAsync, getOrdersApiAsync, getPaymentsApiAsync } from './client';
import { getActiveConnection } from './oauth';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';

// ============================================================
// TYPES
// ============================================================

export interface TerminalCheckoutParams {
  saleId: string;
  amountCents: number;
  deviceId: string; // Our internal device ID
  locationId: string;
  // PHI COMPLIANCE: Line items must use generic category names only
  // Max 3 items: "Service", "Product", "Deposit" - never treatment names
  lineItems?: Array<{
    name: string; // Must be generic: "Service", "Product", "Deposit"
    quantity: number;
    unitPriceCents: number;
    // NOTE: Do not include 'note' field - it can expose PHI
  }>;
  // PHI-SAFE: Use UUID-based reference token (e.g., "Ref: a1b2c3d4")
  // Never include client names, treatment info, or sequential patterns
  note?: string;
  referenceId?: string;
  tipSettings?: {
    allowTipping?: boolean;
    separateTipScreen?: boolean;
    customTipField?: boolean;
    tipPercentages?: number[];
    smartTipping?: boolean;
  };
  // Generic adjustments (no reason text to avoid PHI)
  discountCents?: number;
  taxCents?: number;
}

export interface TerminalCheckoutResult {
  checkoutId: string;
  orderId: string | null;
  status: string;
  createdAt: string;
}

export interface TerminalStatus {
  checkoutId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CANCEL_REQUESTED' | 'CANCELED' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  paymentIds: string[];
  amountMoney: number;
  tipMoney: number;
  totalMoney: number;
  errorCode?: string;
  errorMessage?: string;
  updatedAt: string;
}

// ============================================================
// TERMINAL CHECKOUT FUNCTIONS
// ============================================================

/**
 * Create a terminal checkout with tip-on-device settings
 */
export async function createTerminalCheckout(
  params: TerminalCheckoutParams
): Promise<TerminalCheckoutResult> {
  const {
    saleId,
    amountCents,
    deviceId,
    locationId,
    lineItems,
    note,
    referenceId,
    tipSettings = {
      allowTipping: true,
      separateTipScreen: true,
      customTipField: true,
      tipPercentages: [15, 20, 25],
    },
    discountCents = 0,
    taxCents = 0,
  } = params;
  
  const supabase = createAdminSupabaseClient() ?? createServerSupabaseClient();
  if (!supabase) {
    throw new Error('Database not configured');
  }
  
  // Get Square device ID from our database
  const { data: device } = await supabase
    .from('square_devices')
    .select('square_device_id')
    .eq('id', deviceId)
    .single();
  
  if (!device) {
    throw new Error('Device not found');
  }
  
  const terminalApi = await getTerminalApiAsync();
  if (!terminalApi) {
    throw new Error('Terminal API not available');
  }
  
  // Optionally create a Square Order first (for line items and reconciliation)
  // PHI COMPLIANCE: Order line items use generic category names only
  let squareOrderId: string | null = null;
  
  if (lineItems && lineItems.length > 0) {
    const ordersApi = await getOrdersApiAsync();
    if (ordersApi) {
      try {
        // Build order with PHI-safe line items
        const orderLineItems = lineItems.map(item => ({
          name: item.name, // Must be generic: "Service", "Product", "Deposit"
          quantity: item.quantity.toString(),
          basePriceMoney: {
            amount: BigInt(item.unitPriceCents),
            currency: 'USD',
          },
          // NOTE: Intentionally omitting 'note' field to prevent PHI exposure
        }));
        
        // Build order request
        const orderRequest: any = {
          order: {
            locationId,
            referenceId: saleId, // Internal ID only - no PHI
            lineItems: orderLineItems,
          },
          idempotencyKey: crypto.randomUUID(),
        };
        
        // Add generic discount adjustment (no reason text - PHI safe)
        if (discountCents > 0) {
          orderRequest.order.discounts = [{
            name: 'Discount', // Generic, no reason text
            amountMoney: {
              amount: BigInt(discountCents),
              currency: 'USD',
            },
            scope: 'ORDER',
          }];
        }
        
        // Add generic tax (if not already included in line item prices)
        if (taxCents > 0) {
          orderRequest.order.taxes = [{
            name: 'Tax', // Generic
            percentage: '0', // We use fixed amount instead
            scope: 'ORDER',
          }];
          // Note: Square calculates tax based on percentage, so we may need
          // to adjust line item prices to account for tax if using fixed amount
        }
        
        const { result: orderResult } = await ordersApi.createOrder(orderRequest);
        
        squareOrderId = orderResult.order?.id || null;
      } catch (orderError) {
        console.error('Failed to create Square order:', orderError);
        // Continue without order - terminal checkout still works
      }
    }
  }
  
  const idempotencyKey = crypto.randomUUID();
  
  // Create terminal checkout with tip settings
  const { result } = await terminalApi.createTerminalCheckout({
    idempotencyKey,
    checkout: {
      amountMoney: {
        amount: BigInt(amountCents),
        currency: 'USD',
      },
      deviceOptions: {
        deviceId: device.square_device_id,
        skipReceiptScreen: false,
        collectSignature: false,
        tipSettings: {
          allowTipping: tipSettings.allowTipping ?? true,
          separateTipScreen: tipSettings.separateTipScreen ?? true,
          customTipField: tipSettings.customTipField ?? true,
          tipPercentages: tipSettings.tipPercentages 
            ? tipSettings.tipPercentages.map(p => p) 
            : [15, 20, 25],
          smartTipping: tipSettings.smartTipping ?? false,
        },
      },
      orderId: squareOrderId || undefined,
      paymentType: 'CARD_PRESENT',
      referenceId: referenceId || saleId,
      // PHI COMPLIANCE: Note should only contain internal reference
      note: note || `Ref: ${saleId.substring(0, 8)}`,
    },
  });
  
  if (!result.checkout) {
    throw new Error('Failed to create terminal checkout');
  }
  
  const checkout = result.checkout;
  
  // Store in terminal_checkouts table
  await supabase.from('terminal_checkouts').insert({
    sale_id: saleId,
    device_id: deviceId,
    square_checkout_id: checkout.id,
    square_order_id: squareOrderId,
    amount_money: amountCents,
    status: checkout.status || 'PENDING',
    idempotency_key: idempotencyKey,
  });
  
  return {
    checkoutId: checkout.id!,
    orderId: squareOrderId,
    status: checkout.status || 'PENDING',
    createdAt: checkout.createdAt || new Date().toISOString(),
  };
}

/**
 * Get terminal checkout status
 */
export async function getTerminalCheckoutStatus(
  checkoutId: string
): Promise<TerminalStatus | null> {
  const terminalApi = await getTerminalApiAsync();
  if (!terminalApi) {
    return null;
  }
  
  try {
    const { result } = await terminalApi.getTerminalCheckout(checkoutId);
    
    if (!result.checkout) {
      return null;
    }
    
    const checkout = result.checkout;
    
    return {
      checkoutId: checkout.id!,
      status: checkout.status as TerminalStatus['status'],
      paymentIds: checkout.paymentIds || [],
      amountMoney: Number(checkout.amountMoney?.amount || 0),
      tipMoney: Number(checkout.tipMoney?.amount || 0),
      totalMoney: Number(checkout.amountMoney?.amount || 0) + Number(checkout.tipMoney?.amount || 0),
      errorCode: checkout.cancelReason,
      updatedAt: checkout.updatedAt || checkout.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting terminal checkout status:', error);
    return null;
  }
}

/**
 * Cancel a terminal checkout
 */
export async function cancelTerminalCheckout(
  checkoutId: string
): Promise<boolean> {
  const terminalApi = await getTerminalApiAsync();
  if (!terminalApi) {
    throw new Error('Terminal API not available');
  }
  
  try {
    await terminalApi.cancelTerminalCheckout(checkoutId);
    
    // Update our database
    const supabase = createAdminSupabaseClient() ?? createServerSupabaseClient();
    if (supabase) {
      await supabase
        .from('terminal_checkouts')
        .update({ 
          status: 'CANCELED',
          canceled_at: new Date().toISOString(),
        })
        .eq('square_checkout_id', checkoutId);
    }
    
    return true;
  } catch (error: any) {
    console.error('Error canceling terminal checkout:', error);
    
    // Check if already completed/canceled
    if (error.errors?.some((e: any) => 
      e.code === 'BAD_REQUEST' || 
      e.code === 'NOT_FOUND' ||
      e.detail?.includes('cannot be canceled')
    )) {
      return false;
    }
    
    throw error;
  }
}

/**
 * Fetch payment details after checkout completes
 * Returns the full payment including tip amount
 */
export async function fetchPaymentDetails(
  paymentId: string
): Promise<{
  paymentId: string;
  status: string;
  amountMoney: number;
  tipMoney: number;
  totalMoney: number;
  cardBrand?: string;
  cardLast4?: string;
  receiptUrl?: string;
  rawPayment: any;
} | null> {
  const paymentsApi = await getPaymentsApiAsync();
  if (!paymentsApi) {
    return null;
  }
  
  try {
    const { result } = await paymentsApi.getPayment(paymentId);
    
    if (!result.payment) {
      return null;
    }
    
    const payment = result.payment;
    
    return {
      paymentId: payment.id!,
      status: payment.status || 'UNKNOWN',
      amountMoney: Number(payment.amountMoney?.amount || 0),
      tipMoney: Number(payment.tipMoney?.amount || 0),
      totalMoney: Number(payment.totalMoney?.amount || 0),
      cardBrand: payment.cardDetails?.card?.cardBrand,
      cardLast4: payment.cardDetails?.card?.last4,
      receiptUrl: payment.receiptUrl,
      rawPayment: payment,
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return null;
  }
}

/**
 * Get checkout status from our database (for polling)
 */
export async function getCheckoutStatusFromDb(
  saleId: string
): Promise<{
  checkoutId: string;
  status: string;
  paymentId: string | null;
  tipMoney: number;
  totalMoney: number;
  errorMessage: string | null;
} | null> {
  const supabase = createAdminSupabaseClient() ?? createServerSupabaseClient();
  if (!supabase) return null;
  
  const { data: checkout } = await supabase
    .from('terminal_checkouts')
    .select('*')
    .eq('sale_id', saleId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (!checkout) {
    return null;
  }
  
  return {
    checkoutId: checkout.square_checkout_id,
    status: checkout.status,
    paymentId: checkout.square_payment_id,
    tipMoney: checkout.tip_money || 0,
    totalMoney: (checkout.amount_money || 0) + (checkout.tip_money || 0),
    errorMessage: checkout.error_message,
  };
}
