import "server-only";

import { classifySaleBucket } from "@/lib/payroll/catalog-buckets";
import { getWeekContaining, periodToSquareTimeRange } from "@/lib/payroll/pay-period";
import type { CollectedSaleLine, PayPeriod, TimecardSummary } from "@/lib/payroll/types";
import { listSquarePayments, type SquarePaymentRecord } from "@/lib/square/sync-payments";
import { resolveSquareAccessToken, squareApiFetch } from "@/lib/square/http";

type SquareTimecard = {
  id: string;
  team_member_id: string;
  start_at: string;
  end_at?: string;
  wage?: { hourly_rate?: { amount?: number } };
};

function hoursBetween(startIso: string, endIso?: string): number {
  if (!endIso) return 0;
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(0, ms / 3600000);
}

function mondayKeyChicago(iso: string): string {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateStr = fmt.format(d);
  const [y, m, day] = dateStr.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, day);
  const dow = new Date(utc).getUTCDay();
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const monday = new Date(utc - daysFromMonday * 86400000);
  const yy = monday.getUTCFullYear();
  const mm = String(monday.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(monday.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export async function fetchTimecards(beginIso: string, endIso: string): Promise<SquareTimecard[]> {
  const token = await resolveSquareAccessToken();
  if (!token) return [];

  const out: SquareTimecard[] = [];
  let cursor: string | undefined;

  for (;;) {
    const res = await squareApiFetch<{ timecards?: SquareTimecard[]; cursor?: string }>(
      "/v2/labor/timecards/search",
      {
        method: "POST",
        body: JSON.stringify({
          query: {
            filter: {
              start: { start_at: beginIso, end_at: endIso },
            },
          },
          ...(cursor ? { cursor } : {}),
        }),
      },
    );
    if (!res.ok) break;
    out.push(...(res.data.timecards ?? []));
    cursor = res.data.cursor;
    if (!cursor) break;
  }

  return out;
}

export function summarizeTimecards(timecards: SquareTimecard[], teamMemberId: string): TimecardSummary {
  const hoursByWeek: Record<string, number> = {};
  let totalHours = 0;

  for (const tc of timecards) {
    if (tc.team_member_id !== teamMemberId) continue;
    const h = hoursBetween(tc.start_at, tc.end_at);
    totalHours += h;
    const wk = mondayKeyChicago(tc.start_at);
    hoursByWeek[wk] = (hoursByWeek[wk] ?? 0) + h;
  }

  return { teamMemberId, totalHours, hoursByWeek };
}

/** Min weekly hours in calendar month (for Ryan oversight tier). */
export function minWeeklyHoursInMonth(
  timecards: SquareTimecard[],
  teamMemberId: string,
  yearMonth: string,
): number {
  const byWeek: Record<string, number> = {};
  for (const tc of timecards) {
    if (tc.team_member_id !== teamMemberId) continue;
    const chicagoDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(tc.start_at));
    if (!chicagoDate.startsWith(yearMonth)) continue;
    const wk = mondayKeyChicago(tc.start_at);
    byWeek[wk] = (byWeek[wk] ?? 0) + hoursBetween(tc.start_at, tc.end_at);
  }
  const weeks = Object.values(byWeek);
  return weeks.length ? Math.min(...weeks) : 0;
}

function paymentToSaleLine(p: SquarePaymentRecord): CollectedSaleLine {
  const amountCents = p.total_money?.amount ?? 0;
  const desc = p.note || p.source_type || "Square payment";
  return {
    id: p.id,
    paidAt: p.created_at,
    amountCents,
    bucket: classifySaleBucket(desc),
    teamMemberId: null,
    description: desc,
  };
}

export async function loadPayrollSquareData(period: PayPeriod): Promise<{
  timecards: SquareTimecard[];
  sales: CollectedSaleLine[];
  error?: string;
}> {
  const token = await resolveSquareAccessToken();
  if (!token) {
    return { timecards: [], sales: [], error: "Square not connected" };
  }

  const { beginIso, endIso } = periodToSquareTimeRange(period);
  const [timecards, payments] = await Promise.all([
    fetchTimecards(beginIso, endIso),
    listSquarePayments(token, beginIso, endIso),
  ]);

  return {
    timecards,
    sales: payments.map(paymentToSaleLine),
  };
}

export function currentYearMonthChicago(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .replace("/", "-")
    .slice(0, 7);
}

export function defaultPayPeriod(): PayPeriod {
  return getWeekContaining(new Date());
}
