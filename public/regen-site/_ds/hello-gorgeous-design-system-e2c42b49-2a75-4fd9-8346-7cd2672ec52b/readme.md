# Hello Gorgeous Med Spa — Design System

The brand, foundations, components, and UI kits for **Hello Gorgeous Med Spa**
(and its medical-prescription arm, **Hello Gorgeous RX**) — an NP-directed medical
spa in Oswego, IL. Use this system to build on-brand marketing pages, client-app
screens, decks, and throwaway mocks.

> **Brand law:** the public brand is **White, Black, and Hot Pink** — _no gray_.
> Everything else (the Trifecta accents, gold award color, clinical navy) is a
> controlled exception for specific surfaces.

---

## 1. Company & product context

**Hello Gorgeous Med Spa** is the self-described _"#1 Best Med Spa in Oswego."_
It is a **nurse-practitioner-directed medical aesthetics clinic** — not a salon —
and the entire brand voice leans on that medical credibility. Founders **Dani &
Ryan** (a female + male provider team) are on site weekly.

- **Tagline (canonical, site-wide):** _"We screen you like a medical practice, because we are one."_
- **Location:** 74 W. Washington Street, Oswego, IL 60543 · **(630) 636-6193**
- **Service area:** Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, IL
- **Social proof:** 4.4★ Google (117 reviews) · 5.0★ Fresha (1,931 reviews) · "Best of Oswego"
- **Booking:** Fresha (external) + Square

### Products / surfaces represented
This is a single Next.js codebase serving **three surfaces**, each with its own look:

1. **Marketing site** — home, services, and a huge set of local-SEO landing pages
   (`botox-aurora-il`, `dermal-fillers-naperville-il`, `*-oswego-il`). _Dark header
   with Trifecta accent pills → white body sections → Playfair headlines → pink CTAs._
2. **Client app (PWA)** — installable app under `/app` and `/portal`: deals,
   memberships, Vitamin Bar, wellness, push. _Softer cards, pink accents, bottom tab bar._
3. **Admin / clinical** — `/admin`, `/charting`, `/consents`: EHR-style charting and
   compliance. _Black background, pink borders, the "clinical navy" palette. Internal-only._
4. **Hello Gorgeous RX** — the medical-prescription arm: GLP-1 weight loss
   (semaglutide, tirzepatide), peptides (BPC-157, PT-141, sermorelin), hormone therapy,
   IV/vitamin shots. Sold under "Shop RX" in the nav.

### Sources
- **Codebase (read-only, mounted):** `hello-gorgeous-med-spa/` — Next.js 15 / React 18 /
  TypeScript / Tailwind / Supabase. Remote: `github.com/hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa`.
  Key files referenced while building this system:
  - `tailwind.config.ts` — color tokens, shadows, type scale
  - `app/globals.css` — brand contrast system, buttons, cards, sections
  - `lib/trifecta-tokens.ts` — the Trifecta accent set
  - `lib/brand-tagline.ts`, `lib/seo.ts` — canonical copy & NAP facts
  - `components/Header.tsx`, `Footer.tsx`, `Hero.tsx`, `CTA.tsx` — UI patterns
- **Live site:** https://www.hellogorgeousmedspa.com

---

## 2. Content fundamentals (voice & copy)

**Vibe:** confident, warm, and _medical-first_. The brand constantly reassures clients
that this is a real medical practice staffed by licensed providers — "luxury, but safe."
Glamorous but grounded; aspirational without being clinical-cold.

- **Person:** Speaks to the client as **"you"**; the practice is **"we" / "our team."**
  ("We screen you like a medical practice…")
- **Casing:** Sentence case for body and most headlines. **UPPERCASE with wide
  letter-spacing** for eyebrows, button labels (CTA variant), and small kickers
  ("MEDICAL AESTHETICS", "BEST OF OSWEGO").
- **Headlines:** Short, benefit-led, often a two-part line with the second half in pink:
  _"Oswego's Trusted **Aesthetic Team**"_ · _"Medical Experts. **Real Results.**"_
- **Tone words:** _trusted, medical, real results, full-authority NP, same-day, free consult._
- **Proof, everywhere:** star ratings, review counts, "#1 Best Med Spa", "Best of Oswego",
  and provider credentials are repeated as trust anchors.
- **Pricing is loud and specific:** "Botox from $10/unit", "Underarms $79". Prices are a
  feature, shown in pink serif numerals.
- **Local SEO is in the DNA:** city names (Oswego, Naperville, Aurora, Plainfield) appear
  constantly in headings and links.
- **Emoji:** used _sparingly_ as accents in nav/labels — 🏆 for awards, ⭐ for memberships,
  👑 for the Gentlemen's/Ladies' Club. Not in body copy. Keep emoji to playful labels only.
- **Medical/legal guardrails (mandatory):** never make comparative claims about competitors;
  no diagnosis, dosing, or outcome guarantees in marketing copy; treat client data as PHI.

**Examples (verbatim from the product):**
- _"We screen you like a medical practice, because we are one."_
- _"#1 Best Med Spa in Oswego"_
- _"Medical Experts. Real Results."_
- _"Full-authority NP on site · Quantum RF · Burst · Solaria CO2"_

---

## 3. Visual foundations

**Colors.** Three brand colors only on the public site: **White `#FFFFFF`,
Black `#000000`, Hot Pink `#FF2D8E`** (deeper `#E6007E` for hover/gradients/logo).
A full pink ramp (`50–950`) exists for tints. **Gold `#FFD700`** is reserved for award
badges. The **Trifecta accent set** (pink `#ec4899` · blue `#3b82f6` · amber `#f59e0b`,
plus a pink→blue→amber gradient) layers onto the brand for technology showcases
(Morpheus8 + Quantum RF + Solaria CO₂) and nav-pill rhythm. A separate **clinical navy**
palette exists for admin only. The codebase aggressively strips gray from the public site.

