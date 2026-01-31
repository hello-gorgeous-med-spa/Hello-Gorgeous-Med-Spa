-- ============================================================
-- HELLO GORGEOUS OS - FULL SCHEMA (IDEMPOTENT)
-- Safe to run multiple times - drops and recreates everything
-- ============================================================

-- Set search path explicitly
SET search_path TO public;

-- ============================================================
-- STEP 1: DROP EVERYTHING IN PUBLIC SCHEMA
-- ============================================================

-- Drop all tables with explicit schema
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.referral_redemptions CASCADE;
DROP TABLE IF EXISTS public.referral_codes CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.client_memberships CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.client_documents CASCADE;
DROP TABLE IF EXISTS public.treatment_records CASCADE;
DROP TABLE IF EXISTS public.client_intakes CASCADE;
DROP TABLE IF EXISTS public.intake_forms CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.provider_availability CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.service_categories CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.appointment_status CASCADE;
DROP TYPE IF EXISTS public.membership_status CASCADE;
DROP TYPE IF EXISTS public.document_type CASCADE;
DROP TYPE IF EXISTS public.intake_type CASCADE;
DROP TYPE IF EXISTS public.notification_channel CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;

-- ============================================================
-- STEP 2: ENABLE EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- STEP 3: CREATE ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin', 'superadmin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE membership_status AS ENUM ('active', 'past_due', 'cancelled', 'paused');
CREATE TYPE document_type AS ENUM ('photo_before', 'photo_after', 'lab_result', 'consent_form', 'id_verification', 'medical_record', 'other');
CREATE TYPE intake_type AS ENUM ('medical_history', 'treatment_consent', 'service_specific', 'covid_screening', 'hipaa_consent');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'in_app');
CREATE TYPE transaction_type AS ENUM ('payment', 'deposit', 'refund', 'credit', 'membership_charge');

-- ============================================================
-- STEP 4: CREATE TABLES
-- ============================================================

-- Users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
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

-- Clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    fresha_client_id VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    preferred_pronouns VARCHAR(50),
    accepts_email_marketing BOOLEAN DEFAULT FALSE,
    accepts_sms_marketing BOOLEAN DEFAULT FALSE,
    preferred_contact_method notification_channel DEFAULT 'email',
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    allergies_summary TEXT,
    medications_summary TEXT,
    medical_conditions_summary TEXT,
    is_new_client BOOLEAN DEFAULT TRUE,
    consult_completed_at TIMESTAMPTZ,
    is_vip BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT,
    referral_source VARCHAR(100),
    referred_by_client_id UUID REFERENCES public.clients(id),
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers table
CREATE TABLE public.providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    credentials VARCHAR(100),
    license_number VARCHAR(100),
    license_state VARCHAR(50),
    npi_number VARCHAR(20),
    bio TEXT,
    specialties TEXT[],
    services_offered UUID[],
    default_buffer_minutes INTEGER DEFAULT 15,
    max_daily_appointments INTEGER DEFAULT 20,
    accepts_new_clients BOOLEAN DEFAULT TRUE,
    color_hex VARCHAR(7) DEFAULT '#EC4899',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(255),
    business_hours JSONB,
    timezone VARCHAR(50) DEFAULT 'America/Chicago',
    is_active BOOLEAN DEFAULT TRUE,
    accepts_online_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service categories
CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.service_categories(id),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price_cents INTEGER NOT NULL,
    price_display VARCHAR(50),
    price_type VARCHAR(20) DEFAULT 'fixed',
    duration_minutes INTEGER NOT NULL,
    buffer_before_minutes INTEGER DEFAULT 0,
    buffer_after_minutes INTEGER DEFAULT 0,
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount_cents INTEGER,
    deposit_type VARCHAR(20) DEFAULT 'fixed',
    requires_consult BOOLEAN DEFAULT FALSE,
    requires_intake BOOLEAN DEFAULT TRUE,
    requires_consent BOOLEAN DEFAULT TRUE,
    requires_labs BOOLEAN DEFAULT FALSE,
    requires_telehealth_clearance BOOLEAN DEFAULT FALSE,
    minimum_age INTEGER,
    contraindications TEXT[],
    max_advance_booking_days INTEGER DEFAULT 90,
    min_advance_booking_hours INTEGER DEFAULT 24,
    allow_online_booking BOOLEAN DEFAULT TRUE,
    addon_service_ids UUID[],
    related_service_ids UUID[],
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    primary_persona_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider availability
CREATE TABLE public.provider_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    day_of_week INTEGER,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    specific_date DATE,
    is_available BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status appointment_status DEFAULT 'pending',
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount_cents INTEGER,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_paid_at TIMESTAMPTZ,
    deposit_transaction_id UUID,
    intake_completed BOOLEAN DEFAULT FALSE,
    consent_signed BOOLEAN DEFAULT FALSE,
    addon_service_ids UUID[],
    client_notes TEXT,
    provider_notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.users(id),
    cancel_reason TEXT,
    checked_in_at TIMESTAMPTZ,
    reminder_sent_24h BOOLEAN DEFAULT FALSE,
    reminder_sent_2h BOOLEAN DEFAULT FALSE,
    booked_by UUID REFERENCES public.users(id),
    booking_source VARCHAR(50) DEFAULT 'online',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intake forms
CREATE TABLE public.intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    intake_type intake_type NOT NULL,
    form_schema JSONB NOT NULL,
    required_for_service_ids UUID[],
    required_for_all_new_clients BOOLEAN DEFAULT FALSE,
    expires_after_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client intakes
CREATE TABLE public.client_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    intake_form_id UUID REFERENCES public.intake_forms(id),
    appointment_id UUID REFERENCES public.appointments(id),
    form_data JSONB NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.providers(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment records
CREATE TABLE public.treatment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    treatment_date TIMESTAMPTZ NOT NULL,
    product_used VARCHAR(200),
    lot_number VARCHAR(100),
    units_used DECIMAL(10,2),
    areas_treated TEXT[],
    provider_notes TEXT,
    client_reported_outcome TEXT,
    ai_summary TEXT,
    follow_up_recommended BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client documents
CREATE TABLE public.client_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    title VARCHAR(255),
    description TEXT,
    storage_bucket VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_key_id VARCHAR(100),
    uploaded_by UUID REFERENCES public.users(id),
    treatment_record_id UUID REFERENCES public.treatment_records(id),
    provider_only BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    interval VARCHAR(20) NOT NULL,
    benefits JSONB NOT NULL,
    stripe_product_id VARCHAR(100),
    stripe_price_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client memberships
CREATE TABLE public.client_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    membership_id UUID REFERENCES public.memberships(id),
    status membership_status DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    stripe_subscription_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    free_service_claimed BOOLEAN DEFAULT FALSE,
    free_service_claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id),
    membership_id UUID REFERENCES public.client_memberships(id),
    type transaction_type NOT NULL,
    amount_cents INTEGER NOT NULL,
    description TEXT,
    stripe_payment_intent_id VARCHAR(100),
    stripe_charge_id VARCHAR(100),
    stripe_refund_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    processed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    channel notification_channel DEFAULT 'in_app',
    persona_id VARCHAR(50),
    subject VARCHAR(255),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL,
    sender_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_persona_id VARCHAR(50),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    channel notification_channel NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id),
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral codes
CREATE TABLE public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    referrer_reward_cents INTEGER DEFAULT 2500,
    referee_reward_cents INTEGER DEFAULT 2500,
    times_used INTEGER DEFAULT 0,
    max_uses INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral redemptions
