# Square booking menu — categories & calendar colors

Live Service Library was reorganized (Jul 2026) so online booking groups by category instead of a scattered list.

## Color code (set in Square Dashboard)

Calendar colors **cannot** be set by API — only in the Dashboard. POS label colors were set via API.

| Category | Calendar color to pick | Example services |
|---|---|---|
| **Vitamin Injections** | Hot pink / magenta | B12, B-Complex, Glutathione, MIC/Lipo |
| **Weight Loss Injections** | Red | Semaglutide hero vial · Tirzepatide keeps its own vial |
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

### How to set calendar colors (≈10–20 min) — owner / Dashboard only

Calendar **Color** is Dashboard-only (API cannot set it). POS `label_color` is already set by script.

1. Open [Square Dashboard](https://app.squareup.com/) → **Items** → **Service library**
2. Open a service → **Color** → pick the color for that category → **Save**
3. Repeat for **one service per category** first, then batch the rest in that category to the **same** color
4. Go to **Appointments** → **Calendar** → gear ⚙
5. Turn on **Color code by Service** (not by team member) → Save
6. Spot-check the live calendar against the table below

### Owner spot-check (after Color code by Service)

| Should read as | Example SKU on calendar |
|---|---|
| Hot pink / magenta | B12 / Glutathione (Vitamin Injections) |
| Red | Semaglutide / Tirzepatide |
| Purple | FlowWave single or package |
| Deep orange | Morpheus8 Burst — 3 Session Package |
| Sky blue | Laser Brazilian / underarms |
| Lavender | Hybrid Full Set / Lash Lift |
| Charcoal | Ryan Medical Visit / Consultation |

If vitamins and weight loss look the same color, the service Color field was not set per category — fix in Service library, not calendar settings.

### Packages should appear near the top of browse

After `scripts/square-upsert-packages.mjs --apply` + `scripts/square-catalog-hygiene.mjs --apply`:

- **Body Contouring & Devices:** Morpheus8 Burst — 3 Session Package, Quantum RF packages, Solaria, Trifecta
- **Laser Hair Removal:** Laser Brazilian — 3-Month Package
- **FlowWave:** session packages + Recovery Stack

### Front-desk checkout (separate from colors)

See `docs/manuals/front-desk-square-checkout-sop.md` — appointment → **Review and Check Out** → Terminal.

## Scripts

```bash
# Preview category moves
node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --dry-run

# Apply category moves (items matching move rules)
node --env-file=.env.local scripts/square-reorganize-booking-menu.mjs --apply

# Fix POS label_color for every service from its CURRENT category
node --env-file=.env.local scripts/square-fix-pos-label-colors.mjs --apply

# Verify POS labels + print Dashboard calendar punch-list
node --env-file=.env.local scripts/square-verify-calendar-color-prep.mjs

# Upsert packages (Morpheus8 Burst ×3, Quantum, Solaria, Laser Brazilian, $0 visit)
node --env-file=.env.local scripts/square-upsert-packages.mjs --apply

# Pin packages to top of categories + hide superseded SKUs from online booking
node --env-file=.env.local scripts/square-catalog-hygiene.mjs --apply

# Refresh booking images from category heroes
node --env-file=.env.local scripts/square-polish-catalog.mjs --apply --images-only --force-images
```

## What we fixed in the live library

- Moved B12 / MIC / glutathione vitamins **out of Weight Loss** → **Vitamin Injections**
- Grouped Morpheus / Quantum / Solaria / Trifecta → **Body Contouring & Devices**
- Pulled laser hair into its own **Laser Hair Removal** category
- Consolidated AnteAGE into one category
- FlowWave stays purple family; weight loss stays red family
