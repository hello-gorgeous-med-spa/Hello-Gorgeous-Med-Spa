# HIPAA Compliance Checklist

**Status: 🔴 NOT READY FOR GO-LIVE**

This document tracks HIPAA compliance requirements for Hello Gorgeous Med Spa.
No go-live until all items are ✅ completed and reviewed.

---

## 1. Vercel HIPAA BAA
**Status:** ⬜ Not Started

### Requirements
- [ ] Upgrade to Vercel Pro with HIPAA add-on OR Enterprise plan
- [ ] Sign Business Associate Agreement (BAA) with Vercel
- [ ] Document BAA effective date and coverage
- [ ] Verify HIPAA-compliant regions are configured

### Evidence Required
- Screenshot of Vercel plan showing HIPAA add-on
- Copy of signed BAA
- Vercel support confirmation ticket

### Notes
Vercel HIPAA add-on: https://vercel.com/docs/security/hipaa-compliance

---

## 2. Supabase HIPAA Project + BAA
**Status:** ⬜ Not Started

### Requirements
- [ ] Enable Supabase HIPAA add-on for project
- [ ] Sign Business Associate Agreement (BAA) with Supabase
- [ ] Verify project is in HIPAA-compliant region
- [ ] RLS policies verified with automated tests
- [ ] Database encryption at rest confirmed

### Evidence Required
- Screenshot of Supabase project showing HIPAA status
- Copy of signed BAA
- RLS policy test results (all pass)
- Supabase support confirmation

### RLS Policy Tests Needed
```sql
-- Test: Unauthenticated users cannot read clients
-- Test: Unauthenticated users cannot read appointments
-- Test: Unauthenticated users cannot read clinical_notes
-- Test: Staff can only see their own clients (if applicable)
-- Test: Audit log is append-only
```

### Notes
Supabase HIPAA: https://supabase.com/docs/guides/platform/hipaa

---

## 3. PHI Leak Prevention
**Status:** ⬜ Not Started

### Requirements
- [ ] No PHI in console.log statements (code review)
- [ ] No PHI in error messages returned to client
- [ ] No PHI in Vercel function logs
- [ ] No PHI in analytics (if any)
- [ ] No PHI in error tracking (Sentry, etc.)
- [ ] No PHI in Square API payloads (verified)
- [ ] No PHI in URL parameters
- [ ] No PHI in localStorage/sessionStorage

### Code Review Checklist
- [ ] Review all `console.log` statements
- [ ] Review all `console.error` statements
- [ ] Review all API error responses
- [ ] Review Square integration payloads
- [ ] Review client-side storage usage

### Tests Required
```typescript
// Test: API errors do not contain PHI
// Test: Square order payloads contain only generic items
// Test: Logs do not contain client names/DOB/phone
```

### Evidence Required
- Code review sign-off
- Test results (all pass)
- Sample logs showing no PHI

---

## 4. Audit Logging
**Status:** ⬜ Partially Implemented

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

## 5. Storage Bucket Security
**Status:** ⬜ Not Started

### Requirements
- [ ] All PHI storage buckets are private
- [ ] Signed URLs used for PHI access (time-limited)
- [ ] No PHI in public buckets
- [ ] Bucket policies reviewed and documented

### Buckets to Review
- [ ] Client photos bucket
- [ ] Clinical documents bucket
- [ ] Consent forms bucket
- [ ] Any other buckets with PHI

### Evidence Required
- Supabase storage bucket configuration screenshots
- Code showing signed URL generation
- Test confirming public access is denied

---

## 6. Backup & Restore Test
**Status:** ⬜ Not Started

### Requirements
- [ ] Automated backups configured
- [ ] Backup encryption verified
- [ ] Full restore test completed successfully
- [ ] Point-in-time recovery tested
- [ ] Restore procedure documented
- [ ] Recovery time measured and acceptable

### Test Procedure
1. Create test data
2. Perform backup
3. Corrupt/delete test data
4. Restore from backup
5. Verify data integrity
6. Document restore time

### Evidence Required
- Backup configuration screenshot
- Restore test log with timestamps
- Data integrity verification

---

## 7. Data Flow Diagram
**Status:** ⬜ Not Started

### Requirements
- [ ] Diagram showing all PHI data flows
- [ ] All vendors that touch PHI identified
- [ ] Data at rest locations identified
- [ ] Data in transit encryption verified
- [ ] BAAs in place for all PHI-touching vendors

### PHI Data Categories
- Client PII (name, DOB, phone, email, address)
- Medical history
- Treatment records / clinical notes
- Photos (before/after)
- Consent forms
- Payment information (limited PHI exposure)

### Vendors to Document
| Vendor | Touches PHI? | BAA Required? | BAA Signed? |
|--------|--------------|---------------|-------------|
| Vercel | Yes (hosting) | Yes | ⬜ |
| Supabase | Yes (database) | Yes | ⬜ |
| Square | No (generic items only) | No | N/A |
| Twilio (if used) | Yes (SMS) | Yes | ⬜ |
| SendGrid (if used) | Yes (email) | Yes | ⬜ |

### Diagram
```
[To be created - show data flow from client browser through all systems]
```

---

## Sign-Off

### Pre-Go-Live Review

| Requirement | Completed | Reviewed By | Date |
|-------------|-----------|-------------|------|
| 1. Vercel HIPAA BAA | ⬜ | | |
| 2. Supabase HIPAA + RLS | ⬜ | | |
| 3. PHI Leak Prevention | ⬜ | | |
| 4. Audit Logging | ⬜ | | |
| 5. Storage Security | ⬜ | | |
| 6. Backup/Restore Test | ⬜ | | |
| 7. Data Flow Diagram | ⬜ | | |

**Final Approval:** ⬜ Not Approved

**Approved By:** _______________

**Date:** _______________

---

## Resources

- [Vercel HIPAA Compliance](https://vercel.com/docs/security/hipaa-compliance)
- [Supabase HIPAA Compliance](https://supabase.com/docs/guides/platform/hipaa)
- [HHS HIPAA Guidelines](https://www.hhs.gov/hipaa/index.html)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
