-- One consent visit uses one wizard/kiosk link for every form in the packet.
-- UNIQUE on wizard_token blocked HIPAA + arbitration + liability + general on the iPad.

ALTER TABLE public.consent_packets
  DROP CONSTRAINT IF EXISTS consent_packets_wizard_token_key;
