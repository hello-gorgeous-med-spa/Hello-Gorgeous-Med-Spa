# Reviews: Fresha → HG OS (preserve 8 years)

You’re moving off Fresha to HG OS but need to **keep 8 years of reviews** and **reference them** in the new system. Here’s a clear path.

---

## Goal

- **Stop using Fresha** for new bookings and reviews.
- **Preserve** the existing ~8 years of Fresha reviews.
- **Reference** those reviews in HG OS (and on the website) so they’re not lost.

---

## 1. Get the reviews out of Fresha

- **Export:** If Fresha provides a business export (CSV, report, or “download my data”), use it to get all reviews (author, date, rating, text).
- **Screenshot/backup:** If there’s no export, consider a one-time backup (screenshots or copy‑paste into a spreadsheet) so you have a permanent record before the link or account changes.
- **Format to keep:** For each review, at minimum: **date**, **rating**, **review text**, **author name** (or “Anonymous” if that’s all Fresha shows).

---

## 2. Bring them into HG OS (“reference” them)

You need a **single place** in HG OS that holds “all our reviews” (legacy + new).

**Option A – New table in HG OS**

- Add a `client_reviews` (or `reviews`) table, e.g.:
  - `id`, `client_id` (optional), `author_name`, `rating`, `body`, `source` (e.g. `'fresha_import'` vs `'hg_os'`), `reviewed_at`, `created_at`.
- **Import:** One-time script or admin tool that reads your Fresha export and inserts rows with `source = 'fresha_import'`.
- **New reviews:** When you add “leave a review” in HG OS (portal, post‑visit link, etc.), new reviews get `source = 'hg_os'`.
- Then “reference 8 years of reviews” = querying this table (filter by source if you want, or show all).

**Option B – CMS / static content**

- If HG OS has a CMS or “testimonials” / “reviews” content block, you can paste or import the best legacy reviews there and show them on the site. Less flexible than a DB, but still a way to reference and display the 8 years.

**Option C – HG OS “reviews” page**

- Build a page in HG OS (e.g. `/reviews` or a public “Our reviews” page) that:
  - Reads from the `client_reviews` table (Option A), or
  - Reads from the CMS (Option B).
- That page becomes the **canonical** “see our reviews” and, if you add a form, “leave a review.”

---

## 3. Point the website and automation to HG OS

Once you have a place in HG OS to reference and show reviews:

| What | Where it’s set | What to do |
|------|----------------|------------|
| **Website “See our reviews” / “Leave a review”** | `NEXT_PUBLIC_REVIEWS_URL` (Vercel env) | Set to your **HG OS reviews page** (e.g. `https://www.hellogorgeousmedspa.com/reviews` if you serve it on the same site, or the HG OS URL). |
| **QR code on /reviews** | Same: uses `FRESHA_REVIEWS_URL` in code, which reads `NEXT_PUBLIC_REVIEWS_URL`. | No extra step; same env. |
| **Post‑visit “Leave a review” SMS** | `app/api/reviews/request/route.ts` | Now uses the same review URL from env (see below). Set `NEXT_PUBLIC_REVIEWS_URL` (or the server env you use) to the HG OS review page/link. |

So: **one URL in env** = website, QR, and SMS all point to your new system and still “reference” the 8 years by sending people to the place that shows legacy + new reviews.

---

## 4. Optional: Show reviews on the site from HG OS

If you add an API in HG OS that returns reviews (e.g. `GET /api/reviews` or your HG OS equivalent), the public **/reviews** page on hellogorgeousmedspa.com can:

- Fetch and display those reviews (including the imported Fresha ones), and
- Keep a “Leave a review” button that goes to `NEXT_PUBLIC_REVIEWS_URL` (your HG OS flow).

That way the 8 years are visible on the live site and still referenced inside HG OS.

---

## Summary

1. **Export/backup** Fresha reviews (date, rating, text, author).
2. **Import** them into HG OS (new `client_reviews` table or CMS).
3. **Build** an HG OS “reviews” page that shows legacy + new reviews and (optional) “leave a review.”
4. **Set** `NEXT_PUBLIC_REVIEWS_URL` to that HG OS reviews page so the site, QR, and post‑visit SMS all point there and you never lose the 8 years of reference.
