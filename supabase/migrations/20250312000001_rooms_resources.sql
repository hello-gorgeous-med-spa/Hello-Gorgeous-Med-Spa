-- ============================================================
-- ROOMS & RESOURCES TABLE
-- For device/room booking and conflict prevention
-- ============================================================

-- Resource types enum
DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM ('room', 'device', 'equipment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Resources/Rooms table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic info
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    resource_type resource_type NOT NULL DEFAULT 'room',
    
    -- For rooms
    capacity INTEGER DEFAULT 1,
    
    -- For devices
    device_model VARCHAR(200),
    device_serial VARCHAR(100),
    maintenance_schedule JSONB, -- { "interval_days": 30, "last_maintenance": "2025-01-01" }
    
    -- Availability
    is_active BOOLEAN DEFAULT true,
    available_hours JSONB, -- { "monday": { "start": "09:00", "end": "18:00" }, ... }
    
    -- Location
    location_id UUID REFERENCES locations(id),
    
    -- Display
    color_hex VARCHAR(7) DEFAULT '#6B7280',
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add room_id to appointments if not exists
DO $$ BEGIN
    ALTER TABLE appointments ADD COLUMN resource_id UUID REFERENCES resources(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Services can require specific resources
DO $$ BEGIN
    ALTER TABLE services ADD COLUMN required_resource_type resource_type;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE services ADD COLUMN allowed_resource_ids UUID[];
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_active ON resources(is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_resource ON appointments(resource_id);

-- RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to resources" ON resources;
CREATE POLICY "Service role full access to resources" ON resources FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Authenticated users can view active resources" ON resources;
CREATE POLICY "Authenticated users can view active resources" ON resources 
    FOR SELECT TO authenticated USING (is_active = true);

-- Seed data for Hello Gorgeous Med Spa
INSERT INTO resources (name, slug, resource_type, description, color_hex, display_order) VALUES
    ('Treatment Room 1', 'room-1', 'room', 'Main treatment room for injectables and facials', '#EC4899', 1),
    ('Treatment Room 2', 'room-2', 'room', 'Secondary treatment room', '#8B5CF6', 2),
    ('IV Lounge', 'iv-lounge', 'room', 'IV therapy and vitamin injections', '#06B6D4', 3),
    ('Consultation Room', 'consult-room', 'room', 'Private consultations and telehealth', '#10B981', 4),
    ('Morpheus8 Device', 'morpheus8', 'device', 'Inmode Morpheus8 RF Microneedling', '#F59E0B', 5),
    ('CO2 Laser', 'co2-laser', 'device', 'Solaria CO2 Fractional Laser', '#EF4444', 6),
    ('HydraFacial MD', 'hydrafacial', 'device', 'HydraFacial MD Elite', '#3B82F6', 7)
ON CONFLICT (slug) DO NOTHING;

-- Function to check resource conflicts
CREATE OR REPLACE FUNCTION check_resource_conflict(
    p_resource_id UUID,
    p_starts_at TIMESTAMPTZ,
    p_ends_at TIMESTAMPTZ,
    p_exclude_appointment_id UUID DEFAULT NULL
) RETURNS TABLE(
    has_conflict BOOLEAN,
    conflicting_appointment_id UUID,
    conflict_details TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        true as has_conflict,
        a.id as conflicting_appointment_id,
        format('Resource already booked from %s to %s', a.starts_at, a.ends_at) as conflict_details
    FROM appointments a
    WHERE a.resource_id = p_resource_id
      AND a.status NOT IN ('cancelled', 'no_show')
      AND a.starts_at < p_ends_at
      AND a.ends_at > p_starts_at
      AND (p_exclude_appointment_id IS NULL OR a.id != p_exclude_appointment_id)
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;
