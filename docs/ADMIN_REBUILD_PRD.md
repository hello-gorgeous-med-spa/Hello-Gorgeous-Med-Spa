# Admin Rebuild PRD: Med Spa Operating System

**Goal:** Rebuild hellogorgeousmedspa.com/admin into a true med spa operating system—Fresha-style usability for booking/front desk, plus clinical charting, owner portal, and no-code internal editing so routine changes do not require a developer.

**Benchmark:** Fresha usability + med spa charting + owner self-management.

---

## Part 1: Current State Audit

Every current admin feature is classified as **keep**, **simplify**, **move**, **rebuild**, or **remove**. Use this to decide what to carry forward and what to replace.

### Navigation (current)

Current sidebar has **11 collapsible sections** with 60+ links, plus Dashboard, Founder Control, Owner's Manual, POS. Many items are duplicated (e.g. Reports in Marketing, Export Requests in Clinical and Audit).

---

### A. Clients (current: Clients section + scattered)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/clients` | **REBUILD** | Keep list + search + pagination; add filters, tags, internal flags, LTV. Fix data loading (see Part 4). |
| `/admin/clients/new` | **KEEP** | Simplify form; ensure it writes to same client model. |
| `/admin/clients/[id]` | **REBUILD** | Becomes client hub with tabs: Overview, Appointments, Charting, Consents, Photos, Purchases, Memberships, Wallet, Messages, Files, Alerts. |
| `/admin/clients/[id]/photos` | **MOVE** | Becomes a tab inside client profile. |
| `/admin/clients/[id]/loyalty` | **MOVE** | Becomes part of Memberships / Wallet tab. |
| `/admin/appointments` | **KEEP** | Simplify; consider merging into Calendar as list view. |
| `/admin/calendar` | **REBUILD** | Fresha-style: day/week/provider, drag-drop, status flow, side panel with client/forms/checkout. |
| `/admin/waitlist` | **KEEP** | Simplify; ensure it appears in Calendar/Dashboard. |

---

### B. Clinical (current: Clinical section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/clinical/guidance` | **SIMPLIFY** | Keep as reference; move under Charting or Settings if needed. |
| `/admin/clinical/protocols` | **SIMPLIFY** | Protocol center → move under Charting or Settings. |
| `/admin/charting/injection-map` | **KEEP** | Becomes part of Charting hub (injection template). |
| `/admin/charting` (page) | **REBUILD** | Becomes Charting portal: template-driven SOAP, injectable, IV, hormone notes. |
| `/charting` (Charting Hub) | **MOVE** | Single Charting entry point under new nav. |
| `/admin/consents` | **KEEP** | Simplify; link from client profile Consents tab. |
| `/admin/compliance/binder` | **SIMPLIFY** | Keep for compliance; move under Settings or dedicated Compliance. |
| `/admin/provider-governance/*` | **SIMPLIFY** | Inspection readiness, chart audits, emergency log → one Governance area under Settings. |
| `/admin/exports/requests` | **MOVE** | Under Settings > Audit & Security or Reports. |
| `/admin/settings/asset-registry` | **MOVE** | Under Inventory or Settings. |
| `/admin/medications` | **MOVE** | Under Inventory (medical products) or Charting. |
| `/admin/inventory` | **REBUILD** | Full inventory: retail, injectables, IV, disposables; reorder thresholds; lot/expiry; auto-decrement from charting. |

---

### C. Chart-to-Cart (current: separate section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/chart-to-cart` | **REBUILD** | Integrate into Calendar flow + Charting: “chart then add to cart” in one workflow. |
| `/admin/chart-to-cart/new` | **MOVE** | Becomes part of appointment completion (calendar side panel or charting). |
| `/admin/chart-to-cart/history` | **MOVE** | Under client profile Purchases or Reports. |
| `/admin/chart-to-cart/products` | **MOVE** | Under Services/Inventory or Settings. |

