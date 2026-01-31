-- ============================================================
-- HELLO GORGEOUS OS - DATABASE SCHEMA
-- PostgreSQL / Supabase Compatible
-- Version: 1.0.0
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin', 'superadmin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE membership_status AS ENUM ('active', 'past_due', 'cancelled', 'paused');
CREATE TYPE document_type AS ENUM ('photo_before', 'photo_after', 'lab_result', 'consent_form', 'id_verification', 'medical_record', 'other');
CREATE TYPE intake_type AS ENUM ('medical_history', 'treatment_consent', 'service_specific', 'covid_screening', 'hipaa_consent');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'in_app');
CREATE TYPE transaction_type AS ENUM ('payment', 'deposit', 'refund', 'credit', 'membership_charge');

-- ============================================================
-- CORE USER & AUTH TABLES
-- ============================================================

-- Base users table (Supabase Auth handles auth, this stores profile)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE, -- Links to Supabase auth.users
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'client',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLIENT TABLES
-- ============================================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Legacy Fresha data (for migration tracking)
    fresha_client_id VARCHAR(50),
    
    -- Demographics
    date_of_birth DATE,
    gender VARCHAR(20),
    preferred_pronouns VARCHAR(50),
    
    -- Contact preferences
    accepts_email_marketing BOOLEAN DEFAULT FALSE,
    accepts_sms_marketing BOOLEAN DEFAULT FALSE,
    preferred_contact_method notification_channel DEFAULT 'email',
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    
    -- Emergency contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    
    -- Medical summary (non-PHI, general flags)
    allergies_summary TEXT,
    medications_summary TEXT,
    medical_conditions_summary TEXT,
    
    -- Status flags
    is_new_client BOOLEAN DEFAULT TRUE,
    consult_completed_at TIMESTAMPTZ,
    is_vip BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT,
    
    -- Referral tracking
    referral_source VARCHAR(100),
    referred_by_client_id UUID REFERENCES clients(id),
    
    -- Notes (provider-visible)
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_fresha_id ON clients(fresha_client_id);
CREATE INDEX idx_clients_email ON clients(user_id);

-- ============================================================
-- PROVIDER TABLES
-- ============================================================

CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional info
    credentials VARCHAR(100), -- e.g., "FNP-BC", "RN", "MA"
    license_number VARCHAR(100),
    license_state VARCHAR(50),
    npi_number VARCHAR(20),
    
    -- Profile
    bio TEXT,
    specialties TEXT[], -- Array of specialties
    services_offered UUID[], -- Array of service IDs they can perform
    
    -- Scheduling
    default_buffer_minutes INTEGER DEFAULT 15,
    max_daily_appointments INTEGER DEFAULT 20,
    accepts_new_clients BOOLEAN DEFAULT TRUE,
    
    -- Settings
    color_hex VARCHAR(7) DEFAULT '#EC4899', -- For calendar display
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LOCATION TABLES
-- ============================================================

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    -- Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Hours (JSON for flexibility)
    -- Format: { "monday": { "open": "09:00", "close": "18:00" }, ... }
    business_hours JSONB,
    
    -- Settings
    timezone VARCHAR(50) DEFAULT 'America/Chicago',
    is_active BOOLEAN DEFAULT TRUE,
    accepts_online_booking BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SERVICE TABLES
-- ============================================================

CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Emoji or icon name
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id),
    
    -- Basic info
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing
    price_cents INTEGER NOT NULL,
    price_display VARCHAR(50), -- e.g., "From $350" or "$12/unit"
    price_type VARCHAR(20) DEFAULT 'fixed', -- fixed, per_unit, starting_at
    
    -- Scheduling
    duration_minutes INTEGER NOT NULL,
    buffer_before_minutes INTEGER DEFAULT 0,
    buffer_after_minutes INTEGER DEFAULT 0,
    
    -- Deposits
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount_cents INTEGER,
    deposit_type VARCHAR(20) DEFAULT 'fixed', -- fixed, percentage
    
    -- Eligibility requirements
    requires_consult BOOLEAN DEFAULT FALSE,
    requires_intake BOOLEAN DEFAULT TRUE,
    requires_consent BOOLEAN DEFAULT TRUE,
    requires_labs BOOLEAN DEFAULT FALSE,
    requires_telehealth_clearance BOOLEAN DEFAULT FALSE,
    minimum_age INTEGER,
    
    -- Contraindications (will check against client medical history)
    contraindications TEXT[],
    
    -- Booking settings
    max_advance_booking_days INTEGER DEFAULT 90,
    min_advance_booking_hours INTEGER DEFAULT 24,
    allow_online_booking BOOLEAN DEFAULT TRUE,
    
    -- Related services (for upsells/add-ons)
    addon_service_ids UUID[],
    related_service_ids UUID[],
    
    -- Display
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- AI/Persona assignment
    primary_persona_id VARCHAR(50), -- e.g., 'beau-tox', 'filla-grace'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_slug ON services(slug);

