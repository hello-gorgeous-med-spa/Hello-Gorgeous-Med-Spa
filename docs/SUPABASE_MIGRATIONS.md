# Supabase Migrations (No More Manual SQL)

Migrations run **automatically** when you push to `main`. No more copying SQL into the Supabase dashboard.

## One-Time Setup: Add GitHub Secrets

1. Go to **GitHub** → your repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret | Where to get it |
|--------|-----------------|
| `SUPABASE_ACCESS_TOKEN` | [Supabase Account](https://supabase.com/dashboard/account/tokens) → Generate new token |
| `SUPABASE_PROJECT_REF` | Supabase project URL: `https://supabase.com/dashboard/project/**XXXXX**` ← that `XXXXX` |

## What Happens on Push to Main

1. **Migrate** job runs `supabase db push` → applies any new migration files
2. **Build** job runs → lint, build, test
3. Vercel deploys (as usual)

## Local Development (Optional)

If you want to run migrations locally before pushing:

```bash
npm install -g supabase   # or: npx supabase
supabase link            # one-time, use your project ref + DB password when prompted
supabase db push         # applies pending migrations
```

## Changing Provider Images (Ryan, Danielle)

Edit `lib/providers/fallback.ts` → `PROVIDER_HEADSHOT_OVERRIDES`.  
No DB changes needed. Replace the image file in `public/images/providers/` and update the path in code.
