#!/usr/bin/env node
/**
 * Suppress bounced-email customers + delete spam-bot accounts in Square.
 *
 * Reads the bounced-2026-05-05.csv extract (Customer ID, First, Last, Email)
 * produced from the May 5 Square email-blast export.
 *
 * Two actions:
 *   1. SUPPRESS — adds non-bot bounced customers to a "Bounced — Email
 *      Suppressed" group AND sets preferences.email_unsubscribed=true so
 *      Square Email Marketing skips them automatically. Preserves customer
 *      record (booking history, gift cards, etc.).
 *   2. DELETE — permanently removes johnsmith*@storebotmail.joonix.net
 *      spam-bot accounts.
 *
 * Usage:
 *   node --env-file=.env.local scripts/square-suppress-bounced.mjs            # dry-run
 *   node --env-file=.env.local scripts/square-suppress-bounced.mjs --commit   # actually do it
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CSV_PATH = resolve(REPO_ROOT, "tmp/email-cleanup/bounced-2026-05-05.csv");

const SQUARE_API_VERSION = "2025-04-16";
const GROUP_NAME = "Bounced — Email Suppressed";
const BOT_DOMAIN = "@storebotmail.joonix.net";
const COMMIT = process.argv.includes("--commit");

function baseUrl() {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

async function squareFetch(path, init = {}) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN not set");
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const body = text || res.statusText;
    throw Object.assign(new Error(`Square ${res.status}: ${body.slice(0, 300)}`), {
      status: res.status,
      body,
    });
  }
  return text ? JSON.parse(text) : {};
}

function parseCsv(content) {
  const [header, ...rows] = content.trim().split(/\r?\n/);
  const cols = header.split(",");
  return rows.map((line) => {
    const v = line.split(",");
    const o = {};
    cols.forEach((c, i) => (o[c.trim()] = (v[i] ?? "").trim()));
    return o;
  });
}

async function findOrCreateGroup(name) {
  const list = await squareFetch("/v2/customers/groups");
  const existing = (list.groups ?? []).find((g) => g.name === name);
  if (existing) return { id: existing.id, created: false };
  if (!COMMIT) return { id: "(would-be-created)", created: true };
  const created = await squareFetch("/v2/customers/groups", {
    method: "POST",
    body: JSON.stringify({ group: { name } }),
  });
  return { id: created.group.id, created: true };
}

async function addToGroup(customerId, groupId) {
  if (!COMMIT) return { ok: true, dryRun: true };
  await squareFetch(`/v2/customers/${customerId}/groups/${groupId}`, { method: "PUT" });
  return { ok: true };
}

/**
 * Sets preferences.email_unsubscribed=true on a customer. This is the
 * canonical "do not send marketing email" flag in Square — automatically
 * respected by Square Email Marketing campaigns without any UI config.
 */
async function setEmailUnsubscribed(customerId) {
  if (!COMMIT) return { ok: true, dryRun: true };
  await squareFetch(`/v2/customers/${customerId}`, {
    method: "PUT",
    body: JSON.stringify({ preferences: { email_unsubscribed: true } }),
  });
  return { ok: true };
}

async function deleteCustomer(customerId) {
  if (!COMMIT) return { ok: true, dryRun: true };
  try {
    await squareFetch(`/v2/customers/${customerId}`, { method: "DELETE" });
    return { ok: true };
  } catch (e) {
    // 404 = already deleted on a prior run; treat as success for idempotency.
    if (e.status === 404) return { ok: true, alreadyGone: true };
    throw e;
  }
}

async function main() {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase() || "(unset)";
  console.log(`Square env: ${env}`);
  console.log(`Mode: ${COMMIT ? "COMMIT (live writes)" : "DRY-RUN (no writes)"}`);
  console.log(`CSV: ${CSV_PATH}`);
  console.log();

  const customers = parseCsv(readFileSync(CSV_PATH, "utf8"));
  console.log(`Loaded ${customers.length} bounced customers from CSV.`);

  const bots = customers.filter((c) => (c["Email Address"] ?? "").endsWith(BOT_DOMAIN));
  const suppress = customers.filter((c) => !(c["Email Address"] ?? "").endsWith(BOT_DOMAIN));
  console.log(`  - to SUPPRESS (add to group): ${suppress.length}`);
  console.log(`  - to DELETE (spam bots):     ${bots.length}`);
  console.log();

  // 1. Group bookkeeping
  const { id: groupId, created } = await findOrCreateGroup(GROUP_NAME);
  console.log(`Group "${GROUP_NAME}": ${created ? "created" : "found"} (id: ${groupId})`);
  console.log();

  // 2. Suppress: add to group AND set email_unsubscribed=true
  // Group add is idempotent so re-running on already-grouped customers is safe.
  console.log(`--- SUPPRESSING ${suppress.length} customers (group + unsubscribe) ---`);
  let groupOk = 0,
    groupFail = 0,
    unsubOk = 0,
    unsubFail = 0;
  for (const c of suppress) {
    const id = c["Customer ID"];
    const email = c["Email Address"];
    try {
      await addToGroup(id, groupId);
      groupOk++;
    } catch (e) {
      groupFail++;
      console.log(`\n  group FAIL ${id} (${email}): ${e.message}`);
    }
    try {
      await setEmailUnsubscribed(id);
      unsubOk++;
      process.stdout.write(".");
    } catch (e) {
      unsubFail++;
      console.log(`\n  unsub FAIL ${id} (${email}): ${e.message}`);
    }
  }
  console.log(`\nGroup add:    ${groupOk} ok, ${groupFail} failed`);
  console.log(`Unsubscribe:  ${unsubOk} ok, ${unsubFail} failed`);
  console.log();

  // 3. Delete bot accounts
  console.log(`--- DELETING ${bots.length} bot accounts ---`);
  let deleteOk = 0,
    deleteFail = 0;
  for (const c of bots) {
    const id = c["Customer ID"];
    const email = c["Email Address"];
    try {
      const r = await deleteCustomer(id);
      deleteOk++;
      console.log(`  ${r.alreadyGone ? "already gone" : "deleted"} ${id} (${email})`);
    } catch (e) {
      deleteFail++;
      console.log(`  FAIL ${id} (${email}): ${e.message}`);
    }
  }
  console.log(`\nDelete: ${deleteOk} ok, ${deleteFail} failed`);
  console.log();

  console.log("Done.");
  if (!COMMIT) {
    console.log("\nThis was a DRY-RUN. To execute for real, re-run with: --commit");
  } else {
    console.log("\nNext step (manual): in Square Marketing -> set this group as a default audience exclusion.");
  }
}

main().catch((e) => {
  console.error("\nFATAL:", e.message);
  if (e.body) console.error("Response body:", e.body.slice(0, 1000));
  process.exit(1);
});