-- ============================================================
-- BOOKING & SCHEDULING TABLES
-- ============================================================

CREATE TABLE provider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    
    -- For recurring schedules
    day_of_week INTEGER, -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- For one-off overrides
    specific_date DATE,
    is_available BOOLEAN DEFAULT TRUE, -- FALSE = blocked
    
    -- Settings
    is_recurring BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_availability_provider ON provider_availability(provider_id);
CREATE INDEX idx_availability_date ON provider_availability(specific_date);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
    
    -- What
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    -- When
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    
    -- Status
    status appointment_status DEFAULT 'pending',
    
    -- Deposit tracking
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount_cents INTEGER,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_paid_at TIMESTAMPTZ,
    deposit_transaction_id UUID,
    
    -- Pre-appointment requirements
    intake_completed BOOLEAN DEFAULT FALSE,
    consent_signed BOOLEAN DEFAULT FALSE,
    
    -- Add-ons booked with this appointment
    addon_service_ids UUID[],
    
    -- Notes
    client_notes TEXT, -- Notes from client during booking
    provider_notes TEXT, -- Internal provider notes
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES users(id),
    cancel_reason TEXT,
    
    -- Check-in
    checked_in_at TIMESTAMPTZ,
    
    -- Reminders
    reminder_sent_24h BOOLEAN DEFAULT FALSE,
    reminder_sent_2h BOOLEAN DEFAULT FALSE,
    
    -- Booking metadata
    booked_by UUID REFERENCES users(id), -- Could be client or staff
    booking_source VARCHAR(50) DEFAULT 'online', -- online, phone, walk_in, admin
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_date ON appointments(starts_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================
-- INTAKE & CONSENT TABLES
-- ============================================================

CREATE TABLE intake_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Form definition
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    intake_type intake_type NOT NULL,
    
    -- Form schema (JSON Schema format for dynamic forms)
    form_schema JSONB NOT NULL,
    
    -- Which services require this form
    required_for_service_ids UUID[],
    required_for_all_new_clients BOOLEAN DEFAULT FALSE,
    
    -- Validity
    expires_after_days INTEGER, -- NULL = never expires
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_intakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    intake_form_id UUID REFERENCES intake_forms(id),
    appointment_id UUID REFERENCES appointments(id), -- If tied to specific appointment
    
    -- Submitted data (encrypted in production)
    form_data JSONB NOT NULL,
    
    -- Status
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    -- Provider review
    reviewed_by UUID REFERENCES providers(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intakes_client ON client_intakes(client_id);

-- ============================================================
-- TREATMENT RECORDS
-- ============================================================

CREATE TABLE treatment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    
    -- Treatment details
    treatment_date TIMESTAMPTZ NOT NULL,
    
    -- For injectables
    product_used VARCHAR(200),
    lot_number VARCHAR(100),
    units_used DECIMAL(10,2),
    areas_treated TEXT[],
    
    -- Notes
    provider_notes TEXT,
    client_reported_outcome TEXT,
    
    -- AI-generated summary
    ai_summary TEXT,
    
    -- Follow-up
    follow_up_recommended BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_treatments_client ON treatment_records(client_id);
CREATE INDEX idx_treatments_date ON treatment_records(treatment_date);

-- ============================================================
-- DOCUMENT VAULT (HIPAA-Aware)
-- ============================================================

CREATE TABLE client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Document info
    document_type document_type NOT NULL,
    title VARCHAR(255),
    description TEXT,
    
    -- Storage (Supabase Storage or encrypted S3)
    storage_bucket VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Encryption (for PHI)
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_key_id VARCHAR(100), -- Reference to key management
    
    -- Metadata
    uploaded_by UUID REFERENCES users(id),
    treatment_record_id UUID REFERENCES treatment_records(id),
    
    -- Access control
    provider_only BOOLEAN DEFAULT FALSE,
    
    -- Expiry
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_client ON client_documents(client_id);
CREATE INDEX idx_documents_type ON client_documents(document_type);

-- ============================================================
-- MEMBERSHIP & PAYMENTS
-- ============================================================

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Plan info
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Pricing
    price_cents INTEGER NOT NULL,
    interval VARCHAR(20) NOT NULL, -- monthly, annual
    
    -- Benefits (JSONB for flexibility)
    -- { "discount_percent": 10, "free_service_value_cents": 7500, "priority_booking": true }
    benefits JSONB NOT NULL,
    
    -- Stripe integration
    stripe_product_id VARCHAR(100),
    stripe_price_id VARCHAR(100),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    membership_id UUID REFERENCES memberships(id),
    
    -- Status
    status membership_status DEFAULT 'active',
    
    -- Dates
    started_at TIMESTAMPTZ DEFAULT NOW(),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Stripe
    stripe_subscription_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    
    -- Benefits tracking
    free_service_claimed BOOLEAN DEFAULT FALSE,
    free_service_claimed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_client_memberships ON client_memberships(client_id);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id),
    membership_id UUID REFERENCES client_memberships(id),
    
    -- Transaction details
    type transaction_type NOT NULL,
    amount_cents INTEGER NOT NULL,
    description TEXT,
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(100),
    stripe_charge_id VARCHAR(100),
    stripe_refund_id VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    
    -- Metadata
    processed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);

