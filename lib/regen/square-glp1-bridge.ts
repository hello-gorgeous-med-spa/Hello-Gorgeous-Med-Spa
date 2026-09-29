/**
 * Square ↔ REGEN: find in-clinic GLP-1 buyers and invite them to order online.
 * Uses Square Catalog + Orders (not customer created_at heuristics).
 * Does not charge cards. Rx payment stays PayConex after Ryan reviews.
 */

import { SQUARE_RX_LOCATION_ID } from "@/lib/flows";
import { validatePhoneNumber } from "@/lib/hgos/sms-marketing";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { normalizeToE164 } from "@/lib/phone-e164";
import {
  REGEN_SQUARE_GLP1_CAMPAIGN,
  REGEN_SQUARE_GLP1_COOLDOWN_DAYS,
  REGEN_SQUARE_GLP1_GROUP,
  REGEN_SQUARE_GLP1_INVITE_MAX,
  squareGlp1InviteText,
} from "@/lib/regen/square-glp1-constants";
import { squareApiFetch } from "@/lib/square/http";
import { getSupabase } from "@/lib/supabase-server";

export {
  REGEN_SQUARE_GLP1_CAMPAIGN,
  REGEN_SQUARE_GLP1_COOLDOWN_DAYS,
  REGEN_SQUARE_GLP1_GROUP,
  REGEN_SQUARE_GLP1_INVITE_MAX,
  REGEN_SQUARE_GLP1_SHOP_URL,
  squareGlp1InviteText,
} from "@/lib/regen/square-glp1-constants";

const CATALOG_KEYWORDS = [
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "wegovy",
  "ozempic",
  "mounjaro",
  "zepbound",
  "GLP-1",
  "GLP1",
];

const GLP1_NAME_RE =
  /\b(sema(glutide)?|tirz(epatide)?|retatrutide|glp[\s-]?1|wegovy|ozempic|mounjaro|zepbound)\b/i;

const ORDER_PAGE_LIMIT = 50;
const ORDER_PAGE_CAP = 80;

type SquareCustomer = {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  group_ids?: string[];
};

type SquareGroup = { id: string; name: string };

type SquareOrder = {
  id?: string;
  customer_id?: string;
  closed_at?: string;
  created_at?: string;
  tenders?: { customer_id?: string }[];
  line_items?: { name?: string; catalog_object_id?: string; quantity?: string }[];
};

export type SquareGlp1Row = {
  squareCustomerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastItem: string;
  lastOrderAt: string | null;
  regenPatientId: string | null;
};

export type SquareGlp1PullResult = {
  ok: boolean;
  connected: boolean;
  groupName: string;
  groupId: string | null;
  catalogHits: number;
  ordersScanned: number;
  clients: SquareGlp1Row[];
  tagged: number;
  upserted: number;
  error?: string;
};

export type SquareGlp1InviteResult = {
  ok: boolean;
  groupId: string | null;
  totalInGroup: number;
  eligible: number;
  sent: number;
  failed: number;
  skippedNoPhone: number;
  skippedCooldown: number;
  errors: string[];
};

async function squareJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const res = await squareApiFetch<T>(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, data: res.data };
}

async function resolveLocationIds(): Promise<string[]> {
  const fromEnv = [process.env.SQUARE_LOCATION_ID, process.env.SQUARE_RX_LOCATION_ID, SQUARE_RX_LOCATION_ID]
    .map((v) => (v || "").trim())
    .filter(Boolean);
  const unique = [...new Set(fromEnv)];
  if (unique.length) return unique;

  const res = await squareJson<{ locations?: { id?: string }[] }>("/v2/locations");
  if (!res.ok) throw new Error(res.error);
  return (res.data.locations || []).map((l) => l.id || "").filter(Boolean);
}

function lineLooksGlp1(name: string, catalogIds: Set<string>, catalogObjectId?: string) {
  if (catalogObjectId && catalogIds.has(catalogObjectId)) return true;
  return GLP1_NAME_RE.test(name);
}

async function findGlp1CatalogIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  for (const keyword of CATALOG_KEYWORDS) {
    const res = await squareJson<{ objects?: Array<{
      id?: string;
      type?: string;
      item_data?: {
        name?: string;
        variations?: { id?: string }[];
      };
    }> }>("/v2/catalog/search", {
      method: "POST",
      body: JSON.stringify({
        object_types: ["ITEM"],
        query: { text_query: { keywords: [keyword] } },
        limit: 100,
      }),
    });
    if (!res.ok) continue;
    for (const obj of res.data.objects || []) {
      const name = obj.item_data?.name || "";
      if (!GLP1_NAME_RE.test(name) && !name.toLowerCase().includes(keyword.toLowerCase())) continue;
      if (obj.id) ids.add(obj.id);
      for (const variation of obj.item_data?.variations || []) {
        if (variation.id) ids.add(variation.id);
      }
    }
  }
  return ids;
}

