# HIPAA Audit Log Retention Policy

> **Compliance Requirement**: All audit logs must be retained for a minimum of 6 years per HIPAA regulations.

## Overview

This document outlines the audit log retention strategy for Hello Gorgeous Med Spa's HIPAA-compliant systems.

## Retention Timeline

| Tier | Retention Period | Storage Location | Access Level |
|------|------------------|------------------|--------------|
| Hot | 0-180 days | `audit_log` table | Real-time queries |
| Archive | 181 days - 6 years | `audit_log_archive` table | On-demand queries |
| Cold | 6+ years | Encrypted backup storage | Restoration required |

## Storage Architecture

### Hot Storage (audit_log)
- **Table**: `audit_log`
- **Retention**: 180 days (6 months)
- **Purpose**: Active compliance monitoring, real-time dashboards, incident response
- **Performance**: Optimized indexes for fast queries
- **Protection**: Append-only (UPDATE/DELETE blocked by triggers)

### Archive Storage (audit_log_archive)
- **Table**: `audit_log_archive`
- **Retention**: 181 days to 6 years
- **Purpose**: Long-term compliance, audit requests, legal holds
- **Performance**: Same schema, may have reduced indexes for storage efficiency
- **Protection**: Same append-only protection as hot storage

### Cold Storage (Backups)
- **Location**: Encrypted Supabase backups + optional offsite export
- **Retention**: 6+ years minimum
- **Purpose**: Disaster recovery, regulatory audits
- **Format**: Point-in-time database backups

## Archive Process

### Automatic Archival Function

```sql
-- Run weekly via cron job or pg_cron
SELECT archive_old_audit_logs(180);
```

This function:
1. Copies records older than 180 days from `audit_log` to `audit_log_archive`
2. Returns count of archived records
3. Does NOT delete from source (append-only protection prevents this)

### Manual Archival Steps (Maintenance Window)

For actual cleanup of archived records from the hot table:

```sql
-- 1. Verify archive is complete
SELECT COUNT(*) FROM audit_log WHERE created_at < NOW() - INTERVAL '180 days';
SELECT COUNT(*) FROM audit_log_archive WHERE created_at < NOW() - INTERVAL '180 days';

-- 2. ONLY during maintenance window with superuser:
-- Temporarily disable trigger (REQUIRES SUPERUSER)
ALTER TABLE audit_log DISABLE TRIGGER audit_log_prevent_delete;

-- 3. Delete archived records from hot table
DELETE FROM audit_log 
WHERE created_at < NOW() - INTERVAL '180 days'
AND id IN (SELECT id FROM audit_log_archive);

-- 4. Re-enable trigger immediately
ALTER TABLE audit_log ENABLE TRIGGER audit_log_prevent_delete;
```

**WARNING**: Steps 2-4 should only be performed by authorized DBAs during scheduled maintenance windows with full backups verified.

## Backup Strategy

### Daily Backups
- Supabase automated daily backups (included in plan)
- Verify backups include both `audit_log` and `audit_log_archive` tables

### Monthly Exports (Recommended)
- Export audit logs to encrypted external storage
- Verify integrity with checksums
- Document export location and encryption keys securely

### Annual Verification
- Restore test from oldest available backup
- Verify audit log data integrity
- Document verification in compliance records

## Restoration Procedures

### From Archive Table

```sql
-- Query specific records from archive
SELECT * FROM audit_log_archive 
WHERE entity_type = 'clinical_note' 
AND created_at BETWEEN '2025-01-01' AND '2025-12-31';
```

### From Backup

1. Contact Supabase support for point-in-time restore (Pro plan)
2. Or restore to a separate database for read-only access
3. Document restoration reason in compliance log

## Compliance Verification

### Monthly Checks
- [ ] Verify trigger protection is active: `SELECT * FROM pg_trigger WHERE tgname LIKE 'audit_log%'`
- [ ] Verify RLS is enabled: `SELECT relrowsecurity FROM pg_class WHERE relname = 'audit_log'`
- [ ] Sample audit entries exist for each action type

### Quarterly Checks
- [ ] Run archive function if not automated
- [ ] Verify archive table contains expected records
- [ ] Test query performance on both hot and archive tables

### Annual Checks
- [ ] Full backup restoration test
- [ ] Verify 6-year retention compliance
- [ ] Document oldest available audit record date
- [ ] Review and update retention policy as needed

## Legal Holds

If a legal hold is issued:

1. **Immediately** suspend any deletion processes
2. Document the hold in writing
3. Preserve ALL audit logs regardless of age
4. Do not modify archive schedule until hold is released
5. Contact legal counsel for specific requirements

## Audit Log Contents

Each audit record contains:

| Field | Description | PHI Status |
|-------|-------------|------------|
| id | Unique identifier | No |
| entity_type | Type of record (client, note, etc.) | No |
| entity_id | Record identifier | No |
| action | What was done (VIEW, UPDATE, etc.) | No |
| actor_id | Who performed the action | No |
| actor_type | User type (user, system, api) | No |
| details | Additional context (filtered for PHI) | Filtered |
| old_values | Previous values (metadata only) | Filtered |
| new_values | New values (metadata only) | Filtered |
| changed_fields | List of modified fields | No |
| success | Action outcome | No |
| request_id | Correlation ID | No |
| session_id | User session | No |
| ip_address | Client IP | No |
| user_agent | Browser/client info | No |
| resource_path | API endpoint | No |
| created_at | Timestamp | No |

**Note**: All PHI content is filtered from audit logs. Only metadata (field names, timestamps, IDs) is stored.

## Responsible Parties

| Role | Responsibility |
|------|----------------|
| DBA/Backend | Execute archive functions, maintain triggers |
| Compliance Officer | Verify retention, respond to audits |
| Security Team | Monitor access, investigate incidents |
| Legal | Issue/release legal holds |

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-04 | System | Initial policy |

---

**Approval Required**: This retention policy requires approval from:
- [ ] Practice Owner
- [ ] Compliance Officer (if designated)
- [ ] Legal Counsel (recommended)
