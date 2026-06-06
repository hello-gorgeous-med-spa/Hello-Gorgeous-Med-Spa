#!/usr/bin/env node
/**
 * Export Fresha client list WITH contact info (authenticated, one-time).
 *
 * Output: fresha_clients_export.csv
 * Columns: fresha_client_id,first_name,last_name,email,phone,last_visit,
 *          total_visits,total_spent,accepts_email,accepts_sms
 *
 * Same session-capture approach as the reviews exporter:
 *   1. Open a real browser; you log into Fresha once (auto-detected).
 *   2. Open the Clients list.
 *   3. Passively capture every JSON network response and harvest objects
 *      that look like clients (a name + an email or phone).
 *   4. Scroll/paginate the list to force Fresha to load every page.
 *   5. Merge + dedupe (by fresha id, else email, else phone), write CSV.
 *
 * Then import with: node scripts/import-fresha-clients.mjs
 *
 * NOTE: Fresha also has a built-in client CSV export (Clients → ⋯ → Export).
 * If this scrape comes back thin on emails/phones, use that official export
 * and run the importer on the downloaded file — it accepts the same columns.
 */

import fs from "fs";
import { chromium } from "playwright";

const OUTPUT = "fresha_clients_export.csv";
const SESSION_FILE = ".playwright-fresha-session.json";
const CLIENT_URLS = [
  "https://partners.fresha.com/clients",
  "https://partners.fresha.com/clients-list",
];

const digits = (v) => String(v ?? "").replace(/[^\d+]/g, "");
const isEmail = (v) => typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());

