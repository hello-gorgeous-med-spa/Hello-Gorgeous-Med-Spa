-- ============================================================
-- CLIENT PORTAL COMPLETE - Database Schema
-- Secure, HIPAA-compliant patient portal
-- ============================================================

-- ============================================================
-- 1. MAGIC LINK TOKENS (Passwordless Authentication)
-- ============================================================
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE,
  token_hash VARCHAR(128) NOT NULL, -- SHA-256 hash for security
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_magic_link_token ON magic_link_tokens(token) WHERE used_at IS NULL;
CREATE INDEX idx_magic_link_client ON magic_link_tokens(client_id);
CREATE INDEX idx_magic_link_expires ON magic_link_tokens(expires_at) WHERE used_at IS NULL;

-- ============================================================
-- 2. CLIENT SESSIONS (Secure Session Management)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  session_token VARCHAR(128) NOT NULL UNIQUE,
  refresh_token VARCHAR(128),
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_client_session_token ON client_sessions(session_token) WHERE revoked_at IS NULL;
CREATE INDEX idx_client_session_client ON client_sessions(client_id);

-- ============================================================
-- 3. PORTAL ACCESS LOG (HIPAA Audit Trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  session_id UUID REFERENCES client_sessions(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, logout, view_document, download, sign_consent, etc.
  resource_type VARCHAR(50), -- document, appointment, consent, receipt, etc.
  resource_id UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portal_access_client ON portal_access_log(client_id);
CREATE INDEX idx_portal_access_action ON portal_access_log(action);
CREATE INDEX idx_portal_access_created ON portal_access_log(created_at);

-- ============================================================
-- 4. CLIENT DOCUMENTS (Secure Document Storage)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Document Info
  document_type VARCHAR(50) NOT NULL, -- consent_form, receipt, invoice, lab_result, before_after_photo, aftercare, insurance, medical_record
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- File Storage
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes INTEGER,
  mime_type VARCHAR(100),
  
  -- Related Records
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  consent_form_id UUID,
  transaction_id UUID,
  
  -- Metadata
  category VARCHAR(50), -- financial, medical, consent, photos, instructions
  tags TEXT[],
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_ip VARCHAR(45),
  
  -- Access Control
  is_downloadable BOOLEAN DEFAULT true,
  requires_verification BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- active, archived, pending
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX idx_client_docs_client ON client_documents(client_id);
CREATE INDEX idx_client_docs_type ON client_documents(document_type);
CREATE INDEX idx_client_docs_category ON client_documents(category);
CREATE INDEX idx_client_docs_appointment ON client_documents(appointment_id);

-- ============================================================
-- 5. CONSENT SUBMISSIONS (E-Signature Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS consent_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consent_form_id UUID NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Form Data
  form_type VARCHAR(50) NOT NULL, -- intake, botox_consent, filler_consent, hipaa, etc.
  form_version VARCHAR(20) DEFAULT '1.0',
  form_data JSONB NOT NULL DEFAULT '{}',
  
  -- Signature
  signature_data TEXT, -- Base64 encoded signature image
  signature_typed VARCHAR(255), -- Typed signature
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_ip VARCHAR(45),
  signature_user_agent TEXT,
  
  -- Verification
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- PDF Storage
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, signed, verified, expired, revoked
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consent_client ON consent_submissions(client_id);
CREATE INDEX idx_consent_appointment ON consent_submissions(appointment_id);
CREATE INDEX idx_consent_type ON consent_submissions(form_type);
CREATE INDEX idx_consent_status ON consent_submissions(status);

-- ============================================================
-- 6. PATIENT WALLET (Credits & Gift Cards)
-- ============================================================
CREATE TABLE IF NOT EXISTS patient_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Balance
  credit_balance_cents INTEGER DEFAULT 0,
  gift_card_balance_cents INTEGER DEFAULT 0,
  reward_points INTEGER DEFAULT 0,
  
  -- Lifetime Stats
  total_spent_cents INTEGER DEFAULT 0,
  total_saved_cents INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0,
  total_referral_credits_cents INTEGER DEFAULT 0,
  
  -- Membership
  membership_tier VARCHAR(50), -- bronze, silver, gold, platinum, vip
  membership_since DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_patient_wallet_client ON patient_wallet(client_id);

-- ============================================================
-- 7. WALLET TRANSACTIONS (Credit/Debit History)
-- ============================================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES patient_wallet(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Transaction Details
  transaction_type VARCHAR(30) NOT NULL, -- credit, debit, gift_card_purchase, gift_card_redeem, referral_bonus, reward_redemption, refund
  amount_cents INTEGER NOT NULL,
  balance_after_cents INTEGER NOT NULL,
  
  -- Source/Reason
  source VARCHAR(50), -- appointment, purchase, gift_card, referral, promotion, admin_adjustment
  source_id UUID, -- appointment_id, gift_card_id, etc.
  description TEXT,
  
  -- Gift Card Specific
  gift_card_code VARCHAR(20),
  gift_card_from VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_client ON wallet_transactions(client_id);
CREATE INDEX idx_wallet_tx_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_tx_created ON wallet_transactions(created_at);

-- ============================================================
-- 8. PAYMENT RECEIPTS (Transaction Records)
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Receipt Details
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Amounts
  subtotal_cents INTEGER NOT NULL,
  discount_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  tip_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  
  -- Payment Method
  payment_method VARCHAR(50), -- credit_card, cash, gift_card, wallet_credit, insurance
  payment_processor VARCHAR(50), -- square, stripe, etc.
  payment_reference VARCHAR(100),
  last_four VARCHAR(4),
  card_brand VARCHAR(20),
  
  -- Line Items
  line_items JSONB DEFAULT '[]',
  
  -- Provider Info
  provider_id UUID,
  provider_name VARCHAR(255),
  
  -- PDF
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'completed', -- pending, completed, refunded, voided
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_amount_cents INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_receipt_client ON payment_receipts(client_id);
CREATE INDEX idx_receipt_appointment ON payment_receipts(appointment_id);
CREATE INDEX idx_receipt_number ON payment_receipts(receipt_number);
CREATE INDEX idx_receipt_date ON payment_receipts(receipt_date);

-- ============================================================
-- 9. CLIENT NOTIFICATIONS (Notification Center)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Notification Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL, -- appointment_reminder, form_required, payment_due, promotion, general
  
  -- Action
  action_url TEXT,
  action_label VARCHAR(100),
  
  -- Priority & Category
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  category VARCHAR(50), -- appointments, documents, payments, promotions, system
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  
  -- Delivery
  sent_via_email BOOLEAN DEFAULT false,
  sent_via_sms BOOLEAN DEFAULT false,
  sent_via_push BOOLEAN DEFAULT false,
  
  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notification_client ON client_notifications(client_id);
CREATE INDEX idx_notification_unread ON client_notifications(client_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notification_type ON client_notifications(notification_type);

-- ============================================================
-- 10. AFTERCARE INSTRUCTIONS (Treatment Instructions)
-- ============================================================
CREATE TABLE IF NOT EXISTS aftercare_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Service Link
  service_id UUID,
  service_category VARCHAR(100),
  treatment_type VARCHAR(100) NOT NULL, -- botox, filler, laser, etc.
  
  -- Content
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  instructions JSONB NOT NULL DEFAULT '[]', -- Array of instruction objects
  warnings TEXT[],
  
  -- Timing
  immediate_care TEXT,
  first_24_hours TEXT,
  first_week TEXT,
  long_term TEXT,
  
  -- Follow Up
  follow_up_days INTEGER,
  emergency_signs TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version VARCHAR(20) DEFAULT '1.0',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_aftercare_treatment ON aftercare_instructions(treatment_type);
CREATE INDEX idx_aftercare_service ON aftercare_instructions(service_id);

-- ============================================================
-- 11. CLIENT AFTERCARE (Assigned Instructions)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_aftercare (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  aftercare_id UUID REFERENCES aftercare_instructions(id) ON DELETE SET NULL,
  
  -- Custom Instructions
  custom_notes TEXT,
  provider_notes TEXT,
  
  -- Acknowledgment
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_ip VARCHAR(45),
  
  -- Status
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_via VARCHAR(20), -- email, sms, portal
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_client_aftercare_client ON client_aftercare(client_id);
CREATE INDEX idx_client_aftercare_appointment ON client_aftercare(appointment_id);

-- ============================================================
-- 12. TREATMENT PHOTOS (Before/After)
-- ============================================================
CREATE TABLE IF NOT EXISTS treatment_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Photo Info
  photo_type VARCHAR(20) NOT NULL, -- before, after, progress
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Metadata
  treatment_area VARCHAR(100), -- forehead, lips, cheeks, etc.
  treatment_type VARCHAR(100), -- botox, filler, laser, etc.
  notes TEXT,
  
  -- Timing
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days_post_treatment INTEGER,
  
  -- Privacy
  client_visible BOOLEAN DEFAULT true,
  consent_for_marketing BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX idx_treatment_photos_client ON treatment_photos(client_id);
CREATE INDEX idx_treatment_photos_appointment ON treatment_photos(appointment_id);
CREATE INDEX idx_treatment_photos_type ON treatment_photos(photo_type);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_documents_updated_at BEFORE UPDATE ON client_documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_consent_submissions_updated_at BEFORE UPDATE ON consent_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_patient_wallet_updated_at BEFORE UPDATE ON patient_wallet
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_aftercare_instructions_updated_at BEFORE UPDATE ON aftercare_instructions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_aftercare ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_photos ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access" ON magic_link_tokens FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON client_sessions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON portal_access_log FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON client_documents FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON consent_submissions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON patient_wallet FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON wallet_transactions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON payment_receipts FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON client_notifications FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON client_aftercare FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON treatment_photos FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access" ON aftercare_instructions FOR ALL TO service_role USING (true);

-- ============================================================
-- SEED DEFAULT AFTERCARE INSTRUCTIONS
-- ============================================================

INSERT INTO aftercare_instructions (treatment_type, title, summary, instructions, warnings, immediate_care, first_24_hours, first_week, emergency_signs)
VALUES 
(
  'botox',
  'Botox Aftercare Instructions',
  'Important guidelines for optimal results after your Botox treatment.',
  '[
    {"step": 1, "instruction": "Stay upright for 4 hours after treatment"},
    {"step": 2, "instruction": "Avoid touching or rubbing the treated areas"},
    {"step": 3, "instruction": "Do not lie down or bend over for 4 hours"},
    {"step": 4, "instruction": "Avoid strenuous exercise for 24 hours"},
    {"step": 5, "instruction": "Avoid alcohol for 24 hours"},
    {"step": 6, "instruction": "Avoid facials, saunas, or hot tubs for 24 hours"}
  ]',
  ARRAY['Do not massage the treated area', 'Avoid blood thinners unless prescribed', 'Contact us if you experience drooping eyelid'],
  'Stay upright and avoid touching the injection sites. Small bumps are normal and will resolve within 30 minutes.',
  'Avoid strenuous exercise, alcohol, and lying face down. You may experience slight redness or bruising.',
  'Results begin to appear in 3-5 days and reach full effect in 10-14 days. Avoid facials during this time.',
  ARRAY['Severe headache', 'Difficulty breathing or swallowing', 'Vision changes', 'Spreading of toxin symptoms']
),
(
  'filler',
  'Dermal Filler Aftercare Instructions',
  'Guidelines for care after your dermal filler treatment for best results.',
  '[
    {"step": 1, "instruction": "Apply ice to reduce swelling (10 min on, 10 min off)"},
    {"step": 2, "instruction": "Avoid touching or pressing on treated areas"},
    {"step": 3, "instruction": "Sleep on your back with head elevated for 2 nights"},
    {"step": 4, "instruction": "Avoid strenuous exercise for 48 hours"},
    {"step": 5, "instruction": "Avoid alcohol for 24 hours"},
    {"step": 6, "instruction": "Stay hydrated"}
  ]',
  ARRAY['Swelling and bruising are normal', 'Lumps may be felt initially', 'Avoid dental procedures for 2 weeks'],
  'Apply ice as directed. Swelling is normal and may increase over the first 24-48 hours.',
  'Continue icing. Avoid makeup on injection sites. Take arnica if recommended.',
  'Swelling subsides significantly. Avoid extreme temperatures (saunas, freezing weather). Final results visible at 2 weeks.',
  ARRAY['Severe pain not relieved by OTC pain medication', 'White or blue discoloration of skin', 'Vision changes', 'Signs of infection (increasing redness, warmth, fever)']
),
(
  'laser',
  'Laser Treatment Aftercare Instructions',
  'Post-treatment care for laser skin treatments.',
  '[
    {"step": 1, "instruction": "Apply prescribed healing ointment as directed"},
    {"step": 2, "instruction": "Keep the treated area clean and moisturized"},
    {"step": 3, "instruction": "Avoid sun exposure and use SPF 30+ daily"},
    {"step": 4, "instruction": "Do not pick or scratch treated areas"},
    {"step": 5, "instruction": "Avoid hot showers, saunas, and swimming for 48 hours"}
  ]',
  ARRAY['Redness and swelling are expected', 'Skin may feel tight or dry', 'Avoid retinoids and exfoliants for 1 week'],
  'Skin may be red and feel sunburned. Apply cooling gel as directed.',
  'Continue applying healing ointment. Avoid makeup if skin is broken. Keep area clean.',
  'Redness fades. Dead skin may peel - do not pick. Use gentle cleanser and moisturizer.',
  ARRAY['Blistering', 'Signs of infection', 'Extreme pain', 'Scarring concerns']
),
(
  'microneedling',
  'Microneedling Aftercare Instructions',
  'Care instructions after your microneedling treatment.',
  '[
    {"step": 1, "instruction": "Keep skin clean and apply hyaluronic acid serum"},
    {"step": 2, "instruction": "Avoid makeup for 24 hours"},
    {"step": 3, "instruction": "Avoid active ingredients (retinol, vitamin C, acids) for 5-7 days"},
    {"step": 4, "instruction": "Use SPF 30+ daily"},
    {"step": 5, "instruction": "Stay hydrated and avoid alcohol for 24 hours"}
  ]',
  ARRAY['Redness like a sunburn is normal', 'Skin may feel tight', 'Avoid swimming and sweating for 72 hours'],
  'Skin will be red and sensitive. Use only approved products for 24 hours.',
  'Redness decreases. Gentle cleanser only. No makeup.',
  'Resume normal skincare gradually. Avoid harsh products. Results improve over 4-6 weeks.',
  ARRAY['Prolonged swelling', 'Pus or yellow discharge', 'Fever', 'Severe itching or rash']
),
(
  'weight_loss',
  'Weight Loss Injection Aftercare',
  'Guidelines after your weight loss injection (Semaglutide/Tirzepatide).',
  '[
    {"step": 1, "instruction": "Eat small, frequent meals"},
    {"step": 2, "instruction": "Stay well hydrated - drink at least 64oz water daily"},
    {"step": 3, "instruction": "Avoid high-fat and fried foods"},
    {"step": 4, "instruction": "Keep injection site clean and dry"},
    {"step": 5, "instruction": "Take note of any side effects to discuss at next visit"}
  ]',
  ARRAY['Nausea is common initially', 'Appetite suppression is expected', 'Contact us for severe vomiting'],
  'Rest after injection. Injection site may be slightly red or sore.',
  'Start with bland, easy-to-digest foods. Nausea typically improves with time.',
  'Continue healthy eating habits. Track your progress. Stay active as tolerated.',
  ARRAY['Severe abdominal pain', 'Persistent vomiting', 'Signs of pancreatitis', 'Severe allergic reaction']
)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE magic_link_tokens IS 'Secure passwordless authentication tokens';
COMMENT ON TABLE client_sessions IS 'Active client portal sessions';
COMMENT ON TABLE portal_access_log IS 'HIPAA-compliant audit trail of all portal access';
COMMENT ON TABLE client_documents IS 'Secure document storage for clients';
COMMENT ON TABLE consent_submissions IS 'Electronic consent form submissions with signatures';
COMMENT ON TABLE patient_wallet IS 'Client wallet for credits, gift cards, and rewards';
COMMENT ON TABLE wallet_transactions IS 'Transaction history for patient wallet';
COMMENT ON TABLE payment_receipts IS 'Payment receipts and invoices';
COMMENT ON TABLE client_notifications IS 'Client notification center';
COMMENT ON TABLE aftercare_instructions IS 'Treatment aftercare instructions library';
COMMENT ON TABLE client_aftercare IS 'Aftercare instructions assigned to clients';
COMMENT ON TABLE treatment_photos IS 'Before/after treatment photos';
