-- ============================================================
-- AI HUB — Business Memory & Watchdog (in-house, no Boots AI)
-- ============================================================

-- Business Memory: searchable knowledge that YOUR business owns
-- Feeds AI agents (chat, future voice receptionist)
CREATE TABLE IF NOT EXISTS ai_business_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'faq', -- faq | policy | document | service_info
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_business_memory_type ON ai_business_memory(type);
CREATE INDEX IF NOT EXISTS idx_ai_business_memory_updated ON ai_business_memory(updated_at DESC);

COMMENT ON TABLE ai_business_memory IS 'In-house knowledge base for AI; you own this data.';

-- AI Watchdog: audit trail and compliance monitoring
-- Logs AI responses; flags risk or non-compliance
CREATE TABLE IF NOT EXISTS ai_watchdog_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,           -- e.g. 'ai_chat', 'voice_receptionist', 'sms_bot'
  channel TEXT,                   -- e.g. 'web', 'voice', 'sms'
  request_summary TEXT,           -- sanitized summary of user input
  response_summary TEXT,          -- summary of AI response
  full_response_preview TEXT,     -- first 500 chars of response for audit
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,               -- e.g. 'non_compliance', 'pii_risk', 'off_brand'
  metadata JSONB DEFAULT '{}',    -- extra context
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_watchdog_logs_source ON ai_watchdog_logs(source);
CREATE INDEX IF NOT EXISTS idx_ai_watchdog_logs_flagged ON ai_watchdog_logs(flagged) WHERE flagged = true;
CREATE INDEX IF NOT EXISTS idx_ai_watchdog_logs_created ON ai_watchdog_logs(created_at DESC);

COMMENT ON TABLE ai_watchdog_logs IS 'Audit trail for AI; monitors behavior and compliance.';
