-- ============================================================
-- FIX APPOINTMENT COLUMNS
-- Ensure all columns used by APIs exist
-- ============================================================

-- First, create appointments table if it doesn't exist at all
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID,
  provider_id UUID,
  service_id UUID,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  client_notes TEXT,
  provider_notes TEXT,
  internal_notes TEXT,
  source VARCHAR(100),
  booking_source VARCHAR(100),
  booked_by UUID,
  cancelled_by UUID,
  cancel_reason TEXT,
  cancellation_reason TEXT,
  no_show_reason TEXT,
  checked_in_at TIMESTAMPTZ,
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to appointments table (safe - IF NOT EXISTS)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
    -- Core columns
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS client_id UUID;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS provider_id UUID;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS service_id UUID;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'scheduled';
    
    -- Notes columns (support ALL names for compatibility)
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS client_notes TEXT;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS provider_notes TEXT;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS internal_notes TEXT;
    
    -- Booking source columns (support both names)
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS source VARCHAR(100);
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS booking_source VARCHAR(100);
    
    -- Cancellation/no-show columns (support all variants)
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS no_show_reason TEXT;
    
    -- Time tracking columns (support all variants)
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS check_in_at TIMESTAMPTZ;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS check_out_at TIMESTAMPTZ;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
    
    -- Other useful columns
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS booked_by UUID;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS cancelled_by UUID;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON public.appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON public.appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_starts_at ON public.appointments(starts_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access to appointments" ON public.appointments;
CREATE POLICY "Service role full access to appointments" ON public.appointments 
  FOR ALL USING (true) WITH CHECK (true);

-- Also fix consent_templates if needed
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consent_templates') THEN
    ALTER TABLE public.consent_templates ADD COLUMN IF NOT EXISTS form_type VARCHAR(100);
  END IF;
END $$;

-- Fix clients table - ensure it has all needed columns
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS user_id UUID;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS date_of_birth DATE;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS accepts_sms_marketing BOOLEAN DEFAULT false;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Fix providers table - ensure it has all needed columns  
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'providers') THEN
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS user_id UUID;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS credentials VARCHAR(50);
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS color_hex VARCHAR(10);
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Fix services table - ensure it has all needed columns
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') THEN
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_cents INTEGER;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'All columns fixed successfully';
END $$;
