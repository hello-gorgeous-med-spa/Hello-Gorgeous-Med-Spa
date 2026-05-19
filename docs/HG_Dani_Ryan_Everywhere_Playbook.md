# Hello Gorgeous — "Dani & Ryan Everywhere" Visibility Playbook

**Purpose:** Make Danielle Alcala-Glazier (Owner/Founder) and Ryan Kent, FNP-BC (Medical Director) visible everywhere a potential client might encounter Hello Gorgeous online. Founder-as-brand is HER Aesthetics' main moat. This playbook closes that gap and goes further — because you have a better story.

**Three surfaces covered:**
1. **Your own website** (Eric builds) — homepage, every service page, footer, blog
2. **Third-party profiles** (Dani fills out) — Google Business Profile, Yelp, directories
3. **Content authority** (Eric + Dani together) — author bylines, medical reviewer credits, schema

---

## The Canonical Credential Lines (use these verbatim everywhere)

These are the source-of-truth phrases. Copy and paste — don't paraphrase.

### Dani — short bio (for footers, service pages, micro-mentions)

> **Danielle Alcala-Glazier** — Licensed Esthetician, Phlebotomist, CMAA, CNA. Owner & Founder, Hello Gorgeous Med Spa.

### Dani — medium bio (for About page section, third-party profiles)

> Danielle Alcala-Glazier is the founder and owner of Hello Gorgeous Med Spa in Oswego, IL. She is a Licensed Esthetician, Phlebotomist, Certified Medical Administrative Assistant (CMAA), and Certified Nursing Assistant (CNA), and is currently pursuing her RN degree. Dani opened Hello Gorgeous over 10 years ago after a lifelong passion for skincare and a personal journey with severe acne and Accutane. Her aunt — who raised her and used to call her "hello gorgeous" — funded her first chair. Today the practice holds Best of Oswego awards for #1 Med Spa, Best Skincare, and Best Weight Loss.

### Dani — long bio (for the founder story page, LinkedIn, press)

> Danielle Alcala-Glazier is the founder and owner of Hello Gorgeous Med Spa in Oswego, Illinois. Her path into aesthetics started at age 12 with severe acne that no over-the-counter product could touch. At 18 she went on Accutane and became obsessed with the science of skin. After having two sons, she enrolled in esthetic school and opened her own practice with funding from her aunt — the woman who raised her and used to call her "hello gorgeous." That phrase, and her aunt's belief in her, became the name and the foundation of everything.
>
> Today, more than 10 years later, Dani is a Licensed Esthetician, Phlebotomist, CMAA, and CNA, currently pursuing her RN degree. She has built Hello Gorgeous from a single chair into the only practice in the western Chicago suburbs offering the complete InMode Trifecta — Morpheus8 Burst, Solaria CO₂, and Quantum RF — alongside injectables, medical weight loss, hormone therapy, peptides, IV therapy, and full medical aesthetics. The practice is recognized as #1 Best Med Spa in Oswego with multiple "Best of" awards.
>
> Dani is still in the office every day. She still answers texts. She still orders the products. She still invests in the equipment. Hello Gorgeous is a family-owned practice, not a chain — and that's the whole point.

### Ryan — short bio (for footers, service pages, micro-mentions)

> **Ryan Kent, FNP-BC** — Medical Director, Hello Gorgeous Med Spa. Board-certified Family Nurse Practitioner with full prescriptive authority. On site 7 days a week.

### Ryan — medium bio (for About page, third-party profiles)

> Ryan Kent is a board-certified Family Nurse Practitioner (FNP-BC) and the Medical Director of Hello Gorgeous Med Spa. Ryan holds full prescriptive authority in Illinois, allowing him to independently prescribe medications, supervise medical aesthetic protocols, and direct all clinical care at the practice. Unlike many med spas that rely on a remote physician medical director signing off from another state, Ryan is on-site 7 days a week, personally overseeing every protocol — from Botox dosing to GLP-1 weight loss programs to hormone therapy to laser treatments. Every clinical decision at Hello Gorgeous goes through Ryan.

---

# SURFACE 1: Your Website (Eric Builds)

## HG_DEV_014 — Founder & Credentials Visibility (Site-wide)

