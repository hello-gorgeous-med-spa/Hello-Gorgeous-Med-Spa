# GBP optimization checklist (SEO-001 Sub-task 1)

Use this in Square/Google Business Profile UI. Site code already mirrors NAP + map/reviews.

## Canonical NAP (must match byte-for-byte)

Source: `lib/seo.ts` → `SITE`

| Field | Value |
|---|---|
| Name | Hello Gorgeous Med Spa |
| Street | 74 W. Washington Street |
| City / Region / ZIP | Oswego, IL 60543 |
| Phone | 630-636-6193 |
| Website | https://www.hellogorgeousmedspa.com |
| Maps / CID | `SITE.googleBusinessUrl` / placeId in `lib/seo.ts` |

Verify footer, contact page, JSON-LD (`siteJsonLd` / `mainLocalBusinessJsonLd`), and GBP profile all match.

## Categories

- **Primary:** Medical Spa
- **Secondary (add all that apply):** Weight loss service · Skin care clinic · Facial spa · Laser hair removal · Medical clinic (if allowed) · Wellness center

Paste helper docs (if still current): `docs/GBP_SERVICES_PASTE_2026-05-03.md`, `docs/GBP-VISIBILITY-FIXES.md`

## Service areas (primary Fox Valley)

Oswego · Naperville · Aurora · Plainfield · Yorkville · Montgomery  
(Do not push far-flung cities that 301 to hubs.)

## Photos / Q&A

- [ ] 20+ photos (exterior, team, treatment rooms, devices, before/after where compliant)
- [ ] Seed Q&A from `/faq` and `/cancellation-policy` (no PHI, no outcome guarantees)

## Posts cadence

- Presets: `lib/google-business-post-presets.ts`
- Admin: `/admin/marketing/post-social`
- Scripts: `scripts/publish-*-gbp-now.mjs`
- Target: ≥3 posts/week (offer / education / social proof) with UTM links to landers

## Cancellation / no-show protection (Square Appointments)

**API cannot write policy text or card-hold settings** (confirmed 2026-07-12). Do this in Dashboard:

1. **Appointments → Settings → Payments & cancellations**
2. Paste final policy from https://www.hellogorgeousmedspa.com/cancellation-policy (no † placeholders)
3. Set client cancel/reschedule cut-off to **24 hours** (48h advanced = staff judgment + policy text)
4. Enable **Hold card in case of no-show**
5. Fee model closest to published policy:
   - Late cancel: greater of **$50 or 50%**
   - No-show: greater of **$100 or 100%**
6. Optional: deposits ($50) on advanced services

## Site integrations (already shipped)

- [x] Contact page map + live place card
- [x] `/reviews` Google Business spotlight
- [x] Review request automation after Square payments

## Sign-off

| Check | Owner | Date |
|---|---|---|
| NAP verified in GBP | | |
| Categories + service areas | | |
| Card-hold + fees live | | |
| Policy text updated | | |
| 20+ photos | | |
