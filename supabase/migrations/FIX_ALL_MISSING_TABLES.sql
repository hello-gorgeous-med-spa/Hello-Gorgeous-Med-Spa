-- ============================================================
-- HELLO GORGEOUS: FIX ALL MISSING TABLES
-- Run this in Supabase SQL Editor to create all required tables
-- Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: is_service_role (required for RLS policies)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('role', true) = 'service_role' 
    OR current_setting('request.jwt.claim.role', true) = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 1. USER_PROFILES (Critical for auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('owner', 'admin', 'provider', 'staff', 'client')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  staff_id UUID,
  provider_id UUID,
  client_id UUID,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- ============================================================
-- 2. CONSENT TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.consent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_witness BOOLEAN NOT NULL DEFAULT false,
  required_for_services TEXT[],
  expires_days INTEGER DEFAULT 365,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_templates_slug ON public.consent_templates(slug);
CREATE INDEX IF NOT EXISTS idx_consent_templates_active ON public.consent_templates(is_active);

-- ============================================================
-- 3. CLIENT CONSENTS (Signed consents)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.client_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  consent_template_id UUID REFERENCES public.consent_templates(id),
  template_version INTEGER NOT NULL DEFAULT 1,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  signature_data TEXT,
  signature_type VARCHAR(20) DEFAULT 'typed',
  ip_address INET,
  user_agent TEXT,
  witness_name VARCHAR(255),
  witness_signature TEXT,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_consents_client_id ON public.client_consents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_template_id ON public.client_consents(consent_template_id);

-- ============================================================
-- 4. SIGNED CONSENTS (Legacy/alternate name - some code uses this)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.signed_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  form_type VARCHAR(100) NOT NULL,
  form_version INTEGER DEFAULT 1,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'signed',
  signature_data TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signed_consents_client_id ON public.signed_consents(client_id);
CREATE INDEX IF NOT EXISTS idx_signed_consents_form_type ON public.signed_consents(form_type);

-- ============================================================
-- 5. SMS CONVERSATIONS (2-Way Inbox)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sms_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_conversations_client ON public.sms_conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_last_message ON public.sms_conversations(last_message_at DESC);

-- ============================================================
-- 6. SMS MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.sms_conversations(id) ON DELETE CASCADE,
  client_id UUID,
  recipient_phone VARCHAR(20),
  recipient_client_id UUID,
  recipient_name VARCHAR(255),
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  content TEXT,
  message_type VARCHAR(50),
  message_content TEXT,
  media_url TEXT,
  sender_phone VARCHAR(20),
  sent_by_user_id UUID,
  sent_by_name VARCHAR(255),
  telnyx_message_id VARCHAR(100),
  external_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'sent',
  error_message TEXT,
  had_consent BOOLEAN DEFAULT true,
  consent_type VARCHAR(50),
  cost_cents INTEGER,
  segments INTEGER DEFAULT 1,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_by UUID,
  sent_via VARCHAR(50) DEFAULT 'api'
);

CREATE INDEX IF NOT EXISTS idx_sms_messages_conversation ON public.sms_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_client ON public.sms_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_recipient ON public.sms_messages(recipient_client_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON public.sms_messages(status);

-- ============================================================
-- 7. SMS OPT OUTS (TCPA Compliance)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sms_opt_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  client_id UUID,
  opted_out_at TIMESTAMPTZ DEFAULT NOW(),
  opt_out_method VARCHAR(50) DEFAULT 'STOP',
  resubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opt_outs_phone ON public.sms_opt_outs(phone);

-- ============================================================
-- 8. PRETREATMENT TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pretreatment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  send_via VARCHAR(50) DEFAULT 'email',
  send_delay_hours INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pretreatment_templates_service ON public.pretreatment_templates(service_id);

-- ============================================================
-- 9. PRETREATMENT SENT (Log)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pretreatment_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  appointment_id UUID,
  template_id UUID,
  service_name VARCHAR(255),
  sent_via VARCHAR(50),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  content_snapshot TEXT,
  delivery_status VARCHAR(50) DEFAULT 'sent'
);

CREATE INDEX IF NOT EXISTS idx_pretreatment_sent_client ON public.pretreatment_sent(client_id);
CREATE INDEX IF NOT EXISTS idx_pretreatment_sent_appointment ON public.pretreatment_sent(appointment_id);

-- ============================================================
-- 10. AFTERCARE TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aftercare_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  send_via VARCHAR(50) DEFAULT 'email',
  send_delay_minutes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aftercare_templates_service ON public.aftercare_templates(service_id);

