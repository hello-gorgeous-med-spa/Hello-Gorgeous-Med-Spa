# Hello Gorgeous Med Spa (HelloGorgeousMedSpa.com)

This repo is the **HelloGorgeousMedSpa.com** rebuild on **Next.js 14 (App Router)** + **Tailwind CSS**.

## Where to work (Cursor / IDE)

**Always open and edit the main git clone.** Do not use a worktree or mirror folder for development—those are read-only copies and have no `.git`, so you can't commit or push from them.

- **Open this folder in Cursor:**  
  `File → Open Folder` → choose the **main** repo path, e.g.  
  `~/Hello-Gorgeous-Med-Spa/hello-gorgeous-med-spa`  
  (or wherever your main clone lives.)
- All edits, commits, and pushes should happen in that folder. If you currently have a worktree path open (e.g. under `.cursor/worktrees/`), switch to the main clone so Cursor uses the real repo.

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