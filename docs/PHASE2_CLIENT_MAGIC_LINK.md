# Phase 2 — Client Login via Magic Link (HIPAA-Aligned)

**Status:** Implemented  
**Scope:** Consumer-facing auth only; no passwords, no OAuth, no PHI in emails/URLs.

---

## What Was Built

### 1. Supabase Auth — Client enablement
- **Magic link:** Clients sign in via email only; Supabase Auth sends a one-time, time-limited link (configure in Supabase Dashboard: Auth → Email Templates; link expiry is set by Supabase, typically ≤15 min).
- **User mapping:** On first use of a magic link, the app finds or creates a `users` row (with `auth_id` = Supabase auth user id) and a `clients` row linked by `user_id`. No password is ever stored.
- **Role:** All magic-link logins receive role `client`.

### 2. Client login flow (`/login`)
- **Primary:** Email input + “Send me a secure login link”. Calls `POST /api/auth/magic-link`, which uses Supabase `signInWithOtp`. Helper text: “No password required. We’ll email you a secure, one-time link.”
- **Staff:** “Staff sign in with password” reveals password field and uses existing env-based login.
- **Redirect:** After magic link click, user is sent to `/portal`. If already authenticated as client and they hit `/login`, middleware redirects to `/portal`.

### 3. Auth callback (`/auth/callback`)
- Supabase redirects here with tokens in the URL hash (no PHI in query string).
- Page reads hash, calls `supabase.auth.setSession()`, then `POST /api/auth/client-session` with the access token.
- API verifies token, finds/creates user + client, sets `hgos_session` cookie (userId, role, email, clientId), audits login, returns user. Callback then calls `saveSession()` and sets `sessionStorage` for portal (`client_id`, `client_email`), then redirects to `/portal`.

### 4. Post-booking magic link
- After a successful booking, the create-booking API calls `POST /api/auth/send-portal-invite` with the booker’s email.
- That API uses Supabase Admin `auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo } })` to get a one-time link, then sends an email via Resend (if `RESEND_API_KEY` is set) with subject “Access your secure client space” and CTA “Access My Client Space”. No PHI in subject or body.

### 5. Portal access (`/portal`)
- Middleware allows access only when `hgos_session` has a valid role (including `client`).
- **Appointments API:** When the request has a session cookie with `role === 'client'`, the API forces `client_id` to the session’s `clientId` so clients only see their own appointments (minimum necessary).
- Portal content remains limited to: upcoming/past appointments (date + service), basic profile (name, email, phone). No clinical notes, diagnoses, labs, or provider notes in the client UI.

### 6. Footer privacy language
- Added to all public pages (footer): **“Privacy & Security — We use secure, encrypted systems to protect your information. Client access is provided via secure, one-time login links — no passwords required. We never share your personal information without your consent.”** Plus link to Privacy Policy.

---

## Configuration

### Supabase Dashboard
1. **Auth → URL Configuration:** Add your production and (if needed) dev redirect URLs, e.g.  
   `https://yourdomain.com/auth/callback`  
   `http://localhost:3000/auth/callback`
2. **Auth → Email Templates:** Customize the “Magic Link” template if desired (e.g. “Access your secure client space” and button “Access My Client Space”). Keep subject/body free of PHI.
3. **Auth → Providers:** Email must be enabled; magic link is the only method used for clients.

### Environment
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for client magic link and callback.
- `SUPABASE_SERVICE_ROLE_KEY` — required for client-session (find/create user+client) and send-portal-invite (generateLink).
- `RESEND_API_KEY` (optional) — for post-booking “Access your secure client space” email. If unset, the invite API still generates the link but does not send the email.
- `NEXT_PUBLIC_APP_URL` — used for redirect base and for booking create to call send-portal-invite; set in production.

---

## PWA compatibility
- Magic links work in browser and in an installed PWA (same origin). Session is stored in cookie + localStorage; ensure your PWA opens the same origin so the cookie is sent. If the app opens to `/` when unauthenticated, users can go to `/login` or book and receive the invite email.

---

## Out of scope (unchanged)
- Passwords and MFA for clients
- Native apps, OAuth/social login
- Clinical data in portal
- Push notifications

This phase intentionally prioritizes privacy, security, and ease of use; native apps and passwords are explicitly excluded.
