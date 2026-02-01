# Hello Gorgeous Med Spa – Final Production Test Checklist

**Purpose:** Certify the system is live, compliant, and safe for daily use with real patients, payments, and messaging (Fresha replacement).

**Use this checklist:** Before go-live and whenever a major release is deployed. Complete each section and obtain sign-off where indicated.

---

## 1. Data Integrity & Migration Verification

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 1.1 | All patient/client data is production data only (no test fixtures) | ☐ | |
| 1.2 | No demo, sample, test, or placeholder records in clients | ☐ | |
| 1.3 | No hardcoded patient IDs or provider IDs in code | ☐ | |
| 1.4 | No seeded fake appointments, invoices, or visits | ☐ | |
| 1.5 | Legacy Fresha IDs (if stored) are mapped correctly | ☐ | |
| 1.6 | No orphaned records: every appointment has a client; every payment has a visit/transaction | ☐ | |

**Verification steps:**
- [ ] Run DB query: count clients where `email` contains "test", "demo", "example", "fake" → expect 0 (or document exceptions).
- [ ] Run DB query: appointments with no matching client_id → expect 0.
- [ ] Run DB query: transactions with no linked appointment/client where applicable → expect 0.
- [ ] Search codebase for hardcoded UUIDs used as client_id or provider_id → expect none in production paths.

**Acceptance:** Dev confirms in writing: *"All production tables contain live data only; no mock or test data."*

---

## 2. Stripe Payment Compliance & Safety

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 2.1 | Stripe is in **LIVE** mode (not test) | ☐ | Dashboard: no "Test mode" banner |
| 2.2 | Stripe account is owned by Hello Gorgeous Med Spa | ☐ | |
| 2.3 | Developer does not control payouts | ☐ | |
| 2.4 | Cards tokenized via Stripe only; no card data stored locally | ☐ | |
| 2.5 | Webhooks are live, endpoint verified, recent events successful | ☐ | |
| 2.6 | Refunds and partial refunds tested successfully | ☐ | |
| 2.7 | Chargebacks (if any) flow correctly into admin view | ☐ | |
| 2.8 | Payment records in app reconcile with Stripe Dashboard | ☐ | |

**Verification steps:**
- [ ] In Stripe Dashboard: confirm Live mode; confirm account owner.
- [ ] In app: process one small live charge; verify it appears in Stripe and in `/admin/payments`.
- [ ] In app: run one refund; verify status in Stripe and in admin.
- [ ] Confirm env uses `STRIPE_SECRET_KEY` (live), not `STRIPE_TEST_*`.

**Critical compliance:** Confirm in writing: *"No PHI or clinical notes are ever transmitted to Stripe. Only stripe_customer_id, payment_intent_id, and similar identifiers are stored; no medical data leaves our system to Stripe."*

---

## 3. Telnyx SMS Compliance & Campaign Safety

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 3.1 | Telnyx account owned by Hello Gorgeous Med Spa | ☐ | |
| 3.2 | Business email verified in Telnyx | ☐ | |
| 3.3 | 10DLC registration completed or in progress | ☐ | |
| 3.4 | Opt-in language stored per patient (SMS consent) | ☐ | |
| 3.5 | Opt-out (STOP) handling implemented and tested | ☐ | |
| 3.6 | Message logs retained (content, timestamp, recipient) | ☐ | |
| 3.7 | SMS costs tracked internally (if applicable) | ☐ | |
| 3.8 | No PHI included in SMS body | ☐ | |

**Verification steps:**
- [ ] Send test SMS to own number; reply STOP; confirm opt-out is recorded and no further messages sent.
- [ ] Review Telnyx message log for any message containing full name + clinical detail → must be none.
- [ ] Confirm consent type `sms_consent` is used and stored per client.

**Required confirmation:** *"All SMS campaigns and reminders are compliant with TCPA and carrier rules (opt-in, STOP, no PHI in body)."*

---