-- ============================================================
-- 11. AFTERCARE SENT (Log)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aftercare_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  appointment_id UUID,
  template_id UUID,
  service_name VARCHAR(255),
  sent_via VARCHAR(50),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  content_snapshot TEXT,
  delivery_status VARCHAR(50) DEFAULT 'sent'
);

CREATE INDEX IF NOT EXISTS idx_aftercare_sent_client ON public.aftercare_sent(client_id);
CREATE INDEX IF NOT EXISTS idx_aftercare_sent_appointment ON public.aftercare_sent(appointment_id);

-- ============================================================
-- 12. INJECTION MAPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.injection_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_record_id UUID,
  appointment_id UUID,
  client_id UUID NOT NULL,
  provider_id UUID,
  diagram_type VARCHAR(50) DEFAULT 'face_front',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_injection_maps_client ON public.injection_maps(client_id);
CREATE INDEX IF NOT EXISTS idx_injection_maps_appointment ON public.injection_maps(appointment_id);

-- ============================================================
-- 13. INJECTION POINTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.injection_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injection_map_id UUID NOT NULL REFERENCES public.injection_maps(id) ON DELETE CASCADE,
  x_position DECIMAL(5,2) NOT NULL,
  y_position DECIMAL(5,2) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_id UUID,
  lot_number VARCHAR(100),
  expiration_date DATE,
  units DECIMAL(6,2),
  volume_ml DECIMAL(5,2),
  injection_depth VARCHAR(50),
  technique VARCHAR(100),
  area_label VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_injection_points_map ON public.injection_points(injection_map_id);

-- ============================================================
-- 14. CLINICAL NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID,
  provider_id UUID,
  appointment_id UUID,
  note_type VARCHAR(50) DEFAULT 'soap',
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_client ON public.clinical_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_appointment ON public.clinical_notes(appointment_id);

-- ============================================================
-- 15. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================
-- 16. BUSINESS SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings JSONB DEFAULT '{}'::jsonb,
  business_hours JSONB DEFAULT '{
    "monday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "tuesday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "wednesday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "thursday": {"open": "9:00 AM", "close": "5:00 PM", "enabled": true},
    "friday": {"open": "9:00 AM", "close": "3:00 PM", "enabled": true},
    "saturday": {"open": "10:00 AM", "close": "2:00 PM", "enabled": false},
    "sunday": {"open": "", "close": "", "enabled": false}
  }'::jsonb,
  holidays JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO public.business_settings (settings)
SELECT '{
  "business_name": "Hello Gorgeous Med Spa",
  "phone": "(630) 636-6193",
  "email": "hello@hellogorgeousmedspa.com",
  "address": "74 W. Washington St, Oswego, IL 60543",
  "timezone": "America/Chicago",
  "online_booking_enabled": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.business_settings LIMIT 1);

-- ============================================================
-- 17. INVENTORY LOTS (Add missing columns if table exists)
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_lots') THEN
    ALTER TABLE public.inventory_lots ADD COLUMN IF NOT EXISTS quantity_remaining DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE public.inventory_lots ADD COLUMN IF NOT EXISTS quantity_used DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE public.inventory_lots ADD COLUMN IF NOT EXISTS quantity_wasted DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE public.inventory_lots ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
    ALTER TABLE public.inventory_lots ADD COLUMN IF NOT EXISTS expiration_date DATE;
  END IF;
END $$;

-- ============================================================
-- 18. INVENTORY TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_lot_id UUID,
  inventory_item_id UUID,
  transaction_type VARCHAR(20) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_cost DECIMAL(10,2),
  notes TEXT,
  performed_by UUID,
  appointment_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_lot ON public.inventory_transactions(inventory_lot_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item ON public.inventory_transactions(inventory_item_id);

-- ============================================================
-- 19. ADD NOTES COLUMN TO APPOINTMENTS (if missing)
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes TEXT;
  END IF;
END $$;

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (Service role bypass)
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signed_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_opt_outs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretreatment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretreatment_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftercare_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftercare_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injection_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injection_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CREATE RLS POLICIES (Allow service_role full access)
-- ============================================================

-- Drop and recreate policies (idempotent)
DO $$ 
DECLARE
  tables TEXT[] := ARRAY[
    'user_profiles', 'consent_templates', 'client_consents', 'signed_consents',
    'sms_conversations', 'sms_messages', 'sms_opt_outs',
    'pretreatment_templates', 'pretreatment_sent',
    'aftercare_templates', 'aftercare_sent',
    'injection_maps', 'injection_points',
    'clinical_notes', 'audit_logs', 'business_settings', 'inventory_transactions'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Service role full access to %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Service role full access to %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
SELECT 'All missing tables created successfully!' AS status;
