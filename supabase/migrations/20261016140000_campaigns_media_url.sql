-- Add media_url column to campaigns for MMS support
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS media_url TEXT;

COMMENT ON COLUMN campaigns.media_url IS 'MMS image URL for SMS campaigns';
