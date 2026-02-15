-- ============================================================
-- CLIENT PORTAL - Part 2: Documents & Consents
-- ============================================================

-- Client Documents
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes INTEGER,
  mime_type VARCHAR(100),
  appointment_id UUID,
  category VARCHAR(50),
  tags TEXT[],
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  is_downloadable BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_docs_client ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_docs_type ON client_documents(document_type);

-- Consent Submissions
CREATE TABLE IF NOT EXISTS consent_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consent_form_id UUID NOT NULL,
  appointment_id UUID,
  form_type VARCHAR(50) NOT NULL,
  form_version VARCHAR(20) DEFAULT '1.0',
  form_data JSONB NOT NULL DEFAULT '{}',
  signature_data TEXT,
  signature_typed VARCHAR(255),
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_ip VARCHAR(45),
  pdf_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_client ON consent_submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_consent_status ON consent_submissions(status);

-- RLS
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role docs" ON client_documents;
CREATE POLICY "Service role docs" ON client_documents FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role consent" ON consent_submissions;
CREATE POLICY "Service role consent" ON consent_submissions FOR ALL TO service_role USING (true);
