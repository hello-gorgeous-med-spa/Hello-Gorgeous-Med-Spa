# "Near Me" SEO Audit — Service Pages

**Last updated:** March 2025

---

## Summary: What We Fixed

| Service | Before | After |
|---------|--------|-------|
| **Morpheus8 Burst** | Not in sitemap, no "near me" in title | ✅ Sitemap, "Morpheus8 Burst Near Me" in title |
| **QuantumRF** | Not in sitemap, no "near me" in title | ✅ Sitemap, "QuantumRF Near Me" in title |
| **Solaria CO2** | Not in sitemap, no "near me" in title | ✅ Sitemap, "CO2 Laser Near Me" in title |
| **CO2 laser (Oswego)** | Not in sitemap | ✅ Sitemap, "CO2 Laser Near Me" in title |
| **CO2 laser (Naperville, Aurora)** | Not in sitemap | ✅ Sitemap, "CO2 laser near me" in keywords |

---

## Already Optimized ✓

| Page | "Near Me" Status |
|------|------------------|
| **Botox** (`/botox-oswego-il`) | ✅ "Botox Near Me" in title, description, keywords |
| **Weight loss** (`/services/weight-loss-therapy`) | ✅ "ozempic near me", "wegovy near me", etc. in keywords |
| **Location pages** (via LocationServicePage) | ✅ `generateLocationKeywords()` adds "near me" to all |
| **Semaglutide Spring Break** | ✅ "semaglutide near me", "ozempic near me" in keywords |
| **Free vitamin** | ✅ "vitamin injections near me" |
| **Layout** (site-wide) | ✅ "botox near me", "fillers near me", "weight loss near me" in meta |

---

## Pages in Sitemap (for indexing)

**Exclusive tech / high-value services:**
- `/morpheus8-burst-oswego-il`
- `/quantum-rf-oswego-il`
- `/solaria-co2-laser-oswego-il`
- `/co2-laser-oswego-il`
- `/co2-laser-naperville-il`
- `/co2-laser-aurora-il`

**Location-based (via GBP_SERVICE_SLUGS):**
- Botox, lip filler, weight loss, microneedling, etc. per city

**Morpheus8 (generic):**
- `/morpheus8-oswego-il`, `/morpheus8-naperville-il`, etc.

---

## Template for New "Near Me" Pages

When adding a new service page that should rank for "[service] near me":

1. **Title:** `[Service] Near Me | Oswego, Naperville, Aurora IL | Hello Gorgeous`
2. **Description:** Include "near me" + surrounding cities + CTA
3. **Keywords:** Add `"[service] near me"` as first keyword
4. **Sitemap:** Add to `app/sitemap.ts` with appropriate priority

---

## Google Business Profile

Add all services to GBP so Google indexes "near me" keywords. See `docs/GOOGLE-BUSINESS-PROFILE-OPTIMIZATION.md`.

---

*Reference: MORPHEUS8-BURST-NEAR-ME-SEO.md for "Can't determine location" troubleshooting*
