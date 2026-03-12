# Hello Gorgeous Med Spa - Booking System Protocol

> **CRITICAL RULE**: The calendar must be the single source of truth. Every appointment must exist in the `appointments` table before rendering. Never generate appointments in the UI first.

## System Architecture

### Frontend
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS
- **Calendar**: Custom Boulevard-style component with drag-drop support

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with RBAC
- **APIs**: Next.js API Routes

### Core Entities

| Table | Purpose |
|-------|---------|
| `appointments` | All scheduled appointments |
| `clients` | Client profiles with medical history |
| `services` | Service catalog with pricing/duration |
| `providers` | Staff with schedules and service permissions |
| `resources` | Rooms and devices for booking |
| `chart_notes` | Clinical documentation |
| `inventory_lots` | Injectable lot tracking |
| `sales` | Payment transactions |

---

## Calendar Interface

### Views Available
- **Day View**: Single day with provider columns
- **Week View**: 7-day overview
- **Provider View**: Per-provider timeline

### Calendar Features
- Click empty slot → Quick book modal
- Drag appointment → Reschedule (updates `starts_at`, `provider_id`)
- Color coded by provider
- Shows: client name, service, duration, status

### Status Flow
```
BOOKED → CONFIRMED → CHECKED_IN → IN_SERVICE → COMPLETED
                                              ↘ NO_SHOW
                                              ↘ CANCELLED
```

---

## Appointment Creation Flow

### Step 1: Client Selection
- Search existing clients by name/phone/email
- Create new client inline if needed
- Fields: `first_name`, `last_name`, `phone`, `email`, `date_of_birth`

### Step 2: Service Selection
- Services grouped by category
- Each service contains:
  - `duration_minutes`
  - `price_cents`
  - `requires_consent`
  - `required_resource_type` (room/device)

### Step 3: Provider Assignment
- Auto-suggests available providers
- Validates:
  - Provider is working that day (`provider_schedules`)
  - Provider offers that service (`services_offered`)
  - No overlapping appointments

### Step 4: Room/Device (Optional)
- Assign treatment room or device
- Prevents double-booking of resources

### Step 5: Time Confirmation
- System validates before saving:
  - `PROVIDER_CONFLICT` - Provider already booked
  - `ROOM_CONFLICT` - Resource already booked
  - `SLOT_UNAVAILABLE` - Outside working hours

---

## Conflict Detection

### Provider Conflicts
```sql
SELECT id FROM appointments
WHERE provider_id = $provider_id
  AND status NOT IN ('cancelled', 'no_show')
  AND starts_at < $ends_at
  AND ends_at > $starts_at
```

### Resource Conflicts
```sql
SELECT id FROM appointments
WHERE resource_id = $resource_id
  AND status NOT IN ('cancelled', 'no_show')
  AND starts_at < $ends_at
  AND ends_at > $starts_at
```

### Error Responses
- `409 PROVIDER_CONFLICT` - Provider has overlapping appointment
- `409 ROOM_CONFLICT` - Room/device has overlapping booking

---

## Client Profile System

### Client Record Contains
- Contact info (name, phone, email, address)
- Date of birth
- Medical history summary
- Allergies summary
- Emergency contact
- Internal notes
- VIP status
- Marketing consent flags

### Linked Data
- `client_intakes` - Medical intake forms
- `client_consents` / `signed_consents` - Consent forms
- `treatment_photos` - Before/after images
- `chart_notes` - Clinical documentation
- `sales` - Payment history
- `appointments` - Visit history

---

## Charting System (Med Spa Specific)

### Note Types
- **SOAP** - Standard clinical note
- **Injection** - Injectable treatments
- **IV** - Vitamin/IV therapy
- **Hormone** - BHRT documentation
- **General** - Free-form notes

### Injectable Tracking
- Product name
- Units/syringes used
- Lot number (from `inventory_lots`)
- Expiration date
- Injection areas
- Consent verified checkbox

