import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  resolveHubSquareToken,
  hubSquareApiBase,
  HUB_SQUARE_API_VERSION,
} from "@/lib/hub/square-hub-token";

const TZ = "America/Chicago";

function dateInChicago(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function todayInChicago(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function yearMonthChicago(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  return `${y}-${m}`;
}

type Pay = { id: string; created_at: string; amountCents: number };

function segment(
  payments: Pay[],
  pred: (iso: string) => boolean
): { total: number; count: number; avg: number } {
  const sel = payments.filter((p) => pred(p.created_at));
  const total = sel.reduce((s, p) => s + p.amountCents, 0);
  const count = sel.length;
  const avg = count ? Math.round(total / count) : 0;
  return { total, count, avg };
}

function topWeekdayName(payments: Pay[], pred: (iso: string) => boolean): string {
  const totals: Record<string, number> = {};
  for (const p of payments) {
    if (!pred(p.created_at)) continue;
    const wd = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long" }).format(new Date(p.created_at));
    totals[wd] = (totals[wd] || 0) + p.amountCents;
  }
  let best = "—";
  let max = 0;
  for (const [k, v] of Object.entries(totals)) {
    if (v > max) {
      max = v;
      best = k;
    }
  }
  return best;
}

async function listCompletedPayments(token: string, beginIso: string, endIso: string): Promise<Pay[]> {
  const base = hubSquareApiBase();
  const all: Pay[] = [];
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
        "Square-Version": HUB_SQUARE_API_VERSION,
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.errors?.[0]?.detail || json?.errors?.[0]?.code || "Square payments error");
    }

    for (const p of json.payments || []) {
      if (p.status !== "COMPLETED") continue;
      const cents = Number(p.total_money?.amount ?? 0);
      all.push({
        id: p.id as string,
        created_at: p.created_at as string,
        amountCents: cents,
      });
    }

    cursor = json.cursor as string | undefined;
    if (!cursor) break;
    await new Promise((r) => setTimeout(r, 120));
  }

  return all;
}

/**
 * HG_DEV_SQUARE_001 — Payments slice: today / rolling 7d / calendar month (America/Chicago).
 * Amounts in cents. Token: OAuth first, then env (see docs/HUB-SQUARE-SETUP.md).
 */
export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const resolved = await resolveHubSquareToken();
  if ("error" in resolved) {
    return NextResponse.json(
      {
        today: { total: 0, count: 0, avg: 0 },
        week: { total: 0, count: 0, avg: 0 },
        month: { total: 0, count: 0, avg: 0 },
        topDay: "—",
        cached: false,
        synced: new Date().toISOString(),
        error: resolved.error,
        setupPath: resolved.setupPath,
      },
      { status: 200 }
    );
  }

  const end = new Date();
  const begin = new Date(Date.now() - 40 * 86400000 * 1000);
  const beginIso = begin.toISOString();
  const endIso = end.toISOString();

  const thisYm = yearMonthChicago(new Date());
  const todayStr = todayInChicago();
  const weekCutoff = Date.now() - 7 * 86400000 * 1000;

  try {
    const raw = await listCompletedPayments(resolved.token, beginIso, endIso);

    const supabase = getSupabaseAdminClient();
    if (supabase && raw.length > 0) {
      const rows = raw.map((p) => ({
        id: p.id,
        date: dateInChicago(p.created_at),
        description: "Card payment",
        amount: p.amountCents / 100,
        status: "COMPLETED",
        synced_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("hg_square_transactions").upsert(rows, { onConflict: "id" });
      if (error) {
        console.warn("[square-revenue] cache upsert:", error.message);
      }
    }

    const payments = raw;

    const todayStats = segment(payments, (iso) => dateInChicago(iso) === todayStr);
    const weekStats = segment(payments, (iso) => new Date(iso).getTime() >= weekCutoff);
    const monthStats = segment(payments, (iso) => yearMonthChicago(new Date(iso)) === thisYm);
    const topDay = topWeekdayName(payments, (iso) => yearMonthChicago(new Date(iso)) === thisYm);

    const payload: Record<string, unknown> = {
      today: todayStats,
      week: weekStats,
      month: monthStats,
      topDay,
      cached: false,
      synced: new Date().toISOString(),
      connection: resolved.connection,
    };

    if (resolved.connection === "env") {
      payload.warning =
        "Using SQUARE_ACCESS_TOKEN. Connect Square OAuth in Admin → Settings → Payments for one system.";
    }

    return NextResponse.json(payload);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Square fetch failed";
    return NextResponse.json(
      {
        today: { total: 0, count: 0, avg: 0 },
        week: { total: 0, count: 0, avg: 0 },
        month: { total: 0, count: 0, avg: 0 },
        topDay: "—",
        cached: false,
        synced: new Date().toISOString(),
        error: msg,
      },
      { status: 502 }
    );
  }
}
