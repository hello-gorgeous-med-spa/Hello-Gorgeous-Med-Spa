# Analytics Events — Hello Gorgeous

Key conversion and behavior events fired to GA4/dataLayer. Use these for funnels, dashboards, and optimization.

---

## Conversion Events

| Event | When Fired | Params | Funnel Stage |
|-------|------------|--------|--------------|
| `quiz_complete` | User sees personalized quiz results | `source`: `quiz` \| `treatment-quiz` | High intent |
| `consult_start` | User gets Body Consultation recommendations | — | High intent |
| `concern_submit` | Fix What Bothers Me form submitted successfully | — | Lead |
| `subscribe` | Email captured (popup, quiz, etc.) | `source`: `popup-10off` \| `treatment-quiz` | Lead |
| `book_now_click` | User clicks any booking link | `link_url` | Conversion |
| `phone_click` | User clicks tel: link | `link_url` | Conversion |
| `email_click` | User clicks mailto: link | `link_url` | Contact |
| `sms_click` | User clicks sms: link | `link_url` | Contact |

---

## Engagement Events

| Event | When to Fire | Notes |
|-------|--------------|-------|
| `quiz_satisfaction` | User rates quiz (1–5) after results | `rating`: 1–5, `source`: treatment-quiz. TreatmentQuiz.tsx |
| `provider_book_click` | User clicks "Book with Danielle/Ryan" | `provider`: `danielle` \| `ryan` |
| `lip_studio_*` | Lip Studio interactions | See `lib/lip-studio-analytics.ts` |

---

## Implementation

- **Helper:** `trackEvent(eventName, params)` from `@/components/GoogleAnalytics`
- **Where:** Quiz pages, BodyConsultationTool, FixWhatBothersMeForm, EmailCapture
- **Destination:** dataLayer + gtag (GA4); GTM can use dataLayer for triggers

---

## Dashboard / Monthly Review

### Funnel to track

1. **Traffic** → Page views, sessions
2. **Engagement** → `quiz_complete`, `consult_start`
3. **Leads** → `subscribe`, `concern_submit`
4. **Conversion** → `book_now_click`, `phone_click`

### Suggested GA4 Custom Reports

- Quiz completion rate: `quiz_complete` / quiz page views
- Consult → Book: users with both `consult_start` and `book_now_click`
- Lead sources: `subscribe` + `source` param

### GTM Setup

Create GA4 event tags triggered by:
- Custom Event = `quiz_complete`
- Custom Event = `consult_start`
- Custom Event = `concern_submit`
- Custom Event = `subscribe`

Map these as conversions in GA4 Admin if desired.
