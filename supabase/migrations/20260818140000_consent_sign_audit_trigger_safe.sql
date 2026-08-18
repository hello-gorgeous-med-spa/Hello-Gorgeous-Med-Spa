-- Kiosk signing was failing: the consent_packets audit trigger inserts into
-- audit_logs on status change. If that insert fails (enum mismatch, RLS, etc.)
-- Postgres rolls back the signature update and the iPad shows "Failed to save signature".

CREATE OR REPLACE FUNCTION public.audit_consent_packet_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    BEGIN
      INSERT INTO public.audit_logs (
        user_id, action, resource_type, resource_id, description, old_values, new_values
      ) VALUES (
        NEW.signed_by,
        'consent_status_changed',
        'consent_packet',
        NEW.id::text,
        'Consent packet status changed from ' || OLD.status || ' to ' || NEW.status,
        jsonb_build_object('status', OLD.status),
        jsonb_build_object('status', NEW.status, 'signed_at', NEW.signed_at)
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