**Owner:** Eric
**Priority:** P1 (compounds with the Phase 1+2 SEO work — adds E-E-A-T signals that strengthen rankings)
**Estimate:** 4–6 hours
**Branch:** `feat/founder-everywhere`

### Why

Hello Gorgeous has every advantage HER Aesthetics has plus more — but the founder story is buried in `/about` instead of being on every page. Google's helpful-content updates explicitly reward content that demonstrates real human expertise (E-E-A-T: Experience, Expertise, Authoritativeness, Trust). Putting Dani's credentials and Ryan's full-NP status on every page hits all four E-E-A-T signals AND closes the visibility gap with HER.

### Scope

**In scope:**
1. New "Meet Dani & Ryan" section on homepage (with photos, short bios, link to full story)
2. Credentials micro-strip on every clinical service page ("Performed by [team], supervised by Ryan Kent, FNP-BC")
3. Footer credentials line site-wide
4. Provider/Author schema markup site-wide
5. Updated `/about` page with the medium-bio content for both Dani and Ryan
6. Blog post author + reviewer byline component (used in step 7 of content authority below)

**Out of scope (separate tickets):**
- New blog content (Dani writes)
- Third-party profile rollout (Dani does)
- New headshots (Dani arranges with photographer)

### Implementation details

#### 1. Homepage "Meet Dani & Ryan" section

Placement: Just below the hero section, before the Patient Favorites / Services grid. This section is the FIRST thing visitors see after the hero.

Visual layout (mobile-first, two-card row):

```
+--------------------------+--------------------------+
|  [DANI PHOTO 1:1]        |  [RYAN PHOTO 1:1]        |
|                          |                          |
|  Meet Dani               |  Meet Ryan               |
|  Owner & Founder         |  Medical Director        |
|                          |                          |
|  Licensed Esthetician,   |  Board-Certified Family  |
|  Phlebotomist, CMAA      |  Nurse Practitioner      |
|  RN in progress          |  Full prescriptive       |
|                          |  authority · On site 7   |
|  10+ years owning this   |  days a week             |
|  practice. Still in the  |                          |
|  office every day.       |  Every clinical protocol |
|                          |  at Hello Gorgeous goes  |
|  Read Dani's full        |  through Ryan.           |
|  story →                 |                          |
|                          |  Meet Ryan →             |
+--------------------------+--------------------------+
```

Required elements:
- Round or rounded-rectangle photos (whichever matches existing brand)
- Names as H3, role as subtitle
- Credentials in body text (2–3 lines max each)
- A short signature sentence in Dani's voice ("Still in the office every day.")
- "Read full story" CTA linking to `/about` (anchored to their respective bio sections)

Copy to paste (exact):

**Dani card:**
- Heading: `Meet Dani`
- Role: `Owner & Founder`
- Credentials: `Licensed Esthetician, Phlebotomist, CMAA, CNA (RN in progress)`
- Body: `10+ years owning this practice. Still in the office every day. Started with severe acne at 12, opened my first chair with help from the aunt who raised me, and I'm still here.`
- CTA: `Read Dani's full story →` → `/about#dani`

**Ryan card:**
- Heading: `Meet Ryan`
- Role: `Medical Director`
- Credentials: `Ryan Kent, FNP-BC — Family Nurse Practitioner, Board-Certified`
- Body: `Full prescriptive authority in Illinois. On site 7 days a week. Every clinical protocol at Hello Gorgeous — from Botox dosing to GLP-1 weight loss to hormone therapy — goes through me.`
- CTA: `Meet Ryan →` → `/about#ryan`

#### 2. Service page credentials strip

On every clinical service page (all 23 of the `-oswego` pages plus any legacy clinical pages), add a small credentials strip directly below the H1/value-prop section, before the "Why Hello Gorgeous" bullets.

Visual layout (compact, single row on desktop, stacked on mobile):

```
+---------------------------------------------------------+
|  [tiny photo]  Performed by our team. Medical oversight  |
|                by Ryan Kent, FNP-BC (Board-Certified     |
|                Family Nurse Practitioner, on site 7      |
|                days a week).                             |
|                                                          |
|                Owner & Founder: Danielle Alcala-Glazier  |
|                — Licensed Esthetician, Phlebotomist,     |
|                CMAA, CNA. 10+ years at this practice.    |
+---------------------------------------------------------+
```

