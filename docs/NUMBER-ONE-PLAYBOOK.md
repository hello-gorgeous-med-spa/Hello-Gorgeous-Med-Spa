# Hello Gorgeous — #1 Playbook: Everything to Dominate

**Goal:** Make Hello Gorgeous the #1 med spa in Oswego, Naperville, Aurora, and the western suburbs. This doc lists every lever you can pull — technical, content, GBP, reviews, paid, and operational.

---

## Tier 1 — Highest Impact (Do First)

### 1. Review Velocity (Non-Negotiable)

Google weighs reviews heavily. **Target: 3–5 new Google reviews per week for 60 days.**

| Action | How |
|--------|-----|
| Post-visit SMS | "Thank you for visiting! If you loved your results, would you mind leaving a quick Google review? [link]" |
| Review link | `https://g.page/r/CYQOWmT_HcwQEBM/review` |
| QR code at front desk | Print QR → Google review popup. Hand to clients at checkout. |
| Email follow-up | Square automation or manual: include review link 24–48 hrs after visit |
| Ask in person | "We'd love a Google review if you had a great experience." |

**Update schema:** Keep `lib/seo.ts` `SITE.reviewCount` and `SITE.reviewRating` in sync with your actual GBP numbers. Update monthly.

---

### 2. Google Business Profile — Perfection

| Action | Why |
|--------|-----|
| Primary category = **Medical Spa** | 60%+ of map ranking weight |
| Add every service | Botox, Morpheus8 Burst, Quantum RF, Solaria CO2, GLP-1, laser hair, etc. |
| 30–50 photos | Treatment rooms, tech, team, before/after (with consent), exterior |
| Booking URL | `https://hellogorgeousmedspa.com/book` |
| Reserve with Google | docs/RESERVE-WITH-GOOGLE.md — add booking link in GBP for "Book" button on Search/Maps |
| 1–2 Google Posts/week | Promos, education, Best of Oswego. Use `docs/GOOGLE_POST_CAMPAIGNS.md` |
| Respond to every review within 24–48 hrs | Shows engagement; Google rewards it |

---

### 3. Medical Directory Citations

Claim and optimize (NAP identical everywhere):

- Yelp
- Healthgrades
- Facebook
- Apple Maps
- Bing Places

**NAP:** 74 W. Washington Street, Oswego, IL 60543 | (630) 636-6193

---

### 4. Content That Outranks Competitors

Publish truth-based guide posts (no competitor names):

| Post | Target Phrase | Status |
|------|---------------|--------|
| What to Look for in an Oswego Med Spa | best medspa oswego | ✅ Done |
| Oswego Laser Resurfacing: Technology That Actually Works | laser resurfacing oswego | Draft |
| CO2 Laser Resurfacing in Oswego, IL — A Complete Guide | co2 laser oswego | Draft |
| Best Facial Treatments in Oswego | best facial oswego | Draft |
| Medical Weight Loss in Oswego: GLP-1 and Beyond | weight loss oswego | Draft |
| Laser Hair Removal in Oswego — What to Expect | laser hair removal oswego | Draft |

**Cadence:** 2 blog posts/month. Use `docs/EDITORIAL-CALENDAR.md`.

---

## Tier 2 — Strong Impact (Do Next)

### 5. Google Maps Behavior Signals

Google tracks: clicks, calls, direction requests, website visits from your listing.

| Action | How |
|--------|-----|
| Encourage Directions | In confirmation email/SMS: "Find us on Google and tap Directions when you need us." |
| Encourage Call | "Call us from our Google listing — it helps us show up for more people." |
| Encourage Website | "Visit our site through our Google listing." |

---

### 6. Case Studies / Client Stories

Publish 2–3 "Results" or "Client Story" pages:

- Before/after (with consent)
- Quote from client
- Service received
- "Book your consultation" CTA

Use in social, email, and as proof on the site.

---

### 7. Revenue-Based Conversion Tracking

Tie marketing to actual bookings:

| Action | How |
|--------|-----|
| UTM params | Add `?utm_source=google&utm_medium=organic` (or social, email) to booking links in campaigns |
| GA4 + Square/Fresha | Track which traffic sources lead to bookings. Manual log or integration if available. |
| Monthly review | "X bookings from organic, Y from social, Z from direct." |

