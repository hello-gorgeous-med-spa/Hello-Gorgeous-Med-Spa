-- Laura's Desk: schedulable meetings / outreach tasks (Chamber, businesses, etc.)

CREATE TABLE IF NOT EXISTS public.hg_cc_laura_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date,
  title text NOT NULL,
  org_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'meeting'
    CHECK (category IN ('meeting', 'outreach', 'chamber', 'follow_up', 'content', 'other')),
  scheduled_at timestamptz,
  location_or_link text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  outcome text NOT NULL DEFAULT '',
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_laura_tasks_scheduled
  ON public.hg_cc_laura_tasks (scheduled_at ASC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_hg_cc_laura_tasks_week
  ON public.hg_cc_laura_tasks (week_start DESC, status);

CREATE INDEX IF NOT EXISTS idx_hg_cc_laura_tasks_status
  ON public.hg_cc_laura_tasks (status, scheduled_at ASC NULLS LAST);

COMMENT ON TABLE public.hg_cc_laura_tasks IS
  'Command Center Laura Desk — meetings, Chamber, business outreach, follow-ups';
