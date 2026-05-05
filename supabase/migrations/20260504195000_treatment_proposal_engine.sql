-- ============================================================
-- Treatment Proposal Builder - Phase 1 foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS public.services_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL,
  unit TEXT DEFAULT 'per session',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.discount_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'dollar_amount')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value >= 0),
  applicable_services TEXT[] DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.treatment_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_id TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'sent', 'viewed', 'accepted', 'expired')
  ),
  concerns TEXT[] DEFAULT '{}',
  options JSONB NOT NULL,
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  accepted_at TIMESTAMPTZ,
  accepted_option TEXT,
  internal_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_treatment_proposals_created_at
  ON public.treatment_proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_treatment_proposals_status
  ON public.treatment_proposals(status);
CREATE INDEX IF NOT EXISTS idx_services_catalog_category
  ON public.services_catalog(category);

CREATE OR REPLACE FUNCTION public.touch_treatment_proposal_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_treatment_proposals_updated_at ON public.treatment_proposals;
CREATE TRIGGER tr_treatment_proposals_updated_at
  BEFORE UPDATE ON public.treatment_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_treatment_proposal_updated_at();

DROP TRIGGER IF EXISTS tr_services_catalog_updated_at ON public.services_catalog;
CREATE TRIGGER tr_services_catalog_updated_at
  BEFORE UPDATE ON public.services_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_treatment_proposal_updated_at();

DROP TRIGGER IF EXISTS tr_discount_packages_updated_at ON public.discount_packages;
CREATE TRIGGER tr_discount_packages_updated_at
  BEFORE UPDATE ON public.discount_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_treatment_proposal_updated_at();

ALTER TABLE public.treatment_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff read treatment_proposals" ON public.treatment_proposals;
CREATE POLICY "Staff read treatment_proposals"
  ON public.treatment_proposals
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

DROP POLICY IF EXISTS "Staff write treatment_proposals" ON public.treatment_proposals;
CREATE POLICY "Staff write treatment_proposals"
  ON public.treatment_proposals
  FOR ALL
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

DROP POLICY IF EXISTS "Staff read services_catalog" ON public.services_catalog;
CREATE POLICY "Staff read services_catalog"
  ON public.services_catalog
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

DROP POLICY IF EXISTS "Staff write services_catalog" ON public.services_catalog;
CREATE POLICY "Staff write services_catalog"
  ON public.services_catalog
  FOR ALL
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

DROP POLICY IF EXISTS "Staff read discount_packages" ON public.discount_packages;
CREATE POLICY "Staff read discount_packages"
  ON public.discount_packages
  FOR SELECT
  TO authenticated
  USING (public.is_org_staff());

DROP POLICY IF EXISTS "Staff write discount_packages" ON public.discount_packages;
CREATE POLICY "Staff write discount_packages"
  ON public.discount_packages
  FOR ALL
  TO authenticated
  USING (public.is_org_staff())
  WITH CHECK (public.is_org_staff());

GRANT ALL ON public.treatment_proposals TO service_role;
GRANT ALL ON public.services_catalog TO service_role;
GRANT ALL ON public.discount_packages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.treatment_proposals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services_catalog TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_packages TO authenticated;
