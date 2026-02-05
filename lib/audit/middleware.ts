// ============================================================
// AUDIT LOGGING MIDDLEWARE HELPERS
// Utilities for wrapping API route handlers with audit logging
// ============================================================

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { 
  logAuditEvent, 
  logRecordView, 
  logRecordList, 
  logRecordCreate, 
  logRecordUpdate,
  logExport,
  logAuthEvent,
  AuditAction,
  AuditEntityType,
  generateRequestId,
  setRequestId,
} from './log';
import { computeAuditDiff } from './diff';

// ============================================================
// SESSION EXTRACTION
// ============================================================

interface SessionInfo {
  userId?: string;
  email?: string;
  role?: string;
}

/**
 * Extract session info from the request
 * Reads the hgos_session cookie set by the login route
 */
export async function getSessionFromRequest(request?: NextRequest): Promise<SessionInfo> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hgos_session');
    
    if (!sessionCookie?.value) {
      return {};
    }
    
    const decoded = decodeURIComponent(sessionCookie.value);
    const session = JSON.parse(decoded);
    
    return {
      userId: session.userId,
      email: session.email,
      role: session.role,
    };
  } catch {
    return {};
  }
}

// ============================================================
// AUDIT WRAPPER FOR API HANDLERS
// ============================================================

type ApiHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<Response>;

interface AuditWrapperOptions {
  entityType: AuditEntityType;
  action: AuditAction;
  getEntityId?: (request: NextRequest, context?: any, responseData?: any) => string | undefined;
  getDetails?: (request: NextRequest, context?: any, responseData?: any) => Record<string, unknown> | undefined;
  logOnSuccess?: boolean;
  logOnError?: boolean;
}

/**
 * Wrap an API handler with automatic audit logging
 * 
 * @example
 * export const GET = withAuditLog(
 *   async (request) => { ... },
 *   { entityType: 'client', action: 'VIEW' }
 * );
 */
