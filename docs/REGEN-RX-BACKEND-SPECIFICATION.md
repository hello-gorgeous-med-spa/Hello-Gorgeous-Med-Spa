# REGEN RX Backend Specification

> **Last Updated:** September 3, 2026  
> **Status:** ACTIVE DEVELOPMENT GUIDE  
> **Purpose:** Developer-ready specification for compliant telehealth operations

---

## Golden Rule

**REGEN owns the patient relationship, clinical workflow, payments, and support.**  
**Formulation RX handles pharmacy fulfillment AFTER a licensed provider approves and signs the prescription.**

The API transports prescription information — it does NOT prescribe or replace Ryan's clinical judgment.

---

## The Three Portals

### 1. Patient Portal (`/regen/account`)

| Function | Description |
|----------|-------------|
| Illinois location verification | Confirm patient is physically in IL at time of service |
| Identity verification | ID upload, address verification |
| Consent | HIPAA, telehealth consent, treatment consent |
| Medical intake | Health history, current conditions |
| Medication/allergy history | Current meds, known allergies |
| Lab uploads | Patient can upload lab results |
| Secure messaging | HIPAA-compliant communication with provider |
| Payment method | Stored cards, subscription management |
| Order status | Real-time tracking from Formulation Rx |
| Refills | Request refill (creates provider review task) |
| Cancellation | Cancel subscription/orders |

### 2. Provider Portal (`/regen/ops` - Ryan/Dr. Arora view)

| Function | Description |
|----------|-------------|
| Review queue | Pending patient intakes awaiting clinical review |
| Contraindication alerts | Automatic flags for drug interactions, conditions |
| Labs review | View uploaded/ordered lab results |
| Medical documentation | Clinical notes, assessment |
| Follow-up requests | Request more info, labs, or video visit |
| Video-visit requirement | Flag patients requiring synchronous visit |
| Approve/decline decision | Clinical determination with documentation |
| Prescription selection | Choose from REGEN-approved formulary only |
| Electronic signature | Legal Rx signature |
| Monitoring schedule | Set follow-up intervals |

### 3. Admin Portal (`/regen/ops` - Damara/Danielle view)

| Function | Description |
|----------|-------------|
| Payment status | View all transactions |
| Refunds | Process refunds |
| Subscriptions | Manage patient subscriptions |
| Pharmacy exceptions | Handle Formulation Rx clarification requests |
| Shipment tracking | Monitor delivery status |
| Patient support | Handle non-clinical inquiries |
| Performance reports | Revenue, conversion, retention metrics |

⚠️ **CRITICAL**: Admin portal has **NO ability to prescribe or change dosing**.

---

## Correct Patient Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                  LICENSED PROVIDER REVIEW                    │
│                      (Ryan / Dr. Arora)                      │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Need information│  │ Verify identity │  │ Not appropriate │
│ labs or video   │  │ and Illinois    │  │                 │
│                 │  │ location        │  │                 │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         ▼                    │                    ▼
┌─────────────────┐           │           ┌─────────────────┐
│ Consent and     │           │           │ Decline,        │
│ program-specific│◄──────────┘           │ referral and    │
│ intake          │                       │ payment release │
└────────┬────────┘                       └─────────────────┘
         │
         ▼ (Approved and signed)
