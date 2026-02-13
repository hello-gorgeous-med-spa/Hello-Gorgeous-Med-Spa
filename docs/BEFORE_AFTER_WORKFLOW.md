# Before/After Media Workflow

Consent-first process for provider results. **Client consent must be confirmed before any before/after is published.**

---

## 1. Consent (Required)

- Obtain signed **Photo/Media Release** or equivalent consent before treatment.
- Store consent in client record (Admin → Clients).
- Do **not** publish before/after without documented consent.

---

## 2. Capture

- Take before photo at start of treatment.
- Take after photo at appropriate follow-up (e.g., 2 weeks for injectables).
- Store in chart if using clinical photo capture, or prepare for marketing upload.

---

## 3. Admin Upload

**Path:** Admin → Content → Providers → [Provider] → Upload Before/After

| Field | Required | Notes |
|-------|----------|-------|
| Before image | ✅ | JPG/PNG, max 100MB |
| After image | ✅ | Same format |
| Service tag | ✅ | Botox, Lip Filler, PRP, Weight Loss, etc. |
| Title / caption | Optional | Short description |
| Client consent confirmed | ✅ | **Checkbox must be checked before publish** |
| Watermark | Optional | Toggle watermark on images |

---

## 4. Approval & Publish

- Status: `draft` → `published`
- **API enforces:** Cannot set `published` unless `consent_confirmed = true`.
- Once published, results appear on provider profile pages and in API responses.

---

## 5. Display

- **Provider pages** (`/providers/danielle`, `/providers/ryan`): Results section with slider.
- **Service pages**: Some services (Dermal Fillers, Lip Filler, RF Microneedling) have static galleries; future: pull from `provider_media` by `service_tag`.
- **Disclaimer:** "Results vary by individual. All treatments performed by licensed medical professionals. Client consent on file." (see `ResultsDisclaimer.tsx`)

---

## Quick Reference

| Step | Action |
|------|--------|
| Consent | Signed form on file |
| Upload | Admin → Content → Providers → Add Before/After |
| Publish | Check "Client consent confirmed" → Save as Published |
| Remove | Archive in Admin (status → archived) |
