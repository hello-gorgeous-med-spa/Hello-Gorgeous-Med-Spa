# Hello Gorgeous Med Spa OS — Provider Governance + Clinical Ops Architecture

**Product / Technical Specification**  
**Owner:** Danielle Alcala / Hello Gorgeous Med Spa  
**Status:** Spec — build in phases below.

---

## 1. Overview

Build the med spa operating system using a **two-layer architecture**: a **Business OS** (spa-owned, owner-controlled) and a **Clinical Governance Layer** (provider oversight where legally required). Centralize practice management, scheduling, patient engagement, payments, inventory, and compliance in one business system; keep clinical controls (protocols, standing orders, credential tracking) separate and provider-auditable.

**Non-negotiable objective:** Protect Hello Gorgeous from implied partnership claims, provider ownership confusion, patient-list theft, protocol misuse, financial-control drift, and single-provider dependency. **Owner control first, provider access second.**

---

## 2. Architecture: Two Layers

### Layer 1 — Business OS (Hello Gorgeous–owned)

Fully controlled by Danielle Alcala / Hello Gorgeous Med Spa. Must contain:

| Capability | Notes |
|------------|--------|
| CRM / patient records | Ownership at **spa level** only |
| Scheduling | Central calendar; provider is assignee, not owner |
| Memberships / packages | Spa product, not provider asset |
| POS / payments | Spa entity; no provider profit-share/equity in system |
| Inventory and lot tracking | Spa-owned |
| Vendor accounts | Spa-owned; provider ordering only if permitted |
| Device registry | Business assets → spa owner |
| Document vault | Agreements, amendments, versioned protocols |
| Marketing / automations | Spa-owned |
| Reporting dashboard | Owner/admin; exports audited |
| Compliance dashboard | Alerts, expirations, audit trail |
| Staff permissions | Role-based; no ownership unless super_owner override |
| Export logs / audit logs | All exports and sensitive actions logged |

### Layer 2 — Clinical Governance Layer (provider-controlled where required)

For licensed provider oversight only. Must contain:

| Capability | Notes |
|------------|--------|
| Active medical director record | Single designated MD; backup optional |
| Backup provider record | Credential completion %, agreement status, activation flag |
| Protocol approvals | Versioned; approved_by_provider_id, review_due_date |
| Standing orders | Per provider/service; review-dated |
| Chart audit workflow | Checklist; who audited, when |
| Consent templates | Versioned; linked to protocols |
| Clinical delegation acknowledgments | Stored in document vault |
| Provider credential tracking | License, NPI, DEA, malpractice, expiration |
| Malpractice / license expiration tracking | Alerts on dashboard |
| Emergency protocols | Versioned; approval dates |
| Review / renewal dates | On protocols, standing orders, agreements |

---

## 3. Critical Business Rules

1. **No provider as owner without override**  
   No provider may be treated as owner, partner, shareholder, or member unless **owner-only override** is manually applied by Danielle (super_owner).

2. **Patient ownership**  
   Patient ownership remains with **spa entity** (Hello Gorgeous Med Spa), not with any provider. `patients.spa_entity_owner` (or equivalent) = Hello Gorgeous Med Spa; `primary_provider_id` is assignee only.

3. **Compensation**  
   Allow only **fixed oversight fee** + **compensation for personally performed services**. Block “50/50 split,” “profit share,” “equity draw,” and “owner distribution” for non-owners.

4. **Financial permissions**  
   Default all financial permissions to **false**. Display everywhere: *“Administrative or operational access does not create ownership rights.”*

5. **Exports**  
   Block provider bulk export of full patient list, treatment history list, marketing list, photo library. Any export must be **owner-approved** and **logged**.

---

## 4. Core Database Objects

### 4.1 `providers` (extend existing)

**Fields to ensure (add if missing):**

