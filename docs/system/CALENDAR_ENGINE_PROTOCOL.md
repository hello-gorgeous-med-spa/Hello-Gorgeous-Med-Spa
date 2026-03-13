# Hello Gorgeous Med Spa Calendar Engine Protocol

> The owner portal calendar is the core scheduling engine of the system.
> This is the single source of truth for all appointments.

## Core Rules

1. **The `appointments` table is the single source of truth.**
   - Calendar renders only persisted appointments from the database
   - No frontend-only scheduling logic
   - UI reflects database state, never the reverse

2. **All mutations validate on backend before commit.**
   - Create, move, resize, cancel, and reassignment actions
   - Provider conflicts block invalid changes
   - Room/device conflicts block invalid changes
   - Failed mutations return structured errors

3. **Provider and room/device conflicts must be enforced.**
   - `PROVIDER_CONFLICT` - Provider already has overlapping appointment
   - `ROOM_CONFLICT` - Resource already has overlapping booking
   - `INVALID_DURATION` - Duration doesn't match service
   - `OUTSIDE_WORKING_HOURS` - Outside provider schedule
   - `CLIENT_NOT_FOUND` - Client doesn't exist
   - `SERVICE_NOT_FOUND` - Service doesn't exist

4. **Every appointment must be auditable.**
   - `audit_logs` table tracks who changed what and when
   - Status changes are logged
   - Provider reassignments are logged
   - Reschedules are logged

5. **Appointment lifecycle statuses are enforced:**
   ```
   BOOKED → CONFIRMED → CHECKED_IN → IN_SERVICE → COMPLETED
                                                 ↘ NO_SHOW
                                                 ↘ CANCELLED
   ```

6. **Med spa appointments require additional tracking:**
   - Charting completion status
   - Device/room assignment
   - Consent form status
   - Lot number tracking (injectables)

7. **Owner/Admin users can verify workflow from appointment drawer.**

---

## Calendar UX Standards

### Default View
- **Day View with Provider Columns** (Fresha/Boulevard style)
- Time slots on left (15-minute intervals)
- Provider columns across top
- Appointments rendered as blocks

### Supported Views
| View | Description |
|------|-------------|
| Day | Single day, provider columns |
| 3-Day | Three days side-by-side |
| Week | 7-day overview |
| Provider | Single provider timeline |
| Room/Device | Resource-based view |

### Interactions
| Action | Result |
|--------|--------|
| Click empty slot | Opens Quick Book modal |
| Click appointment | Opens Appointment Detail Drawer |
| Drag vertically | Changes time |
| Drag horizontally | Changes provider |
| Resize | Changes duration |
| Right-click/menu | Context actions |

### Context Menu Actions
- Reschedule
- Duplicate
- Move provider
- Change room/device
- Check in
- Mark in service
- Complete
- Cancel
- No show
- Open charting
- Open checkout

---

## Database Schema Requirements

### appointments
```sql
id uuid primary key
client_id uuid not null references clients(id)
service_id uuid not null references services(id)
provider_id uuid not null references providers(id)
resource_id uuid null references resources(id)
starts_at timestamptz not null
ends_at timestamptz not null
status text not null
notes text null
booking_source text null
created_at timestamptz default now()
updated_at timestamptz default now()
```

### resources (rooms/devices)
```sql
id uuid primary key
name text not null
resource_type text not null -- room, device, equipment
is_active boolean default true
created_at timestamptz default now()
```

### services
```sql
id uuid primary key
name text not null
duration_minutes integer not null
price_cents integer not null
category text null
requires_resource boolean default false
default_resource_type text null
color_hex text null
is_active boolean default true
```

### providers
```sql
id uuid primary key
user_id uuid references users(id)
credentials text
services_offered uuid[]
color_hex text
is_active boolean default true
```

---

## Conflict Detection Algorithm

### Provider Conflict Check
```sql
SELECT id FROM appointments
WHERE provider_id = $provider_id
  AND status NOT IN ('cancelled', 'no_show')
  AND starts_at < $ends_at
  AND ends_at > $starts_at
  AND id != $exclude_appointment_id
```

### Resource Conflict Check
```sql
SELECT id FROM appointments
WHERE resource_id = $resource_id
  AND status NOT IN ('cancelled', 'no_show')
  AND starts_at < $ends_at
  AND ends_at > $starts_at
  AND id != $exclude_appointment_id
```

