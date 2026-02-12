# Marketing & SMS — Get Set Up (One Place)

**Hello Gorgeous Med Spa**  
Use this guide to get Telnyx (SMS/MMS), Resend (email), and your contact list ready. Everything is manageable from your **Owner Dashboard** and **Marketing** pages.

---

## Nameservers & DNS: Where did I put them?

- **Vercel** — If you host your website (this app) on Vercel and pointed your domain there, your **nameservers/DNS are with Vercel**. You manage the domain in Vercel → Project → **Settings → Domains** (add/edit DNS records there).
- **Supabase** — Supabase is your **database and backend only**. It does **not** host your domain or DNS. So you did **not** transfer nameservers to Supabase.
- **Bottom line:** If you “transferred DNS” when moving off GoDaddy, it’s almost certainly **Vercel**. To add Resend’s email records (or any DNS), go to **Vercel → your project → Settings → Domains → [your domain] → DNS / Records** and add the records there.

---

## Telnyx vs Resend (Fresha-style “blast” comparison)

| In Fresha | In Hello Gorgeous OS |
|-----------|----------------------|
| **Blast SMS / text campaigns** | **Telnyx** — same idea. You send **text blasts** from **Admin → SMS Campaigns** (`/admin/sms`). Pick a template or write a message, choose “All” or a custom list, click Send. Telnyx is the provider that delivers the texts. |
| **Blast email campaigns** | **Resend** — same idea. Resend is the provider that delivers **email**. You configure Resend (API key + verify your domain). Email campaigns in the app use Resend to send. |

- **Telnyx = SMS/text only** (one-click style in **Admin → SMS Campaigns**).
- **Resend = email** (marketing and transactional). Verify your domain where your **DNS** lives (e.g. Vercel) so “From” is your address (e.g. `hello@hellogorgeousmedspa.com`).

---

## 1. Where to do what (quick reference)

| Task | Where |
|------|--------|
| **See all setup steps** | **Owner Dashboard** → Marketing & SMS card (`/admin/owner`) |
| **View & grow contact list** | **Marketing** → **Contact Collection** (`/admin/marketing/contacts`) |
| **Upload a contact list (CSV)** | **Marketing** → **Contact Collection** → **Import from CSV** (`/admin/marketing/contacts#import`) |
| **Share sign-up link / QR code** | **Contact Collection** (same page — copy link or download QR) |
| **Send email/SMS campaigns** | **Marketing Hub** (`/admin/marketing`), **SMS Campaigns** (`/admin/sms`) |
| **Configure Telnyx / Resend** | **Business Settings** (or your hosting env: Vercel, etc.) |

---

## 2. Telnyx (SMS / MMS)

You’re set up with **Telnyx** for texting. To turn it on:

