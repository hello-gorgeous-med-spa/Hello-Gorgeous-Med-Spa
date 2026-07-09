import type { PayPeriod } from "@/lib/payroll/types";

const TZ = "America/Chicago";

/** Monday-start work week; pay period = Mon 00:00 through Sun 23:59 Chicago. */
export function getWeekContaining(date: Date = new Date()): PayPeriod {
  const parts = chicagoParts(date);
  const utc = Date.UTC(parts.year, parts.month - 1, parts.day);
  const d = new Date(utc);
  const dow = d.getUTCDay(); // 0 Sun .. 6 Sat
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const monday = new Date(utc - daysFromMonday * 86400000);
  const sunday = new Date(monday.getTime() + 6 * 86400000);

  const startDate = isoDate(monday);
  const endDate = isoDate(sunday);
  return {
    startDate,
    endDate,
    label: `Week of ${formatShort(startDate)} – ${formatShort(endDate)}`,
  };
}

export function getPreviousWeeks(count: number, from: Date = new Date()): PayPeriod[] {
  const out: PayPeriod[] = [];
  let cursor = from;
  for (let i = 0; i < count; i++) {
    const p = getWeekContaining(cursor);
    out.push(p);
    const monday = parseIsoDate(p.startDate);
    cursor = new Date(monday.getTime() - 86400000);
  }
  return out;
}

export function periodToSquareTimeRange(period: PayPeriod): { beginIso: string; endIso: string } {
  const begin = chicagoWallToUtcIso(period.startDate, "00:00:00");
  const end = chicagoWallToUtcIso(period.endDate, "23:59:59");
  return { beginIso: begin, endIso: end };
}

function chicagoParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [{ value: month }, , { value: day }, , { value: year }] = fmt.formatToParts(date);
  return { year: Number(year), month: Number(month), day: Number(day) };
}

function isoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Approximate Chicago wall time → UTC ISO (good enough for Square day boundaries). */
function chicagoWallToUtcIso(dateIso: string, time: string): string {
  const [y, m, d] = dateIso.split("-").map(Number);
  const [hh, mm, ss] = time.split(":").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hh + 5, mm, ss));
  return guess.toISOString();
}
