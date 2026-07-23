import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/api-auth";
import {
  CC_CHECKLIST,
  chicagoTodayYmd,
  formatUsd,
  lastEightWeekWindows,
  overviewRangeStart,
  type CcOverviewKpi,
  type CcOverviewPayload,
  type CcOverviewRange,
} from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function sumAmount(rows: { amount?: number | null }[] | null): number {
  return (rows || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
}

function sumTips(rows: { tip_usd?: number | null }[] | null): number {
  return (rows || []).reduce((s, r) => s + (Number(r.tip_usd) || 0), 0);
}

function checklistTotal(): number {
  return CC_CHECKLIST.reduce((n, s) => n + s.items.length, 0);
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "owner" && user.role !== "admin") {
    return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  }

  const rangeParam = request.nextUrl.searchParams.get("range") || "week";
  const range: CcOverviewRange =
    rangeParam === "today" || rangeParam === "month" ? rangeParam : "week";

  const db = getSupabase();
  const today = chicagoTodayYmd();
  const start = overviewRangeStart(range, today);
  const rangeLabel =
    range === "today" ? "Today" : range === "week" ? "Last 7 days" : "This month";

  const empty: CcOverviewPayload = {
    range,
    asOf: today,
    lastSyncedAt: null,
    kpis: [],
    weeks: lastEightWeekWindows(today).map((w) => ({ ...w, amount: 0 })),
    upcoming: [],
    source: "empty",
  };

  if (!db) {
    return NextResponse.json({ ...empty, error: "Database unavailable" }, { status: 503 });
  }

  try {
    const windows = lastEightWeekWindows(today);
    const eightStart = windows[0]?.start || start;

    const [
      { data: rangeTx },
      { data: weekRows },
      { count: apptCount },
      { count: newClients },
      { count: openTasks },
      { data: checklistRow },
      { data: syncRow },
      { data: upcomingRows },
    ] = await Promise.all([
      db
        .from("hg_square_transactions")
        .select("amount, tip_usd, date")
        .eq("status", "COMPLETED")
        .gte("date", start)
        .lte("date", today),
      db
        .from("hg_square_transactions")
        .select("amount, date")
        .eq("status", "COMPLETED")
        .gte("date", eightStart)
        .lte("date", today),
      db
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("starts_at", `${start}T00:00:00`)
        .lte("starts_at", `${today}T23:59:59`),
      db
        .from("clients")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${start}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`),
      db
        .from("hg_cc_tasks")
        .select("*", { count: "exact", head: true })
        .neq("status", "done"),
      db
        .from("hg_cc_checklist_days")
        .select("checks")
        .eq("day", today)
        .maybeSingle(),
      db
        .from("hg_square_transactions")
        .select("synced_at")
        .order("synced_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      db
        .from("appointments")
        .select(
          `
          id,
          starts_at,
          scheduled_at,
          client_id,
          service:services(name)
        `,
        )
        .gte("starts_at", new Date().toISOString())
        .order("starts_at")
        .limit(6),
    ]);

    const revenue = sumAmount(rangeTx);
    const tips = sumTips(rangeTx);
    const txCount = rangeTx?.length || 0;
    const avgTicket = txCount ? revenue / txCount : 0;

    const checks = (checklistRow?.checks || {}) as Record<string, boolean>;
    const doneChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = checklistTotal();
    const checklistPct = totalChecks ? Math.round((doneChecks / totalChecks) * 100) : 0;

    const weeks = windows.map((w) => {
      const amount = (weekRows || [])
        .filter((r) => {
          const d = String(r.date).slice(0, 10);
          return d >= w.start && d <= w.end;
        })
        .reduce((s, r) => s + (Number(r.amount) || 0), 0);
      return { ...w, amount };
    });

    const clientIds = (upcomingRows || []).map((a: { client_id?: string }) => a.client_id).filter(Boolean) as string[];
    const { data: clientsData } =
      clientIds.length > 0
        ? await db
            .from("clients")
            .select("id, users!inner(first_name, last_name)")
            .in("id", clientIds)
        : { data: [] as { id: string; users?: { first_name?: string; last_name?: string } }[] };

    const clientMap = new Map(
      (clientsData || []).map((c: { id: string; users?: { first_name?: string; last_name?: string } }) => [
        c.id,
        `${c.users?.first_name || ""} ${c.users?.last_name || ""}`.trim() || "Client",
      ]),
    );

    const upcoming = (upcomingRows || []).map(
      (apt: {
        id: string;
        starts_at?: string;
        scheduled_at?: string;
        client_id?: string;
        service?: { name?: string } | { name?: string }[];
      }) => {
        const svc = Array.isArray(apt.service) ? apt.service[0] : apt.service;
        return {
          id: apt.id,
          time: apt.starts_at || apt.scheduled_at || "",
          client: clientMap.get(apt.client_id || "") || "Client",
          service: svc?.name || "Appointment",
        };
      },
    );

    const kpis: CcOverviewKpi[] = [
      {
        id: "revenue",
        label: "Revenue",
        value: revenue,
        display: formatUsd(revenue),
        sub: `${txCount} Square payment${txCount === 1 ? "" : "s"} · ${rangeLabel}`,
      },
      {
        id: "appointments",
        label: "Appointments",
        value: apptCount || 0,
        display: String(apptCount || 0),
        sub: `Booked in HG · ${rangeLabel}`,
      },
      {
        id: "new_clients",
        label: "New clients",
        value: newClients || 0,
        display: String(newClients || 0),
        sub: `Added to CRM · ${rangeLabel}`,
      },
      {
        id: "avg_ticket",
        label: "Avg ticket",
        value: avgTicket,
        display: formatUsd(avgTicket),
        sub: "Completed Square payments",
      },
      {
        id: "tips",
        label: "Tips",
        value: tips,
        display: formatUsd(tips),
        sub: `Collected · ${rangeLabel}`,
      },
      {
        id: "ops",
        label: "Ops today",
        value: checklistPct,
        display: `${checklistPct}%`,
        sub: `${openTasks || 0} open task${(openTasks || 0) === 1 ? "" : "s"} · checklist ${doneChecks}/${totalChecks}`,
      },
    ];

    const payload: CcOverviewPayload = {
      range,
      asOf: today,
      lastSyncedAt: syncRow?.synced_at || null,
      kpis,
      weeks,
      upcoming,
      source: "hg_square_transactions",
    };

    return NextResponse.json(payload);
  } catch (e) {
    console.error("[command-center/overview]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Overview failed" },
      { status: 500 },
    );
  }
}