---

### D. Sales (current: Sales section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/sales` | **SIMPLIFY** | Sales Ledger → keep; ensure one source of truth with Payments. |
| `/admin/sales/daily-summary` | **MOVE** | Dashboard or Reports. |
| `/admin/sales/payments` | **MOVE** | Merge into Payments or Reports. |
| `/admin/sales/wallet` | **MOVE** | Client profile Wallet tab. |
| `/admin/payments` | **KEEP** | Fix integration (Stripe/Square); keep under main nav. |
| `/admin/payments/new` | **KEEP** | Quick payment from client/calendar. |
| `/admin/gift-cards` | **KEEP** | Simplify; link from client Wallet. |
| `/admin/memberships` | **REBUILD** | Membership Builder + per-client membership management. |
| `/admin/wellness` | **MOVE** | Merge into Memberships (wellness as membership type). |
| `/admin/promotions` | **MOVE** | Under Marketing or Settings > Promotions. |

---

### E. Services (current: Services section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/services` | **REBUILD** | Becomes Service Builder: name, category, duration, price, deposit, online booking, membership/package eligible, consent, intake, aftercare, upsells. DB-driven, no hardcoding. |
| `/admin/packages` | **KEEP** | Integrate with Service Builder (package-eligible flag). |

---

### F. Communications (current: Communications section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/communications/automation` | **MOVE** | Under Marketing (automation). |
| `/admin/messages` | **KEEP** | 2-way messages; ensure it’s in nav and linked from client Messages tab. |
| `/admin/sms` | **KEEP** | SMS campaigns; part of Marketing. |
| `/admin/communications/templates` | **MOVE** | Under Marketing > Templates or Settings. |

---

### G. AI (current: AI section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/ai` | **SIMPLIFY** | Single AI hub or remove from main nav; link from Owner/Settings. |
| `/admin/insights` | **SIMPLIFY** | AI chat → Owner-only or remove from primary nav. |
| `/admin/ai/memory` | **REMOVE** or **Settings** | Niche; move to Settings if kept. |
| `/admin/ai/watchdog` | **MOVE** | Settings > Audit & Security. |
| `/admin/ai/voice` | **KEEP** | Voice receptionist; Settings or Communications. |
| `/admin/ai/mascot-feedback` | **REMOVE** or **Settings** | Niche. |

---

### H. Marketing (current: Marketing section + Reports here)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/concerns` (“Fix What Bothers Me”) | **REMOVE** or **SIMPLIFY** | Replace with standard feedback/settings. |
| `/admin/marketing` | **REBUILD** | Marketing center: SMS/email campaigns, segments, promos, lead capture, referral, review requests, reactivation. Audience filters (never booked, no visit 90d, Botox/filler/weight/hormone, birthday, VIP, abandoned, high-value). |
| `/admin/marketing/contacts` | **MOVE** | Part of Marketing center. |
| `/admin/marketing/feature-leads` | **MOVE** | Part of Marketing or Dashboard “leads”. |
| `/admin/marketing/automation` | **MOVE** | Part of Marketing. |
| `/admin/marketing/campaigns/new` | **MOVE** | Inside Marketing. |
| `/admin/marketing/email` | **MOVE** | Part of Marketing. |
| `/admin/marketing/google-posts` | **MOVE** | Part of Marketing. |
| `/admin/marketing/post-social` | **MOVE** | Part of Marketing. |
| `/admin/marketing/agents` | **SIMPLIFY** | Keep only if actively used; else remove from nav. |
| `/admin/marketing/assistant` | **SIMPLIFY** | Same as above. |
| `/admin/reports` | **MOVE** | Dedicated Reports in main nav (not under Marketing). |

---

