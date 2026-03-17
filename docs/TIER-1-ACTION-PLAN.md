# Tier 1 — Action Plan (Do First)

**Target:** 3–5 reviews/week, GBP perfection, citations claimed, 5 guide posts published.

---

## 1. Review Velocity — Checklist

**Goal:** 3–5 new Google reviews per week for 60 days.

### Automated (if using HG OS appointments)

- [ ] Verify `REVIEW_REQUESTS_ENABLED` is not `false` in Vercel env
- [ ] Verify Vercel Cron runs `/api/cron/review-requests` (check vercel.json)
- [ ] Confirm appointments flow into `appointments` table when completed (Fresha webhook or manual)
- [ ] Confirm `review_requests_pending` gets populated when appointment completes

### Manual (every visit)

- [ ] **QR code at front desk** — Print from https://www.qr-code-generator.com/ with URL: `https://www.hellogorgeousmedspa.com/review` — hand to clients at checkout
- [ ] **Ask in person** — "We'd love a Google review if you had a great experience. Here's a quick link."
- [ ] **SMS template** (if not automated): "Hi [Name]! Thank you for visiting Hello Gorgeous 💖 If you loved your results, would you mind leaving us a quick Google review? https://www.hellogorgeousmedspa.com/review"

### Easy review link

- **Short URL:** `hellogorgeousmedspa.com/review` → redirects to Google review popup
- Use this everywhere: SMS, email, QR code, receipts

### Schema update (monthly)

- [ ] Update `lib/seo.ts` `SITE.reviewCount` and `SITE.reviewRating` to match your actual GBP numbers

---

## 2. Google Business Profile — Checklist

**Goal:** Profile perfection for map ranking.

### Critical

- [ ] Primary category = **Medical Spa**
- [ ] Add every service: Botox, Dysport, Jeuveau, Morpheus8 Burst, Quantum RF, Solaria CO2, GLP-1, laser hair, fillers, hormone therapy, IV therapy, microneedling, HydraFacial, chemical peel, etc.
- [ ] Booking URL = `https://www.hellogorgeousmedspa.com/book`
- [ ] Reserve with Google: Add booking link in GBP → Bookings (see `docs/RESERVE-WITH-GOOGLE.md`)

### Photos (30–50 total)

- [ ] Exterior / storefront
- [ ] Reception area
- [ ] Treatment rooms
- [ ] Injectables setup
- [ ] Morpheus8 / Quantum RF / Solaria equipment
- [ ] Team (Danielle, Ryan, staff)
- [ ] Before/after (with consent)
- [ ] IV setup

### Weekly

- [ ] 1–2 Google Posts (use `docs/GOOGLE_POST_CAMPAIGNS.md`)
- [ ] Respond to every new review within 24–48 hrs

---

## 3. Medical Directory Citations — Checklist

**Goal:** NAP identical everywhere. Claim each listing.

**Canonical NAP:**
- **Name:** Hello Gorgeous Med Spa
- **Address:** 74 W. Washington Street, Oswego, IL 60543
- **Phone:** (630) 636-6193
- **Website:** https://www.hellogorgeousmedspa.com

| Directory | Claim Link | Status |
|-----------|------------|--------|
| Yelp | https://biz.yelp.com/ | [ ] |
| Healthgrades | https://www.healthgrades.com/group-practices/add-your-practice | [ ] |
| Facebook | Create/claim Page, add NAP | [ ] |
| Apple Maps | https://mapsconnect.apple.com/ | [ ] |
| Bing Places | https://www.bingplaces.com/ | [ ] |

See `docs/TIER-1-CITATIONS.md` for detailed claim steps.

---

## 4. Content — Guide Posts Checklist

**Goal:** Publish 5 truth-based guide posts that outrank competitor content.

| Post | Slug | Status |
|------|------|--------|
| What to Look for in an Oswego Med Spa | what-to-look-for-in-oswego-med-spa | ✅ Done |
| Oswego Laser Resurfacing: Technology That Actually Works | oswego-laser-resurfacing-technology | ✅ Done |
| CO2 Laser Resurfacing in Oswego, IL — A Complete Guide | co2-laser-resurfacing-oswego-il-guide | ✅ Done |
| Best Facial Treatments in Oswego: What's Actually Available | best-facial-treatments-oswego | ✅ Done |
| Medical Weight Loss in Oswego: GLP-1 and Beyond | medical-weight-loss-oswego-glp1 | ✅ Done |
| Laser Hair Removal in Oswego — What to Expect | laser-hair-removal-oswego-what-to-expect | ✅ Done |

**Rules:** No competitor names. Focus on education + Hello Gorgeous strengths. Clear CTA: Book consultation.

---

## This Week — Priority Order

1. [ ] Create QR code for hellogorgeousmedspa.com/review — put at front desk
2. [ ] Verify GBP: primary category, all services, booking URL
3. [ ] Post 1 Google Post (Best of Oswego or $10/unit Botox)
4. [ ] Claim Yelp and Healthgrades (start with these two)
5. [ ] Request 3–5 reviews from recent happy clients (manual SMS with /review link)
6. [ ] Publish next guide post (Oswego Laser Resurfacing or CO2 Laser)

---

*Reference: docs/NUMBER-ONE-PLAYBOOK.md*