async function searchGlp1Orders(locationIds: string[], catalogIds: Set<string>) {
  const byCustomer = new Map<string, { lastItem: string; lastOrderAt: string | null }>();
  let cursor: string | undefined;
  let scanned = 0;
  let pages = 0;
  const startAt = new Date();
  startAt.setFullYear(startAt.getFullYear() - 2);

  do {
    pages += 1;
    const res = await squareJson<{ orders?: SquareOrder[]; cursor?: string }>("/v2/orders/search", {
      method: "POST",
      body: JSON.stringify({
        location_ids: locationIds,
        query: {
          filter: {
            state_filter: { states: ["COMPLETED"] },
            date_time_filter: {
              closed_at: { start_at: startAt.toISOString() },
            },
          },
          sort: { sort_field: "CLOSED_AT", sort_order: "DESC" },
        },
        limit: ORDER_PAGE_LIMIT,
        cursor,
      }),
    });
    if (!res.ok) throw new Error(res.error);
    for (const order of res.data.orders || []) {
      scanned += 1;
      const match = (order.line_items || []).find((line) =>
        lineLooksGlp1(line.name || "", catalogIds, line.catalog_object_id),
      );
      if (!match) continue;
      const customerId = order.customer_id || order.tenders?.find((t) => t.customer_id)?.customer_id;
      if (!customerId) continue;
      const when = order.closed_at || order.created_at || null;
      const prev = byCustomer.get(customerId);
      if (!prev || (when && prev.lastOrderAt && when > prev.lastOrderAt) || (when && !prev.lastOrderAt)) {
        byCustomer.set(customerId, { lastItem: match.name || "GLP-1", lastOrderAt: when });
      }
    }
    cursor = res.data.cursor;
  } while (cursor && pages < ORDER_PAGE_CAP);

  return { byCustomer, scanned };
}

async function listGroups(): Promise<SquareGroup[]> {
  const out: SquareGroup[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({ limit: "50" });
    if (cursor) qs.set("cursor", cursor);
    const res = await squareJson<{ groups?: SquareGroup[]; cursor?: string }>(`/v2/customers/groups?${qs}`);
    if (!res.ok) throw new Error(res.error);
    out.push(...(res.data.groups || []));
    cursor = res.data.cursor;
  } while (cursor);
  return out;
}

async function ensureGroup(name: string, groups: SquareGroup[]): Promise<string> {
  const found = groups.find((g) => g.name === name);
  if (found) return found.id;
  const res = await squareJson<{ group?: SquareGroup }>("/v2/customers/groups", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: `regen-glp1-${Date.now()}`,
      group: { name },
    }),
  });
  if (!res.ok || !res.data.group?.id) throw new Error(res.ok ? "Square did not create the GLP-1 group." : res.error);
  groups.push(res.data.group);
  return res.data.group.id;
}

