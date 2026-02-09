# Mobile Readiness — QA Pass Complete

**Ticket:** Mobile Readiness & UX Hardening (Consumer-Facing)  
**Scope:** Public pages only (not /admin, /portal, /login).  
**Date:** 2025-02-04

## Summary

**Mobile pass complete.** Consumer-facing flows are mobile-first, touch-optimized, and keyboard-safe. All deliverables below are implemented and ready for device testing (iPhone Safari, Android Chrome).

---

## 1. Fix What Bothers Me (`/fix-what-bothers-me`)

- **Form:** Full-width fields; inputs and textarea use `input-touch` / `min-h-[44px]` for ≥44px tap targets.
- **Types:** `email` and `tel` on email/phone; `autoComplete` for name, email, tel.
- **Textarea:** Min 4 visible rows, auto-expands on input, `resize-none` and `overflow-x: hidden` to prevent horizontal scroll.
- **Submit CTA:** Sticky bar on mobile (sticky bottom with safe padding); primary and secondary buttons ≥44px.
- **After-submit:** Suggestions shown as stacked cards on mobile; “Book” / “Start” buttons full-width on small screens; suggestions container has `min-h-[120px]` to reduce layout shift when results load.
- **Page:** `overflow-x-hidden` on page wrapper to avoid horizontal scroll.

## 2. Homepage — Fix What Bothers Me Feature

- **Section:** Mobile-first; section limited to ~`70vh` on small screens with `max-h-[70vh] md:max-h-none` and flex layout so CTAs stay visible.
- **Carousel:** Horizontal scroll with `scroll-snap`, `touch-pan-x`, `-webkit-overflow-scrolling: touch`; cards have `active:` and `focus-visible:` so tap works (no hover-only).
- **“See options →”:** Visible on mobile (`text-pink-400/80` on small screens) so tap target is clear.
- **CTAs:** Full-width on mobile, `min-h-[44px]`, below carousel and always in flow.

## 3. Booking Flow (`/book`, `/book/[slug]`)

- **Date/time:** Date strip and time grid buttons use `min-h-[44px]` (and date `min-w-[64px]`); horizontal date strip uses `scrollbar-hide` and touch-friendly scrolling.
- **Provider:** Stacked vertically (single-column grid on mobile).
- **Modals:** No viewport-overflow modals; form is inline with `keyboard-safe` padding so CTAs remain reachable when keyboard is open.
- **Autofill:** `autoComplete` set for name (given-name, family-name), email, tel on booking form.
- **Header:** Main content has `scroll-mt-20` and `id="main-content"` so fixed header does not cover focused fields when scrolling.

## 4. Navigation & CTA Safety

- **Header:** No crowding on small screens; hamburger uses `tap-target` (min 44×44px).
- **Mobile menu:** “Fix what bothers me” is a top-level, one-tap link with clear styling.
- **Menu links:** Accordion sections and links use `min-h-[44px]` where appropriate to avoid accidental taps on adjacent links.

## 5. Forms (Global)

- **FWBM, Contact, Join:** All consumer forms use:
  - Inputs/textarea/buttons ≥44px height (`min-h-[44px]` or `input-touch`).
  - Adequate spacing (`gap-4`), clear focus states (`focus:ring-2 focus:ring-pink-500` and `focus:border-pink-500/50`).
  - Inline error messages with `role="alert"` (no alert-only).
  - `keyboard-safe` on form containers for extra bottom padding on mobile so submit stays reachable when keyboard is open.

## 6. Performance (Mobile)

- **CLS:** FWBM success suggestions area has reserved `min-h-[120px]`; homepage FWBM section has constrained height on mobile to limit layout shift.
- **Scrollbars:** `.scrollbar-hide` utility in `globals.css` for carousels; no extra layout shift from scrollbar appearance.
- **Images:** No changes to image sizing in this ticket; recommend running Lighthouse and addressing any “proper sizes” suggestions per route.

---

## Files Touched

- `app/globals.css` — `.scrollbar-hide`, `.tap-target`, `.input-touch`, `.keyboard-safe`
- `app/fix-what-bothers-me/page.tsx` — overflow-x-hidden
- `app/fix-what-bothers-me/FixWhatBothersMeForm.tsx` — form UX, textarea auto-expand, sticky CTA, success cards
- `components/FixWhatBothersMeFeature.tsx` — section height, carousel tap/scroll, CTA visibility
- `app/book/[slug]/BookingForm.tsx` — tap targets, autofill, keyboard-safe
- `app/book/[slug]/page.tsx` — scroll-mt, main id
- `components/Header.tsx` — FWBM one-tap link, hamburger tap target
- `components/ContactForm.tsx` — 44px inputs, focus, errors, keyboard-safe
- `app/join/page.tsx` — 44px inputs, autocomplete, submit tap target

---

## Recommended Device Checks

1. **iPhone (Safari):** FWBM form (sticky submit, keyboard), homepage carousel swipe, booking date/time and confirm step, hamburger → “Fix what bothers me” in one tap.
2. **Android (Chrome):** Same flows; confirm no horizontal scroll, no blocked CTAs, autofill works for name/email/phone where applicable.
3. **Lighthouse Mobile:** Run on `/`, `/fix-what-bothers-me`, `/book`, `/contact` and aim for Performance ≥80, Accessibility ≥90; fix any CLS or image-size issues reported.

---

## Out of Scope (Unchanged)

- Client login, portal, PWA/app install, admin views, auth.