### I. Content (current: Content section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/content/providers` | **KEEP** | Provider media/bios; part of Staff or Website/Content. |
| `/admin/content/site` | **REBUILD** | Becomes Website/Content: hero, promos, service blurbs, FAQs, membership copy, provider bios, popups, booking CTAs, galleries. No-code editing. |
| `/admin/media` | **KEEP** | Media library; used by Content. |
| `/admin/content/site-videos` | **MOVE** | Under Website/Content. |
| `/admin/seo` | **MOVE** | Under Website/Content or Settings. |

---

### J. Analytics (current: Analytics section)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/analytics` | **MOVE** | Becomes Dashboard (admin) or Owner dashboard. |
| `/admin/analytics/revenue` | **MOVE** | Reports or Owner. |
| `/admin/analytics/clients` | **MOVE** | Reports or Owner. |
| `/admin/analytics/marketing` | **MOVE** | Reports or Marketing. |

---

### K. Audit & Security (current)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/audit-logs` | **KEEP** | Settings > Audit log. |
| `/admin/exports/requests` | **MOVE** | Settings (duplicate removed from Clinical). |

---

### L. Settings (current: many sub-pages)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/settings` | **KEEP** | Business info; simplify. |
| `/admin/users` | **KEEP** | Users & Access; role-based permissions. |
| `/admin/staff` | **REBUILD** | Staff builder: name, title, permissions, schedule, service eligibility, commission, payroll tags, bio, image, color, room; roles: front_desk, provider, manager, owner. |
| `/admin/vendors` | **KEEP** | Under Settings. |
| `/admin/settings/payments` | **KEEP** | Square Terminal etc. |
| `/admin/settings/pretreatment` | **KEEP** | Forms & consents area. |
| `/admin/settings/aftercare` | **KEEP** | Forms & consents. |
| `/admin/settings/asset-registry` | **MOVE** | Inventory or Settings. |
| `/admin/settings/automations` | **MOVE** | Marketing or Settings. |
| `/admin/settings/chart-templates` | **KEEP** | Charting templates; critical. |
| `/admin/settings/consent-forms` | **KEEP** | Merge with Consents. |
| `/admin/settings/intake-forms` | **KEEP** | Forms & consents. |
| `/admin/settings/memberships` | **MOVE** | Under Memberships (builder). |
| `/admin/settings/notifications` | **KEEP** | Notifications. |
| `/admin/settings/policies` | **KEEP** | Business config. |
| `/admin/settings/prices` | **MOVE** | Service Builder. |
| `/admin/settings/promotions` | **MOVE** | Marketing or Promotions. |
| `/admin/settings/schedules` | **KEEP** | Staff schedules. |
| `/admin/settings/templates` | **KEEP** | Message/email templates. |
| `/admin/owner/manual` | **KEEP** | Owner's Manual; link from Owner portal. |

---

