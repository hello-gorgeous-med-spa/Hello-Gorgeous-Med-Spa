-- Command Center: Laura's Desk + owner notifications

CREATE TABLE IF NOT EXISTS public.hg_cc_laura_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  task text NOT NULL,
  hrs numeric(6,2) NOT NULL CHECK (hrs > 0 AND hrs <= 24),
  logged_on text NOT NULL DEFAULT 'Today',
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_laura_hours_week
  ON public.hg_cc_laura_hours (week_start DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS public.hg_cc_laura_weeks (
  week_start date PRIMARY KEY,
  checks jsonb NOT NULL DEFAULT '{}'::jsonb,
  invoice_submitted boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

CREATE TABLE IF NOT EXISTS public.hg_cc_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body text NOT NULL,
  delivery text NOT NULL DEFAULT '',
  unread boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_notifications_created
  ON public.hg_cc_notifications (created_at DESC);

COMMENT ON TABLE public.hg_cc_laura_hours IS 'Command Center Laura Desk weekly hours log';
COMMENT ON TABLE public.hg_cc_laura_weeks IS 'Command Center Laura Desk week checklist + invoice flag';
COMMENT ON TABLE public.hg_cc_notifications IS 'Command Center owner notification feed';
