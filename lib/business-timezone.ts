// ============================================================
// BUSINESS TIMEZONE — America/Chicago
// Single source of truth for booking and calendar.
// All appointment times are stored and interpreted in business timezone.
// ============================================================

export const BUSINESS_TIMEZONE = 'America/Chicago';

/**
 * Get the UTC Date that corresponds to a given local date/time in the business timezone.
 * Used when creating appointments: client selects "Feb 15, 10:00 AM" (Chicago) → we store that instant as ISO.
 */
export function businessDateTimeToUTC(
  dateOnly: string,
  hours24: number,
  minutes: number
): Date {
  const [y, m, d] = dateOnly.split('-').map(Number);
  if (!y || !m || !d) {
    throw new Error(`Invalid date format: ${dateOnly}. Use YYYY-MM-DD.`);
  }
  const monthIndex = m - 1;

  // Noon UTC on this date — we'll see what time it is in Chicago to get the offset
  const noonUTC = new Date(Date.UTC(y, monthIndex, d, 12, 0, 0));
  const chicagoNoonStr = noonUTC.toLocaleString('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  const match = chicagoNoonStr.match(/(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+)/);
  const chicagoHour = match ? parseInt(match[4], 10) : 6;
  const offsetHours = 12 - chicagoHour;

  const totalMinutes = hours24 * 60 + minutes + offsetHours * 60;
  const base = new Date(Date.UTC(y, monthIndex, d, 0, 0, 0, 0));
  return new Date(base.getTime() + totalMinutes * 60 * 1000);
}

/**
 * Return start and end of the given calendar day in business timezone, as ISO strings.
 * Used when filtering appointments by date: "show me Feb 15" = starts_at in [start, end).
 */
export function businessDayToISOBounds(dateOnly: string): { startISO: string; endISO: string } {
  const start = businessDateTimeToUTC(dateOnly, 0, 0);
  const end = businessDateTimeToUTC(dateOnly, 23, 59);
  const endMs = end.getTime() + 59 * 1000 + 999;
  return {
    startISO: start.toISOString(),
    endISO: new Date(endMs).toISOString(),
  };
}

/**
 * Day of week (0=Sunday .. 6=Saturday) for the given calendar date in business timezone.
 */
export function getBusinessDayOfWeek(dateOnly: string): number {
  const noon = businessDateTimeToUTC(dateOnly, 12, 0);
  const weekday = noon.toLocaleString('en-US', { timeZone: BUSINESS_TIMEZONE, weekday: 'short' });
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? 0;
}

/**
 * Format an ISO timestamp for display in business timezone (date + time).
 */
export function formatInBusinessTZ(isoString: string, options?: { dateStyle?: 'short' | 'medium'; timeStyle?: 'short' }): string {
  const d = new Date(isoString);
  return d.toLocaleString('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    dateStyle: options?.dateStyle ?? 'medium',
    timeStyle: options?.timeStyle ?? 'short',
  });
}
