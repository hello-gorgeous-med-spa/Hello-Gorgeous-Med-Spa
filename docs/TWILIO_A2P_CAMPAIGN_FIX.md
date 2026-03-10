# Twilio A2P 10DLC Campaign Fix

Your campaign was **rejected for "issues verifying the Call to Action (CTA)"**. The main fix is using **real, live URLs** for Privacy and Terms (carriers check these). Your site already has the right pages.

## 1. Use these URLs in Twilio (required)

In **Edit A2P Campaign Details**, set:

| Field | Value |
|-------|--------|
| **Privacy Policy URL** | `https://www.hellogorgeousmedspa.com/privacy` |
| **Terms and Conditions URL** | `https://www.hellogorgeousmedspa.com/terms` |

Do **not** use `https://example.com/...` or leave them blank. Carriers verify that these URLs load and contain the required program/opt-out/help info.

## 2. What’s already on your site

- **Privacy** (`/privacy`): Data use, SMS section (§9), and **SMS Communications Policy** (§9, id `sms-communications-policy`) with program name, frequency, **STOP**/ **HELP**, message/data rates, opt-in paths, support contact.
- **Terms** (`/terms`): **Section 11 – SMS and Text Messaging Program** with consent, frequency, opt-out (**STOP**), support (**HELP**), contact info, link to Privacy.

After you add the URLs above, CTA verification can succeed.

## 3. Optional: strengthen CTA description

If reviewers still question the CTA, you can make the “Call to Action” description more explicit in the campaign description, for example:

- **CTA:** “Recipients tap the link in the message (https://hellogorgeousmedspa.com) to book appointments, view services, or contact the business. Opt-in and consent are collected on the same site via the booking form (/book), contact form (/contact), and documented in the Privacy and Terms links above.”

Keep your existing campaign description; the critical change is adding the real Privacy and Terms URLs.

## 4. Resubmission

1. In Twilio: **Fix Campaign** → **Edit A2P Campaign Details**.
2. Set **Privacy Policy URL** = `https://www.hellogorgeousmedspa.com/privacy`.
3. Set **Terms and Conditions URL** = `https://www.hellogorgeousmedspa.com/terms`.
4. Confirm message samples and opt-in description are unchanged (they’re fine).
5. Accept the **$15 vetting fee** and submit.

If it’s still rejected, use **Contact support** in the Twilio console and cite: Brand SID, Campaign SID, and that you’ve added the correct Privacy and Terms URLs and that CTA verification should now pass.
