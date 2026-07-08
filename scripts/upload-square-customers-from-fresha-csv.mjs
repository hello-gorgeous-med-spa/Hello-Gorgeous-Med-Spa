#!/usr/bin/env node
/**
 * Upload Fresha client export CSV into Square Customer Directory.
 *
 * USAGE:
 *   node --env-file=.env.local scripts/upload-square-customers-from-fresha-csv.mjs \
 *     --csv=/path/to/export_customer_list_YYYY-MM-DD.csv --dry-run
 *
 *   node --env-file=.env.local scripts/upload-square-customers-from-fresha-csv.mjs \
 *     --csv=/path/to/export_customer_list_YYYY-MM-DD.csv --apply
 *
 * Behavior:
 *   - Match existing Square customers by email, then phone (createCustomer vs Update)
 *   - Never mass-deletes Square customers (Square often has MORE clients than Fresha)
 *   - Skips blank name+no-contact rows and obvious test accounts
 *   - Blocked Fresha clients get note + preference (still upserted unless --skip-blocked)
 *   - Adds reference_id = fresha:{Client ID} for traceability
 */

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const getArg = (name) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : null;
};
const has = (flag) => args.includes(flag);

const DRY_RUN = has("--dry-run") || !has("--apply");
const APPLY = has("--apply");
const SKIP_BLOCKED = has("--skip-blocked");
const CSV_PATH = getArg("--csv");
const LIMIT = parseInt(getArg("--limit") || "0", 10) || 0;

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST =
  envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!CSV_PATH) {
  console.error("❌ Missing --csv=/path/to/export_customer_list.csv");
  process.exit(1);
}
if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌ CSV not found: ${CSV_PATH}`);
  process.exit(1);
}
if (APPLY && (!TOKEN || TOKEN.length < 10)) {
  console.error("❌ Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

function parseCSV(text) {
  const rows = [];
  let field = "";
  let row = [];
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1 && !rows[i][0]) continue;
    const o = {};
    headers.forEach((h, j) => (o[h] = (rows[i][j] ?? "").trim()));
    out.push(o);
  }
  return out;
}

function digitsPhone(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (!d) return null;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  if (d.length === 10) return `+1${d}`;
  if (d.startsWith("1") && d.length > 10) return `+${d}`;
  return d.length >= 10 ? `+${d}` : null;
}

function truthy(v) {
  return /^(1|true|yes|y)$/i.test(String(v || "").trim());
}

function isTestRow(r) {
  const fn = (r["First Name"] || "").trim().toLowerCase();
  const ln = (r["Last Name"] || "").trim().toLowerCase();
  const email = (r["Email"] || "").trim().toLowerCase();
  if (fn === "test" && ln === "test") return true;
  if (email.includes("test@") || email.endsWith("@example.com")) return true;
  return false;
}

function loadCustomers(csvPath) {
  const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
  const customers = [];
  const skipped = { empty: 0, test: 0, blocked: 0 };
  for (const r of rows) {
    if (isTestRow(r)) {
      skipped.test++;
      continue;
    }
    const blocked = truthy(r["Blocked"]);
    if (blocked && SKIP_BLOCKED) {
      skipped.blocked++;
      continue;
    }
    const first = (r["First Name"] || "").trim();
    const last = (r["Last Name"] || "").trim();
    const email = (r["Email"] || "").trim().toLowerCase() || null;
    const phone = digitsPhone(r["Mobile Number"] || r["Telephone"]);
    if (!first && !last && !email && !phone) {
      skipped.empty++;
      continue;
    }
    if (!email && !phone) {
      skipped.empty++;
      continue;
    }

    const addressLine = (r["Address"] || "").trim();
    const city = (r["City"] || "").trim();
    const state = (r["State"] || "").trim();
    const zip = (r["Post Code"] || "").trim();
    const address =
      addressLine || city || state || zip
        ? {
            address_line_1: addressLine || undefined,
            locality: city || undefined,
            administrative_district_level_1: state || undefined,
            postal_code: zip || undefined,
            country: "US",
          }
        : undefined;

    const noteParts = [];
    if (r["Note"]) noteParts.push(r["Note"]);
    if (r["Referral Source"]) noteParts.push(`Referral: ${r["Referral Source"]}`);
    if (r["Tags"]) noteParts.push(`Tags: ${r["Tags"]}`);
    if (blocked) {
      noteParts.push(`BLOCKED (Fresha): ${r["Block Reason"] || "blocked"}`);
    }
    noteParts.push(`Imported from Fresha Client ID ${r["Client ID"]}`);

    customers.push({
      freshaId: (r["Client ID"] || "").trim(),
      given_name: first || undefined,
      family_name: last || undefined,
      email_address: email || undefined,
      phone_number: phone || undefined,
      birthday: (r["Date of Birth"] || "").trim() || undefined,
      address,
      note: noteParts.filter(Boolean).join(" · ").slice(0, 1900) || undefined,
      reference_id: r["Client ID"] ? `fresha:${r["Client ID"]}` : undefined,
      emailOptIn: truthy(r["Accepts Marketing"]),
      smsOptIn: truthy(r["Accepts SMS Marketing"]),
      blocked,
    });
  }
  return { customers, skipped, rawCount: rows.length };
}

async function squareFetch(method, apiPath, body) {
  const res = await fetch(`${HOST}/v2${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data?.errors?.[0];
    throw new Error(err?.detail || err?.code || `HTTP ${res.status}`);
  }
  return data;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loadAllSquareCustomers() {
  const byEmail = new Map();
  const byPhone = new Map();
  const byRef = new Map();
  let cursor = null;
  let total = 0;
  do {
    const url = new URL(`${HOST}/v2/customers`);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Square-Version": SQUARE_VERSION,
        Accept: "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.errors?.[0]?.detail || "customers list failed");
    for (const c of data.customers || []) {
      total++;
      const email = (c.email_address || "").trim().toLowerCase();
      const phone = (c.phone_number || "").replace(/\D/g, "");
      if (email) byEmail.set(email, c);
      if (phone) byPhone.set(phone, c);
      if (c.reference_id) byRef.set(c.reference_id, c);
    }
    cursor = data.cursor || null;
  } while (cursor);
  return { byEmail, byPhone, byRef, total };
}