1. **Get credentials** from [Telnyx](https://telnyx.com):
   - API key
   - A phone number (or use an existing one)
   - Optional: Messaging Profile ID (for 10DLC)

2. **Add these in your hosting environment** (e.g. Vercel → Project → Settings → Environment Variables):

   - `TELNYX_API_KEY` — your Telnyx API key  
   - `TELNYX_PHONE_NUMBER` (or `TELNYX_FROM_NUMBER`) — e.g. `+13317177545`  
   - `TELNYX_MESSAGING_PROFILE_ID` — optional, for 10DLC compliance  

3. **Redeploy** so the app picks up the new variables.

After that, consent SMS, reminders, and SMS campaigns will send through Telnyx.  
Details: **docs/manuals/sms-marketing.md**.

---

## 3. Resend (marketing email)

Marketing and transactional emails use **Resend**.

1. **Sign up / log in** at [Resend](https://resend.com) and create an API key.

2. **Add these in your hosting environment**:

   - `RESEND_API_KEY` — your Resend API key  
   - `RESEND_FROM_EMAIL` — e.g. `Hello Gorgeous <hello@yourdomain.com>`  

3. **Use your own domain** so emails don’t go to spam:

   - In **Resend Dashboard** → **Domains**, add your domain (e.g. `hellogorgeousmedspa.com`).
   - Resend will show **DNS records** (SPF, DKIM, etc.).
   - In your **DNS provider** (wherever your domain is hosted — Cloudflare, Namecheap, Google Domains, etc.): open DNS settings and add those records exactly as Resend shows.
   - Back in Resend, click **Verify**. Once verified, use that domain in `RESEND_FROM_EMAIL`.

4. **Redeploy** after setting the env vars.

You do **not** need to move the domain to Resend — only add the DNS records they give you.

---

## 4. Contact list — where it lives

- **Contact Collection** (`/admin/marketing/contacts`) is the single place for your marketing list:
  - View subscribers
  - Copy **sign-up link** or download **QR code** to grow the list
  - **Import from CSV** to add/update contacts in bulk

---

## 5. Upload your contact list (CSV import)

1. Go to **Marketing** → **Contact Collection** → scroll to **Import contact list (CSV)** (or open `/admin/marketing/contacts#import`).
2. **Download the template** (button on that section) to get the correct column format.
3. Fill in your list. Required column:
   - **email**  
   Optional but recommended: **first_name**, **last_name**, **phone**.
4. Save as CSV (e.g. from Excel: “Save As” → CSV UTF-8).
5. Click **Choose CSV file**, select your file. The app will:
   - Add new contacts (with email opt-in; SMS opt-in if phone is present)
   - Update existing contacts (matched by email)

Format:

- First row can be headers: `email, first_name, last_name, phone`
- Or no headers: first column = email, then first name, last name, phone.

---

## 6. Owner Dashboard — one screen for everything

In **Owner Dashboard** (`/admin/owner`), the **Marketing & SMS** card gives you:

- **Quick links**: Contact Collection, Import CSV, Marketing Hub, SMS Campaigns, Business Settings
- **Checklist**: Telnyx env vars, Resend env vars, upload contacts, share sign-up link

Use this as your starting point so marketing and SMS are “set up in one place.”

---

## 7. Your domain and where to add DNS

- Your **domain** can stay wherever it’s registered. **DNS** (nameservers) might be at **Vercel** if you pointed the domain there when you set up the site — that’s common. Supabase does not host DNS.
- **Email sending** is done by Resend. You only need to:
  - Add Resend’s DNS records **wherever your domain’s DNS is** (e.g. Vercel → Project → Settings → Domains → your domain → add the records Resend shows).
  - Verify the domain in Resend.
- No need to move the domain to Resend — only add the DNS records they give you.

---

## 8. How to manage email and “blast” messages now

- **SMS/text blasts (Fresha-style one-click):**  
  **Admin → SMS Campaigns** (`/admin/sms`). Write or pick a message, choose “All” or a list, send. That uses **Telnyx** — no separate “email system” for texts.

- **Email and who sends it:**  
  **Resend** is your email system. You don’t have a separate inbox to “manage” like old GoDaddy email — you send from the app (or Resend) using your domain (e.g. `hello@hellogorgeousmedspa.com`). To make that work:
  1. Add **Resend** API key and from-address in your app env (see section 3).
  2. In **Resend**, add your domain and get the DNS records.
  3. Add those records **where your DNS is** (likely **Vercel** → Settings → Domains → your domain).

- **Blast email campaigns:**  
  The **Marketing Hub** (`/admin/marketing`) is where you’d run email campaigns. Resend is what actually sends them. If you prefer to send a one-off blast from Resend’s dashboard, you can do that too once the domain is verified and the app has `RESEND_API_KEY` and `RESEND_FROM_EMAIL` set.

---

## 9. Summary checklist

- [ ] Add `TELNYX_API_KEY` and `TELNYX_PHONE_NUMBER` (and optional `TELNYX_MESSAGING_PROFILE_ID`) in hosting env.
- [ ] Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in hosting env.
- [ ] In Resend, add your domain and add the DNS records in your DNS provider; verify in Resend.
- [ ] Upload your contact list: **Marketing** → **Contact Collection** → **Import from CSV** (or use the template).
- [ ] Share the sign-up link (or QR) from Contact Collection to grow the list.
- [ ] Send test SMS/email from **Marketing Hub** or **SMS Campaigns** to confirm everything works.

For day-to-day use: **docs/manuals/sms-marketing.md** (SMS) and **Marketing Hub** in the app.

---

## 10. Telnyx Architecture & "Forward Only" Clarification

### Architecture: Messaging Profiles (NOT Legacy Connections)

This system uses the **Messaging Profile** architecture — the modern Telnyx approach.
It does **not** use legacy "Messaging Connections."

- **Messaging Profile Name:** Hello Gorgeous SMS
- **Webhook URL:** `https://www.hellogorgeousmedspa.com/api/sms/webhook`
- **Phone Number:** `+13317177545`
- **Messaging Profile ID:** Set via `TELNYX_MESSAGING_PROFILE_ID` env var

### "Forward Only" in the Numbers view is VOICE ONLY

If the Telnyx Numbers page shows **"Forward only"** in the Connection/Application column,
this is the **voice routing** status — it does **NOT** affect SMS/MMS delivery.

SMS routing is controlled exclusively by the **Messaging Profile**, not the voice connection.
This means:
- "Forward only" label = **voice-only setting, safe to ignore for SMS**
- SMS sends via the Messaging Profile assigned to the number
- Webhook receives delivery events at the profile's webhook URL

### Number Configuration Checklist

Under **Numbers → +13317177545**:
- **Messaging tab:** Must show `Messaging Profile: Hello Gorgeous SMS`, Domestic SMS: Enabled
- **Voice tab:** Can say "Forward only" or anything else — irrelevant to SMS
- **Webhook:** Configured in the Messaging Profile, not per-number

### 10DLC Registration (REQUIRED for A2P marketing)

Without 10DLC registration, marketing campaigns **will be filtered or blocked** by carriers.
Even if all configuration is correct, messages won't reliably deliver without 10DLC.

Steps:
1. Register brand at `portal.telnyx.com/#/messaging-10dlc/brands`
2. Create campaign (use case: Marketing)
3. Assign phone number to campaign
4. Wait for approval (24-48 hours)

### Debug Test Endpoint

A temporary test route is available at:
```
GET /api/debug/telnyx-direct-test?to=+1XXXXXXXXXX
```
This bypasses all campaign logic and sends directly via the Telnyx API.
Returns the full Telnyx response including carrier error codes.
**Delete this route after testing is complete.**

### Env Vars (all in Vercel)

| Variable | Value | Required |
|----------|-------|----------|
| `TELNYX_API_KEY` | Your API key | Yes |
| `TELNYX_PHONE_NUMBER` | `+13317177545` | Yes |
| `TELNYX_MESSAGING_PROFILE_ID` | Profile UUID | Yes (for 10DLC) |
