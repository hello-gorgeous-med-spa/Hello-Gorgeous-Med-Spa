-- ============================================================
-- INVENTORY MANAGEMENT SCHEMA
-- Clinical-grade inventory tracking for Hello Gorgeous Med Spa
-- ============================================================

-- ============================================================
-- INVENTORY ITEMS (Injectable Products)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Product info
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100), -- Allergan, Galderma, Merz, etc.
    category VARCHAR(50) NOT NULL, -- neurotoxin, filler, skincare, etc.
    sku VARCHAR(50) UNIQUE,
    
    -- Unit tracking
    unit_type VARCHAR(20) NOT NULL DEFAULT 'units', -- units, ml, syringe, vial
    units_per_package DECIMAL(10,2) DEFAULT 1,
    
    -- Pricing
    cost_per_unit DECIMAL(10,2), -- what we pay
    price_per_unit DECIMAL(10,2), -- what we charge
    
    -- Reorder settings
    reorder_point INTEGER DEFAULT 10,
    reorder_quantity INTEGER DEFAULT 50,
    
    -- Vendor
    vendor_id UUID,
    vendor_name VARCHAR(255),
    vendor_sku VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_injectable BOOLEAN DEFAULT true,
    requires_lot_tracking BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVENTORY LOTS (Lot-Level Tracking)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    
    -- Lot info
    lot_number VARCHAR(100) NOT NULL,
    expiration_date DATE NOT NULL,
    
    -- Quantity tracking
    quantity_received DECIMAL(10,2) NOT NULL,
    quantity_remaining DECIMAL(10,2) NOT NULL,
    quantity_used DECIMAL(10,2) DEFAULT 0,
    quantity_wasted DECIMAL(10,2) DEFAULT 0,
    quantity_expired DECIMAL(10,2) DEFAULT 0,
    
    -- Receipt info
    received_date DATE NOT NULL DEFAULT CURRENT_DATE,
    received_by UUID,
    purchase_order_number VARCHAR(100),
    invoice_number VARCHAR(100),
    cost_total DECIMAL(10,2),
    
    -- Location
    location_id UUID,
    storage_location VARCHAR(100), -- e.g., "Fridge A, Shelf 2"
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, low, expired, depleted
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(inventory_item_id, lot_number)
);

-- ============================================================
-- INVENTORY TRANSACTIONS (Usage Log)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_lot_id UUID NOT NULL REFERENCES public.inventory_lots(id),
    inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id),
    
    -- Transaction type
    transaction_type VARCHAR(20) NOT NULL, -- receive, use, waste, adjust, transfer, expire
    
    -- Quantity
    quantity DECIMAL(10,2) NOT NULL, -- positive for additions, negative for removals
    quantity_before DECIMAL(10,2) NOT NULL,
    quantity_after DECIMAL(10,2) NOT NULL,
    
    -- References
    client_id UUID REFERENCES public.clients(id),
    appointment_id UUID,
    clinical_note_id UUID,
    provider_id UUID,
    
    -- Details
    reason TEXT,
    notes TEXT,
    
    -- Who/when
    performed_by UUID NOT NULL,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVENTORY ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID REFERENCES public.inventory_items(id),
    inventory_lot_id UUID REFERENCES public.inventory_lots(id),
    
    alert_type VARCHAR(30) NOT NULL, -- low_stock, expiring_soon, expired, reorder
    severity VARCHAR(10) DEFAULT 'warning', -- info, warning, critical
    
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    
    -- Trigger info
    threshold_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_inventory_lots_item ON public.inventory_lots(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_lots_expiration ON public.inventory_lots(expiration_date);
CREATE INDEX IF NOT EXISTS idx_inventory_lots_status ON public.inventory_lots(status);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_lot ON public.inventory_transactions(inventory_lot_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON public.inventory_transactions(performed_at);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_unread ON public.inventory_alerts(is_read) WHERE is_read = false;

-- ============================================================
-- SEED DATA - Common Injectable Products
-- ============================================================

INSERT INTO public.inventory_items (name, brand, category, unit_type, units_per_package, is_injectable, requires_lot_tracking) VALUES
-- Neurotoxins
('Botox (onabotulinumtoxinA)', 'Allergan', 'neurotoxin', 'units', 100, true, true),
('Dysport (abobotulinumtoxinA)', 'Galderma', 'neurotoxin', 'units', 300, true, true),
('Xeomin (incobotulinumtoxinA)', 'Merz', 'neurotoxin', 'units', 100, true, true),
('Jeuveau (prabotulinumtoxinA)', 'Evolus', 'neurotoxin', 'units', 100, true, true),
('Daxxify (daxibotulinumtoxinA)', 'Revance', 'neurotoxin', 'units', 100, true, true),

-- Hyaluronic Acid Fillers - Juvederm
('Juvederm Ultra XC', 'Allergan', 'filler', 'syringe', 1, true, true),
('Juvederm Ultra Plus XC', 'Allergan', 'filler', 'syringe', 1, true, true),
('Juvederm Voluma XC', 'Allergan', 'filler', 'syringe', 1, true, true),
('Juvederm Vollure XC', 'Allergan', 'filler', 'syringe', 1, true, true),
('Juvederm Volbella XC', 'Allergan', 'filler', 'syringe', 1, true, true),

-- Hyaluronic Acid Fillers - Restylane
('Restylane', 'Galderma', 'filler', 'syringe', 1, true, true),
('Restylane Lyft', 'Galderma', 'filler', 'syringe', 1, true, true),
('Restylane Silk', 'Galderma', 'filler', 'syringe', 1, true, true),
('Restylane Kysse', 'Galderma', 'filler', 'syringe', 1, true, true),
('Restylane Contour', 'Galderma', 'filler', 'syringe', 1, true, true),
('Restylane Defyne', 'Galderma', 'filler', 'syringe', 1, true, true),
('Restylane Refyne', 'Galderma', 'filler', 'syringe', 1, true, true),

-- RHA Collection
('RHA 2', 'Revance', 'filler', 'syringe', 1, true, true),
('RHA 3', 'Revance', 'filler', 'syringe', 1, true, true),
('RHA 4', 'Revance', 'filler', 'syringe', 1, true, true),
('RHA Redensity', 'Revance', 'filler', 'syringe', 1, true, true),

-- Biostimulators
('Sculptra', 'Galderma', 'biostimulator', 'vial', 1, true, true),
('Radiesse', 'Merz', 'biostimulator', 'syringe', 1, true, true),
('Radiesse (+)', 'Merz', 'biostimulator', 'syringe', 1, true, true),

-- Skin Boosters
('Skinvive', 'Allergan', 'skin_booster', 'syringe', 1, true, true),

-- Kybella
('Kybella', 'Allergan', 'deoxycholic_acid', 'vial', 1, true, true),

-- Vitamin Injections
('B12 Injection', 'Generic', 'vitamin', 'ml', 30, true, false),
('Biotin Injection', 'Generic', 'vitamin', 'ml', 30, true, false),
('Vitamin D Injection', 'Generic', 'vitamin', 'ml', 10, true, false),
('Lipo-B Injection', 'Generic', 'vitamin', 'ml', 30, true, false),
('Glutathione', 'Generic', 'vitamin', 'ml', 10, true, false)

ON CONFLICT (sku) DO NOTHING;
