// ============================================================
// INVENTORY MANAGEMENT TYPES
// Clinical-grade inventory tracking
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export type InventoryCategory = 
  | 'neurotoxin'
  | 'filler'
  | 'biostimulator'
  | 'skin_booster'
  | 'deoxycholic_acid'
  | 'vitamin'
  | 'skincare'
  | 'supplies'
  | 'other';

export type UnitType = 'units' | 'ml' | 'syringe' | 'vial' | 'each' | 'box';

export type LotStatus = 'active' | 'low' | 'expiring' | 'expired' | 'depleted';

export type TransactionType = 
  | 'receive'    // New stock received
  | 'use'        // Used on patient
  | 'waste'      // Wasted/damaged
  | 'adjust'     // Manual adjustment
  | 'transfer'   // Transfer between locations
  | 'expire'     // Expired out
  | 'return';    // Returned to vendor

export type AlertType = 
  | 'low_stock'
  | 'expiring_soon'
  | 'expired'
  | 'reorder'
  | 'recall';

export type AlertSeverity = 'info' | 'warning' | 'critical';

// ============================================================
// INVENTORY ITEM
// ============================================================

export interface InventoryItem {
  id: string;
  name: string;
  brand?: string;
  category: InventoryCategory;
  sku?: string;
  
  // Units
  unitType: UnitType;
  unitsPerPackage: number;
  
  // Pricing
  costPerUnit?: number;
  pricePerUnit?: number;
  
  // Reorder
  reorderPoint: number;
  reorderQuantity: number;
  
  // Vendor
  vendorId?: string;
  vendorName?: string;
  vendorSku?: string;
  
  // Settings
  isActive: boolean;
  isInjectable: boolean;
  requiresLotTracking: boolean;
  
  // Computed
  totalQuantityOnHand?: number;
  totalValue?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  lots?: InventoryLot[];
}

// ============================================================
// INVENTORY LOT
// ============================================================

export interface InventoryLot {
  id: string;
  inventoryItemId: string;
  
  // Lot info
  lotNumber: string;
  expirationDate: Date;
  
  // Quantities
  quantityReceived: number;
  quantityRemaining: number;
  quantityUsed: number;
  quantityWasted: number;
  quantityExpired: number;
  
  // Receipt
  receivedDate: Date;
  receivedBy?: string;
  purchaseOrderNumber?: string;
  invoiceNumber?: string;
  costTotal?: number;
  
  // Location
  locationId?: string;
  storageLocation?: string;
  
  // Status
  status: LotStatus;
  
  // Computed
  daysUntilExpiration?: number;
  isExpiringSoon?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  item?: InventoryItem;
  transactions?: InventoryTransaction[];
}

// ============================================================
// INVENTORY TRANSACTION
// ============================================================

export interface InventoryTransaction {
  id: string;
  inventoryLotId: string;
  inventoryItemId: string;
  
  transactionType: TransactionType;
  
  quantity: number; // positive for add, negative for remove
  quantityBefore: number;
  quantityAfter: number;
  
  // References
  clientId?: string;
  appointmentId?: string;
  clinicalNoteId?: string;
  providerId?: string;
  
  // Details
  reason?: string;
  notes?: string;
  
  performedBy: string;
  performedAt: Date;
  
  createdAt: Date;
  
  // Relations
  lot?: InventoryLot;
  item?: InventoryItem;
  client?: { firstName: string; lastName: string };
  provider?: { firstName: string; lastName: string };
}

// ============================================================
// INVENTORY ALERT
// ============================================================

export interface InventoryAlert {
  id: string;
  inventoryItemId?: string;
  inventoryLotId?: string;
  
  alertType: AlertType;
  severity: AlertSeverity;
  
  title: string;
  message?: string;
  
  isRead: boolean;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  
  thresholdValue?: number;
  currentValue?: number;
  
  createdAt: Date;
  
  // Relations
  item?: InventoryItem;
  lot?: InventoryLot;
}

// ============================================================
// API TYPES
// ============================================================

export interface InventorySummary {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  expiringCount: number;
  expiredCount: number;
  
  byCategory: {
    category: InventoryCategory;
    count: number;
    value: number;
  }[];
  
  recentTransactions: InventoryTransaction[];
  activeAlerts: InventoryAlert[];
}

export interface ReceiveInventoryRequest {
  inventoryItemId: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  costTotal?: number;
  purchaseOrderNumber?: string;
  invoiceNumber?: string;
  storageLocation?: string;
}

export interface UseInventoryRequest {
  inventoryLotId: string;
  quantity: number;
  clientId?: string;
  appointmentId?: string;
  clinicalNoteId?: string;
  providerId?: string;
  notes?: string;
}

export interface AdjustInventoryRequest {
  inventoryLotId: string;
  quantity: number; // new quantity (not delta)
  reason: string;
  notes?: string;
}

export interface WasteInventoryRequest {
  inventoryLotId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

// ============================================================
// COMPONENT PROPS
// ============================================================

export interface InventoryTableProps {
  items: InventoryItem[];
  onSelect: (item: InventoryItem) => void;
  onReceive: (item: InventoryItem) => void;
}

export interface LotTableProps {
  lots: InventoryLot[];
  onUse: (lot: InventoryLot) => void;
  onAdjust: (lot: InventoryLot) => void;
  onWaste: (lot: InventoryLot) => void;
}

export interface ReceiveModalProps {
  item: InventoryItem;
  onSave: (data: ReceiveInventoryRequest) => void;
  onClose: () => void;
}

export interface UseModalProps {
  lot: InventoryLot;
  onSave: (data: UseInventoryRequest) => void;
  onClose: () => void;
}
