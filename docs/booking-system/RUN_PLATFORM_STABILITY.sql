-- ============================================================
-- PLATFORM STABILITY LAYER - Run in Supabase SQL Editor
-- Hello Gorgeous Med Spa
-- ============================================================
-- This script adds:
-- 1. Database-level conflict prevention (exclusion constraints)
-- 2. Audit logging table + automatic trigger
-- 3. Booking errors tracking
-- 4. Messaging errors tracking
-- 5. Realtime subscription enablement
-- ============================================================

-- 1. ENABLE BTREE_GIST EXTENSION (required for exclusion constraints)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- 2. AUDIT LOGGING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS appointment_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    performed_by UUID,
    performed_by_role TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_appointment ON appointment_audit_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON appointment_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON appointment_audit_logs(action);

ALTER TABLE appointment_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to audit logs" ON appointment_audit_logs;
CREATE POLICY "Service role full access to audit logs" ON appointment_audit_logs 
    FOR ALL TO service_role USING (true);

-- ============================================================
-- 3. BOOKING ERRORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS booking_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code TEXT NOT NULL,
    error_message TEXT NOT NULL,
    appointment_id UUID,
    client_id UUID,
    service_id UUID,
    provider_id UUID,
    resource_id UUID,
    requested_time TIMESTAMPTZ,
    context JSONB,
    stack_trace TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_booking_errors_created ON booking_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_errors_code ON booking_errors(error_code);
CREATE INDEX IF NOT EXISTS idx_booking_errors_unresolved ON booking_errors(resolved) WHERE resolved = FALSE;

ALTER TABLE booking_errors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to booking errors" ON booking_errors;
CREATE POLICY "Service role full access to booking errors" ON booking_errors 
    FOR ALL TO service_role USING (true);

-- ============================================================
-- 4. MESSAGING ERRORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messaging_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    client_id UUID,
    appointment_id UUID,
    message_type TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,
    provider_used TEXT,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    retry_count INTEGER DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_messaging_errors_created ON messaging_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_messaging_errors_unresolved ON messaging_errors(resolved) WHERE resolved = FALSE;

ALTER TABLE messaging_errors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to messaging errors" ON messaging_errors;
CREATE POLICY "Service role full access to messaging errors" ON messaging_errors 
    FOR ALL TO service_role USING (true);

-- ============================================================
-- 5. ENABLE REALTIME FOR APPOINTMENTS
-- ============================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'appointments already in supabase_realtime publication';
END $$;

