# Hello Gorgeous Med Spa (HelloGorgeousMedSpa.com)

This repo is the **HelloGorgeousMedSpa.com** rebuild on **Next.js 14 (App Router)** + **Tailwind CSS**.

## Design Parity Requirement

This site is a **layout clone + content swap** based on `NoPriorAuthorization.com`.

- **Must match**: layout structure, spacing system, typography scale, button/card styles, animations, responsiveness, header/footer logic.
- **Must differ**: branding (copy/images), and medical-spa-specific SEO schema.

If an implementation choice isn’t specified, default to whatever `NoPriorAuthorization.com` does.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Vercel hosting
- GitHub PR workflow

## Project Structure (high level)

```
src/
  app/                  # App Router pages (SEO-first)
    page.tsx            # Home
    about/page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    contact/page.tsx
    book/page.tsx
    privacy/page.tsx
    terms/page.tsx
    robots.ts           # robots.txt
    sitemap.ts          # sitemap.xml
  components/
    site/               # Header/Footer (NPA layout system)
    ui/                 # Shared primitives (Button, Section, FadeUp)
    seo/                # JSON-LD helpers
  content/              # Service and FAQ content
  styles/globals.css    # Tailwind + global animation utility classes
```

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Quality gates (CI uses these):

```bash
npm test   # runs lint
npm run build
```

## SEO Notes

- **Per-page metadata** via App Router metadata exports (`src/lib/metadata.ts`)
- **JSON-LD**:
  - `MedicalBusiness` + `LocalBusiness` site schema
  - `FAQPage` schema per service
- **Indexing**: `robots.ts` + `sitemap.ts` are enabled and crawlable.

## Configuration TODOs (replace placeholders)

Update `src/content/site.ts` with real:
- phone/email/address
- geo coordinates
- canonical site URL (production)