**Type.** **Playfair Display** (serif) for all headings — large, bold, tracking tightened
to −0.02em. **Inter** (sans) for body and UI, 18px base, generous 1.7 line-height. The
logo's "hello" is a separate handwritten script (decorative, asset-only — don't recreate
in CSS). Montserrat appears only inside the embedded Cherry financing widget.

**Spacing.** Luxury rhythm: **100px** vertical padding on major sections (120 large,
60 small), 24px page gutter, **40px** grid gap between cards, 32px inner card padding.
Max content width 1280px.

**Backgrounds.** Mostly flat: white body sections alternating with **black** and
occasional **hot-pink** full-color sections (`.section-white / -black / -pink`). The dark
header/footer are solid black with hairline white borders. Photography (provider team,
treatments) is **warm, polished, studio-lit on black** — see `assets/hero-brand.png`.
No textures or busy patterns; gradients are limited to the Trifecta accents and subtle
pink glow rings. Soft pink washes (`#FFF5F9`) appear on calm app surfaces.

**Borders & cards.** The signature card is a **2px solid black border, 16px radius**,
that turns **pink on hover** with a `translateY(-4px)` lift. A softer alternative uses a
hairline border + `0 4px 24px rgba(0,0,0,.08)` shadow for app/portal surfaces. Radii:
8px buttons/inputs, 12px dropdowns, 16px cards, 22px feature cards, pill for badges/nav.

**Shadows.** `card` (soft, `0 4px 24px rgba(0,0,0,.08)`), `card-hover` (`0 20px 40px`),
`glow` (pink ring + bloom), `clinical` (tight, for admin), `pink` (`0 10px 30px
rgba(255,45,142,.25)` on featured/black cards).

**Motion.** Restrained and elegant. Entrance = **fade-up** (opacity + 24px translate,
0.6s ease-out, staggered 100/200/300ms). Hover = **lift −2px** on buttons, **−4px** on
cards, plus color inversion (pink→black). No bounces. Press isn't heavily styled. The
homepage hero has a slow pink/blue/amber glow-pulse. All motion respects
`prefers-reduced-motion`.

**Hover/press states.** Primary button inverts: pink → black background with pink text.
Outline button fills pink. Cards swap border to pink + lift. Links go pink. Dropdowns use
`rgba(24,24,27,0.97)` glass with `backdrop-blur`.

**Transparency & blur.** Used on the dark nav/dropdowns (zinc glass + blur) and pink
focus rings (`0 0 0 3px rgba(255,45,142,.18)`). The public body stays opaque.

---

## 4. Iconography

- **Primary approach: inline SVG, stroke style.** The codebase draws UI icons as inline
  `<svg>` with `stroke="currentColor"`, `stroke-width="2"`, rounded caps — the same family
  as **Heroicons (outline)** / Lucide. Use **Lucide or Heroicons (outline, 2px)** for any
  new icon and it will match. (No icon font, no sprite sheet in the repo.)
- **Brand/social glyphs** (Instagram, Facebook, TikTok, Google stars) are filled SVG paths,
  rendered in circular white→pink-on-hover chips in the footer.
- **App icons / favicons:** the black square badge logo (`assets/icon-512x512.png`,
  `apple-touch-icon.png`).
- **Emoji as iconography:** only as playful nav/label accents (🏆 ⭐ 👑 ⚖️ 🔬 💫). Never in
  body copy or as primary UI icons.
- **Do not** hand-draw bespoke illustrative SVGs to represent the brand — use the real
  logo assets in `assets/` and Lucide/Heroicons for UI glyphs.

**Logos & imagery in `assets/`:**
- `logo-full.png`, `logo.png`, `hello-gorgeous-logo.png` — black square **badge** logo
  (silhouette + mirror + medical-cross/EKG). Use on black backgrounds.
- `hero-brand.png` — the premium wordmark + founder photo lockup (script "hello" + serif
  "GORGEOUS MED SPA"). Use as a full-bleed brand hero.
- `hero-banner.png` — generic treatment hero image.
- `icon-512x512.png`, `apple-touch-icon.png` — app/favicon badges.

---

## 5. Index / manifest

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s the token files.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible entry for downloading this system.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
(reset + button/card/section/badge helpers).

**`guidelines/`** — foundation specimen cards (Design System tab): color core, pink scale,
Trifecta accents, type display, type scale, spacing scale, radii & shadows, brand logo.

**`components/`** — reusable React primitives (`window.HelloGorgeousDesignSystem_e2c42b`):
- `core/` — **Button**, **Badge**, **Card**, **StarRating**
- `forms/` — **Input**, **Checkbox**
- `marketing/` — **SectionHeader**, **ServiceCard**, **PricingCard**, **Accordion**

**`ui_kits/`** — full-screen product recreations:
- `marketing/` — the public marketing site (header, hero, services, memberships, footer)
- `client-app/` — the installable client PWA (home, deals, Vitamin Bar, bottom nav)
- `admin/` — the Provider / Clinical workspace (black sidebar, patient queue, charting)

**`templates/`** — copy-to-start branded starting points (consumed via `ds-base.js`):
- `service-landing/` — **Service Landing Page** (the local-SEO service page pattern)

**`assets/`** — logos, hero imagery, app icons.
