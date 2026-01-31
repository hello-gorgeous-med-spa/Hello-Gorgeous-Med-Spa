# Admin Panel Fixes Checklist

**Hello Gorgeous Med Spa - Admin Audit & Fix List**  
**Date:** January 31, 2026

---

## CRITICAL ISSUES (Breaking Functionality)

### 1. Provider/Staff Data
- [ ] **Remove "Jessica Smith"** and other old employees from all pages
- [ ] **Only show active providers:** Ryan Kent FNP-BC and Danielle Alcala RN-S
- [ ] Fix hardcoded provider names in:
  - [ ] `/admin/appointments/page.tsx`
  - [ ] `/admin/appointments/[id]/page.tsx`
  - [ ] `/admin/appointments/new/page.tsx`
  - [ ] `/admin/compliance/page.tsx`
  - [ ] `/admin/medications/page.tsx`
  - [ ] `/admin/staff/page.tsx`
  - [ ] `/admin/staff/schedule/page.tsx`
  - [ ] `/admin/users/page.tsx`

### 2. Navigation Issues
- [ ] **Remove "Provider View" link** from admin sidebar
- [ ] Fix navigation header to be professional (not pulling from website)
- [ ] Fix links going to `/provider/*` (should be `/admin/*`)

### 3. Edit Functionality Not Working
- [ ] Appointment Check-In button does nothing
- [ ] Appointment Cancel button does nothing
- [ ] Appointment Edit button does nothing
- [ ] Client Edit button does nothing
- [ ] Services Edit shows alert instead of saving
- [ ] Staff "Add Team Member" does nothing
- [ ] Membership "Add Member" does nothing
- [ ] Gift Cards Redeem/History buttons do nothing

---

## HIGH PRIORITY (Demo/Placeholder Data)

### 4. Pages Using Fake MOCK_* Data Instead of Database

| Page | Mock Data | Should Be |
|------|-----------|-----------|
| `/admin/appointments` | MOCK_APPOINTMENTS | Database query |
| `/admin/appointments/[id]` | MOCK_APPOINTMENT | Fetch by ID |
| `/admin/appointments/new` | MOCK_SERVICES, PROVIDERS | Database |
| `/admin/clients/[id]` | MOCK_CLIENT, MOCK_APPOINTMENTS | Database |
| `/admin/compliance` | MOCK_COMPLIANCE_STATUS | Database |
| `/admin/consents` | Hardcoded counts | Calculate from DB |
| `/admin/fax` | recentFaxes array | eFax API/DB |
| `/admin/gift-cards` | MOCK_GIFT_CARDS | Database |
| `/admin/marketing` | MOCK_CAMPAIGNS | Database |
| `/admin/medications` | MOCK_MEDICATIONS | Database |
| `/admin/memberships` | MOCK_MEMBERS | Database |
| `/admin/memberships/manage` | MOCK_MEMBERSHIPS | Database |
| `/admin/payments` | MOCK_PAYMENTS | Stripe/Database |
| `/admin/staff` | MOCK_STAFF | Database |
| `/admin/users` | MOCK_USERS | Database |

---

## MEDIUM PRIORITY (Missing Features)

### 5. Schedule Management
- [ ] **Block time functionality** - providers can block their schedules
- [ ] **Shift management** - change working hours
- [ ] **Closed days** - mark business closed dates
- [ ] **Holidays** - add holiday closures
- [ ] **Time-off requests** - vacation/sick days
- [ ] Save schedule changes to database (currently has TODO)

### 6. Calendar Functionality
- [ ] Time slots should respect provider availability
- [ ] Appointments should be draggable/editable
- [ ] Double-click to edit appointment
- [ ] Schedule conflicts detection

---

## LOW PRIORITY (Nice to Have)

### 7. Demo Mode Alerts to Replace
- [ ] Payment processing shows "Demo mode" alert
- [ ] Marketing shows "Demo mode" when creating campaign
- [ ] Inventory shows "Connect Supabase to save"
- [ ] Gift cards shows "Demo mode"
- [ ] Services shows "would save to Supabase"

### 8. Hardcoded Statistics to Calculate
- [ ] Dashboard totals
- [ ] Consent form counts (8,906 signed, 12 expiring)
- [ ] Marketing stats (3,245 subscribers, 43% open rate)
- [ ] Medication stats (47 active, 189 total)
- [ ] Membership stats (127 active, $4,683 revenue)
- [ ] Audience estimates in campaign builder

---

## FIX PROGRESS

### Completed ✅
- [x] Remove "Provider View" from admin navigation
- [x] Fix navigation to be professional
- [x] Update Staff page - only Ryan Kent & Danielle Alcala
- [x] Update Users page - removed old employees (Jessica Smith, Admin User)
- [x] Update Appointments page - correct provider names
- [x] Update Compliance page - correct provider credentials
- [x] Update Medications page - correct provider name
- [x] Update New Appointment page - correct providers
- [x] Add Schedule Management with tabs
- [x] Add Schedule Blocking functionality
- [x] Add Holidays management
- [x] Add Closed Days management
- [x] Fix appointment Check In button
- [x] Fix appointment Cancel button
- [x] Fix appointment status flow (Start, Complete, No-Show)
- [x] Fix Chart links to go to /admin/charts instead of /provider
- [x] Create central providers.ts configuration

### In Progress 🔄
- [ ] Fix remaining pages with MOCK data

### Blocked ⏸️
- [ ] Payment processing (needs Stripe setup)

---

## Provider Information

**Active Providers (ONLY these should appear):**

1. **Ryan Kent, FNP-BC**
   - Role: Nurse Practitioner
   - Services: Injectables, Weight Loss, IV Therapy

2. **Danielle Alcala, RN-S/CNA**
   - Role: Owner / Registered Nurse
   - Services: All services

---

*Update this checklist as fixes are completed.*
