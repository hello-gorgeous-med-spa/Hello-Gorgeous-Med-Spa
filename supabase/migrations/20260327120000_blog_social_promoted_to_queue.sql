-- Track when an approved blog_social_posts row was queued for scheduled_social_posts (cron publisher)
ALTER TABLE blog_social_posts
  ADD COLUMN IF NOT EXISTS promoted_to_queue_at TIMESTAMPTZ;

COMMENT ON COLUMN blog_social_posts.promoted_to_queue_at IS
  'Set when copied into scheduled_social_posts for /api/cron/scheduled-social-posts';

CREATE INDEX IF NOT EXISTS idx_blog_social_promote
  ON blog_social_posts (status)
  WHERE promoted_to_queue_at IS NULL AND status = 'approved';
