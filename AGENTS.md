# AGENTS.md

Hello Gorgeous Med Spa — full-stack **Next.js 15 (App Router)** + Tailwind + Supabase site. The single app at the repo root is both the public marketing site and the `/admin` + `/hub` operations console. See `README.md` and `package.json` scripts for the canonical command list.

## Cursor Cloud specific instructions

This is one Next.js app (root `package.json`). The cloud VM update script already runs `npm ci`, so dependencies are installed before each session.

### Services & commands
- Dev server: `npm run dev` (Next.js on http://localhost:3000). This is the only long-running service needed to develop/test the app.
- Lint: `npm run lint` (also `npm test`, which just runs lint). Lint uses `--max-warnings=9999`, so it exits 0 despite many existing warnings — that is expected, not a regression.
- Build: `npm run build`. The `prebuild` step runs media-sync scripts plus `scripts/check-seo-content-depth.ts`, which **fails the build** if any location page in `lib/local-seo-content*.ts` drops below the minimum word count. If a build fails on `[SEO] ... Build FAILED`, it is a content-length gate, not a compile error.
- `next.config.js` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` to `true`, so `npm run build` will NOT fail on lint or type errors — run `npm run lint` separately to catch those.

### Environment / secrets
- A gitignored `.env.local` with placeholder Supabase values lets `dev`/`lint`/`build` run without real credentials. The Supabase clients (`lib/supabase/*`) fall back to placeholders and log a warning instead of crashing when env is missing.
- Most public pages and several API routes (e.g. the contact form `POST /api/contact`) work fully offline: when `RESEND_API_KEY` / Supabase service creds are absent they skip email/DB writes and still return success.
- External integrations require real keys to exercise end-to-end: Supabase, Stripe, Square, Twilio, Resend, OpenAI/Anthropic, ElevenLabs, Plaid, Google. See `.env.example` for the full list. Add these as Cursor secrets only when a task needs that specific integration.

### Gotchas
- `scripts/sync-mascot-media.mjs` (run during `prebuild`) copies from a local `/danid` path that does not exist on the VM; it is intentionally non-failing and is a no-op here.
- Git hooks reference Git LFS; the cloud env routes `core.hooksPath` elsewhere so LFS hooks do not block commits.
- `remotion-videos/` is a separate package with its own `package.json` (video rendering). It is not needed to run or test the main web app.
