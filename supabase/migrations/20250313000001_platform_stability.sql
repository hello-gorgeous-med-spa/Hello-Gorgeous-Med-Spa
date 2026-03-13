-- ============================================================
-- PLATFORM STABILITY LAYER
-- Database-level constraints, audit logging, error monitoring
-- ============================================================

-- ============================================================
-- 1. ENABLE BTREE_GIST EXTENSION (required for exclusion constraints)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- 2. DATABASE-LEVEL APPOINTMENT CONFLICT PROTECTION
-- Prevents race-condition double bookings at Postgres level
-- ============================================================

-- First, ensure we have the right column names (starts_at/ends_at)
-- The constraint uses these columns for overlap detection

-- Provider overlap prevention
-- This constraint ensures no two non-cancelled appointments 
-- can overlap for the same provider
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_provider_appointments'
    ) THEN
        -- Only add constraint if starts_at and ends_at columns exist
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'appointments' AND column_name = 'starts_at'
        ) THEN
            ALTER TABLE appointments
            ADD CONSTRAINT no_overlapping_provider_appointments
            EXCLUDE USING gist (
                provider_id WITH =,
                tstzrange(starts_at, ends_at) WITH &&
            )
            WHERE (status NOT IN ('cancelled', 'no_show'));
        END IF;
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add provider overlap constraint: %', SQLERRM;
END $$;

-- Resource/Room overlap prevention (only if resource_id column exists)
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
        END IF;
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add resource overlap constraint: %', SQLERRM;
END $$;

-- ============================================================
-- 3. APPOINTMENT AUDIT LOGGING
-- Track all changes to appointments for debugging and compliance
-- ============================================================

CREATE TABLE IF NOT EXISTS appointment_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL,
    action TEXT NOT NULL, -- created, updated, status_changed, rescheduled, cancelled, provider_changed, resource_changed
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[], -- Array of field names that changed
    performed_by UUID, -- User ID who made the change
    performed_by_role TEXT, -- owner, admin, staff, system, client
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_appointment ON appointment_audit_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON appointment_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON appointment_audit_logs(action);

-- Enable RLS
ALTER TABLE appointment_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to audit logs" ON appointment_audit_logs;
CREATE POLICY "Service role full access to audit logs" ON appointment_audit_logs 
    FOR ALL TO service_role USING (true);

-- ============================================================
-- 4. BOOKING ERROR MONITORING
-- Track failed booking attempts for debugging
-- ============================================================

CREATE TABLE IF NOT EXISTS booking_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code TEXT NOT NULL, -- PROVIDER_CONFLICT, ROOM_CONFLICT, VALIDATION_ERROR, DB_ERROR, etc.
    error_message TEXT NOT NULL,
    appointment_id UUID, -- May be null if appointment wasn't created
    client_id UUID,
    service_id UUID,
    provider_id UUID,
    resource_id UUID,
    requested_time TIMESTAMPTZ,
    context JSONB, -- Additional debugging context
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

-- Enable RLS
ALTER TABLE booking_errors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to booking errors" ON booking_errors;
CREATE POLICY "Service role full access to booking errors" ON booking_errors 
    FOR ALL TO service_role USING (true);

-- ============================================================
-- 5. MESSAGING/SMS ERROR TRACKING
-- Track failed SMS and email sends
-- ============================================================

CREATE TABLE IF NOT EXISTS messaging_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type TEXT NOT NULL, -- sms_failed, email_failed, notification_failed
    error_message TEXT NOT NULL,
    client_id UUID,
    appointment_id UUID,
    message_type TEXT, -- reminder, confirmation, aftercare, marketing
    recipient_phone TEXT,
    recipient_email TEXT,
    provider_used TEXT, -- twilio, telnyx, resend
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    retry_count INTEGER DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_messaging_errors_created ON messaging_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_messaging_errors_unresolved ON messaging_errors(resolved) WHERE resolved = FALSE;

-- Enable RLS
ALTER TABLE messaging_errors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to messaging errors" ON messaging_errors;
CREATE POLICY "Service role full access to messaging errors" ON messaging_errors 
    FOR ALL TO service_role USING (true);

-- ============================================================
-- 6. ENABLE REALTIME FOR APPOINTMENTS
-- Allow Supabase realtime subscriptions
-- ============================================================

