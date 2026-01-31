// ============================================================
// POS TYPES
// Type definitions for Point of Sale system
// ============================================================

// ============================================================
// TRANSACTION TYPES
// ============================================================

export type TransactionType = 'sale' | 'refund' | 'void';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'voided';
export type PaymentMethod = 'card' | 'cash' | 'card_on_file' | 'terminal' | 'manual_entry';
export type DiscountType = 'percent' | 'fixed';

export interface Transaction {
  id: string;
  transaction_number: string;
  type: TransactionType;
  status: TransactionStatus;
  
  // Amounts
  subtotal: number;
  discount_amount: number;
  discount_type?: DiscountType;
  discount_percent?: number;
  discount_reason?: string;
  tax_amount: number;
  tip_amount: number;
  total: number;
  
  // Payment
  payment_method: PaymentMethod;
  stripe_payment_intent_id?: string;
  card_brand?: string;
  card_last4?: string;
  
  // References
  client_id?: string;
  appointment_id?: string;
  staff_id: string;
  provider_id?: string;
  location_id: string;
  
  // Metadata
  notes?: string;
  created_at: string;
  completed_at?: string;
  
  // Relations (when joined)
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  
  // Item details
  item_type: 'service' | 'product' | 'package' | 'gift_card' | 'membership';
  item_id?: string;
  name: string;
  description?: string;
  
  // Pricing
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total: number;
  
  // For services
  provider_id?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

// ============================================================
// PRODUCT TYPES
// ============================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category_id?: string;
  
  // Pricing
  price: number;
  cost?: number; // for margin calculation
  
  // Inventory
  track_inventory: boolean;
  quantity_on_hand: number;
  low_stock_threshold: number;
  
  // Status
  is_active: boolean;
  is_taxable: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

// ============================================================
// PACKAGE TYPES
// ============================================================

export interface Package {
  id: string;
  name: string;
  description?: string;
  
  // Pricing
  regular_price: number;
  package_price: number;
  savings: number;
  
  // Contents
  items: PackageItem[];
  
  // Validity
  valid_days?: number; // days after purchase to use
  
  // Status
  is_active: boolean;
  is_featured: boolean;
  
  created_at: string;
}

export interface PackageItem {
  id: string;
  package_id: string;
  service_id: string;
  quantity: number;
  
  // For display
  service_name?: string;
}

// ============================================================
// GIFT CARD TYPES
// ============================================================

export interface GiftCard {
  id: string;
  code: string;
  
  // Value
  initial_value: number;
  current_balance: number;
  
  // Ownership
  purchased_by_client_id?: string;
  recipient_name?: string;
  recipient_email?: string;
  message?: string;
  
  // Purchase info
  transaction_id?: string;
  
  // Status
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  expires_at?: string;
  
  created_at: string;
}

export interface GiftCardUsage {
  id: string;
  gift_card_id: string;
  transaction_id: string;
  amount_used: number;
  balance_after: number;
  used_at: string;
}

// ============================================================
// POS SESSION TYPES
// ============================================================

export interface POSSession {
  id: string;
  staff_id: string;
  location_id: string;
  
  // Cash drawer
  opening_cash: number;
  expected_cash: number;
  actual_cash?: number;
  
  // Totals
  total_sales: number;
  total_refunds: number;
  total_transactions: number;
  
  // Timing
  opened_at: string;
  closed_at?: string;
  
  // Status
  status: 'open' | 'closed';
}

// ============================================================
// RECEIPT TYPES
// ============================================================

export interface Receipt {
  transaction: Transaction;
  items: TransactionItem[];
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  client?: {
    name: string;
    email: string;
  };
}

// ============================================================
// API TYPES
// ============================================================

export interface CreateTransactionRequest {
  client_id?: string;
  appointment_id?: string;
  items: {
    item_type: TransactionItem['item_type'];
    item_id?: string;
    name: string;
    quantity: number;
    unit_price: number;
    discount_amount?: number;
    provider_id?: string;
  }[];
  discount_type?: DiscountType;
  discount_percent?: number;
  discount_amount?: number;
  discount_reason?: string;
  tip_amount?: number;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface ProcessPaymentRequest {
  transaction_id: string;
  payment_method: PaymentMethod;
  payment_method_id?: string; // for card on file
  amount: number;
}

export interface RefundRequest {
  transaction_id: string;
  amount?: number; // partial refund, full if omitted
  reason: string;
  items?: string[]; // specific item IDs to refund
}

export interface TransactionSummary {
  date: string;
  total_sales: number;
  total_refunds: number;
  net_sales: number;
  transaction_count: number;
  average_ticket: number;
  by_payment_method: {
    method: PaymentMethod;
    total: number;
    count: number;
  }[];
  by_service_category: {
    category: string;
    total: number;
    count: number;
  }[];
}
