-- ============================================================
-- HIPAA AUDIT LOG HARDENING
-- Append-only, tamper-resistant, 6-year retention
-- ============================================================
-- This migration:
-- 1. Adds new columns for comprehensive tracking
-- 2. Creates triggers to enforce append-only (block UPDATE/DELETE)
-- 3. Adds indexes for query performance
-- 4. Updates RLS to restrict reads to admin/compliance only
-- ============================================================

-- ============================================================
-- 1. ADD NEW COLUMNS
-- ============================================================
-- Note: The existing audit_log table uses 'user_id' not 'actor_id'
-- We add new columns that don't exist yet

-- Request correlation ID (trace events across single request)
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS request_id UUID;

-- Success/failure indicator (for auth/admin outcomes)
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS success BOOLEAN;

-- Session ID (correlate events to user session)
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Old/new values for change tracking (stored as JSONB)
-- Note: old_values and new_values already exist in the original schema
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS old_values JSONB;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS new_values JSONB;

-- Changed fields list (for quick reference)
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS changed_fields TEXT[];

-- Resource path (API endpoint that triggered the event)
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS resource_path TEXT;

-- Actor type (user, system, api) - existing table has user_role which we can use
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS actor_type VARCHAR(50) DEFAULT 'user';

-- ============================================================
-- 2. APPEND-ONLY ENFORCEMENT (TRIGGERS)
-- ============================================================
-- These triggers block UPDATE and DELETE at the database level,
-- even if RLS is misconfigured or bypassed.

-- Block UPDATE trigger
CREATE OR REPLACE FUNCTION audit_log_block_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AUDIT_LOG_IMMUTABLE: UPDATE operations are not permitted on audit_log table. Audit logs are append-only for HIPAA compliance.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Block DELETE trigger
CREATE OR REPLACE FUNCTION audit_log_block_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AUDIT_LOG_IMMUTABLE: DELETE operations are not permitted on audit_log table. Audit logs are append-only for HIPAA compliance.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS audit_log_prevent_update ON audit_log;
DROP TRIGGER IF EXISTS audit_log_prevent_delete ON audit_log;

-- Create triggers
CREATE TRIGGER audit_log_prevent_update
  BEFORE UPDATE ON audit_log
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_block_update();

CREATE TRIGGER audit_log_prevent_delete
  BEFORE DELETE ON audit_log
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_block_delete();

-- ============================================================
-- 3. INDEXES FOR QUERY PERFORMANCE
-- ============================================================

-- Primary query patterns:
-- 1. Recent events (compliance dashboard)
-- 2. Events by actor (user activity)
-- 3. Events by entity (record history)
-- 4. Events by action type

-- Note: Some indexes may already exist from original migration
-- Using IF NOT EXISTS to handle gracefully

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at_desc 
  ON audit_log (created_at DESC);

-- Use user_id (existing column) not actor_id
CREATE INDEX IF NOT EXISTS idx_audit_log_user_created 
  ON audit_log (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_entity 
  ON audit_log (entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_action_time 
  ON audit_log (action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_request_id 
  ON audit_log (request_id) 
  WHERE request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_log_session_id 
  ON audit_log (session_id, created_at DESC) 
  WHERE session_id IS NOT NULL;

-- ============================================================
-- 4. RLS POLICIES (ADMIN/COMPLIANCE READ ONLY)
-- ============================================================

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow authenticated read on audit_log" ON audit_log;
DROP POLICY IF EXISTS "Allow service role full access to audit_log" ON audit_log;
DROP POLICY IF EXISTS "Anyone can read audit_log" ON audit_log;

-- Service role can INSERT (API uses service role)
CREATE POLICY "audit_log_service_insert"
  ON audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can SELECT (for API queries)
CREATE POLICY "audit_log_service_select"
  ON audit_log
  FOR SELECT
  TO service_role
  USING (true);

-- Admin/compliance can SELECT
-- Note: Uses user_profiles table for role checking
CREATE POLICY "audit_log_admin_select"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- NO UPDATE policy (triggers block anyway)
-- NO DELETE policy (triggers block anyway)

-- ============================================================
-- 5. ARCHIVE TABLE (FOR 6-YEAR RETENTION)
-- ============================================================
-- Hot retention: 180 days in audit_log
-- Archive: older records moved to audit_log_archive

CREATE TABLE IF NOT EXISTS audit_log_archive (
  LIKE audit_log INCLUDING ALL
);

-- Archive also gets append-only protection
CREATE OR REPLACE FUNCTION audit_log_archive_block_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AUDIT_LOG_IMMUTABLE: UPDATE operations are not permitted on audit_log_archive table.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit_log_archive_block_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AUDIT_LOG_IMMUTABLE: DELETE operations are not permitted on audit_log_archive table.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_log_archive_prevent_update ON audit_log_archive;
DROP TRIGGER IF EXISTS audit_log_archive_prevent_delete ON audit_log_archive;

CREATE TRIGGER audit_log_archive_prevent_update
  BEFORE UPDATE ON audit_log_archive
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_archive_block_update();

CREATE TRIGGER audit_log_archive_prevent_delete
  BEFORE DELETE ON audit_log_archive
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_archive_block_delete();

-- RLS for archive (same as main table)
ALTER TABLE audit_log_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_archive_service_select"
  ON audit_log_archive
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "audit_log_archive_admin_select"
  ON audit_log_archive
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- ============================================================
-- 6. ARCHIVE FUNCTION (CALLED BY CRON/MANUAL)
-- ============================================================
-- Moves records older than 180 days to archive
-- Run periodically (e.g., weekly cron job)

CREATE OR REPLACE FUNCTION archive_old_audit_logs(retention_days INTEGER DEFAULT 180)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
  cutoff_date TIMESTAMPTZ;
BEGIN
  cutoff_date := NOW() - (retention_days || ' days')::INTERVAL;
  
  -- Insert into archive
  INSERT INTO audit_log_archive
  SELECT * FROM audit_log
  WHERE created_at < cutoff_date;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  
  -- Note: We cannot DELETE from audit_log due to triggers
  -- Archive function is for COPYING to archive only
  -- Actual deletion requires superuser/maintenance window with trigger disabled
  
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON TABLE audit_log IS 'HIPAA-compliant audit log. Append-only, 6-year retention. Contains PHI access/change records.';
COMMENT ON TABLE audit_log_archive IS 'Archive for audit logs older than hot retention window. Same schema and protections as audit_log.';
COMMENT ON COLUMN audit_log.request_id IS 'UUID to correlate multiple audit events from a single API request';
COMMENT ON COLUMN audit_log.success IS 'Outcome indicator for auth/admin actions (true=success, false=failure, null=not applicable)';
COMMENT ON COLUMN audit_log.old_values IS 'Previous values of changed fields (for UPDATE actions)';
COMMENT ON COLUMN audit_log.new_values IS 'New values of changed fields (for UPDATE actions)';
COMMENT ON COLUMN audit_log.changed_fields IS 'List of field names that were modified';
COMMENT ON FUNCTION archive_old_audit_logs IS 'Archives audit logs older than retention_days to audit_log_archive table';