---

### 8. Retargeting Ads

| Action | How |
|--------|-----|
| Meta Pixel | Add to site. Create "Website visitors" audience. |
| Retargeting campaign | $200–500/mo. Target people who visited but didn't book. |
| Ad copy | "Still thinking about it? Book your free consultation — $10/unit Botox, NP on site." |

---

### 9. Influencer Outreach

| Action | How |
|--------|-----|
| Identify 2–3 local influencers | Lifestyle, beauty, fitness, moms in Oswego/Naperville/Aurora |
| Offer | Free or discounted service for 1 post or story |
| Track | Reach, engagement, bookings attributed |

---

## Tier 3 — Technical & Optimization

### 10. Core Web Vitals

Run Lighthouse (mobile). Fix:

- LCP (Largest Contentful Paint) — optimize images, fonts
- CLS (Cumulative Layout Shift) — reserve space for images/ads
- INP (Interaction to Next Paint) — reduce JS blocking

---

### 11. Schema & Rich Results

- Validate at [Google Rich Results Test](https://search.google.com/test/rich-results)
- Ensure `aggregateRating` matches real review count
- Add `Service` schema to service pages

---

### 12. Internal Linking

- Link from homepage to key service pages
- Link from blog posts to relevant service pages
- Use "Best of Oswego" badges on high-traffic pages

---

### 13. Conversion Optimization

| Action | Where |
|--------|-------|
| Primary CTA above fold | Every page |
| "Free consultation" messaging | Lower barrier |
| Reduce form fields | Contact, booking |
| Trust signals | Best of Oswego, review count, NP on site |

---

## Tier 4 — Content & Systems

### 14. Editorial Calendar

- 90-day plan in `docs/EDITORIAL-CALENDAR.md`
- 2 blog posts/month

---

### 15. Social Cadence

- 2–3 FB/IG posts/week
- 1–2 Google Posts/week
- 1 Square email/week to 2,700 contacts

---

### 16. SEO Competitive Snapshot

- Quarterly: Search "best med spa oswego," "botox oswego," etc.
- Document who ranks #1–5
- Document in `docs/SEO-COMPETITIVE-SNAPSHOT.md`

---

### 17. Legal — Cease and Desist

- Have attorney review and send `docs/legal/cease-and-desist-smooth-solutions.md`
- Stops false competitor content

---

## Tier 5 — Paid & Scale

### 18. Google Ads (Local)

- Keywords: "med spa oswego," "botox oswego," "weight loss oswego"
- Geographic targeting: Oswego, Naperville, Aurora, Plainfield (5–10 mile radius)
- Start with $500–1,000/mo if budget allows

---

### 19. Meta / Instagram Ads

- Promote posts (Botox $10/unit, Best of Oswego)
- Target: Women 35–55, Oswego/Naperville/Aurora
- Retargeting: site visitors who didn't book

---

### 20. Educational Community

- Private FB group "Hello Gorgeous Insiders" for tips, early access, Q&A
- Or: weekly email tip to build loyalty

---

## Quick Reference

| Item | Link |
|------|------|
| Google review link | https://g.page/r/CYQOWmT_HcwQEBM/review |
| Booking URL | https://hellogorgeousmedspa.com/book |
| Google Post Campaigns | docs/GOOGLE_POST_CAMPAIGNS.md |
| Google Domination Blueprint | docs/GOOGLE_DOMINATION_BLUEPRINT.md |
| Beat Smooth Plan | docs/PLAN-BEAT-SMOOTH-SOLUTIONS.md |
| Gap Analysis | docs/INCREDIBLE-MARKETING-VS-HELLO-GORGEOUS.md |
| Near Me SEO | docs/NEAR-ME-SEO-AUDIT.md |

---

## Priority Order (This Month)

1. **Reviews** — 3–5/week. SMS + QR + ask in person.
2. **GBP** — Verify category, services, photos, posts.
3. **Citations** — Yelp, Healthgrades, Apple Maps.
4. **Content** — Publish 2 more guide posts.
5. **Social** — 2–3 posts/week, 1 email/week.
6. **Retargeting** — Add Meta Pixel, set up audience.

---

*You're better. You're smarter. Now execute.*
