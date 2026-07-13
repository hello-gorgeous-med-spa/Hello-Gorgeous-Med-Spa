# SEO-002 — Get recommended by AI assistants (AEO / GEO)

**Ticket:** SEO-002 · P1 Epic · companion to SEO-001  
**Requested by:** Dani (Owner)  
**Targets:** ChatGPT · Claude · Perplexity · Google AI Overviews · Gemini

## Objective

When someone asks an AI for a med spa / weight-loss / aesthetic provider near Oswego–Naperville, Hello Gorgeous is named accurately with location, NP-directed model, and a link.

## Scorecard (2026-07-13)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 1 | Answer-formatted content | **DONE (code)** | Canonical About + ≥5 extractable FAQs on GBP landers; visible `<dl>` (not `<details>`). `lib/aeo-canonical.ts`, `lib/gbp-aeo-faqs.ts` |
| 2 | Structured data | **DONE (code)** | `MedicalBusiness`+`MedicalClinic`, FAQPage, Person (Dani/Ryan via `aboutPageGraphJsonLd`), `sameAs` helper + directory slots |
| 3 | AI crawlers + SSR | **DONE (code)** | `app/robots.ts` allows live-retrieval + training bots; GBP/RX FAQs SSR-visible |
| 4 | Directories / citations | **OPS** | Claim Yelp, Healthgrades, RealSelf, Apple, Bing — paste URLs into `SITE.directories` — see `docs/TIER-1-CITATIONS.md` |
| 5 | RX AI Q&A | **DONE (code)** | `/rx` visible FAQ + `MedicalWebPage` + compliance language |
| 6 | Monitor & measure | **DOCS** | Checklist below; GA4 AI referral segment instructions |

## Owner decisions

- **Training bots:** currently **allowed** (`GPTBot`, `CCBot`, `Google-Extended`). Say if you want training-only opt-out while keeping live retrieval.
- **Directory URLs:** after claiming, set `SITE.directories.*` in `lib/seo.ts` so `sameAs` updates automatically.

## Monthly AI visibility checklist

Ask each engine (ChatGPT, Claude, Perplexity, Google AI Overview) and log Yes/Partial/No + quote:

1. Best med spa near Oswego for weight loss  
2. Provider-supervised semaglutide in Illinois  
3. Who does Morpheus8 near Naperville  
4. Botox Oswego NP on site  
5. Peptide therapy Fox Valley / Hello Gorgeous  

Store notes in `/admin/local-dominance-sprint` or a shared sheet. Cadence: **first Monday** with SEO-001 rank snapshot.

## GA4 — AI referral segment

1. Admin → Explore or Audiences → create segment **AI assistants**  
2. Session source contains: `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `bing.com` (copilot)  
3. Optional: channel group “AI Referral” mirroring those hostnames  

## SSR note

Money pages use App Router SSG/SSR. `/rx` catalog UI is client-heavy; crawlable About + FAQ now render as normal HTML below the portal.

## Implementation refs

- `lib/aeo-canonical.ts` — About extract + core FAQs  
- `lib/gbp-aeo-faqs.ts` — service×city FAQs  
- `app/robots.ts` — crawler allowlist  
- `components/seo/GbpLocationPage.tsx` — visible Q&A + About + Person graph  
- `app/rx/page.tsx` — RX AEO FAQ + MedicalWebPage  
- `/api/public/ai-profile` — machine profile for assistants  

## SEO-001 engineering wrap

Landers + CWV R1–R3 shipped. Remaining SEO-001 items are **ops**: GBP Dashboard, Square card-hold, GSC Request indexing, owner copy review.
