-- Blog-to-Social automation: stores generated social posts per blog article
CREATE TABLE IF NOT EXISTS blog_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_slug TEXT NOT NULL,
  blog_title TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('instagram', 'facebook', 'google')),
  message TEXT NOT NULL,
  link TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'posted', 'failed')),
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  post_id TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(blog_slug, channel)
);

ALTER TABLE blog_social_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on blog_social_posts" ON blog_social_posts;
CREATE POLICY "Service role full access on blog_social_posts"
  ON blog_social_posts FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_blog_social_status ON blog_social_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_social_slug ON blog_social_posts(blog_slug);
