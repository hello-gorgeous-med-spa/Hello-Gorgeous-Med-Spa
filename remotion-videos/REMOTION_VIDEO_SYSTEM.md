# Hello Gorgeous Med Spa — Remotion Video System

## Overview

This document defines how to create **Remotion-based marketing videos** for Hello Gorgeous Med Spa.

These videos are used for:

* Instagram Reels
* Facebook Reels
* Paid ads
* Website embeds

Primary goal:
**Drive consultation inquiries for high-ticket procedures (Contour Lift™ / Quantum RF and other services).**

---

## Reusable primitives (`src/components/`)

* **`Scene`** + **`KenBurnsBackground`** — full-frame background, overlay, watermark, text safe zone, optional `footer` (e.g. `DisclaimerBar`).
* **`TextBlock`** — animated accent bar, stacked `lines` with roles (`hero` | `title` | `body` | `support` | `accent` | `muted`), optional `footnote`.
* **`BrandSpan`** — pink inline emphasis; use inside `TextBlock` / `CTA` lines.
* **`CTA`** + **`DisclaimerBar`** — end-card (stack + URL + pill); disclaimer pinned when passed as `Scene` `footer`.
* **`BrandFrame`** — `maxWidth` + optional kicker; keeps copy column readable.
* **Brand token:** `src/brand/hg.ts` — `HG_BRAND_PINK`, `HG_DISCLAIMER_SHORT`.

**Reference:** `HGReelTemplateSample` (`HGReelTemplateVertical` in `Root.tsx`) — 6s starter. Production example: `ContourLiftModelLaunch`.

---

## Repository layout (this project)

Remotion lives under **`remotion-videos/`** (not `/remotion`). Current structure:

```
remotion-videos/
  src/
    index.tsx              # registerRoot → RemotionRoot
    Root.tsx               # Composition registry
    compositions/          # Full videos (e.g. ContourLiftModelLaunch.tsx, QuantumContourLift.tsx)
    components/            # Shared pieces (AnimatedCaptions, CTABanner, …)
    brand/                   # Logo, theme (colors, scaled sizes)
  public/
    images/                  # staticFile() assets (mirrors or copies from site public when needed)
  out/                       # Render output (gitignored); create with render commands below
  package.json               # npm scripts per composition
```

Reusable building blocks (`Scene`, `TextBlock`, `CTA`) are **recommended** for new compositions; existing videos may inline layout until refactored.

---

## Brand Identity

### Visual Style

* Primary colors:

  * Black: `#000000`
  * White: `#FFFFFF`
  * Accent Pink: `#E6007E`
* Tone:

  * Premium
  * Medical
  * Clean
  * Cinematic (NOT flashy or discount-style)

### Typography

* Bold, high-contrast headlines
* Minimal text per frame
* Designed for mobile readability

Use `brand/theme.ts` helpers (`scaledSize`, `FONT_SIZES`) and `format: "vertical" | "square" | "horizontal"` for consistent sizing across aspect ratios.

---

## Video Requirements

### Format

* Aspect Ratio: **9:16 (1080×1920)** for Reels/Stories primary deliverable
* Duration: **20–30 seconds**
* Export: **MP4 (H.264)**

### Performance Rules

* First **2–3 seconds** MUST hook attention
* Must work **without sound**
* All messaging must be readable on mobile

---

## Core Messaging Structure

Every video should follow this structure:

### 1. Hook (0–3 sec)

Stop the scroll.

Examples:

* “Loose skin that nothing is fixing?”
* “This is not a facial.”

---

### 2. Problem (3–6 sec)

Call out the patient.

Examples:

* “Weight loss. Workouts. Treatments.”
* “Still not tight?”

---

### 3. Solution (6–12 sec)

Introduce the procedure.

Example:

* “Hello Gorgeous Contour Lift™”
* “Powered by Quantum RF”

---

### 4. Authority (12–18 sec)

Build credibility.

Examples:

* “Minimally invasive”
* “Works beneath the skin”
* “Performed under medical supervision”

---

### 5. Offer / CTA (18–30 sec)

Drive action.

Examples:

* “3 model spots available”
* “Message MODEL to apply”

---

## Compliance Rules (MANDATORY)

Do NOT include:

* “guaranteed results”
* “replaces surgery”
* “melts fat”
* exaggerated claims

ALWAYS include (small footer text):

**“Consultation required. Individual results may vary.”**

---

## Assets

Use assets from:

* Before/after imagery (approved only)
* Procedure footage (non-graphic)
* Branding/logo from Hello Gorgeous (`src/brand/Logo.tsx`, files under `public/images/`)

Avoid:

* graphic surgical visuals
* low-quality stock imagery
* cluttered layouts

---

## Animation Guidelines

* Smooth, cinematic transitions
* Subtle zoom/pan on images
* Clean text fades/slides
* Pink accent used sparingly for emphasis

Avoid:

* fast flashing
* chaotic motion
* over-animation

---

## Remotion structure (target pattern)

### Folder example (conceptual)

```
/videos     →  src/compositions/*.tsx
/components →  src/components/*.tsx
/assets     →  public/images/, public/…
/logo       →  src/brand/Logo.tsx
```

### Component guidelines

Create reusable components for new work:

* **`Scene`** — layout, safe zones, optional overlay
* **`TextBlock`** — headline / subtext, brand type scale
* **`CTA`** — final conversion frame + disclaimer band

---

## Example scene flow

1. Scene 1 → Hook  
2. Scene 2 → Problem  
3. Scene 3 → Procedure intro  
4. Scene 4 → Authority  
5. Scene 5 → Model offer  
6. Scene 6 → CTA + disclaimer  

**Reference implementation:** `src/compositions/ContourLiftModelLaunch.tsx` (May 4 clinical model campaign; composition id `ContourModelMay4Vertical`).

---

## Rendering

### List compositions

```bash
cd remotion-videos
npx remotion compositions src/index.tsx
```

### Command examples

**Contour Lift / Quantum RF (general social — 30s):**

```bash
cd remotion-videos
npx remotion render src/index.tsx QuantumContourVertical out/quantum-contour-lift-reel.mp4
# or
npm run quantum:reel
```

**Contour Lift May 4 model launch (30s, script-aligned):**

```bash
cd remotion-videos
npx remotion render src/index.tsx ContourModelMay4Vertical out/contour-lift-may4-model-reel.mp4
# or
npm run contour-may4:reel
```

**Static thumbnail (frame number = time × 30):**

```bash
npx remotion still src/index.tsx ContourModelMay4Vertical out/thumbnail.png --frame=750
```

Entry file is **`src/index.tsx`**, not `index.ts`.

---

## QA checklist

Before delivery, confirm:

* [ ] Video is 1080×1920 (or correct composition size for the placement)
* [ ] Hook appears within first **2 seconds**
* [ ] Text is readable on mobile
* [ ] CTA is clear
* [ ] Branding matches (black / white / pink)
* [ ] No prohibited claims
* [ ] Disclaimer is present
* [ ] Video works without audio

---

## Goal

Every video should:

* Stop the scroll  
* Build trust  
* Drive a message or consultation  

If a video looks good but does not clearly tell the viewer what to do next → it fails.

---

## Final note

These are **not generic social videos**.

They are:
**Conversion-focused medical marketing assets for high-ticket procedures.**

Keep them:

* Clear  
* Focused  
* Premium  
