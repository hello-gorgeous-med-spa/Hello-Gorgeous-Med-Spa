-- ============================================================
-- POS SCHEMA
-- Point of Sale tables for Hello Gorgeous Med Spa
-- ============================================================

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'sale', -- sale, refund, void
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded, voided
    
    -- Amounts (stored in dollars)
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_type VARCHAR(10), -- percent, fixed
    discount_percent DECIMAL(5,2),
    discount_reason TEXT,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Payment info
    payment_method VARCHAR(20) NOT NULL, -- card, cash, card_on_file, terminal, manual_entry
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    card_brand VARCHAR(20),
    card_last4 VARCHAR(4),
    
    -- References
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    staff_id UUID NOT NULL, -- who processed the transaction
    provider_id UUID, -- if service was performed
    location_id UUID NOT NULL,
    
    -- Original transaction (for refunds)
    original_transaction_id UUID REFERENCES public.transactions(id),
    
    -- Metadata
    notes TEXT,
    receipt_sent BOOLEAN DEFAULT FALSE,
    receipt_sent_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRANSACTION ITEMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    
    -- Item details
    item_type VARCHAR(20) NOT NULL, -- service, product, package, gift_card, membership
    item_id UUID, -- reference to the actual item
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(50),
    
    -- Pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- For services
    provider_id UUID,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS TABLE (Retail Inventory)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE,
    barcode VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2), -- for margin calculation
    
    -- Inventory
    track_inventory BOOLEAN DEFAULT TRUE,
    quantity_on_hand INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_taxable BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    vendor_id UUID,
    image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCT CATEGORIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PACKAGES TABLE (Service Bundles)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    regular_price DECIMAL(10,2) NOT NULL,
    package_price DECIMAL(10,2) NOT NULL,
    
    -- Validity
    valid_days INTEGER, -- days after purchase to use
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PACKAGE ITEMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.package_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GIFT CARDS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Value
    initial_value DECIMAL(10,2) NOT NULL,
    current_balance DECIMAL(10,2) NOT NULL,
    
    -- Ownership
    purchased_by_client_id UUID REFERENCES public.clients(id),
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    message TEXT,
    
    -- Purchase info
    transaction_id UUID REFERENCES public.transactions(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, redeemed, expired, cancelled
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GIFT CARD USAGE TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gift_card_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_card_id UUID NOT NULL REFERENCES public.gift_cards(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES public.transactions(id),
    amount_used DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POS SESSIONS TABLE (Cash Drawer Management)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    location_id UUID NOT NULL,
    
    -- Cash drawer
    opening_cash DECIMAL(10,2) NOT NULL DEFAULT 0,
    expected_cash DECIMAL(10,2) DEFAULT 0,
    actual_cash DECIMAL(10,2),
    cash_variance DECIMAL(10,2),
    
    -- Totals
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_refunds DECIMAL(10,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    
    -- Timing
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    
    -- Status
    status VARCHAR(20) DEFAULT 'open', -- open, closed
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_transactions_client ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_appointment ON public.transactions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_number ON public.transactions(transaction_number);

CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON public.transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_type ON public.transaction_items(item_type);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON public.gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON public.gift_cards(status);

CREATE INDEX IF NOT EXISTS idx_pos_sessions_staff ON public.pos_sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_pos_sessions_status ON public.pos_sessions(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DATA: Sample Products
-- ============================================================

INSERT INTO public.product_categories (id, name, description, display_order) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Skincare', 'Professional skincare products', 1),
    ('22222222-2222-2222-2222-222222222222', 'AnteAge', 'AnteAge stem cell products', 2),
    ('33333333-3333-3333-3333-333333333333', 'Retail', 'General retail items', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.products (sku, name, description, category_id, price, cost, is_active) VALUES
    ('SS-CLNSR-001', 'SkinScript Glycolic Cleanser', 'Professional glycolic acid cleanser', '11111111-1111-1111-1111-111111111111', 32.00, 16.00, true),
    ('SS-MOIST-001', 'SkinScript Hydrating Moisturizer', 'Daily hydrating moisturizer', '11111111-1111-1111-1111-111111111111', 45.00, 22.50, true),
    ('SS-SUNSC-001', 'SkinScript SPF 50 Sunscreen', 'Broad spectrum sun protection', '11111111-1111-1111-1111-111111111111', 28.00, 14.00, true),
    ('AA-SERUM-001', 'AnteAge MD Serum', 'Stem cell growth factor serum', '22222222-2222-2222-2222-222222222222', 175.00, 87.50, true),
    ('AA-ACCEL-001', 'AnteAge Accelerator', 'Vitamin C accelerator treatment', '22222222-2222-2222-2222-222222222222', 145.00, 72.50, true),
    ('HG-LIPBM-001', 'Hello Gorgeous Lip Balm', 'Hydrating lip treatment', '33333333-3333-3333-3333-333333333333', 12.00, 4.00, true)
ON CONFLICT DO NOTHING;
