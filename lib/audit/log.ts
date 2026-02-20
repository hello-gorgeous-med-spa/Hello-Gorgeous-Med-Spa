// ============================================================
// HIPAA AUDIT LOGGING UTILITY
// Server-side only - single entry point for all audit events
// ============================================================
// SECURITY:
// - Runs server-side only (API routes/server actions)
// - Automatically enriches with actor, IP, user agent
// - Filters PHI from logged data using allowlists
// - Never logs to third-party services (Sentry, etc.)
// ============================================================

import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// TYPES
// ============================================================

export type AuditAction =
  // Record access
  | 'VIEW'
  | 'LIST'
  | 'SEARCH'
  | 'EXPORT'
  | 'PRINT'
  // Record changes
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ARCHIVE'
  | 'RESTORE'
  // Authentication
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_PASSWORD_CHANGED'
  | 'AUTH_PASSWORD_RESET_REQUESTED'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_MFA_ENABLED'
  | 'AUTH_MFA_DISABLED'
  // Admin actions
  | 'ADMIN_USER_CREATED'
  | 'ADMIN_USER_DISABLED'
  | 'ADMIN_USER_ENABLED'
  | 'ADMIN_ROLE_CHANGED'
  | 'ADMIN_PERMISSION_CHANGED'
  | 'ADMIN_SETTINGS_CHANGED'
  | 'ADMIN_INTEGRATION_CONNECTED'
  | 'ADMIN_INTEGRATION_DISCONNECTED'
  // Financial
  | 'PAYMENT_PROCESSED'
  | 'REFUND_CREATED'
  | 'REFUND_PROCESSED';

export type AuditEntityType =
  | 'client'
  | 'appointment'
  | 'clinical_note'
  | 'chart'
  | 'treatment'
  | 'consent'
  | 'photo'
  | 'document'
  | 'user'
  | 'staff'
  | 'settings'
  | 'integration'
  | 'payment'
  | 'refund'
  | 'sale'
  | 'session'
  | 'export';

export interface AuditEventParams {
  entityType: AuditEntityType;
  entityId?: string;
  action: AuditAction;
  details?: Record<string, unknown>;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  changedFields?: string[];
  success?: boolean;
  actorId?: string;
  actorType?: 'user' | 'system' | 'api';
  requestId?: string;
  sessionId?: string;
}

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  user_id: string | null;  // Maps to user_id column in DB
  user_email: string | null;
  user_role: string | null;
  actor_type: string;
  details: Record<string, unknown> | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  changed_fields: string[] | null;
  success: boolean | null;
  request_id: string | null;
  session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  resource_path: string | null;
  created_at: string;
}

// ============================================================
// PHI FIELD ALLOWLISTS
// Only these fields can be logged for each entity type
// Everything else is filtered out to prevent PHI leakage
// ============================================================

const PHI_SAFE_FIELDS: Record<string, string[]> = {
  client: ['id', 'status', 'created_at', 'updated_at', 'membership_status'],
  appointment: ['id', 'status', 'appointment_date', 'duration', 'provider_id', 'service_id', 'created_at', 'updated_at'],
  clinical_note: ['id', 'status', 'note_type', 'signed_at', 'locked_at', 'provider_id', 'created_at', 'updated_at'],
  chart: ['id', 'status', 'chart_type', 'provider_id', 'created_at', 'updated_at'],
  treatment: ['id', 'status', 'treatment_type', 'provider_id', 'created_at', 'updated_at'],
  consent: ['id', 'status', 'consent_type', 'signed_at', 'expires_at', 'created_at'],
  photo: ['id', 'photo_type', 'category', 'created_at'],
  document: ['id', 'document_type', 'status', 'created_at'],
  user: ['id', 'role', 'status', 'created_at', 'updated_at', 'last_login_at'],
  staff: ['id', 'role', 'status', 'created_at', 'updated_at'],
  settings: ['key', 'updated_at'],
  integration: ['id', 'type', 'status', 'environment', 'connected_at'],
  payment: ['id', 'status', 'amount', 'payment_method', 'processor', 'created_at'],
  refund: ['id', 'status', 'amount', 'reason_category', 'created_at'],
  sale: ['id', 'status', 'total', 'created_at'],
  session: ['id', 'status', 'created_at', 'expires_at'],
  export: ['id', 'export_type', 'record_count', 'created_at'],
};

