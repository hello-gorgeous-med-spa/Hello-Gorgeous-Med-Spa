# Square booking menu — categories & calendar colors

Live Service Library was reorganized (Jul 2026) so online booking groups by category instead of a scattered list.

## Color code (set in Square Dashboard)

Calendar colors **cannot** be set by API — only in the Dashboard. POS label colors were set via API.

| Category | Calendar color to pick | Example services |
|---|---|---|
| **Vitamin Injections** | Hot pink / magenta | B12, B-Complex, Glutathione, MIC/Lipo |
| **Weight Loss Injections** | Red | Tirzepatide, Semaglutide, Retatrutide |
| **FlowWave** | Purple | Shockwave sessions & packages |
| **Botox** | Teal | Botox / Jeuveau / Dysport, Lip Flip |
| **Dermal Fillers** | Orange | Lip filler, Hylenex |
| **Skin Spa** | Soft rose / pink | HydraFacial, peels, IPL |
| **Body Contouring & Devices** | Deep orange | Morpheus8, Quantum RF, Solaria, Trifecta |
| **Laser Hair Removal** | Sky blue | Brazilian, bikini, underarms, specials |
| **Lash Spa** | Lavender | Extensions, lifts, fills |
| **Brow Spa** | Brown / gold | Lamination, microblading, wax |
| **BHRT** | Gold / amber | Pellets, hormone labs |
| **IV Drip Package Deals** | Blue | Myers, NAD+, Immunity |
| **PRP Injections** | Burgundy | Vampire facial, hair, joint |
| **AnteAGE Skin Regeneration** | Green | Exosomes, MD facial, scalp |
| **Trigger Point Injections** | Slate gray | Single / multi-site |
| **Medical Consultations** | Black / charcoal | Ryan Medical Visit, Consultation |
| **Exclusive Model Specials** | Bright pink | Keep only true promo specials |
| **GlowTox Facial** | Pink | GlowTox signature |

### How to set calendar colors (≈10 min)

1. Open [Square Dashboard](https://app.squareup.com/) → **Items** → **Service library**
2. Open a service → **Color** → pick the color for that category → **Save**
3. Repeat for one service per category first (then batch the rest)
4. Go to **Appointments** → **Calendar** → gear ⚙
5. Turn on **Color code → By Service** → Save

Tip: edit every service in a category to the **same** color so the calendar reads cleanly.

## Scripts

```bash
# Preview category moves
node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --dry-run

# Apply category + POS label_color
node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --apply

# Refresh booking images from category heroes
node --env-file=.env.local scripts/square-polish-catalog.mjs --apply --images-only --force-images
```

## What we fixed in the live library

- Moved B12 / MIC / glutathione vitamins **out of Weight Loss** → **Vitamin Injections**
- Grouped Morpheus / Quantum / Solaria / Trifecta → **Body Contouring & Devices**
- Pulled laser hair into its own **Laser Hair Removal** category
- Consolidated AnteAGE into one category
- FlowWave stays purple family; weight loss stays red family
