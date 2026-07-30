// ============================================================
// HELLO GORGEOUS OS - PAYMENT METHODS CONFIGURATION
// Matches Fresha payment methods for checkout
// ============================================================

export interface PaymentMethod {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description?: string;
  isActive: boolean;
  isDefault?: boolean;
  requiresVerification?: boolean;
  processingFeePercent?: number;
  order: number;
  // Payment type categorization
  type: 'cash' | 'card' | 'financing' | 'credit' | 'gift' | 'comp' | 'deposit' | 'other';
  // For financing options
  financingPartner?: string;
  financingUrl?: string;
  // For gift cards/certificates
  canCheckBalance?: boolean;
  // Settings
  showAtCheckout: boolean;
  showOnInvoice: boolean;
  trackInReports: boolean;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  // === STANDARD PAYMENT METHODS ===
  {
    id: 'cash',
    name: 'Cash',
    displayName: 'Cash',
    icon: '💵',
    description: 'Cash payment',
    isActive: true,
    isDefault: false,
    order: 1,
    type: 'cash',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'card_terminal',
    name: 'Card Terminal',
    displayName: 'Card (Terminal)',
    icon: '💳',
    description: 'Credit/debit card via terminal',
    isActive: true,
    isDefault: true,
    requiresVerification: true,
    processingFeePercent: 2.9,
    order: 2,
    type: 'card',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'card_online',
    name: 'Card Online',
    displayName: 'Card (Online)',
    icon: '🌐',
    description: 'Credit/debit card online payment',
    isActive: true,
    isDefault: false,
    requiresVerification: true,
    processingFeePercent: 2.9,
    order: 3,
    type: 'card',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },

  // === DEPOSITS ===
  {
    id: 'deposit',
    name: 'Deposit',
    displayName: 'Deposit',
    icon: '🔒',
    description: 'Booking deposit applied to service',
    isActive: true,
    order: 4,
    type: 'deposit',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'deposit_custom',
    name: 'Deposit (Custom)',
    displayName: 'Deposit (Custom)',
    icon: '🔐',
    description: 'Custom deposit amount',
    isActive: true,
    order: 5,
    type: 'deposit',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },

  // === FINANCING OPTIONS ===
  {
    id: 'afterpay',
    name: 'Afterpay',
    displayName: 'Afterpay',
    icon: '🅰️',
    description: 'Pay in 4 interest-free installments',
    isActive: true,
    order: 6,
    type: 'financing',
    financingPartner: 'Afterpay',
    financingUrl: 'https://www.afterpay.com',
    requiresVerification: true,
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'cherry',
    name: 'Cherry',
    displayName: 'Cherry Financing',
    icon: '🍒',
    description: 'Patient financing for aesthetic treatments',
    isActive: true,
    order: 7,
    type: 'financing',
    financingPartner: 'Cherry',
    financingUrl: 'https://www.withcherry.com',
    requiresVerification: true,
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'square_invoice',
    name: 'Square Invoice',
    displayName: 'Square Invoice / Payment Link',
    icon: '🧾',
    description: 'Square Payment Link or invoice (online card)',
    isActive: true,
    order: 7.5,
    type: 'card',
    processingFeePercent: 2.9,
    requiresVerification: true,
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'proposal',
    name: 'Proposal',
    displayName: 'Treatment Proposal',
    icon: '📝',
    description: 'Payment toward a treatment proposal (deposit or balance)',
    isActive: true,
    order: 7.6,
    type: 'other',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },

