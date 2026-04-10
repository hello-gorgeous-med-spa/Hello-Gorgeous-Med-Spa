-- Video Library: Stores all generated marketing videos
CREATE TABLE IF NOT EXISTS video_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('vertical', 'square', 'horizontal')),
  url TEXT,
  caption TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  file_size BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rendering', 'completed', 'failed')),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_video_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_video_library_updated_at
  BEFORE UPDATE ON video_library
  FOR EACH ROW
  EXECUTE FUNCTION update_video_library_updated_at();

-- Indexes
CREATE INDEX idx_video_library_service ON video_library(service);
CREATE INDEX idx_video_library_created_at ON video_library(created_at DESC);
CREATE INDEX idx_video_library_status ON video_library(status);

-- Enable RLS
ALTER TABLE video_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations for authenticated users
DROP POLICY IF EXISTS "video_library_all_access" ON video_library;
CREATE POLICY "video_library_all_access" ON video_library
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE video_library IS 'Stores all generated marketing videos for the med spa';