| Field | Type | Constraint / Default |
|-------|------|----------------------|
| id | UUID | PK |
| user_id | UUID | FK auth.users (optional) |
| first_name | TEXT | |
| last_name | TEXT | |
| license_type | TEXT | e.g. MD, DO, APRN, RN |
| license_number | TEXT | |
| npi | TEXT | |
| dea | TEXT | nullable |
| status | TEXT | active, suspended, terminated |
| classification | TEXT | contractor, employee, medical_director |
| **ownership_status** | TEXT | **default 'none'**; CHECK IN ('none','owner','partner','shareholder','member') — only super_owner may set non-none |
| start_date | DATE | |
| end_date | DATE | nullable |
| is_active | BOOLEAN | default true |
| created_at, updated_at | TIMESTAMPTZ | |

**Validation (application + optional DB trigger):**  
`ownership_status` may be set to owner|partner|shareholder|member **only** when `current_user` has role `super_owner`.

---

### 4.2 `provider_documents`

| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| provider_id | UUID | FK providers |
| doc_type | TEXT | NOT NULL; see required types below |
| file_url | TEXT | storage path or URL |
| upload_date | DATE | |
| expiration_date | DATE | nullable |
| verified | BOOLEAN | default false |
| created_at, updated_at | TIMESTAMPTZ | |

**Required doc_types (enum or check):**  
`medical_director_agreement`, `license`, `malpractice`, `npi`, `dea_if_applicable`, `confidentiality`, `protocol_acknowledgment`, `non_solicit`.

---

### 4.3 `protocols`

| Field | Type | Constraint |
|-------|------|------------|
| protocol_id | UUID | PK |
| title | TEXT | NOT NULL |
| version | TEXT | e.g. "1.0" |
| approved_by_provider_id | UUID | FK providers, nullable |
| approval_date | DATE | nullable |
| review_due_date | DATE | |
| status | TEXT | draft, active, archived |
| attachment_url | TEXT | nullable |
| created_at, updated_at | TIMESTAMPTZ | |

---

### 4.4 `standing_orders`

| Field | Type | Constraint |
|-------|------|------------|
| standing_order_id | UUID | PK |
| provider_id | UUID | FK providers |
| service_type | TEXT | e.g. neurotoxin, filler, laser |
| issue_date | DATE | |
| review_due_date | DATE | |
| status | TEXT | active, expired, superseded |
| attachment_url | TEXT | nullable |
| created_at, updated_at | TIMESTAMPTZ | |

---

### 4.5 `patients` (or extend `clients`)

Ensure these concepts exist (spa ownership, primary provider as assignee):

| Field | Concept |
|-------|--------|
| patient_id (or client_id) | PK |
| **spa_entity_owner** | TEXT / FK — always Hello Gorgeous Med Spa |
| primary_provider_id | UUID FK — assignee only |
| consent_status | TEXT |
| photo_status | TEXT |
| chart_status | TEXT |

**Hard rule:** Patient ownership remains with spa entity, not provider.

---

### 4.6 `compensation_records`

| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| provider_id | UUID | FK providers |
| month | DATE | first of month |
| oversight_fee | INTEGER | cents |
| personally_performed_gross_sales | INTEGER | cents |
| production_rate | NUMERIC | e.g. 0.20 for 20% |
| production_compensation | INTEGER | cents |
| total_compensation | INTEGER | cents |
| created_at, updated_at | TIMESTAMPTZ | |

**Hard rule:** Allow only fixed oversight fee + compensation for personally performed services. Block profit-share/equity/owner distribution for non-owners (enforce in API and UI).

---

### 4.7 `financial_permissions`

| Field | Type | Default |
|-------|------|---------|
| id | UUID | PK |
| provider_id | UUID | FK providers UNIQUE |
| bank_access | BOOLEAN | false |
| vendor_ordering | BOOLEAN | false |
| refund_authority | BOOLEAN | false |
| contract_authority | BOOLEAN | false |
| pricing_authority | BOOLEAN | false |
| updated_at | TIMESTAMPTZ | |

**Default all to false.** Only super_owner may grant bank_access and contract_authority.

---

### 4.8 `audit_logs` (extend existing if present)

Track at least:

- patient export
- chart export
- report export
- pricing changes
- compensation changes
- user access changes
- protocol changes
- ownership_status changes

Fields: `id`, `action`, `entity_type`, `entity_id`, `actor_id`, `metadata` (JSONB), `created_at`.

