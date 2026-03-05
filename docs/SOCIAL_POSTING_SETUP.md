# Social posting setup — Facebook, Instagram, Google

This guide walks you through the steps to connect **Post to social** (Admin → Marketing → Post to social) so you can publish to Facebook, Instagram, and Google Business from one place.

---

## Part 1: Facebook (and optionally Instagram)

You need a **Meta for Developers** app, a **Page access token**, and (for Instagram) your **Instagram Business Account ID**.

### Step 1: Create a Meta app

1. Go to **[developers.facebook.com](https://developers.facebook.com)** and log in.
2. Click **My Apps** → **Create App**.
3. Choose **Business** (or **Other** if you prefer).
4. Name it (e.g. “Hello Gorgeous Social”) and create the app.

### Step 2: Add permissions to the app

1. In your app dashboard, go to **App Review** → **Permissions and Features** (or **Use cases** in newer UI).
2. Request these permissions (you may need to add them under “Add permission” or in your use case):
   - **pages_show_list** — so you can see your Page
   - **pages_manage_posts** — required to create posts
   - **pages_read_engagement** — often required with manage_posts

   For **Instagram** posting you may also need (if your app uses “Instagram Content Publishing”):
   - **instagram_basic**
   - **instagram_content_publish**

   In development/test mode, these work for your own accounts without full App Review. For production (other people’s Pages), Meta may require App Review.

### Step 3: Get a Page access token

1. Open **[Graph API Explorer](https://developers.facebook.com/tools/explorer)**.
2. In the top dropdown, **select your app** (the one you just created).
3. Under “User or Page”, make sure you’re logged in as a user who **admins** your Hello Gorgeous Facebook Page.
4. Click **Add a permission** and add:
   - `pages_show_list`
   - `pages_manage_posts`
   - `pages_read_engagement`
5. Click **Generate Access Token** and approve the prompts.
6. You now have a **User** token. To get a **Page** token:
   - In the “User or Page” dropdown (next to the token), switch to **your Page name** (Hello Gorgeous).  
   - Or call: `GET /me/accounts` in the Explorer; in the response, find your Page and copy its `access_token`.
7. Copy that **Page access token** — this is what you’ll put in `META_PAGE_ACCESS_TOKEN`.

**Tip:** Page tokens can be long‑lived. If you need a long‑lived token, use the “Exchange” step in the docs or a tool that exchanges short‑lived for long‑lived tokens.

### Step 4: Get your Facebook Page ID

1. In Graph API Explorer, with your **Page** token selected, run:  
   **GET** `me`  
   or **GET** `me?fields=id,name`.
2. The `id` in the response is your **Page ID** → use it for `META_PAGE_ID`.

(You can also find it in Page Settings → About on Facebook, or in the Page URL.)

### Step 5: (Optional) Get Instagram Business Account ID

Only needed if you want to **post to Instagram** from the app.

1. Your Instagram account must be a **Business** or **Creator** account linked to your **Facebook Page** (done in Meta Business Suite or Facebook Page settings → Instagram).
2. In Graph API Explorer, with your **Page** token, run:  
   **GET** `me?fields=instagram_business_account`.
3. In the response, use `instagram_business_account.id` → that’s `META_INSTAGRAM_BUSINESS_ACCOUNT_ID`.

If the field is empty, link your IG account to the Page first in Meta Business Suite.

### Step 6: Add env vars (Facebook + Instagram)

In Vercel (or your host) or `.env.local`, add:

```bash
META_PAGE_ID=your_page_id_here
META_PAGE_ACCESS_TOKEN=your_page_access_token_here
# Only for Instagram posting:
META_INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_business_account_id_here
```

Redeploy if you use Vercel. Then try **Post to social** with “Post to Facebook” (and optionally “Post to Instagram” with an image URL).

---

## Part 2: Google Business Profile (Google)

Posting to Google Business requires the **Google Business Profile API** (formerly My Business), OAuth, and your **account** and **location** IDs. The app’s Google path is still a stub: we have the wiring for “which channels to post to,” but actually calling Google’s API needs OAuth and IDs in place.

### Step 1: Google Cloud project and API

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**.
2. Create a project (or pick one) and open it.
3. Go to **APIs & Services** → **Library**.
4. Search for **“Google My Business API”** or **“Business Profile API”** and **enable** it.  
   (You may see **My Business Business Information API** and **My Business Account Management API** — enable the ones required for “local posts” or “posts” in the docs.)
5. Stay in **APIs & Services** → **Credentials**.

### Step 2: OAuth consent screen

1. Go to **OAuth consent screen**.
2. Choose **External** (unless you use a Workspace).
3. Fill in App name (e.g. “Hello Gorgeous”), support email, developer contact.
4. Add the scope:  
   `https://www.googleapis.com/auth/business.manage`  
   (Scopes → Add → paste that scope.)
5. Save. Add test users if the app is in “Testing” (your Google account that owns the Business Profile).

### Step 3: OAuth client ID

1. **Credentials** → **Create credentials** → **OAuth client ID**.
2. Application type: **Web application** (or **Desktop** for local testing).
3. If Web: add **Authorized redirect URIs** (e.g. your app’s callback URL for OAuth).
4. Create and copy the **Client ID** and **Client Secret** — you’ll need these to implement the OAuth flow that gets a refresh token for “post on behalf of the business.”

### Step 4: Get account ID and location ID

Google’s APIs use:

- **Account ID** — the top-level “account” that owns the location(s).
- **Location ID** — the specific location (e.g. Hello Gorgeous’s GBP listing).

Ways to get them:

- **Account Management API:** list accounts for the authenticated user → you get account IDs.
- **Business Information API:** list locations for an account → you get location IDs.

Format is usually: `accounts/{accountId}/locations/{locationId}`.

Until we add the full OAuth flow and API calls in the app, you can:

1. Use the [Google Business Profile API docs](https://developers.google.com/my-business/content/posts-data) to see the exact endpoints for creating posts.
2. Store in env (for when we wire it):  
   `GOOGLE_BUSINESS_ACCOUNT_ID` and `GOOGLE_BUSINESS_LOCATION_ID`.

### Step 5: What’s implemented in the app today

- **Post to social** UI and scheduling work for **Facebook** and **Instagram** once the Meta env vars are set.
- **Google** is stubbed: the UI lets you choose “Google Business,” but the backend returns “not configured” until we add:
  - An OAuth flow (or service account) that can act on behalf of the business.
  - Calls to the Business Profile (or My Business) API to create a local post using your account and location IDs.

So for **Google**, the “steps you need to do” are: create the Cloud project, enable the API, set up OAuth and get account/location IDs. After that, we can wire the app to actually create posts (next phase).

---

## Quick reference: env vars

| Variable | Where it comes from |
|----------|----------------------|
| `META_PAGE_ID` | Graph API Explorer: **GET** `me` with Page token → `id` |
| `META_PAGE_ACCESS_TOKEN` | Graph API Explorer: Page token (from User token → **GET** `me/accounts` or “User or Page” dropdown) |
| `META_INSTAGRAM_BUSINESS_ACCOUNT_ID` | Graph API Explorer: **GET** `me?fields=instagram_business_account` with Page token → `instagram_business_account.id` |
| `GOOGLE_BUSINESS_ACCOUNT_ID` | From Google Business Profile / Account Management API (for future use) |
| `GOOGLE_BUSINESS_LOCATION_ID` | From Google Business Profile / Business Information API (for future use) |

---

## Troubleshooting

- **“META_PAGE_ID and META_PAGE_ACCESS_TOKEN required”**  
  Add both env vars and redeploy. The token must be a **Page** access token, not a User token.

- **Facebook post works but Instagram doesn’t**  
  Instagram requires an **image URL** for each post. Also confirm `META_INSTAGRAM_BUSINESS_ACCOUNT_ID` is set and that the Page is linked to an Instagram Business/Creator account.

- **Token expired**  
  Page tokens can be long‑lived; if yours expires, generate a new one in Graph API Explorer (with Page selected) and update `META_PAGE_ACCESS_TOKEN`.

- **Google: “not configured” or “OAuth not yet wired”**  
  Expected until we add the OAuth flow and post-creation calls. Use the steps above to prepare the Cloud project and IDs for when that’s built.

If you want, we can next add a small “Test connection” button on the Post to social page that checks Meta env vars and maybe calls `me` to confirm the token works.