async function addToGroup(customerId: string, groupId: string) {
  const res = await squareJson(`/v2/customers/${encodeURIComponent(customerId)}/groups/${encodeURIComponent(groupId)}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error(res.error);
}

async function retrieveCustomers(ids: string[]): Promise<Map<string, SquareCustomer>> {
  const map = new Map<string, SquareCustomer>();
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const res = await squareJson<{
      responses?: Record<string, { customer?: SquareCustomer }>;
    }>("/v2/customers/bulk-retrieve", {
      method: "POST",
      body: JSON.stringify({ customer_ids: chunk }),
    });
    if (!res.ok) throw new Error(res.error);
    for (const [id, payload] of Object.entries(res.data.responses || {})) {
      if (payload.customer) map.set(id, payload.customer);
    }
  }
  return map;
}

async function listCustomersInGroup(groupId: string): Promise<SquareCustomer[]> {
  const out: SquareCustomer[] = [];
  let cursor: string | undefined;
  do {
    const res = await squareJson<{ customers?: SquareCustomer[]; cursor?: string }>("/v2/customers/search", {
      method: "POST",
      body: JSON.stringify({
        limit: 100,
        cursor,
        query: {
          filter: {
            group_ids: { all: [groupId] },
          },
        },
      }),
    });
    if (!res.ok) throw new Error(res.error);
    out.push(...(res.data.customers || []));
    cursor = res.data.cursor;
  } while (cursor);
  return out;
}

function placeholderEmail(squareId: string) {
  return `square-${squareId}@square.hellogorgeousmedspa.com`;
}

async function upsertRegenPatient(row: SquareGlp1Row): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const phone = normalizeToE164(row.phone) || row.phone || "";
  const email = (row.email || placeholderEmail(row.squareCustomerId)).toLowerCase();

  if (row.email) {
    const { data: byEmail } = await supabase.from("regen_patients").select("id").eq("email", email).maybeSingle();
    if (byEmail?.id) {
      await supabase
        .from("regen_patients")
        .update({
          first_name: row.firstName || undefined,
          last_name: row.lastName || undefined,
          phone: phone || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", byEmail.id);
      return byEmail.id as string;
    }
  }

  if (phone) {
    const { data: byPhone } = await supabase.from("regen_patients").select("id").eq("phone", phone).maybeSingle();
    if (byPhone?.id) {
      await supabase
        .from("regen_patients")
        .update({
          first_name: row.firstName || undefined,
          last_name: row.lastName || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", byPhone.id);
      return byPhone.id as string;
    }
  }

  const { data: created, error } = await supabase
    .from("regen_patients")
    .insert({
      email,
      first_name: row.firstName || "Square",
      last_name: row.lastName || "Client",
      phone: phone || null,
      state: "IL",
    })
    .select("id")
    .single();
  if (error || !created?.id) return null;
  return created.id as string;
}

function toRow(customer: SquareCustomer, extra?: { lastItem?: string; lastOrderAt?: string | null }): SquareGlp1Row {
  return {
    squareCustomerId: customer.id,
    firstName: customer.given_name || "",
    lastName: customer.family_name || "",
    email: (customer.email_address || "").trim().toLowerCase(),
    phone: customer.phone_number || "",
    lastItem: extra?.lastItem || "",
    lastOrderAt: extra?.lastOrderAt || null,
    regenPatientId: null,
  };
}

export async function listSquareGlp1Report(): Promise<SquareGlp1PullResult> {
  try {
    const groups = await listGroups();
    const group = groups.find((g) => g.name === REGEN_SQUARE_GLP1_GROUP);
    if (!group) {
      return {
        ok: true,
        connected: true,
        groupName: REGEN_SQUARE_GLP1_GROUP,
        groupId: null,
        catalogHits: 0,
        ordersScanned: 0,
        clients: [],
        tagged: 0,
        upserted: 0,
      };
    }
    const members = await listCustomersInGroup(group.id);
    return {
      ok: true,
      connected: true,
      groupName: REGEN_SQUARE_GLP1_GROUP,
      groupId: group.id,
      catalogHits: 0,
      ordersScanned: 0,
      clients: members.map((c) => toRow(c)),
      tagged: 0,
      upserted: 0,
    };
  } catch (error) {
    return {
      ok: false,
      connected: false,
      groupName: REGEN_SQUARE_GLP1_GROUP,
      groupId: null,
      catalogHits: 0,
      ordersScanned: 0,
      clients: [],
      tagged: 0,
      upserted: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function pullSquareGlp1Clients(): Promise<SquareGlp1PullResult> {
  try {
    const [locationIds, catalogIds, groups] = await Promise.all([
      resolveLocationIds(),
      findGlp1CatalogIds(),
      listGroups(),
    ]);
    if (!locationIds.length) {
      return {
        ok: false,
        connected: false,
        groupName: REGEN_SQUARE_GLP1_GROUP,
        groupId: null,
        catalogHits: catalogIds.size,
        ordersScanned: 0,
        clients: [],
        tagged: 0,
        upserted: 0,
        error: "No Square location id. Set SQUARE_LOCATION_ID.",
      };
    }

    const { byCustomer, scanned } = await searchGlp1Orders(locationIds, catalogIds);

    // Include people already tagged on a Square GLP / sema / tirz group.
    for (const group of groups) {
      if (!GLP1_NAME_RE.test(group.name) && group.name !== REGEN_SQUARE_GLP1_GROUP) continue;
      const members = await listCustomersInGroup(group.id);
      for (const member of members) {
        if (!byCustomer.has(member.id)) {
          byCustomer.set(member.id, { lastItem: group.name, lastOrderAt: null });
        }
      }
    }

    const groupId = await ensureGroup(REGEN_SQUARE_GLP1_GROUP, groups);
    const customers = await retrieveCustomers([...byCustomer.keys()]);
    const clients: SquareGlp1Row[] = [];
    let tagged = 0;
    let upserted = 0;

    for (const [id, extra] of byCustomer) {
      const customer = customers.get(id);
      if (!customer) continue;
      const row = toRow(customer, extra);
      if (!customer.group_ids?.includes(groupId)) {
        try {
          await addToGroup(id, groupId);
          tagged += 1;
        } catch {
          // Keep going — report still useful without the tag.
        }
      }
      const regenId = await upsertRegenPatient(row);
      if (regenId) {
        row.regenPatientId = regenId;
        upserted += 1;
      }
      clients.push(row);
    }

    clients.sort((a, b) => (b.lastOrderAt || "").localeCompare(a.lastOrderAt || ""));

    return {
      ok: true,
      connected: true,
      groupName: REGEN_SQUARE_GLP1_GROUP,
      groupId,
      catalogHits: catalogIds.size,
      ordersScanned: scanned,
      clients,
      tagged,
      upserted,
    };
  } catch (error) {
    return {
      ok: false,
      connected: false,
      groupName: REGEN_SQUARE_GLP1_GROUP,
      groupId: null,
      catalogHits: 0,
      ordersScanned: 0,
      clients: [],
      tagged: 0,
      upserted: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function inviteSquareGlp1Clients(options?: {
  maxBatch?: number;
  dryRun?: boolean;
}): Promise<SquareGlp1InviteResult> {
  const maxBatch = options?.maxBatch ?? REGEN_SQUARE_GLP1_INVITE_MAX;
  const dryRun = options?.dryRun ?? false;
  const result: SquareGlp1InviteResult = {
    ok: false,
    groupId: null,
    totalInGroup: 0,
    eligible: 0,
    sent: 0,
    failed: 0,
    skippedNoPhone: 0,
    skippedCooldown: 0,
    errors: [],
  };

  const groups = await listGroups();
  const group = groups.find((g) => g.name === REGEN_SQUARE_GLP1_GROUP);
  if (!group) {
    result.errors.push(`Pull from Square first so we can create "${REGEN_SQUARE_GLP1_GROUP}".`);
    return result;
  }
  result.groupId = group.id;

  const members = await listCustomersInGroup(group.id);
  result.totalInGroup = members.length;

  const supabase = getSupabase();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - REGEN_SQUARE_GLP1_COOLDOWN_DAYS);
  const recent = new Set<string>();
  if (supabase) {
    const phones = members.map((m) => m.phone_number).filter(Boolean) as string[];
    if (phones.length) {
      const { data } = await supabase
        .from("agent_winback_log")
        .select("phone")
        .eq("campaign_id", REGEN_SQUARE_GLP1_CAMPAIGN)
        .gte("contacted_at", cutoff.toISOString())
        .in("phone", phones);
      for (const row of data || []) {
        if (row.phone) recent.add(String(row.phone));
      }
    }
  }

  const batch: SquareCustomer[] = [];
  for (const member of members) {
    const check = validatePhoneNumber(member.phone_number || "");
    if (!check.valid) {
      result.skippedNoPhone += 1;
      continue;
    }
    if (recent.has(check.formatted) || recent.has(member.phone_number || "")) {
      result.skippedCooldown += 1;
      continue;
    }
    batch.push({ ...member, phone_number: check.formatted });
    if (batch.length >= maxBatch) break;
  }
  result.eligible = batch.length;

  for (const member of batch) {
    const phone = member.phone_number!;
    const firstName = member.given_name || "there";
    const body = squareGlp1InviteText(firstName);
    if (dryRun) {
      result.sent += 1;
      continue;
    }
    const sms = await sendSms(phone, body);
    if (supabase) {
      await supabase.from("agent_winback_log").insert({
        square_customer_id: member.id,
        phone,
        email: member.email_address || null,
        first_name: firstName,
        campaign_id: REGEN_SQUARE_GLP1_CAMPAIGN,
        channel: "sms",
        message_preview: body.slice(0, 100),
        sms_sent: sms.success,
        sms_message_id: sms.providerMessageId,
        sms_error: sms.error || null,
      });
    }
    if (sms.success) result.sent += 1;
    else {
      result.failed += 1;
      result.errors.push(sms.error || "SMS failed");
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  result.ok = result.sent > 0 || result.eligible === 0;
  return result;
}
