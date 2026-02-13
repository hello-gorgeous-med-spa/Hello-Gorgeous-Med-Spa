# Hello Gorgeous Med Spa — Implementation Roadmap

Strategic phases for conversion, trust, and growth after the Premium Medical Glam foundation.

---

## Phase 1: Conversion Path Audit & Fix
**Goal:** Every journey leads clearly to booking. No dead ends or confusion.

| Task | Description | Status |
|------|-------------|--------|
| 1.1 | Audit Fix What Bothers Me → booking flow | ✅ |
| 1.2 | Audit Virtual Consultation → booking flow | ✅ |
| 1.3 | Verify Providers page "Book with [Name]" links to correct provider | ✅ |
| 1.4 | Verify Services pages have clear primary CTA | ✅ |
| 1.5 | Verify Offers/Specials CTAs work and are visible | ✅ |
| 1.6 | Add/ensure exit intent or "need help?" on long forms | ✅ |

**Deliverable:** Document of conversion paths + fixes applied.

---

## Phase 2: Providers as Trust Anchors
**Goal:** Danielle and Ryan are clearly the faces of authority. Book-with-provider is prominent.

| Task | Description | Status |
|------|-------------|--------|
| 2.1 | Add "Meet Your Provider" or provider cards to homepage hero area | ✅ |
| 2.2 | Add provider headshots + "Book with Danielle / Ryan" to key service pages | ✅ |
| 2.3 | Ensure provider profiles have strong intro video + results above the fold | ⬜ (defer) |
| 2.4 | Add provider-specific booking links to quiz/consult flows where relevant | ✅ |
| 2.5 | Testimonials: associate with provider when possible | ⬜ (defer) |

**Deliverable:** Providers visibly prominent on homepage + service pages.

---

## Phase 3: Lead Capture Optimization
**Goal:** Capture more qualified leads without being intrusive.

| Task | Description | Status |
|------|-------------|--------|
| 3.1 | Review lead popup timing (scroll depth, exit intent) | ✅ |
| 3.2 | Add preference fields: concern, timeframe, budget (optional) | ✅ |
| 3.3 | Ensure email capture connects to CRM / marketing tool | ✅ |
| 3.4 | Add "Get my results" or similar CTA after quiz completion | ✅ |
| 3.5 | Add post-quiz / post-consult follow-up email flow (if not exists) | ⬜ (defer) |

**Deliverable:** Improved lead form + documented follow-up flow.

---

## Phase 4: SEO & Performance
**Goal:** Better mobile score, faster loads, stronger meta.

| Task | Description | Status |
|------|-------------|--------|
| 4.1 | Run Lighthouse audit; document baseline scores | ✅ |
| 4.2 | Optimize hero image (size, format, priority) | ✅ |
| 4.3 | Add/fill meta descriptions on top 20 pages | ✅ |
| 4.4 | Ensure service + location pages have unique H1s and meta | ✅ |
| 4.5 | Target Lighthouse Mobile score > 85 | ✅ |

**Deliverable:** Lighthouse report + meta/performance improvements.

---

## Phase 5: Analytics & Feedback
**Goal:** Measure what matters. Learn from real behavior.

| Task | Description | Status |
|------|-------------|--------|
| 5.1 | Define key events: quiz complete, consult start, booking click | ✅ |
| 5.2 | Implement event tracking (GA4 / existing analytics) | ✅ |
| 5.3 | Add post-quiz satisfaction micro-survey (optional) | ✅ |
| 5.4 | Add post-booking "How did we do?" (optional) | ⬜ (defer) |
| 5.5 | Document dashboard or report for monthly review | ✅ |

**Deliverable:** Event tracking + feedback hooks in place. See `docs/ANALYTICS_EVENTS.md`.

---

## Phase 6: Local SEO
**Goal:** Dominate local searches for med spa + services in service area.

| Task | Description | Status |
|------|-------------|--------|
| 6.1 | Audit NAP (Name, Address, Phone) consistency site-wide | ⬜ |
| 6.2 | Ensure location pages (Oswego, Naperville, Aurora, Plainfield) have unique content | ⬜ |
| 6.3 | Add LocalBusiness schema where missing | ⬜ |
| 6.4 | Add Service schema for key treatments | ⬜ |
| 6.5 | Ensure Google Business Profile links/mentions where relevant | ⬜ |

**Deliverable:** NAP consistency + schema + location content audit.

---

## Phase 7: Membership & Retention
**Goal:** Make membership valuable and easy to find.

| Task | Description | Status |
|------|-------------|--------|
| 7.1 | Surface membership benefits on homepage or dedicated section | ⬜ |
| 7.2 | Add membership CTA to services/footer | ⬜ |
| 7.3 | Simplify signup flow (reduce steps, clear value prop) | ⬜ |
| 7.4 | Add member-only perks callout (e.g., 10% off, priority booking) | ⬜ |
| 7.5 | Consider renewal/expiry email flow | ⬜ |

**Deliverable:** Membership visible and easy to join.

---

## Phase 8: Before/After Pipeline
**Goal:** Steady flow of new results. Consent-first.

| Task | Description | Status |
|------|-------------|--------|
| 8.1 | Document before/after submission workflow (consent, approval) | ⬜ |
| 8.2 | Add service-level before/after galleries where applicable | ⬜ |
| 8.3 | Ensure Admin → Content → Providers media flow is used regularly | ⬜ |
| 8.4 | Add "Submit your results" CTA for post-treatment clients (optional) | ⬜ |

**Deliverable:** Process doc + service-level galleries.

---

## Phase 9: Testimonials & Social Proof
**Goal:** Real voices, video preferred. Schema for reviews.

| Task | Description | Status |
|------|-------------|--------|
| 9.1 | Collect 3–5 short video testimonials | ⬜ |
| 9.2 | Add video testimonial section to homepage | ⬜ |
| 9.3 | Add review schema (Review, AggregateRating) where appropriate | ⬜ |
| 9.4 | Link to Google Reviews / external review sites | ⬜ |
| 9.5 | Add "Share your experience" CTA post-appointment | ⬜ |

**Deliverable:** Video testimonials live + schema in place.

---

## Suggested Execution Order

| Order | Phase | Rationale |
|-------|-------|-----------|
| 1 | Phase 1: Conversion Path Audit | Fix leaks before driving more traffic |
| 2 | Phase 2: Providers as Trust Anchors | High impact, builds on existing provider pages |
| 3 | Phase 5: Analytics & Feedback | Need data to optimize everything else |
| 4 | Phase 3: Lead Capture | Capture more of the traffic you're fixing |
| 5 | Phase 4: SEO & Performance | Improve discoverability and UX |
| 6 | Phase 6: Local SEO | Strengthen local relevance |
| 7 | Phase 7: Membership | Monetize and retain |
| 8 | Phase 8: Before/After | Trust and results |
| 9 | Phase 9: Testimonials | Final trust layer |

---

## Tracking Progress

- Update status: `⬜` → `🔄` (in progress) → `✅` (done)
- Add notes under each phase as needed
- Revisit this doc in weekly or bi-weekly planning

---

*Last updated: [Add date when you start]*
