# Consumer Login & App — Current State & Gaps

**Bottom line:** Right now **consumers cannot log in or create a profile**. They can use the website and book, but the client portal and “app” (PWA) are not usable by them until client auth is added.

---

## What Works Today (Consumer End)

| Flow | Status |
|------|--------|
| Browse site, Fix What Bothers Me, services, etc. | ✅ Works |
| Book an appointment (/book) | ✅ Works — creates a **user** + **client** record in your DB (no password) |
| Contact form | ✅ Works |
| Join (marketing sign-up) /join | ✅ Works — email/phone for marketing; **does not** create a login account |
| Install site as “app” (PWA) | ✅ Portal has a manifest — **but** they can’t log in to use it |

---

## What Doesn’t Work (Consumer End)

| Flow | Issue |
|------|--------|
| **Log in to portal** | Login page only accepts **owner/admin** credentials (env vars). No client email/password is checked. Consumers get “Invalid email or password.” |
| **Create a profile / account** | There is **no sign-up page** and **no “create password”** flow. Booking creates a DB record but no Supabase Auth account, so they never get credentials. |
| **Use the client portal** | /portal is protected. Without valid client login, they’re redirected to /login and can’t get in. |
| **Use the “app”** | The PWA (client-manifest.json) opens at /portal. Same problem — they can’t log in. |

---

## Why This Happened

- **Staff/owner login** is implemented (env-based or Supabase).
- **Client-facing auth** (sign-up, set password, log in as client) was not built. Booking only writes to your `users` and `clients` tables; it does **not** create a Supabase Auth user or send a “set your password” / magic link.

---

## What You Need for Consumers to Log In & Use the App

1. **Client sign-up / “Create account”**
   - Option A: Add a **Sign up** path (e.g. email + password) that creates a **Supabase Auth** user and links it to your `users` / `clients` table (e.g. via `auth_id` or email).
   - Option B: When they **book**, send a **magic link** or **“Set your password”** email so their first login creates the link between Auth and their existing client record.

2. **Login API**  
   - Extend `/api/auth/login` (or use Supabase Auth) so that **client** email/password is validated (Supabase `signInWithPassword`) and returns a session with role `client` and redirect to `/portal`.

3. **Portal access**  
   - Middleware already protects `/portal`; once login returns a session with role `client`, they’ll be allowed in and can use the portal (and PWA) as intended.

4. **Profile**  
   - Portal can show their name, email, appointments, etc., by loading the **client** (and user) record linked to the logged-in auth user. No separate “create profile” step needed if you derive it from the client row.

---

## Recommendation

- **Short term:** Don’t promise “log in” or “use our app” to consumers until the above is implemented. You can keep saying “book online” and “we’ll confirm by email/text.”
- **Next step:** Implement **Option B** (set password / magic link after first book) or **Option A** (explicit sign-up page), then wire login for `client` role and test portal + PWA install.

If you want, the next concrete step is: **add “Set your password” email after first booking** and **client login via Supabase Auth** so consumers can log in and use the portal/app.
