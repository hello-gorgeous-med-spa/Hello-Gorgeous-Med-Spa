-- ============================================================
-- PHASE 2: MEDICATIONS ADMINISTERED LOG
-- Track all injectables/treatments with lot numbers
-- ============================================================

-- Medications Administered
CREATE TABLE IF NOT EXISTS medications_administered (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  appointment_id UUID REFERENCES appointments(id),
  chart_note_id UUID REFERENCES chart_notes(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  
  -- Medication details
  medication_name VARCHAR(255) NOT NULL,
  medication_type VARCHAR(50) CHECK (medication_type IN ('neurotoxin', 'filler', 'biostimulator', 'skin_booster', 'vitamin', 'prp', 'other')),
  brand VARCHAR(100),
  
  -- Dosage
  quantity DECIMAL(10,2) NOT NULL,
  unit_type VARCHAR(20) DEFAULT 'units', -- units, ml, syringes
  
  -- Lot tracking (for compliance)
  lot_number VARCHAR(100),
  expiration_date DATE,
  inventory_lot_id UUID REFERENCES inventory_lots(id),
  
  -- Treatment areas
  treatment_areas TEXT[], -- ['forehead', 'glabella', 'crows_feet']
  injection_sites JSONB, -- detailed injection map if needed
  
  -- Notes
  notes TEXT,
  adverse_reactions TEXT,
  
  -- Audit
  administered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  recorded_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reporting
CREATE INDEX IF NOT EXISTS idx_medications_client ON medications_administered(client_id);
CREATE INDEX IF NOT EXISTS idx_medications_provider ON medications_administered(provider_id);
CREATE INDEX IF NOT EXISTS idx_medications_date ON medications_administered(administered_at);
CREATE INDEX IF NOT EXISTS idx_medications_type ON medications_administered(medication_type);
CREATE INDEX IF NOT EXISTS idx_medications_lot ON medications_administered(lot_number);

-- RLS
ALTER TABLE medications_administered ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view medications" ON medications_administered
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Providers can insert medications" ON medications_administered
  FOR INSERT TO authenticated WITH CHECK (true);
