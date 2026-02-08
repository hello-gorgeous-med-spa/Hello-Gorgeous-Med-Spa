# Phase 1: Fresha Reviews Export (Dev-Assisted)

**Goal:** Get all historical reviews out of Fresha into a CSV for one-time import into HG OS.

---

## Where reviews live in Fresha

- **Fresha Partner Dashboard → Marketing → Reviews**  
  https://partners.fresha.com/marketing/reviews

---

## Option C: Authenticated automation (Playwright) — recommended

Fresha has no native export. Use a one-time Playwright script that logs in with your credentials (locally), then exports all reviews to CSV.

**Security:** Login happens on your machine. Session is saved temporarily and **deleted after export**. No credentials or session files are committed.

1. **Install browser (first time only):**
   ```bash
   npx playwright install chromium
   ```
2. **Run the export:**
   ```bash
   npm run export-fresha-reviews
   ```
   or:
   ```bash
   node scripts/export-fresha-reviews.mjs
   ```
3. **When the browser opens:** Log in to Fresha Partner Dashboard if prompted.
4. **When you see the dashboard:** Press Enter in the terminal. The script will go to Marketing → Reviews, scroll until all ~2,000 reviews load, extract them, and write `fresha_reviews_export.csv`.
5. **After export:** Session file is deleted. Use the CSV with `import-fresha-reviews.mjs` as in “After you have the CSV” below.

If the script extracts 0 reviews, the page structure may have changed; inspect the reviews page in DevTools and update the selectors in `scripts/export-fresha-reviews.mjs` (search for `ReviewCard`, `review-card`, etc.).

---

## Option A: Native export (if available)

1. Log in to [Fresha Partner Dashboard](https://partners.fresha.com).
2. Go to **Marketing → Reviews**.
3. Look for **Export**, **Download**, or **Reports**.
4. If CSV export exists, download and ensure it includes (or can be mapped to) the fields below.

---

## Option B: No native export — copy into CSV

If Fresha does not offer a review export:

1. **Create a CSV** with this header (exact names so the import script recognizes them):

   ```csv
   legacy_review_id,client_name,rating,review_text,service_name,created_at
   ```

2. **Required columns (minimum):**
   - `rating` — 1–5
   - `review_text` — full review text
   - `created_at` — review date (e.g. `2024-01-15` or ISO)

3. **Optional but recommended:**
   - `legacy_review_id` — any stable ID from Fresha (for dedupe on re-import)
   - `client_name` — first name only is fine if that’s all Fresha shows
   - `service_name` — if the review is tied to a service

4. **Safely copy from Fresha:**
   - Open the Reviews page.
   - Copy reviews in batches (e.g. one page at a time) into a spreadsheet.
   - Map columns to the header above.
   - Save as **CSV (UTF-8)**.
   - Store the file as `fresha_reviews_export.csv` in a secure location (e.g. project root or secure drive) for the one-time import only; do not commit it to the repo if it contains PII.

---

## CSV template (starter file)

Create a file with this content and fill in rows from Fresha:

```csv
legacy_review_id,client_name,rating,review_text,service_name,created_at
,John,5,"Amazing experience, will be back!",Botox,2024-06-01
```

- Leave `legacy_review_id` empty if Fresha doesn’t give you one; the import will still work (no dedupe by id).
- Use quotes around `review_text` if it contains commas.

---

## After you have the CSV

1. **Run the migration** (if not already applied) in Supabase SQL Editor:  
   `lib/hgos/migrations/add-client-reviews.sql`
2. **Run the one-time import:**  
   `node scripts/import-fresha-reviews.mjs /path/to/fresha_reviews_export.csv`
3. **Confirm:** Script prints `Imported N legacy reviews` and reviews appear on `/reviews`.

---

## Security

- Keep `fresha_reviews_export.csv` **out of version control** (add to `.gitignore` if stored in project).
- Use a secure location; delete or archive after a successful import if desired.
