# Conversion Tracking Plan

## Setup

- **GTM:** Set `NEXT_PUBLIC_GTM_ID` (e.g. `GTM-XXXXXXX`) in env to enable Google Tag Manager.
- **GA4:** Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (e.g. `G-XXXXXXX`) in env to enable GA4.
- **Google Ads:** Configure conversions inside GTM or GA4; no extra env vars required for basic setup.

Implementation: `components/GoogleAnalytics.tsx` (injected in `app/layout.tsx`).

---

## Events implemented

| Event name | When it fires | Where implemented |
|------------|----------------|-------------------|
| `phone_click` | User clicks any `tel:` link | Delegated click listener in `GoogleAnalytics.tsx` (sitewide) |
| `email_click` | User clicks any `mailto:` link | Same delegated listener |
| `sms_click` | User clicks an `sms:` link or element with `data-sms-click` | Same delegated listener |
| `book_now_click` | User clicks a link whose href contains `book` or element with `data-book-now` | Same delegated listener |
| `quiz_complete` | User sees quiz results (quiz or treatment-quiz) | `app/quiz/page.tsx`, `app/quiz/TreatmentQuiz.tsx` |
| `consult_start` | User gets Body Consultation recommendations | `BodyConsultationTool.tsx` |
| `concern_submit` | Fix What Bothers Me form submitted | `FixWhatBothersMeForm.tsx` |
| `subscribe` | Email captured (popup, etc.) | `EmailCapture.tsx` |

All of the above push to `dataLayer` and to `gtag('event', eventName, params)` when GA4 is loaded.

See `docs/ANALYTICS_EVENTS.md` for full event catalog and dashboard guidance.

---

## Events to add when features exist

| Event name | When to fire | Suggested implementation |
|------------|----------------|---------------------------|
| `form_submit` | User submits contact / lead form | On form submit handler: `trackEvent('form_submit', { form_name: 'contact' })`; use `components/GoogleAnalytics.tsx` `trackEvent()` import |

To fire from any component:

```ts
import { trackEvent } from '@/components/GoogleAnalytics';
// then e.g.:
trackEvent('form_submit', { form_name: 'contact' });
trackEvent('book_now_click', { source: 'vip_page' });
```

---

## Call tracking (CallRail or similar)

Not implemented. Options:

1. Use a GTM tag that loads CallRail and replaces the visible phone number with a tracking number.
2. Or use a server-side / edge solution that swaps the number in the HTML by segment.

---

## Google Ads conversion tracking

- Create conversion actions in Google Ads (e.g. “Book Now click”, “Phone click”).
- In GTM: use GA4 event or custom event triggers that match the events above, then add Google Ads Conversion tag with the same trigger.
- Or in GA4: link GA4 to Google Ads and import GA4 events as conversions.

No code changes required if using the existing events above.