## 4. Consents, Documents & Legal Protection

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 4.1 | HIPAA acknowledgment form exists and is signable | ☐ | `hipaa_authorization` in consent forms |
| 4.2 | Treatment-specific consents exist (injectable, laser, etc.) | ☐ | See `lib/hgos/consent-forms.ts` |
| 4.3 | Financial/cancellation policy consent exists | ☐ | `cancellation_policy` |
| 4.4 | Photo/media release exists | ☐ | `photo_release` |
| 4.5 | Digital signatures are captured (drawn or typed) | ☐ | |
| 4.6 | Timestamp + IP address (and user agent) logged at sign time | ☐ | |
| 4.7 | Signed documents are immutable (no edit after sign) | ☐ | |
| 4.8 | Consents tied to patient + visit where applicable | ☐ | |
| 4.9 | Versioning exists for updated consent language | ☐ | Form version stored with signature |

**Verification steps:**
- [ ] Sign a consent as a test client; verify record in DB has `signed_at`, `ip_address`, `signature_data`, `form_version`.
- [ ] Attempt to edit a signed consent (if UI/API allows) → must be blocked or create new version only.
- [ ] Open `/admin/consents`; confirm templates and signed counts load.

**Legal safety confirmation:** *"If a consent is challenged, we can produce the exact signed version with timestamp and IP (and user agent) from our system."*

---

## 5. Clinical Charting & Auditability

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 5.1 | SOAP notes are structured (Subjective / Objective / Assessment / Plan) | ☐ | |
| 5.2 | Notes auto-timestamp on create/save | ☐ | |
| 5.3 | Provider identity recorded with note | ☐ | |
| 5.4 | Notes lock after signing; no edits allowed post-signature | ☐ | |
| 5.5 | Version history preserved for notes | ☐ | |
| 5.6 | Injection details tracked (units, product, lot, expiration) where applicable | ☐ | |
| 5.7 | Before/after photos tied to visit | ☐ | |

**Verification steps:**
- [ ] Create and sign a SOAP note from `/admin/charts` or appointment charting; verify provider and timestamp stored.
- [ ] After signing, attempt edit → must be blocked or versioned.
- [ ] Confirm injection/product fields and photo attachment to visit exist in UI/DB.

**Acceptance:** *"Charting is legally defensible; full audit trail exists for every clinical action."*

---

## 6. Role-Based Access & Security

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 6.1 | Role-based permissions enforced (owner, admin, provider, staff, client) | ☐ | See `lib/hgos/auth.ts` |
| 6.2 | Front desk / staff cannot access full clinical notes (per policy) | ☐ | |
| 6.3 | Providers cannot see financial data beyond their scope | ☐ | |
| 6.4 | Admin access limited and logged | ☐ | |
| 6.5 | User actions logged (who, what, when) where implemented | ☐ | |
| 6.6 | Inactive users cannot log in | ☐ | |
| 6.7 | Password policies enforced (e.g. strength, expiry if configured) | ☐ | |

**Roles and access (reference):**
- **owner:** full access
- **admin:** dashboard, appointments, clients, services, staff view, reports, POS, charts view, marketing, settings
- **provider:** dashboard, own appointments, clients view, own charts, POS, own schedule
- **staff:** dashboard, appointments, clients view/create, POS, check-in
- **client:** portal, own appointments, profile, own documents

**Verification steps:**
- [ ] Log in as each role (or equivalent test user) and confirm expected pages are accessible and restricted.
- [ ] Confirm `/admin/reports` and `/admin/staff` restricted to owner/admin.
- [ ] Deactivate a user; confirm login is blocked.

**Security confirmation:** *"We can provide a list of roles and exactly what each role can access (see table above)."*

---

## 7. Inventory & Financial Accuracy

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 7.1 | Inventory auto-decrements on treatment (where implemented) | ☐ | |
| 7.2 | Lot numbers tracked | ☐ | |
| 7.3 | Expiration dates enforced | ☐ | |
| 7.4 | Expired products blocked from use | ☐ | |
| 7.5 | Inventory cannot go negative | ☐ | |
| 7.6 | Cost vs revenue reporting accurate | ☐ | |
| 7.7 | Manual adjustments logged | ☐ | |

**Verification steps:**
- [ ] Open `/admin/inventory` (or medications/inventory); perform one adjustment; confirm log or history.
- [ ] If applicable: complete a treatment that consumes product; confirm stock decrements and no negative quantity.

---