// Fields that should NEVER be logged (PHI)
const PHI_BLOCKED_FIELDS = [
  'first_name', 'last_name', 'name', 'full_name',
  'email', 'phone', 'mobile', 'telephone',
  'address', 'street', 'city', 'state', 'zip', 'postal_code',
  'dob', 'date_of_birth', 'birth_date', 'ssn', 'social_security',
  'medical_history', 'diagnosis', 'condition', 'symptoms',
  'note_content', 'clinical_notes', 'treatment_notes', 'provider_notes',
  'password', 'password_hash', 'token', 'secret', 'api_key',
  'credit_card', 'card_number', 'cvv', 'expiry',
  'insurance_id', 'policy_number', 'member_id',
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get Supabase client with service role (for audit inserts)
 * Returns null if not configured (audit logging will be skipped)
 */
function getAuditSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  try {
    return createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

/**
 * Extract client IP from request headers
 */
async function getClientIP(): Promise<string | null> {
  try {
    const headersList = await headers();
    return (
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      headersList.get('cf-connecting-ip') ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Extract user agent from request headers
 */
async function getUserAgent(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get('user-agent') || null;
  } catch {
    return null;
  }
}

/**
 * Get current request path
 */
async function getResourcePath(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get('x-invoke-path') || headersList.get('x-matched-path') || null;
  } catch {
    return null;
  }
}

/**
 * Filter object to only include allowlisted fields
 * Removes any PHI that shouldn't be logged
 */
export function filterPHI(
  data: Record<string, unknown> | null | undefined,
  entityType: string
): Record<string, unknown> | null {
  if (!data) return null;
  
  const allowlist = PHI_SAFE_FIELDS[entityType] || [];
  const filtered: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip blocked fields
    if (PHI_BLOCKED_FIELDS.includes(key.toLowerCase())) {
      continue;
    }
    
    // Only include allowlisted fields
    if (allowlist.includes(key)) {
      filtered[key] = value;
    }
  }
  
  return Object.keys(filtered).length > 0 ? filtered : null;
}

/**
 * Generate a request ID for correlating events
 */
export function generateRequestId(): string {
  return uuidv4();
}

// Store request ID in async local storage for request scope
let currentRequestId: string | null = null;

export function setRequestId(id: string): void {
  currentRequestId = id;
}

export function getRequestId(): string | null {
  return currentRequestId;
}

// ============================================================
// MAIN LOGGING FUNCTION
// ============================================================

/**
 * Log an audit event to the database
 * 
 * @example
 * // Log a VIEW action
 * await logAuditEvent({
 *   entityType: 'clinical_note',
 *   entityId: noteId,
 *   action: 'VIEW',
 *   actorId: userId,
 * });
 * 
 * @example
 * // Log an UPDATE with diffs
 * await logAuditEvent({
 *   entityType: 'client',
 *   entityId: clientId,
 *   action: 'UPDATE',
 *   oldValues: { status: 'active' },
 *   newValues: { status: 'inactive' },
 *   changedFields: ['status'],
 *   actorId: userId,
 * });
 */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  try {
    const supabase = getAuditSupabase();
    
    // Skip audit logging if Supabase not configured (don't block login/operations)
    if (!supabase) {
      console.log('[AUDIT] Skipping audit log - Supabase not configured');
      return;
    }
    
    // Get request context
    const [ipAddress, userAgent, resourcePath] = await Promise.all([
      getClientIP(),
      getUserAgent(),
      getResourcePath(),
    ]);
    
    // Filter PHI from values
    const filteredOldValues = filterPHI(params.oldValues, params.entityType);
    const filteredNewValues = filterPHI(params.newValues, params.entityType);
    const filteredDetails = params.details ? filterPHI(params.details, params.entityType) : null;
    
    // Build audit entry
    // Note: The existing audit_log table uses 'user_id' not 'actor_id'
    const entry = {
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      action: params.action,
      user_id: params.actorId || null,  // Maps to user_id column
      actor_type: params.actorType || 'user',
      details: filteredDetails,
      old_values: filteredOldValues,
      new_values: filteredNewValues,
      changed_fields: params.changedFields || null,
      success: params.success ?? null,
      request_id: params.requestId || currentRequestId || null,
      session_id: params.sessionId || null,
      ip_address: ipAddress,
      user_agent: userAgent,
      resource_path: resourcePath,
    };
    
    // Insert audit log (using service role)
    const { error } = await supabase
      .from('audit_log')
      .insert(entry);
    
    if (error) {
      // Log to console but don't throw - audit failures shouldn't break the app
      console.error('[AUDIT] Failed to write audit log:', error.message);
    }
  } catch (err) {
    // Log to console but don't throw
    console.error('[AUDIT] Error in logAuditEvent:', err);
  }
}

// ============================================================
// CONVENIENCE FUNCTIONS
// ============================================================

/**
 * Log a record view event
 */
export async function logRecordView(
  entityType: AuditEntityType,
  entityId: string,
  actorId?: string
): Promise<void> {
  await logAuditEvent({
    entityType,
    entityId,
    action: 'VIEW',
    actorId,
  });
}

/**
 * Log a record list/search event
 */
export async function logRecordList(
  entityType: AuditEntityType,
  actorId?: string,
  details?: { query?: string; count?: number; filters?: Record<string, unknown> }
): Promise<void> {
  await logAuditEvent({
    entityType,
    action: 'LIST',
    actorId,
    details: details ? {
      record_count: details.count,
      has_filters: !!details.filters,
    } : undefined,
  });
}

/**
 * Log a record creation event
 */
export async function logRecordCreate(
  entityType: AuditEntityType,
  entityId: string,
  actorId?: string,
  newValues?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType,
    entityId,
    action: 'CREATE',
    actorId,
    newValues,
    success: true,
  });
}

