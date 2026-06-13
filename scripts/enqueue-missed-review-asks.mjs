#!/usr/bin/env node
/**
 * One-time: enqueue review asks for recent Square visitors missed by bulk email
 * (accepts_email_marketing=false or order.completed webhook gap).
 *
 * Run: node --env-file=.env.local scripts/enqueue-missed-review-asks.mjs
 * Dry: DRY=1 node --env-file=.env.local scripts/enqueue-missed-review-asks.mjs
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = process.env.DRY === "1";
const LOOKBACK_DAYS = Number(process.env.LOOKBACK_DAYS || 21);

if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

async function getAll(path) {
  let all = [],
    from = 0;
  while (true) {
    const r = await fetch(`${url}/rest/v1/${path}&offset=${from}&limit=1000`, { headers: h });
    const d = await r.json();
    if (!Array.isArray(d) || !d.length) break;
    all = all.concat(d);
    if (d.length < 1000) break;
    from += 1000;
  }
  return all;
}

async function main() {
  const since = new Date(Date.now() - LOOKBACK_DAYS * 86400000).toISOString();
  const asked = new Set(
    (await getAll("review_requests_sent?select=client_id&client_id=not.is.null")).map((r) => r.client_id),
  );
  const pending = new Set(
    (await getAll("review_requests_pending?select=client_id&client_id=not.is.null")).map((r) => r.client_id),
  );

  const clients = await getAll(
    `clients?select=id,first_name,email,phone,last_visit_date,square_customer_id&square_customer_id=not.is.null&last_visit_date=gte.${since}`,
  );

  const missed = clients.filter((c) => {
    if (asked.has(c.id) || pending.has(c.id)) return false;
    const hasContact = (c.email && c.email.trim()) || (c.phone && c.phone.trim());
    return hasContact && c.first_name;
  });

  console.log(`Missed recent visitors (${LOOKBACK_DAYS}d): ${missed.length}`);
  if (DRY) {
    missed.slice(0, 20).forEach((c) =>
      console.log(" ", c.last_visit_date?.slice(0, 10), c.first_name, c.email || c.phone),
    );
    return;
  }

  let queued = 0;
  for (const c of missed) {
    const scheduledFor = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2h — soon, not instant
    const r = await fetch(`${url}/rest/v1/review_requests_pending`, {
      method: "POST",
      headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({
        client_id: c.id,
        appointment_id: null,
        scheduled_for: scheduledFor,
        source: "square_payment",
      }),
    });
    if (r.ok) {
      queued++;
      console.log("✓ queued", c.first_name, c.email || c.phone);
    } else {
      console.log("✗", c.first_name, await r.text());
    }
  }
  console.log(`\nQueued ${queued}/${missed.length}. Hourly cron will SMS + email when due.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
