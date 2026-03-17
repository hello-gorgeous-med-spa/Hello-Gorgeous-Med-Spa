# 404 Redirects — Legacy URLs from Old Site

**Problem:** Google Search Console reported 41 URLs returning "Not found (404)" — legacy URLs from a previous site (GoDaddy or old CMS).

---

## Redirects Added (next.config.js)

| Old URL | Redirects To |
|---------|--------------|
| /shop-1, /shop-1/* | /shop |
| /skinscript-rx | /shop |
| /anteage | /shop |
| /migrane-%26-trigger-points | /pre-post-care/trigger-point |
| /migraine-%26-trigger-points | /pre-post-care/trigger-point |
| /dermaplanning | /services/lash-spa |
| /womens-health, /womens-health-2 | /rx/hormones |
| /f/* (blog category URLs) | /blog |
| /privacy-policy-1, /privacy-policy-2 | /privacy |
| /dermal-fillers-oswego-il | /services/dermal-fillers |
| /cryo-frotox-facial | /services/geneo-facial |
| /perimenopause-therapy | /rx/hormones |
| /pituitary-imbalance-help | /rx/hormones |
| /skin-tightening | /services/morpheus8 |
| /hello-gorgeous-signature | /services/hydra-facial |

---

## After Deploy

1. **Re-crawl** — Google will eventually re-crawl these URLs and get 301 redirects instead of 404.
2. **Search Console** — The "Not found (404)" count should drop over 1–2 weeks as Google updates.
3. **New 404s** — If you see new legacy URLs in Search Console, add redirects in `next.config.js` and redeploy.

---

*Reference: docs/INDEXING-ACTION-PLAN.md*
