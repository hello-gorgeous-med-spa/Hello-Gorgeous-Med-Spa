-- ============================================================
-- REGEN RX Compliance Tables
-- Critical for legal compliance and patient safety
-- ============================================================

-- ============================================================
-- 1. Signed Informed Consents
-- Every patient MUST sign before treatment
-- ============================================================
CREATE TABLE IF NOT EXISTS regen_signed_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Patient info
  patient_id UUID REFERENCES regen_patients(id),
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_dob DATE NOT NULL,
  
  -- Treatment info
  treatment_category VARCHAR(100) NOT NULL,
  program_id VARCHAR(100),
  
  -- Consent details
  consent_version VARCHAR(50) NOT NULL,
  consent_document TEXT NOT NULL, -- Full text of signed consent
  
  -- Signature info
  signed_at TIMESTAMPTZ NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  
  -- Acknowledgments
  acknowledged_risks BOOLEAN DEFAULT false,
  acknowledged_alternatives BOOLEAN DEFAULT false,
  acknowledged_no_guarantees BOOLEAN DEFAULT false,
  
  -- Emergency contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Stripe checkout ID for linking
  stripe_session_id VARCHAR(255)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_regen_consents_patient ON regen_signed_consents(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_consents_email ON regen_signed_consents(patient_email);
CREATE INDEX IF NOT EXISTS idx_regen_consents_signed_at ON regen_signed_consents(signed_at DESC);

-- ============================================================
-- 2. Adverse Event Reports
-- Patient-reported side effects and issues
-- ============================================================
CREATE TABLE IF NOT EXISTS regen_adverse_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Patient info
  patient_id UUID REFERENCES regen_patients(id),
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  
  -- Event details
  medication VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL, -- mild, moderate, severe, emergency
  symptoms TEXT[] NOT NULL,
  description TEXT NOT NULL,
  symptoms_started VARCHAR(255),
  still_occurring VARCHAR(50),
  action_taken TEXT,
  
  -- Follow-up
  wants_callback BOOLEAN DEFAULT false,
  callback_completed BOOLEAN DEFAULT false,
  callback_completed_at TIMESTAMPTZ,
  callback_completed_by UUID REFERENCES regen_staff(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, urgent, reviewed, resolved
  reviewed_by UUID REFERENCES regen_staff(id),
  reviewed_at TIMESTAMPTZ,
  follow_up_notes TEXT,
  
  -- Reporting
  reported_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_regen_adverse_status ON regen_adverse_events(status);
CREATE INDEX IF NOT EXISTS idx_regen_adverse_severity ON regen_adverse_events(severity);
CREATE INDEX IF NOT EXISTS idx_regen_adverse_reported ON regen_adverse_events(reported_at DESC);

-- ============================================================
-- 3. Provider Attestations
-- Audit trail of prescription approvals
-- ============================================================
CREATE TABLE IF NOT EXISTS regen_provider_attestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  intake_id UUID REFERENCES regen_intakes(id),
  order_id UUID REFERENCES regen_orders(id),
  patient_id UUID REFERENCES regen_patients(id),
  
  -- Provider info
  provider_id UUID REFERENCES regen_staff(id),
  provider_name VARCHAR(255) NOT NULL,
  provider_npi VARCHAR(20),
  provider_license VARCHAR(50),
  
  -- Attestation details
  action VARCHAR(50) NOT NULL, -- approved, denied, needs-labs, needs-video
  attestation_text TEXT NOT NULL, -- The actual attestation statement
  
  -- Clinical notes
  clinical_notes TEXT,
  diagnosis_codes TEXT[], -- ICD-10 codes if applicable
  
  -- Labs reviewed
  labs_reviewed BOOLEAN DEFAULT false,
  labs_reviewed_date DATE,
  lab_results_summary TEXT,
  
  -- Video consult
  video_consult_completed BOOLEAN DEFAULT false,
  video_consult_date TIMESTAMPTZ,
  video_consult_notes TEXT,
  
  -- Signature
  attested_at TIMESTAMPTZ NOT NULL,
  ip_address VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_regen_attestations_provider ON regen_provider_attestations(provider_id);
CREATE INDEX IF NOT EXISTS idx_regen_attestations_patient ON regen_provider_attestations(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_attestations_intake ON regen_provider_attestations(intake_id);
CREATE INDEX IF NOT EXISTS idx_regen_attestations_attested ON regen_provider_attestations(attested_at DESC);

-- ============================================================
-- 4. Lab Requirements Tracking
-- For treatments that require labs before prescribing
-- ============================================================
CREATE TABLE IF NOT EXISTS regen_lab_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  intake_id UUID REFERENCES regen_intakes(id),
  patient_id UUID REFERENCES regen_patients(id),
  
  -- Lab info
  lab_type VARCHAR(255) NOT NULL, -- CMP, Lipid Panel, Hormone Panel, etc.
  required_for VARCHAR(100) NOT NULL, -- Treatment category
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, uploaded, reviewed, approved, expired
  
  -- Uploaded lab
  lab_file_url TEXT,
  lab_date DATE,
  lab_provider VARCHAR(255),
  
  -- Review
  reviewed_by UUID REFERENCES regen_staff(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  values_within_range BOOLEAN,
  
  -- Expiration (labs typically valid for 6-12 months)
  expires_at DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_regen_labs_patient ON regen_lab_requirements(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_labs_intake ON regen_lab_requirements(intake_id);
CREATE INDEX IF NOT EXISTS idx_regen_labs_status ON regen_lab_requirements(status);

-- ============================================================
-- 5. Follow-up Schedule
-- Track required check-ins before refills
-- ============================================================
CREATE TABLE IF NOT EXISTS regen_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  patient_id UUID REFERENCES regen_patients(id),
  order_id UUID REFERENCES regen_orders(id),
  
  -- Schedule
  followup_type VARCHAR(100) NOT NULL, -- monthly-checkin, quarterly-labs, annual-video
  scheduled_for DATE NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, missed, rescheduled
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES regen_staff(id),
  
  -- Notes
  patient_notes TEXT, -- What patient reported
  provider_notes TEXT, -- Provider's assessment
  weight_change DECIMAL(5,2), -- For weight loss patients
  side_effects_reported TEXT[],
  
  -- Outcome
  continue_treatment BOOLEAN,
  dose_adjustment VARCHAR(255),
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_regen_followups_patient ON regen_followups(patient_id);
CREATE INDEX IF NOT EXISTS idx_regen_followups_scheduled ON regen_followups(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_regen_followups_status ON regen_followups(status);

-- ============================================================
-- Add consent_id to orders for linking
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_orders' AND column_name = 'consent_id') THEN
    ALTER TABLE regen_orders ADD COLUMN consent_id UUID REFERENCES regen_signed_consents(id);
  END IF;
END $$;

-- ============================================================
-- Add attestation_id to orders for linking
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_orders' AND column_name = 'attestation_id') THEN
    ALTER TABLE regen_orders ADD COLUMN attestation_id UUID REFERENCES regen_provider_attestations(id);
  END IF;
END $$;
