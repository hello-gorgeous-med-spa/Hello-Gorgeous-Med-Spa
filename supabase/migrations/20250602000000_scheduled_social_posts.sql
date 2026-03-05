-- Scheduled social posts: publish at scheduled_at via cron
CREATE TABLE IF NOT EXISTS scheduled_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  link TEXT,
  image_url TEXT,
  channels TEXT[] NOT NULL DEFAULT '{}',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  results JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_social_posts_due ON scheduled_social_posts(scheduled_at) WHERE status = 'pending';

COMMENT ON TABLE scheduled_social_posts IS 'Social posts to publish at scheduled_at; processed by /api/cron/scheduled-social-posts';