### Error Response Format
```json
{
  "error": "PROVIDER_CONFLICT: This provider already has an appointment at this time.",
  "conflictType": "PROVIDER_CONFLICT",
  "conflictingAppointment": "uuid-of-conflicting-appointment"
}
```

---

## Appointment Detail Drawer

### Tab 1: Overview
- Client name, phone, email
- Service details
- Provider
- Room/device
- Date/time
- Status with workflow buttons
- Internal notes

**Actions:**
- Check In
- Begin Service
- Complete
- Cancel
- No Show

### Tab 2: Client
- DOB
- Allergies
- Treatment history
- Package balance
- Membership status
- Last visit
- Forms on file

### Tab 3: Charting
- SOAP notes
- Injectable tracking (units, lot numbers)
- Device settings
- Treated areas
- Before/after photos
- Post-care documentation

### Tab 4: Payment
- Service total
- Deposits applied
- Package credits
- Membership discounts
- Unpaid balance
- Checkout button

### Tab 5: Notes
- Internal admin notes
- Communication notes
- Client preferences

### Tab 6: History
- Audit trail
- Created by
- Time changes
- Provider changes
- Status changes

### Tab 7: Verify
Workflow completion checklist:
- [ ] Saved to database
- [ ] Visible on calendar
- [ ] Client linked
- [ ] Service linked
- [ ] Provider linked
- [ ] Room/device linked (if required)
- [ ] Reminder queued
- [ ] Charting accessible
- [ ] Checkout accessible

---

## Quick Book vs Full Form

### Quick Book (from calendar slot click)
- Existing client search
- New client quick add
- Service selection
- Auto-calculated duration
- Provider pre-filled
- Room/device optional
- Book Now button

### Full Form (from "Full Form" link)
- All Quick Book fields
- Internal notes
- Tags
- Deposit handling
- Package selection
- Membership pricing
- Consent reminders
- Follow-up tasks

---

## Client Search Requirements

### Search Fields
- `first_name`
- `last_name`
- `phone`
- `email`

### Behavior
- Typing nothing: Show recent clients (last 50 by activity)
- Typing search: Query full database, return up to 50 matches
- Sort exact matches first
- Support scroll/pagination for large lists

### Query Pattern
```sql
SELECT * FROM clients
WHERE first_name ILIKE '%term%'
   OR last_name ILIKE '%term%'
   OR phone ILIKE '%term%'
   OR email ILIKE '%term%'
ORDER BY updated_at DESC
LIMIT 50
```

---

## Real-Time Updates

Use Supabase realtime subscriptions for instant calendar updates when:
- Appointment created
- Appointment moved
- Appointment cancelled
- Provider reassigned
- Status changed

This enables multiple users (owner + front desk) to see changes instantly.

---

## Drag-and-Drop Rules

1. **Optimistic UI** may preview the change
2. **Backend validation** must run before commit
3. **Database update** must succeed
4. **If failed**, snap appointment back and show error toast

Example error:
> "Could not move appointment: provider conflict at 2:00 PM"

---

## Med Spa Specific Features

### Resource Intelligence
If service requires a device, auto-suggest correct resource:
- Solaria appointment → Solaria device
- Morpheus8 → Morpheus8 device
- IV Therapy → IV chair
- Injectables → Treatment room

### Charting Requirement Badges
| Badge | Meaning |
|-------|---------|
| 📋 | Charting Required |
| ✏️ | Charting Started |
| ✅ | Charting Complete |

### Consent Indicators
Show badge if required consent form is missing.

---

## Owner Command Center KPIs

Display above calendar:
- Appointments Today
- Checked In
- In Service
- Completed
- Pending Verification
- Booking Errors
- SMS Failures
- Revenue Today

---

## Performance Rules

1. **Load by visible date range only**
   - Day view: Load 1 day
   - Week view: Load 7 days
   - Never fetch full history

2. **Cache provider schedules**
   - Refresh on tab focus
   - Refresh on schedule edit

3. **Debounce client search**
   - Wait 300ms after typing stops
   - Cancel pending requests

---

## Audit Logging

### appointment_audit_logs
```sql
id uuid primary key
appointment_id uuid not null
action text not null -- created, updated, cancelled, status_changed
old_values jsonb null
new_values jsonb null
performed_by uuid null
created_at timestamptz default now()
```

### booking_errors
```sql
id uuid primary key
appointment_id uuid null
error_code text not null
error_message text not null
context jsonb null
created_at timestamptz default now()
resolved_at timestamptz null
```

