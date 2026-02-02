-- ============================================================
-- SYSTEM CONFIGURATION LAYER (SCL)
-- Owner-Controlled Operating System Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. SYSTEM_CONFIG - Global key/value configuration store
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  editable BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID,
  UNIQUE(category, key)
);

-- 2. BUSINESS_RULES - No-code rules engine
CREATE TABLE IF NOT EXISTS business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID
);

-- 3. FEATURE_FLAGS - Kill switches and feature toggles
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID
);

-- 4. CONFIG_AUDIT_LOG - Track ALL configuration changes
CREATE TABLE IF NOT EXISTS config_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  description TEXT
);

-- 5. PROVIDER_CAPABILITIES - Provider permission matrix
CREATE TABLE IF NOT EXISTS provider_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  service_id UUID,
  capability TEXT NOT NULL,
  value JSONB DEFAULT 'true',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, service_id, capability)
);

-- 6. SERVICE_WORKFLOWS - Service configuration & requirements
CREATE TABLE IF NOT EXISTS service_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID UNIQUE,
  required_consents TEXT[] DEFAULT '{}',
  required_chart_sections TEXT[] DEFAULT '{}',
  require_photos_before BOOLEAN DEFAULT false,
  require_photos_after BOOLEAN DEFAULT false,
  require_lot_tracking BOOLEAN DEFAULT false,
  follow_up_days INTEGER,
  follow_up_message TEXT,
  pre_instructions TEXT,
  post_instructions TEXT,
  buffer_before_minutes INTEGER DEFAULT 0,
  buffer_after_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SEED DEFAULT CONFIGURATION
-- ============================================================

-- Business Hours
INSERT INTO system_config (category, key, value, description) VALUES
('business', 'hours', '{
  "monday": {"open": "09:00", "close": "18:00", "enabled": true},
  "tuesday": {"open": "09:00", "close": "18:00", "enabled": true},
  "wednesday": {"open": "09:00", "close": "18:00", "enabled": true},
  "thursday": {"open": "09:00", "close": "18:00", "enabled": true},
  "friday": {"open": "09:00", "close": "17:00", "enabled": true},
  "saturday": {"open": "10:00", "close": "14:00", "enabled": true},
  "sunday": {"open": null, "close": null, "enabled": false}
}', 'Business operating hours by day')
ON CONFLICT (category, key) DO NOTHING;

-- Booking Rules
INSERT INTO system_config (category, key, value, description) VALUES
('booking', 'rules', '{
  "min_advance_hours": 2,
  "max_advance_days": 60,
  "allow_same_day": true,
  "require_deposit": false,
  "deposit_percentage": 25,
  "cancellation_hours": 24,
  "cancellation_fee_percentage": 50,
  "no_show_fee_percentage": 100,
  "allow_online_booking": true,
  "require_phone_verified": false,
  "require_email_verified": false
}', 'Booking policies and rules')
ON CONFLICT (category, key) DO NOTHING;

-- Default Buffers
INSERT INTO system_config (category, key, value, description) VALUES
('scheduling', 'buffers', '{
  "default_buffer_before": 0,
  "default_buffer_after": 15,
  "injectable_buffer_after": 15,
  "consultation_buffer_after": 10,
  "iv_therapy_buffer_after": 15
}', 'Time buffers between appointments')
ON CONFLICT (category, key) DO NOTHING;

-- Consent Requirements
INSERT INTO system_config (category, key, value, description) VALUES
('compliance', 'consents', '{
  "require_hipaa": true,
  "require_financial_policy": true,
  "require_photo_release": false,
  "consent_expiry_days": 365,
  "allow_digital_signature": true
}', 'Consent form requirements')
ON CONFLICT (category, key) DO NOTHING;

-- Charting Requirements
INSERT INTO system_config (category, key, value, description) VALUES
('clinical', 'charting', '{
  "require_soap_notes": true,
  "require_lot_tracking_injectables": true,
  "require_before_photos": false,
  "require_after_photos": false,
  "lock_chart_after_hours": 24,
  "allow_addendum": true
}', 'Clinical documentation requirements')
ON CONFLICT (category, key) DO NOTHING;

