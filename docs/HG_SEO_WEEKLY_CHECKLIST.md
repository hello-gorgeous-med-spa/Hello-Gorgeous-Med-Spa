# Hello Gorgeous — Weekly SEO checklist (Eric + Dani)

**Goal:** Beat HER on contested injectable queries; own device keywords; close the 4.4 → 4.6+ review gap.

## Dani (front desk + marketing) — every week

- [ ] Ask **5+ happy clients** for Google reviews (mention treatment name when natural: Botox, filler, Morpheus8).
- [ ] Respond to **every** Google review ≤4★ within 48 hours.
- [ ] **2 GBP posts** (promo + education); link canonical URLs (`/botox-oswego`, not `-il`).
- [ ] Social posts: same canonical links only.
- [ ] Track review count + star average (screenshot Monday).

## Eric (technical) — after each deploy

- [ ] GSC → Sitemaps → confirm last read date.
- [ ] GSC → URL inspection → spot-check `/botox-oswego`, `/solaria-co2-oswego` = **Indexed**.
- [ ] `curl -sI https://www.hellogorgeousmedspa.com/botox-oswego` → confirm Fresha in HTML, single title brand.
- [ ] Cron `index-priority-urls` runs daily (needs `CRON_SECRET` + Search Console API).

## Priority URLs (request indexing in GSC if not indexed)

See full list: `GET /api/public/ai-profile` → `oswegoServicePages`.

**Contested first:** botox-oswego, dysport-oswego, dermal-fillers-oswego, lip-filler-oswego, morpheus8-burst-oswego, glp-1-weight-loss-oswego.

**Uncontested moat:** solaria-co2-oswego, quantum-rf-oswego, peptide-therapy-oswego, nad-iv-oswego.

## HER benchmark (public, ~May 2026)

| Metric | HER | Hello Gorgeous |
|--------|-----|----------------|
| Google rating | ~4.9 | ~4.4 |
| Reviews | ~110 | ~115+ |
| Tox positioning | “Botox Near Me” page | `/botox-oswego` + $10/unit |

We win on **devices + breadth**; they win on **rating + tox focus** until indexing + reviews catch up.

## Do not

- Link new content to `/services/botox-dysport-jeuveau` or `*-oswego-il` (301 chains).
- Send paid traffic to homepage for Botox (use `/botox-oswego`).
