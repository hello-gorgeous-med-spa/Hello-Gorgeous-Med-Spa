-- ============================================================
-- CHARTING HUB - Clinical Documentation System
-- Appointment-optional chart notes with full audit trail
-- ============================================================

-- ============================================================
-- CHART NOTE STATUSES
-- ============================================================
CREATE TYPE chart_note_status AS ENUM ('draft', 'final', 'locked', 'amended');
CREATE TYPE chart_note_type AS ENUM ('soap', 'procedure', 'follow_up', 'consult', 'phone', 'other');

-- ============================================================
-- CHART TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  note_type chart_note_type NOT NULL DEFAULT 'soap',
  
  -- Template content (pre-filled sections)
  subjective_template TEXT,
  objective_template TEXT,
  assessment_template TEXT,
  plan_template TEXT,
  procedure_template JSONB, -- Smart fields for procedures
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  category TEXT, -- e.g., 'injectables', 'laser', 'skincare'
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CHART NOTES - Primary clinical documentation
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Linkages (client required for final, optional for draft)
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  invoice_id UUID, -- Can link to invoice later
  template_id UUID REFERENCES chart_templates(id) ON DELETE SET NULL,
  
  -- Note metadata
  status chart_note_status NOT NULL DEFAULT 'draft',
  note_type chart_note_type NOT NULL DEFAULT 'soap',
  title TEXT, -- Optional title/summary
  
  -- SOAP Documentation
  subjective TEXT, -- Patient's description, complaints
  objective TEXT, -- Provider observations, measurements
  assessment TEXT, -- Diagnosis, clinical impression
  plan TEXT, -- Treatment plan, follow-up
  
  -- Procedure-specific details (JSON for flexibility)
  procedure_details JSONB DEFAULT '{}'::jsonb,
  -- Example structure:
  -- {
  --   "products": [{"name": "Botox", "lot": "ABC123", "units": 50, "sites": ["glabella", "forehead"]}],
  --   "device_settings": {"device": "Laser", "settings": "..."},
  --   "dosage": "...",
  --   "technique": "..."
  -- }
  
  -- Medical coding (optional)
  icd10_codes TEXT[], -- Diagnosis codes
  cpt_codes TEXT[], -- Procedure codes
  
  -- Consent tracking
  consents_signed UUID[], -- References to signed_consents
  
  -- Signature/finalization
  signed_at TIMESTAMPTZ,
  signed_by UUID REFERENCES users(id),
  
  -- Amendment tracking
  amended_from_id UUID REFERENCES chart_notes(id),
  amendment_reason TEXT,
  
  -- Voice capture reference
  voice_capture_id UUID, -- References chart_voice_captures if used
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CHART ATTACHMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_note_id UUID NOT NULL REFERENCES chart_notes(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- MIME type
  file_size INT,
  file_url TEXT NOT NULL, -- Storage URL
  
  description TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CHART PHOTOS (Before/After)
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_note_id UUID NOT NULL REFERENCES chart_notes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  
  photo_type TEXT NOT NULL CHECK (photo_type IN ('before', 'after', 'during', 'reference')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  angle TEXT, -- e.g., 'front', 'left', 'right', '45-left'
  body_area TEXT, -- e.g., 'face', 'neck', 'lips'
  description TEXT,
  
  taken_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CHART VOICE CAPTURES (Dictation)
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_voice_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_note_id UUID REFERENCES chart_notes(id) ON DELETE CASCADE,
  
  -- Audio metadata (audio storage optional)
  audio_url TEXT, -- NULL if not storing audio
  audio_duration_seconds INT,
  audio_stored BOOLEAN NOT NULL DEFAULT false,
  
  -- Transcript
  transcript TEXT NOT NULL,
  transcript_confidence FLOAT, -- 0-1 confidence score
  
  -- Processing info
  transcription_service TEXT, -- 'browser', 'whisper', etc.
  processed_at TIMESTAMPTZ,
  
  -- Which field it was inserted into
  target_field TEXT, -- 'subjective', 'objective', etc.
  
  -- AI structuring (optional)
  ai_structured BOOLEAN NOT NULL DEFAULT false,
  ai_structured_output JSONB,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_chart_notes_client ON chart_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_chart_notes_appointment ON chart_notes(appointment_id);
CREATE INDEX IF NOT EXISTS idx_chart_notes_status ON chart_notes(status);
CREATE INDEX IF NOT EXISTS idx_chart_notes_created_by ON chart_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_chart_notes_created_at ON chart_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chart_notes_note_type ON chart_notes(note_type);

CREATE INDEX IF NOT EXISTS idx_chart_attachments_note ON chart_attachments(chart_note_id);
CREATE INDEX IF NOT EXISTS idx_chart_photos_note ON chart_photos(chart_note_id);
CREATE INDEX IF NOT EXISTS idx_chart_photos_client ON chart_photos(client_id);
CREATE INDEX IF NOT EXISTS idx_chart_voice_captures_note ON chart_voice_captures(chart_note_id);

CREATE INDEX IF NOT EXISTS idx_chart_templates_active ON chart_templates(is_active) WHERE is_active = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE chart_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_voice_captures ENABLE ROW LEVEL SECURITY;

-- Staff can view all notes
CREATE POLICY "Staff can view chart notes"
  ON chart_notes FOR SELECT
  USING (true);

-- Only clinical roles can create/edit
CREATE POLICY "Clinical staff can create chart notes"
  ON chart_notes FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner', 'provider', 'nurse')
    )
  );

CREATE POLICY "Clinical staff can update draft notes"
  ON chart_notes FOR UPDATE
  USING (
    status = 'draft' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner', 'provider', 'nurse')
    )
  );

