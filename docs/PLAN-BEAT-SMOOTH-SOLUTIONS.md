# Plan to Beat Smooth Solutions — Audience Attraction & Market Dominance

**Goal:** Gain audience attraction, outrank Smooth Solutions, and show the market who Hello Gorgeous really is — without disparaging anyone. Win by being better, smarter, and more visible.

**Context:** Smooth Solutions ran a coordinated SEO campaign (Nov–Dec 2025) publishing false "consumer guides" that ranked themselves first and misrepresented Hello Gorgeous (e.g., "doesn't provide injectables," "boutique brow/lash only," "not a high-powered laser clinic"). They pay Incredible Marketing. You're investing in your own team and tools. **You win by out-executing them.**

**→ Full gap analysis:** See `docs/INCREDIBLE-MARKETING-VS-HELLO-GORGEOUS.md` for exactly what their agency does vs what you have, and how to do everything they do — but better.

---

## Core Strategy: Truth + Velocity + Authority

1. **Truth** — Publish content that accurately describes what Hello Gorgeous offers. Google rewards accurate, helpful content. Their false claims will eventually hurt their credibility.
2. **Velocity** — More reviews, more posts, more content, more engagement. Google and social algorithms reward activity.
3. **Authority** — Best of Oswego, NP on site, exclusive tech (Quantum RF, Morpheus8 Burst, Solaria CO2). Lead with proof.

---

## Phase 1 — Legal & Record-Setting (Week 1)

### 1.1 Send the Cease and Desist

- **Action:** Have a licensed Illinois attorney review and send the draft in `docs/legal/cease-and-desist-smooth-solutions.md`.
- **Why:** Stops further false content and creates a paper trail. You're not attacking — you're demanding accuracy.
- **Owner:** Danielle + attorney

### 1.2 Document the Truth (SEO + Reputation)

- **Action:** Add a "What We Offer" or "Our Services" page/section that explicitly lists everything — injectables, laser resurfacing, weight loss, hormone therapy, etc. Make it crawlable and schema-rich.
- **Why:** Establishes the factual record. When people search "Hello Gorgeous injectables" or "Hello Gorgeous laser," they see the truth.
- **Dev:** Ensure service pages and schema in `lib/seo.ts` reflect full service list. Add a "Full Service List" block if helpful.

---

## Phase 2 — Outrank Their Fake Guides (Weeks 2–6)

Smooth's articles target phrases like:
- "Best medspa in Oswego Illinois"
- "Best facial treatments in Oswego Illinois"
- "Best skincare clinic in Oswego Illinois"
- "Laser resurfacing in Oswego IL"
- "CO2 laser resurfacing Oswego IL"
- "Laser hair removal Oswego IL"

### 2.1 Publish Truth-Based "Guide" Content (No Competitor Names)

Create 4–6 blog posts that rank for the same intent but tell the truth and position Hello Gorgeous as the answer:

| Post Title | Target Phrase | Angle |
|------------|---------------|-------|
| What to Look for in an Oswego Med Spa | best medspa oswego | Checklist: NP on site, full injectables, laser tech, weight loss. You have all of it. |
| Oswego Laser Resurfacing: Technology That Actually Works | laser resurfacing oswego | Solaria CO2, Morpheus8, what to expect. No competitor names. |
| CO2 Laser Resurfacing in Oswego, IL — A Complete Guide | co2 laser oswego | InMode Solaria, Class 4, what it treats. |
| Best Facial Treatments in Oswego: What's Actually Available | best facial oswego | HydraFacial, chemical peels, laser, injectables — full spectrum. |
| Medical Weight Loss in Oswego: GLP-1 and Beyond | weight loss oswego | Semaglutide, tirzepatide, NP oversight. |
| Laser Hair Removal in Oswego — What to Expect | laser hair removal oswego | Technology, process, what to look for. |

**Rules:**
- Never mention Smooth Solutions or any competitor by name.
- Focus on education + "here's what Hello Gorgeous offers."
- Include clear CTAs: Book a consultation, Learn more.
- Add FAQ schema, internal links to service pages.

### 2.2 Technical SEO Check

- Ensure each new post has proper `title`, `description`, `canonical`, and JSON-LD.
- Internal link from homepage, services, and location pages.
- Submit new URLs in sitemap (Next.js sitemap should auto-include).

---

## Phase 3 — Audience Attraction (Ongoing)

