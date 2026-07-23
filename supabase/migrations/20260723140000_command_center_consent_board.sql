-- Command Center: staff consent board overrides for today's schedule

CREATE TABLE IF NOT EXISTS public.hg_cc_consent_board (
  appointment_id uuid PRIMARY KEY,
  day date NOT NULL,
  status text NOT NULL DEFAULT 'missing'
    CHECK (status IN ('missing', 'sent', 'signed')),
  form_label text NOT NULL DEFAULT 'Treatment consent',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_consent_board_day
  ON public.hg_cc_consent_board (day);

COMMENT ON TABLE public.hg_cc_consent_board IS
  'Command Center front-desk consent board (Prepare → Mark signed); overlays consent_packets';
