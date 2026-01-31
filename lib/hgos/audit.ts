// ============================================================
// HIPAA AUDIT LOGGING
// Track all access to PHI (Protected Health Information)
// ============================================================

import { createAdminSupabaseClient } from './supabase/client';

export type AuditAction = 
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'sign'
  | 'print'
  | 'export'
  | 'share'
  | 'login'
  | 'logout'
  | 'failed_login';

export type AuditResource = 
  | 'client'
  | 'clinical_note'
  | 'consent'
  | 'intake'
  | 'photo'
  | 'appointment'
  | 'prescription'
  | 'document'
  | 'message';

interface AuditLogEntry {
  userId?: string;
  userRole?: string;
  userEmail?: string;
  action: AuditAction;
  resourceType: AuditResource;
  resourceId?: string;
  description?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

/**
 * Log an audit event for HIPAA compliance
 * This should be called whenever PHI is accessed, modified, or exported
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: entry.userId,
        user_role: entry.userRole,
        user_email: entry.userEmail,
        action: entry.action,
        resource_type: entry.resourceType,
        resource_id: entry.resourceId,
        description: entry.description,
        old_values: entry.oldValues,
        new_values: entry.newValues,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        session_id: entry.sessionId,
      });
    
    if (error) {
      // Don't throw - audit logging should never break the main operation
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    console.error('Audit logging error:', err);
  }
}

/**
 * Helper to extract request metadata for audit logging
 */
export function getRequestMetadata(request: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  return {
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               undefined,
    userAgent: request.headers.get('user-agent') || undefined,
  };
}

/**
 * Audit log wrapper for common operations
 */
export const AuditLogger = {
  // Client record access
  async viewedClient(userId: string, userEmail: string, clientId: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      userRole: 'provider',
      action: 'view',
      resourceType: 'client',
      resourceId: clientId,
      description: 'Viewed client record',
      ...(request && getRequestMetadata(request)),
    });
  },

  // Clinical note operations
  async createdNote(userId: string, userEmail: string, noteId: string, clientId: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      userRole: 'provider',
      action: 'create',
      resourceType: 'clinical_note',
      resourceId: noteId,
      description: `Created clinical note for client ${clientId}`,
      ...(request && getRequestMetadata(request)),
    });
  },

  async signedNote(userId: string, userEmail: string, noteId: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      userRole: 'provider',
      action: 'sign',
      resourceType: 'clinical_note',
      resourceId: noteId,
      description: 'Signed clinical note',
      ...(request && getRequestMetadata(request)),
    });
  },

  async viewedNote(userId: string, userEmail: string, noteId: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      userRole: 'provider',
      action: 'view',
      resourceType: 'clinical_note',
      resourceId: noteId,
      description: 'Viewed clinical note',
      ...(request && getRequestMetadata(request)),
    });
  },

  // Consent operations
  async signedConsent(userId: string, userEmail: string, consentId: string, templateName: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      userRole: 'client',
      action: 'sign',
      resourceType: 'consent',
      resourceId: consentId,
      description: `Signed consent: ${templateName}`,
      ...(request && getRequestMetadata(request)),
    });
  },

  // Intake operations
  async submittedIntake(userId: string, userEmail: string, intakeId: string, templateName: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      userRole: 'client',
      action: 'create',
      resourceType: 'intake',
      resourceId: intakeId,
      description: `Submitted intake form: ${templateName}`,
      ...(request && getRequestMetadata(request)),
    });
  },

  // Photo operations
  async viewedPhoto(userId: string, userEmail: string, photoId: string, clientId: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      action: 'view',
      resourceType: 'photo',
      resourceId: photoId,
      description: `Viewed photo for client ${clientId}`,
      ...(request && getRequestMetadata(request)),
    });
  },

  async uploadedPhoto(userId: string, userEmail: string, photoId: string, clientId: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      action: 'create',
      resourceType: 'photo',
      resourceId: photoId,
      description: `Uploaded photo for client ${clientId}`,
      ...(request && getRequestMetadata(request)),
    });
  },

  // Export operations (high sensitivity)
  async exportedData(userId: string, userEmail: string, resourceType: AuditResource, description: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      action: 'export',
      resourceType,
      description,
      ...(request && getRequestMetadata(request)),
    });
  },

  // Authentication
  async loginSuccess(userId: string, userEmail: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      action: 'login',
      resourceType: 'client', // Using client as placeholder
      description: 'Successful login',
      ...(request && getRequestMetadata(request)),
    });
  },

  async loginFailed(email: string, request?: Request) {
    await logAuditEvent({
      userEmail: email,
      action: 'failed_login',
      resourceType: 'client',
      description: 'Failed login attempt',
      ...(request && getRequestMetadata(request)),
    });
  },

  async logout(userId: string, userEmail: string, request?: Request) {
    await logAuditEvent({
      userId,
      userEmail,
      action: 'logout',
      resourceType: 'client',
      description: 'User logged out',
      ...(request && getRequestMetadata(request)),
    });
  },
};

export default AuditLogger;