### M. Owner (current: many sub-pages)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/owner` | **REBUILD** | Owner portal: revenue snapshot, pending issues, leads, marketing health, membership health, low stock, staff productivity, quick edits (promos, pricing, services). |
| `/admin/owner/access` | **MOVE** | Settings > Users & Access. |
| `/admin/owner/audit` | **MOVE** | Settings > Audit. |
| `/admin/owner/authority` | **REMOVE** or **SIMPLIFY** | Merge into permissions. |
| `/admin/owner/automations` | **MOVE** | Marketing or Settings. |
| `/admin/owner/booking-rules` | **MOVE** | Settings > Booking. |
| `/admin/owner/business` | **MOVE** | Settings. |
| `/admin/owner/changelog` | **REMOVE** or **Settings** | Dev-focused. |
| `/admin/owner/changes` | **REMOVE** or **SIMPLIFY** | Replace with standard audit/changes. |
| `/admin/owner/clinical` | **MOVE** | Charting / Settings. |
| `/admin/owner/consents` | **MOVE** | Settings > Forms & consents. |
| `/admin/owner/data-model` | **REMOVE** | Dev-only. |
| `/admin/owner/economics` | **MOVE** | Reports / Owner dashboard. |
| `/admin/owner/exports` | **MOVE** | Settings. |
| `/admin/owner/features` | **REMOVE** or **Settings** | Product flags. |
| `/admin/owner/gift-cards` | **MOVE** | Sales / Settings. |
| `/admin/owner/inventory` | **MOVE** | Inventory. |
| `/admin/owner/live-state` | **REMOVE** | Dev-only. |
| `/admin/owner/manual` | **KEEP** | Owner's Manual. |
| `/admin/owner/memberships` | **MOVE** | Memberships. |
| `/admin/owner/payments` | **MOVE** | Settings > Payments. |
| `/admin/owner/risk` | **REMOVE** or **SIMPLIFY** | Niche. |
| `/admin/owner/rules` | **MOVE** | Settings. |
| `/admin/owner/sandbox` | **REMOVE** | Dev-only. |
| `/admin/owner/scheduling` | **MOVE** | Settings > Booking / Staff. |
| `/admin/owner/services` | **MOVE** | Services. |
| `/admin/owner/system-settings` | **MOVE** | Settings. |
| `/admin/owner/users` | **MOVE** | Settings > Users. |
| `/admin/owner/versions` | **REMOVE** | Dev-only. |
| `/admin/owner/website/*` | **MOVE** | Website/Content (homepage, media, nav, pages, promotions). |

---

### N. Other (not in main nav or one-off)

| Current Route / Feature | Classification | Notes |
|-------------------------|----------------|-------|
| `/admin/finance` | **MOVE** | Owner dashboard + Reports. |
| `/admin/compliance` | **KEEP** | Simplify; move under Settings or keep one Compliance entry. |
| `/admin/compliance/chart-audits` | **MOVE** | Charting or Settings > Governance. |
| `/admin/compliance/emergency-log` | **MOVE** | Settings or Compliance. |
| `/admin/compliance/inspection` | **MOVE** | Settings > Governance. |
| `/admin/charts` | **MOVE** | Charting hub (list of charts). |
| `/admin/efax`, `/admin/fax` | **KEEP** | Under Settings or Communications. |
| `/admin/emergency` | **KEEP** | Quick access; link from Dashboard. |
| `/admin/export` | **MOVE** | Settings > Exports. |
| `/admin/hormone-sessions` | **MOVE** | Charting (hormone template) or Appointments. |
| `/admin/inbox` | **MOVE** | Part of Messages or Dashboard. |
| `/admin/link-builder` | **MOVE** | Marketing. |
| `/admin/prescriptions` | **MOVE** | Charting or Inventory. |
| `/admin/scheduling` | **MOVE** | Calendar / Staff schedules. |
| `/admin/system-health` | **REMOVE** or **Settings** | Dev-only. |
| `/admin/templates` | **MOVE** | Settings or Marketing. |
| `/admin/team/providers` | **MOVE** | Staff. |
| `/admin/team/schedules` | **MOVE** | Staff > Schedules. |
| `/admin/co2-vip-waitlist` | **SIMPLIFY** | Waitlist or Marketing. |
| `/pos` | **KEEP** | POS; keep linked from nav. |

---

## Part 2: New Information Architecture (Main Sidebar Only)

Single primary navigation. No buried sections.

