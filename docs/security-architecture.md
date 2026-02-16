# Security & Governance Architecture

**Hello Gorgeous Med Spa**  
**Document Version:** 1.0  
**Last Updated:** 2025-02  
**Classification:** Internal – Compliance Reference

---

## 1. Authentication & Identity

### Architecture Summary

| Component | Configuration |
|-----------|---------------|
| **Auth Provider** | Supabase Auth |
| **Session Storage** | `hgos_session` and `portal_session` cookies (HTTP-only recommended) |
| **Roles** | `owner`, `admin`, `staff`, `provider`, `client` |

### Supabase Auth Configuration

- **Client Auth:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side
- **Server Auth:** `SUPABASE_SERVICE_ROLE_KEY` for API routes (bypasses RLS – use only server-side)
- **Service Role:** Never exposed to client; used for admin API bypass of RLS

### Email Verification

- Magic link flow for client portal (`/portal/login`, `/api/portal/auth/magic-link`)
- Email verification enforced per Supabase project settings (configure in Supabase Dashboard → Authentication → Email)

### Magic Link Expiration

- Default Supabase: 1 hour (configurable in Supabase Dashboard → Auth → Email Templates)

### Session Expiration

- Session validation via `middleware.ts` using `hgos_session` cookie
- Role-based redirect: clients → `/portal`, staff/admin → `/admin`, providers → `/provider`

### Rate Limiting / Brute Force Protection

- **Current:** Application-level; recommend adding Vercel Edge rate limiting or Upstash Redis for login endpoints
- **Recommendation:** Implement `@upstash/ratelimit` on `/api/portal/auth/magic-link` and `/login`

### JWT Expiration Policy

- Supabase default: 1 hour access token, 7-day refresh (configurable in Supabase Dashboard)

### Role-Based Access Control (RBAC)

| Route | Allowed Roles |
|-------|---------------|
| `/admin/*` | owner, admin, staff |
| `/pos/*` | owner, admin, staff |
| `/provider/*` | owner, admin, staff, provider |
| `/portal/*` | client, owner, admin, staff |

**Implementation:** `middleware.ts` (lines 108–146)

---

## 2. Row-Level Security (RLS)

### Status

- **RLS enabled** on all PHI and sensitive tables
- **Migration:** `supabase/migrations/20240101000007_enable_rls_security.sql`

### Policy Model

- **Service role:** Full access for API routes using `SUPABASE_SERVICE_ROLE_KEY`
- **Authenticated users:** Restricted; admin/compliance read on `audit_log` only
- **Public:** Read-only on `services`, `cms_pages`, `cms_navigation`, `cms_promotions` (published content only)

### PHI Tables (Service Role Only)

- `users`, `user_profiles`, `clients`, `providers`
- `appointments`, `treatment_records`, `client_documents`, `client_intakes`
- `medications_administered`, `consent_audit_log`
- `transactions`, `sales`, `sale_items`, `sale_payments`
- `conversations`, `messages`, `sms_messages`, `notifications`

### Helper Functions

```sql
-- From migration 007
public.is_service_role()  -- true if service_role
public.is_authenticated() -- true if authenticated JWT
public.current_user_id()  -- UUID from JWT sub claim
```

### Storage Buckets

- **provider-media:** Signed URLs only; 1-hour expiration
- **No public bucket access** – all file access via signed URLs
- **Reference:** `app/api/uploads/signed-url/route.ts`

---

## 3. Audit Logging

### Schema (audit_log)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| entity_type | text | client, appointment, consent, refund, etc. |
| entity_id | uuid | Record ID |
| action | text | VIEW, CREATE, UPDATE, DELETE, REFUND_CREATED, etc. |
| user_id | uuid | Actor |
| user_email | text | Actor email |
| user_role | text | Actor role |
| details | jsonb | Event-specific payload |
| old_values | jsonb | Previous values (UPDATE) |
| new_values | jsonb | New values (UPDATE) |
| changed_fields | text[] | Modified field names |
| ip_address | text | Client IP |
| user_agent | text | Client user agent |
| resource_path | text | API path |
| request_id | uuid | Request correlation |
| session_id | text | Session correlation |
| success | boolean | Outcome |
| created_at | timestamptz | Timestamp |

### Audited Events

- Chart edits, consent signatures, appointment edits
- Role changes, refunds, login attempts (via `lib/audit`)
- **Reference:** `lib/audit/log.ts`, `lib/audit/index.ts`

### Append-Only Enforcement

- **Migration:** `20240101000015_audit_log_hardening.sql`
- Triggers block UPDATE and DELETE on `audit_log`
- 6-year retention; archive table `audit_log_archive`

### Sample Log Entry

```json
{
  "entity_type": "refund",
  "entity_id": "uuid",
  "action": "create",
  "user_id": "uuid",
  "user_email": "admin@example.com",
  "user_role": "admin",
  "details": {
    "sale_id": "uuid",
    "amount": 5000,
    "amount_formatted": "$50.00",
    "processed_by": "admin@example.com"
  },
  "ip_address": "192.168.1.1",
  "created_at": "2025-02-15T12:00:00Z"
}
```

