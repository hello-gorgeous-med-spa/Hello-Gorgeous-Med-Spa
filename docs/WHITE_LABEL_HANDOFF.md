# White-Label Handoff: Run Like Fresha

**Goal:** Your system runs like a product you sell — each purchaser gets their own branded instance they can own and run, similar to handing them a Fresha-style med spa OS.

---

## 1. No Hardcoded Branding

**Current:** "Hello Gorgeous" and your address/phone appear in Settings and possibly in copy around the app.

**Needed:**

- **Single source of truth for brand:** Business name, logo URL, primary color(s), favicon, support email, phone, address, timezone, currency.
- **Use it everywhere:** Public site (meta tags, footer, contact), admin header, emails, PDFs, receipts. No "Hello Gorgeous" or your address in code — only in Settings (or env for first deploy).
- **Optional:** Logo upload in Settings → stored (e.g. Supabase Storage or existing media) → used in header and public pages.

**Concrete:** Ensure `app/admin/settings` (and any `/api/settings`) persist business name, phone, email, address, timezone. Add fields: `logo_url`, `primary_color`, `support_email` if missing. Replace any remaining hardcoded "Hello Gorgeous" / address with values from Settings or env.

---

## 2. Configurable First-Time Experience

**Needed so a purchaser can “turn it on” without you:**

- **Onboarding / setup wizard (optional but strong):** First login or first time Settings not complete → short flow: Business name, timezone, add first staff, add first service, connect payments (or “skip for now”). Then they land on Dashboard.
- **Or:** Clear “Getting started” in Owner’s Manual / Dashboard: “1. Complete Settings. 2. Add Staff. 3. Add Services. 4. Connect payments. 5. Open Calendar and go live.”

**Concrete:** Owner’s Manual (and/or a “Getting started” card on Dashboard) should be written for “a new med spa owner” not for you. Link to Settings, Staff, Services, Payments, Calendar.

---

## 3. Auth: They Use Their Own People

**Needed:**

- **No shared dev logins:** Purchaser (and their staff) log in with accounts that belong to their business, not to you.
- **Ways to get users in:**  
  - **Option A:** You (or an installer) create first Owner user in DB and send them a magic link or temp password.  
  - **Option B:** Sign-up flow (e.g. invite link or “Create account” for first user) that creates users in their tenant/instance.  
  - **Option C:** SSO/SAML for larger buyers (later).
- **Roles already in place:** owner, admin, staff, provider, readonly. Keep using them so they can assign roles.

**Concrete:** Document “How to create the first Owner” (e.g. insert in `users` + set role, or run a one-off script). If you add an invite/signup flow, scope it to the instance (single-tenant) or tenant_id (multi-tenant).

---

## 4. Their Domain, Their Deployment

**Needed:**

- **Their URL:** They run on their domain (e.g. `book.theirmedspa.com` or `app.theirmedspa.com`), not yours.
- **Env per purchaser:** Each deployment has its own `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, Stripe/Square keys, SMS keys, and (if you use it) `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_APP_URL` so links in emails and UI point to their domain.
- **Deploy docs:** One-pager or README: “Deploy to Vercel (or X): set these env vars, connect your Supabase, run migrations, create first user.”

**Concrete:** README or `docs/DEPLOYMENT.md` with list of env vars and “first user” steps. Use `NEXT_PUBLIC_SITE_URL` (or similar) in any email templates or public links so they don’t point to hellogorgeousmedspa.com.

---

## 5. Their Data, Their Integrations

**Needed:**

- **Database:** Each purchaser has their own Supabase project (or their own schema/tenant in a multi-tenant DB). No shared production data between buyers.
- **Payments:** They connect their own Stripe and/or Square so money goes to them.
- **SMS/Email:** Their Twilio/Telnyx/SendGrid (or whatever you use) so messages come from their number/brand.

**Concrete:** Deployment checklist: “Create Supabase project, run migrations, add Stripe keys, add SMS keys.” No hardcoded API keys; all from env (or from Settings if you store encrypted keys in DB later).

---

## 6. Clear “Product” Surface

**So it feels like one product, not a dev project:**

- **Consistent nav and flows:** You already have Dashboard, Calendar, Clients, Charting, Services, Memberships, Marketing, etc. Keep one clear entry (e.g. one admin URL) and no stray “dev-only” links in production.
- **Live System:** Keep it as “see your system status” for the owner, not “dev debug.” Optional: hide or restrict to Owner role if you want.
- **Help:** Owner’s Manual + “Getting started” + (optional) in-app help or tooltips so they don’t need to call you for every question.

**Concrete:** Audit sidebar and Dashboard: remove or hide links that are dev-only (e.g. live-state can stay but be Owner-only). Ensure Owner’s Manual is generic (“your med spa”) not “Hello Gorgeous.”

---

## 7. Optional: Multi-Tenant vs Single-Tenant

**Single-tenant (one deployment per purchaser):**

- Each buyer gets their own Vercel (or server) + own Supabase + own env. Easiest isolation, clearest “you own this.”
- You hand off: repo access (or a built artifact), env template, and deployment docs. They (or their IT) deploy once.

**Multi-tenant (one app, many buyers):**

- One codebase, one deployment; each buyer is a “tenant” (e.g. `tenant_id` on clients, appointments, users, etc.). Login and all queries scoped by `tenant_id`.
- Harder to build and to get right (billing, signup, tenant creation, data isolation). Fresha does this; you can defer until you have many buyers.

**Recommendation:** Start **single-tenant**: one deployment per purchaser, their Supabase, their env. That gets you to “white-label handoff” quickly. Add multi-tenant later if you need one app serving many businesses.

---

## Checklist: “Ready to Hand Off”

- [ ] **Branding:** All customer-facing and admin UI use business name/logo/contact from Settings (or env); no hardcoded “Hello Gorgeous” or your address in code.
- [ ] **Settings:** Business info, timezone, payments config, notifications — all editable in admin; persisted and used everywhere.
- [ ] **First user:** Documented way to create first Owner (e.g. script or one-time signup) so the purchaser can log in.
- [ ] **Deployment:** Doc with env vars and steps to deploy (e.g. Vercel + Supabase); `NEXT_PUBLIC_SITE_URL` (or equivalent) set to their domain.
- [ ] **Their data:** Their Supabase project (and Stripe/Square/SMS) so data and money are theirs.
- [ ] **Getting started:** Owner’s Manual or Dashboard card that walks a new owner through Settings → Staff → Services → Payments → Go live.
- [ ] **No dev cruft:** Production build doesn’t expose dev-only routes or debug info to non-Owners (optional: restrict Live System to Owner).

When these are done, you can sell and hand off the system like a product: “Here’s your instance, your domain, your data; here’s how to get started.”
