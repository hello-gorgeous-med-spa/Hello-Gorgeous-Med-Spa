# Hello Gorgeous Operating System (HGOS)
## Owner's Manual - Full Control Guide

**Version:** 2.0  
**Last Updated:** February 2025  
**For:** Danielle Glazier-Alcala, Owner

---

## 🔐 YOUR OWNER ACCESS

As the **protected Owner account**, you have full control over every aspect of the system. Your account (`danielle@hellogorgeousmedspa.com`) **cannot be deleted, demoted, or deactivated** - this protection is built into the database.

### Login Credentials
- **URL:** https://hellogorgeousmedspa.com/admin
- **Email:** danielle@hellogorgeousmedspa.com
- **Password:** Your AUTH_CREDENTIALS password (set in Vercel)

---

## 📊 ADMIN DASHBOARD OVERVIEW

After logging in, you'll see the main dashboard at `/admin`. The left sidebar contains all your controls:

### Quick Access (Top)
- **📡 Live State** - Real-time system health monitoring
- **📊 Dashboard** - Daily overview and key metrics
- **💳 POS** - Point of Sale terminal

---

## 👥 CLIENT MANAGEMENT

**Location:** Admin → Clients → All Clients  
**URL:** `/admin/clients`

### What You Can Do:
| Action | How To |
|--------|--------|
| **Add New Client** | Click "+ Add Client" button |
| **Edit Client** | Click on client row → Edit |
| **View History** | Click client → see appointments, payments |
| **Merge Duplicates** | Select clients → "Merge" (Owner only) |
| **Export Data** | Click "Export CSV" button |
| **Delete Client** | Click "Deactivate" (soft delete, recoverable) |

### Client Tags
Add tags to segment clients:
- VIP, Loyalty, New Client
- Service preferences (Botox Regular, Filler Client)
- Marketing segments (Email Opt-in, SMS OK)

---

## 📅 APPOINTMENTS

**Location:** Admin → Clients → Appointments  
**URL:** `/admin/appointments`

### Managing Appointments:
| Action | How To |
|--------|--------|
| **View Today** | Dashboard shows today's appointments |
| **Book New** | Click "+ New Appointment" |
| **Reschedule** | Click appointment → "Reschedule" |
| **Cancel** | Click appointment → "Cancel" |
| **Mark No-Show** | Click appointment → "No Show" |
| **Check In** | Click appointment → "Check In" |
| **Complete** | Click appointment → "Complete" |
| **Apply Discount** | Click appointment → "Apply Discount" |
| **Process Refund** | Click appointment → "Refund" (Owner/Admin only) |

### Calendar View
**URL:** `/admin/calendar`
- Day, Week, Month views
- Filter by provider
- Drag to reschedule (coming soon)

---

## 💅 SERVICES & PRICING

**Location:** Admin → Services → Services & Pricing  
**URL:** `/admin/services`

### Managing Services:
| Action | How To |
|--------|--------|
| **Add Service** | Click "+ Add Service" |
| **Edit Price** | Click service → Edit → Change price |
| **Custom Price Display** | Use "Price Display" field (e.g., "$12/unit", "From $500") |
| **Set Duration** | Edit → Change duration in minutes |
| **Assign Providers** | Edit → Select which providers offer this service |
| **Hide Service** | Toggle "Active" off (hides from booking) |
| **Add Category** | Services are grouped by category |

### Price Display Examples:
- `$350` - Fixed price
- `$12/unit` - Per-unit pricing (Botox)
- `From $500` - Starting price
- `$200-$800` - Price range
- `Call for pricing` - Consultation required

---

## 👩‍⚕️ PROVIDER MANAGEMENT

**Location:** Admin → Content → Providers  
**URL:** `/admin/content/providers`

### Provider Profiles:
Each provider has:
- **Headshot** - Professional photo
- **Credentials** - FNP-BC, FNP-C, etc.
- **Bio** - About text for website
- **Specialties** - Services they excel at
- **Booking URL** - Direct booking link

