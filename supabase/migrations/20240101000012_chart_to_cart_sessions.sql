-- Chart-to-Cart treatment sessions (what is charted is what is charged)
-- Persists to client profile and drives Active Sessions list

CREATE TABLE IF NOT EXISTS chart_to_cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  client_name TEXT,
  provider TEXT DEFAULT 'Staff',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'ready_to_checkout', 'completed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  treatment_summary TEXT,
  products JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  paperwork JSONB DEFAULT '{"consents": false, "questionnaires": false}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chart_to_cart_sessions_client ON chart_to_cart_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_chart_to_cart_sessions_status ON chart_to_cart_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chart_to_cart_sessions_started ON chart_to_cart_sessions(started_at DESC);

ALTER TABLE chart_to_cart_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chart_to_cart_sessions_select" ON chart_to_cart_sessions;
CREATE POLICY "chart_to_cart_sessions_select" ON chart_to_cart_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "chart_to_cart_sessions_insert" ON chart_to_cart_sessions;
CREATE POLICY "chart_to_cart_sessions_insert" ON chart_to_cart_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "chart_to_cart_sessions_update" ON chart_to_cart_sessions;
CREATE POLICY "chart_to_cart_sessions_update" ON chart_to_cart_sessions FOR UPDATE USING (true);

COMMENT ON TABLE chart_to_cart_sessions IS 'Chart-to-Cart treatment sessions; linked to client profile';