---

### 4.9 `business_assets` (asset registry)

| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| asset_type | TEXT | device, domain, social_account, vendor_account, treatment_protocol, website, photography_library, marketing_asset, product_inventory_account |
| name | TEXT | |
| owner_entity | TEXT | **default 'Hello Gorgeous Med Spa'** |
| reference_id | TEXT | nullable; external ID or URL |
| metadata | JSONB | nullable |
| created_at, updated_at | TIMESTAMPTZ | |

**All assets must default owner = Hello Gorgeous Med Spa.**

---

## 5. Feature Modules

### A. Provider Governance Dashboard

**UI:** Single dashboard (e.g. Admin → Provider Governance or Clinical → Governance).

**Show:**

- Active medical director (name, contact, agreement end date)
- Backup provider readiness (name, credential %, agreement status, onboarding readiness, emergency activation flag)
- Expiring licenses (provider, license type, expiration date)
- Expiring malpractice (provider, expiration)
- Missing documents (by provider, doc_type)
- Unsigned protocols (protocol title, version)
- Unsigned standing orders (provider, service_type)
- Expiring agreement dates (medical director agreement, provider service agreement)

**API:**  
`GET /api/provider-governance/dashboard` — returns aggregated status (medical director, backup, expirations, missing docs, unsigned items).

---

### B. Agreement Vault

**UI:** Secure file list with versioning (Admin → Clinical → Agreement Vault or Document Vault).

**Store:**

- Signed medical director agreement (versioned)
- Provider service agreement (per provider)
- Amendments
- Termination notices

**Features:** Upload, version history, download (audit logged). Access restricted by role (e.g. super_owner, admin, compliance_manager).

**API:**

- `GET /api/agreement-vault?provider_id=&doc_type=`
- `POST /api/agreement-vault` — upload (multipart); creates provider_documents row + storage object
- `GET /api/agreement-vault/:id/download` — signed URL or stream; log in audit_logs

---

### C. Protocol Center

**UI:** Central list + detail (Admin → Clinical → Protocol Center). Align with existing Compliance Binder where applicable.

**Contents:**

- Neurotoxin protocol
- Filler protocol
- Vascular occlusion protocol
- Hyaluronidase protocol
- Laser safety protocol
- Consent forms (link to existing consent templates)
- Emergency kit checklist

**Features:** Version, approval by provider (approved_by_provider_id, approval_date), review_due_date, status, attachment. List view filters: status, review due.

**API:**

- `GET /api/protocols` — list with filters
- `GET /api/protocols/:id`
- `POST /api/protocols` — create (admin/super_owner)
- `PATCH /api/protocols/:id` — update; approval fields only by medical_director or super_owner
- `POST /api/protocols/:id/approve` — set approved_by, approval_date (medical_director)

---

### D. Patient Protection Controls

**Rules:**

- Block provider bulk export of: full patient list, treatment history list, marketing list, photo library.
- Any export request (e.g. CSV of patients, chart export) must be **owner-approved** (super_owner) and **logged** in audit_logs.

**UI:** Export actions require a second step or modal: “Request export” → creates pending request; super_owner sees queue and approves/denies. On approve, export runs and audit_logs entry created.

**API:**

- `POST /api/exports/request` — body: `{ type: 'patient_list' | 'chart_export' | 'report', scope }` → creates pending request
- `GET /api/exports/requests` — list pending (super_owner only)
- `POST /api/exports/requests/:id/approve` — super_owner only; runs export, logs, returns download link or stream
- `POST /api/exports/requests/:id/deny` — super_owner only

---

### E. Provider Offboarding Workflow

**Trigger:** Provider `status` or `end_date` set to terminated (or dedicated “Start offboarding” action).

**Steps (one-click or guided):**

1. Revoke admin access (user_profiles / role or provider-specific flags)
2. Revoke scheduling access (e.g. remove from scheduling pool)
3. Revoke chart export
4. Revoke vendor ordering (financial_permissions)
5. Archive agreements (status = archived in provider_documents or vault)
6. Start non-solicit timer (store offboarded_at, non_solicit_until if applicable)
7. Calculate final compensation (compensation_records for final month)
8. Generate offboarding PDF checklist (template with checkboxes and dates)