┌─────────────────────────────────────────────────────────────┐
│              SEND PRESCRIPTION TO FORMULATION RX             │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│           Accepted → Processing → Shipped                    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              FOLLOW-UP AND RENEWAL REVIEW                    │
│     (Each renewal creates a provider-review task)            │
└─────────────────────────────────────────────────────────────┘
```

**IMPORTANT**: Refill subscriptions can automate reminders and payment, but they must NEVER automatically generate another prescription. Each renewal creates a provider-review task.

---

## Technical Requirements

### API Security

- [ ] Formulation API key **EXCLUSIVELY on server** — never in browser/frontend
- [ ] Every order gets a REGEN order ID AND stores the corresponding pharmacy ID
- [ ] Verify webhook signatures from Formulation Rx
- [ ] Webhooks must be **idempotent** — duplicate notifications cannot create duplicate orders
- [ ] Automatic retry logic when API calls fail
- [ ] Staff alerts on API failures
- [ ] Daily reconciliation: REGEN orders vs Formulation orders

### Order Status History (Permanent)

Every order must maintain a complete status history:

```typescript
type OrderStatus = 
  | 'intake_submitted'
  | 'pending_provider_review'
  | 'provider_approved'
  | 'provider_declined'
  | 'needs_more_info'
  | 'needs_labs'
  | 'needs_video'
  | 'prescription_signed'
  | 'submitted_to_pharmacy'
  | 'pharmacy_accepted'
  | 'pharmacy_clarification'
  | 'pharmacy_processing'
  | 'pharmacy_compounding'
  | 'pharmacy_shipped'
  | 'pharmacy_delivered'
  | 'canceled'
  | 'failed';

interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: string;
  actor: string; // user ID who made the change
  notes?: string;
  metadata?: Record<string, any>;
}
```

### Price Snapshots

**CRITICAL**: Snapshot these values on every order so price changes don't rewrite historical reports:

- Pharmacy cost at time of order
- Patient price at time of order
- Shipping charge at time of order
- Any discounts/promo codes applied

### Environment Separation

- [ ] Test and production systems **completely separate**
- [ ] Separate API keys for test vs production
- [ ] Separate databases
- [ ] Clear visual indicator in UI for test environment

### PHI Protection

**NEVER put patient information in:**
- Ordinary email
- Slack
- Analytics tools
- Session replay tools (FullStory, Hotjar, etc.)
- Technical error logs
- Browser console
- URL parameters

---

## Security Requirements

### Authentication

- [ ] MFA required for: Ryan, Dr. Arora, Danielle, all staff accounts
- [ ] Individual logins — **NO shared "office" accounts**
- [ ] Role-based permissions (see Roles section)
- [ ] Automatic session timeout (15-30 minutes of inactivity)

### Encryption

- [ ] Encryption in transit (TLS 1.2+)
- [ ] Encryption at rest (database, backups)
- [ ] Encrypted backups
- [ ] Tested restoration procedure (quarterly test)

### Audit & Compliance

- [ ] Complete audit logs (who did what, when)
- [ ] Written breach procedures
- [ ] Written downtime procedures
- [ ] BAA in place with every vendor touching PHI:
  - Hosting (Vercel)
  - Database (Supabase)
  - Messaging
  - Video (Doxy.me)
  - Analytics
  - Support platforms

---

## Role-Based Permissions

### Owner (Danielle)
- Full admin access
- Financial reports
- Staff management
- Pricing changes
- Marketing approvals
- ❌ Cannot: approve prescriptions, change dosing

### Prescriber (Ryan)
- Provider portal full access
- Approve/decline intakes
- Sign prescriptions
- Clinical documentation
- Patient messaging (clinical)
- ❌ Cannot: change pricing, process refunds, access financial reports

### Supervising MD (Dr. Arora)
- Protocol approval
- Formulary oversight
- Chart quality review
- Escalation handling
- ❌ Cannot: day-to-day intake review (unless escalated)

### Operations Manager (Damara)
- Admin portal access
- Payment status (view)
- Refunds (process)
- Subscription management
- Shipping tracking
- Patient support (non-clinical)
- ❌ Cannot: approve prescriptions, change dosing, medication selection, promise approval

### Support Staff
- Limited admin access
- Enrollment assistance
- Missing information requests
- Scheduling
- Shipping questions
- Retention outreach
- ❌ Cannot: medication selection, dosing recommendations, promise approval

---

## Product Approval Table

**NOT everything Formulation offers should be on the consumer site.**

```sql
CREATE TABLE regen_approved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Formulation Rx reference
  pharmacy_product_id VARCHAR(50) NOT NULL,
  pharmacy_sku VARCHAR(50),
  
  -- Availability
  illinois_available BOOLEAN DEFAULT false,
  consumer_marketing_approved BOOLEAN DEFAULT false,
  provider_only_visible BOOLEAN DEFAULT true,
  
  -- Clinical requirements
  requires_labs BOOLEAN DEFAULT false,
  requires_video_encounter BOOLEAN DEFAULT false,
  controlled_substance_workflow BOOLEAN DEFAULT false,
  clinical_protocol_version VARCHAR(20),
  
  -- Pricing (from pharmacy, NOT auto-synced)
  current_pharmacy_cost DECIMAL(10,2),
  current_patient_price DECIMAL(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending_approval',
  -- pending_approval, approved, suspended, discontinued
  
  -- Audit
  last_pharmacy_verification DATE,
  approved_by UUID REFERENCES staff(id),
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Launch Recommendation

Start with **5-8 carefully approved programs**:

1. ✅ Semaglutide (Weight Loss)
2. ✅ Tirzepatide (Weight Loss)
3. ✅ B12 Injection
4. ✅ Biotin Injection
5. ✅ Glutathione
6. ⚠️ NAD+ (needs clinical protocol review)
7. ⚠️ Sermorelin (needs compliance review)
8. ⚠️ Hormone Therapy (needs protocol finalization)

**Peptides that raised compliance concerns** should remain provider-facing until Formulation, Dr. Arora, and healthcare counsel approve exact products and consumer-facing language.

---

## Immediate Site Corrections Required

### 1. Remove "No Video Calls" Promise

**Current (WRONG):**
> "No video calls required"

**Correct:**
> "Most visits begin online. Your provider may request labs, additional information, a video visit, or an in-person evaluation when clinically necessary."

### 2. Centralize All Pricing

Prices currently differ between homepage, pricing page, and printed materials.

**Solution:** Backend should be the SINGLE pricing source for:
- Website display
- Patient checkout
- Admin portal
- Marketing materials

### 3. Correct Pharmacy Terminology

**WRONG:**
- "FDA-approved pharmacy"
- "FDA pharmacy"

**CORRECT:**
> "Formulation Rx is a licensed 503A compounding pharmacy. Compounded medications are patient-specific and are not reviewed or approved by FDA."

### 4. Review Aggressive Claims

These need pharmacy-approved evidence and medical/legal review:
- "100% absorption"
- "Detox"
- "Telomerase activation"
- "Healing peptides"
- Guaranteed energy claims
- Anti-aging outcome guarantees

### 5. Verify Testimonials & Statistics

Document that these are real, authorized, and properly substantiated:
- Weight-loss calculator methodology
- "95% satisfaction" statistic
- Specific compensated testimonials

### 6. Standardize Legal Entity

Current inconsistencies:
- Hello Gorgeous PC
- Hello Gorgeous Med Spa LLC
- Hello Gorgeous Med Spa

Also: Provider page uses "she" but provider is Ryan.

**Action:** Have counsel confirm correct clinical entity and use EVERYWHERE.

---

## Illinois & Controlled Substance Safeguards

### Location Verification

At **every encounter**, record where patient is physically located.

> Illinois requires the treating telehealth professional to be licensed or authorized in Illinois when the patient is located in Illinois.

### Controlled Substance Pathways

Separate technically from ordinary skincare/vitamin orders:
- TRT
- Any Schedule III-V medications

**Federal telemedicine prescribing flexibility extends through December 31, 2026**, but prescriptions must:
- Serve legitimate medical purpose
- Comply with federal and state requirements

**Build system so video/in-person requirements can be activated without rewriting the portal when rules change.**

---

## Management Structure

| Role | Responsibilities |
|------|------------------|
| **Danielle (CEO)** | Operations, pricing, marketing, finances, pharmacy relationship, customer service standards |
| **Ryan (Prescriber)** | Clinical intake queue, patient decisions, prescriptions, follow-ups, adverse event response |
| **Dr. Arora (Supervising MD)** | Protocol approval, formulary oversight, chart quality review, escalation of complex cases |
| **Damara/Support** | Enrollment assistance, missing info, scheduling, shipping questions, retention — **NO medication selection, dosing, or promises of approval** |
| **Developer** | Uptime, security, integration reliability, logs, backups, monthly technical reporting |

---

## Dashboard Metrics

### Conversion Funnel
- Visitors who begin intake
- Intake completion rate
- Provider approval/decline rate
- Average time awaiting provider review

### Operations
- Pharmacy acceptance time
- Failed API submissions
- Pharmacy clarification requests
- Delivery delays

### Financial
- Gross profit per completed order
- Refunds and chargebacks

### Retention
- 30-day retention
- 60-day retention
- 90-day retention

### Quality
- Unanswered patient messages
- Side effects reported
- Complaints
- Escalations

### Operational Cadence

| Frequency | Task |
|-----------|------|
| **Daily** | Clear exception queues |
| **Weekly** | Ryan/Dr. Arora audit sample of charts |
| **Monthly** | Compare pharmacy invoices vs patient charges |
| **Monthly** | Review every active product: pricing, availability, compliant marketing |

---

## Database Schema (Core Tables)

```sql
-- Patients
CREATE TABLE regen_patients (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  
  -- Location verification
  state VARCHAR(2),
  last_verified_location VARCHAR(100),
  last_verified_at TIMESTAMP,
  
  -- Identity verification
  id_verified BOOLEAN DEFAULT false,
  id_verified_at TIMESTAMP,
  
  -- Auth
  supabase_auth_id UUID,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Intakes
CREATE TABLE regen_intakes (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES regen_patients(id),
  
  -- Program
  goal VARCHAR(50) NOT NULL,
  
  -- Medical info
  medical_history JSONB,
  current_medications JSONB,
  allergies JSONB,
  
  -- Consents
  hipaa_consent_at TIMESTAMP,
  telehealth_consent_at TIMESTAMP,
  treatment_consent_at TIMESTAMP,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, under_review, approved, declined, needs_info, needs_labs, needs_video
  
  -- Provider review
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE regen_orders (
  id UUID PRIMARY KEY,
  regen_order_id VARCHAR(50) UNIQUE NOT NULL, -- REGEN-2024-XXXXX
  
  patient_id UUID REFERENCES regen_patients(id),
  intake_id UUID REFERENCES regen_intakes(id),
  
  -- Pharmacy reference
  pharmacy_order_id VARCHAR(50),
  pharmacy_name VARCHAR(100) DEFAULT 'Formulation Rx',
  
  -- Price snapshot (NEVER CHANGE AFTER ORDER)
  pharmacy_cost_snapshot DECIMAL(10,2),
  patient_price_snapshot DECIMAL(10,2),
  shipping_snapshot DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  promo_code VARCHAR(50),
  
  -- Status
  current_status VARCHAR(50),
  
  -- Tracking
  tracking_number VARCHAR(100),
  tracking_carrier VARCHAR(50),
  
  -- Prescription
  prescription_signed_by UUID,
  prescription_signed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Status History (append-only)
CREATE TABLE regen_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES regen_orders(id),
  
  status VARCHAR(50) NOT NULL,
  actor_id UUID, -- staff or system
  actor_type VARCHAR(20), -- 'staff', 'patient', 'system', 'pharmacy_webhook'
  notes TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE regen_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  actor_id UUID,
  actor_type VARCHAR(20),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  
  ip_address INET,
  user_agent TEXT,
  
  details JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Next Steps

1. **Immediate:** Fix site copy issues (video calls, pharmacy terminology, legal entity)
2. **This week:** Implement product approval table
3. **This week:** Add role-based permissions to ops portal
4. **Next week:** Build provider review queue with clinical workflow
5. **Next week:** Implement order status history tracking
6. **Ongoing:** Create BAA inventory for all vendors

---

*This document is the authoritative specification for REGEN RX backend development. All development work should reference this document. Updates require review by Danielle and clinical sign-off from Ryan/Dr. Arora.*
