// ============================================================
// SQUARE WEBHOOK UTILITIES
// Signature verification, event parsing, and idempotency
// ============================================================
// SECURITY:
// - Verify signature with SQUARE_WEBHOOK_SIGNATURE_KEY
// - Deduplicate events via event_id in square_webhook_events table
// - Handlers must be idempotent (same event processed multiple times = same result)
// ============================================================

import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// ============================================================
// TYPES
// ============================================================

export interface SquareWebhookEvent {
  merchant_id: string;
  type: string;
  event_id: string;
  created_at: string;
  data: {
    type: string;
    id: string;
    object: any;
  };
}

export interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
}

export interface EventDeduplicationResult {
  isNew: boolean;
  existingEvent?: {
    event_id: string;
    received_at: string;
    status: string;
  };
}

// ============================================================
// SIGNATURE VERIFICATION
// ============================================================

/**
 * Verify Square webhook signature
 * 
 * Square uses HMAC-SHA256 with the signature in the x-square-hmacsha256-signature header
 * The signature is computed over: webhookUrl + body
 */
export function verifyWebhookSignature(
  signature: string,
  body: string,
  webhookUrl: string
): WebhookVerificationResult {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  
  if (!signatureKey) {
    console.error('SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
    return { valid: false, error: 'Webhook signature key not configured' };
  }
  
  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }

  const trimmed = signature.trim();
  
  try {
    // Square computes: HMAC-SHA256(webhookUrl + body, signatureKey)
    const payload = webhookUrl + body;
    const expectedSignature = crypto
      .createHmac('sha256', signatureKey)
      .update(payload)
      .digest('base64');
    
    // Use timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(trimmed, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, error: 'Invalid signature length' };
    }
    
    const valid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    
    if (!valid) {
      return { valid: false, error: 'Signature mismatch' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Signature verification error:', error);
    return { valid: false, error: 'Signature verification failed' };
  }
}

// ============================================================
// EVENT DEDUPLICATION
// ============================================================

/**
 * Check if event has already been processed AND claim it atomically
 * Primary idempotency guard using event_id
 * 
 * IMPORTANT: This inserts the event_id FIRST (claiming it),
 * then processing happens, then we update status.
 * If insert fails (conflict), another worker already claimed it.
 */
export async function claimWebhookEvent(
  event: SquareWebhookEvent
): Promise<EventDeduplicationResult> {
  const supabase = createServerSupabaseClient();
  
  // Compute payload hash for debugging
  const payloadHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(event))
    .digest('hex');
  
  // Try to INSERT the event_id (atomic claim)
  // If conflict (duplicate), this fails and we know another worker has it
  const { error: insertError } = await supabase
    .from('square_webhook_events')
    .insert({
      event_id: event.event_id,
      event_type: event.type,
      object_id: event.data?.id,
      payload_hash: payloadHash,
      status: 'processing', // Mark as in-progress
      raw_payload: event,
    });
  
  if (insertError) {
    // Check if it's a duplicate key error
    if (insertError.code === '23505') {
      // Duplicate - fetch existing to return info
      const { data: existing } = await supabase
        .from('square_webhook_events')
        .select('event_id, received_at, status')
        .eq('event_id', event.event_id)
        .single();
      
      return { isNew: false, existingEvent: existing || undefined };
    }
    
    // Other error - log but continue (don't block processing)
    console.error('Error claiming webhook event:', insertError);
  }
  
  return { isNew: true };
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use claimWebhookEvent instead
 */
export async function checkEventDuplicate(
  eventId: string
): Promise<EventDeduplicationResult> {
  const supabase = createServerSupabaseClient();
  
  const { data: existing, error } = await supabase
    .from('square_webhook_events')
    .select('event_id, received_at, status')
    .eq('event_id', eventId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking event duplicate:', error);
  }
  
  if (existing) {
    return { isNew: false, existingEvent: existing };
  }
  
  return { isNew: true };
}

/**
 * Update webhook event status after processing
 * Called after claimWebhookEvent to mark final status
 */
export async function updateWebhookEventStatus(
  eventId: string,
  status: 'processed' | 'failed' | 'skipped',
  errorMessage?: string
): Promise<void> {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('square_webhook_events')
    .update({
      status,
      error_message: errorMessage,
      processed_at: status === 'processed' ? new Date().toISOString() : null,
    })
    .eq('event_id', eventId);
  
  if (error) {
    console.error('Error updating webhook event status:', error);
  }
}

/**
 * Record webhook event for idempotency tracking
 * @deprecated Use claimWebhookEvent + updateWebhookEventStatus instead
 */
export async function recordWebhookEvent(
  event: SquareWebhookEvent,
  status: 'processed' | 'failed' | 'skipped' = 'processed',
  errorMessage?: string
): Promise<void> {
  // If event was claimed, just update status
  // If not claimed yet (legacy path), upsert
  const supabase = createServerSupabaseClient();
  
  const payloadHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(event))
    .digest('hex');
  
  const { error } = await supabase
    .from('square_webhook_events')
    .upsert({
      event_id: event.event_id,
      event_type: event.type,
      object_id: event.data?.id,
      payload_hash: payloadHash,
      status,
      error_message: errorMessage,
      processed_at: status === 'processed' ? new Date().toISOString() : null,
      raw_payload: event,
    }, {
      onConflict: 'event_id',
    });
  
  if (error) {
    console.error('Error recording webhook event:', error);
  }
}

// ============================================================
// SECONDARY IDEMPOTENCY GUARDS
// ============================================================

/**
 * Check if terminal checkout update has already been applied
 * Prevents duplicate processing of same checkout status
 */
