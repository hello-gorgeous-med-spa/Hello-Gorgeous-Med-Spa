// ============================================================
// TELNYX VOICE — Answer, Speak, Gather Using AI
// Used by /api/voice/telnyx to handle incoming calls and book appointments.
// ============================================================

const TELNYX_API_BASE = 'https://api.telnyx.com/v2';

function getAuthHeader(): string {
  const key = process.env.TELNYX_API_KEY;
  if (!key) throw new Error('TELNYX_API_KEY is not set');
  return `Bearer ${key}`;
}

/**
 * Answer an incoming call. Must be called before speak or gather.
 */
export async function telnyxAnswer(callControlId: string): Promise<void> {
  const res = await fetch(`${TELNYX_API_BASE}/calls/${callControlId}/actions/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx answer failed: ${res.status} ${text}`);
  }
}

/**
 * Speak text to the caller (TTS). Use after answer.
 */
export async function telnyxSpeak(callControlId: string, payload: string, voice = 'Polly.Joanna'): Promise<void> {
  const res = await fetch(`${TELNYX_API_BASE}/calls/${callControlId}/actions/speak`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({ payload, voice }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx speak failed: ${res.status} ${text}`);
  }
}

/**
 * Start Gather Using AI to collect booking parameters from the caller.
 * Telnyx will send call.ai_gather.ended when done; webhook must handle that.
 */
export async function telnyxGatherUsingAi(callControlId: string, options: {
  greeting: string;
  parameters: Record<string, { description: string; type: string }>;
  required: string[];
  voice?: string;
}): Promise<void> {
  const schema = {
    type: 'object' as const,
    properties: options.parameters,
    required: options.required,
  };
  const res = await fetch(`${TELNYX_API_BASE}/calls/${callControlId}/actions/gather_using_ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({
      greeting: options.greeting,
      parameters: schema,
      voice: options.voice || 'Polly.Joanna',
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx gather_using_ai failed: ${res.status} ${text}`);
  }
}

/**
 * Transfer the call to a number (e.g. front desk).
 */
export async function telnyxTransfer(callControlId: string, to: string): Promise<void> {
  const res = await fetch(`${TELNYX_API_BASE}/calls/${callControlId}/actions/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({ to }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx transfer failed: ${res.status} ${text}`);
  }
}

/**
 * Hang up the call.
 */
export async function telnyxHangup(callControlId: string): Promise<void> {
  const res = await fetch(`${TELNYX_API_BASE}/calls/${callControlId}/actions/hangup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx hangup failed: ${res.status} ${text}`);
  }
}

// --- Natural language date/time resolution (America/Chicago) ---

const BUSINESS_TZ = 'America/Chicago';

/** Resolve "tomorrow", "next Tuesday", "Monday", etc. to YYYY-MM-DD in business TZ. */
export function resolvePreferredDate(preferredDate: string): string | null {
  if (!preferredDate || typeof preferredDate !== 'string') return null;
  const s = preferredDate.trim().toLowerCase();
  const now = new Date();
  const today = new Date(now.toLocaleString('en-US', { timeZone: BUSINESS_TZ }));
  today.setHours(0, 0, 0, 0);

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDow = today.getDay();

  if (s === 'today') {
    return formatDateOnly(today);
  }
  if (s === 'tomorrow') {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return formatDateOnly(d);
  }
  const nextMatch = s.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
  if (nextMatch) {
    const wantDow = dayNames.indexOf(nextMatch[1]);
    let d = new Date(today);
    d.setDate(d.getDate() + 1);
    while (d.getDay() !== wantDow) d.setDate(d.getDate() + 1);
    return formatDateOnly(d);
  }
  const dayMatch = s.match(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (dayMatch) {
    const wantDow = dayNames.indexOf(dayMatch[1]);
    let d = new Date(today);
    if (d.getDay() <= wantDow) d.setDate(d.getDate() + (wantDow - d.getDay()));
    else d.setDate(d.getDate() + (7 - d.getDay() + wantDow));
    return formatDateOnly(d);
  }
  // Try ISO or MM/DD
  const iso = s.match(/^\d{4}-\d{2}-\d{2}$/);
  if (iso) return s;
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (slash) {
    const m = parseInt(slash[1], 10);
    const day = parseInt(slash[2], 10);
    const y = slash[3] ? parseInt(slash[3], 10) : today.getFullYear();
    const year = y < 100 ? 2000 + y : y;
    const d = new Date(year, m - 1, day);
    if (!isNaN(d.getTime())) return formatDateOnly(d);
  }
  return null;
}

/** Resolve "10am", "2pm", "morning", "afternoon" to a preferred time string for slot matching. */
export function resolvePreferredTime(preferredTime: string): { hours: number; minutes: number } | null {
  if (!preferredTime || typeof preferredTime !== 'string') return null;
  const s = preferredTime.trim().toLowerCase();
  if (s.includes('morning')) return { hours: 9, minutes: 0 };
  if (s.includes('afternoon')) return { hours: 14, minutes: 0 };
  if (s.includes('evening')) return { hours: 17, minutes: 0 };
  const am = s.match(/(\d{1,2})\s*(?:am|a\.m\.?)/);
  if (am) {
    const h = parseInt(am[1], 10);
    return { hours: h === 12 ? 0 : h, minutes: 0 };
  }
  const pm = s.match(/(\d{1,2})\s*(?:pm|p\.m\.?)/);
  if (pm) {
    const h = parseInt(pm[1], 10);
    return { hours: h === 12 ? 12 : h + 12, minutes: 0 };
  }
  const colon = s.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (colon) {
    let h = parseInt(colon[1], 10);
    const m = parseInt(colon[2], 10);
    const period = (colon[3] || '').toLowerCase();
    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return { hours: h, minutes: m };
  }
  return null;
}

function formatDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Pick best available slot: prefer the requested time, else first available. */
export function pickBestSlot(
  slots: Array<{ time: string; datetime: string; available: boolean }>,
  preferredHours?: number,
  preferredMinutes?: number
): { time: string; date: string; datetime: string } | null {
  const available = slots.filter((s) => s.available);
  if (available.length === 0) return null;
  if (preferredHours != null) {
    const prefMins = preferredHours * 60 + (preferredMinutes ?? 0);
    const withDist = available.map((s) => {
      const dt = new Date(s.datetime);
      const mins = dt.getHours() * 60 + dt.getMinutes();
      return { ...s, dist: Math.abs(mins - prefMins) };
    });
    withDist.sort((a, b) => a.dist - b.dist);
    const best = withDist[0];
    const dt = new Date(best.datetime);
    return {
      time: best.time,
      date: formatDateOnly(dt),
      datetime: best.datetime,
    };
  }
  const first = available[0];
  const dt = new Date(first.datetime);
  return {
    time: first.time,
    date: formatDateOnly(dt),
    datetime: first.datetime,
  };
}
