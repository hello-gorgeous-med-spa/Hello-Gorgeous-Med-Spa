#!/usr/bin/env node
/**
 * Test the Win-Back Agent (dry run — no real SMS sent)
 * Run: node --env-file=.env.local scripts/test-winback-agent.mjs
 */

const SQUARE_API_VERSION = "2025-04-16";

function getSquareBaseUrl() {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

async function squareFetch(path) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN not set");

  const res = await fetch(`${getSquareBaseUrl()}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Square API ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

async function main() {
  console.log("🤖 Win-Back Agent — DRY RUN TEST\n");

  // 1. Find the lapsed group
  console.log("1. Looking for 'HG Lapsed (90+ Days)' group in Square...");
  const groupsData = await squareFetch("/v2/customers/groups?limit=50");
  const lapsedGroup = groupsData.groups?.find(
    (g) => g.name === "HG Lapsed (90+ Days)"
  );

  if (!lapsedGroup) {
    console.log("   ✗ Group not found. Run sync-square-segments.mjs first.");
    return;
  }
  console.log(`   ✓ Found group: ${lapsedGroup.id}\n`);

  // 2. Get customers in that group with phone numbers
  console.log("2. Fetching lapsed customers with phone numbers...");
  const customers = [];
  let cursor;

  do {
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);

    const data = await squareFetch(`/v2/customers?${qs.toString()}`);
    if (data.customers) {
      for (const c of data.customers) {
        if (c.group_ids?.includes(lapsedGroup.id) && c.phone_number) {
          customers.push(c);
        }
      }
    }
    cursor = data.cursor;
  } while (cursor && customers.length < 500);

  console.log(`   ✓ Found ${customers.length} lapsed customers with phones\n`);

  // 3. Show sample
  console.log("3. Sample of who would be contacted (first 10):\n");
  const sample = customers.slice(0, 10);
  for (const c of sample) {
    const name = c.given_name || "Friend";
    const phone = c.phone_number;
    const message = `${name}, it's been a while! 💕 We'd love to see you — enjoy $25 off your next visit at Hello Gorgeous. Book before it expires: hellogorgeousmedspa.com/book`;
    console.log(`   📱 ${name} (${phone})`);
    console.log(`      "${message.slice(0, 80)}..."\n`);
  }

  // 4. Summary
  console.log("═".repeat(60));
  console.log("SUMMARY");
  console.log("═".repeat(60));
  console.log(`Total lapsed with phone: ${customers.length}`);
  console.log(`Would contact (max 50/run): ${Math.min(customers.length, 50)}`);
  console.log(`Estimated SMS cost: ~$${(Math.min(customers.length, 50) * 0.0079).toFixed(2)} (Twilio rate)`);
  console.log("");
  console.log("To enable the agent:");
  console.log("  1. Set WINBACK_AGENT_ENABLED=true in Vercel");
  console.log("  2. Redeploy");
  console.log("  3. Agent runs every Monday at 10 AM Central");
  console.log("");
  console.log("Or test manually:");
  console.log('  curl -H "Authorization: Bearer YOUR_CRON_SECRET" \\');
  console.log('    "https://www.hellogorgeousmedspa.com/api/agents/winback?dry=1"');
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
