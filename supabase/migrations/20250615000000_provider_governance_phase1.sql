-- ============================================================
-- PROVIDER GOVERNANCE + CLINICAL OPS — Phase 1
-- Spec: docs/PROVIDER-GOVERNANCE-CLINICAL-OPS-SPEC.md
-- Adds: provider governance columns, provider_documents, protocols,
--       standing_orders, compensation_records, financial_permissions,
--       business_assets. Owner control first, provider access second.
-- ============================================================

-- ------------------------------------------------------------
-- 1. EXTEND providers (add columns if missing)
-- ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'providers') THEN
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS license_type TEXT;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS license_number TEXT;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS npi TEXT;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS dea TEXT;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS classification TEXT;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS ownership_status TEXT DEFAULT 'none';
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS start_date DATE;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS end_date DATE;
    ALTER TABLE public.providers DROP CONSTRAINT IF EXISTS providers_ownership_status_check;
    ALTER TABLE public.providers ADD CONSTRAINT providers_ownership_status_check
      CHECK (ownership_status IS NULL OR ownership_status IN ('none', 'owner', 'partner', 'shareholder', 'member'));
  END IF;
END $$;

-- ------------------------------------------------------------
-- 2. provider_documents
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.provider_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN (
    'medical_director_agreement', 'license', 'malpractice', 'npi',
    'dea_if_applicable', 'confidentiality', 'protocol_acknowledgment', 'non_solicit'
  )),
  file_url TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  expiration_date DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_documents_provider ON public.provider_documents(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_documents_type ON public.provider_documents(doc_type);
CREATE INDEX IF NOT EXISTS idx_provider_documents_expiration ON public.provider_documents(expiration_date) WHERE expiration_date IS NOT NULL;

COMMENT ON TABLE public.provider_documents IS 'Provider credential and agreement documents; required types per spec.';

-- ------------------------------------------------------------
-- 3. protocols
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.protocols (
  protocol_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  approved_by_provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  approval_date DATE,
  review_due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_protocols_status ON public.protocols(status);
CREATE INDEX IF NOT EXISTS idx_protocols_review_due ON public.protocols(review_due_date);

COMMENT ON TABLE public.protocols IS 'Versioned clinical protocols; approval by medical director.';

-- ------------------------------------------------------------
-- 4. standing_orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.standing_orders (
  standing_order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  review_due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'superseded')),
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_standing_orders_provider ON public.standing_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_standing_orders_review_due ON public.standing_orders(review_due_date);

COMMENT ON TABLE public.standing_orders IS 'Provider-specific standing orders; review-dated.';

-- ------------------------------------------------------------
-- 5. compensation_records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.compensation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  oversight_fee INTEGER NOT NULL DEFAULT 0,
  personally_performed_gross_sales INTEGER NOT NULL DEFAULT 0,
  production_rate NUMERIC(5,4) NOT NULL DEFAULT 0,
  production_compensation INTEGER NOT NULL DEFAULT 0,
  total_compensation INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, month)
);

CREATE INDEX IF NOT EXISTS idx_compensation_records_provider ON public.compensation_records(provider_id);
CREATE INDEX IF NOT EXISTS idx_compensation_records_month ON public.compensation_records(month);

COMMENT ON TABLE public.compensation_records IS 'Oversight fee + personally performed only; no profit-share for non-owners.';

-- ------------------------------------------------------------
-- 6. financial_permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL UNIQUE REFERENCES public.providers(id) ON DELETE CASCADE,
  bank_access BOOLEAN DEFAULT false,
  vendor_ordering BOOLEAN DEFAULT false,
  refund_authority BOOLEAN DEFAULT false,
  contract_authority BOOLEAN DEFAULT false,
  pricing_authority BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_financial_permissions_provider ON public.financial_permissions(provider_id);

COMMENT ON TABLE public.financial_permissions IS 'Default all false; only super_owner may grant bank_access, contract_authority.';

-- ------------------------------------------------------------
-- 7. business_assets (asset registry)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT NOT NULL CHECK (asset_type IN (
    'device', 'domain', 'social_account', 'vendor_account', 'treatment_protocol',
    'website', 'photography_library', 'marketing_asset', 'product_inventory_account'
  )),
  name TEXT NOT NULL,
  owner_entity TEXT NOT NULL DEFAULT 'Hello Gorgeous Med Spa',
  reference_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_assets_type ON public.business_assets(asset_type);

COMMENT ON TABLE public.business_assets IS 'All assets default owner = Hello Gorgeous Med Spa.';

-- ------------------------------------------------------------
-- 8. audit_logs extension (if not exists, ensure export/ownership actions are loggable)
-- Use existing audit table or create minimal events for governance
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.governance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  actor_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_governance_audit_action ON public.governance_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_governance_audit_created ON public.governance_audit_log(created_at);

COMMENT ON TABLE public.governance_audit_log IS 'Export, compensation, protocol, ownership changes for provider governance.';

-- ------------------------------------------------------------
-- 9. RLS (enable; policies can be tightened per role)
-- ------------------------------------------------------------
ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standing_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compensation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_audit_log ENABLE ROW LEVEL SECURITY;

-- Placeholder policies: service_role and authenticated read for now; tighten in Phase 2
DROP POLICY IF EXISTS "Service role full access provider_documents" ON public.provider_documents;
CREATE POLICY "Service role full access provider_documents" ON public.provider_documents FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access protocols" ON public.protocols;
CREATE POLICY "Service role full access protocols" ON public.protocols FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access standing_orders" ON public.standing_orders;
CREATE POLICY "Service role full access standing_orders" ON public.standing_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access compensation_records" ON public.compensation_records;
CREATE POLICY "Service role full access compensation_records" ON public.compensation_records FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access financial_permissions" ON public.financial_permissions;
CREATE POLICY "Service role full access financial_permissions" ON public.financial_permissions FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access business_assets" ON public.business_assets;
CREATE POLICY "Service role full access business_assets" ON public.business_assets FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access governance_audit_log" ON public.governance_audit_log;
CREATE POLICY "Service role full access governance_audit_log" ON public.governance_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);
