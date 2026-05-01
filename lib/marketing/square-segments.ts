// Square Customer Directory segmentation.
//
// Pulls customers from Square via REST, computes our marketing segments,
// then ensures matching Square Customer Groups exist and members are tagged
// to match. Segments stay in sync so when staff create campaigns in Square
// Marketing they can target a fresh, automatically-maintained audience.
//
// Strategy: read-then-reconcile. We never delete a group; we only add and
// remove members. Names are stable so a single sync run is idempotent.
//
// Auth: prefers OAuth token from `oauth_tokens` (lib/square/oauth.ts) when
// available; falls back to the static SQUARE_ACCESS_TOKEN env var so this
// works for the staff "Run sync now" button before OAuth is wired everywhere.

import { getAccessToken as getOauthAccessToken } from "@/lib/square/oauth";

const SQUARE_API_VERSION = "2025-04-16";

function getEnvironmentBaseUrl(): string {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase();
  return env === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com";
}

async function resolveAccessToken(): Promise<string | null> {
  try {
    const oauth = await getOauthAccessToken();
    if (oauth) return oauth;
  } catch {
    // Ignore — fall back to env.
  }
  const fromEnv = process.env.SQUARE_ACCESS_TOKEN?.trim();
  return fromEnv || null;
}

type SquareCustomer = {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  birthday?: string; // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
  group_ids?: string[];
};

type SquareCustomerGroup = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

async function squareFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await resolveAccessToken();
  if (!token) {
    throw new Error("Square access token not configured (set SQUARE_ACCESS_TOKEN or connect OAuth)");
  }
  const res = await fetch(`${getEnvironmentBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Square API ${res.status}: ${text || res.statusText}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function listAllCustomers(): Promise<SquareCustomer[]> {
  const out: SquareCustomer[] = [];
  let cursor: string | undefined;
  let page = 0;
  do {
    page += 1;
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);
    const data = await squareFetch<{ customers?: SquareCustomer[]; cursor?: string }>(
      `/v2/customers?${qs.toString()}`,
    );
    if (data.customers?.length) out.push(...data.customers);
    cursor = data.cursor;
    if (page > 200) {
      console.warn("[square-segments] safety cap: stopping at 20,000 customers");
      break;
    }
  } while (cursor);
  return out;
}

async function listAllCustomerGroups(): Promise<SquareCustomerGroup[]> {
  const out: SquareCustomerGroup[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({ limit: "50" });
    if (cursor) qs.set("cursor", cursor);
    const data = await squareFetch<{ groups?: SquareCustomerGroup[]; cursor?: string }>(
      `/v2/customers/groups?${qs.toString()}`,
    );
    if (data.groups?.length) out.push(...data.groups);
    cursor = data.cursor;
  } while (cursor);
  return out;
}

async function ensureGroup(name: string, existing: SquareCustomerGroup[]): Promise<string> {
  const found = existing.find((g) => g.name === name);
  if (found) return found.id;
  const data = await squareFetch<{ group?: SquareCustomerGroup }>("/v2/customers/groups", {
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

async function addCustomerToGroup(customerId: string, groupId: string): Promise<void> {
  await squareFetch(`/v2/customers/${customerId}/groups/${groupId}`, { method: "PUT" });
}

async function removeCustomerFromGroup(customerId: string, groupId: string): Promise<void> {
  await squareFetch(`/v2/customers/${customerId}/groups/${groupId}`, { method: "DELETE" });
}

export type SegmentName =
  | "HG First-Time Clients"
  | "HG Lapsed (90+ Days)"
  | "HG Birthday Month"
  | "HG All Opt-In";

export type SegmentReport = {
  segment: SegmentName;
  groupId: string;
  desiredCount: number;
  added: number;
  removed: number;
  errors: string[];
};

function isFirstTime(c: SquareCustomer): boolean {
  // Heuristic: created in the last 30 days. Square also exposes purchase data
  // via Orders API; for v1 we use account age which works for a Customer
  // Directory build that grows alongside booking.
  if (!c.created_at) return false;
  const ageDays = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
  return Number.isFinite(ageDays) && ageDays <= 30;
}

function isLapsed90(c: SquareCustomer): boolean {
  // No order history available without a heavier Orders pull. Use updated_at as
  // a directional signal — it bumps on profile edits and order activity.
  if (!c.updated_at) return false;
  const ageDays = (Date.now() - new Date(c.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  return ageDays >= 90 && ageDays <= 730;
}

function isBirthdayMonth(c: SquareCustomer, monthIndex: number): boolean {
  if (!c.birthday) return false;
  const m = c.birthday.split("-")[1];
  if (!m) return false;
  return Number.parseInt(m, 10) - 1 === monthIndex;
}

function hasContact(c: SquareCustomer): boolean {
  return !!(c.email_address || c.phone_number);
}

/**
 * Run a full segment reconciliation. Returns per-segment counts and any
 * non-fatal errors so the caller (admin UI / cron) can render results.
 */
export async function syncSquareSegments(): Promise<{
  customersScanned: number;
  segments: SegmentReport[];
  generatedAt: string;
}> {
  const [customers, groups] = await Promise.all([listAllCustomers(), listAllCustomerGroups()]);
  const monthIndex = new Date().getMonth();

  const buckets: { name: SegmentName; member: (c: SquareCustomer) => boolean }[] = [
    { name: "HG First-Time Clients", member: isFirstTime },
    { name: "HG Lapsed (90+ Days)", member: isLapsed90 },
    { name: "HG Birthday Month", member: (c) => isBirthdayMonth(c, monthIndex) },
    { name: "HG All Opt-In", member: hasContact },
  ];

  const reports: SegmentReport[] = [];

  for (const bucket of buckets) {
    const groupId = await ensureGroup(bucket.name, groups);
    const desired = new Set<string>();
    for (const c of customers) {
      if (bucket.member(c)) desired.add(c.id);
    }
    const current = new Set<string>();
    for (const c of customers) {
      if (c.group_ids?.includes(groupId)) current.add(c.id);
    }
    const toAdd = [...desired].filter((id) => !current.has(id));
    const toRemove = [...current].filter((id) => !desired.has(id));

    const errors: string[] = [];
    let added = 0;
    let removed = 0;

    for (const id of toAdd) {
      try {
        await addCustomerToGroup(id, groupId);
        added += 1;
      } catch (err) {
        errors.push(`add ${id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    for (const id of toRemove) {
      try {
        await removeCustomerFromGroup(id, groupId);
        removed += 1;
      } catch (err) {
        errors.push(`remove ${id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    reports.push({
      segment: bucket.name,
      groupId,
      desiredCount: desired.size,
      added,
      removed,
      errors,
    });
  }

  return {
    customersScanned: customers.length,
    segments: reports,
    generatedAt: new Date().toISOString(),
  };
}