Implementation: a reusable `<CredentialStrip />` component dropped into the service page template (`lib/service-pages-oswego/`). Same component, same copy, every page.

Copy to paste (exact, for the component):

```
Performed by our team. Medical oversight by Ryan Kent, FNP-BC (Board-Certified Family Nurse Practitioner, on site 7 days a week).

Owner & Founder: Danielle Alcala-Glazier — Licensed Esthetician, Phlebotomist, CMAA, CNA (RN in progress). 10+ years at this practice.
```

For the 3 medical/prescriptive pages (GLP-1, BioTE, TRT, Peptide Therapy, Semaglutide, Tirzepatide), use a stronger variant emphasizing prescription authority:

```
Every prescription at Hello Gorgeous is written and supervised by Ryan Kent, FNP-BC — a Board-Certified Family Nurse Practitioner with full prescriptive authority in Illinois, on site 7 days a week. Owner & Founder: Danielle Alcala-Glazier — Licensed Esthetician, Phlebotomist, CMAA, CNA.
```

#### 3. Site-wide footer

Add to the existing footer, in a new top row above the existing service links (or wherever fits the existing layout). Should be visible on every page.

Copy to paste:

```
Hello Gorgeous Med Spa — Family-owned. NP-directed.

Founder: Danielle Alcala-Glazier (Licensed Esthetician, Phlebotomist, CMAA, CNA) · Medical Director: Ryan Kent, FNP-BC (full prescriptive authority, on site 7 days a week)
```

This single line is the most-repeated credential mention on the entire site. Every page footer = credibility signal × every page.

#### 4. Schema markup (E-E-A-T)

Add a `MedicalBusiness` schema with `employee` references for both Dani and Ryan, plus separate `Person` schema for each, in the global site head (or at minimum on the homepage and `/about` page).

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Hello Gorgeous Med Spa",
  "founder": {
    "@type": "Person",
    "name": "Danielle Alcala-Glazier",
    "jobTitle": "Owner & Founder",
    "hasCredential": [
      {"@type": "EducationalOccupationalCredential", "credentialCategory": "Licensed Esthetician"},
      {"@type": "EducationalOccupationalCredential", "credentialCategory": "Phlebotomist"},
      {"@type": "EducationalOccupationalCredential", "credentialCategory": "Certified Medical Administrative Assistant (CMAA)"},
      {"@type": "EducationalOccupationalCredential", "credentialCategory": "Certified Nursing Assistant (CNA)"}
    ]
  },
  "employee": [
    {
      "@type": "Person",
      "name": "Ryan Kent",
      "jobTitle": "Medical Director",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Family Nurse Practitioner, Board-Certified (FNP-BC)"
      }
    }
  ],
  "medicalSpecialty": ["Aesthetic Medicine", "Weight Management", "Hormone Therapy"]
}
```

For each blog post or medical content page, also add:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "author": {
    "@type": "Person",
    "name": "Danielle Alcala-Glazier",
    "url": "https://www.hellogorgeousmedspa.com/about#dani"
  },
  "reviewedBy": {
    "@type": "Person",
    "name": "Ryan Kent, FNP-BC",
    "url": "https://www.hellogorgeousmedspa.com/about#ryan"
  },
  "lastReviewed": "{date}"
}
```

This is the schema combo that drives Google's medical/health content trust signal. Critical for SEO on medical pages.

#### 5. Updated `/about` page

The existing `/about` page should be rewritten to lead with the founder story rather than the "luxury aesthetics" generic copy. Structure:

1. **Top hero:** Photo of Dani + the medium bio (paste from Canonical Credential Lines above)
2. **The story section:** the long bio (paste from above)
3. **The Ryan section:** Photo of Ryan + the medium bio (paste from above)
4. **Awards & recognition:** Best of Oswego, Best Skincare, Best Weight Loss, 4.4★ Google
5. **The practice in numbers:** 10+ years, $500K invested in InMode, 23+ medical-grade treatments, 2,200+ active clients