**API:**

- `POST /api/providers/:id/offboard` — runs steps 1–7, returns checklist data; optionally generate PDF and store in vault.
- `GET /api/providers/:id/offboarding-checklist` — PDF or HTML for download.

**UI:** Admin → Providers → [Provider] → “Offboard” button; confirm modal; then show checklist PDF download.

---

### F. Backup Provider Continuity

**UI:** Section on Provider Governance Dashboard or dedicated “Backup provider” page.

**Show:**

- Alternate provider candidates (list of providers with classification = backup or flag is_backup_candidate)
- Credential completion % (e.g. % of required provider_documents uploaded and verified)
- Agreement status (medical_director_agreement or provider service agreement signed)
- Onboarding readiness (composite: credentials + agreement + training if any)
- Emergency activation flag (boolean; when true, can be promoted to active medical director or backup)

**API:**

- `GET /api/provider-governance/backup-providers` — list with credential %, agreement status, readiness, activation flag
- `PATCH /api/providers/:id` — set emergency_activation_flag (super_owner or medical_director)

---

## 6. Permissions Model

**Roles:**

| Role | Description |
|------|-------------|
| super_owner | Danielle; only role that can change ownership_status, grant bank authority, approve patient DB export, modify compensation formulas, archive/delete audit logs, change asset ownership |
| admin | Full operational access; no ownership or export-approval |
| medical_director | Protocol/standing order approval; backup provider flag; cannot set ownership or financial permissions |
| provider | Own schedule, own charts, own compensation view; no export, no vendor ordering unless permitted |
| front_desk | Scheduling, check-in, no chart/export |
| injector | May be same as provider or limited scope |
| compliance_manager | Read compliance dashboard, protocol center, document vault; no ownership or financial |

**Only super_owner can:**

- Change `ownership_status` on providers
- Grant bank_access, contract_authority (financial_permissions)
- Approve patient database export
- Modify compensation formulas (e.g. production_rate)
- Archive/delete audit logs
- Change asset ownership tags (business_assets.owner_entity)

**UI:** Display everywhere: *“Administrative or operational access does not create ownership rights.”*

---

## 7. API Endpoints Summary

| Area | Method | Path | Purpose |
|------|--------|------|---------|
| Provider governance | GET | /api/provider-governance/dashboard | Dashboard aggregates |
| Provider governance | GET | /api/provider-governance/backup-providers | Backup list + readiness |
| Providers | PATCH | /api/providers/:id | Update provider; ownership_status only if super_owner |
| Providers | POST | /api/providers/:id/offboard | Run offboarding workflow |
| Providers | GET | /api/providers/:id/offboarding-checklist | Offboarding PDF/data |
| Agreement vault | GET | /api/agreement-vault | List; filter by provider_id, doc_type |
| Agreement vault | POST | /api/agreement-vault | Upload document |
| Agreement vault | GET | /api/agreement-vault/:id/download | Download (audit logged) |
| Protocols | GET | /api/protocols | List protocols |
| Protocols | GET | /api/protocols/:id | One protocol |
| Protocols | POST | /api/protocols | Create (admin/super_owner) |
| Protocols | PATCH | /api/protocols/:id | Update |
| Protocols | POST | /api/protocols/:id/approve | Approve (medical_director) |
| Standing orders | GET/POST/PATCH | /api/standing-orders | CRUD standing orders |
| Compensation | GET | /api/compensation | List (own or admin); no profit-share for non-owners |
| Compensation | POST/PATCH | /api/compensation | Create/update (super_owner only for formulas) |
| Financial permissions | GET/PATCH | /api/financial-permissions | By provider; PATCH only super_owner for bank/contract |
| Exports | POST | /api/exports/request | Request export (logged) |
| Exports | GET | /api/exports/requests | List pending (super_owner) |
| Exports | POST | /api/exports/requests/:id/approve | Approve (super_owner) |
| Business assets | GET/POST/PATCH | /api/business-assets | Registry; owner default Hello Gorgeous |
| Audit logs | GET | /api/audit-logs | Filter by action, entity, date (admin/super_owner) |

