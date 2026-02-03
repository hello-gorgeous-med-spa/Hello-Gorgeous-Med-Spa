// ============================================================
// PAYMENT PROCESSOR CONFIGURATION
// Hello Gorgeous Med Spa - Square Primary
// ============================================================
// 
// DECISION: FINAL (Owner Decision - Effective Immediately)
// 
// Square is the ONLY active payment processor for Hello Gorgeous.
// Stripe is DEPRECATED and must not be used.
// 
// This configuration is processor-agnostic internally but
// Square is the only implementation currently active.
// ============================================================

// ============================================================
// PROCESSOR CONFIGURATION
// ============================================================

export const PAYMENT_PROCESSOR_CONFIG = {
  // Primary processor - the one that handles all payments
  primary: 'square' as const,
  
  // Deprecated processors - DO NOT USE
  deprecated: ['stripe'] as const,
  
  // Feature flags
  flags: {
    STRIPE_ENABLED: false,  // DEPRECATED - DO NOT CHANGE
    SQUARE_ENABLED: true,   // Primary processor
    CASH_ENABLED: true,     // Cash payments
    GIFT_CARD_ENABLED: true, // Square gift cards
  },
  
  // Processor details
  processors: {
    square: {
      name: 'Square',
      enabled: true,
      supportsCards: true,
      supportsGiftCards: true,
      supportsTips: true,
      supportsRefunds: true,
      feeRate: 0.026, // 2.6%
      feeFixed: 10,   // $0.10 in cents
    },
    stripe: {
      name: 'Stripe',
      enabled: false, // DEPRECATED
      deprecated: true,
      deprecationDate: '2026-02-02',
      deprecationReason: 'Square is primary for physical med spa operations',
    },
    cash: {
      name: 'Cash',
      enabled: true,
      feeRate: 0,
      feeFixed: 0,
    },
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Check if a processor is enabled
 */
export function isProcessorEnabled(processor: string): boolean {
  const config = PAYMENT_PROCESSOR_CONFIG.processors[processor as keyof typeof PAYMENT_PROCESSOR_CONFIG.processors];
  return config?.enabled ?? false;
}

/**
 * Get the primary processor
 */
export function getPrimaryProcessor(): string {
  return PAYMENT_PROCESSOR_CONFIG.primary;
}

/**
 * Check if Stripe is deprecated (always true)
 */
export function isStripeDeprecated(): boolean {
  return true; // Stripe is deprecated for Hello Gorgeous
}

/**
 * Calculate processing fee for a payment
 */
export function calculateProcessingFee(amountCents: number, processor: string): number {
  const config = PAYMENT_PROCESSOR_CONFIG.processors[processor as keyof typeof PAYMENT_PROCESSOR_CONFIG.processors];
  if (!config || !('feeRate' in config)) return 0;
  
  return Math.round(amountCents * config.feeRate + (config.feeFixed || 0));
}

/**
 * Get all enabled payment methods
 */
export function getEnabledPaymentMethods(): string[] {
  const methods: string[] = [];
  
  if (PAYMENT_PROCESSOR_CONFIG.flags.SQUARE_ENABLED) {
    methods.push('card');
  }
  if (PAYMENT_PROCESSOR_CONFIG.flags.CASH_ENABLED) {
    methods.push('cash');
  }
  if (PAYMENT_PROCESSOR_CONFIG.flags.GIFT_CARD_ENABLED) {
    methods.push('gift_card');
  }
  
  return methods;
}

/**
 * Validate that a payment processor is allowed
 * Throws error if trying to use a deprecated processor
 */
export function validateProcessor(processor: string): void {
  if (PAYMENT_PROCESSOR_CONFIG.deprecated.includes(processor as any)) {
    throw new Error(`PROCESSOR_DEPRECATED: ${processor} is no longer used. Use ${PAYMENT_PROCESSOR_CONFIG.primary} instead.`);
  }
  
  if (!isProcessorEnabled(processor)) {
    throw new Error(`PROCESSOR_DISABLED: ${processor} is not enabled.`);
  }
}

// ============================================================
// DEPRECATION WARNINGS
// ============================================================

// Log warning if this module is loaded
if (typeof window === 'undefined') {
  console.info('💳 Payment Processor: Square (Primary)');
  console.info('⚠️  Stripe: DEPRECATED - Do not use');
}
