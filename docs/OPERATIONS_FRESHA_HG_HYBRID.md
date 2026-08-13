# Fresha + Hello Gorgeous — Hybrid operations (ARCHIVED)

> **Archived August 2026. Do not follow this document.**
>
> Hello Gorgeous **discontinued Fresha**. Square is now the only scheduler and the
> only payment system. Everything below described a hybrid model that no longer exists.

## What is true now

| Topic | Current answer |
|-------|----------------|
| Public booking | **Square Appointments.** `BOOKING_URL` in `lib/flows.ts` resolves to the Square org booking site. |
| Site entry | **`/book`** is still the canonical branded path; it merges attribution params and redirects to Square. |
| Env vars | `NEXT_PUBLIC_SQUARE_BOOKING_URL` (org), `NEXT_PUBLIC_SQUARE_BOOKING_URL_DANIELLE`, `NEXT_PUBLIC_SQUARE_BOOKING_URL_RYAN`. Non-Square URLs are **rejected** by `resolvePublicBookingUrl()` so a stale env var can never take over public CTAs. |
| Per-provider links | `PROVIDER_BOOKING_URL_DANIELLE` / `PROVIDER_BOOKING_URL_RYAN` (renamed from `FRESHA_BOOKING_URL_*`). Unset falls back to the org URL. |
| Payments | **Square** — in-spa POS, invoices, and online checkouts. |
| Charting / consents / internal ops | **Hello Gorgeous (HGOS)**, unchanged. |

The old Fresha URL constants (`FRESHA_ORG_BOOKING_URL`, `LEGACY_FRESHA_ORG_BOOKING_URL`,
`FRESHA_BOOKING_URL`, `VIP_MODEL_SQUARE_URL`) have been **deleted** from `lib/flows.ts`.
Do not reintroduce them.

## Historical import scripts

`scripts/import-fresha-appointments.mjs`, `scripts/import-fresha-clients.mjs`,
`scripts/export-fresha-clients.mjs`, and `scripts/export-fresha-reviews.mjs` are kept
only to read **historical** CSV exports already on disk. The Fresha partner portal is no
longer accessible, so they cannot pull new data.

The 1,931 five-star post-appointment reviews collected on Fresha are still cited on the
site, but **unbranded** ("5.0★ from 1,931 verified visits") since clients can no longer
verify them on that platform. See `lib/review-trust.ts`.

## Related docs

- [BOOKING.md](./BOOKING.md) — booking model
- [BOOKING_READY.md](./BOOKING_READY.md) — HG booking APIs