export async function checkTerminalCheckoutProcessed(
  checkoutId: string,
  newStatus: string
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  
  const { data: checkout } = await supabase
    .from('terminal_checkouts')
    .select('status')
    .eq('square_checkout_id', checkoutId)
    .single();
  
  if (!checkout) return false;
  
  // If already in a final state, don't reprocess
  const finalStates = ['COMPLETED', 'CANCELED', 'FAILED', 'EXPIRED'];
  if (finalStates.includes(checkout.status)) {
    return true; // Already processed to final state
  }
  
  // If the new status is same as current, skip
  if (checkout.status === newStatus) {
    return true;
  }
  
  return false;
}

/**
 * Check if payment has already been recorded
 */
export async function checkPaymentProcessed(
  paymentId: string
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  
  const { data: payment } = await supabase
    .from('sale_payments')
    .select('id, status')
    .eq('square_payment_id', paymentId)
    .single();
  
  if (!payment) return false;
  
  // If payment is already completed, don't reprocess
  return payment.status === 'completed';
}

/**
 * Check if refund has already been recorded
 */
export async function checkRefundProcessed(
  refundId: string
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  
  const { data: refund } = await supabase
    .from('refunds')
    .select('id, status')
    .eq('square_refund_id', refundId)
    .single();
  
  if (!refund) return false;
  
  // If refund is already in final state, don't reprocess
  const finalStates = ['completed', 'failed', 'rejected'];
  return finalStates.includes(refund.status);
}

// ============================================================
// EVENT TYPE HELPERS
// ============================================================

/**
 * Supported webhook event types
 * These are the actual Square event type strings
 */
export const SUPPORTED_EVENT_TYPES = {
  // Terminal events
  TERMINAL_CHECKOUT_CREATED: 'terminal.checkout.created',
  TERMINAL_CHECKOUT_UPDATED: 'terminal.checkout.updated',
  
  // Payment events
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_UPDATED: 'payment.updated',
  PAYMENT_COMPLETED: 'payment.completed', // Convenience alias
  
  // Refund events
  REFUND_CREATED: 'refund.created',
  REFUND_UPDATED: 'refund.updated',
} as const;

/**
 * Check if event type is supported
 */
export function isSupportedEventType(eventType: string): boolean {
  return Object.values(SUPPORTED_EVENT_TYPES).includes(eventType as any);
}

/**
 * Get the object type from event (checkout, payment, refund)
 */
export function getEventObjectType(eventType: string): 'checkout' | 'payment' | 'refund' | 'unknown' {
  if (eventType.startsWith('terminal.checkout')) return 'checkout';
  if (eventType.startsWith('payment')) return 'payment';
  if (eventType.startsWith('refund')) return 'refund';
  return 'unknown';
}

// ============================================================
// WEBHOOK URL HELPER
// ============================================================

/**
 * Webhook URL derived from the **incoming request** (origin + pathname, no query).
 * Square signs with the exact notification URL they POST to — this avoids www / host mismatches
 * when BASE_URL in Vercel differs from the public URL (e.g. hellogorgeousmedspa.com vs www).
 */
export function getSquareWebhookNotificationUrlFromRequest(request: NextRequest): string {
  const u = new URL(request.url);
  let path = u.pathname;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return `${u.origin}${path}`;
}

/**
 * Ordered candidates for HMAC verification. Square includes the **full notification URL**
 * in the signature; it must match the subscription in Developer Dashboard (including www).
 */
export function collectSquareWebhookUrlCandidates(request: NextRequest): string[] {
  const fromRequest = getSquareWebhookNotificationUrlFromRequest(request);
  const explicit = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL?.trim().replace(/\/$/, '');
  const fromEnvBase = getWebhookUrl();

  const raw = [fromRequest, explicit, fromEnvBase].filter((x): x is string => !!x && x.length > 0);

  // If request was http (rare), also try https same host+path (Vercel / proxies)
  const expanded: string[] = [];
  for (const url of raw) {
    expanded.push(url);
    try {
      const u = new URL(url);
      if (u.protocol === 'http:' && u.hostname) {
        expanded.push(`https://${u.hostname}${u.pathname}`);
      }
    } catch {
      /* ignore */
    }
  }

  return [...new Set(expanded)];
}

/**
 * Verify webhook using all plausible notification URLs (request URL first).
 * Prefer fixing SQUARE_WEBHOOK_NOTIFICATION_URL to the exact Dashboard URL if logs show mismatches.
 */
export function verifySquareWebhookSignature(
  request: NextRequest,
  signature: string | null | undefined,
  body: string
): WebhookVerificationResult {
  if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
    console.error('SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
    return { valid: false, error: 'Webhook signature key not configured' };
  }
  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }

  const candidates = collectSquareWebhookUrlCandidates(request);
  for (const url of candidates) {
    const result = verifyWebhookSignature(signature, body, url);
    if (result.valid) {
      return { valid: true };
    }
  }

  return {
    valid: false,
    error: `Signature mismatch (tried ${candidates.length} URL candidate(s)). Set SQUARE_WEBHOOK_NOTIFICATION_URL to the exact URL in Square Dashboard, or align BASE_URL with that host (www vs non-www).`,
  };
}

/**
 * Get the configured webhook URL for signature verification (env-only).
 * Prefer {@link getSquareWebhookNotificationUrlFromRequest} or {@link verifySquareWebhookSignature} in production.
 *
 * CRITICAL: This URL must EXACTLY match what's configured in Square Dashboard.
 */
export function getWebhookUrl(): string {
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // Ensure no trailing slash on baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  return `${cleanBaseUrl}/api/square/webhook`;
}
