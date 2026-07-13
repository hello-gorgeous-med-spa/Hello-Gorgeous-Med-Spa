# Lighthouse / CWV Baseline — Hello Gorgeous Med Spa

**Target (SEO-001):** Mobile Performance ≥ 90 · LCP ≤ 2.5s · CLS ≤ 0.1

## How to run

```bash
npx lighthouse https://www.hellogorgeousmedspa.com/ \
  --only-categories=performance --form-factor=mobile \
  --chrome-flags="--headless --no-sandbox" --quiet --view
```

## Progress (mobile, simulated throttling)

| URL | Pre (live) | Round 1 (local) | Round 2 (local) | Notes |
|-----|------------|-----------------|-----------------|-------|
| `/` | 68 / 6.6s / CLS 0 | 75 / 5.9s / 0.106 | **78 / 5.8s / 0.001** | CLS fixed; LCP still hero-bound |
| `/faq` | 74 / 5.4s | 78 / 5.0s / 0.106 | **84 / 4.5s / 0.001** | Best of marketing pages |
| `/botox-oswego-il` | 73 / 5.3s | 75 / 6.1s / 0.106 | **82 / 4.8s / 0.001** | WebP + sizes |
| `/rx` | 76 / 5.3s | 83 / 4.7s / 0 | **83 / 4.7s / 0** | Video already lazy |

## What shipped

**Round 1 (`e558e38c`):** hero opacity gate, FAQ FadeUp off ATF, strip below-fold `priority`, RX video lazy + poster, Montserrat off global head.

**Round 2:** defer chat/PWA/voice until idle; BookingTransitionBanner paints immediately (no mount→null CLS); heroes → WebP (~63–76% smaller sources).

## Remaining to ≥90

1. Further hero/LCP: smaller mobile art-directed crops, fewer ATF JS bytes (analytics delay).
2. Optional: drop or further delay dual chat widgets (Mascot + Assistant).
3. Re-check live prod after Vercel deploy (local `next start` numbers above).

## Cadence

- Re-run 4-URL set after hero/template perf changes.
- Monthly: this table + GSC Core Web Vitals report.
