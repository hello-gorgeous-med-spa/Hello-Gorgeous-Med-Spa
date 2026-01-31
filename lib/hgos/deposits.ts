// ============================================================
// DEPOSIT SYSTEM
// Handle booking deposits via Stripe
// ============================================================

import Stripe from 'stripe';

export interface DepositConfig {
  enabled: boolean;
  // Minimum service price that requires deposit
  thresholdAmount: number;
  // Deposit percentage
  percentOfService: number;
  // Or fixed amount (overrides percentage)
  fixedAmount?: number;
  // Services that always require deposit (by ID)
  requiredServices: string[];
  // New clients always require deposit
  requireForNewClients: boolean;
  // Refund policy
  refundableUntilHours: number; // Hours before appointment
}

export const DEFAULT_DEPOSIT_CONFIG: DepositConfig = {
  enabled: true,
  thresholdAmount: 500, // Services $500+ require deposit
  percentOfService: 25,
  fixedAmount: undefined,
  requiredServices: ['filler', 'sculptra', 'kybella'],
  requireForNewClients: false,
  refundableUntilHours: 24,
};

// Calculate deposit amount
export function calculateDeposit(
  servicePrice: number,
  serviceId: string,
  isNewClient: boolean,
  config: DepositConfig = DEFAULT_DEPOSIT_CONFIG
): { required: boolean; amount: number; reason: string } {
  if (!config.enabled) {
    return { required: false, amount: 0, reason: 'Deposits disabled' };
  }

  // Check if service requires deposit
  const serviceRequiresDeposit = config.requiredServices.includes(serviceId);
  const priceRequiresDeposit = servicePrice >= config.thresholdAmount;
  const newClientRequiresDeposit = isNewClient && config.requireForNewClients;

  if (!serviceRequiresDeposit && !priceRequiresDeposit && !newClientRequiresDeposit) {
    return { required: false, amount: 0, reason: 'No deposit required' };
  }

  // Calculate amount
  const amount = config.fixedAmount || Math.round(servicePrice * (config.percentOfService / 100));

  let reason = 'Deposit required';
  if (serviceRequiresDeposit) {
    reason = 'This service requires a deposit to book';
  } else if (priceRequiresDeposit) {
    reason = `Services over $${config.thresholdAmount} require a deposit`;
  } else if (newClientRequiresDeposit) {
    reason = 'Deposit required for new clients';
  }

  return { required: true, amount, reason };
}

// Create Stripe payment intent for deposit
export async function createDepositPaymentIntent(
  stripe: Stripe,
  amount: number,
  clientEmail: string,
  metadata: {
    appointmentId?: string;
    clientId?: string;
    serviceId: string;
    serviceName: string;
  }
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    receipt_email: clientEmail,
    metadata: {
      type: 'deposit',
      ...metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}

// Refund deposit
export async function refundDeposit(
  stripe: Stripe,
  paymentIntentId: string,
  reason: string
): Promise<{ refunded: boolean; refundId?: string; error?: string }> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: { reason },
    });

    return { refunded: true, refundId: refund.id };
  } catch (error) {
    console.error('Refund error:', error);
    return { 
      refunded: false, 
      error: error instanceof Error ? error.message : 'Refund failed' 
    };
  }
}

// Apply deposit to final payment
export async function applyDepositToPayment(
  depositAmount: number,
  totalAmount: number
): { remaining: number; depositApplied: number } {
  const depositApplied = Math.min(depositAmount, totalAmount);
  const remaining = totalAmount - depositApplied;

  return { remaining, depositApplied };
}
