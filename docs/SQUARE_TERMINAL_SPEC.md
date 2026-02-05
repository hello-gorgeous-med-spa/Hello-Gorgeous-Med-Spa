# Square Terminal Integration - Final Spec

## Critical Rules (No Ambiguity)

1. **Webhook signature**: MUST use `await request.text()` BEFORE any JSON parsing. Signature verification requires the raw, unparsed body.

2. **Refund endpoint**: GET = read-only history, POST = process refund. POST is role-protected (staff/admin) and ALWAYS audit logged (who, when, amount, reason).

3. **Devices DELETE**: Removes device from OUR database only. Does NOT unpair in Square (API may not support this). User unpairs via Square Dashboard.

4. **SSE streams**: Streams DB changes written by webhook handler (Supabase Realtime or polling fallback). NEVER polls Square directly from browser.

5. **PHI hard ban**: Never send to Square: patient name, phone, email, DOB, appointment time, provider name, treatment terms. Applies to ALL Square fields: reference_id, note, metadata, description, line items.

6. **Env vars**: ALL Square vars are server-only (no `NEXT_PUBLIC_*`). Only `NEXT_PUBLIC_BASE_URL` is allowed (for UI display).

7. **Webhook URL exact match**: Signature verification must use the exact notification URL configured in Square Dashboard: `${BASE_URL}/api/square/webhook` (no trailing slash mismatches, same scheme/host/path).

8. **Payment ID selection**: On `terminal.checkout.updated` = COMPLETED, obtain payment_id from `payment_ids` array. If multiple IDs exist, select the newest valid payment and log the anomaly.

---

## Environment Variables

```bash
# ============================================================
# SQUARE INTEGRATION - SERVER ENVIRONMENT VARIABLES
# ALL SQUARE VARS ARE SERVER-ONLY (NO NEXT_PUBLIC_*)
# ============================================================

# Application ID (server-only)
SQUARE_APPLICATION_ID=sq0idp-xxxxxxxxxxxxxxxxxxxx

# OAuth credentials (server-only)
SQUARE_OAUTH_CLIENT_ID=sq0idp-xxxxxxxxxxxxxxxxxxxx
SQUARE_OAUTH_CLIENT_SECRET=sq0csp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Token encryption (32 bytes = 64 hex chars)
# Generate with: openssl rand -hex 32
SQUARE_ENCRYPTION_KEY=your64hexcharacterencryptionkey

# Webhook signature verification
SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-signature-key

# Environment toggle
SQUARE_ENVIRONMENT=sandbox

# ============================================================
# BASE URLs
# ============================================================

# Canonical server URL (used for OAuth callbacks, webhook URL)
# This is the source of truth - prevents client tampering
BASE_URL=https://your-domain.com

# Optional: UI display only (can be same as BASE_URL)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

## Revised Spec (Copy-Paste for Dev)

```
SQUARE TERMINAL INTEGRATION - REVISED SPEC
==========================================

1) WEBHOOK IDEMPOTENCY (REQUIRED)
- Verify webhook signature first.
- Primary guard: event_id persisted in square_webhook_events (PK).
- Secondary guards: terminal_checkout_id, payment_id, refund_id.
- Supported events:
  - terminal.checkout.updated  (drives POS modal state)
  - payment.updated           (finalize amounts + status)
  - refund.updated            (refund ledger + invoice state)

2) TOKEN SECURITY
- Encrypt OAuth tokens with SQUARE_ENCRYPTION_KEY using AES-256-GCM.
- Store format: [version:1][iv:16][authTag:16][ciphertext]
- Persist key_version for rotation + backward decryption.
- NEVER expose Square secrets/tokens to browser; NO NEXT_PUBLIC_* Square vars.

3) OAUTH SCOPES (LEAST PRIVILEGE)
- Only what is needed for:
  - Creating Terminal Checkout
  - Creating Orders (generic)
  - Reading Payments + Refunds
  - Listing Devices/Terminals
- Explicitly DO NOT request:
  - CUSTOMERS_*
  - ITEMS_*
  - INVENTORY_*

(Dev: use exact scope constants per Square SDK/docs for Terminal/Devices + Orders + Payments.)

4) PHI COMPLIANCE (HARD BAN)
- Square receives ONLY generic commerce data:
  - Square Order has max 3 line items: "Service", "Product", "Deposit"
  - Aggregated amounts only (no itemization, no treatment names).
- NEVER send these "soft identifiers" to Square:
  - Patient/client name
  - Phone number
  - Email address
  - Date of birth
  - Appointment date/time
  - Provider name
  - Treatment terms or procedure names
  - Any clinical terminology
- These fields must NEVER contain PHI:
  - reference_id
  - note
  - metadata
  - description
  - line item names
  - order comments
- Reference token must be UUID-based (non-sequential), e.g. "Ref: 7f3c…"
- Receipts (if printed/emailed by Square) must remain generic and contain no PHI.

5) TIP FINALIZATION (TIP ON DEVICE)
- Invoice totals are TENTATIVE until Square Payment is fetched.
- On terminal COMPLETED:
  - read payment_id from checkout
  - fetch Payment
  - set tip_amount + total_collected from Payment fields
  - only then mark invoice PAID
- Prevents POS total ≠ collected total mismatch.

6) REAL-TIME UPDATES (POS MODAL)
- SSE endpoint: /api/pos/invoices/[id]/square/events
- SSE streams DB status changes written by webhook handler (no direct Square polling from client).
- Auto-close SSE on final state: COMPLETED / CANCELED / FAILED.
- Heartbeat every 15s; hard timeout after 5 minutes.
```

---

## Dashboard URL Configuration

### OAuth Redirect URL

- **Dashboard Location**: Developer Dashboard → Your App → OAuth → Redirect URLs
- **Sandbox URL**: `{{BASE_URL}}/api/square/oauth/callback`
- **Production URL**: `https://your-domain.com/api/square/oauth/callback`

