# Local SEO – Site Map & URL List

## GBP-style service landing pages (local intent)

Each URL is a dedicated page for that service + location. Content is 800–1,500 words with FAQs, CTAs, and internal links.

| URL | Service | Location |
|-----|--------|----------|
| `/botox-oswego-il` | Botox, Dysport & Jeuveau | Oswego, IL |
| `/lip-filler-oswego-il` | Lip Filler | Oswego, IL |
| `/microneedling-oswego-il` | RF Microneedling | Oswego, IL |
| `/prf-hair-restoration-oswego-il` | PRF/PRP | Oswego, IL |
| `/hormone-therapy-oswego-il` | BioTE Hormone Therapy | Oswego, IL |
| `/weight-loss-oswego-il` | Weight Loss Therapy | Oswego, IL |
| `/iv-therapy-oswego-il` | IV Therapy | Oswego, IL |
| `/botox-naperville-il` | Botox | Naperville, IL |
| `/lip-filler-naperville-il` | Lip Filler | Naperville, IL |
| `/weight-loss-naperville-il` | Weight Loss | Naperville, IL |
| `/botox-aurora-il` | Botox | Aurora, IL |
| `/weight-loss-aurora-il` | Weight Loss | Aurora, IL |
| `/botox-plainfield-il` | Botox | Plainfield, IL |
| `/weight-loss-plainfield-il` | Weight Loss | Plainfield, IL |

**Implementation:** `app/[localSlug]/page.tsx` + `lib/gbp-urls.ts`. Add more slugs in `GBP_SERVICE_SLUGS` and `GBP_SLUG_TO_SERVICE` as needed.

---

## Med-spa location pages

| URL | Serves | Hub / internal link |
|-----|--------|----------------------|
| `/med-spa-oswego-il` | Oswego, IL | `/oswego-il` |
| `/med-spa-naperville-il` | Naperville, IL | `/naperville-il` |
| `/med-spa-aurora-il` | Aurora, IL | `/aurora-il` |
| `/med-spa-plainfield-il` | Plainfield, IL | `/plainfield-il` |
| `/med-spa-yorkville-il` | Yorkville, IL | `/locations` |

---

## Main hubs

| URL | Purpose |
|-----|---------|
| `/` | Home |
| `/services` | Main services hub |
| `/services/[slug]` | Individual service pages (e.g. `/services/botox-dysport-jeuveau`) |
| `/oswego-il`, `/naperville-il`, `/aurora-il`, `/plainfield-il` | City hubs with service links |
| `/contact` | Contact + NAP + embedded map |
| `/reviews` | How to leave a Google review + QR code |
| `/vip` | VIP list signup |
| `/subscribe` | Email/SMS signup |
| `/book` | Booking entry |

---

## Sitemap

Generated dynamically in `app/sitemap.ts`. Includes:

- Static routes (home, contact, blog, about, legal, etc.)
- All `/services/[slug]` routes
- All GBP-style routes (`/botox-oswego-il`, etc.)
- All med-spa location routes (`/med-spa-oswego-il`, etc.)
- City + service combos (`/oswego-il/botox-dysport-jeuveau`, etc.)

Sitemap URL: `https://hellogorgeousmedspa.com/sitemap.xml`
