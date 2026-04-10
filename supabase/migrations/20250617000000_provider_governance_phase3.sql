-- ============================================================
-- PROVIDER GOVERNANCE — Phase 3
-- Lot/protocol link, chart audit checklist, emergency response logs
-- Spec: docs/PROVIDER-GOVERNANCE-CLINICAL-OPS-SPEC.md
-- ============================================================

-- ------------------------------------------------------------
-- 1. Lot tracking — link inventory_lots to protocols (safety)
-- ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventory_lots') THEN
    ALTER TABLE public.inventory_lots ADD COLUMN IF NOT EXISTS related_protocol_id UUID REFERENCES public.protocols(protocol_id) ON DELETE SET NULL;
  END IF;
END $$;

COMMENT ON COLUMN public.inventory_lots.related_protocol_id IS 'Optional link to protocol (e.g. hyaluronidase emergency) for safety/lot tracking.';

-- ------------------------------------------------------------
-- 2. Chart audit checklist — workflow and storage
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chart_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id UUID,
  appointment_id UUID,
  audited_by_provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checklist_result JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chart_audits_audit_date ON public.chart_audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_chart_audits_audited_by ON public.chart_audits(audited_by_provider_id);

COMMENT ON TABLE public.chart_audits IS 'Chart audit checklist workflow; who audited, when, checklist result.';

ALTER TABLE public.chart_audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access chart_audits" ON public.chart_audits;
CREATE POLICY "Service role full access chart_audits" ON public.chart_audits FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- 3. Emergency response logs — when emergency protocols used
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emergency_response_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID REFERENCES public.protocols(protocol_id) ON DELETE SET NULL,
  protocol_slug TEXT,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_by_provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  patient_id UUID,
  outcome TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_response_log_used_at ON public.emergency_response_log(used_at);
CREATE INDEX IF NOT EXISTS idx_emergency_response_log_protocol ON public.emergency_response_log(protocol_id);

COMMENT ON TABLE public.emergency_response_log IS 'Log when emergency protocols (e.g. vascular occlusion, hyaluronidase) are used.';

ALTER TABLE public.emergency_response_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access emergency_response_log" ON public.emergency_response_log;
CREATE POLICY "Service role full access emergency_response_log" ON public.emergency_response_log FOR ALL TO service_role USING (true) WITH CHECK (true);