### Webhook Notification URL

- **Dashboard Location**: Developer Dashboard → Your App → Webhooks → Subscriptions
- **Sandbox URL**: `{{BASE_URL}}/api/square/webhook`
- **Production URL**: `https://your-domain.com/api/square/webhook`

### Required Webhook Events (select these in Dashboard)

- `terminal.checkout.updated`
- `payment.updated`
- `refund.updated`

---

## Sandbox Setup Checklist

### 1. Developer Dashboard → OAuth

- Open your Square app in the Developer Dashboard
- Go to OAuth settings
- Add Redirect URL: `{{BASE_URL}}/api/square/oauth/callback`
- Confirm using Sandbox credentials in .env

### 2. Developer Dashboard → Webhooks

- Go to Webhooks in Developer Dashboard
- Create Webhook Subscription (Sandbox)
- Set Notification URL: `{{BASE_URL}}/api/square/webhook`
- Select events:
  - `terminal.checkout.updated`
  - `payment.updated`
  - `refund.updated`
- Save

### 3. Copy Keys to Env Vars

From Dashboard:
- OAuth page → `SQUARE_OAUTH_CLIENT_ID`, `SQUARE_OAUTH_CLIENT_SECRET`
- Webhooks page → `SQUARE_WEBHOOK_SIGNATURE_KEY`

### 4. Run Validation Tests

1. **OAuth connect test**: Connect Square → confirm DB stores encrypted tokens
2. **Terminal charge test**: Create checkout → device prompts tip → status COMPLETED
3. **Webhook delivery test**: Confirm signature validation passes for all 3 event types

---

## Production Setup Checklist

### 1. Switch Env Vars

```bash
SQUARE_ENVIRONMENT=production
SQUARE_OAUTH_CLIENT_ID=<production-id>
SQUARE_OAUTH_CLIENT_SECRET=<production-secret>
SQUARE_WEBHOOK_SIGNATURE_KEY=<production-key>
BASE_URL=https://your-real-domain.com
```

### 2. Dashboard → OAuth (Production)

Add Production redirect URL:
```
https://your-real-domain.com/api/square/oauth/callback
```

### 3. Dashboard → Webhooks (Production)

Create Production webhook subscription:
- Notification URL: `https://your-real-domain.com/api/square/webhook`
- Events: `terminal.checkout.updated`, `payment.updated`, `refund.updated`

### 4. Production Smoke Test

Run a $1 live test:
- Verify tip on device
- Verify webhook signature validation
- Verify invoice finalization pulls tip + totals from Payment

---

## Route Map

```
app/api/
├── square/
│   ├── oauth/
│   │   ├── start/route.ts       # GET  → Initiate OAuth
│   │   └── callback/route.ts    # GET  → Handle callback
│   ├── webhook/route.ts         # POST → Signature verify (raw body!) → process events
│   ├── health/route.ts          # GET  → Health check
│   ├── connection/route.ts      # GET/DELETE → Status, disconnect
│   ├── locations/route.ts       # GET  → List locations
│   ├── devices/route.ts         # GET  → List paired devices
│   │                            # POST → Create pairing code (if Square supports)
│   ├── devices/[id]/route.ts    # PATCH  → Set default, rename
│   │                            # DELETE → Remove from OUR DB only (not Square unpair)
│   ├── settings/route.ts        # GET/POST → Connection settings
│   └── test-ping/route.ts       # POST → Test terminal
│
└── pos/invoices/
    ├── route.ts                 # GET/POST → List/create invoices
    └── [id]/square/
        ├── start-terminal-charge/route.ts  # POST → Start checkout (PHI-safe)
        ├── terminal-status/route.ts        # GET  → Poll status (legacy)
        ├── events/route.ts                 # GET  → SSE stream (Realtime, no Square poll)
        ├── cancel/route.ts                 # POST → Cancel checkout
        └── refund/route.ts                 # GET  → Refund history (read-only)
                                            # POST → Process refund (ROLE-PROTECTED + AUDIT)
```

### Critical Implementation Notes

1. **Webhook signature**: Must use `await request.text()` BEFORE `JSON.parse()`. Signature verification requires raw body.

2. **Devices DELETE**: Square API may not support "unpair" via API. Our DELETE endpoint removes device from our DB only - it does NOT unpair in Square. User must unpair via Square Dashboard if needed.

3. **Refund POST**: Role-protected (requires authenticated staff/admin). All refunds are audit logged with: who, when, amount, reason.

4. **SSE endpoint**: Streams DB changes written by webhook handler. Uses Supabase Realtime (or polling fallback). NEVER polls Square directly from browser.

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `square_connections` | OAuth tokens (encrypted), merchant/location selection |
| `square_devices` | Paired Terminal devices |
| `square_webhook_events` | Idempotency guard (event_id PK) |
| `terminal_checkouts` | In-progress checkout tracking |
| `sales` | Invoice/sale records |
| `sale_payments` | Payment records (linked to Square) |
| `refunds` | Refund audit trail |
| `audit_log` | Compliance logging |

---

## Acceptance Checklist

- [ ] Webhook verifies signature using raw body + BASE_URL/api/square/webhook
- [ ] Webhook idempotency: event_id insert first, duplicates short-circuit 200
- [ ] Tip-on-device: on COMPLETED, fetch Payment and finalize totals from Payment
- [ ] SSE streams updates reliably (Supabase Realtime or equivalent) + heartbeats + immediate final-state close
- [ ] PHI tests pass: Square payload contains only generic items + UUID ref, no identifiers
- [ ] Refund POST is role-protected + audit logged
