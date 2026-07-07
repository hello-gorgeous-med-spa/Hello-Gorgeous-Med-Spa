import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { RX_PHARMACY_PORTALS, type RxPharmacy } from "@/lib/rx-dispatch";
import {
  listAllRefillCadence,
  type RxRefillCadenceItem,
} from "@/lib/rx-refill-cadence";
import type { RxRefillPlanRow, RxRefillPlanStatus, RxRefillPlanWithClient } from "@/lib/rx-refill-plans/types";
import { cadenceToPlanSeed } from "@/lib/rx-refill-plans/types";
import { getClinicEncounter } from "@/lib/rx-clinic-encounter";
import { parseRxSupplyCycle } from "@/lib/rx-supply-cycle";

function mapRow(raw: Record<string, unknown>): RxRefillPlanRow {
  return {
    id: String(raw.id),
    client_id: String(raw.client_id),
    status: raw.status as RxRefillPlanStatus,
    source_kind: raw.source_kind as "clinic" | "intake",
    source_id: String(raw.source_id),
    track: String(raw.track || "unknown"),
    medication: String(raw.medication),
    dose_label: (raw.dose_label as string | null) ?? null,
    supply_cycle: parseRxSupplyCycle(raw.supply_cycle),
    pharmacy: (raw.pharmacy as string | null) ?? null,
    anchor_at: String(raw.anchor_at),
    next_refill_at: String(raw.next_refill_at),
    price_usd: raw.price_usd != null ? Number(raw.price_usd) : null,
    autopay_ledger_id: (raw.autopay_ledger_id as string | null) ?? null,
    draft_ledger_id: (raw.draft_ledger_id as string | null) ?? null,
    last_reminder_at: (raw.last_reminder_at as string | null) ?? null,
    metadata: (raw.metadata as Record<string, unknown>) ?? {},
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
  };
}

function pharmacyLabel(raw: string | null | undefined): string {
  if (!raw) return "—";
  const key = raw as RxPharmacy;
  return RX_PHARMACY_PORTALS[key]?.name ?? raw;
}

async function enrichCadenceItem(
  admin: SupabaseClient,
  item: RxRefillCadenceItem,
): Promise<{ pharmacy: string | null; priceUsd: number | null }> {
  if (item.source === "clinic") {
    const enc = await getClinicEncounter(item.sourceId, admin);
    return {
      pharmacy: enc?.pharmacy ? pharmacyLabel(enc.pharmacy) : null,
      priceUsd: enc?.final_total_usd ?? null,
    };
  }

  const { data: dispatch } = await admin
    .from("hg_rx_dispatch")
    .select("pharmacy")
    .eq("submission_id", item.sourceId)
    .maybeSingle();

  return { pharmacy: pharmacyLabel(dispatch?.pharmacy as string | null), priceUsd: null };
}

/** Upsert active plans from computed refill cadence (HGRX-070). */
export async function syncRefillPlansFromCadence(
  admin?: SupabaseClient | null,
): Promise<{ synced: number; tableReady: boolean }> {
  const db = admin ?? getSupabaseAdminClient();
  if (!db) return { synced: 0, tableReady: false };

  const { items, tableReady } = await listAllRefillCadence(db, { urgency: "all", limit: 80 });
  if (!tableReady) return { synced: 0, tableReady: false };

  let synced = 0;
  for (const item of items) {
    const extras = await enrichCadenceItem(db, item);
    const seed = cadenceToPlanSeed(item, extras);
    const now = new Date().toISOString();

    const { data: existing } = await db
      .from("hg_rx_refill_plans")
      .select("id, status, draft_ledger_id, autopay_ledger_id")
      .eq("source_kind", item.source)
      .eq("source_id", item.sourceId)
      .neq("status", "cancelled")
      .maybeSingle();

    if (existing?.id) {
      const { error } = await db
        .from("hg_rx_refill_plans")
        .update({
          anchor_at: seed.anchor_at,
          next_refill_at: seed.next_refill_at,
          medication: seed.medication,
          dose_label: seed.dose_label,
          supply_cycle: seed.supply_cycle,
          pharmacy: seed.pharmacy,
          price_usd: seed.price_usd,
          track: seed.track,
          updated_at: now,
        })
        .eq("id", existing.id);
      if (!error) synced += 1;
      continue;
    }

    const { error } = await db.from("hg_rx_refill_plans").insert({
      client_id: seed.client_id,
      status: "active",
      source_kind: seed.source_kind,
      source_id: seed.source_id,
      track: seed.track,
      medication: seed.medication,
      dose_label: seed.dose_label,
      supply_cycle: seed.supply_cycle,
      pharmacy: seed.pharmacy,
      anchor_at: seed.anchor_at,
      next_refill_at: seed.next_refill_at,
      price_usd: seed.price_usd,
      autopay_ledger_id: seed.autopay_ledger_id,
    });

    if (!error) synced += 1;
    else if (error.code === "42P01") return { synced: 0, tableReady: false };
    else if (error.code === "23505") synced += 1;
  }

  return { synced, tableReady: true };
}

export async function listRefillPlans(
  filters: { status?: RxRefillPlanStatus | "all"; limit?: number } = {},
  admin?: SupabaseClient | null,
): Promise<{ rows: RxRefillPlanWithClient[]; tableReady: boolean }> {
  const db = admin ?? getSupabaseAdminClient();
  if (!db) return { rows: [], tableReady: false };

  const limit = Math.min(100, Math.max(1, filters.limit ?? 50));
  let query = db
    .from("hg_rx_refill_plans")
    .select("*")
    .order("next_refill_at", { ascending: true })
    .limit(limit);

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  } else {
    query = query.neq("status", "cancelled");
  }

  const { data, error } = await query;
  if (error) {
    if (error.code === "42P01") return { rows: [], tableReady: false };
    throw new Error(error.message);
  }

  const rows = (data ?? []).map((r) => mapRow(r as Record<string, unknown>));
  const clientIds = [...new Set(rows.map((r) => r.client_id))];

  const { data: clients } = clientIds.length
    ? await db.from("clients").select("id, first_name, last_name, phone, email").in("id", clientIds)
    : { data: [] };

  const clientMap = new Map(
    (clients ?? []).map((c) => [
      String(c.id),
      {
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || null,
        phone: c.phone as string | null,
        email: c.email as string | null,
      },
    ]),
  );

  return {
    rows: rows.map((r) => {
      const c = clientMap.get(r.client_id);
      return {
        ...r,
        client_name: c?.name ?? null,
        client_phone: c?.phone ?? null,
        client_email: c?.email ?? null,
      };
    }),
    tableReady: true,
  };
}

export async function updateRefillPlanStatus(
  planId: string,
  status: RxRefillPlanStatus,
  actorEmail: string,
  admin?: SupabaseClient | null,
): Promise<RxRefillPlanRow | null> {
  const db = admin ?? getSupabaseAdminClient();
  if (!db) return null;

  const { data, error } = await db
    .from("hg_rx_refill_plans")
    .update({
      status,
      updated_at: new Date().toISOString(),
      metadata: { last_status_by: actorEmail },
    })
    .eq("id", planId)
    .select("*")
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function attachDraftLedgerToPlan(
  planId: string,
  ledgerId: string,
  admin?: SupabaseClient | null,
): Promise<void> {
  const db = admin ?? getSupabaseAdminClient();
  if (!db) return;
  await db
    .from("hg_rx_refill_plans")
    .update({ draft_ledger_id: ledgerId, updated_at: new Date().toISOString() })
    .eq("id", planId);
}
