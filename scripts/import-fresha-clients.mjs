#!/usr/bin/env node
/**
 * Import / enrich clients from a Fresha client export.
 *
 * Reads:  fresha_clients_export.csv  (from export-fresha-clients.mjs, OR
 *         Fresha's own built-in Clients → ⋯ → Export — flexible column names)
 *
 * Behavior (non-destructive):
 *   - Match an existing client by fresha_client_id → email → phone.
 *   - Fill in MISSING fields only (never overwrites existing non-null values):
 *       email, phone, last_visit_date, total_visits, total_lifetime_value_cents
 *   - Marketing consent:
 *       consent_sms  set true ONLY when Fresha explicitly says SMS opt-in (TCPA is strict).
 *       consent_email set true when Fresha says email opt-in, OR (when SET_EMAIL_CONSENT=1)
 *         for existing customers who have a real email (CAN-SPAM allows emailing
 *         prior customers with an opt-out). Default: respect Fresha flag only.
 *   - Unmatched rows with contact info are INSERTED as source='fresha'.
 *
 * Env toggles:
 *   SET_EMAIL_CONSENT=1   also mark email-consent true for past clients lacking a flag
 *   DRY_RUN=1             report only, write nothing
 *
 * Usage: node scripts/import-fresha-clients.mjs [path-to-csv]
 */

import fs from "fs";
import path from "path";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const SUPA = env.NEXT_PUBLIC_SUPABASE_URL;
const SKEY = env.SUPABASE_SERVICE_ROLE_KEY;
const PH = { apikey: SKEY, Authorization: `Bearer ${SKEY}`, "Content-Type": "application/json" };
const DRY = process.env.DRY_RUN === "1";
const SET_EMAIL_CONSENT = process.env.SET_EMAIL_CONSENT === "1";

