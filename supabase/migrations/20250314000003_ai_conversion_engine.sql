-- AI Conversion Engine: Self-Optimizing Campaign Intelligence
-- This system learns what converts to bookings and improves future campaigns

-- Social Posts: Track every published post
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns_library(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'youtube')),
  post_id TEXT,
  post_url TEXT,
  caption TEXT,
  hook TEXT,
  visual_style TEXT,
  hashtags TEXT[] DEFAULT '{}',
  service TEXT,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaign Metrics: Store performance data from platforms
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns_library(id) ON DELETE SET NULL,
  social_post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  post_id TEXT,
  
  -- Engagement metrics
  views INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  
  -- Conversion metrics
  link_clicks INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  
  -- Calculated scores
  engagement_rate FLOAT DEFAULT 0,
  conversion_rate FLOAT DEFAULT 0,
  
  -- Timing
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Recommendations: Store optimization insights
CREATE TABLE IF NOT EXISTS campaign_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  
  -- AI-generated recommendations
  recommended_hooks TEXT[] DEFAULT '{}',
  recommended_hashtags TEXT[] DEFAULT '{}',
  recommended_captions TEXT[] DEFAULT '{}',
  best_posting_times TEXT[] DEFAULT '{}',
  best_visual_style TEXT,
  best_caption_style TEXT,
  
  -- Performance data used for analysis
  campaigns_analyzed INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  avg_engagement_rate FLOAT DEFAULT 0,
  
  -- Analysis metadata
  analysis_notes TEXT,
  confidence_score FLOAT DEFAULT 0,
  
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Booking Attribution: Track which campaigns generate bookings
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS campaign_id UUID;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign ON social_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_service ON social_posts(service);
CREATE INDEX IF NOT EXISTS idx_social_posts_posted_at ON social_posts(posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign ON campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_platform ON campaign_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_engagement ON campaign_metrics(engagement_rate DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_fetched ON campaign_metrics(fetched_at DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_service ON campaign_recommendations(service);
CREATE INDEX IF NOT EXISTS idx_recommendations_generated ON campaign_recommendations(generated_at DESC);

-- Enable RLS
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "social_posts_all_access" ON social_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "campaign_metrics_all_access" ON campaign_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "recommendations_all_access" ON campaign_recommendations FOR ALL USING (true) WITH CHECK (true);

-- Function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.views > 0 THEN
    NEW.engagement_rate := (NEW.likes + NEW.comments + NEW.shares + NEW.saves)::FLOAT / NEW.views;
  END IF;
  IF NEW.clicks > 0 THEN
    NEW.conversion_rate := NEW.bookings::FLOAT / NEW.clicks;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_engagement
  BEFORE INSERT OR UPDATE ON campaign_metrics
  FOR EACH ROW
  EXECUTE FUNCTION calculate_engagement_rate();

COMMENT ON TABLE social_posts IS 'Tracks all published social media posts for analytics';
COMMENT ON TABLE campaign_metrics IS 'Stores performance metrics from social platforms';
COMMENT ON TABLE campaign_recommendations IS 'AI-generated optimization recommendations per service';
