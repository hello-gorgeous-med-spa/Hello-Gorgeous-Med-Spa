#!/usr/bin/env node
/**
 * Sync Hello Gorgeous customer segments to Square Customer Groups.
 * Run: node --env-file=.env.local scripts/sync-square-segments.mjs
 */

const SQUARE_API_VERSION = "2025-04-16";

function getEnvironmentBaseUrl() {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

async function squareFetch(path, init = {}) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN not set");
  
  const res = await fetch(`${getEnvironmentBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Square API ${res.status}: ${text || res.statusText}`);
  return text ? JSON.parse(text) : {};
}

async function listAllCustomers() {
  const out = [];
  let cursor;
  let page = 0;
  do {
    page++;
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);
    const data = await squareFetch(`/v2/customers?${qs.toString()}`);
    if (data.customers?.length) out.push(...data.customers);
    cursor = data.cursor;
    if (page > 200) break;
  } while (cursor);
  return out;
}

async function listAllCustomerGroups() {
  const out = [];
  let cursor;
  do {
    const qs = new URLSearchParams({ limit: "50" });
    if (cursor) qs.set("cursor", cursor);
    const data = await squareFetch(`/v2/customers/groups?${qs.toString()}`);
    if (data.groups?.length) out.push(...data.groups);
    cursor = data.cursor;
  } while (cursor);
  return out;
}

async function ensureGroup(name, existing) {
  const found = existing.find((g) => g.name === name);
  if (found) return found.id;
  const data = await squareFetch("/v2/customers/groups", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: `hg-segment-${name}-${Date.now()}`,
      group: { name },
    }),
  });
  if (!data.group?.id) throw new Error(`Failed to create Square group "${name}"`);
  existing.push(data.group);
  return data.group.id;
}

async function addCustomerToGroup(customerId, groupId) {
  await squareFetch(`/v2/customers/${customerId}/groups/${groupId}`, { method: "PUT" });
}

async function removeCustomerFromGroup(customerId, groupId) {
  await squareFetch(`/v2/customers/${customerId}/groups/${groupId}`, { method: "DELETE" });
}

function isFirstTime(c) {
  if (!c.created_at) return false;
  const ageDays = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
  return Number.isFinite(ageDays) && ageDays <= 30;
}

function isLapsed90(c) {
  if (!c.updated_at) return false;
  const ageDays = (Date.now() - new Date(c.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  return ageDays >= 90 && ageDays <= 730;
}

function isBirthdayMonth(c, monthIndex) {
  if (!c.birthday) return false;
  const m = c.birthday.split("-")[1];
  if (!m) return false;
  return parseInt(m, 10) - 1 === monthIndex;
}

function hasContact(c) {
  return !!(c.email_address || c.phone_number);
}

async function main() {
  console.log("Fetching Square customers and groups...");
  const [customers, groups] = await Promise.all([listAllCustomers(), listAllCustomerGroups()]);
  console.log(`Found ${customers.length} customers, ${groups.length} existing groups`);
  
  const monthIndex = new Date().getMonth();
  
  const buckets = [
    { name: "HG First-Time Clients", member: isFirstTime },
    { name: "HG Lapsed (90+ Days)", member: isLapsed90 },
    { name: "HG Birthday Month", member: (c) => isBirthdayMonth(c, monthIndex) },
    { name: "HG All Opt-In", member: hasContact },
  ];
  
  for (const bucket of buckets) {
    console.log(`\nProcessing: ${bucket.name}`);
    const groupId = await ensureGroup(bucket.name, groups);
    
    const desired = new Set();
    for (const c of customers) {
      if (bucket.member(c)) desired.add(c.id);
    }
    
    const current = new Set();
    for (const c of customers) {
      if (c.group_ids?.includes(groupId)) current.add(c.id);
    }
    
    const toAdd = [...desired].filter((id) => !current.has(id));
    const toRemove = [...current].filter((id) => !desired.has(id));
    
    let added = 0, removed = 0;
    
    for (const id of toAdd) {
      try {
        await addCustomerToGroup(id, groupId);
        added++;
      } catch (e) {
        console.log(`  ✗ add ${id}: ${e.message}`);
      }
    }
    
    for (const id of toRemove) {
      try {
        await removeCustomerFromGroup(id, groupId);
        removed++;
      } catch (e) {
        console.log(`  ✗ remove ${id}: ${e.message}`);
      }
    }
    
    console.log(`  ✓ ${bucket.name}: ${desired.size} members (added ${added}, removed ${removed})`);
  }
  
  console.log("\nDone! Check Square Dashboard → Customers → Groups to see your segments.");
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