export function withAuditLog(
  handler: ApiHandler,
  options: AuditWrapperOptions
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    // Generate request ID for correlation
    const requestId = generateRequestId();
    setRequestId(requestId);
    
    // Get session info
    const session = await getSessionFromRequest(request);
    
    try {
      // Execute the handler
      const response = await handler(request, context);
      
      // Only log on success if configured
      if (options.logOnSuccess !== false && response.ok) {
        // Try to extract entity ID
        let entityId: string | undefined;
        let responseData: any;
        
        try {
          // Clone response to read body without consuming it
          const clonedResponse = response.clone();
          responseData = await clonedResponse.json().catch(() => ({}));
          
          if (options.getEntityId) {
            entityId = options.getEntityId(request, context, responseData);
          } else if (context?.params) {
            const params = await context.params;
            entityId = params.id;
          }
        } catch {
          // Ignore errors reading response body
        }
        
        await logAuditEvent({
          entityType: options.entityType,
          entityId,
          action: options.action,
          actorId: session.userId,
          requestId,
          details: options.getDetails?.(request, context, responseData),
          success: true,
        });
      }
      
      return response;
    } catch (error) {
      // Log errors if configured
      if (options.logOnError !== false) {
        await logAuditEvent({
          entityType: options.entityType,
          action: options.action,
          actorId: session.userId,
          requestId,
          success: false,
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
      throw error;
    }
  };
}

// ============================================================
// CONVENIENCE WRAPPERS FOR COMMON PATTERNS
// ============================================================

/**
 * Wrap a GET handler that returns a single record (VIEW action)
 */
export function withViewAudit(
  handler: ApiHandler,
  entityType: AuditEntityType
): ApiHandler {
  return withAuditLog(handler, {
    entityType,
    action: 'VIEW',
    logOnError: false,
  });
}

/**
 * Wrap a GET handler that returns a list of records (LIST action)
 */
export function withListAudit(
  handler: ApiHandler,
  entityType: AuditEntityType
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const requestId = generateRequestId();
    setRequestId(requestId);
    const session = await getSessionFromRequest(request);
    
    try {
      const response = await handler(request, context);
      
      if (response.ok) {
        let count: number | undefined;
        try {
          const data = await response.clone().json();
          // Try to extract count from common response shapes
          count = data.total || data.count || (Array.isArray(data) ? data.length : undefined);
        } catch {
          // Ignore
        }
        
        await logRecordList(entityType, session.userId, { count });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
}

/**
 * Wrap a POST handler that creates a record (CREATE action)
 */
export function withCreateAudit(
  handler: ApiHandler,
  entityType: AuditEntityType
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const requestId = generateRequestId();
    setRequestId(requestId);
    const session = await getSessionFromRequest(request);
    
    try {
      const response = await handler(request, context);
      
      if (response.ok) {
        let entityId: string | undefined;
        let newValues: Record<string, unknown> | undefined;
        
        try {
          const data = await response.clone().json();
          // Extract ID from common response shapes
          entityId = data.id || data[entityType]?.id || data.data?.id;
          newValues = data[entityType] || data.data || data;
        } catch {
          // Ignore
        }
        
        if (entityId) {
          await logRecordCreate(entityType, entityId, session.userId, newValues);
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
}

/**
 * Wrap a PUT/PATCH handler that updates a record (UPDATE action)
 * Requires the old record to be passed for diff computation
 */
export function withUpdateAudit(
  handler: ApiHandler,
  entityType: AuditEntityType,
  getOldRecord?: (request: NextRequest, context?: any) => Promise<Record<string, unknown> | null>
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const requestId = generateRequestId();
    setRequestId(requestId);
    const session = await getSessionFromRequest(request);
    
    // Get old record before update
    let oldRecord: Record<string, unknown> | null = null;
    if (getOldRecord) {
      oldRecord = await getOldRecord(request, context);
    }
    
    try {
      const response = await handler(request, context);
      
      if (response.ok) {
        let entityId: string | undefined;
        let newRecord: Record<string, unknown> | null = null;
        
        try {
          const data = await response.clone().json();
          entityId = data.id || data[entityType]?.id || data.data?.id;
          newRecord = data[entityType] || data.data || data;
          
          if (!entityId && context?.params) {
            const params = await context.params;
            entityId = params.id;
          }
        } catch {
          // Ignore
        }
        
        if (entityId) {
          // Compute diff if we have both old and new records
          if (oldRecord && newRecord) {
            const { oldValues, newValues, changedFields } = computeAuditDiff(
              entityType,
              oldRecord,
              newRecord
            );
            
            if (changedFields && changedFields.length > 0) {
              await logRecordUpdate(
                entityType,
                entityId,
                oldValues || {},
                newValues || {},
                changedFields,
                session.userId
              );
            }
          } else {
            // Log without diff if we don't have old record
            await logAuditEvent({
              entityType,
              entityId,
              action: 'UPDATE',
              actorId: session.userId,
              requestId,
              success: true,
            });
          }
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
}

/**
 * Wrap an export handler (EXPORT action)
 */
export function withExportAudit(
  handler: ApiHandler,
  entityType: AuditEntityType
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const requestId = generateRequestId();
    setRequestId(requestId);
    const session = await getSessionFromRequest(request);
    
    try {
      const response = await handler(request, context);
      
      if (response.ok) {
        const searchParams = new URL(request.url).searchParams;
        const format = searchParams.get('format') || 'csv';
        
        await logExport(entityType, session.userId, {
          export_format: format,
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
}

/**
 * Log an authentication event
 */
export async function auditAuthLogin(
  userId: string,
  email: string,
  success: boolean,
  request?: NextRequest
): Promise<void> {
  const requestId = generateRequestId();
  setRequestId(requestId);
  
  await logAuthEvent(
    success ? 'AUTH_LOGIN_SUCCESS' : 'AUTH_LOGIN_FAILED',
    userId,
    success,
    { email }
  );
}

/**
 * Log a logout event
 */
export async function auditAuthLogout(
  userId: string,
  request?: NextRequest
): Promise<void> {
  const requestId = generateRequestId();
  setRequestId(requestId);
  
  await logAuthEvent('AUTH_LOGOUT', userId, true);
}
