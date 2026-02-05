# Audit Logging Requirements

## 4. Audit Logging
**Status:** Partially Implemented

### Requirements
- [ ] Record access logged (who viewed what record, when)
- [ ] Record changes logged (who changed what, old/new values)
- [ ] Admin actions logged (user creation, permission changes)
- [ ] Authentication events logged (login, logout, failed attempts)
- [ ] Logs are append-only (cannot be deleted/modified)
- [ ] Logs retained for 6 years (HIPAA requirement)

### Current Implementation
- `audit_log` table exists
- Some actions are logged

### Missing
- [ ] Comprehensive record access logging
- [ ] Old/new value tracking for changes
- [ ] Log retention policy
- [ ] Log immutability verification

### Evidence Required
- Sample audit log entries
- Test showing logs cannot be deleted
- Retention policy documentation

---

## Current audit_log Table Structure

The `audit_log` table was created in the Square Terminal migration:

```sql
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  actor_id UUID,
  actor_type VARCHAR(50) DEFAULT 'user',
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies
- Authenticated users can read audit logs
- Service role has full access
- No DELETE policy (append-only by design)

---

## What Needs To Be Added

### 1. Record Access Logging
Log when users view sensitive records:
- Client profiles
- Appointments
- Clinical notes
- Photos
- Consent forms

### 2. Record Change Logging
Log changes with old/new values:
- Client updates
- Appointment changes
- Clinical note edits
- Treatment records

### 3. Authentication Events
- Login success/failure
- Logout
- Password changes
- Session expiration

### 4. Admin Actions
- User creation/deletion
- Permission changes
- Settings changes
- Data exports

### 5. Immutability Verification
- Test that DELETE is blocked
- Test that UPDATE is blocked
- Verify RLS policies

### 6. Retention Policy
- Configure 6-year retention
- Implement archival process
- Document backup procedures