const csvPath = process.argv[2] || path.join(process.cwd(), "fresha_clients_export.csv");
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV not found: ${csvPath}`);
  process.exit(1);
}

function parseCSV(text) {
  const out = [];
  const rows = [];
  let field = "", row = [], q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return out;
  const headers = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1 && rows[i][0] === "") continue;
    const o = {};
    headers.forEach((h, j) => (o[h] = (rows[i][j] ?? "").trim()));
    out.push(o);
  }
  return out;
}

const get = (o, ...names) => {
  for (const n of names) if (o[n] != null && o[n] !== "") return o[n];
  return null;
};
const isEmail = (v) => typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
const digits = (v) => String(v ?? "").replace(/[^\d+]/g, "");
const truthy = (v) =>
  v != null && /^(1|true|yes|y|opt[\s_-]?in|subscribed)$/i.test(String(v).trim());
const falsey = (v) =>
  v != null && /^(0|false|no|n|opt[\s_-]?out|unsubscribed)$/i.test(String(v).trim());
const toDate = (v) => {
  if (!v) return null;
  const d = new Date(String(v).trim());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};
const toInt = (v) => {
  const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};
const toCents = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

async function findClient(row) {
  const fid = get(row, "fresha_client_id", "client_id", "id");
  const email = (get(row, "email", "email_address") || "").toLowerCase();
  const phone = digits(get(row, "phone", "mobile", "mobile_number", "telephone", "phone_number"));
  const q = async (filter) => {
    const r = await fetch(`${SUPA}/rest/v1/clients?select=id,email,phone,consent_email,consent_sms,last_visit_date,total_visits,total_lifetime_value_cents&${filter}&limit=1`, { headers: PH });
    const d = await r.json().catch(() => []);
    return Array.isArray(d) && d[0] ? d[0] : null;
  };
  if (fid) { const m = await q(`fresha_client_id=eq.${encodeURIComponent(fid)}`); if (m) return m; }
  if (isEmail(email)) { const m = await q(`email=eq.${encodeURIComponent(email)}`); if (m) return m; }
  if (phone && phone.length >= 7) { const m = await q(`phone=eq.${encodeURIComponent(phone)}`); if (m) return m; }
  return null;
}

const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
console.log(`Parsed ${rows.length} rows from ${path.basename(csvPath)}.${DRY ? " (DRY RUN)" : ""}`);

let enrichedEmail = 0, enrichedPhone = 0, consentEmail = 0, consentSms = 0, inserted = 0, updated = 0, skipped = 0, optOutEmail = 0, optOutSms = 0;

for (const row of rows) {
  const email = (get(row, "email", "email_address") || "").toLowerCase();
  const phone = digits(get(row, "phone", "mobile", "mobile_number", "telephone", "phone_number"));
  const hasContact = isEmail(email) || (phone && phone.length >= 7);
  if (!hasContact) { skipped++; continue; }

  const emailFlag = get(row, "accepts_email", "accepts_email_marketing", "accepts_marketing", "email_marketing", "marketing_email");
  const smsFlag = get(row, "accepts_sms", "accepts_sms_marketing", "sms_marketing", "marketing_sms");
  const fEmailOptIn = truthy(emailFlag);
  const fEmailOptOut = falsey(emailFlag);
  const fSmsOptIn = truthy(smsFlag);
  const fSmsOptOut = falsey(smsFlag);
  const lastVisit = toDate(get(row, "last_visit", "last_visit_date", "last_appointment"));
  const visits = toInt(get(row, "total_visits", "visits", "appointments"));
  const cents = toCents(get(row, "total_spent", "lifetime_value", "total_sales"));
  const first = get(row, "first_name", "firstname", "given_name");
  const last = get(row, "last_name", "lastname", "surname");
  const fid = get(row, "fresha_client_id", "client_id", "id");

  const existing = await findClient(row).catch(() => null);

  if (existing) {
    const patch = {};
    if (!existing.email && isEmail(email)) { patch.email = email; enrichedEmail++; }
    if (!existing.phone && phone && phone.length >= 7) { patch.phone = phone; enrichedPhone++; }
    if (!existing.last_visit_date && lastVisit) patch.last_visit_date = lastVisit;
    if ((existing.total_visits == null || existing.total_visits === 0) && visits != null) patch.total_visits = visits;
    if (existing.total_lifetime_value_cents == null && cents != null) patch.total_lifetime_value_cents = cents;

    const targetEmail = patch.email || existing.email;
    // Honor explicit opt-OUT first (Fresha "No") — overrides the DB blanket default.
    if (fEmailOptOut && existing.consent_email !== false) {
      patch.consent_email = false; patch.accepts_email_marketing = false; optOutEmail++;
    } else if (!existing.consent_email && targetEmail && (fEmailOptIn || SET_EMAIL_CONSENT)) {
      patch.consent_email = true; patch.accepts_email_marketing = true; consentEmail++;
    }
    if (fSmsOptOut && existing.consent_sms === true) {
      patch.consent_sms = false; patch.accepts_sms_marketing = false; optOutSms++;
    } else if (!existing.consent_sms && fSmsOptIn && (patch.phone || existing.phone)) {
      patch.consent_sms = true; patch.accepts_sms_marketing = true; consentSms++;
    }

    if (Object.keys(patch).length === 0) { skipped++; continue; }
    patch.updated_at = new Date().toISOString();
    if (!DRY) {
      const r = await fetch(`${SUPA}/rest/v1/clients?id=eq.${existing.id}`, {
        method: "PATCH", headers: { ...PH, Prefer: "return=minimal" }, body: JSON.stringify(patch),
      });
      if (!r.ok) { console.error("  patch err", existing.id, await r.text().catch(() => "")); continue; }
    }
    updated++;
  } else {
    const rec = {
      fresha_client_id: fid || null,
      first_name: first || null,
      last_name: last || null,
      email: isEmail(email) ? email : null,
      phone: phone && phone.length >= 7 ? phone : null,
      last_visit_date: lastVisit,
      total_visits: visits,
      total_lifetime_value_cents: cents,
      source: "fresha",
      consent_email: isEmail(email) && (fEmailOptIn || SET_EMAIL_CONSENT) ? true : false,
      accepts_email_marketing: isEmail(email) && (fEmailOptIn || SET_EMAIL_CONSENT) ? true : false,
      consent_sms: fSmsOptIn && phone ? true : false,
      accepts_sms_marketing: fSmsOptIn && phone ? true : false,
    };
    if (rec.consent_email) consentEmail++;
    if (rec.consent_sms) consentSms++;
    if (rec.email) enrichedEmail++;
    if (rec.phone) enrichedPhone++;
    if (!DRY) {
      const r = await fetch(`${SUPA}/rest/v1/clients`, {
        method: "POST", headers: { ...PH, Prefer: "return=minimal" }, body: JSON.stringify(rec),
      });
      if (!r.ok) { console.error("  insert err", await r.text().catch(() => "")); continue; }
    }
    inserted++;
  }
  if ((updated + inserted) % 100 === 0) process.stdout.write(`\r   processed ${updated + inserted}...   `);
}

console.log("\n──────── Import summary ────────");
console.log(`Updated existing:   ${updated}`);
console.log(`Inserted new:       ${inserted}`);
console.log(`Skipped (no change/contact): ${skipped}`);
console.log(`Emails filled/added:  ${enrichedEmail}`);
console.log(`Phones filled/added:  ${enrichedPhone}`);
console.log(`Email-consent set:    ${consentEmail}`);
console.log(`SMS-consent set:      ${consentSms}`);
console.log(`Email opt-OUTs honored: ${optOutEmail}`);
console.log(`SMS opt-OUTs honored:   ${optOutSms}`);
console.log(DRY ? "(DRY RUN — nothing written.)" : "✅ Done.");
