# Lighthouse / CWV Baseline — Hello Gorgeous Med Spa

**Target (SEO-001):** Mobile Performance ≥ 90 · LCP ≤ 2.5s · CLS ≤ 0.1

## How to run

```bash
# One URL (Chrome required)
npx lighthouse https://www.hellogorgeousmedspa.com/ \
  --only-categories=performance --form-factor=mobile \
  --chrome-flags="--headless --no-sandbox" --quiet --view

# Or PageSpeed Insights (UI): https://pagespeed.web.dev/
# API quota is limited; prefer Lighthouse CLI for batch checks.
```

## Baseline — 2026-07-13 (mobile, simulated throttling, live prod)

| URL | Perf | LCP | CLS | TBT | Notes |
|-----|------|-----|-----|-----|-------|
| `/` | **68** | 6.6s | 0.001 | 29ms | Below target — LCP-bound |
| `/faq` | **74** | 5.4s | 0 | 35ms | Premium template; LCP still slow |
| `/botox-oswego-il` | **73** | 5.3s | 0 | 28ms | Flagship local lander |
| `/rx` | **76** | 5.3s | 0 | 48ms | Best of the four |

CLS is healthy. **LCP (~5–7s)** is the gap to ≥90.

## Likely LCP levers (next engineering pass)

1. Hero / LCP image: `priority`, correct `sizes`, modern format, avoid oversized full-bleed.
2. Reduce above-the-fold JS (third-party, chat, analytics boot).
3. Fonts: `font-display: swap` / subset; avoid FOIT blocking paint.
4. Avoid layout-shifting late CSS; keep critical CSS small.

## Cadence

- Re-run this 4-URL set after any hero/template performance change.
- Monthly: record scores in this table + glance at GSC Core Web Vitals report.
