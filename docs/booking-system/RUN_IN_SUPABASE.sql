-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Adds resource_id column for room/device booking
-- ============================================================

-- Step 1: Create resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    resource_type VARCHAR(20) NOT NULL DEFAULT 'room', -- room, device, equipment
    capacity INTEGER DEFAULT 1,
    device_model VARCHAR(200),
    device_serial VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    color_hex VARCHAR(7) DEFAULT '#6B7280',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add resource_id column to appointments (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments' 
        AND column_name = 'resource_id'
    ) THEN
        ALTER TABLE public.appointments ADD COLUMN resource_id UUID;
        ALTER TABLE public.appointments 
            ADD CONSTRAINT fk_appointments_resource 
            FOREIGN KEY (resource_id) 
            REFERENCES public.resources(id) 
            ON DELETE SET NULL;
    END IF;
END $$;

-- Step 3: Create index for performance
CREATE INDEX IF NOT EXISTS idx_appointments_resource ON public.appointments(resource_id);

-- Step 4: Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policy for service role
DROP POLICY IF EXISTS "Service role full access to resources" ON public.resources;
CREATE POLICY "Service role full access to resources" ON public.resources 
    FOR ALL TO service_role USING (true);

-- Step 6: Seed default rooms/devices for Hello Gorgeous Med Spa
INSERT INTO public.resources (name, slug, resource_type, description, color_hex, display_order) VALUES
    ('Treatment Room 1', 'room-1', 'room', 'Main treatment room for injectables and facials', '#EC4899', 1),
    ('Treatment Room 2', 'room-2', 'room', 'Secondary treatment room', '#8B5CF6', 2),
    ('IV Lounge', 'iv-lounge', 'room', 'IV therapy and vitamin injections', '#06B6D4', 3),
    ('Consultation Room', 'consult-room', 'room', 'Private consultations and telehealth', '#10B981', 4),
    ('Morpheus8 Device', 'morpheus8', 'device', 'Inmode Morpheus8 RF Microneedling', '#F59E0B', 5),
    ('CO2 Laser', 'co2-laser', 'device', 'Solaria CO2 Fractional Laser', '#EF4444', 6),
    ('HydraFacial MD', 'hydrafacial', 'device', 'HydraFacial MD Elite', '#3B82F6', 7)
ON CONFLICT (slug) DO NOTHING;

-- Step 7: Refresh schema cache (important!)
NOTIFY pgrst, 'reload schema';

-- Verify it worked:
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name = 'resource_id';