---

## File Locations

```
/app/admin/calendar/page.tsx          - Main calendar interface
/app/api/appointments/route.ts        - Appointment CRUD + validation
/app/api/appointments/[id]/route.ts   - Single appointment operations
/app/api/providers/route.ts           - Provider management
/app/api/providers/[id]/schedules     - Provider working hours
/app/api/resources/route.ts           - Rooms/devices
/app/api/clients/route.ts             - Client search
/components/calendar/CalendarNavBar.tsx - Calendar navigation
/lib/business-timezone.ts             - Timezone handling
```

---

## Implementation Priority

### Phase 1: Foundation ✅ COMPLETE
- [x] Fix client search (full database, 50 results)
- [x] Fix resource_id schema mismatch
- [x] Fix booking create/update reliability
- [x] Provider conflict detection
- [x] Room conflict detection

### Phase 2: Calendar Core ✅ COMPLETE
- [x] Provider-column calendar
- [x] Drag-drop to reschedule
- [x] Click slot for Quick Book
- [x] Appointment detail panel
- [x] Resize to change duration (drag bottom edge)

### Phase 3: Enhanced Features ✅ COMPLETE
- [x] Realtime updates (Supabase subscriptions)
- [x] Full audit logging (automatic trigger)
- [x] Resource auto-suggestion API
- [x] Charting status badges

### Phase 4: Command Center ✅ COMPLETE
- [x] KPI widgets (appointments, revenue)
- [x] Error monitoring (booking errors, SMS failures)
- [x] Verification workflow tracking

---

## Platform Stability Layer (v1.1)

### Database-Level Protections
- **Exclusion constraints** prevent overlapping appointments at Postgres level
- Race-condition double bookings are impossible
- Constraint: `no_overlapping_provider_appointments` uses GiST index on (provider_id, time range)
- Constraint: `no_overlapping_resource_appointments` for room/device conflicts

### Audit Logging
- **Automatic trigger** on appointments table
- Logs: INSERT, UPDATE, DELETE operations
- Captures: old_values, new_values, changed_fields, action type
- Action types: created, updated, rescheduled, cancelled, no_show, status_changed, provider_changed, resource_changed

### Error Monitoring
- **booking_errors** table tracks failed booking attempts
- Error codes: PROVIDER_CONFLICT, ROOM_CONFLICT, VALIDATION_ERROR, DB_ERROR
- Context preserved for debugging
- Feeds Owner Command Center KPI tiles
- **messaging_errors** table tracks SMS/email failures

### Realtime Updates
- Supabase realtime subscriptions on appointments table
- Calendar refreshes automatically on INSERT/UPDATE/DELETE
- Multi-user sync (owner + front desk see changes instantly)

### Appointment Resize
- Drag bottom edge of appointment block to resize
- Snaps to 15-minute increments
- Minimum duration: 15 minutes
- Backend validation prevents conflicts
- Optimistic UI with rollback on failure

### Resource Auto-Suggestion
- `/api/resources/suggest?service_id=xxx` endpoint
- Maps service types to resource types:
  - Solaria/CO2 → Solaria device
  - Morpheus → Morpheus device
  - IV/Drip → IV chair
  - Botox/Filler → Injector room
- Checks availability at requested time
- Returns sorted list with preferred resource first

---

## Migration Files

### Platform Stability Migration
```
/supabase/migrations/20250313000001_platform_stability.sql
```

Includes:
- btree_gist extension
- Exclusion constraints for overlap prevention
- appointment_audit_logs table
- booking_errors table
- messaging_errors table
- Automatic audit trigger on appointments
- Service resource requirement columns
- get_daily_appointment_stats function

### Run in Supabase SQL Editor
If migration hasn't been applied, run the SQL directly in Supabase Dashboard → SQL Editor.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/appointments` | GET/POST | List/create appointments |
| `/api/appointments/[id]` | GET/PUT/DELETE | Single appointment ops |
| `/api/booking-errors` | GET/POST/PATCH | Error monitoring |
| `/api/calendar-stats` | GET | KPI metrics for date |
| `/api/resources/suggest` | GET | Auto-suggest resource |
| `/api/providers/[id]/schedules` | GET | Provider working hours |

---

*Protocol Version: 1.1*
*Last Updated: March 2026*
*Stability Layer Added: March 13, 2026*