Add anchor IDs (`#dani` and `#ryan`) to the respective sections so the homepage cards can deep-link to them.

#### 6. Blog post byline component

Build a reusable `<ArticleByline />` component to be added to every existing and future blog post. Format:

```
By Danielle Alcala-Glazier
Licensed Esthetician, Phlebotomist, CMAA · Owner, Hello Gorgeous Med Spa
Medically reviewed by Ryan Kent, FNP-BC
Last updated [date]
```

Component goes immediately under the blog post title and above the post body. Photos optional (compact byline preferred for blog readability).

This is what triggers Google's E-E-A-T trust scoring on medical content. Without author + reviewer transparency, medical blog posts are downranked.

### Asset checklist (for Dani to send Eric)

Before deploying, Dani sends Eric:

- [ ] Professional headshot of Dani (1:1 square or 4:5 portrait, minimum 600×600px, format: jpg or png)
- [ ] Professional headshot of Ryan (same specs)
- [ ] Both in branded outfits/setting if possible (HG pink/gold/black palette)
- [ ] Backup informal photos OK if professional ones aren't ready

If photos aren't ready, ship with text-only cards for now and replace later.

### Acceptance criteria

- [ ] `/` homepage has the Meet Dani & Ryan section live, above the fold or just below the hero
- [ ] All 23 Oswego service pages have the credentials strip rendering
- [ ] All medical/prescription pages (GLP-1, BioTE, TRT, etc.) use the prescription-focused variant
- [ ] Footer credentials line appears on every page
- [ ] `MedicalBusiness` schema with founder + employee blocks validates on Schema.org validator
- [ ] `/about` page rewritten with the new content
- [ ] `ArticleByline` component rendering on at least 3 existing blog posts
- [ ] `MedicalWebPage` schema with `author` + `reviewedBy` validates on blog posts
- [ ] Dani approves on incognito review before merge to main

---

# SURFACE 2: Third-Party Profiles (Dani's Checklist)

This is the part you handle yourself, over the next 7–14 days. Each profile is 5–15 minutes of focused work. Total time: ~2 focused hours spread across a week.

**The order matters.** Start with the highest-traffic profiles (Google, Yelp) and work down. Each one strengthens your overall SEO authority and Google Knowledge Panel.

## Top priority (do this week)

### 1. Google Business Profile (GBP) — your single most important profile

URL: business.google.com → log in → manage your Hello Gorgeous listing

**Updates to make:**
- [ ] **Business description** — paste this:

> Hello Gorgeous Med Spa is a family-owned medical aesthetics practice in Oswego, IL, founded by Danielle Alcala-Glazier (Licensed Esthetician, Phlebotomist, CMAA, CNA) and medically directed by Ryan Kent, FNP-BC. We're the only practice in the western Chicago suburbs with the complete InMode Trifecta (Morpheus8 Burst, Solaria CO₂, Quantum RF), and we offer injectables, medical weight loss, hormone therapy, peptides, and full medical aesthetics. Voted Best of Oswego #1 Med Spa, Best Skincare, and Best Weight Loss. NP on site 7 days a week.

- [ ] **Add team members:** GBP allows you to add team/staff. Add Ryan Kent, FNP-BC explicitly with his role as "Medical Director" so he appears in your knowledge panel.
- [ ] **Services list:** Confirm all 23 service categories are listed with descriptions.
- [ ] **Photos:** Upload new headshots of you and Ryan as "team" photos.
- [ ] **Q&A section:** Pre-answer the most common questions yourself (Google allows this). Suggested:
  - "Who owns Hello Gorgeous?" → "Hello Gorgeous is owned by Danielle Alcala-Glazier, a Licensed Esthetician with 10+ years in practice."
  - "Does a doctor or NP work there?" → "Ryan Kent, FNP-BC is our full-time Medical Director with full prescriptive authority, on site 7 days a week."
  - "How much is Botox?" → "Botox is $10 per unit. Most clients spend $200–$400 per visit. Free consultations available."

### 2. Yelp — second-highest local discovery surface

URL: biz.yelp.com → log in or claim the listing if you haven't already