  // === GIFT & CREDITS ===
  {
    id: 'gift_card',
    name: 'Gift Card',
    displayName: 'Gift Card',
    icon: '🎁',
    description: 'Hello Gorgeous gift card',
    isActive: true,
    order: 8,
    type: 'gift',
    canCheckBalance: true,
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'gift_certificate',
    name: 'Gift Certificate',
    displayName: 'Gift Certificate',
    icon: '📜',
    description: 'Gift certificate redemption',
    isActive: true,
    order: 9,
    type: 'gift',
    canCheckBalance: true,
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
  {
    id: 'client_credit',
    name: 'Client Account Credit',
    displayName: 'Account Credit',
    icon: '💰',
    description: 'Credit from client account balance',
    isActive: true,
    order: 10,
    type: 'credit',
    canCheckBalance: true,
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },

  // === COUPONS & REBATES ===
  {
    id: 'alle_cashback',
    name: 'Alle Cash Back Coupon',
    displayName: 'Allē Cash Back',
    icon: '✨',
    description: 'Allergan Allē rewards redemption',
    isActive: true,
    order: 11,
    type: 'credit',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },

  // === COMPLIMENTARY ===
  {
    id: 'comp_service',
    name: 'Comp Service',
    displayName: 'Complimentary',
    icon: '🎀',
    description: 'Complimentary service (no charge)',
    isActive: true,
    order: 12,
    type: 'comp',
    showAtCheckout: true,
    showOnInvoice: true,
    trackInReports: true,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all active payment methods
 */
export function getActivePaymentMethods(): PaymentMethod[] {
  return PAYMENT_METHODS.filter(m => m.isActive).sort((a, b) => a.order - b.order);
}

/**
 * Get payment methods shown at checkout
 */
export function getCheckoutPaymentMethods(): PaymentMethod[] {
  return PAYMENT_METHODS.filter(m => m.isActive && m.showAtCheckout).sort((a, b) => a.order - b.order);
}

/**
 * Get payment method by ID
 */
export function getPaymentMethod(id: string): PaymentMethod | undefined {
  return PAYMENT_METHODS.find(m => m.id === id);
}

/**
 * Get default payment method
 */
export function getDefaultPaymentMethod(): PaymentMethod {
  return PAYMENT_METHODS.find(m => m.isDefault) || PAYMENT_METHODS[0];
}

/**
 * Get payment methods by type
 */
export function getPaymentMethodsByType(type: PaymentMethod['type']): PaymentMethod[] {
  return PAYMENT_METHODS.filter(m => m.type === type && m.isActive);
}

/**
 * Get financing options
 */
export function getFinancingOptions(): PaymentMethod[] {
  return PAYMENT_METHODS.filter(m => m.type === 'financing' && m.isActive);
}

/**
 * Check if method requires verification (e.g., card processing)
 */
export function requiresVerification(methodId: string): boolean {
  const method = getPaymentMethod(methodId);
  return method?.requiresVerification || false;
}

/**
 * Get processing fee for a payment method
 */
export function getProcessingFee(methodId: string, amount: number): number {
  const method = getPaymentMethod(methodId);
  if (!method?.processingFeePercent) return 0;
  return amount * (method.processingFeePercent / 100);
}

/**
 * Format payment method for display
 */
export function formatPaymentMethod(methodId: string): string {
  const method = getPaymentMethod(methodId);
  if (!method) return methodId;
  return `${method.icon} ${method.displayName}`;
}

/**
 * Group payment methods by type for checkout display
 */
export function getGroupedPaymentMethods(): Record<string, PaymentMethod[]> {
  const methods = getCheckoutPaymentMethods();
  const groups: Record<string, PaymentMethod[]> = {
    'Standard': [],
    'Deposits': [],
    'Financing': [],
    'Gift & Credits': [],
    'Other': [],
  };

  methods.forEach(method => {
    switch (method.type) {
      case 'cash':
      case 'card':
        groups['Standard'].push(method);
        break;
      case 'deposit':
        groups['Deposits'].push(method);
        break;
      case 'financing':
        groups['Financing'].push(method);
        break;
      case 'gift':
      case 'credit':
        groups['Gift & Credits'].push(method);
        break;
      default:
        groups['Other'].push(method);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) delete groups[key];
  });

  return groups;
}

// ============================================================
// PAYMENT SPLIT SUPPORT
// ============================================================

export interface PaymentSplit {
  methodId: string;
  amount: number;
  reference?: string; // For gift card numbers, transaction IDs, etc.
}

/**
 * Validate a split payment
 */
export function validatePaymentSplit(
  splits: PaymentSplit[],
  totalAmount: number
): { valid: boolean; message?: string } {
  if (splits.length === 0) {
    return { valid: false, message: 'At least one payment method required' };
  }

  const totalPaid = splits.reduce((sum, s) => sum + s.amount, 0);
  
  // Allow small rounding differences
  if (Math.abs(totalPaid - totalAmount) > 0.01) {
    return { 
      valid: false, 
      message: `Payment total ($${totalPaid.toFixed(2)}) doesn't match invoice ($${totalAmount.toFixed(2)})` 
    };
  }

  // Validate each method exists
  for (const split of splits) {
    const method = getPaymentMethod(split.methodId);
    if (!method) {
      return { valid: false, message: `Unknown payment method: ${split.methodId}` };
    }
    if (!method.isActive) {
      return { valid: false, message: `Payment method not active: ${method.displayName}` };
    }
  }

  return { valid: true };
}