---

## 4. Payment Security

### PCI Tokenization

- **Square:** Card data tokenized; no raw card numbers stored
- **Stripe:** Same model when used
- **Storage:** Only `sale_payments` stores `processor_transaction_id`, `square_payment_id` – no PAN

### Webhook Signature Verification

- **Square:** HMAC-SHA256 over `webhookUrl + body` with `SQUARE_WEBHOOK_SIGNATURE_KEY`
- **Reference:** `lib/square/webhook.ts` – `verifyWebhookSignature()`
- **Handler:** `app/api/square/webhook/route.ts` – verifies before processing

### Refund Permissions

- **Admin-only:** Refunds require `admin`, `manager`, or `staff` role
- **Reference:** `app/api/pos/invoices/[id]/square/refund/route.ts` (lines 74–88)
- Refunds are audit-logged with `created_by` and details

### OAuth (Square)

- **Reference:** `app/api/square/oauth/start/route.ts`, `app/api/square/oauth/callback/route.ts`
- Token encryption via `SQUARE_ENCRYPTION_KEY` (32-byte hex)

---

## 5. SMS Compliance

### Opt-In Tracking

- `marketing_preferences` / `sms_opt_ins` store consent
- `/api/sms/stats` returns `smsOptInCount` for campaigns
- Campaigns only target opted-in recipients

### STOP Keyword

- "Reply STOP to unsubscribe" appended to marketing messages when not already present
- **Reference:** `app/admin/sms/page.tsx` (lines 36–41)
- **Telnyx:** Configure STOP handling in Messaging Profile (auto opt-out)

### SMS Delivery Logging

- `sms_messages` table stores sent messages
- 2-way conversations in `conversations` and `messages`

### PHI in SMS

- No PHI in marketing blasts
- Operational SMS (appointments, reminders) limited to minimal identifiers; consent tracked in client records

---

## 6. File Upload Security

### File Type Whitelist

- **Videos:** MP4, MOV, M4V, WebM (Cloudflare Stream)
- **Reference:** `app/admin/media/page.tsx` (accept attribute)

### Max File Size

- Cloudflare Stream: 200MB (documented in media upload UI)
- Supabase signed URLs: no explicit limit in code; consider adding

### Signed URL Expiration

- **Upload:** 1 hour (`app/api/uploads/signed-url/route.ts` line 44)
- **Reference:** `createSignedUploadUrl()` with default TTL

### No Public Bucket Access

- `provider-media` and similar buckets use signed URLs only
- No anonymous read policies on storage

---

## 7. Backup & Restore

### Automated Backups

- **Supabase:** Daily automated backups (Pro plan)
- **Location:** Supabase-managed; configurable in project settings

### Restore Procedure

1. Supabase Dashboard → Database → Backups
2. Select point-in-time restore
3. Confirm target project/environment

### RTO (Recovery Time Objective)

- Document in runbook; typically &lt; 4 hours for Supabase PITR

---

## 8. Monitoring & Alerts

### Error Monitoring

- **Sentry:** Add `@sentry/nextjs` for production (recommended)
- **Vercel:** Built-in function error logging

### Webhook Failure Alerts

- Square webhook events logged to `square_webhook_events`
- Recommend: alert on repeated 4xx/5xx responses or failed signature verification

### Failed Login Alerts

- Audit log captures `AUTH_LOGIN_FAILED`
- Recommend: aggregate and alert on threshold (e.g., 5+ failures from same IP)

### Uptime Monitoring

- **Vercel:** Built-in
- **Recommendation:** External uptime (e.g., Better Uptime, Pingdom) for critical paths

---

## 9. Environment Variables (Security-Sensitive)

| Variable | Purpose | Never Expose |
|----------|---------|--------------|
| SUPABASE_SERVICE_ROLE_KEY | Server-only DB access | ✓ |
| SQUARE_OAUTH_CLIENT_SECRET | Square OAuth | ✓ |
| SQUARE_WEBHOOK_SIGNATURE_KEY | Webhook verification | ✓ |
| SQUARE_ENCRYPTION_KEY | Token encryption | ✓ |
| TELNYX_API_KEY | SMS | ✓ |
| STRIPE_SECRET_KEY | Payments | ✓ |

---

## 10. References

| Component | File Path |
|-----------|-----------|
| Middleware (auth) | `middleware.ts` |
| RLS Migration | `supabase/migrations/20240101000007_enable_rls_security.sql` |
| Audit Log Hardening | `supabase/migrations/20240101000015_audit_log_hardening.sql` |
| Audit Library | `lib/audit/` |
| Square Webhook Verification | `lib/square/webhook.ts` |
| Signed Upload URL | `app/api/uploads/signed-url/route.ts` |
| Refund API | `app/api/pos/invoices/[id]/square/refund/route.ts` |
| .env.example | `.env.example` |
