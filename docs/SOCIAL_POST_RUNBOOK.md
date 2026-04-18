# Social post runbook — do this every time

Quick memo for **Hello Gorgeous Med Spa** so posting to **Google Business Profile** (and Meta, when configured) stays consistent. Full OAuth and env setup: **`docs/SOCIAL_POSTING_SETUP.md`**.

---

## Cadence (suggested)

| Channel | Target |
|--------|--------|
| **Google Business** | 1–2 posts / week (offers, new services, proof) |
| **Facebook** | Align with Google when you have a campaign |
| **Instagram** | Same as Facebook; **requires a public image URL** every time |

---

## Before you post (checklist)

1. **Copy** — Short headline + 1–2 lines + CTA (book / learn more). Match **`docs/VOICE-AND-STYLE.md`**.
2. **Link** — Prefer `https://www.hellogorgeousmedspa.com/...` (booking or landing page).
3. **Image (Google & IG)** — Must be **`https://`** and **public** (no localhost).  
   - Add files under **`public/images/marketing/your-file.png`**, deploy, then use:  
     `https://www.hellogorgeousmedspa.com/images/marketing/your-file.png`
4. **Confirm envs** — Production: open  
   `https://www.hellogorgeousmedspa.com/api/social/status`  
   Each channel should show `"configured": true` when you intend to use it.

---

## Option A — Admin UI (easiest)

1. Go to **Admin → Marketing → Post to social** — **`/admin/marketing/post-social`**
2. Enter message, optional link and image URL, pick channels, publish or schedule.

---

## Option B — API (same behavior as the UI)

**Endpoint:** `POST /api/social/post`  
**Base URL:** `https://www.hellogorgeousmedspa.com` (use production so Google can fetch your image).

**Body (immediate post):**

```json
{
  "message": "Your caption. Keep pricing and claims accurate; medical evaluation required.",
  "channels": ["google"],
  "link": "https://www.hellogorgeousmedspa.com/book",
  "imageUrl": "https://www.hellogorgeousmedspa.com/images/marketing/your-flyer.png"
}
```

- **`channels`:** any of `"google"`, `"facebook"`, `"instagram"` (array).
- **`link`:** optional. The app **appends this URL into the post text** for Google (Business Profile often rejects separate CTA buttons via API; the link still appears in the update).
- **`imageUrl`:** optional for Google; **required** for Instagram feed posts.
- **`scheduledAt`:** optional ISO 8601 datetime — needs DB + cron configured (see **`app/api/cron/scheduled-social-posts/route.ts`**).

**Example — Google only, text + flyer:**

```bash
curl -sS -X POST "https://www.hellogorgeousmedspa.com/api/social/post" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Headline. Offer details. Oswego, IL.",
    "channels": ["google"],
    "link": "https://www.hellogorgeousmedspa.com/services/your-service",
    "imageUrl": "https://www.hellogorgeousmedspa.com/images/marketing/your-flyer.png"
  }'
```

Success looks like: `"results":{"google":{"ok":true,"id":"accounts/.../localPosts/..."}}`.

---

## After you post

1. **Google:** Business Profile → **Updates** (or Search your business name → Posts).
2. **Facebook / Instagram:** Check the Page / IG app.
3. If something failed, read the **`error`** string in the JSON response; Google sometimes returns extra **`details`** (logged in **`lib/hgos/social-posting.ts`**).

---

## Troubleshooting

| Symptom | What to do |
|--------|------------|
| `"Request contains an invalid argument"` (Google) | Do **not** rely on a separate CTA button from the API. Use **`link`** in the payload (it is merged into the caption) or put the URL **inside `message`**. Avoid `topicType: OFFER` unless you implement the full **`event`** + offer payload per Google’s API. |
| Image post fails | Image URL must return **200** in a browser; use production domain. Prefer PNG/JPG under ~2MB. |
| Instagram fails | You must send **`imageUrl`**. Confirm **`META_INSTAGRAM_BUSINESS_ACCOUNT_ID`** (or alias) + **`META_PAGE_ACCESS_TOKEN`**. |
| `"configured": false` | Set missing env vars in **Vercel** (or host) and redeploy. See **`.env.example`** and **`docs/SOCIAL_POSTING_SETUP.md`**. |

---

## Repo map (for developers)

| Piece | Path |
|--------|------|
| Post API | `app/api/social/post/route.ts` |
| Channel helpers | `lib/hgos/social-posting.ts` |
| Config probe | `GET /api/social/status` |
| Marketing images | `public/images/marketing/` |

---

## Compliance note

Posts are public marketing. Avoid guaranteed outcomes; include **consultation required** where appropriate; keep pricing and financing terms aligned with what the office honors.