### Provider Media (Videos & Before/After):
| Action | How To |
|--------|--------|
| **Upload Video** | Click "+ Upload Media" → Select "Video" |
| **Upload Before/After** | Click "+ Upload Media" → Select "Before/After" |
| **Mark Featured** | Click ⭐ star icon |
| **Hide/Show** | Click 👁 eye icon |
| **Delete** | Click 🗑 trash icon |

**⚠️ COMPLIANCE:** Before/after photos require checking "Client Consent Confirmed" before they can be published.

---

## 👤 USER & ROLE MANAGEMENT

**Location:** Admin → Settings → Users & Access  
**URL:** `/admin/users`

### User Roles:
| Role | Access Level |
|------|--------------|
| **Owner** | FULL ACCESS - Cannot be changed/deleted |
| **Admin** | Dashboard, clients, appointments, marketing, reports |
| **Provider** | Own appointments, charts, POS checkout |
| **Staff** | Front desk, check-in, basic POS |
| **Read-Only** | View only, no editing (for accountants/auditors) |

### Managing Users:
| Action | How To | Who Can Do |
|--------|--------|------------|
| **Add User** | Click "+ Add User" | Owner, Admin |
| **Change Role** | Click ✏️ next to role badge | Owner only |
| **Deactivate** | Click "Deactivate" | Owner only |
| **Reactivate** | Click "Reactivate" | Owner only |
| **Reset 2FA** | Click "Reset 2FA" | Owner only |
| **Unlock Account** | Click "Unlock" (after failed logins) | Owner, Admin |

### Protected Owner Account:
Your account has special protections:
- ✅ Cannot be deleted
- ✅ Cannot be deactivated  
- ✅ Cannot have role changed
- ✅ Always has full access

---

## ⏳ WAITLIST MANAGEMENT

**Location:** Admin → Clients → Waitlist  
**URL:** `/admin/waitlist`

### VIP Waitlists (Solaria CO₂, etc.):
**URL:** `/admin/co2-vip-waitlist`

| Action | How To |
|--------|--------|
| **View Entries** | See all waitlist submissions |
| **Filter by Status** | New, Contacted, Qualified, Booked |
| **Update Status** | Click entry → Change status |
| **Convert to Appointment** | Click "Book Appointment" |
| **Export List** | Click "Export CSV" |

---

## 📣 MARKETING

**Location:** Admin → Marketing  
**URL:** `/admin/marketing`

### Email/SMS Campaigns:
- Create campaigns
- Select audience segments
- Schedule send time
- Track open/click rates

### Automation Flows:
**URL:** `/admin/marketing/automation`
- Welcome sequence
- Appointment reminders
- Birthday messages
- Re-engagement campaigns

---

## 📝 CONTENT MANAGEMENT (CMS)

**Location:** Admin → Content → Site Content  
**URL:** `/admin/content/site`

### What You Can Edit:
- Homepage headlines and text
- Service page descriptions
- FAQ content
- Banner messages
- Promotional text

### How to Edit:
1. Find the content block by page
2. Click "Edit"
3. Make changes
4. Click "Save"
5. Changes go live immediately (no code deploy needed!)

---

## 📊 ANALYTICS

**Location:** Admin → Analytics  
**URL:** `/admin/analytics`

### Dashboard Metrics:
- **Revenue** - Today, this week, this month
- **Appointments** - Booked, completed, no-shows
- **Clients** - New vs returning, retention rate
- **Waitlist** - Conversion rates

### Reports:
**URL:** `/admin/reports`
- Revenue reports
- Service popularity
- Provider performance
- Client retention

---

## 🔍 AUDIT LOGS (Owner Only)

**Location:** Admin → Audit & Security → Audit Logs  
**URL:** `/admin/audit-logs`

### What's Tracked:
- All login attempts (success/failure)
- User role changes
- Client record changes
- Appointment modifications
- Settings changes

### How to Use:
1. Filter by user, action type, or date
2. Click entry to see details
3. View "before" and "after" values
4. Export for compliance records

---

## ⚙️ BUSINESS SETTINGS

**Location:** Admin → Settings → Business Settings  
**URL:** `/admin/settings`