### Lot Tracking
- `inventory_items` - Product catalog
- `inventory_lots` - Lot-level tracking with expiration
- `inventory_transactions` - Usage log per treatment

---

## Automation System

### Trigger Events
| Event | Timing | Action |
|-------|--------|--------|
| `reminder_24h` | 24 hours before | SMS/Email reminder |
| `reminder_2h` | 2 hours before | SMS reminder |
| `post_treatment_followup` | 24 hours after | Aftercare email |
| `review_request` | 48 hours after | Google review SMS |
| `rebooking_reminder` | 90 days after | Rebook prompt |

### Message Queue
- `message_queue` table stores pending messages
- Cron job processes queue via `/api/automation/queue/process`
- Respects `unsubscribes` and consent flags

---

## POS Integration

### Payment Methods
- Square Terminal (card payments)
- Cash
- Gift Card (internal tracking)
- Package credits
- Membership benefits

### Checkout Flow
1. Service completed → Click "Checkout"
2. Invoice created with line items
3. Apply discounts/tips/deposits
4. Process payment (Square/cash/gift card)
5. Mark appointment `completed`
6. Generate receipt

---

## Permissions (RBAC)

| Role | Capabilities |
|------|--------------|
| **Owner** | Full access, revenue, staff management |
| **Manager** | Calendar, clients, reporting |
| **Provider** | Own calendar, charting, POS |
| **Front Desk** | Calendar, client check-in, payments |

---

## API Endpoints

### Calendar & Appointments
- `GET /api/appointments?date=YYYY-MM-DD` - List by date
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### Clients
- `GET /api/clients?search=` - Search clients
- `POST /api/clients` - Create client
- `GET /api/clients/[id]` - Client details

### Services & Providers
- `GET /api/services` - Service catalog
- `GET /api/providers` - Provider list
- `GET /api/providers/[id]/schedules` - Working hours
- `GET /api/resources` - Rooms and devices

### Charting
- `GET /api/chart-notes?client_id=` - Client's notes
- `POST /api/chart-notes` - Create note
- `GET /api/chart-notes/[id]` - Note details

### Automation
- `POST /api/automation/queue/enqueue` - Queue messages
- `POST /api/automation/queue/process` - Send messages

---

## Database Validation Rules

### Required for All Appointments
- `client_id` OR walk-in flag
- `service_id`
- `provider_id`
- `starts_at` (timestamptz)
- `ends_at` (calculated from duration)

### Optional Fields
- `resource_id` (room/device)
- `notes` / `client_notes`
- `deposit_amount_cents`

---

## Critical Development Rules

1. **Calendar First**: Never render appointments not in the database
2. **Conflict Check**: Always validate before INSERT
3. **Status Transitions**: Use valid status enum values only
4. **Timestamps**: Use UTC with timezone (`TIMESTAMPTZ`)
5. **Soft Delete**: Use status `cancelled`, never DELETE
6. **Audit Trail**: Log all changes to `audit_logs`

---

## Med Spa Specific Modules

These extend the base Fresha-style system:

| Module | Purpose |
|--------|---------|
| Treatment Charting | SOAP notes with injection mapping |
| Before/After Photos | Encrypted photo storage |
| Consent Forms | Digital signatures, version tracking |
| Package Tracking | Multi-visit packages with balance |
| Device Usage Logs | Morpheus8, CO2 laser settings |
| Injectable Lot Tracking | FDA compliance with lot/expiration |

---

## File Locations

```
/app/admin/calendar/page.tsx     - Main calendar interface
/app/api/appointments/route.ts   - Appointment CRUD
/app/api/clients/route.ts        - Client management
/app/api/services/route.ts       - Service catalog
/app/api/providers/route.ts      - Provider management
/app/api/resources/route.ts      - Rooms/devices
/app/api/chart-notes/route.ts    - Clinical charting
/app/pos/page.tsx                - Point of sale
/lib/hgos/schema*.sql            - Database schemas
```

---

*Last Updated: March 2026*
*Version: 2.0*
