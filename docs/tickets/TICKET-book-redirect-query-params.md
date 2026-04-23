# TICKET: `/book` → Fresha query param forwarding (Model B)

**Status:** Implemented (marketing allowlist) + documented limitations  
**Context:** [OPERATIONS_FRESHA_HG_HYBRID.md](../OPERATIONS_FRESHA_HG_HYBRID.md) · [lib/flows.ts](../../lib/flows.ts)

---

## Goal

When users land on `https://www.hellogorgeousmedspa.com/book?utm_source=...` (or with ad click IDs), the **redirect to Fresha** should preserve **supported** query parameters when safe; otherwise we document that attribution is **not** passed so marketing does not assume it.

---

## Research: what Fresha supports (public documentation)

| Question | Finding |
|----------|---------|
| **Official list of query params** for `book-now/.../services?...` | **Not published** in Fresha Help Center. Links are **generated in Link Builder** (per location, service, team member) as **distinct URLs**, not as generic `?provider=` on a shared base. See [Add a book button](https://www.fresha.com/help-center/knowledge-base/online-profile/152-add-a-book-button-to-your-website). |
| **UTM / campaign params** on URLs | **Not documented** as pass-through fields. Fresha offers **Google Analytics 4** integration in account settings (tracking **within** their booking experience), not a public spec for appending `utm_*` to the booking link. |
| **“Provider” or team pre-selection** | Achieved by **Filter / team member** in **Link Builder**, producing a **dedicated** booking URL from Fresha—not by arbitrary `?provider=danielle` on a generic org URL. |
| **Conclusion** | We **cannot** confirm from Fresha’s public docs that unknown query params are **consumed in reporting**. Standard **web** behavior is to **retain** extra query parameters on the initial navigation; many analytics setups read `utm_*` and click IDs on **landing**. **Empirical validation** on a real booking (test appointment) is the definitive check. |

---

## UTM and click IDs: can they be “preserved”?

- **HTTP behavior:** Merging `utm_source`, `utm_medium`, `gclid`, etc. onto the **Fresha** URL causes the **client to load Fresha with those params in the address bar** (unless Fresha server-side strips them, which is uncommon but possible).
- **Attribution in Fresha / GA:** **Unconfirmed** without Fresha or GA configuration review. **Do not** assume internal Fresha reports attribute by UTM from this redirect alone; **GA4 on Fresha** (if connected) is the documented path for journey analytics in their help center.
- **Our position:** We **forward** an **allowlist** of industry-standard marketing parameters so **your** off-site tools (e.g. ad platforms, UTM in landing URLs) are not **dropped** at our redirect. Whether Fresha **uses** them is **out of our control**; confirm with a test + Fresha/GA as needed.

**Implemented allowlist** (see `lib/booking/merge-fresha-redirect-url.ts`):

- `utm_*` (any case, stored lowercase in URL)
- `gclid`, `fbclid`, `msclkid`, `twclid`, `li_fat_id`, `wbraid`, `gbraid`
- Truncation for abuse safety (`MAX_LEN`)

---

## Provider-related params: can they be preserved?

| Param | Verdict |
|--------|---------|
| `provider=danielle` / `provider=ryan` (legacy query pattern) | **Not** a documented Fresha query field for the standard **org** `book-now/.../services` URL. **We do not forward** these in `mergeBookRedirectUrl`. Public “Book with Danielle/Ryan” uses **`NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE` / `RYAN`** in `lib/flows.ts` (or full Link Builder URLs from the CMS) — not `?provider=` on `/book` or the org Fresha base. |
| **True** team pre-book | **Fresha Link Builder** (per team member) → optional env per slug in `lib/flows.ts`, or a full `https?` `booking_url` on the provider record when vetted. |
| `pId` / `lid` on `BOOKING_URL` | **Preserved** as part of the **base** `BOOKING_URL` in `lib/flows` / Vercel — they are **not** from `/book?` on our side. |

**Follow-up (optional product):** Map internal provider slugs to **Fresha-generated** deep links, not query hacks.

---

## Implementation

| File | Role |
|------|------|
| [lib/booking/merge-fresha-redirect-url.ts](../../lib/booking/merge-fresha-redirect-url.ts) | Merge allowlisted params onto `BOOKING_URL`. |
| [app/book/page.tsx](../../app/book/page.tsx) | `async` redirect using `searchParams` + merge. |
| [app/book/[slug]/page.tsx](../../app/book/[slug]/page.tsx) | Same for legacy `/book/...` paths. |

---

## Acceptance criteria (from request)

- [x] **Which query params are supported by Fresha** — **Public:** not enumerated by Fresha; **in app:** only the **allowlist** above is forwarded.  
- [x] **UTM preserved** — **Merged onto redirect URL** (browser loads Fresha with UTM/click-id params). **Attribution in Fresha dashboards** not guaranteed by public docs.  
- [x] **Provider params preserved** — **No**; documented; use Link Builder or future mapped URLs.  
- [x] **Safe forwarding** — Implemented for allowlist only.  
- [x] **Limitation documented** — This file + JSDoc on merge helper.  

---

## QA suggestions

1. Open:  
   `https://www.hellogorgeousmedspa.com/book?utm_source=test&utm_medium=email&utm_campaign=ticket`  
   Confirm **location** on Fresha includes those params.  
2. Open with `?provider=danielle` and confirm it is **dropped** (Fresha base unchanged except known base query).  
3. After Fresha/GA review, add one line to this doc: “Confirmed 2026-__-__ UTM visible in [tool].”