### What You Can Configure:
| Setting | Description |
|---------|-------------|
| **Business Name** | Hello Gorgeous Med Spa |
| **Phone** | (630) 636-6193 |
| **Address** | 74 W. Washington St, Oswego, IL |
| **Timezone** | America/Chicago |
| **Business Hours** | Set open/close times per day |
| **Online Booking** | Enable/disable |
| **Require Deposit** | Toggle deposit collection |
| **Send Reminders** | Auto appointment reminders |
| **Cancellation Window** | Hours before (default: 24) |
| **Cancellation Fee** | Percentage (default: 50%) |

---

## 💳 SQUARE/POS SETTINGS

**Location:** Admin → Settings → Square Terminal  
**URL:** `/admin/settings/payments`

### Payment Integration:
- Square is connected for card processing
- Terminal setup for in-person payments
- Refund processing (Owner/Admin only)

---

## 🌐 PUBLIC PAGES YOU CONTROL

| Page | URL | What It Shows |
|------|-----|---------------|
| **Providers** | `/providers` | Meet the team |
| **Danielle's Profile** | `/providers/danielle` | Your bio, videos, results |
| **Ryan's Profile** | `/providers/ryan` | His bio, videos, results |
| **Services** | `/services` | All services & pricing |
| **Solaria CO₂** | `/services/solaria-co2` | Laser service page |
| **VIP Waitlist** | `/solaria-co2-vip` | VIP signup funnel |

---

## 🚨 EMERGENCY PROCEDURES

### If You Can't Log In:
1. Try incognito/private browser
2. Clear cookies for hellogorgeousmedspa.com
3. Check Vercel dashboard for deployment status
4. Contact support if persistent

### If System is Down:
1. Check https://status.vercel.com
2. Check Supabase dashboard
3. Emergency mode available at `/admin/emergency`

### If You Need to Lock a User Out:
1. Go to `/admin/users`
2. Find the user
3. Click "Deactivate" - immediate effect

---

## 📱 MOBILE ACCESS

The admin panel works on mobile! Best practices:
- Use bottom navigation on phone
- Swipe to access quick actions
- Install as PWA for app-like experience

### Install as App (iPhone):
1. Open Safari → hellogorgeousmedspa.com/admin
2. Tap Share button
3. Tap "Add to Home Screen"
4. Name it "HG Admin"

---

## 🔑 ENVIRONMENT VARIABLES (Vercel)

Your system uses these env variables (set in Vercel dashboard):

| Variable | Purpose |
|----------|---------|
| `AUTH_CREDENTIALS` | Your login (email:password) |
| `SUPABASE_URL` | Database connection |
| `SUPABASE_ANON_KEY` | Database access |
| `RESEND_API_KEY` | Email sending |
| `META_PIXEL_ID` | Facebook tracking |

**To update:** Vercel Dashboard → Settings → Environment Variables

---

## 📞 QUICK REFERENCE

### Key URLs:
- **Admin Login:** hellogorgeousmedspa.com/admin
- **Client Portal:** hellogorgeousmedspa.com/portal
- **Book Online:** hellogorgeousmedspa.com/book
- **Main Website:** hellogorgeousmedspa.com

### Support Contacts:
- **Phone:** (630) 636-6193
- **Text:** (630) 881-3398
- **Email:** danielle@hellogorgeousmedspa.com

---

## ✅ DAILY CHECKLIST

```
□ Check dashboard for today's appointments
□ Review any new waitlist entries
□ Check for pending consent forms
□ Review yesterday's no-shows
□ Check notification queue
□ Review any flagged items
```

---

## ✅ WEEKLY CHECKLIST

```
□ Review analytics dashboard
□ Check marketing campaign performance
□ Review audit logs for unusual activity
□ Update any service pricing if needed
□ Check client feedback/reviews
□ Backup any important exports
```

---

*This manual is specific to your Hello Gorgeous Operating System. All features are database-driven and controllable through the admin panel without any code changes needed.*

**💗 Hello Gorgeous Med Spa - Your Business, Your Control**