---

## 8. UI Screens Summary

| Screen | Route (suggested) | Purpose |
|--------|-------------------|--------|
| Provider Governance Dashboard | /admin/provider-governance or /admin/clinical/governance | Medical director, backup, expirations, missing docs, unsigned protocols/orders |
| Agreement Vault | /admin/clinical/agreement-vault | Upload/list/version agreements and amendments |
| Protocol Center | /admin/clinical/protocols | List/detail protocols; approve; review due dates |
| Standing Orders | /admin/clinical/standing-orders | List/detail by provider; review due |
| Provider list (extended) | /admin/providers or /admin/staff | Classification, ownership_status (read-only unless super_owner), status, offboard button |
| Provider detail | /admin/providers/[id] | Documents, permissions, compensation, offboarding |
| Export requests queue | /admin/exports/requests | super_owner: approve/deny export requests |
| Business asset registry | /admin/settings/asset-registry or /admin/owner/assets | List assets; owner = Hello Gorgeous; edit only super_owner |
| Audit logs | /admin/audit-logs (existing) | Extend for export, compensation, protocol, ownership changes |

---

## 9. Build Order (Phases)

### Phase 1

1. **providers** — Add/extend columns: license_type, license_number, npi, dea, status, classification, ownership_status (default 'none'), start_date, end_date.
2. **provider_documents** — Table + storage bucket for agreements, license, malpractice, NPI, DEA, confidentiality, protocol_acknowledgment, non_solicit.
3. **compensation_records** — Table; API to create/read; enforce “oversight fee + personally performed only” in service layer.
4. **financial_permissions** — Table; default all false; UI to show; PATCH restricted to super_owner for bank_access, contract_authority.
5. **protocols** — Table; Protocol Center UI (list + detail); approval by medical_director.

### Phase 2

6. **Provider Governance Dashboard** — Aggregate medical director, backup, expirations, missing docs, unsigned protocols/standing orders.
7. **Offboarding workflow** — One-click offboard; revoke access, archive docs, final comp, checklist PDF.
8. **Backup provider module** — Backup list, credential %, agreement status, readiness, emergency flag.
9. **Export audit logs** — Extend audit_logs; export request + approve flow (super_owner).
10. **business_assets** — Table + CRUD; default owner = Hello Gorgeous Med Spa.

### Phase 3

11. Lot tracking (inventory) — Link to protocols/safety.
12. Chart audit checklist — Workflow and storage.
13. Emergency response logs — Log when emergency protocols used.
14. Inspection readiness dashboard — Combine compliance + governance + binder.

---

## 10. Acceptance Criteria (Checklist)

- [ ] No provider appears as owner without explicit super_owner override.
- [ ] Compensation works as: e.g. $1,000 monthly oversight + 20% of gross sales from services personally performed by provider; no 50/50, profit share, equity, or owner distribution for non-owners.
- [ ] Patient ownership is attached to spa entity (Hello Gorgeous Med Spa); primary_provider_id is assignee only.
- [ ] Protocol documents are versioned and renewal-dated; approval by medical director stored.
- [ ] Provider offboarding is one-click and fully logged (access revoke, docs archived, final comp, checklist).
- [ ] All exports are auditable; bulk patient/chart export requires super_owner approval.
- [ ] Backup provider status is visible from dashboard (readiness %, agreement, activation flag).
- [ ] Agreement vault stores signed contract and amendments with versioning.
- [ ] Financial access and ownership are clearly separated in UI and DB logic; default financial permissions false; warning displayed.

---

## 11. Supabase / SQL

See migration file: **`supabase/migrations/YYYYMMDD_provider_governance_phase1.sql`** (created next) for:

- `providers` columns (ADD COLUMN IF NOT EXISTS)
- `provider_documents` table
- `protocols` table
- `standing_orders` table
- `compensation_records` table
- `financial_permissions` table
- `business_assets` table
- `audit_logs` extension if needed
- RLS policies (high level: service_role for admin APIs; or role-based policies per table)

---

*Document version: 1.0. Build for owner control first, provider access second.*