CREATE TABLE public.referral_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_code_id UUID REFERENCES public.referral_codes(id),
    referrer_client_id UUID REFERENCES public.clients(id),
    referee_client_id UUID REFERENCES public.clients(id),
    referrer_rewarded BOOLEAN DEFAULT FALSE,
    referrer_rewarded_at TIMESTAMPTZ,
    referee_rewarded BOOLEAN DEFAULT FALSE,
    referee_rewarded_at TIMESTAMPTZ,
    qualifying_appointment_id UUID REFERENCES public.appointments(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    user_role user_role,
    ip_address INET,
    user_agent TEXT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 5: CREATE INDEXES
-- ============================================================

CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_fresha_id ON public.clients(fresha_client_id);
CREATE INDEX idx_services_category ON public.services(category_id);
CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_availability_provider ON public.provider_availability(provider_id);
CREATE INDEX idx_availability_date ON public.provider_availability(specific_date);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_provider ON public.appointments(provider_id);
CREATE INDEX idx_appointments_date ON public.appointments(starts_at);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_intakes_client ON public.client_intakes(client_id);
CREATE INDEX idx_treatments_client ON public.treatment_records(client_id);
CREATE INDEX idx_treatments_date ON public.treatment_records(treatment_date);
CREATE INDEX idx_documents_client ON public.client_documents(client_id);
CREATE INDEX idx_documents_type ON public.client_documents(document_type);
CREATE INDEX idx_client_memberships ON public.client_memberships(client_id);
CREATE INDEX idx_transactions_client ON public.transactions(client_id);
CREATE INDEX idx_transactions_date ON public.transactions(created_at);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON public.notifications(scheduled_for);
CREATE INDEX idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_date ON public.audit_logs(created_at);

-- ============================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 7: SEED INITIAL DATA
-- ============================================================

-- Default location
INSERT INTO public.locations (name, slug, address_line1, city, state, postal_code, phone, email, business_hours, timezone)
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
INSERT INTO public.service_categories (name, slug, description, icon, display_order) VALUES
    ('Bioidentical Hormone Therapy', 'bhrt', 'BioTE hormone optimization', '⚖️', 1),
    ('Weight Loss Program', 'weight-loss', 'GLP-1 and metabolic treatments', '⚡', 2),
    ('Botox & Neuromodulators', 'botox', 'Wrinkle relaxing injections', '💉', 3),
    ('Dermal Fillers', 'fillers', 'Volume and contouring', '💋', 4),
    ('Skin Regeneration', 'anteage', 'AnteAGE stem cell treatments', '🧬', 5),
    ('Facials & Skin Spa', 'facials', 'Hydrafacials, peels, dermaplaning', '✨', 6),
    ('PRP & PRF Treatments', 'prp', 'Platelet-rich plasma therapy', '🩸', 7),
    ('IV Therapy & Vitamins', 'iv-therapy', 'IV drips and vitamin injections', '💧', 8),
    ('Lash Services', 'lash', 'Extensions, lifts, and fills', '👁️', 9),
    ('Brow Services', 'brow', 'Shaping, lamination, henna', '🤨', 10),
    ('Laser Hair Removal', 'laser-hair', 'Permanent hair reduction', '⚡', 11),
    ('Medical Consultations', 'consultations', 'Evaluations and planning', '🩺', 12);

-- Default memberships
INSERT INTO public.memberships (name, slug, description, price_cents, interval, benefits) VALUES
    ('Monthly Membership', 'monthly', 'No Prior Authorization monthly plan', 4900, 'monthly', 
     '{"discount_percent": 10, "priority_booking": true, "free_service_value_cents": 0}'),
    ('Annual Membership', 'annual', 'No Prior Authorization annual plan with FREE $75 service', 39900, 'annual',
     '{"discount_percent": 10, "priority_booking": true, "free_service_value_cents": 7500, "annual_savings_cents": 18900}');

-- ============================================================
-- DONE!
-- ============================================================

SELECT 'Hello Gorgeous OS schema created successfully!' AS status,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS tables_created;