function harvestClients(node, out, depth = 0) {
  if (!node || depth > 9) return;
  if (Array.isArray(node)) {
    for (const item of node) harvestClients(item, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;

  const keys = Object.keys(node);
  const lower = Object.fromEntries(keys.map((k) => [k.toLowerCase(), k]));
  const pick = (...names) => {
    for (const n of names) if (lower[n] != null && node[lower[n]] != null) return node[lower[n]];
    return null;
  };

  const email = pick("email", "emailaddress", "email_address");
  let phone = pick("phone", "mobile", "phonenumber", "mobilenumber", "phone_number", "cell");
  if (phone && typeof phone === "object") phone = phone.number || phone.value || null;
  const first = pick("firstname", "first_name", "givenname");
  const last = pick("lastname", "last_name", "surname", "familyname");
  const full = pick("fullname", "full_name", "name", "displayname");

  const hasName = first || last || full;
  const hasContact = isEmail(email) || (phone && digits(phone).length >= 7);

  if (hasName && hasContact) {
    out.push({
      fresha_client_id: pick("id", "clientid", "client_id", "uuid", "externalid") ?? null,
      first_name: first || (full ? String(full).trim().split(/\s+/)[0] : null),
      last_name: last || (full ? String(full).trim().split(/\s+/).slice(1).join(" ") || null : null),
      email: isEmail(email) ? String(email).trim().toLowerCase() : null,
      phone: phone ? digits(phone) : null,
      last_visit: pick("lastvisit", "last_visit", "lastappointment", "lastvisitdate", "lastseen") ?? null,
      total_visits: pick("totalvisits", "visits", "appointmentcount", "bookingscount") ?? null,
      total_spent: pick("totalspent", "lifetimevalue", "totalsales", "totalvalue") ?? null,
      accepts_email: pick("acceptsemailmarketing", "emailmarketing", "marketingemail", "emailoptin") ?? null,
      accepts_sms: pick("acceptssmsmarketing", "smsmarketing", "marketingsms", "smsoptin") ?? null,
    });
  }

  for (const k of keys) {
    const val = node[k];
    if (val && typeof val === "object") harvestClients(val, out, depth + 1);
  }
}

async function gotoClients(page) {
  for (const url of CLIENT_URLS) {
    await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(1500);
    if (!/login|sign|auth/i.test(page.url())) return;
  }
}

async function run() {
  console.log("\nExport Fresha CLIENT LIST with contact info (one-time).\n");

  const browser = await chromium.launch({ headless: false });
  const context = fs.existsSync(SESSION_FILE)
    ? await browser.newContext({ storageState: SESSION_FILE })
    : await browser.newContext();
  const page = await context.newPage();

  const captured = [];
  page.on("response", async (resp) => {
    try {
      const ct = (resp.headers()["content-type"] || "").toLowerCase();
      if (!ct.includes("json")) return;
      const json = await resp.json().catch(() => null);
      if (!json) return;
      const before = captured.length;
      harvestClients(json, captured);
      if (captured.length > before) {
        process.stdout.write(`\r   clients captured: ${captured.length}   `);
      }
    } catch {
      /* ignore */
    }
  });

  console.log("Opening Fresha Clients page...");
  await gotoClients(page);
  console.log(
    "\n>>> If a Fresha login appears, log in in the browser window. I'll continue automatically once your clients load (up to 8 minutes). <<<\n"
  );

  let ready = false;
  for (let i = 0; i < 96; i++) {
    if (captured.length > 0) {
      ready = true;
      break;
    }
    if (i % 6 === 5) await gotoClients(page);
    await page.waitForTimeout(5000);
    process.stdout.write(`\r   waiting for login / clients to load... ${(i + 1) * 5}s   `);
  }
  console.log("");
  if (!ready) {
    console.error("❌ No client data seen (login not completed, or list view hides contacts).");
    console.error("   Tip: use Fresha's built-in Clients → ⋯ → Export, then run the importer.");
    await browser.close();
    process.exit(1);
  }
  await context.storageState({ path: SESSION_FILE }).catch(() => {});

  // Drive loading: scroll the list (and any inner scroll container) until stable.
  console.log("Loading full client list (scrolling/paginating)...");
  let stable = 0;
  let last = -1;
  for (let i = 0; i < 800 && stable < 8; i++) {
    await page.mouse.wheel(0, 6000).catch(() => {});
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
      // Also scroll any tall inner scroll containers (virtualized tables).
      document.querySelectorAll("*").forEach((el) => {
        if (el.scrollHeight > el.clientHeight + 400 && el.clientHeight > 200) {
          el.scrollTop = el.scrollHeight;
        }
      });
    }).catch(() => {});
    await page.waitForTimeout(650);
    const clicked = await page
      .evaluate(() => {
        const rx = /load more|show more|view more|see more|next page|more clients/i;
        const els = Array.from(document.querySelectorAll('button,a,[role="button"]'));
        const btn = els.find((e) => rx.test((e.textContent || "").trim()) && !e.disabled);
        if (btn) { btn.click(); return true; }
        return false;
      })
      .catch(() => false);
    if (clicked) await page.waitForTimeout(900);

    if (captured.length === last) stable++;
    else { stable = 0; last = captured.length; }
    process.stdout.write(`\r   clients captured: ${captured.length} (pass ${i + 1})   `);
  }
  console.log("");

  // Merge + dedupe: prefer fresha id, then email, then phone.
  const byKey = new Map();
  for (const c of captured) {
    const key = c.fresha_client_id
      ? `id:${c.fresha_client_id}`
      : c.email
      ? `em:${c.email}`
      : c.phone
      ? `ph:${c.phone}`
      : null;
    if (!key) continue;
    const prev = byKey.get(key);
    if (!prev) byKey.set(key, c);
    else {
      // Merge — keep the most complete record.
      byKey.set(key, {
        ...prev,
        email: prev.email || c.email,
        phone: prev.phone || c.phone,
        last_visit: prev.last_visit || c.last_visit,
        total_visits: prev.total_visits ?? c.total_visits,
        total_spent: prev.total_spent ?? c.total_spent,
        accepts_email: prev.accepts_email ?? c.accepts_email,
        accepts_sms: prev.accepts_sms ?? c.accepts_sms,
      });
    }
  }
  const rows = [...byKey.values()];
  const withEmail = rows.filter((r) => r.email).length;
  const withPhone = rows.filter((r) => r.phone).length;
  console.log(`\nUnique clients: ${rows.length} (email: ${withEmail}, phone: ${withPhone}).`);

  if (!rows.length) {
    console.error("❌ Nothing to write.");
    await browser.close();
    process.exit(1);
  }

  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  const cols = [
    "fresha_client_id", "first_name", "last_name", "email", "phone",
    "last_visit", "total_visits", "total_spent", "accepts_email", "accepts_sms",
  ];
  const csv =
    cols.join(",") + "\n" +
    rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");
  fs.writeFileSync(OUTPUT, csv, "utf8");
  console.log(`✅ Export complete: ${OUTPUT} (${rows.length} clients)`);

  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
    console.log("Session file removed.");
  }
  await browser.close();
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
