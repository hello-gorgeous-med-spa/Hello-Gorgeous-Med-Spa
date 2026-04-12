/**
 * Plaid Sandbox connection test
 * Run: node --env-file=.env.local scripts/test-plaid.mjs
 */

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// ── 1. Check env vars ─────────────────────────────────────────────────────────
const clientId = process.env.PLAID_CLIENT_ID;
const secret   = process.env.PLAID_SECRET;
const env      = (process.env.PLAID_ENV || "sandbox").toLowerCase();

console.log("\n=== Plaid Setup Check ===\n");
console.log(`PLAID_ENV        : ${env}`);
console.log(`PLAID_CLIENT_ID  : ${clientId  ? `✓ set (${clientId.slice(0, 6)}…)`  : "✗ MISSING"}`);
console.log(`PLAID_SECRET     : ${secret    ? `✓ set (${secret.slice(0, 6)}…)`    : "✗ MISSING"}`);

if (!clientId || !secret) {
  console.error(`
┌─────────────────────────────────────────────────────────────┐
│  PLAID_CLIENT_ID and/or PLAID_SECRET are not set.           │
│                                                             │
│  1. Go to https://dashboard.plaid.com                       │
│  2. Create an account / log in                              │
│  3. In Team Settings → Keys, copy:                          │
│       client_id  →  PLAID_CLIENT_ID                         │
│       Sandbox secret  →  PLAID_SECRET                       │
│  4. Add to .env.local:                                      │
│       PLAID_CLIENT_ID=your_client_id                        │
│       PLAID_SECRET=your_sandbox_secret                      │
│       PLAID_ENV=sandbox                                     │
│  5. Re-run this script.                                     │
└─────────────────────────────────────────────────────────────┘
`);
  process.exit(1);
}

// ── 2. Build client ───────────────────────────────────────────────────────────
const configuration = new Configuration({
  basePath: PlaidEnvironments[env] ?? PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": clientId,
      "PLAID-SECRET":    secret,
    },
  },
});

const plaid = new PlaidApi(configuration);

// ── 3. Create a link token ────────────────────────────────────────────────────
console.log("\n→ Calling /link/token/create on Plaid Sandbox…");

try {
  const response = await plaid.linkTokenCreate({
    user:         { client_user_id: "test-user-001" },
    client_name:  "Hello Gorgeous Med Spa (test)",
    products:     ["transactions"],
    country_codes: ["US"],
    language:     "en",
  });

  const { link_token, expiration, request_id } = response.data;

  console.log(`
✅  Plaid Sandbox is working!

  link_token  : ${link_token.slice(0, 40)}…
  expiration  : ${expiration}
  request_id  : ${request_id}

Everything is set up correctly.
`);
} catch (err) {
  const status  = err.response?.status;
  const body    = err.response?.data ?? err.message;
  const errCode = body?.error_code ?? "unknown";
  const errMsg  = body?.error_message ?? String(body);

  console.error(`
❌  Plaid API call failed (HTTP ${status ?? "?"}, ${errCode})
    ${errMsg}
`);

  if (errCode === "INVALID_API_KEYS") {
    console.error("   → Check that PLAID_CLIENT_ID and PLAID_SECRET are correct for the Sandbox environment.");
  }
  if (status === 401) {
    console.error("   → Make sure you are using the Sandbox secret (not Production) while PLAID_ENV=sandbox.");
  }

  process.exit(1);
}
