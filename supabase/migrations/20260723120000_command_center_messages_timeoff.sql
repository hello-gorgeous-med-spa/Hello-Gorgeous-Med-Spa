-- Command Center: staff broadcast messages + time-off requests

CREATE TABLE IF NOT EXISTS public.hg_cc_staff_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_name text NOT NULL,
  to_name text NOT NULL,
  body text NOT NULL,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_staff_messages_created
  ON public.hg_cc_staff_messages (created_at DESC);

CREATE TABLE IF NOT EXISTS public.hg_cc_time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  who text NOT NULL,
  type text NOT NULL DEFAULT 'Vacation'
    CHECK (type IN ('Vacation', 'Sick', 'Personal', 'Other')),
  start_date date NOT NULL,
  end_date date,
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied')),
  decided_by text,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_time_off_status
  ON public.hg_cc_time_off (status, created_at DESC);

COMMENT ON TABLE public.hg_cc_staff_messages IS 'Command Center Team Hub staff broadcast messages';
COMMENT ON TABLE public.hg_cc_time_off IS 'Command Center Team Hub time-off requests';