-- Enable realtime for appointments table
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- ============================================================
-- 7. SERVICE RESOURCE REQUIREMENTS
-- Track which services require specific resource types
-- ============================================================

-- Add columns to services if they don't exist
DO $$ BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS requires_resource BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS default_resource_type TEXT;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE services ADD COLUMN IF NOT EXISTS charting_required BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN others THEN NULL; END $$;

-- Update services with resource requirements based on category/name
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
   OR LOWER(name) LIKE '%dysport%'
   OR LOWER(name) LIKE '%juvederm%'
   OR LOWER(name) LIKE '%restylane%';

UPDATE services SET 
    requires_resource = TRUE,
    default_resource_type = 'iv_chair',
    charting_required = TRUE
WHERE LOWER(name) LIKE '%iv %' 
   OR LOWER(name) LIKE '%iv-%'
   OR LOWER(name) LIKE '%drip%'
   OR LOWER(name) LIKE '%vitamin injection%';

UPDATE services SET 
    charting_required = TRUE
WHERE LOWER(name) LIKE '%prp%'
   OR LOWER(name) LIKE '%hormone%'
   OR LOWER(name) LIKE '%bhrt%'
   OR LOWER(name) LIKE '%semaglutide%'
   OR LOWER(name) LIKE '%tirzepatide%'
   OR LOWER(name) LIKE '%weight loss%';

-- ============================================================
-- 8. CHARTING STATUS TRACKING
-- Link appointments to their charting records
-- ============================================================

-- Add charting_status to appointments if not exists
DO $$ BEGIN
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS charting_status TEXT DEFAULT 'not_required';
    -- Values: not_required, required, started, complete
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS charting_note_id UUID;
EXCEPTION WHEN others THEN NULL; END $$;

-- ============================================================
-- 9. FUNCTION: LOG APPOINTMENT CHANGES
-- Automatically log changes to appointments
-- ============================================================

CREATE OR REPLACE FUNCTION log_appointment_change()
RETURNS TRIGGER AS $$
DECLARE
    changed_fields_arr TEXT[];
    action_type TEXT;
BEGIN
    -- Determine action type
    IF TG_OP = 'INSERT' THEN
        action_type := 'created';
    ELSIF TG_OP = 'DELETE' THEN
        action_type := 'deleted';
    ELSE
        -- Determine specific update type
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

    -- Build list of changed fields
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

    -- Insert audit log
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

-- Create trigger
DROP TRIGGER IF EXISTS trg_appointment_audit ON appointments;
CREATE TRIGGER trg_appointment_audit
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION log_appointment_change();

-- ============================================================
-- 10. FUNCTION: GET DAILY STATS
-- For Owner Command Center KPIs
-- ============================================================

CREATE OR REPLACE FUNCTION get_daily_appointment_stats(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE(
    total_appointments INTEGER,
    confirmed INTEGER,
    checked_in INTEGER,
    in_progress INTEGER,
    completed INTEGER,
    cancelled INTEGER,
    no_show INTEGER,
    total_revenue NUMERIC,
    booking_errors_today INTEGER,
    messaging_errors_today INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_appointments,
        COUNT(*) FILTER (WHERE a.status = 'confirmed')::INTEGER as confirmed,
        COUNT(*) FILTER (WHERE a.status = 'checked_in')::INTEGER as checked_in,
        COUNT(*) FILTER (WHERE a.status = 'in_progress')::INTEGER as in_progress,
        COUNT(*) FILTER (WHERE a.status = 'completed')::INTEGER as completed,
        COUNT(*) FILTER (WHERE a.status = 'cancelled')::INTEGER as cancelled,
        COUNT(*) FILTER (WHERE a.status = 'no_show')::INTEGER as no_show,
        COALESCE(SUM(CASE WHEN a.status = 'completed' THEN s.price_cents / 100.0 ELSE 0 END), 0)::NUMERIC as total_revenue,
        (SELECT COUNT(*)::INTEGER FROM booking_errors WHERE created_at::DATE = target_date AND resolved = FALSE) as booking_errors_today,
        (SELECT COUNT(*)::INTEGER FROM messaging_errors WHERE created_at::DATE = target_date AND resolved = FALSE) as messaging_errors_today
    FROM appointments a
    LEFT JOIN services s ON a.service_id = s.id
    WHERE a.starts_at::DATE = target_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 11. REFRESH SCHEMA CACHE
-- ============================================================

NOTIFY pgrst, 'reload schema';