| # | Nav Item | Purpose |
|---|----------|---------|
| 1 | **Dashboard** | Daily command center (today’s appointments, check-ins, revenue, alerts, leads, consents, inventory, tasks, recent bookings). Owner: + week/month revenue, top services/providers, conversion, no-show rate. |
| 2 | **Calendar** | Fresha-style: day/week/provider, drag-drop, status flow, side panel (client, notes, forms, checkout). |
| 3 | **Clients** | List + search/filters; click → client hub (tabs: Overview, Appointments, Charting, Consents, Photos, Purchases, Memberships, Wallet, Messages, Files, Alerts). |
| 4 | **Charting** | Medical documentation: template-driven (Botox, filler, IV, vitamin, hormone, weight loss). SOAP, injection/IV/hormone fields, lot/batch, photos, consent check, follow-up. |
| 5 | **Services** | Service Builder (no-code): name, category, duration, price, deposit, online booking, membership/package, consent, intake, aftercare, upsells. |
| 6 | **Memberships** | Membership Builder + per-client membership management (active, paused, overdue, usage). |
| 7 | **Inventory** | Medical + retail: SKU, quantity, reorder, vendor, lot, expiry, cost, retail; auto-decrement from charting. |
| 8 | **Marketing** | SMS/email campaigns, segments, promos, lead capture, referral, reviews, reactivation; audience filters. |
| 9 | **Staff** | Staff profiles: name, title, permissions, schedule, services, commission, bio, image, color, room. |
| 10 | **Reports** | Revenue (day/week/month), by provider/service/category, new clients, retention, rebook, no-show, memberships, inventory, lead source, SMS performance, conversion; CSV export. |
| 11 | **Website / Content** | No-code: hero, promos, service pages, FAQs, membership blurbs, provider bios, popups, booking CTAs, galleries, SEO. |
| 12 | **Settings** | Business info, Locations, Notifications, Booking, Forms & consents, Payments, Integrations, User permissions, Audit log. |

**Owner-only:** Owner portal (e.g. `/admin/owner`) as separate “business cockpit” with revenue, pending issues, leads, marketing/membership health, low stock, productivity, quick edits. Role-based: Front Desk, Provider, Manager, Owner see only what they need.

---

## Part 3: Screen-by-Screen Rebuild Blueprint

### A. Dashboard
- **Purpose:** Daily command center.
- **Content:** Today’s appointments, check-ins waiting, provider snapshots, today’s revenue, missed calls/unreturned leads, pending forms/unsigned consents, low inventory, unread tasks, upcoming memberships due, recent online bookings.
- **Owner view:** + Week/month revenue, top services, top providers, conversion (leads→bookings), no-show rate.
- **UX:** Visual, clean, fast; cards and clear CTAs.

### B. Calendar
- **Purpose:** Operate the day like Fresha.
- **Features:** Day/week/provider views; drag-and-drop; color-coded services; staff columns; filter by provider/room/service; block time (lunch, training, unavailable); online booking sync; waitlist; recurring appointments.
- **Status flow:** booked → confirmed → arrived → in service → checked out | no-show | cancelled.
- **Appointment side panel:** Client info, notes, forms status, treatment history, package balance, membership status, invoice/checkout shortcut.

### C. Clients
- **Purpose:** Single source of truth per client.
- **Profile tabs:** Overview, Appointments, Charting, Consents, Photos, Purchases, Memberships, Wallet, Messages, Files, Alerts.
- **Overview:** Name, DOB, contact, allergies, contraindications, last/next visit, LTV, preferred provider, tags, lead source.
- **Internal flags:** Medical clearance needed, prone to bruising, difficult scheduling, VIP, payment issue, do not market, SMS opt-out.

### D. Charting
- **Purpose:** Medical documentation only (separate from front-desk).
- **Features:** SOAP notes; aesthetic/injection/IV/hormone templates; dosage; lot/batch; photo; before/after; consent verification; post-care; complications; follow-up.
- **Structured:** Product, units/syringes, dilution, lot, expiration, areas, provider signature. IV: route, site, needle, dosage, toleration. Hormone: protocol, follow-up interval, labs, response.
- **UX:** Template picker → form → save; no giant single page.

### E. Services
- **Purpose:** Owner edits without dev.
- **Service Builder fields:** Name, category, description, duration, cleanup time, price, deposit, online booking toggle, membership/package eligible, provider/room assignment, consent required, intake form, aftercare, upsells, add-ons.
- **Actions:** Duplicate, archive, reorder, show/hide online, seasonal pricing, optional landing page.

