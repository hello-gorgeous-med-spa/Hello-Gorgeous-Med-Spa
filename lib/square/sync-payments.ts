import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSquareApiHost, resolveSquareAccessToken, SQUARE_API_VERSION } from "@/lib/square/http";

const TZ = "America/Chicago";

export type SquarePaymentRecord = {
  id: string;
  created_at: string;
  updated_at?: string;
  status: string;
  total_money?: { amount?: number; currency?: string };
  tip_money?: { amount?: number };
  source_type?: string;
  card_details?: { card?: { card_brand?: string; last_4?: string } };
  order_id?: string;
  customer_id?: string;
  location_id?: string;
  note?: string;
  receipt_url?: string;
};

export type SquarePaymentSyncResult = {
  ok: boolean;
  days: number;
  fetched: number;
  upserted: number;
  error?: string;
  durationMs: number;
  syncedAt: string;
};

function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function dateInChicago(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export async function listSquarePayments(
  token: string,
  beginIso: string,
  endIso: string,
): Promise<SquarePaymentRecord[]> {
  const base = getSquareApiHost();
  const all: SquarePaymentRecord[] = [];
  let cursor: string | undefined;

  for (;;) {
    const params = new URLSearchParams({
      begin_time: beginIso,
      end_time: endIso,
      limit: "100",
      sort_order: "DESC",
    });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`${base}/v2/payments?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Square-Version": SQUARE_API_VERSION,
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) {
      const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.code || "Square payments API error";
      throw new Error(msg);
    }

    for (const p of json.payments || []) {
      if (p.status === "COMPLETED" || p.status === "APPROVED") {
        all.push(p as SquarePaymentRecord);
      }
    }

    cursor = json.cursor as string | undefined;
    if (!cursor) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  return all;
}

function paymentToRow(p: SquarePaymentRecord, syncedAt: string) {
  const amount = (p.total_money?.amount ?? 0) / 100;
  const tip = (p.tip_money?.amount ?? 0) / 100;
  return {
    id: p.id,
    date: dateInChicago(p.created_at),
    description: p.note || p.source_type || "Card payment",
    amount,
    status: p.status,
    synced_at: syncedAt,
    tip_usd: tip,
    card_brand: p.card_details?.card?.card_brand ?? null,
    card_last_four: p.card_details?.card?.last_4 ?? null,
    order_id: p.order_id ?? null,
    customer_id: p.customer_id ?? null,
    location_id: p.location_id ?? null,
    receipt_url: p.receipt_url ?? null,
    source_type: p.source_type ?? null,
    paid_at: p.created_at,
  };
}

export async function syncSquarePayments(options: {
  days?: number;
  supabase?: SupabaseClient | null;
}): Promise<SquarePaymentSyncResult> {
  const startedAt = Date.now();
  const days = Math.min(Math.max(options.days ?? 7, 1), 365);
  const syncedAt = new Date().toISOString();

  const token = await resolveSquareAccessToken();
  if (!token) {
    return {
      ok: false,
      days,
      fetched: 0,
      upserted: 0,
      error: "No Square access token — connect Square in Settings → Payments",
      durationMs: Date.now() - startedAt,
      syncedAt,
    };
  }

  const supabase = options.supabase ?? getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      days,
      fetched: 0,
      upserted: 0,
      error: "Supabase not configured",
      durationMs: Date.now() - startedAt,
      syncedAt,
    };
  }

  const end = new Date();
  const begin = new Date(Date.now() - days * 86400000);

  try {
    const payments = await listSquarePayments(token, begin.toISOString(), end.toISOString());
    const rows = payments.map((p) => paymentToRow(p, syncedAt));

    let upserted = 0;
    let upsertError: string | undefined;

    if (rows.length > 0) {
      const BATCH = 100;
      for (let i = 0; i < rows.length; i += BATCH) {
        const batch = rows.slice(i, i + BATCH);
        const { error } = await supabase.from("hg_square_transactions").upsert(batch, { onConflict: "id" });
        if (error) {
          // Fallback: core columns only if extended migration not applied yet
          const slim = batch.map(({ id, date, description, amount, status, synced_at }) => ({
            id,
            date,
            description,
            amount,
            status,
            synced_at,
          }));
          const retry = await supabase.from("hg_square_transactions").upsert(slim, { onConflict: "id" });
          if (retry.error) {
            upsertError = retry.error.message;
            break;
          }
        }
        upserted += batch.length;
      }
    }

    return {
      ok: !upsertError,
      days,
      fetched: payments.length,
      upserted,
      error: upsertError,
      durationMs: Date.now() - startedAt,
      syncedAt,
    };
  } catch (e) {
    return {
      ok: false,
      days,
      fetched: 0,
      upserted: 0,
      error: e instanceof Error ? e.message : "Sync failed",
      durationMs: Date.now() - startedAt,
      syncedAt,
    };
  }
}

export async function getSquarePaymentSyncStatus(supabase?: SupabaseClient | null) {
  const db = supabase ?? getSupabaseAdmin();
  if (!db) return null;

  const { count } = await db
    .from("hg_square_transactions")
    .select("*", { count: "exact", head: true });

  const { data: latest } = await db
    .from("hg_square_transactions")
    .select("synced_at, date, amount")
    .order("synced_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: recent } = await db
    .from("hg_square_transactions")
    .select("amount")
    .gte("date", dateInChicago(new Date(Date.now() - 30 * 86400000).toISOString()));

  const monthTotal = (recent ?? []).reduce((s, r) => s + Number(r.amount || 0), 0);

  return {
    transactionCount: count ?? 0,
    lastSyncAt: latest?.synced_at ?? null,
    lastTransactionDate: latest?.date ?? null,
    last30DaysTotalUsd: Math.round(monthTotal * 100) / 100,
  };
}
