# Hello Gorgeous vs Santé Medspa — Structure & UX Audit

**Reference:** [Santé Medspa (santembb.com)](https://santembb.com/) — Naperville luxury medspa (Medstar Media).  
**Purpose:** Align HG structure and conversion elements with what works on a strong competitor, while keeping your branding (black/white/#E6007E, no gray).

---

## 1. Santé Structure (Summary)

| Section | What they do |
|--------|----------------|
| **Top** | Promo banner (e.g. Black Friday), social, nav with Services (Beauty/Body), About, Contact, **Book Online** (New vs Existing), **Call** in header |
| **Hero** | One headline: "A Higher Standard of Health & Beauty" + single CTA: **Request a consultation** |
| **Trust** | "TREATMENTS FEATURED IN" (press/logos) |
| **Positioning** | Welcome copy + "Look Beautiful. Feel Beautiful. Be Beautiful." |
| **Pillars** | **Beauté** / **Modelage du Corps** / **Esprit** (Beauty, Body, Mind) — each with short intro |
| **Service grids** | Per pillar: treatment cards with **Learn more** (e.g. BBL Hero, Botox, Dysport, Fillers, IV, GLP-1, etc.) |
| **Mid CTA** | "We Illuminate the Best in You" + **BOOK NOW** |
| **Our Story** | Dedicated section + **READ MORE** (about page) |
| **Testimonials** | "What our clients are saying" — named quotes (Katie O., Cindy C., etc.) |
| **Quote** | "Beauty will save the world" (Dostoevsky) + **LEARN MORE** |
| **FAQs** | **Naperville Medspa FAQs** — accordion (location, who performs, services, cost, what to look for, telehealth) |
| **Contact** | **Let's Chat** — form on homepage (new/existing, name, email, phone, area of interest, how heard) |
| **Footer** | **5.0 Stars +200 Google Reviews**, location, hours, consent/disclaimer, "A toast to your health" |

---

## 2. Hello Gorgeous — What You Already Have

| Section | Current state |
|--------|----------------|
| **Hero** | Strong: "Modern Aesthetic Medicine. Built for Confidence." + Book + Explore Services (Opus-style) |
| **Trust** | TrustStrip: NP-Owned, Advanced Injection Expertise, Precision-Based Planning, Oswego IL |
| **Services** | ServicesSection: 4 cards (Injectables, Skin Rejuvenation, Medical Weight Loss, Hormone Optimization) with **Learn more** |
| **RX** | RxShowcaseSection (medical division) |
| **Experience** | "Where Precision Meets Artistry" + consultation image |
| **Innovation / AI** | InnovationSection, AIAssistantsSection |
| **Philosophy** | PhilosophySection: "Confidence Should Feel Effortless." (quote-style) |
| **Final CTA** | "Ready to Elevate Your Look?" + Book + Call |
| **About** | Dedicated About page: values (Provider-led, Natural-looking, Local), MeetProviders, CTA — **not** a story block on homepage |
| **Contact** | Dedicated Contact page with form, map, hours — **no** form on homepage |
| **Footer** | Location, hours, services links, Explore links, Privacy/Terms/HIPAA — **no** review count/badge |
| **Testimonials** | HOME_TESTIMONIALS in schema (SEO) — **no** visible testimonial section on homepage |
| **FAQs** | Some pages (e.g. Conditions, Explore Care) have FAQ schema; **no** local "Oswego/Naperville Medspa FAQs" on homepage or contact |

---

## 3. Gaps & Structure Ideas (Prioritized)

### High impact (conversion + SEO)

1. **Homepage FAQ block — "Oswego / Naperville Medspa FAQs"**  
   - **Idea:** Add an accordion section (e.g. before or after Final CTA) with 4–6 questions: Where are you located? Who performs treatments? What services do you offer? Do you offer telehealth? What should I look for in a medspa?  
   - **Why:** Matches Santé’s local FAQ; good for SEO and answering objections on the main landing page.

2. **Testimonials on homepage**  
   - **Idea:** "What our clients are saying" — 3–6 named quotes (reuse HOME_TESTIMONIALS or reviews), with optional "Watch video" / "Read more" if you have them.  
   - **Why:** Santé leads with social proof; you already have schema, just need a visible block.

3. **Review badge in footer (and/or trust strip)**  
   - **Idea:** "5.0 Stars" + "[X] Google Reviews" with link to Google or /reviews.  
   - **Why:** Santé uses "5.0 Stars +200 Google Reviews" prominently; same idea in your footer/trust area.

### Medium impact (clarity + flow)

4. **One clear "Our Story" block on homepage**  
   - **Idea:** Short paragraph (2–3 sentences) + "Read our story" → /about. No need to duplicate the full About page.  
   - **Why:** Santé uses "Our Story" + READ MORE on the homepage; you have About but no story teaser on home.

5. **Primary hero CTA**  
   - **Current:** Book + Explore.  
   - **Idea:** Keep both; ensure "Book Consultation" is the dominant (e.g. solid #E6007E, "Explore" outline). Optional: test single CTA "Request a consultation" if you want to mirror Santé exactly.  
   - **Why:** Santé uses one primary CTA; you can stay with two and still keep hierarchy clear.

6. **Contact / "Let's Chat" on homepage**  
   - **Idea:** Add a compact form or "Questions? Let's chat" block (e.g. name, email, phone, area of interest) that either submits to same as Contact or scrolls to a form.  
   - **Why:** Santé captures leads on the homepage; you currently send everyone to /contact.

### Lower priority (nice to have)

7. **Three-pillar framing**  
   - **Current:** 4 service cards (Injectables, Skin, Weight, Hormones).  
   - **Idea:** Optionally group as **Beauty** (injectables + skin), **Body** (weight + body), **Wellness** (hormones + IV, etc.) with short intros like Santé’s Beauté / Body / Esprit.  
   - **Why:** Santé’s pillars make navigation by “what I want” very clear; your 4 cards already do that, so this is optional.

8. **Promo banner**  
   - **Idea:** Top strip for seasonal promos (e.g. "$10/unit Botox") or "Same-day appointments" — you already have some banner logic; ensure it’s visible and on-brand.  
   - **Why:** Santé uses a Black Friday bar; you can use the same pattern for your offers.

9. **Footer / Contact consistency**  
   - **Idea:** One line of copy that mirrors Santé’s "A toast to your health" (e.g. your tagline or "Confidence should feel effortless") and ensure hours + location + single phone number are above the fold in footer.  
   - **Why:** Santé’s footer is simple and scannable; you’re close, just tighten and add review badge.

---

## 4. Branding & Gray Audit (Already Addressed)

- **Santé:** Uses a lot of white/cream, soft gradients, and some gray text.  
- **Your direction:** Black / white / #E6007E only, no gray (per your brief).  
- **Status:** Explore Care and global tokens are updated; **About** and **Contact** still use `gray-50`, `gray-600`, `border-gray-200`.  
- **Action:** Replace those with `bg-white` or `bg-black`, `text-black/80` or `text-white/80`, and `border-black/10` so every page matches your branding.

---

## 5. Suggested Implementation Order

1. **Replace gray on About + Contact** with black/white/#E6007E (quick, full brand consistency).  
2. **Add homepage FAQ block** (Oswego/Naperville Medspa FAQs) with accordion.  
3. **Add homepage testimonials** using existing testimonial data (or reviews).  
4. **Add review badge** to footer (and optionally TrustStrip).  
5. **Add "Our Story" teaser** on homepage with link to /about.  
6. **Add "Let's Chat" or contact form** block on homepage (optional but high value).  
7. **Optionally** reframe services into three pillars and/or test single hero CTA.

---

## 6. Quick Reference: Santé vs HG

| Element | Santé | Hello Gorgeous |
|--------|--------|-----------------|
| Hero CTA | Single: Request consultation | Book + Explore Services |
| Trust | "Featured in" logos | TrustStrip (NP-Owned, expertise, location) |
| Service structure | Beauty / Body / Mind → treatment grid | 4 service cards → Learn more |
| Story on home | Our Story + READ MORE | About page only |
| Testimonials on home | Yes, named quotes | Schema only |
| Quote on home | Dostoevsky + LEARN MORE | PhilosophySection quote |
| FAQ on home | Yes, local accordion | No |
| Form on home | Yes, "Let's Chat" | No (Contact page only) |
| Footer review badge | 5.0 Stars +200 Reviews | No |
| Gray usage | Yes (grays, creams) | Being removed site-wide |

If you tell me which item you want to implement first (e.g. homepage FAQs, testimonials, or gray removal on About/Contact), I can outline or implement the exact copy and component changes next.