**Updates:**
- [ ] **From the business** section: paste the medium Dani bio
- [ ] **Specialties** section: list InMode Trifecta as a flagship specialty
- [ ] **Owner photo** — upload a photo of you (this appears in your profile sidebar)
- [ ] **Meet the Business Owner** section: this is Yelp's founder-story feature. Many businesses skip it. Paste a short version of your story (4–6 sentences). Yelp surfaces this prominently on your listing.

### 3. Bing Places — covers ~7% of search traffic

URL: bingplaces.com → claim listing if not already

**Updates:**
- [ ] Business description (paste GBP version)
- [ ] Photos
- [ ] Services and hours
- [ ] Owner attribution

### 4. Apple Maps (Apple Business Connect) — iPhone/Siri searches

URL: businessconnect.apple.com

**Updates:**
- [ ] Business description
- [ ] Photos
- [ ] Service list

## Medical / Aesthetic-specific directories (do this week or next)

### 5. RealSelf provider profile

URL: realself.com → "For Providers" → claim or create profile

RealSelf is THE consumer review site for cosmetic procedures. Many of your potential clients research here before booking anywhere.

**Updates:**
- [ ] Provider profile for Hello Gorgeous Med Spa
- [ ] List Dani (esthetician) and Ryan (NP) as practitioners
- [ ] Full bios for both
- [ ] Treatment list with pricing where available
- [ ] Photos
- [ ] Encourage happy clients to leave RealSelf reviews — separate channel from Google reviews, valuable for cosmetic search

### 6. Healthgrades / Vitals / Webmd Care

URL: healthgrades.com → provider sign-up

**Updates:**
- [ ] Practitioner profile for Ryan Kent, FNP-BC
- [ ] Practice profile for Hello Gorgeous
- [ ] Specialties list

### 7. Allē by Allergan provider directory

URL: allergan.com → provider locator → confirm your listing

**Updates:**
- [ ] Confirm Hello Gorgeous appears in the locator
- [ ] Update business description with current branding
- [ ] Confirm address and hours match Google

### 8. InMode practice locator

URL: inmodemd.com → Find a Provider → confirm your listing

**Updates:**
- [ ] Confirm Hello Gorgeous appears as a Morpheus8 Burst + Solaria CO₂ + Quantum RF provider
- [ ] Request the Verified Provider badge images for all three (Eric needs these for the website)

### 9. BioTE provider locator

URL: biote.com → Find a Provider

**Updates:**
- [ ] Confirm Ryan Kent, FNP-BC is listed as a BioTE-certified provider
- [ ] Practice listing for Hello Gorgeous

### 10. Galderma + Merz directories (Dysport, Sculptra, Xeomin)

If you use Dysport, Sculptra, or Xeomin (Galderma + Merz brands), claim provider listings:
- galderma.com provider locator
- merzaesthetics.com provider locator

## Professional / Personal branding profiles (do over next 2 weeks)

### 11. LinkedIn — for both you and Ryan

**For Dani:**
- [ ] Update LinkedIn headline: "Owner & Founder, Hello Gorgeous Med Spa | Licensed Esthetician, Phlebotomist, CMAA | Building family-owned medical aesthetics in Oswego, IL"
- [ ] About section: paste the long bio
- [ ] Add the credentials in the "Licenses & Certifications" section
- [ ] Add Hello Gorgeous as your employer with role "Owner & Founder"

**For Ryan:**
- [ ] Headline: "Family Nurse Practitioner, Board-Certified (FNP-BC) | Medical Director, Hello Gorgeous Med Spa"
- [ ] About section: paste Ryan's medium bio
- [ ] Add Hello Gorgeous as current employer

### 12. Facebook business page

- [ ] Update the "About" section with the medium Dani bio
- [ ] Add Ryan as a "Team Member"
- [ ] Pin a post introducing yourselves with photos

### 13. Instagram bio

- [ ] Current: ? (whatever is there now)
- [ ] Updated: "Hello Gorgeous Med Spa · Family-owned, NP-directed · Botox $10/unit · Morpheus8 Burst · GLP-1 · Oswego IL · Book in bio ✨"

### 14. TikTok bio (if/when you start TikTok)

- [ ] Similar to Instagram bio

---

