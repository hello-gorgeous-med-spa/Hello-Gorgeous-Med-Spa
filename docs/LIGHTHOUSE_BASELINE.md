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

## Baseline — 2026-07-13 (mobile, simulated throttling, **live prod**)

| URL | Perf | LCP | CLS | TBT | Notes |
|-----|------|-----|-----|-----|-------|
| `/` | **68** | 6.6s | 0.001 | 29ms | Pre-fix |
| `/faq` | **74** | 5.4s | 0 | 35ms | Pre-fix |
| `/botox-oswego-il` | **73** | 5.3s | 0 | 28ms | Pre-fix |
| `/rx` | **76** | 5.3s | 0 | 48ms | Pre-fix |

## After LCP pass — 2026-07-13 (mobile, simulated, **local `next start`** @ :3120)

| URL | Perf | LCP | CLS | TBT | Δ Perf |
|-----|------|-----|-----|-----|--------|
| `/` | **75** | 5.9s | 0.106 | 27ms | +7 |
| `/faq` | **78** | 5.0s | 0.106 | 2ms | +4 |
| `/botox-oswego-il` | **75** | 6.1s | 0.106 | 1ms | +2 |
| `/rx` | **83** | 4.7s | 0 | 1ms | +7 |

Shipped in `e558e38c`: hero opacity gate removed, FAQ FadeUp off ATF, below-fold `priority` stripped, RX video lazy behind poster, Montserrat off global `<head>`, botox hero image fixed + `sizes`.

Still short of ≥90 — remaining gap is mainly **LCP ~5s** (hero bytes + main-thread / third-party) and a mild **CLS ~0.1** on marketing chrome pages.

## Remaining levers

1. Compress / resize hero assets (home founders, botox, RX poster) for mobile DPR.
2. Defer chat / voice / assistant widgets until idle or open.
3. Investigate CLS ~0.1 (sticky CTA / header / late chrome).
4. Keep GTM/Meta afterInteractive; consider further delay on non-conversion pages.

## Cadence

- Re-run this 4-URL set after any hero/template performance change.
- Monthly: record scores here + glance at GSC Core Web Vitals report.
