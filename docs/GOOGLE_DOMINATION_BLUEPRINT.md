# Hello Gorgeous – Google Domination Blueprint

Local dominance on **visibility**, **trust**, **booking friction**, and **authority**. Follow phases in order.

---

## PHASE 1 — Profile Perfection (do this first)

### 1️⃣ Primary category (critical ranking factor)

- **Primary:** **Medical Spa**
- **Additional categories:** Weight Loss Service, IV Therapy Service, Laser Hair Removal Service, Wellness Center, Medical Clinic, Nurse Practitioner, Eyelash Salon, Day Spa  

Primary category affects 60%+ of map ranking weight. Set in [Google Business Profile](https://business.google.com).

### 2️⃣ Add all services in GBP

Add every service so Google indexes “near me” keywords:

Botox, Dysport, Jeuveau, Lip Filler, Revanesse, Juvederm, PRP Facial, Vampire Facial, Microneedling, GLP-1, Hormone Therapy, Pellet Therapy, Trigger Point, IV Therapy, Vitamin Injections, Peptide Therapy, Lab Draw, Telehealth, Laser Hair Removal, IPL, Acne Facial, Teen Facial, Detox Facial, HydraFacial, Chemical Peel, Brow Lamination, Lash Extensions.

### 3️⃣ Upload 30–50 photos

Google rewards active photo accounts. Include: treatment room, reception, injectables setup, you in scrubs, before/after (compliant), exterior storefront, staff, client testimonials, equipment, IV setup. Geotagged when possible.

### 4️⃣ Booking link in GBP

Set **Appointment URL** = `https://hellogorgeousmedspa.com/book`

---

## PHASE 2 — Review velocity

- **Target:** 3–5 new Google reviews per week for 60 days (non‑optional for outranking).
- **SMS review automation:** After appointment, clients receive:
  - *“Thank you for visiting Hello Gorgeous 💖 If you loved your results, would you mind leaving us a quick Google review? [Review Link]”*
- **Review link:** Direct to Google review popup: `https://g.page/r/CYQOWmT_HcwQEBM/review`
- **Dev:** Post-appointment review request SMS uses this link (see `/api/reviews/request`). Ensure your booking/checkout flow triggers the review request when appropriate.

---

## PHASE 3 — Google Posts (weekly)

Post 1–2 per week: weekly promo, educational post, before/after, new service, weight loss success, hormone therapy education, skincare tip. Use content you already have.

---

## PHASE 4 — Website local SEO (dev – done)

- **Local schema markup:** Root layout and key pages include:
  - **LocalBusiness** + **MedicalBusiness** + **HealthAndBeautyBusiness** (single `siteJsonLd()` block sitewide).
  - **Service schema:** Full list of procedures (Botox, Dysport, Jeuveau, Lip Filler, GLP-1, IV Therapy, etc.) in `availableService`; **hasOfferCatalog** with Book Appointment → `https://hellogorgeousmedspa.com/book`.
  - **FAQ schema:** `faqJsonLd()` on service and location pages.
  - **Review schema:** `aggregateRating` and sample `review` in `siteJsonLd()` (update with real counts when you have them).
- **Optimized pages:**
  - **Oswego hub:** `/oswego-il` — “Med Spa in Oswego, IL”.
  - **Service pages:** Each service has its own page with titles like “Botox, Dysport & Jeuveau in Oswego, IL”, “Lip Filler in Oswego, IL”, “Weight Loss Therapy in Oswego, IL”, “Hormone Therapy in Oswego, IL”.
  - **Location service pages:** `/oswego-il/[service]` — “{Service} in Oswego, IL” with **MedicalProcedure** + **FAQPage** JSON-LD.
- **Target phrases:** Botox Oswego IL, Lip Filler Oswego, GLP-1 Oswego, Hormone Therapy Oswego, Medical Spa Oswego, Weight Loss Oswego — covered in titles, descriptions, and schema.

---

## PHASE 5 — Google Maps behavior signals

Google tracks: **clicks**, **calls**, **direction requests**, **website visits**. Encourage clients to:

- Click **Directions** from the listing.
- **Call** from the listing.
- **Visit site** through the listing.

These behaviors improve ranking. Mention in confirmation emails/SMS or on receipts: “Find us on Google and tap Directions or Call when you need us.”

---

## Competition

If ProSculpt (or others) are the main competitors, you win by: **more reviews**, **more services listed**, **more Google posts**, **better SEO**, **better booking experience**, **faster review responses**. Google rewards activity and authority.

---

## Optional — Google Command Center (future dev)

An admin tool could include:

- See Google reviews (or sync from API if available).
- Draft responses to reviews.
- Track review growth and ranking keywords.
- Generate Google post ideas.
- Suggest service keywords to add to GBP.

This would centralize “Google domination” in one place.

---

## Quick reference

| Item | Where |
|------|--------|
| Booking URL | `https://hellogorgeousmedspa.com/book` |
| Google review link | `https://g.page/r/CYQOWmT_HcwQEBM/review` |
| Schema (LocalBusiness, services, FAQ) | `lib/seo.ts`; injected in root layout + service/location pages |
| Review request SMS | `app/api/reviews/request/route.ts` (uses Google review link above) |
