# Fix What Bothers Me

**Feature:** Clients share what’s on their mind in a personal, low-pressure way. The site suggests services that match (weight → GLP-1, pigmentation → chemical peels / IPL, lines → Botox / microneedling, etc.). Owners review in admin and can email a booking link or clients can book directly from the thank-you page.

## Where it lives

- **Public:** [/fix-what-bothers-me](/fix-what-bothers-me) — form + thank-you with suggested services and Book links.
- **Admin:** Marketing → **Fix What Bothers Me** — list submissions, status, notes, “Email them a booking link”.
- **Nav:** Header (Your Journey) and Footer (Explore) link to the form.

## One-time setup: database

Run the migration so submissions are stored and show in admin:

```bash
# In Supabase SQL Editor, run:
# lib/hgos/migrations/add-concern-submissions.sql
```

If the table doesn’t exist yet, the form still works: the client gets the thank-you page and suggested services and can book. Submissions just won’t appear in admin until the migration is run.

## How matching works

- **lib/concerns.ts** maps keywords in the message to services (e.g. “weight”, “pigmentation”, “wrinkles”).
- You can add or change patterns there to tune what gets suggested.
- If nothing matches, we suggest the **Quiz** and **Book a consultation**.

## Owner workflow

1. Open **Admin → Marketing → Fix What Bothers Me**.
2. Click a submission to see message, contact, and suggested services.
3. Update **Status** (New → Reviewed → Contacted → Booked) and **Your notes**; click **Save notes & status**.
4. Use **Email them a booking link** to open a pre-filled mailto with a link to `/book`.

## Optional: AI booking later

Right now, “AI books directly” is the client path: after submit they see suggested services and can click **Book** to go to `/book/[slug]`. For true “we book for them” (e.g. create a draft appointment or send a one-click booking link), you could add a button in admin that calls the booking API or sends a magic link; the data model and APIs are in place to support that.
