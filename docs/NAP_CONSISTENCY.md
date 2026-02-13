# NAP Consistency — Hello Gorgeous Med Spa

**Canonical NAP** (single source of truth: `lib/seo.ts` SITE):

| Field | Value |
|-------|-------|
| **Name** | Hello Gorgeous Med Spa |
| **Address** | 74 W. Washington Street, Oswego, IL 60543 |
| **Phone** | 630-636-6193 |
| **Email** | hellogorgeousskin@yahoo.com |

**Google Business Profile:** [SITE.googleBusinessUrl](https://www.google.com/maps/place/Hello+Gorgeous+Med+Spa/@41.6828,-88.3515,17z)

---

## Audit Notes

- **Postal code:** Canonical is 60543 (Oswego). Previously 60503 in `lib/seo.ts` — fixed.
- **Address format:** "74 W. Washington St" vs "74 W. Washington Street" — both acceptable; schema uses Street.
- **Phone format:** `630-636-6193` or `(630) 636-6193` — both valid for display; `tel:` links work with either.

---

## Where NAP Is Used

- **Schema:** `lib/seo.ts` → `siteJsonLd()`, `organizationJsonLd()`, service/location schemas
- **Footer:** SITE.address, SITE.phone, SITE.email
- **Contact page:** SITE values
- **Location pages:** Oswego, Naperville, Aurora, Plainfield — address + phone
- **Booking flow:** Address + phone in confirmation

---

## Recommendations

1. Keep all public NAP in `lib/seo.ts` SITE. Do not hardcode elsewhere.
2. When adding new pages, import SITE from `@/lib/seo`.
3. Validate NAP matches Google Business Profile at least quarterly.
