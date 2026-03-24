# Twilio error 20003 — authentication failure (Vercel / env fix)

**Error 20003** means Twilio rejected the **credentials on the API request** (wrong or missing). The Twilio account can still be approved and verified — this is almost always a **configuration mistake** in how the app authenticates (e.g. Vercel env vars), not an account suspension.

Use this checklist when debugging (e.g. for Anthony or whoever maintains deploy config).

---

## 1. Check credentials in Vercel

**Vercel** → your project → **Settings** → **Environment Variables**

Confirm all three exist, have **no extra spaces** or quotes, and match Twilio exactly:

| Variable | What it must look like |
|----------|-------------------------|
| `TWILIO_ACCOUNT_SID` | Starts with **`AC`** |
| `TWILIO_AUTH_TOKEN` | **32-character** string (Twilio’s primary auth token) |
| `TWILIO_PHONE_NUMBER` | **E.164**, e.g. `+16306366193` |

---

## 2. Use Account SID — not API Key SID

**Common mistake:** using an **API Key** value instead of the **Account SID**.

- **Account SID** → starts with **`AC`** → this is what REST API basic auth expects alongside the **Auth Token**.
- **API Key SID** → starts with **`SK`** → not a drop-in replacement for `TWILIO_ACCOUNT_SID` in our standard Twilio REST setup.

If `TWILIO_ACCOUNT_SID` starts with `SK`, fix it to the **Account SID** from Twilio Console → **Account** → **Account Info**.

---

## 3. Auth token must be current

In **Twilio Console** → **Account** → **API keys & tokens**:

- If the **Auth Token** was **rotated or regenerated**, any old value in Vercel is **invalid**.
- Copy the **current** Auth Token from the console and update **`TWILIO_AUTH_TOKEN`** in Vercel.

---

## 4. Redeploy after changing env vars

**Vercel does not apply new or edited environment variables to already-built deployments** until you **redeploy**.

After updating any Twilio-related variable:

- Trigger a new deployment (e.g. **Deployments** → **⋯** on latest → **Redeploy**, or push a commit), **or**
- Use **Redeploy** from the latest production deployment.

Skipping this step is a very common reason fixes “don’t work.”

---

## Quick copy for messaging (e.g. Slack to Anthony)

> Twilio **20003** = **authentication failed** on the API call (bad/missing credentials), not necessarily a broken Twilio account.  
> Please: (1) In **Vercel → Environment Variables**, verify **`TWILIO_ACCOUNT_SID`** (starts with **AC**), **`TWILIO_AUTH_TOKEN`** (32 chars, fresh from console if token was ever rotated), and **`TWILIO_PHONE_NUMBER`** (E.164). (2) **Do not** use an API Key SID (**SK**) as the Account SID. (3) After any env change, **redeploy** the project so the new values load.

---

## Related

- [TWILIO_MARKETING.md](./TWILIO_MARKETING.md) — variable names and where SMS is used in the app.
