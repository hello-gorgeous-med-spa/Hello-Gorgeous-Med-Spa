-- ============================================================
-- MIGRATION 009: 2-Way SMS Inbox & Pre-Treatment Instructions
-- ============================================================

-- ============================================================
-- PART 1: SMS Conversations (2-Way Inbox)
-- ============================================================

-- Conversation threads between staff and clients
CREATE TABLE IF NOT EXISTS public.sms_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One conversation per client
  UNIQUE(client_id)
);

-- Individual messages in conversations
CREATE TABLE IF NOT EXISTS public.sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.sms_conversations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  
  -- Message details
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  content TEXT NOT NULL,
  
  -- Sender info (for outbound)
  sent_by_user_id UUID REFERENCES public.users(id),
  sent_by_name VARCHAR(255),
  
  -- Delivery status
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'received')),
  external_id VARCHAR(255), -- Telnyx message ID
  error_message TEXT,
  
  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PART 2: Pre-Treatment Instructions
-- ============================================================

-- Pre-treatment templates (similar to aftercare but sent on booking)
CREATE TABLE IF NOT EXISTS public.pretreatment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  send_via VARCHAR(50) DEFAULT 'email',
  send_delay_hours INT DEFAULT 0, -- 0 = immediately, 24 = day before, 48 = 2 days before
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(service_id)
);

-- Log of sent pre-treatment instructions
CREATE TABLE IF NOT EXISTS public.pretreatment_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  appointment_id UUID REFERENCES public.appointments(id),
  template_id UUID REFERENCES public.pretreatment_templates(id),
  service_name VARCHAR(255),
  sent_via VARCHAR(50),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  content_snapshot TEXT,
  delivery_status VARCHAR(50) DEFAULT 'sent'
);

-- ============================================================
-- PART 3: Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_sms_conversations_client ON public.sms_conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_last_message ON public.sms_conversations(last_message_at DESC);

-- Create indexes only if columns exist (handles schema variations)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_messages' AND column_name = 'conversation_id') THEN
    CREATE INDEX IF NOT EXISTS idx_sms_messages_conversation ON public.sms_messages(conversation_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_messages' AND column_name = 'client_id') THEN
    CREATE INDEX IF NOT EXISTS idx_sms_messages_client ON public.sms_messages(client_id);
  END IF;
END $$;

-- Index on existing column (recipient_client_id from migration 004)
CREATE INDEX IF NOT EXISTS idx_sms_messages_recipient ON public.sms_messages(recipient_client_id);

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sms_messages' AND column_name = 'sent_at') THEN
    CREATE INDEX IF NOT EXISTS idx_sms_messages_sent_at ON public.sms_messages(sent_at DESC);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_pretreatment_templates_service ON public.pretreatment_templates(service_id);
CREATE INDEX IF NOT EXISTS idx_pretreatment_sent_client ON public.pretreatment_sent(client_id);
CREATE INDEX IF NOT EXISTS idx_pretreatment_sent_appointment ON public.pretreatment_sent(appointment_id);

-- ============================================================
-- PART 4: RLS Policies
-- ============================================================

ALTER TABLE public.sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretreatment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretreatment_sent ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "Service role full access to sms_conversations" ON public.sms_conversations;
DROP POLICY IF EXISTS "Service role full access to sms_messages" ON public.sms_messages;
DROP POLICY IF EXISTS "Service role full access to pretreatment_templates" ON public.pretreatment_templates;
DROP POLICY IF EXISTS "Service role full access to pretreatment_sent" ON public.pretreatment_sent;

CREATE POLICY "Service role full access to sms_conversations" ON public.sms_conversations
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access to sms_messages" ON public.sms_messages
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access to pretreatment_templates" ON public.pretreatment_templates
  FOR ALL USING (public.is_service_role());

CREATE POLICY "Service role full access to pretreatment_sent" ON public.pretreatment_sent
  FOR ALL USING (public.is_service_role());

-- ============================================================
-- PART 5: Default Pre-Treatment Template
-- ============================================================

INSERT INTO public.pretreatment_templates (service_id, name, content, send_via, send_delay_hours) VALUES
(NULL, 'General Appointment Prep', E'# Appointment Reminder\n\nHi! Your appointment at Hello Gorgeous Med Spa is coming up.\n\n## Before Your Visit\n- Avoid blood thinners (aspirin, ibuprofen) for 24-48 hours\n- Come with a clean face (no makeup if receiving facial treatments)\n- Stay hydrated\n- Bring your ID and payment method\n\n## Questions?\nCall us at (555) 123-4567\n\nWe look forward to seeing you!', 'email', 24)
ON CONFLICT (service_id) DO NOTHING;

-- ============================================================
-- PART 6: Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the conversation's last_message_at when a new message is added
  UPDATE public.sms_conversations 
  SET last_message_at = NEW.sent_at,
      unread_count = CASE WHEN NEW.direction = 'inbound' THEN unread_count + 1 ELSE unread_count END,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sms_message_added ON public.sms_messages;
CREATE TRIGGER sms_message_added
  AFTER INSERT ON public.sms_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

CREATE OR REPLACE FUNCTION update_pretreatment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pretreatment_templates_updated ON public.pretreatment_templates;
CREATE TRIGGER pretreatment_templates_updated
  BEFORE UPDATE ON public.pretreatment_templates
  FOR EACH ROW EXECUTE FUNCTION update_pretreatment_timestamp();
