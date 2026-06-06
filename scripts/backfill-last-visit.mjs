#!/usr/bin/env node
/**
 * Backfill clients.last_visit_date + clients.total_visits from the
 * appointments table (Fresha + native bookings).
 *
 * A "visit" = an appointment in the PAST whose status is not cancelled/
 * no-show/pending (i.e. the client actually came in, or it completed).
 * last_visit_date = most recent such appointment per client.
 *
 * Non-destructive: only sets values; safe to re-run. DRY_RUN=1 to preview.
 */
import fs from "node:fs";
const env = {};
for (const l of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const S = env.NEXT_PUBLIC_SUPABASE_URL, K = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": "application/json" };
const DRY = process.env.DRY_RUN === "1";
const NOW = Date.now();
const SKIP = new Set(["cancelled", "canceled", "no_show", "no-show", "noshow", "pending"]);

// Pull all linked appointments (paged).
const agg = new Map(); // client_id -> { last: ts, count }
for (let from = 0; ; from += 1000) {
  const r = await fetch(
    `${S}/rest/v1/appointments?select=client_id,starts_at,status&client_id=not.is.null&starts_at=not.is.null&limit=1000&offset=${from}`,
    { headers: H }
  );
  const d = await r.json();
  if (!Array.isArray(d) || d.length === 0) break;
  for (const a of d) {
    const ts = new Date(a.starts_at).getTime();
    if (!Number.isFinite(ts) || ts > NOW) continue; // future appts aren't visits
    if (SKIP.has(String(a.status || "").toLowerCase())) continue;
    const cur = agg.get(a.client_id) || { last: 0, count: 0 };
    cur.count++;
    if (ts > cur.last) cur.last = ts;
    agg.set(a.client_id, cur);
  }
  process.stdout.write(`\r   scanned ${from + d.length} appointments...   `);
  if (d.length < 1000) break;
}
console.log(`\nClients with visit history: ${agg.size}.${DRY ? " (DRY RUN)" : ""}`);

let updated = 0;
const entries = [...agg.entries()];
for (const [cid, v] of entries) {
  const patch = {
    last_visit_date: new Date(v.last).toISOString(),
    total_visits: v.count,
    updated_at: new Date().toISOString(),
  };
  if (!DRY) {
    const r = await fetch(`${S}/rest/v1/clients?id=eq.${cid}`, {
      method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(patch),
    });
    if (!r.ok) { console.error("  err", cid, (await r.text()).slice(0, 120)); continue; }
  }
  updated++;
  if (updated % 200 === 0) process.stdout.write(`\r   updated ${updated}/${entries.length}...   `);
}
console.log(`\n✅ ${DRY ? "Would update" : "Updated"} ${updated} clients with last_visit_date + total_visits.`);
