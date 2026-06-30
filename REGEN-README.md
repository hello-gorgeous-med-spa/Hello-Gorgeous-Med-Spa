# RE GEN by Hello Gorgeous Med Spa — Design & Dev Guide

## What is RE GEN?

RE GEN is the **prescription arm** of Hello Gorgeous Med Spa. NP-directed medical weight loss, peptides, hormones, and labs. 100% online with flat $30 shipping.

**Live at:** https://hellogorgeousmedspa.com/rx

---

## Design System (from owner's Claude prototype)

### Brand Colors

| Token              | Hex       | Usage                                  |
|--------------------|-----------|----------------------------------------|
| `--hg-pink`        | `#FF2D8E` | Primary accent, buttons, links         |
| `--hg-pink-deep`   | `#E6007E` | Gradients, hover states                |
| `--hg-pink-soft`   | `#FFF5F9` | Light backgrounds                      |
| `--hg-pink-mid`    | `#FCE7F3` | Card backgrounds, alternating sections |
| `--hg-pink-light`  | `#FFB8DC` | Soft accents                           |
| `--hg-gold-soft`   | `#FFD86B` | Success states, highlights             |
| `--hg-success`     | `#16a34a` | Checkmarks, positive indicators        |

### Typography

| Role         | Font                              |
|--------------|-----------------------------------|
| Display/Logo | `Georgia, 'Times New Roman', serif` |
| Body         | `system-ui, -apple-system, sans-serif` |

### Key Visual Patterns

1. **Hero**: Dark gradient left side + lifestyle photo right side (Ken Burns animation)
2. **Floating product card**: White card with shadow overlapping hero
3. **Trust/social proof bar**: Pink background with checkmarks and stats
4. **Category grid**: Large image tiles with gradient overlays
5. **How it works**: 3-step numbered cards
6. **FAQ**: Accordion-style, pink accents
7. **CTA bands**: Full-width pink gradient with white text

### Animations

- `kenburns`: Subtle zoom on hero images (24s cycle)
- `dotpulse`: Pulsing dot for "NP-Directed" badge
- `fadeup`: Content fade-in on scroll

---

## File Structure

```
/rx                          → Main RE GEN landing (loads prototype via iframe)
/rx/weight-loss              → Weight loss category
/rx/peptides                 → Peptides category  
/rx/hormones                 → Hormone therapy category
/rx/sexual-health            → Sexual health category
/rx/hair-skin                → Hair & skin category
/rx/labs                     → Lab testing hub
/rx/start                    → Intake flow
/rx/checkout/success         → Post-purchase confirmation

public/regen-standalone.html → Owner's Claude prototype (served directly)
public/images/regen/         → All RE GEN image assets

components/regen/            → React components for RE GEN
lib/regen-site.ts            → Content/data constants
lib/regen/cart-context.tsx   → Shopping cart state
lib/regen/checkout.ts        → Square payment integration
```

---

## How to Build New RE GEN Pages

### Option 1: Owner provides standalone HTML (preferred for complex pages)

1. Owner exports standalone HTML from Claude
2. Save to `public/` folder
3. Create page that loads via iframe or extract and serve

### Option 2: Build directly matching existing style

1. Reference `public/regen-standalone.html` for exact CSS/HTML patterns
2. Match colors, fonts, spacing exactly
3. Use same component patterns (hero, cards, trust bar, etc.)

---

## Content Sources

- **Product data**: `lib/rx-category-hubs.ts`
- **Pricing**: `lib/peptide-retail-pricing.ts`, `lib/glp1-program-pricing.ts`, `lib/hrt-formulation-catalog.ts`
- **Lab panels**: `lib/lab-panel-catalog.ts`

**Never hardcode prices** — always pull from existing pricing libs.

---

## Payments

- **Provider**: Square (via existing Hello Gorgeous integration)
- **Shipping**: Flat $30 on all orders
- **API endpoint**: `/api/regen/checkout`
- **Flow**: Cart → Square hosted checkout → Success page

---

## Key Principle

**What the owner builds in their prototype should appear exactly as-is on the live site.**

If translating to React components, match the prototype pixel-for-pixel. When in doubt, serve the prototype HTML directly rather than risk deviation.
