# Lighthouse / CWV Baseline — Hello Gorgeous Med Spa

**Target (SEO-001):** Mobile Performance ≥ 90 · LCP ≤ 2.5s · CLS ≤ 0.1

## Progress (mobile, simulated throttling, local `next start`)

| URL | Pre (live) | R1 | R2 | R3 | Notes |
|-----|------------|----|----|----|-------|
| `/` | 68 | 75 | 78 | **79** | LCP still ~5.7s |
| `/faq` | 74 | 78 | 84 | **81** | Variance normal; CLS healthy |
| `/botox-oswego-il` | 73 | 75 | 82 | **82** | sm WebP LCP |
| `/rx` | 76 | 83 | 83 | **83** | Flat |

**From start → R3:** roughly **+10–13** points sitewide. CLS fixed. Still short of ≥90 (LCP wall ~4.5–5.8s).

## What shipped

**R1:** hero opacity, FAQ FadeUp, priority cleanup, RX video lazy, Montserrat scoped.  
**R2:** deferred engagement chrome, booking-banner CLS, WebP heroes.  
**R3:** analytics deferred to idle/interaction + `lazyOnload`; mobile hero crops (`*-sm.webp`); drop duplicate `HelloGorgeousAssistant` (keep `MascotChat`).

## Remaining path to ≥90 (diminishing returns)

1. Server-render a static hero shell (less client JS before LCP image).
2. Slim `Header` / marketing chrome JS on first load.
3. Optional: stop awaiting Places/CMS in root layout on the critical path (use static SITE ratings for schema).
4. Re-check **live** prod after deploy (RUM may differ from lab).

## Cadence

Re-run this 4-URL set after hero/template perf changes. Monthly: GSC CWV report.