-- Payment Settings
INSERT INTO system_config (category, key, value, description) VALUES
('payments', 'settings', '{
  "accept_cash": true,
  "accept_card": true,
  "accept_financing": true,
  "require_payment_before_service": false,
  "auto_generate_receipt": true,
  "send_receipt_email": true,
  "send_receipt_sms": false
}', 'Payment processing settings')
ON CONFLICT (category, key) DO NOTHING;

-- Notification Settings
INSERT INTO system_config (category, key, value, description) VALUES
('notifications', 'settings', '{
  "send_booking_confirmation": true,
  "send_24h_reminder": true,
  "send_2h_reminder": true,
  "send_follow_up": true,
  "follow_up_delay_days": 14,
  "send_review_request": true,
  "review_request_delay_hours": 24
}', 'Client notification settings')
ON CONFLICT (category, key) DO NOTHING;

-- ============================================================
-- SEED FEATURE FLAGS
-- ============================================================

INSERT INTO feature_flags (key, name, description, is_enabled, category) VALUES
('online_booking', 'Online Booking', 'Allow clients to book appointments online', true, 'booking'),
('quick_sale', 'Quick Sale / POS', 'Point of sale for walk-ins and retail', true, 'payments'),
('memberships', 'Memberships', 'Membership program management', true, 'billing'),
('gift_cards', 'Gift Cards', 'Gift card sales and redemption', true, 'billing'),
('sms_notifications', 'SMS Notifications', 'Send SMS appointment reminders', true, 'notifications'),
('email_notifications', 'Email Notifications', 'Send email confirmations and reminders', true, 'notifications'),
('review_requests', 'Review Requests', 'Auto-request reviews after appointments', true, 'marketing'),
('client_portal', 'Client Portal', 'Client self-service portal', true, 'client'),
('provider_portal', 'Provider Portal', 'Provider clinical portal', true, 'clinical'),
('charting', 'Clinical Charting', 'SOAP notes and clinical documentation', true, 'clinical'),
('photo_gallery', 'Photo Gallery', 'Before/after photo management', true, 'clinical'),
('inventory_tracking', 'Inventory Tracking', 'Track product inventory and lots', true, 'inventory'),
('consent_forms', 'Digital Consent Forms', 'Electronic consent form signing', true, 'compliance'),
('ai_features', 'AI Features', 'AI-powered summaries and suggestions', false, 'experimental'),
('sandbox_mode', 'Sandbox Mode', 'Test changes before publishing', false, 'system')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED DEFAULT BUSINESS RULES
-- ============================================================

INSERT INTO business_rules (name, description, category, conditions, actions, priority, is_active) VALUES
('Injectable Consent Required', 'Require neurotoxin consent for all injectable services', 'consent', 
'[{"field": "service.category", "operator": "in", "value": ["Injectables", "BOTOX", "Dermal Fillers"]}]',
'[{"type": "require_consent", "consent_type": "neurotoxin"}]',
100, true),

('Weight Loss Medical Clearance', 'Require medical consultation for weight loss programs', 'booking',
'[{"field": "service.category", "operator": "in", "value": ["Weight Loss", "Weight Loss Program", "Weight Loss Injections"]}]',
'[{"type": "require_consult", "consult_type": "medical_clearance"}]',
90, true),

('New Client Intake', 'Require intake form for new clients', 'intake',
'[{"field": "client.is_new", "operator": "equals", "value": true}]',
'[{"type": "require_form", "form_type": "intake"}]',
80, true),

('24h Cancellation Policy', 'Apply cancellation fee for late cancellations', 'cancellation',
'[{"field": "hours_until_appointment", "operator": "less_than", "value": 24}]',
'[{"type": "apply_fee", "fee_type": "cancellation", "percentage": 50}]',
70, true),

('No Show Fee', 'Apply full fee for no-shows', 'no_show',
'[{"field": "appointment.status", "operator": "equals", "value": "no_show"}]',
'[{"type": "apply_fee", "fee_type": "no_show", "percentage": 100}]',
100, true)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'System Configuration Layer created successfully!' as status;
