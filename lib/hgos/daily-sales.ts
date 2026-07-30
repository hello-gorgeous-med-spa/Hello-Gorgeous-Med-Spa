// ============================================================
// HELLO GORGEOUS OS - DAILY SALES SUMMARY
// End-of-day POS reconciliation and cash movement tracking
// ============================================================

export interface DailySalesSummary {
  date: string;
  // Transaction Summary
  transactionSummary: TransactionSummary;
  // Cash Movement
  cashMovement: CashMovementSummary;
  // Appointments
  appointmentSummary: AppointmentSummary;
  // Totals
  totals: DailyTotals;
}

export interface TransactionSummary {
  items: TransactionLineItem[];
  grossTotal: number;
  refundsTotal: number;
  netTotal: number;
}

export interface TransactionLineItem {
  type: TransactionItemType;
  label: string;
  salesQty: number;
  refundQty: number;
  grossTotal: number;
}

export type TransactionItemType = 
  | 'services'
  | 'service_addons'
  | 'products'
  | 'shipping'
  | 'vouchers'
  | 'memberships'
  | 'late_cancellation_fees'
  | 'no_show_fees'
  | 'gift_cards'
  | 'tips'
  | 'deposits';

export interface CashMovementSummary {
  items: CashMovementItem[];
  totalCollected: number;
  totalRefunded: number;
  netCashMovement: number;
}

export interface CashMovementItem {
  paymentType: PaymentType;
  label: string;
  paymentsCollected: number;
  refundsPaid: number;
  netAmount: number;
}

export type PaymentType = 
  | 'cash'
  | 'card_terminal'
  | 'card_online'
  | 'deposit_redemption'
  | 'gift_card'
  | 'alle_cashback'
  | 'afterpay'
  | 'cherry'
  | 'square_invoice'
  | 'proposal'
  | 'client_credit'
  | 'comp_service'
  | 'other';

export interface AppointmentSummary {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  rescheduled: number;
}

export interface DailyTotals {
  grossSales: number;
  discounts: number;
  refunds: number;
  netSales: number;
  tips: number;
  taxes: number;
  totalCollected: number;
}

// ============================================================
// DEFAULT STRUCTURE
// ============================================================

export const TRANSACTION_ITEM_TYPES: { type: TransactionItemType; label: string }[] = [
  { type: 'services', label: 'Services' },
  { type: 'service_addons', label: 'Service Add-ons' },
  { type: 'products', label: 'Products' },
  { type: 'shipping', label: 'Shipping' },
  { type: 'vouchers', label: 'Vouchers' },
  { type: 'memberships', label: 'Memberships' },
  { type: 'late_cancellation_fees', label: 'Late Cancellation Fees' },
  { type: 'no_show_fees', label: 'No-show Fees' },
  { type: 'gift_cards', label: 'Gift Cards Sold' },
  { type: 'tips', label: 'Tips' },
  { type: 'deposits', label: 'Deposits Collected' },
];