# SURFACE 3: Content Authority (Eric + Dani Together)

The third surface is the hardest to build but compounds the longest. It's about making sure every piece of medical content on the site has clear author + reviewer attribution.

## What this means in practice

Every blog post, every educational article, every Hello Gorgeous Hub resource page should include:

1. **Author byline** — Dani's name, credentials, and role
2. **Medical reviewer byline** — Ryan Kent, FNP-BC, when content is clinical
3. **Last reviewed date** — when the content was last verified
4. **Schema markup** — `Article` schema with `author` and `reviewedBy` properties

## Existing blog audit (Dani's task)

**Step 1:** Go to `https://www.hellogorgeousmedspa.com/blog` and list every existing blog post.

**Step 2:** For each post, categorize:
- **Clinical content** (Botox education, weight loss, hormones, peptides, procedure how-tos) → needs both author AND medical reviewer byline
- **Lifestyle content** (event coverage, brand stories, behind-the-scenes) → needs author byline only

**Step 3:** Send Eric the list with category for each post. Eric adds bylines using the component he built in Surface 1.

## New blog content (going forward)

Going forward, every new blog post should be:

1. **Authored** with Dani's full byline at the top
2. **Reviewed** by Ryan for clinical content (just a note that he reviewed; doesn't have to be a heavy lift — he reads it before publish and signs off)
3. **Dated** with publish date AND last review date
4. **Schema'd** automatically by the component Eric built

## Going-forward content topics that compound credibility

These are the posts that establish Dani + Ryan as the experts in Oswego medical aesthetics. Rough priority order:

- [ ] "The 10 questions to ask any med spa before you book" — establishes Dani as the trustworthy authority
- [ ] "Why a real NP on site matters (and how to spot a fake medical director)" — Ryan-led content, indirectly competitive
- [ ] "From acne at 12 to med spa owner: Dani's story" — extended version of the about-page content, captures heritage searches
- [ ] "What I learned in 10 years of injecting Botox in Oswego" — Dani's authority piece
- [ ] "Why we publish Botox prices when most med spas hide them" — pricing transparency manifesto
- [ ] "How to tell if your med spa's medical director is real or rented" — Ryan-led, competitive moat content
- [ ] "Behind the scenes: a day in the life at Hello Gorgeous" — humanizing content, builds trust

Each post: 800–1,500 words, authored by Dani, reviewed by Ryan, properly bylined and schema-marked.

---

# Bottom Line

When this is done — across all three surfaces — every potential client encountering Hello Gorgeous anywhere online will see:

- **A real founder with a real story and real credentials** (you)
- **A real, board-certified NP with full prescriptive authority on site 7 days a week** (Ryan)
- **A 10-year-old family-owned practice with consistent leadership** (your moat vs. chains)
- **Pricing transparency, honest care, conservative dosing** (the voice baked into your content)
- **Specific awards and recognition** (Best of Oswego)
- **The only InMode Trifecta in the region** (your equipment moat)

HER Aesthetics has Hannah on her homepage and a single Morpheus8 badge. **You will have all of the above on every page, every directory, every blog post.** Within 30–60 days of this rollout, when someone searches "best med spa Oswego" or "med spa near me Naperville," your knowledge panel, Google snippets, and search results will reflect the actual depth of who you are.

---

## Sequencing — what gets done when

**This week:**
- Eric ships HG_DEV_014 (the website surface) — 4–6 hours
- You complete Top Priority third-party profiles (Google Business Profile, Yelp, Bing, Apple Maps) — ~90 minutes total

**Next week:**
- You complete medical/aesthetic-specific directories (RealSelf, Healthgrades, Allē, InMode, BioTE) — ~90 minutes
- You + Eric audit existing blog posts and add bylines

**Following 2–4 weeks:**
- You write 1–2 of the going-forward authority blog posts (or have Claude draft them in your voice)
- LinkedIn, Facebook, Instagram bio updates
- Ryan's professional profile (Healthgrades, LinkedIn)

By the end of 30 days, "you everywhere" is real.

---

*Prepared May 19, 2026. Three surfaces, one objective: make Dani and Ryan visible everywhere a potential client might find Hello Gorgeous.*
