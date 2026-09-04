-- ============================================================
-- Add Fullscript integration columns to lab requirements
-- ============================================================

-- Add columns if they don't exist
DO $$
BEGIN
  -- Patient info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'patient_email') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN patient_email VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'patient_name') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN patient_name VARCHAR(255);
  END IF;
  
  -- Fullscript integration
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'fullscript_order_id') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN fullscript_order_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'fullscript_patient_id') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN fullscript_patient_id VARCHAR(255);
  END IF;
  
  -- Panel info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'panel_id') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN panel_id VARCHAR(100);
  END IF;
  
  -- Stripe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'stripe_session_id') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN stripe_session_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'stripe_payment_intent') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN stripe_payment_intent VARCHAR(255);
  END IF;
  
  -- Lab results
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'results_url') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN results_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'regen_lab_requirements' AND column_name = 'requisition_url') THEN
    ALTER TABLE regen_lab_requirements ADD COLUMN requisition_url TEXT;
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_regen_labs_email ON regen_lab_requirements(patient_email);
CREATE INDEX IF NOT EXISTS idx_regen_labs_fullscript ON regen_lab_requirements(fullscript_order_id);
CREATE INDEX IF NOT EXISTS idx_regen_labs_stripe ON regen_lab_requirements(stripe_session_id);
