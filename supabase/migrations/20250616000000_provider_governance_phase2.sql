-- ============================================================
-- PROVIDER GOVERNANCE — Phase 2 (export requests, offboard/backup columns)
-- Spec: docs/PROVIDER-GOVERNANCE-CLINICAL-OPS-SPEC.md
-- ============================================================

-- ------------------------------------------------------------
-- 1. Extend providers for offboarding and backup
-- ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'providers') THEN
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS offboarded_at TIMESTAMPTZ;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS non_solicit_until DATE;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS is_backup_candidate BOOLEAN DEFAULT false;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS emergency_activation_flag BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ------------------------------------------------------------
-- 2. export_requests (pending owner-approved exports)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('patient_list', 'chart_export', 'report', 'marketing_list', 'photo_library')),
  scope JSONB,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  approved_by UUID,
  denied_by UUID,
  resolved_at TIMESTAMPTZ,
  result_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_export_requests_status ON public.export_requests(status);
CREATE INDEX IF NOT EXISTS idx_export_requests_created ON public.export_requests(created_at);

COMMENT ON TABLE public.export_requests IS 'Export requests require super_owner approval; all logged.';

ALTER TABLE public.export_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access export_requests" ON public.export_requests;
CREATE POLICY "Service role full access export_requests" ON public.export_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
