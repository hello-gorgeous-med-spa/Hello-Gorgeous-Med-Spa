# Hub + Square — one connection for POS, Terminal, and Command Center

The Hub “Sync Square month-to-date” button calls **`GET /api/hub/square-summary`**. It uses the **same Square access** as the rest of the app whenever possible.

## Recommended setup (single source of truth)

1. **Admin → Settings → Payments**  
   Open: `https://www.hellogorgeousmedspa.com/admin/settings/payments` (sign in as staff/owner).

2. **Connect Square**  
   Click **Connect Square Account** and finish OAuth. Tokens are stored encrypted in Supabase (`square_connections`).

3. **Environment**  
   - `SQUARE_ENVIRONMENT=production` for live.  
   - `SQUARE_OAUTH_CLIENT_ID` and `SQUARE_OAUTH_CLIENT_SECRET` must be set (Vercel, server-only).  
   - `SQUARE_ENCRYPTION_KEY` must be set (32-byte hex) so tokens can be stored and read.

4. **Hub**  
   Sign in to **Hub** (`/hub` or `hub.…`). Click **Sync Square month-to-date** (React Hub) or **Settings → Sync now** (classic Command Center).

You should see **month-to-date completed payments** roll into the shared Hub state without maintaining a separate Square token for Hub.

## Fallback (legacy / dev only)

If **no OAuth row** exists, the route uses **`SQUARE_ACCESS_TOKEN`** from Vercel. The API returns a **`warning`** telling you to switch to OAuth. Use this only temporarily — POS, webhooks, and Terminal are happier with OAuth.

## Troubleshooting

| Symptom | What to check |
|--------|----------------|
| Empty list, no error | Normal if no completed card payments MTD in Square. |
| `Square is not connected` | Run Connect Square in Admin, or set `SQUARE_ACCESS_TOKEN`. |
| `401` / unauthorized from Square | Token revoked or wrong environment (sandbox vs production). Reconnect OAuth. |
| Hub returns `401` | Hub password gate: sign in at `/hub/login`. |
| Supabase errors | `SUPABASE_SERVICE_ROLE_KEY` and DB migrations for `square_connections`. |

## After you move booking to Square

Optional next steps: webhook or scheduled job to **cache** appointment counts, or deep links from Hub to **Square Dashboard → Appointments**. The payments sync above is the first “all in one place” slice.
