-- Treatment proposals: client instructions + synced before/after media
ALTER TABLE public.treatment_proposals
  ADD COLUMN IF NOT EXISTS client_instructions TEXT,
  ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.treatment_proposals.client_instructions IS
  'Client-facing care / booking instructions shown on share link and PDF';
COMMENT ON COLUMN public.treatment_proposals.media IS
  'JSON array of before/after (or pair) image objects: {id, kind, url, label?, createdAt}';