-- ============================================================
-- COMMUNICATIONS & NOTIFICATIONS
-- ============================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    channel notification_channel DEFAULT 'in_app',
    persona_id VARCHAR(50), -- AI persona used
    
    subject VARCHAR(255),
    
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    
    sender_type VARCHAR(20) NOT NULL, -- client, provider, system, ai
    sender_id UUID REFERENCES users(id),
    
    content TEXT NOT NULL,
    
    -- AI metadata
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_persona_id VARCHAR(50),
    
    -- Read tracking
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type VARCHAR(100) NOT NULL, -- appointment_reminder, intake_required, etc.
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    
    -- Delivery
    channel notification_channel NOT NULL,
    
    -- Targeting
    appointment_id UUID REFERENCES appointments(id),
    
    -- Status
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);

-- ============================================================
-- REFERRAL TRACKING
-- ============================================================

CREATE TABLE referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Rewards
    referrer_reward_cents INTEGER DEFAULT 2500, -- $25
    referee_reward_cents INTEGER DEFAULT 2500, -- $25
    
    -- Usage
    times_used INTEGER DEFAULT 0,
    max_uses INTEGER, -- NULL = unlimited
    
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referral_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_code_id UUID REFERENCES referral_codes(id),
    
    referrer_client_id UUID REFERENCES clients(id),
    referee_client_id UUID REFERENCES clients(id),
    
    -- Reward status
    referrer_rewarded BOOLEAN DEFAULT FALSE,
    referrer_rewarded_at TIMESTAMPTZ,
    referee_rewarded BOOLEAN DEFAULT FALSE,
    referee_rewarded_at TIMESTAMPTZ,
    
    -- Triggered by
    qualifying_appointment_id UUID REFERENCES appointments(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGGING (HIPAA Compliance)
-- ============================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    user_id UUID REFERENCES users(id),
    user_role user_role,
    ip_address INET,
    user_agent TEXT,
    
    -- What
    action VARCHAR(100) NOT NULL, -- view, create, update, delete, export
    resource_type VARCHAR(100) NOT NULL, -- client, appointment, document, etc.
    resource_id UUID,
    
    -- Details
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on sensitive tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on auth setup)

-- Clients can only see their own data
CREATE POLICY clients_own_data ON clients
    FOR ALL USING (user_id = auth.uid());

-- Providers can see all clients
CREATE POLICY providers_see_clients ON clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.auth_id = auth.uid() 
            AND users.role IN ('provider', 'admin', 'superadmin')
        )
    );

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Default location
INSERT INTO locations (name, slug, address_line1, city, state, postal_code, phone, email, business_hours, timezone)
VALUES (
    'Hello Gorgeous Med Spa - Oswego',
    'oswego',
    '74 W. Washington St',
    'Oswego',
    'IL',
    '60543',
    '630-636-6193',
    'hello@hellogorgeousmedspa.com',
    '{
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "17:00"},
        "saturday": {"open": "09:00", "close": "14:00"},
        "sunday": null
    }',
    'America/Chicago'
);

-- Service categories
INSERT INTO service_categories (name, slug, description, icon, display_order) VALUES
    ('Aesthetics & Injectables', 'aesthetics-injectables', 'Botox, fillers, and facial rejuvenation', '💉', 1),
    ('Weight Loss & Metabolic Care', 'weight-loss', 'Semaglutide, Tirzepatide, and metabolic optimization', '⚡', 2),
    ('Hormones & Wellness', 'hormones-wellness', 'BioTE hormone therapy and peptides', '⚖️', 3),
    ('Skin Regeneration', 'skin-regeneration', 'Microneedling, peels, and skin treatments', '✨', 4),
    ('IV Therapy & Recovery', 'iv-therapy', 'IV drips and vitamin injections', '💧', 5),
    ('Medical Visits', 'medical-visits', 'Consultations and medical evaluations', '🩺', 6);

-- Default memberships
INSERT INTO memberships (name, slug, description, price_cents, interval, benefits) VALUES
    ('Monthly Membership', 'monthly', 'No Prior Authorization monthly plan', 4900, 'monthly', 
     '{"discount_percent": 10, "priority_booking": true, "free_service_value_cents": 0}'),
    ('Annual Membership', 'annual', 'No Prior Authorization annual plan with FREE $75 service', 39900, 'annual',
     '{"discount_percent": 10, "priority_booking": true, "free_service_value_cents": 7500, "annual_savings_cents": 18900}');