## 8. Reporting & Reconciliation

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 8.1 | Daily sales report available and accurate | ☐ | `/admin` dashboard + `/admin/reports` |
| 8.2 | Provider productivity report (appointments, revenue) | ☐ | Reports API: `type=providers` |
| 8.3 | Revenue by service | ☐ | Reports API: `type=services` |
| 8.4 | No-show rate visible | ☐ | Dashboard/overview report |
| 8.5 | Gift card liability (if applicable) | ☐ | `/admin/gift-cards` |
| 8.6 | Processing fees (reconcile with Stripe) | ☐ | |
| 8.7 | SMS spend (if tracked) | ☐ | |
| 8.8 | Data exportable (CSV or equivalent) where required | ☐ | |

**Verification steps:**
- [ ] Open `/admin` and `/admin/reports`; select date range; confirm numbers match at least one known transaction/visit.
- [ ] Run `/api/reports?type=overview` and `type=revenue` for a known period; spot-check totals.
- [ ] Confirm no report is labeled "demo" or "sample" and all numbers tie to real data.

**Critical confirmation:** *"Every report can be traced back to real transactions or visits."*

---

## 9. Infrastructure & Environment

| # | Check | Pass | Notes |
|---|--------|:----:|-------|
| 9.1 | Production, staging, and dev environments separated | ☐ | |
| 9.2 | No test credentials in production (Stripe, Telnyx, DB) | ☐ | |
| 9.3 | Environment variables secured (Vercel/hosting secrets, no .env in repo) | ☐ | |
| 9.4 | HTTPS enforced everywhere | ☐ | |
| 9.5 | Backups configured and tested (Supabase/DB) | ☐ | |
| 9.6 | Disaster recovery plan documented | ☐ | |
| 9.7 | No hardcoded secrets in repo | ☐ | `grep -r "sk_live\|api_key.*=.*['\"]" --include="*.ts" --include="*.tsx" .` → expect only env refs |

**Verification steps:**
- [ ] Confirm production URL uses HTTPS only.
- [ ] Confirm production env uses live Stripe keys and production DB.
- [ ] Run a backup restore test (or confirm with DB host).

---

## 10. Critical User Flows (Smoke Test)

| # | Flow | Pass | Notes |
|---|------|:----:|-------|
| 10.1 | **Admin:** Log in → Dashboard loads with real counts | ☐ | |
| 10.2 | **Admin:** Calendar shows today’s appointments | ☐ | `/admin/calendar` |
| 10.3 | **Admin:** Create new client → appears in client list | ☐ | `/admin/clients/new` |
| 10.4 | **Admin:** Book appointment (existing client, service, provider, time) → appears on calendar | ☐ | `/admin/appointments/new` |
| 10.5 | **Admin:** Open appointment → update status (e.g. Checked In → Completed) | ☐ | `/admin/appointments/[id]` |
| 10.6 | **POS:** Search client → add service → process payment (Stripe live) → payment appears in Payments | ☐ | `/admin/pos` or `/pos` |
| 10.7 | **Consents:** Open consents list → open template → confirm signed consents visible | ☐ | `/admin/consents` |
| 10.8 | **Reports:** Open Reports → switch Overview / Services / Providers → data loads | ☐ | `/admin/reports` |
| 10.9 | **Services:** Services list loads; pricing correct | ☐ | `/admin/services` |
| 10.10 | **Portal (optional):** Client can log in and see own appointments/profile | ☐ | `/portal` |

---

## Final Sign-Off

This ticket is not complete until the following written confirmations are provided:

| Confirmation | Provided by | Date |
|--------------|-------------|------|
| All production tables are live data only; no mock/test data. | | |
| Stripe and Telnyx are live and compliant; no PHI to Stripe; SMS TCPA-compliant. | | |
| Consents are immutable and producible with timestamp and IP. | | |
| Audit logging and role-based access are in place as documented. | | |
| System is safe for daily clinical use and replaces Fresha for go-live. | | |

**Optional statement to include (recommended):**

*"This system is now replacing Fresha in production. I confirm that it is live, compliant, and legally safe to operate with real patients, payments, and messaging. This checklist has been completed as the final production readiness audit."*

---

**Document version:** 1.0  
**Last updated:** 2026  
**Related:** Production Readiness ticket, `docs/DAILY-OPERATIONS.md`