### 3.1 Google Business Profile — Domination

Follow `docs/GOOGLE_DOMINATION_BLUEPRINT.md` and `docs/GOOGLE-BUSINESS-PROFILE-OPTIMIZATION.md`:

| Action | Target | Owner |
|-------|--------|-------|
| Primary category = Medical Spa | Ranking | Danielle |
| All services listed | "Near me" keywords | Danielle |
| 30–50 photos (treatment rooms, tech, team, B/A) | Engagement | Danielle |
| 3–5 reviews/week for 60 days | Outrank | Post-visit SMS |
| 1–2 Google Posts/week | Visibility | Use Campaign Studio |
| Booking link = hellogorgeousmedspa.com/book | Conversions | Already set |

**Review velocity is non-negotiable.** Smooth can't fake reviews. You earn them. Every happy client = one more 5-star.

### 3.2 Social Blast — Consistent Presence

Use `docs/campaigns/botox-10-unit-social-blast.md` as a template. Rotate:

- **Promos:** Botox $10/unit, weight loss specials, seasonal offers
- **Education:** "What to look for in a med spa," "NP on site matters," "Why Solaria CO2"
- **Proof:** Best of Oswego badges, before/after (with consent), client wins
- **Local:** Oswego, Naperville, Aurora, Plainfield tags

**Cadence:** 2–3 posts/week on Facebook + Google. Add Instagram/Reels when ready.

### 3.3 Email (Square) — 2,700 Contacts

- Weekly email: same message as social (promo, education, or proof).
- Subject lines: "$10/unit Botox," "Best of Oswego — Thank You," "What Makes Us Different."
- CTA: Book, read blog, leave a review.

### 3.4 "Tell Them Where the Sun Don't Shine" — The Smart Way

You don't attack. You **outperform**:

- **More reviews** → You look more trusted.
- **More accurate content** → Google prefers truth.
- **More engagement** → You show up more.
- **Best of Oswego** → Voted by the community, not self-published.
- **NP on site** → They can't claim that if they don't have it.
- **Exclusive tech** → Quantum RF, Morpheus8 Burst, Solaria CO2 — only you in the area.

Every client who chooses you over them is a vote. Every review is proof. Every post is visibility. **Winning is the best revenge.**

---

## Phase 4 — Conversion & Retention (Ongoing)

### 4.1 Booking Friction

- Ensure Book link is prominent everywhere (header, CTAs, footer).
- Fresha link in every post, email, and story.
- "Free consultation" messaging — lower barrier.

### 4.2 Review Request Automation

- Post-visit SMS with Google review link: `https://g.page/r/CYQOWmT_HcwQEBM/review`
- Check `app/api/reviews/request` and booking flow — ensure it triggers.
- QR code at front desk for in-person requests.

### 4.3 Retargeting (Future)

- If you add Meta Pixel or Google Ads, retarget site visitors and booking abandoners.
- Lower priority than organic for now.

---

## Quick Wins (Do This Week)

1. [ ] Attorney reviews and sends cease and desist
2. [ ] Verify GBP: primary category = Medical Spa, all services listed, booking URL set
3. [ ] Post 1 Google Post (Best of Oswego or $10/unit Botox)
4. [ ] Send 1 Square email to 2,700 contacts (promo or Best of Oswego thank-you)
5. [ ] Request 3–5 reviews from recent happy clients (manual SMS/email with review link)
6. [ ] Draft first "guide" blog post: "What to Look for in an Oswego Med Spa"

---

## What You Have That They Don't

| Asset | Smooth | Hello Gorgeous |
|-------|--------|----------------|
| Best of Oswego (4 categories) | No | Yes |
| NP on site as owner | Unknown | Yes |
| Quantum RF, Morpheus8 Burst, Solaria CO2 | No | Yes — only in area |
| False SEO content | Yes (liability) | No |
| 2,700 email contacts | Unknown | Yes |
| Modern website, booking, schema | Unknown | Yes |
| Truthful positioning | No | Yes |

---

## Summary

**Beat them by:**
1. Stopping their false content (legal)
2. Publishing truth-based content that outranks theirs (SEO)
3. Dominating Google (reviews, posts, services, photos)
4. Attracting audience (social, email, promos)
5. Converting (booking, consultations)
6. Never mentioning them — let your results speak

**You're better. You're smarter. Now prove it with velocity.**

---

*Last updated: March 2025*
