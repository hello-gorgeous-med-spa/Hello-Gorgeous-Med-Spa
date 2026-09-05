-- REGEN Ops OS: named staff, pharmacy errors, staff-to-patient messages

INSERT INTO regen_staff (email, name, role, can_approve_rx, can_process_refunds, can_view_financials, can_manage_products)
VALUES
  ('provider@hellogorgeousmedspa.com', 'Danielle Alcala', 'owner', true, true, true, true),
  ('ryan@hellogorgeousmedspa.com', 'Ryan Kent, FNP-BC', 'prescriber', true, false, false, false),
  ('damara@hellogorgeousmedspa.com', 'Damara', 'admin', false, false, true, false)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  active = true;

ALTER TABLE regen_intakes ADD COLUMN IF NOT EXISTS reviewed_by_name VARCHAR(255);

ALTER TABLE regen_orders ADD COLUMN IF NOT EXISTS pharmacy_error TEXT;

ALTER TABLE regen_messages ADD COLUMN IF NOT EXISTS patient_email VARCHAR(255);
ALTER TABLE regen_messages ADD COLUMN IF NOT EXISTS direction VARCHAR(20) DEFAULT 'outbound';
ALTER TABLE regen_messages ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE regen_messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE regen_messages ADD COLUMN IF NOT EXISTS sender_name VARCHAR(255);
ALTER TABLE regen_messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT true;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regen_messages' AND column_name = 'patient_id'
  ) THEN
    ALTER TABLE regen_messages ALTER COLUMN patient_id DROP NOT NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regen_messages' AND column_name = 'sender'
  ) THEN
    ALTER TABLE regen_messages ALTER COLUMN sender DROP NOT NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regen_messages' AND column_name = 'message'
  ) THEN
    ALTER TABLE regen_messages ALTER COLUMN message DROP NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regen_messages' AND column_name = 'message'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regen_messages' AND column_name = 'content'
  ) THEN
    UPDATE regen_messages SET content = message WHERE content IS NULL AND message IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'regen_messages') THEN
    CREATE INDEX IF NOT EXISTS idx_regen_messages_email ON regen_messages(patient_email);
  END IF;
END $$;
