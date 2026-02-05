// ============================================================
// FIELD-LEVEL DIFF UTILITY FOR AUDIT LOGGING
// Computes changes between old and new record states
// ============================================================
// SECURITY:
// - Uses allowlists per entity type to prevent PHI leakage
// - Only logs metadata for sensitive fields (changed: true/false)
// - Never stores full clinical note bodies
// ============================================================

import { AuditEntityType } from './log';

// ============================================================
// TYPES
// ============================================================

export interface FieldDiff {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface RecordDiff {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  fields: string[];
  hasChanges: boolean;
}

// ============================================================
// FIELD ALLOWLISTS PER ENTITY TYPE
// Only these fields are tracked in detail for audit purposes
// ============================================================

const AUDIT_TRACKED_FIELDS: Record<string, string[]> = {
  client: [
    'status',
    'membership_status',
    'preferred_contact_method',
    'marketing_consent',
    'updated_at',
  ],
  appointment: [
    'status',
    'appointment_date',
    'start_time',
    'end_time',
    'duration',
    'provider_id',
    'service_id',
    'room_id',
    'cancelled_at',
    'cancellation_reason',
    'rescheduled_from',
    'confirmed_at',
    'checked_in_at',
    'checked_out_at',
    'no_show',
  ],
  clinical_note: [
    'status',
    'note_type',
    'signed_at',
    'signed_by',
    'locked_at',
    'locked_by',
    'provider_id',
    // Note: 'content' is tracked as boolean changed only
  ],
  chart: [
    'status',
    'chart_type',
    'provider_id',
    'locked_at',
    'locked_by',
  ],
  treatment: [
    'status',
    'treatment_type',
    'provider_id',
    'units',
    'quantity',
    'area',
    'technique',
    'completed_at',
  ],
  consent: [
    'status',
    'consent_type',
    'signed_at',
    'signed_by',
    'witness_id',
    'expires_at',
    'revoked_at',
    'version',
  ],
  photo: [
    'status',
    'photo_type',
    'category',
    'is_before_photo',
    'is_after_photo',
    'linked_treatment_id',
  ],
  document: [
    'status',
    'document_type',
    'category',
    'reviewed_at',
    'reviewed_by',
  ],
  user: [
    'role',
    'status',
    'permissions',
    'last_login_at',
    'disabled_at',
    'disabled_by',
  ],
  staff: [
    'role',
    'status',
    'permissions',
    'department',
    'is_provider',
    'can_book_appointments',
    'disabled_at',
  ],
  settings: [
    'value',
    'enabled',
    'updated_by',
  ],
  integration: [
    'status',
    'environment',
    'location_id',
    'device_id',
    'connected_at',
    'disconnected_at',
    'last_sync_at',
  ],
  payment: [
    'status',
    'amount',
    'tip_amount',
    'total_amount',
    'payment_method',
    'processor',
    'processor_status',
    'refunded_amount',
  ],
  refund: [
    'status',
    'amount',
    'reason_category',
    'approved_by',
    'processed_at',
  ],
  sale: [
    'status',
    'subtotal',
    'discount_amount',
    'tax_amount',
    'total',
    'payment_status',
    'voided_at',
  ],
  session: [
    'status',
    'expires_at',
    'invalidated_at',
  ],
  export: [
    'status',
    'export_type',
    'record_count',
    'completed_at',
  ],
};

// Fields that contain large text content - only track if changed, not the actual content
const LARGE_TEXT_FIELDS = [
  'content',
  'note_content',
  'clinical_notes',
  'treatment_notes',
  'provider_notes',
  'description',
  'comments',
  'internal_notes',
  'reason',
  'instructions',
];

// ============================================================
// DIFF COMPUTATION
// ============================================================

/**
 * Check if two values are different
 */
function valuesAreDifferent(oldVal: unknown, newVal: unknown): boolean {
  // Handle null/undefined
  if (oldVal === null || oldVal === undefined) {
    return newVal !== null && newVal !== undefined;
  }
  if (newVal === null || newVal === undefined) {
    return true;
  }
  
  // Handle dates
  if (oldVal instanceof Date && newVal instanceof Date) {
    return oldVal.getTime() !== newVal.getTime();
  }
  
  // Handle date strings
  if (typeof oldVal === 'string' && typeof newVal === 'string') {
    // Check if both are date strings
    const oldDate = Date.parse(oldVal);
    const newDate = Date.parse(newVal);
    if (!isNaN(oldDate) && !isNaN(newDate)) {
      return oldDate !== newDate;
    }
  }
  
  // Handle arrays
  if (Array.isArray(oldVal) && Array.isArray(newVal)) {
    if (oldVal.length !== newVal.length) return true;
    return JSON.stringify(oldVal.sort()) !== JSON.stringify(newVal.sort());
  }
  
  // Handle objects
  if (typeof oldVal === 'object' && typeof newVal === 'object') {
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  }
  
  // Primitive comparison
  return oldVal !== newVal;
}

/**
 * Sanitize a value for audit logging
 * Removes sensitive data, truncates large values
 */
function sanitizeValue(value: unknown, field: string): unknown {
  if (value === null || value === undefined) {
    return null;
  }
  
  // Large text fields - only indicate changed, not content
  if (LARGE_TEXT_FIELDS.includes(field)) {
    if (typeof value === 'string') {
      return `[${value.length} characters]`;
    }
    return '[content]';
  }
  
  // Truncate long strings
  if (typeof value === 'string' && value.length > 200) {
    return value.substring(0, 200) + '...[truncated]';
  }
  
  // Arrays - truncate if too many items
  if (Array.isArray(value) && value.length > 10) {
    return [...value.slice(0, 10), `...[${value.length - 10} more]`];
  }
  
  return value;
}

/**
 * Compute field-level diff between old and new record states
 * 
 * @param entityType - The type of entity being compared
 * @param oldRecord - The previous state (can be null for CREATE)
 * @param newRecord - The new state (can be null for DELETE)
 * @returns Diff object with before/after values and changed field list
 * 
 * @example
 * const diff = computeDiff('appointment', 
 *   { status: 'scheduled', start_time: '10:00' },
 *   { status: 'confirmed', start_time: '10:00' }
 * );
 * // Result: { before: { status: 'scheduled' }, after: { status: 'confirmed' }, fields: ['status'], hasChanges: true }
 */
export function computeDiff(
  entityType: AuditEntityType,
  oldRecord: Record<string, unknown> | null,
  newRecord: Record<string, unknown> | null
): RecordDiff {
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  const fields: string[] = [];
  
  // Get allowed fields for this entity type
  const allowedFields = AUDIT_TRACKED_FIELDS[entityType] || [];
  
  // Handle CREATE (no old record)
  if (!oldRecord && newRecord) {
    for (const field of allowedFields) {
      if (field in newRecord && newRecord[field] !== null && newRecord[field] !== undefined) {
        after[field] = sanitizeValue(newRecord[field], field);
        fields.push(field);
      }
    }
    return { before, after, fields, hasChanges: fields.length > 0 };
  }
  
  // Handle DELETE (no new record)
  if (oldRecord && !newRecord) {
    for (const field of allowedFields) {
      if (field in oldRecord && oldRecord[field] !== null && oldRecord[field] !== undefined) {
        before[field] = sanitizeValue(oldRecord[field], field);
        fields.push(field);
      }
    }
    return { before, after, fields, hasChanges: fields.length > 0 };
  }
  
  // Handle UPDATE (compare both)
  if (oldRecord && newRecord) {
    for (const field of allowedFields) {
      const oldVal = oldRecord[field];
      const newVal = newRecord[field];
      
      if (valuesAreDifferent(oldVal, newVal)) {
        before[field] = sanitizeValue(oldVal, field);
        after[field] = sanitizeValue(newVal, field);
        fields.push(field);
      }
    }
    
    // Also check for large text field changes (content modified)
    for (const field of LARGE_TEXT_FIELDS) {
      if ((field in oldRecord || field in newRecord) && 
          valuesAreDifferent(oldRecord[field], newRecord[field])) {
        // Only note that it changed, don't include content
        before[field] = oldRecord[field] ? '[modified]' : null;
        after[field] = newRecord[field] ? '[modified]' : null;
        if (!fields.includes(field)) {
          fields.push(field);
        }
      }
    }
  }
  
  return { before, after, fields, hasChanges: fields.length > 0 };
}

/**
 * Compute diff and return in format ready for audit log
 * 
 * @example
 * const { oldValues, newValues, changedFields } = computeAuditDiff(
 *   'appointment',
 *   existingAppointment,
 *   updatedAppointment
 * );
 * 
 * await logAuditEvent({
 *   entityType: 'appointment',
 *   entityId: appointment.id,
 *   action: 'UPDATE',
 *   oldValues,
 *   newValues,
 *   changedFields,
 * });
 */
export function computeAuditDiff(
  entityType: AuditEntityType,
  oldRecord: Record<string, unknown> | null,
  newRecord: Record<string, unknown> | null
): {
  oldValues: Record<string, unknown> | undefined;
  newValues: Record<string, unknown> | undefined;
  changedFields: string[] | undefined;
} {
  const diff = computeDiff(entityType, oldRecord, newRecord);
  
  if (!diff.hasChanges) {
    return {
      oldValues: undefined,
      newValues: undefined,
      changedFields: undefined,
    };
  }
  
  return {
    oldValues: Object.keys(diff.before).length > 0 ? diff.before : undefined,
    newValues: Object.keys(diff.after).length > 0 ? diff.after : undefined,
    changedFields: diff.fields.length > 0 ? diff.fields : undefined,
  };
}

/**
 * Get list of tracked fields for an entity type
 * Useful for documentation/debugging
 */
export function getTrackedFields(entityType: AuditEntityType): string[] {
  return AUDIT_TRACKED_FIELDS[entityType] || [];
}

/**
 * Check if a field is tracked for audit purposes
 */
export function isFieldTracked(entityType: AuditEntityType, field: string): boolean {
  const tracked = AUDIT_TRACKED_FIELDS[entityType] || [];
  return tracked.includes(field) || LARGE_TEXT_FIELDS.includes(field);
}