/**
 * Log a record update event with diffs
 */
export async function logRecordUpdate(
  entityType: AuditEntityType,
  entityId: string,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
  changedFields: string[],
  actorId?: string
): Promise<void> {
  await logAuditEvent({
    entityType,
    entityId,
    action: 'UPDATE',
    actorId,
    oldValues,
    newValues,
    changedFields,
    success: true,
  });
}

/**
 * Log a record deletion event
 */
export async function logRecordDelete(
  entityType: AuditEntityType,
  entityId: string,
  actorId?: string
): Promise<void> {
  await logAuditEvent({
    entityType,
    entityId,
    action: 'DELETE',
    actorId,
    success: true,
  });
}

/**
 * Log an export event
 */
export async function logExport(
  entityType: AuditEntityType,
  actorId?: string,
  details?: { record_count?: number; export_format?: string }
): Promise<void> {
  await logAuditEvent({
    entityType,
    action: 'EXPORT',
    actorId,
    details,
  });
}

/**
 * Log an authentication event
 */
export async function logAuthEvent(
  action: 'AUTH_LOGIN_SUCCESS' | 'AUTH_LOGIN_FAILED' | 'AUTH_LOGOUT' | 'AUTH_PASSWORD_CHANGED',
  userId?: string,
  success?: boolean,
  details?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType: 'session',
    entityId: userId,
    action,
    actorId: userId,
    success: success ?? (action !== 'AUTH_LOGIN_FAILED'),
    details,
  });
}

/**
 * Log an admin action
 */
export async function logAdminAction(
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string,
  actorId: string,
  details?: Record<string, unknown>,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType,
    entityId,
    action,
    actorId,
    details,
    oldValues,
    newValues,
    success: true,
  });
}