### F. Memberships
- **Purpose:** Self-manage recurring plans.
- **Builder:** Name, monthly price, initiation fee, benefits, monthly credits, rollover, discounts, eligible services/products, pause/cancel rules, contract, auto-billing.
- **Per-client:** Active, paused, overdue, cancelled, anniversary, usage history.

### G. Inventory
- **Purpose:** Medical + retail tracking.
- **Types:** Retail, injectables, IV supplies, hormones/peptides, disposables, room supplies.
- **Fields:** SKU, name, category, quantity, reorder threshold, vendor, lot, expiry, cost, retail, usage per service.
- **Integration:** Chart note completion with product → auto-decrement.

### H. Marketing
- **Purpose:** Owner-controlled campaigns.
- **Features:** SMS/email campaigns, segments, promo banners, landing promos, lead capture, referral, review requests, reactivation, missed-call text-back.
- **Audience filters:** Never booked, no visit 90d, Botox/filler/weight loss/hormone, birthday month, VIP, abandoned booking, high-value.

### I. Staff
- **Purpose:** Team management.
- **Profile:** Name, title, permissions, schedule, service eligibility, commission, payroll tags, bio, image, booking color, room.
- **Roles:** front_desk, provider, manager, owner; no system settings for non-owner.

### J. Reports
- **Purpose:** Owner decision-making.
- **Metrics:** Revenue (day/week/month), by provider/service/category; new clients; retention; rebook; no-show/cancel; memberships; package use; inventory; lead source; SMS performance; conversion.
- **Export:** CSV.

### K. Website / Content
- **Purpose:** No-code content edits.
- **Editable:** Hero, promos, service pages, FAQs, membership blurbs, provider bios, popups, booking CTAs, galleries, SEO sections.

### L. Settings
- **Subsections:** Business info, Locations, Notifications, Booking settings, Forms & consents, Payment settings, Integrations, User permissions, Audit log. No clutter.

---

## Part 4: Critical Fixes (Including “Clients Not Loading”)

### 4.1 Clients not loading
- **Cause:** `/api/clients` uses `getSupabase()`. If `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing/invalid/placeholder, `getSupabase()` returns `null` and the API serves an **empty in-memory store** (no data).
- **Fix:**
  1. Ensure env in hosting (Vercel etc.): `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set and not placeholder.
  2. Verify Supabase project: `clients` table exists and is readable by service role.
  3. Optional: On clients page, show a clear message when `data.source === 'local'` or `data.error` (e.g. “Database not connected” with link to env/setup).
- **Search behavior:** Today, when `search` is provided, the API filters **after** fetching one page (e.g. 100 rows). For large lists, search should be server-side (e.g. pass `search` to Supabase `ilike`/`or` and keep pagination). Mark as **simplify** in rebuild: server-side search + pagination.

### 4.2 Structural fixes (from your “5 most important”)
1. **Separate Operations / Configuration / Clinical**  
   - Daily ops: Dashboard, Calendar, Clients (list + hub).  
   - Clinical: Charting only (templates, notes, no sales mixed in).  
   - Config: Services, Memberships, Staff, Settings, Website/Content.  
   - Do not mix these on the same screen.

2. **Internal “Builders”**  
   - No-code builders: Services, Memberships, Forms, Consent templates, Campaigns, Website content blocks, Charting templates.  
   - All editable in admin; no hardcoded pricing/services/promos in code.

3. **Drawers and tabs**  
   - Use side drawers, tabbed client profile, modal quick edits, collapsible sections.  
   - Avoid one giant page per area.

4. **Role-based views**  
   - Front Desk: Dashboard, Calendar, Clients (limited), maybe Messages.  
   - Provider: + Charting, own schedule.  
   - Manager: + Reports, Staff, Marketing (if allowed).  
   - Owner: Full access + Owner portal.

5. **Owner portal**  
   - Dedicated route; revenue snapshot, pending issues, leads, marketing/membership health, low stock, staff productivity, quick edits for promos/pricing/services.

