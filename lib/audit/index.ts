// ============================================================
// HIPAA AUDIT LOGGING MODULE
// Export all audit utilities from a single entry point
// ============================================================

export {
  // Main logging function
  logAuditEvent,
  // Convenience functions
  logRecordView,
  logRecordList,
  logRecordCreate,
  logRecordUpdate,
  logRecordDelete,
  logExport,
  logAuthEvent,
  logAdminAction,
  // Utilities
  filterPHI,
  generateRequestId,
  setRequestId,
  getRequestId,
  // Types
  type AuditAction,
  type AuditEntityType,
  type AuditEventParams,
  type AuditLogEntry,
} from './log';

export {
  // Diff computation
  computeDiff,
  computeAuditDiff,
  getTrackedFields,
  isFieldTracked,
  // Types
  type FieldDiff,
  type RecordDiff,
} from './diff';

export {
  // Middleware helpers
  getSessionFromRequest,
  withAuditLog,
  withViewAudit,
  withListAudit,
  withCreateAudit,
  withUpdateAudit,
  withExportAudit,
  auditAuthLogin,
  auditAuthLogout,
} from './middleware';
