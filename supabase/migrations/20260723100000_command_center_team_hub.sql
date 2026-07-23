-- Command Center: Team Hub tasks + daily ops checklist

CREATE TABLE IF NOT EXISTS public.hg_cc_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  cat text NOT NULL DEFAULT 'task'
    CHECK (cat IN ('call', 'order', 'rx', 'fax', 'task')),
  due text NOT NULL DEFAULT 'today'
    CHECK (due IN ('today', 'tomorrow', 'week')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'on_it', 'done')),
  assigned_to text NOT NULL DEFAULT '',
  created_by text NOT NULL DEFAULT '',
  created_by_user_id text,
  remind_at text
    CHECK (remind_at IS NULL OR remind_at IN ('9am', 'lunch', '2pm', 'eod', 'none')),
  remind_state text NOT NULL DEFAULT 'none'
    CHECK (remind_state IN ('none', 'set', 'due', 'snoozed', 'done')),
  remind_due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_tasks_status_updated
  ON public.hg_cc_tasks (status, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.hg_cc_task_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.hg_cc_tasks(id) ON DELETE CASCADE,
  author text NOT NULL,
  author_user_id text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hg_cc_task_messages_task
  ON public.hg_cc_task_messages (task_id, created_at ASC);

CREATE TABLE IF NOT EXISTS public.hg_cc_checklist_days (
  day date PRIMARY KEY,
  checks jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

COMMENT ON TABLE public.hg_cc_tasks IS 'Command Center Team Hub shared tasks';
COMMENT ON TABLE public.hg_cc_checklist_days IS 'Command Center daily ops checklist state (resets by date)';