---

## Part 5: Phased Rebuild Plan

| Phase | Focus | Deliverables |
|-------|--------|--------------|
| **Phase 1** | Declutter + navigation reset | New sidebar (12 items); remove/merge duplicates; fix clients API + env; role-based nav (who sees what). |
| **Phase 2** | Calendar + client profile | Fresha-style calendar; client hub with tabs; appointment side panel. |
| **Phase 3** | Charting | Template-driven charting (Botox, filler, IV, hormone, etc.); separate from front-desk. |
| **Phase 4** | Service + membership builders | DB-driven services and memberships; owner-editable, no code deploy. |
| **Phase 5** | Marketing + content | Marketing center (SMS/email, segments, campaigns); Website/Content no-code editor. |
| **Phase 6** | Owner analytics portal | Owner dashboard (revenue, conversion, no-show, top services/providers, quick edits). |

---

## Part 6: Non-Negotiables Checklist

- [ ] Fresha-style calendar workflow (day/week/provider, drag-drop, status, side panel).
- [ ] True client profile hub (tabs: Overview, Appointments, Charting, Consents, Photos, Purchases, Memberships, Wallet, Messages, Files, Alerts).
- [ ] Separate charting portal (template-driven, medical only).
- [ ] Service builder (DB-driven, owner-editable).
- [ ] Membership builder (DB-driven, owner-editable).
- [ ] Content/website editor (no-code for hero, promos, service copy, etc.).
- [ ] Role-based permissions (Front Desk, Provider, Manager, Owner).
- [ ] Inventory with medical product tracking and auto-decrement from charting.
- [ ] Owner portal (business cockpit).
- [ ] Audit log (under Settings).
- [ ] No hardcoded pricing, services, or promos in code; all configurable in admin.

---

## Part 7: Design Direction

- **Feel:** Luxury medical, clean, premium, spacious, calm, fast.
- **Avoid:** Crowded, overly technical, cluttered, generic SaaS, “dev dashboard” aesthetic.
- **UI:** Consistent card layouts, search/filters everywhere, clear labels, inline edit where possible, important actions one click away, mobile-friendly for owner checks, audit history on records.

---

## Next Steps

1. **Immediate:** Fix clients loading (env + Supabase; optional UI message when DB unavailable). Optionally add server-side search to `/api/clients`.
2. **Before development:** Confirm this PRD and the audit (keep/simplify/move/rebuild/remove) with stakeholder.
3. **Phase 1:** Implement new sidebar, remove duplicate/obsolete links, wire Dashboard to new IA, enforce role-based visibility.
4. **Then:** Proceed Phase 2 → 6 in order, using this document as the single source of truth for the med spa operating system.

---

## Phase 1 completion (done)

- **New sidebar:** 12-item flat nav (Dashboard → Settings) in `app/admin/layout.tsx`.
- **Owner + POS:** Owner link and POS at top of sidebar; Owner link visible only for `owner` and `admin` roles.
- **Settings quick links:** Users & Access, Staff, Payments, Consent Forms, Notifications, Audit Log from Settings page.
- **Dashboard quick actions:** Calendar, Add Client, New Booking.
- **Clients page:** Clear “Database not connected” message when API returns `source: 'local'`.
- **Role-based nav:** `GET /api/auth/session` returns `{ role }` from `hgos_session` cookie; layout filters main nav by role:
  - **owner / admin:** Full nav + Owner link.
  - **staff:** No Charting, Inventory, Staff, Reports, Website/Content.
  - **provider:** No Memberships, Inventory, Marketing, Staff, Reports, Website/Content.
  - **readonly:** Only Dashboard, Calendar, Clients, Reports, Settings.
- **Clients API:** Server-side search via Supabase `.or()` + `ilike` on first_name, last_name, email, phone; pagination and total reflect search results.
