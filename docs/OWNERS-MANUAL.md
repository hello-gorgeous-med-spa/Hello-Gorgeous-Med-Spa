# Hello Gorgeous Operating System (HGOS)
## Owner's Manual & Operations Guide

**Version:** 1.0  
**Last Updated:** January 2025  
**For:** Hello Gorgeous Med Spa Staff & Administrators

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Daily Operations](#2-daily-operations)
3. [Booking & Appointments](#3-booking--appointments)
4. [Client Management](#4-client-management)
5. [Point of Sale (POS)](#5-point-of-sale-pos)
6. [Services Management](#6-services-management)
7. [Provider & Schedule Management](#7-provider--schedule-management)
8. [Clinical Charting](#8-clinical-charting)
9. [Inventory Management](#9-inventory-management)
10. [Messaging & Communications](#10-messaging--communications)
11. [Reports & Analytics](#11-reports--analytics)
12. [Client Portal](#12-client-portal)
13. [Troubleshooting](#13-troubleshooting)
14. [Security & Compliance](#14-security--compliance)

---

## 1. Getting Started

### Accessing the System

| Area | URL | Who Can Access |
|------|-----|----------------|
| Admin Dashboard | `hellogorgeousmedspa.com/admin` | Staff, Providers, Admins |
| Point of Sale | `hellogorgeousmedspa.com/pos` | Front Desk, Providers |
| Client Portal | `hellogorgeousmedspa.com/portal` | Clients (logged in) |
| Online Booking | `hellogorgeousmedspa.com/book` | Public (anyone) |

### Logging In

1. Go to `hellogorgeousmedspa.com/admin`
2. Enter your email and password
3. Click "Sign In"

> **Tip:** Bookmark the admin page for quick access

### Installing as an App (PWA)

**On iPhone/iPad:**
1. Open Safari and go to `hellogorgeousmedspa.com`
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Hello Gorgeous" and tap "Add"

**On Android:**
1. Open Chrome and go to `hellogorgeousmedspa.com`
2. Tap the menu (3 dots) → "Add to Home Screen"
3. Tap "Add"

---

## 2. Daily Operations

### Opening Checklist

1. **Log into Admin Dashboard** → Check today's appointments
2. **Review Calendar** → Note any gaps or double-bookings
3. **Check Messages** → Review any overnight inquiries
4. **Verify POS** → Ensure card reader is connected

### End of Day Checklist

1. **Review Day's Transactions** → Admin → Payments
2. **Check for Unsigned Charts** → Clinical notes need provider signature
3. **Confirm Tomorrow's Schedule** → Review next day appointments
4. **Send Reminders** → Automated, but verify they went out

---

## 3. Booking & Appointments

### Online Booking (Client-Facing)

Clients can book directly at: **hellogorgeousmedspa.com/book**

The booking flow:
1. Client selects a service category
2. Chooses specific service
3. Selects their preferred provider
4. Picks available date/time
5. Enters contact information
6. Confirms booking

### Managing Appointments (Admin)

**View Appointments:**
- Go to Admin → Appointments (list view)
- Or Admin → Calendar (calendar view)

**Filter Appointments:**
- By date
- By provider
- By status (Scheduled, Completed, Cancelled, No-Show)

**Appointment Statuses:**
| Status | Meaning |
|--------|---------|
| Scheduled | Confirmed, upcoming |
| Checked In | Client has arrived |
| In Progress | Service is being performed |
| Completed | Service finished, ready for checkout |
| Cancelled | Client cancelled |
| No-Show | Client didn't arrive |

**To Change Appointment Status:**
1. Click on the appointment
2. Select new status from dropdown
3. Changes save automatically

### Creating Manual Appointments

1. Go to Admin → Calendar
2. Click "Quick Book" or click on a time slot
3. Fill in:
   - Client (search existing or create new)
   - Service
   - Provider
   - Date & Time
4. Click "Create Appointment"

---

## 4. Client Management

### Viewing Clients

1. Go to Admin → Clients
2. Use search bar to find by name, email, or phone
3. Click on a client to view their full profile

### Client Profile Contains:

- **Personal Info:** Name, contact, DOB
- **Visit History:** All past appointments
- **Treatment Notes:** Clinical records
- **Photos:** Before/after images
- **Consents:** Signed documents
- **Payment History:** All transactions
- **Memberships:** Active plans
- **Rewards:** Points balance

### Adding a New Client

1. Admin → Clients → "Add Client"
2. Enter required information:
   - First Name, Last Name
   - Email
   - Phone
   - Date of Birth (optional)
3. Click "Create Client"

### Client Communication Preferences

Each client has settings for:
- SMS notifications (appointment reminders)
- Email notifications
- Marketing messages

> **Important:** Respect opt-out requests immediately

---

## 5. Point of Sale (POS)

### Accessing POS

Go to: **hellogorgeousmedspa.com/pos**

### Processing a Sale

1. **Select Client** → Search or create new
2. **Add Items:**
   - Services performed
   - Products purchased
   - Gift cards
3. **Apply Discounts** (if applicable):
   - Percentage off
   - Fixed amount
   - Promo code
4. **Add Tip** (optional)
5. **Select Payment Method:**
   - Card (tap/swipe/insert)
   - Cash
   - Card on File
   - Split Payment
6. **Process Payment**
7. **Print/Email Receipt**

### Payment Methods

| Method | How It Works |
|--------|--------------|
| Card Present | Insert, tap, or swipe physical card |
| Card on File | Use stored card (requires client consent) |
| Cash | Enter amount tendered, system calculates change |
| Split | Combine multiple payment methods |

### Processing Refunds

1. Go to Admin → Payments
2. Find the original transaction
3. Click "Refund"
4. Enter refund amount (full or partial)
5. Select refund reason
6. Confirm refund

> **Note:** Refunds return to original payment method

### Voids vs Refunds

- **Void:** Same-day transaction cancellation (no fees)
- **Refund:** After settlement, money returned to client

---

## 6. Services Management

### Viewing Services

Go to: Admin → Services

### Editing a Service

1. Click the pencil icon next to the service
2. Update any field:
   - Name
   - Description
   - Price
   - Duration
   - Category
   - Assigned Providers
   - Active/Inactive
   - Online Booking enabled
   - Consultation required
   - Consent forms required
   - Deposit required
3. Click "Save Changes"

### Adding a New Service

1. Admin → Services → "Add Service"
2. Fill in all required fields
3. Assign to category
4. Assign providers who perform this service
5. Set pricing and duration
6. Click "Create Service"

### Service Categories

Services are organized by category:
- Injectables (Botox, Fillers)
- Skin Treatments
- Body Contouring
- Wellness
- etc.

### Activating/Deactivating Services

- Toggle the "Active" switch
- Inactive services won't appear in booking or POS
- Historical records are preserved

---

## 7. Provider & Schedule Management

### Managing Providers

Go to: Admin → Team → Providers

**Each provider has:**
- Name & credentials
- Email & phone
- Calendar color
- Active/Inactive status

### Editing Provider Schedules

Go to: Admin → Team → Schedules

**For each provider, set:**
- Working days (check/uncheck each day)
- Start time for each day
- End time for each day

**Example Schedule:**
| Day | Status | Hours |
|-----|--------|-------|
| Monday | Working | 9:00 AM - 5:00 PM |
| Tuesday | Working | 9:00 AM - 5:00 PM |
| Wednesday | Off | — |
| Thursday | Working | 10:00 AM - 6:00 PM |
| Friday | Working | 9:00 AM - 3:00 PM |
| Saturday | Off | — |
| Sunday | Off | — |

### Assigning Providers to Services

1. Go to Admin → Services
2. Edit the service
3. Check the providers who perform this service
4. Save

> This controls which providers appear as options when booking that service

---

## 8. Clinical Charting

### Accessing Charts

1. Go to Admin → Appointments
2. Click on a completed appointment
3. Click "Open Chart" or "Create Chart"

### SOAP Note Structure

| Section | Content |
|---------|---------|
| **S**ubjective | Client's concerns, goals, medical history updates |
| **O**bjective | What you observe, measurements, photos |
| **A**ssessment | Your clinical assessment, treatment plan |
| **P**lan | What was done, follow-up recommendations |

### Recording Injections

For injectable treatments, record:
- Product used (Botox, Dysport, filler type)
- Units/syringes
- Lot number
- Expiration date
- Injection sites (mark on diagram)
- Total units per area

### Before/After Photos

1. In the chart, click "Add Photos"
2. Take or upload photos
3. Label as "Before" or "After"
4. Photos are linked to the visit and client record

### Signing Charts

1. Review all information for accuracy
2. Click "Sign & Lock"
3. Enter your credentials
4. Chart becomes immutable (cannot be edited)

> **Important:** Once signed, charts cannot be modified. This is for legal protection.

---

## 9. Inventory Management

### Viewing Inventory

Go to: Admin → Inventory

### Key Features:

- **Current Stock:** Units on hand
- **Lot Tracking:** Each batch tracked separately
- **Expiration Dates:** System warns of expiring products
- **Auto-Decrement:** Stock decreases when used in treatments

### Adding Inventory

1. Admin → Inventory → "Add Stock"
2. Select product
3. Enter:
   - Quantity
   - Lot number
   - Expiration date
   - Purchase cost
4. Click "Add to Inventory"

### Inventory Alerts

The system warns you when:
- Stock is low (below minimum threshold)
- Products are expiring soon (30 days)
- Products have expired (cannot be used)

### Adjusting Inventory

If counts are off:
1. Click on the product
2. Click "Adjust"
3. Enter new count
4. Select reason (waste, damage, count correction)
5. Add notes
6. Submit

> All adjustments are logged for audit purposes

---

## 10. Messaging & Communications

### SMS Messaging

Go to: Admin → Messages

**Automated Messages:**
- Appointment confirmations (immediately after booking)
- Appointment reminders (24 hours before)
- Follow-up messages (post-treatment)

**Manual Messages:**
1. Go to Admin → Messages
2. Click "New Message"
3. Select client(s)
4. Type message
5. Click "Send"

### Message Templates

Pre-written templates for common messages:
- Appointment reminder
- Running late notification
- Treatment aftercare
- Special offers

### Important SMS Rules

- **Never include PHI** (health information) in texts
- **Honor opt-outs** immediately (STOP requests)
- **Keep messages brief** and professional
- **Include business name** in messages

---

## 11. Reports & Analytics

### Accessing Reports

Go to: Admin → Reports

### Available Reports:

| Report | What It Shows |
|--------|---------------|
| Daily Sales | Revenue, transactions, payments by method |
| Provider Productivity | Appointments, revenue per provider |
| Service Performance | Popular services, revenue by service |
| Client Analytics | New clients, retention, top spenders |
| Inventory Usage | Units used, cost analysis |
| No-Show Rate | Missed appointments percentage |
| Gift Card Liability | Outstanding gift card balances |

### Exporting Data

Most reports can be exported:
1. Run the report with your filters
2. Click "Export CSV"
3. Open in Excel or Google Sheets

### Key Metrics to Monitor

**Daily:**
- Total revenue
- Number of appointments
- No-shows

**Weekly:**
- Revenue by provider
- New client count
- Popular services

**Monthly:**
- Month-over-month growth
- Inventory costs vs revenue
- Client retention rate

---

## 12. Client Portal

### What Clients Can Do

At **hellogorgeousmedspa.com/portal**, clients can:

- View upcoming appointments
- See past visit history
- Access treatment photos
- View and sign consents
- See rewards/points balance
- Update contact information
- Manage communication preferences
- Refer friends (referral program)

### Client Portal Features:

**My Appointments:**
- See scheduled appointments
- View appointment details
- (Future: reschedule/cancel)

**My Profile:**
- Update phone, email
- Change password
- Manage SMS preferences

**Rewards:**
- View points balance
- See how to earn more
- Redeem rewards

**Referrals:**
- Get unique referral link
- Track referred friends
- Earn referral bonuses

---

## 13. Troubleshooting

### Common Issues & Solutions

**"Error loading data" on dashboard:**
- Refresh the page
- Clear browser cache
- Check internet connection
- If persists, contact support

**Client not showing up in search:**
- Try searching by email or phone
- Check spelling
- Client may be under different name

**Payment won't process:**
- Check card reader connection
- Try a different payment method
- Check Stripe dashboard for declined reason

**Can't edit appointment:**
- Past appointments may be locked
- Check if chart is already signed
- Verify your user permissions

**SMS not sending:**
- Check client has valid phone number
- Verify they haven't opted out
- Check Telnyx dashboard for errors

### Getting Help

**For Technical Issues:**
- Document the error (screenshot)
- Note what you were trying to do
- Contact your system administrator

---

## 14. Security & Compliance

### Password Requirements

- Minimum 8 characters
- Mix of letters, numbers, symbols
- Change every 90 days
- Never share your password

### Logging Out

Always log out when:
- Leaving your workstation
- Using a shared computer
- End of your shift

### Patient Privacy (HIPAA)

**DO:**
- Only access records you need for your job
- Log out when stepping away
- Verify client identity before sharing info
- Report any security concerns

**DON'T:**
- Share login credentials
- Access records out of curiosity
- Discuss client info in public areas
- Send PHI via text message

### Consent Management

Before treatment, ensure:
- HIPAA acknowledgment is signed
- Treatment-specific consent is signed
- Financial policy is acknowledged
- Photo release (if taking photos)

All consents are:
- Digitally signed
- Timestamped
- Stored permanently
- Cannot be modified after signing

### Audit Trail

The system logs:
- Who accessed what records
- When changes were made
- What was changed
- From what location (IP)

> This protects both the business and clients

---

## Quick Reference Card

### Key URLs

| Function | URL |
|----------|-----|
| Admin | hellogorgeousmedspa.com/admin |
| POS | hellogorgeousmedspa.com/pos |
| Calendar | hellogorgeousmedspa.com/admin/calendar |
| Book Online | hellogorgeousmedspa.com/book |
| Client Portal | hellogorgeousmedspa.com/portal |

### Keyboard Shortcuts (Admin)

| Action | Shortcut |
|--------|----------|
| Search | Ctrl/Cmd + K |
| New Appointment | Ctrl/Cmd + N |
| Today's View | T |
| Refresh | F5 or Ctrl/Cmd + R |

### Emergency Contacts

| Issue | Contact |
|-------|---------|
| System Down | [Your IT Contact] |
| Payment Issues | Stripe Support |
| SMS Issues | Telnyx Support |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Initial release |

---

*This manual is proprietary to Hello Gorgeous Med Spa. For internal use only.*
