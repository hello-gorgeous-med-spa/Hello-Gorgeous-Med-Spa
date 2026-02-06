-- ============================================================
-- PROVIDER SCHEDULES TABLE
-- Controls when providers are available for booking
-- ============================================================

-- Create provider_schedules table
CREATE TABLE IF NOT EXISTS provider_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  is_working BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, day_of_week)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_provider_schedules_provider_day 
  ON provider_schedules(provider_id, day_of_week);

-- Enable RLS
ALTER TABLE provider_schedules ENABLE ROW LEVEL SECURITY;

-- Policies: Staff can read, admins/owners can modify
CREATE POLICY "Staff can view schedules"
  ON provider_schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schedules"
  ON provider_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- Service role bypass
CREATE POLICY "Service role full access to schedules"
  ON provider_schedules FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to seed default schedules for a provider
CREATE OR REPLACE FUNCTION seed_provider_default_schedule(p_provider_id UUID)
RETURNS void AS $$
BEGIN
  -- Insert default schedules (Mon-Fri 9-5, weekends off)
  INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, is_working)
  VALUES
    (p_provider_id, 0, NULL, NULL, false),           -- Sunday off
    (p_provider_id, 1, '09:00', '17:00', true),       -- Monday
    (p_provider_id, 2, '09:00', '17:00', true),       -- Tuesday  
    (p_provider_id, 3, '09:00', '17:00', true),       -- Wednesday
    (p_provider_id, 4, '09:00', '17:00', true),       -- Thursday
    (p_provider_id, 5, '09:00', '17:00', true),       -- Friday
    (p_provider_id, 6, NULL, NULL, false)             -- Saturday off
  ON CONFLICT (provider_id, day_of_week) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create schedules when a provider is created
CREATE OR REPLACE FUNCTION auto_create_provider_schedule()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM seed_provider_default_schedule(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_provider_schedule_trigger ON providers;
CREATE TRIGGER create_provider_schedule_trigger
  AFTER INSERT ON providers
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_provider_schedule();

-- Seed schedules for all existing providers who don't have them
DO $$
DECLARE
  provider_record RECORD;
BEGIN
  FOR provider_record IN 
    SELECT p.id 
    FROM providers p
    WHERE NOT EXISTS (
      SELECT 1 FROM provider_schedules ps 
      WHERE ps.provider_id = p.id
    )
  LOOP
    PERFORM seed_provider_default_schedule(provider_record.id);
  END LOOP;
END $$;

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Provider schedules table created and seeded successfully';
END $$;