-- ============================================================
-- 6. AUTOMATIC AUDIT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION log_appointment_change()
RETURNS TRIGGER AS $$
DECLARE
    changed_fields_arr TEXT[];
    action_type TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        action_type := 'created';
    ELSIF TG_OP = 'DELETE' THEN
        action_type := 'deleted';
    ELSE
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            IF NEW.status = 'cancelled' THEN
                action_type := 'cancelled';
            ELSIF NEW.status = 'no_show' THEN
                action_type := 'no_show';
            ELSE
                action_type := 'status_changed';
            END IF;
        ELSIF OLD.starts_at IS DISTINCT FROM NEW.starts_at OR OLD.ends_at IS DISTINCT FROM NEW.ends_at THEN
            action_type := 'rescheduled';
        ELSIF OLD.provider_id IS DISTINCT FROM NEW.provider_id THEN
            action_type := 'provider_changed';
        ELSIF OLD.resource_id IS DISTINCT FROM NEW.resource_id THEN
            action_type := 'resource_changed';
        ELSE
            action_type := 'updated';
        END IF;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        changed_fields_arr := ARRAY[]::TEXT[];
        IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN changed_fields_arr := array_append(changed_fields_arr, 'client_id'); END IF;
        IF OLD.service_id IS DISTINCT FROM NEW.service_id THEN changed_fields_arr := array_append(changed_fields_arr, 'service_id'); END IF;
        IF OLD.provider_id IS DISTINCT FROM NEW.provider_id THEN changed_fields_arr := array_append(changed_fields_arr, 'provider_id'); END IF;
        IF OLD.resource_id IS DISTINCT FROM NEW.resource_id THEN changed_fields_arr := array_append(changed_fields_arr, 'resource_id'); END IF;
        IF OLD.starts_at IS DISTINCT FROM NEW.starts_at THEN changed_fields_arr := array_append(changed_fields_arr, 'starts_at'); END IF;
        IF OLD.ends_at IS DISTINCT FROM NEW.ends_at THEN changed_fields_arr := array_append(changed_fields_arr, 'ends_at'); END IF;
        IF OLD.status IS DISTINCT FROM NEW.status THEN changed_fields_arr := array_append(changed_fields_arr, 'status'); END IF;
        IF OLD.notes IS DISTINCT FROM NEW.notes THEN changed_fields_arr := array_append(changed_fields_arr, 'notes'); END IF;
    END IF;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO appointment_audit_logs (appointment_id, action, new_values)
        VALUES (NEW.id, action_type, to_jsonb(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO appointment_audit_logs (appointment_id, action, old_values)
        VALUES (OLD.id, action_type, to_jsonb(OLD));
    ELSE
        INSERT INTO appointment_audit_logs (appointment_id, action, old_values, new_values, changed_fields)
        VALUES (NEW.id, action_type, to_jsonb(OLD), to_jsonb(NEW), changed_fields_arr);
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop first to avoid errors)
DROP TRIGGER IF EXISTS trg_appointment_audit ON appointments;
CREATE TRIGGER trg_appointment_audit
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION log_appointment_change();

-- ============================================================
-- 7. EXCLUSION CONSTRAINTS (Database-level conflict prevention)
-- ============================================================
-- NOTE: These require the appointments table to have starts_at and ends_at columns.
-- If you get errors, check your column names (some schemas use start_time/end_time).

-- Check if constraints already exist before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_provider_appointments'
    ) THEN
        ALTER TABLE appointments
        ADD CONSTRAINT no_overlapping_provider_appointments
        EXCLUDE USING gist (
            provider_id WITH =,
            tstzrange(starts_at, ends_at) WITH &&
        )
        WHERE (status NOT IN ('cancelled', 'no_show'));
        
        RAISE NOTICE 'Added provider overlap constraint';
    ELSE
        RAISE NOTICE 'Provider overlap constraint already exists';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add provider overlap constraint: %', SQLERRM;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_resource_appointments'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'appointments' AND column_name = 'resource_id'
        ) THEN
            ALTER TABLE appointments
            ADD CONSTRAINT no_overlapping_resource_appointments
            EXCLUDE USING gist (
                resource_id WITH =,
                tstzrange(starts_at, ends_at) WITH &&
            )
            WHERE (status NOT IN ('cancelled', 'no_show') AND resource_id IS NOT NULL);
            
            RAISE NOTICE 'Added resource overlap constraint';
        ELSE
            RAISE NOTICE 'resource_id column not found, skipping resource constraint';
        END IF;
    ELSE
        RAISE NOTICE 'Resource overlap constraint already exists';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add resource overlap constraint: %', SQLERRM;
END $$;

-- ============================================================
-- 8. SERVICE RESOURCE REQUIREMENTS (optional columns)
-- ============================================================
DO $$ BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS requires_resource BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS default_resource_type TEXT;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS charting_required BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN others THEN NULL; END $$;

-- Update services with resource requirements
UPDATE services SET 
    requires_resource = TRUE,
    default_resource_type = 'device',
    charting_required = TRUE
WHERE LOWER(name) LIKE '%morpheus%' 
   OR LOWER(name) LIKE '%solaria%'
   OR LOWER(name) LIKE '%co2%'
   OR LOWER(name) LIKE '%laser%';

UPDATE services SET 
    requires_resource = TRUE,
    default_resource_type = 'room',
    charting_required = TRUE
WHERE LOWER(name) LIKE '%botox%' 
   OR LOWER(name) LIKE '%filler%'
   OR LOWER(name) LIKE '%injectable%'
   OR LOWER(name) LIKE '%dysport%';

UPDATE services SET 
    requires_resource = TRUE,
    default_resource_type = 'iv_chair',
    charting_required = TRUE
WHERE LOWER(name) LIKE '%iv %' 
   OR LOWER(name) LIKE '%drip%';

-- ============================================================
-- 9. APPOINTMENT CHARTING STATUS COLUMN
-- ============================================================
DO $$ BEGIN
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS charting_status TEXT DEFAULT 'not_required';
EXCEPTION WHEN others THEN NULL; END $$;

-- ============================================================
-- REFRESH SCHEMA CACHE
-- ============================================================
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT 'Tables created:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('appointment_audit_logs', 'booking_errors', 'messaging_errors')
ORDER BY table_name;

SELECT 'Trigger installed:' as info;
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'trg_appointment_audit';

SELECT 'Constraints added:' as info;
SELECT conname FROM pg_constraint 
WHERE conname LIKE 'no_overlapping%';