export const PAYMENT_TYPES: { type: PaymentType; label: string }[] = [
  { type: 'cash', label: 'Cash' },
  { type: 'card_terminal', label: 'Card (Terminal)' },
  { type: 'card_online', label: 'Card (Online)' },
  { type: 'deposit_redemption', label: 'Deposit Redemptions' },
  { type: 'gift_card', label: 'Gift Card' },
  { type: 'alle_cashback', label: 'Allē Cash Back Coupon' },
  { type: 'afterpay', label: 'Afterpay' },
  { type: 'cherry', label: 'Cherry Financing' },
  { type: 'square_invoice', label: 'Square Invoice' },
  { type: 'proposal', label: 'Treatment Proposal' },
  { type: 'client_credit', label: 'Client Account Credit' },
  { type: 'comp_service', label: 'Complimentary' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Create empty daily sales summary
 */
export function createEmptyDailySummary(date: string): DailySalesSummary {
  return {
    date,
    transactionSummary: {
      items: TRANSACTION_ITEM_TYPES.map(t => ({
        type: t.type,
        label: t.label,
        salesQty: 0,
        refundQty: 0,
        grossTotal: 0,
      })),
      grossTotal: 0,
      refundsTotal: 0,
      netTotal: 0,
    },
    cashMovement: {
      items: PAYMENT_TYPES.map(p => ({
        paymentType: p.type,
        label: p.label,
        paymentsCollected: 0,
        refundsPaid: 0,
        netAmount: 0,
      })),
      totalCollected: 0,
      totalRefunded: 0,
      netCashMovement: 0,
    },
    appointmentSummary: {
      total: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      rescheduled: 0,
    },
    totals: {
      grossSales: 0,
      discounts: 0,
      refunds: 0,
      netSales: 0,
      tips: 0,
      taxes: 0,
      totalCollected: 0,
    },
  };
}

/**
 * Calculate daily sales from transactions
 */
export function calculateDailySales(
  transactions: any[],
  appointments: any[],
  date: string
): DailySalesSummary {
  const summary = createEmptyDailySummary(date);
  
  // Process transactions
  transactions.forEach(tx => {
    // Find the transaction type
    const itemType = mapTransactionType(tx.type);
    const item = summary.transactionSummary.items.find(i => i.type === itemType);
    
    if (item) {
      if (tx.amount >= 0) {
        item.salesQty++;
        item.grossTotal += tx.amount;
        summary.transactionSummary.grossTotal += tx.amount;
      } else {
        item.refundQty++;
        summary.transactionSummary.refundsTotal += Math.abs(tx.amount);
      }
    }
    
    // Process payment method
    const paymentType = mapPaymentType(tx.payment_method);
    const payment = summary.cashMovement.items.find(p => p.paymentType === paymentType);
    
    if (payment) {
      if (tx.amount >= 0) {
        payment.paymentsCollected += tx.amount;
        summary.cashMovement.totalCollected += tx.amount;
      } else {
        payment.refundsPaid += Math.abs(tx.amount);
        summary.cashMovement.totalRefunded += Math.abs(tx.amount);
      }
      payment.netAmount = payment.paymentsCollected - payment.refundsPaid;
    }
    
    // Update totals
    if (tx.type === 'tip') {
      summary.totals.tips += tx.amount;
    } else if (tx.amount >= 0) {
      summary.totals.grossSales += tx.amount;
    } else {
      summary.totals.refunds += Math.abs(tx.amount);
    }
    
    summary.totals.discounts += tx.discount_amount || 0;
    summary.totals.taxes += tx.tax_amount || 0;
  });
  
  // Calculate net totals
  summary.transactionSummary.netTotal = 
    summary.transactionSummary.grossTotal - summary.transactionSummary.refundsTotal;
  summary.cashMovement.netCashMovement = 
    summary.cashMovement.totalCollected - summary.cashMovement.totalRefunded;
  summary.totals.netSales = 
    summary.totals.grossSales - summary.totals.discounts - summary.totals.refunds;
  summary.totals.totalCollected = summary.cashMovement.netCashMovement;
  
  // Process appointments
  appointments.forEach(apt => {
    summary.appointmentSummary.total++;
    
    switch (apt.status) {
      case 'completed':
        summary.appointmentSummary.completed++;
        break;
      case 'cancelled':
        summary.appointmentSummary.cancelled++;
        break;
      case 'no_show':
        summary.appointmentSummary.noShow++;
        break;
    }
  });
  
  return summary;
}

function mapTransactionType(type: string): TransactionItemType {
  const mapping: Record<string, TransactionItemType> = {
    'service': 'services',
    'addon': 'service_addons',
    'product': 'products',
    'shipping': 'shipping',
    'voucher': 'vouchers',
    'membership': 'memberships',
    'late_cancel': 'late_cancellation_fees',
    'no_show': 'no_show_fees',
    'gift_card': 'gift_cards',
    'tip': 'tips',
    'deposit': 'deposits',
  };
  return mapping[type] || 'services';
}

function mapPaymentType(method: string): PaymentType {
  const mapping: Record<string, PaymentType> = {
    'cash': 'cash',
    'card_terminal': 'card_terminal',
    'card_online': 'card_online',
    'deposit': 'deposit_redemption',
    'gift_card': 'gift_card',
    'alle_cashback': 'alle_cashback',
    'afterpay': 'afterpay',
    'cherry': 'cherry',
    'square_invoice': 'square_invoice',
    'proposal': 'proposal',
    'treatment_proposal': 'proposal',
    'client_credit': 'client_credit',
    'comp': 'comp_service',
  };
  return mapping[method] || 'other';
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Get date range for period
 */
export function getDateRange(period: 'today' | 'yesterday' | 'week' | 'month'): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

// ============================================================
// CASH DRAWER MANAGEMENT
// ============================================================

export interface CashDrawerSession {
  id: string;
  openedAt: string;
  openedBy: string;
  openingBalance: number;
  closedAt?: string;
  closedBy?: string;
  closingBalance?: number;
  expectedBalance?: number;
  variance?: number;
  notes?: string;
  transactions: CashDrawerTransaction[];
}

export interface CashDrawerTransaction {
  id: string;
  timestamp: string;
  type: 'cash_in' | 'cash_out' | 'sale' | 'refund' | 'adjustment';
  amount: number;
  description: string;
  reference?: string;
  userId: string;
}

/**
 * Calculate expected cash drawer balance
 */
export function calculateExpectedBalance(session: CashDrawerSession): number {
  let balance = session.openingBalance;
  
  session.transactions.forEach(tx => {
    switch (tx.type) {
      case 'cash_in':
      case 'sale':
        balance += tx.amount;
        break;
      case 'cash_out':
      case 'refund':
        balance -= tx.amount;
        break;
      case 'adjustment':
        balance += tx.amount; // Can be positive or negative
        break;
    }
  });
  
  return balance;
}

/**
 * Close cash drawer session
 */
export function closeCashDrawer(
  session: CashDrawerSession,
  closingBalance: number,
  closedBy: string,
  notes?: string
): CashDrawerSession {
  const expectedBalance = calculateExpectedBalance(session);
  
  return {
    ...session,
    closedAt: new Date().toISOString(),
    closedBy,
    closingBalance,
    expectedBalance,
    variance: closingBalance - expectedBalance,
    notes,
  };
}

// ============================================================
// EXPORT FUNCTIONS
// ============================================================

/**
 * Export daily summary as CSV
 */
export function exportDailySummaryCSV(summary: DailySalesSummary): string {
  const lines: string[] = [
    `Daily Sales Summary - ${summary.date}`,
    '',
    'TRANSACTION SUMMARY',
    'Item Type,Sales Qty,Refund Qty,Gross Total',
  ];
  
  summary.transactionSummary.items.forEach(item => {
    lines.push(`${item.label},${item.salesQty},${item.refundQty},${formatCurrency(item.grossTotal)}`);
  });
  
  lines.push(`Total,,,${formatCurrency(summary.transactionSummary.netTotal)}`);
  lines.push('');
  lines.push('CASH MOVEMENT');
  lines.push('Payment Type,Collected,Refunded,Net');
  
  summary.cashMovement.items.forEach(item => {
    if (item.paymentsCollected > 0 || item.refundsPaid > 0) {
      lines.push(`${item.label},${formatCurrency(item.paymentsCollected)},${formatCurrency(item.refundsPaid)},${formatCurrency(item.netAmount)}`);
    }
  });
  
  lines.push(`Total,${formatCurrency(summary.cashMovement.totalCollected)},${formatCurrency(summary.cashMovement.totalRefunded)},${formatCurrency(summary.cashMovement.netCashMovement)}`);
  lines.push('');
  lines.push('APPOINTMENTS');
  lines.push(`Total,${summary.appointmentSummary.total}`);
  lines.push(`Completed,${summary.appointmentSummary.completed}`);
  lines.push(`Cancelled,${summary.appointmentSummary.cancelled}`);
  lines.push(`No-shows,${summary.appointmentSummary.noShow}`);
  
  return lines.join('\n');
}