-- Service role bypass
CREATE POLICY "Service role full access to chart_notes"
  ON chart_notes FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to chart_templates"
  ON chart_templates FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to chart_attachments"
  ON chart_attachments FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to chart_photos"
  ON chart_photos FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to chart_voice_captures"
  ON chart_voice_captures FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- AUDIT TRIGGER - Log all chart note changes
-- ============================================================
CREATE OR REPLACE FUNCTION audit_chart_note_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      user_id, action, resource_type, resource_id, description, new_values
    ) VALUES (
      NEW.created_by,
      'chart_note_created',
      'chart_note',
      NEW.id::text,
      'Chart note created',
      jsonb_build_object(
        'client_id', NEW.client_id,
        'appointment_id', NEW.appointment_id,
        'note_type', NEW.note_type,
        'status', NEW.status
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id, description, old_values, new_values
      ) VALUES (
        COALESCE(NEW.signed_by, NEW.created_by),
        'chart_note_status_changed',
        'chart_note',
        NEW.id::text,
        'Chart note status changed from ' || OLD.status || ' to ' || NEW.status,
        jsonb_build_object('status', OLD.status),
        jsonb_build_object('status', NEW.status, 'signed_at', NEW.signed_at)
      );
    END IF;
    
    -- Log content edits (only for drafts)
    IF OLD.status = 'draft' AND (
      OLD.subjective IS DISTINCT FROM NEW.subjective OR
      OLD.objective IS DISTINCT FROM NEW.objective OR
      OLD.assessment IS DISTINCT FROM NEW.assessment OR
      OLD.plan IS DISTINCT FROM NEW.plan
    ) THEN
      INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id, description
      ) VALUES (
        NEW.created_by,
        'chart_note_edited',
        'chart_note',
        NEW.id::text,
        'Chart note content edited'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS chart_note_audit_trigger ON chart_notes;
CREATE TRIGGER chart_note_audit_trigger
  AFTER INSERT OR UPDATE ON chart_notes
  FOR EACH ROW
  EXECUTE FUNCTION audit_chart_note_changes();

-- ============================================================
-- PREVENT EDITING LOCKED/FINAL NOTES
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_locked_note_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IN ('final', 'locked') AND NEW.status NOT IN ('amended') THEN
    -- Only allow status change to 'amended' or creating an amendment
    IF OLD.subjective IS DISTINCT FROM NEW.subjective OR
       OLD.objective IS DISTINCT FROM NEW.objective OR
       OLD.assessment IS DISTINCT FROM NEW.assessment OR
       OLD.plan IS DISTINCT FROM NEW.plan OR
       OLD.procedure_details IS DISTINCT FROM NEW.procedure_details THEN
      RAISE EXCEPTION 'Cannot edit locked or finalized chart notes. Create an amendment instead.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_locked_note_edit_trigger ON chart_notes;
CREATE TRIGGER prevent_locked_note_edit_trigger
  BEFORE UPDATE ON chart_notes
  FOR EACH ROW
  EXECUTE FUNCTION prevent_locked_note_edit();

-- ============================================================
-- DEFAULT TEMPLATES
-- ============================================================
INSERT INTO chart_templates (name, description, note_type, subjective_template, objective_template, assessment_template, plan_template, is_default, category)
VALUES 
  ('General SOAP Note', 'Standard SOAP documentation', 'soap', 
   'Chief Complaint:\n\nHistory of Present Illness:\n\nReview of Systems:',
   'Vital Signs:\n\nPhysical Exam:\n\nSkin Assessment:',
   'Clinical Impression:\n\nDifferential:',
   'Treatment Plan:\n\nFollow-up:\n\nPatient Education:',
   true, 'general'),
   
  ('Injectable Procedure', 'Botox/Filler documentation', 'procedure',
   'Treatment goals:\n\nAreas of concern:\n\nPrevious treatments:',
   'Pre-treatment photos taken: Yes/No\n\nSkin condition:\n\nContraindications reviewed:',
   'Treatment appropriate: Yes/No\n\nExpected outcomes discussed:',
   'Product used:\nLot #:\nUnits/Amount:\nInjection sites:\nPost-care instructions given: Yes/No\nFollow-up appointment:',
   false, 'injectables'),
   
  ('Laser Treatment', 'Laser/energy device documentation', 'procedure',
   'Treatment goals:\n\nSkin type (Fitzpatrick):\n\nPrevious laser treatments:',
   'Pre-treatment photos taken: Yes/No\n\nSkin preparation:\n\nTest spot performed:',
   'Treatment parameters appropriate for skin type: Yes/No',
   'Device used:\nSettings:\nPasses/Pulses:\nAreas treated:\nImmediate response:\nPost-care instructions given: Yes/No',
   false, 'laser'),
   
  ('Follow-Up Note', 'Post-treatment follow-up', 'follow_up',
   'Days since treatment:\n\nPatient concerns:\n\nSymptoms:',
   'Healing progress:\n\nSide effects observed:\n\nPhotos taken:',
   'Healing as expected: Yes/No\n\nComplications: None/Describe',
   'Additional treatment needed: Yes/No\n\nNext appointment:\n\nInstructions:',
   false, 'follow_up'),
   
  ('Phone Consultation', 'Phone/virtual consult note', 'phone',
   'Reason for call:\n\nPatient concerns:',
   'Information reviewed:\n\nPhotos reviewed (if applicable):',
   'Recommendation:',
   'Action taken:\n\nFollow-up needed: Yes/No',
   false, 'consult')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUCCESS
-- ============================================================
DO $$ BEGIN
  RAISE NOTICE 'Charting Hub tables created successfully';
END $$;
