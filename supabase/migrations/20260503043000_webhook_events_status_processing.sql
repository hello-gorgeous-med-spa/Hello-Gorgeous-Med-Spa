-- ============================================================
-- Allow 'processing' status on square_webhook_events
-- ============================================================
-- The original CHECK constraint (in 20240101000014_webhook_idempotency.sql)
-- only permitted ('processed', 'failed', 'skipped'). But the application
-- code (lib/square/webhook.ts → claimWebhookEvent) inserts rows with
-- status='processing' to mark in-progress claims, then UPDATEs to a final
-- status after the handler runs.
--
-- The mismatch caused EVERY webhook insert to fail silently with
-- code 23514 (check_violation). The handler swallowed the error and
-- returned 200 to Square, so events appeared "received" but were never
-- recorded. Downstream side-effects (review-request enqueue, terminal
-- checkout sync, etc.) never fired.
--
-- This migration widens the allowed values to include 'processing' so
-- the claim insert succeeds and the rest of the pipeline proceeds.
-- ============================================================

ALTER TABLE square_webhook_events
  DROP CONSTRAINT IF EXISTS square_webhook_events_status_check;

ALTER TABLE square_webhook_events
  ADD CONSTRAINT square_webhook_events_status_check
  CHECK (status IN ('processing', 'processed', 'failed', 'skipped'));