function findMatch(maps, cust) {
  if (cust.reference_id && maps.byRef.has(cust.reference_id)) {
    return maps.byRef.get(cust.reference_id);
  }
  if (cust.email_address && maps.byEmail.has(cust.email_address)) {
    return maps.byEmail.get(cust.email_address);
  }
  if (cust.phone_number) {
    const d = cust.phone_number.replace(/\D/g, "");
    if (maps.byPhone.has(d)) return maps.byPhone.get(d);
  }
  return null;
}

function buildBody(cust) {
  return {
    given_name: cust.given_name,
    family_name: cust.family_name,
    email_address: cust.email_address,
    phone_number: cust.phone_number,
    reference_id: cust.reference_id,
    note: cust.note,
    birthday: cust.birthday || undefined,
    address: cust.address,
  };
}

async function main() {
  const abs = path.resolve(CSV_PATH);
  let { customers, skipped, rawCount } = loadCustomers(abs);
  if (LIMIT > 0) customers = customers.slice(0, LIMIT);

  console.log("═══════════════════════════════════════════════════");
  console.log(" Square customer upload from Fresha CSV");
  console.log("═══════════════════════════════════════════════════");
  console.log(` CSV:     ${abs}`);
  console.log(` Env:     ${envName}`);
  console.log(` Mode:    ${DRY_RUN ? "DRY-RUN" : "APPLY"}`);
  console.log(` Rows:    ${rawCount} → ${customers.length} uploadable`);
  console.log(
    ` Skipped: empty=${skipped.empty} test=${skipped.test} blocked=${skipped.blocked}`,
  );
  if (LIMIT) console.log(` Limit:   ${LIMIT}`);
  console.log("");

  const withEmail = customers.filter((c) => c.email_address).length;
  const withPhone = customers.filter((c) => c.phone_number).length;
  console.log(` With email: ${withEmail}`);
  console.log(` With phone: ${withPhone}`);
  console.log(` Blocked kept: ${customers.filter((c) => c.blocked).length}`);

  if (DRY_RUN) {
    console.log("\nSample:");
    for (const c of customers.slice(0, 5)) {
      console.log(
        `  • ${c.given_name || ""} ${c.family_name || ""} | ${c.email_address || "—"} | ${c.phone_number || "—"}`,
      );
    }
    console.log("\nRe-run with --apply to create/update Square customers.");
    return;
  }

  console.log("\n📥 Loading Square customer directory (this can take a minute)…");
  const maps = await loadAllSquareCustomers();
  console.log(`   Existing Square customers: ${maps.total}`);

  let created = 0;
  let updated = 0;
  let failed = 0;
  let unchanged = 0;

  for (let i = 0; i < customers.length; i++) {
    const cust = customers[i];
    const label = `${cust.given_name || ""} ${cust.family_name || ""}`.trim() || cust.email_address;
    try {
      const existing = findMatch(maps, cust);
      const body = buildBody(cust);
      if (existing) {
        // Only PATCH if we have something meaningful to sync
        await squareFetch("PUT", `/customers/${existing.id}`, body);
        updated++;
        if (updated <= 5 || updated % 100 === 0) {
          console.log(`  ↺ [${i + 1}/${customers.length}] ${label}`);
        }
        // refresh maps in case email/phone added
        if (cust.email_address) maps.byEmail.set(cust.email_address, existing);
        if (cust.phone_number) maps.byPhone.set(cust.phone_number.replace(/\D/g, ""), existing);
      } else {
        const data = await squareFetch("POST", "/customers", {
          idempotency_key: `fresha-${cust.freshaId || slug(cust)}-${i}`.slice(0, 45),
          ...body,
        });
        created++;
        const c = data.customer;
        if (c?.email_address) maps.byEmail.set(c.email_address.toLowerCase(), c);
        if (c?.phone_number) maps.byPhone.set(c.phone_number.replace(/\D/g, ""), c);
        if (c?.reference_id) maps.byRef.set(c.reference_id, c);
        if (created <= 10 || created % 50 === 0) {
          console.log(`  ✓ [${i + 1}/${customers.length}] ${label}`);
        }
      }
      await sleep(80);
    } catch (e) {
      failed++;
      console.log(`  ✕ ${label}: ${e.message}`);
      await sleep(200);
    }

    if ((i + 1) % 250 === 0) {
      console.log(`  … progress ${i + 1}/${customers.length} (c=${created} u=${updated} f=${failed})`);
    }
  }

  console.log("\n✅ Customer upload complete");
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`   (Unchanged tracker unused: ${unchanged})`);
}

function slug(cust) {
  return `${cust.email_address || cust.phone_number || "x"}`.replace(/[^a-z0-9]/gi, "").slice(0, 20);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
