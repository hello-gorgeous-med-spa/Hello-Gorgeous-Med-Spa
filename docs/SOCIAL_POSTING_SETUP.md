# Marketing setup — Facebook, Square, Google My Business

This guide covers the three main channels you use: **Facebook**, **Square** (email marketing), and **Google My Business**. **Instagram** is optional and can be connected later. The **Post to social** page (Admin → Marketing → Post to social) lets you publish one post to Facebook, Google, and/or Instagram from one place; Square is used separately for email campaigns.

---

## Part 1: Facebook

You need a **Meta for Developers** app and a **Page access token** so the app can post to your Facebook Page.

### Step 1: Create a Meta app

1. Go to **[developers.facebook.com](https://developers.facebook.com)** and log in.
2. Click **My Apps** → **Create App**.
3. Choose **Business** (or **Other** if you prefer).
4. Name it (e.g. “Hello Gorgeous Social”) and create the app.

### Step 2: Add permissions

1. In your app dashboard, go to **App Review** → **Permissions and Features** (or **Use cases**).
2. Add these permissions:
   - **pages_show_list**
   - **pages_manage_posts**
   - **pages_read_engagement**

(For Instagram later: **instagram_basic** and **instagram_content_publish**.)

### Step 3: Get a Page access token

1. Open **[Graph API Explorer](https://developers.facebook.com/tools/explorer)**.
2. Select your app in the top dropdown.
3. Add permissions: `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`.
4. Click **Generate Access Token** and approve.
5. In the **“User or Page”** dropdown, switch to **your Page name** (Hello Gorgeous). The token shown is your **Page** token. Copy it → `META_PAGE_ACCESS_TOKEN`.
   - Or run **GET** `me/accounts` and copy the `access_token` for your Page.

### Step 4: Get your Facebook Page ID

In Graph API Explorer, with the **Page** token selected, run **GET** `me`. The `id` in the response is `META_PAGE_ID`.

### Step 5: Env vars for Facebook

In Vercel (or your host) add:

```bash
META_PAGE_ID=your_page_id
META_PAGE_ACCESS_TOKEN=your_page_access_token
```

Redeploy. Then use **Post to social** and check **Facebook** to post.

**Instagram (optional):** When you’re ready, link your Instagram Business account to your Facebook Page in Meta Business Suite, then in Graph API Explorer run **GET** `me?fields=instagram_business_account` with the Page token. Use that `id` as `META_INSTAGRAM_BUSINESS_ACCOUNT_ID`. Leave it unset until then.

---

## Part 2: Square (email marketing)

**Square** is where your **~2,700 contacts** live and where you send **email campaigns**. The app does **not** post to Square from the “Post to social” page; Square is used for email, not social posts.

**What to do:**

1. Use **Admin → Marketing** for quick links:
   - **Square Dashboard** — [squareup.com/dashboard](https://squareup.com/dashboard)
   - **Customers (~2,700)** — [squareup.com/dashboard/customers](https://squareup.com/dashboard/customers)
   - **Marketing & Loyalty** — [squareup.com/dashboard/marketing](https://squareup.com/dashboard/marketing)
2. Create and send **email campaigns** from the Square Marketing dashboard (one campaign per week is a good target).
3. Use the same **message and offers** you post on Facebook and Google (e.g. Glow Event, book link) so your email and social stay aligned.

No env vars are required in the app for Square; you log in to Square in the browser. The 5 Agents Runbook (Admin → Marketing → 5 Agents Runbook) ties together Facebook, Square email, and Google posts into a weekly checklist.

---

## Part 3: Google My Business

The app **posts to your Google Business Profile** (Search & Maps) using the [Google My Business API v4](https://developers.google.com/my-business/content/posts-data). You need a **Google Cloud project**, **OAuth credentials**, a **refresh token**, and your **account** and **location** IDs.

### Step 1: Google Cloud project and API

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**.
2. Create a project (e.g. “Hello Gorgeous Social”) and open it.
3. **APIs & Services** → **Library** → enable **Google My Business API** (the one that supports local posts).
4. If you see **My Business Account Management** or **My Business Business Information**, enable those too (needed to list accounts and locations).

### Step 2: OAuth consent screen

1. **APIs & Services** → **OAuth consent screen**.
2. Choose **External**. App name (e.g. “Hello Gorgeous”), support email, developer contact.
3. **Scopes** → Add: `https://www.googleapis.com/auth/business.manage` → Save.
4. If the app is in **Testing**, add your Google account (the one that owns the Business Profile) as a test user.

### Step 3: OAuth client and refresh token

1. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
2. Application type: **Web application** (or **Desktop app** for a one-off token).
3. If Web: add **Authorized redirect URI** — you can use `https://developers.google.com/oauthplayground` for the next step.
4. Create and copy **Client ID** and **Client Secret** → these are `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

**Get a refresh token (one-time):**

1. Go to **[OAuth 2.0 Playground](https://developers.google.com/oauthplayground)**.
2. Click the gear icon — check **“Use your own OAuth credentials”** and enter your Client ID and Client Secret.
3. In Step 1, add the scope: `https://www.googleapis.com/auth/business.manage` → **Authorize APIs** → sign in with the Google account that **owns** your Business Profile.
4. In Step 2 click **Exchange authorization code for tokens**. Copy the **Refresh token** → `GOOGLE_REFRESH_TOKEN`.

### Step 4: Get account ID and location ID

Use an access token (from the Playground or any OAuth tool) with the same account:

1. **List accounts:**  
   `GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts`  
   Header: `Authorization: Bearer YOUR_ACCESS_TOKEN`  
   From the response, take the **name** (e.g. `accounts/1234567890`) → the numeric part is `GOOGLE_BUSINESS_ACCOUNT_ID`.

2. **List locations:**  
   `GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations`  
   Use the account ID from step 1. Find your Hello Gorgeous location; **name** is like `accounts/123/locations/456` → the location part (e.g. `456`) is `GOOGLE_BUSINESS_LOCATION_ID`.

### Step 5: Env vars for Google

In Vercel (or your host) add:

```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_BUSINESS_ACCOUNT_ID=your_account_id
GOOGLE_BUSINESS_LOCATION_ID=your_location_id
```

Redeploy. In **Post to social**, check **Google Business** and post. The app will create a local post (summary + optional link as BOOK button + optional image).

---

## Quick reference: env vars

| Channel | Variable | Where it comes from |
|---------|----------|---------------------|
| **Facebook** | `META_PAGE_ID` | Graph API Explorer: **GET** `me` with Page token → `id` |
| **Facebook** | `META_PAGE_ACCESS_TOKEN` | Graph API Explorer: Page token (from “User or Page” dropdown or **GET** `me/accounts`) |
| **Instagram** (optional) | `META_INSTAGRAM_BUSINESS_ACCOUNT_ID` | **GET** `me?fields=instagram_business_account` with Page token; set when you connect IG |
| **Square** | — | No env vars; use Square dashboard links from Admin → Marketing |
| **Google** | `GOOGLE_CLIENT_ID` | Google Cloud Console → OAuth client |
| **Google** | `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth client |
| **Google** | `GOOGLE_REFRESH_TOKEN` | OAuth 2.0 Playground (scope `business.manage`) |
| **Google** | `GOOGLE_BUSINESS_ACCOUNT_ID` | Account Management API → list accounts |
| **Google** | `GOOGLE_BUSINESS_LOCATION_ID` | Business Information API → list locations |

---

## Troubleshooting

- **Facebook: “META_PAGE_ID and META_PAGE_ACCESS_TOKEN required”**  
  Add both env vars and redeploy. Use a **Page** access token, not a User token.

- **Facebook: Token expired**  
  In Graph API Explorer, select your Page and copy a new token; update `META_PAGE_ACCESS_TOKEN`.

- **Instagram**  
  Not connected yet is fine. When you connect, add `META_INSTAGRAM_BUSINESS_ACCOUNT_ID` and use an **image URL** for each Instagram post.

- **Square**  
  No setup in the app; use the Square Marketing dashboard. Links are on Admin → Marketing.

- **Google: “not configured”**  
  Set all five env vars. Get the refresh token from [OAuth 2.0 Playground](https://developers.google.com/oauthplayground) with scope `https://www.googleapis.com/auth/business.manage`.

- **Google: 403 or invalid_grant**  
  Refresh token may be expired or revoked. In the Playground, authorize again (with consent) and exchange for a new refresh token; update `GOOGLE_REFRESH_TOKEN`.
