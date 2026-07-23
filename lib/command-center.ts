/** Command Center — shared types + Team Hub checklist template */

export const CC_STAFF = [
  "Danielle",
  "Ryan",
  "Marissa",
  "Michelle",
  "Laura",
  "Jen",
] as const;

export type CcTaskCat = "call" | "order" | "rx" | "fax" | "task";
export type CcTaskDue = "today" | "tomorrow" | "week";
export type CcTaskStatus = "open" | "on_it" | "done";
export type CcRemindAt = "9am" | "lunch" | "2pm" | "eod" | "none";

export type CcTask = {
  id: string;
  title: string;
  detail: string;
  cat: CcTaskCat;
  due: CcTaskDue;
  status: CcTaskStatus;
  assignedTo: string;
  by: string;
  remindAt: CcRemindAt | null;
  remindState: "none" | "set" | "due" | "snoozed" | "done";
  thread: { id: string; author: string; body: string; at: string }[];
  updatedAt: string;
  createdAt: string;
};

export type CcChecklistSection = {
  id: string;
  label: string;
  items: { id: string; label: string }[];
};

/** Daily ops — Opening / Midday / Closing */
export const CC_CHECKLIST: CcChecklistSection[] = [
  {
    id: "opening",
    label: "Opening",
    items: [
      { id: "open_lights", label: "Lights, music, treatment rooms ready" },
      { id: "open_ipad", label: "iPads / Square POS unlocked & online" },
      { id: "open_schedule", label: "Review today’s schedule + consents" },
      { id: "open_fridge", label: "Check fridge / injectables stocked" },
      { id: "open_lobby", label: "Lobby tidy · water · retail faces forward" },
    ],
  },
  {
    id: "midday",
    label: "Midday",
    items: [
      { id: "mid_rooms", label: "Turn over rooms · laundry started" },
      { id: "mid_confirm", label: "Confirm afternoon arrivals" },
      { id: "mid_messages", label: "Clear voicemail / Text Studio inbox" },
      { id: "mid_stock", label: "Restock gauze, gloves, aftercare kits" },
    ],
  },
  {
    id: "closing",
    label: "Closing",
    items: [
      { id: "close_cash", label: "Square close-out / tip report" },
      { id: "close_rooms", label: "Rooms wiped · devices powered down" },
      { id: "close_laundry", label: "Laundry finished or staged" },
      { id: "close_tomorrow", label: "Pull tomorrow’s charts / consents" },
      { id: "close_alarm", label: "Alarm set · doors locked" },
    ],
  },
];

export const CC_CAT_LABEL: Record<CcTaskCat, string> = {
  call: "Call",
  order: "Order",
  rx: "Rx",
  fax: "Fax",
  task: "Task",
};

export const CC_DUE_LABEL: Record<CcTaskDue, string> = {
  today: "Today",
  tomorrow: "Tomorrow",
  week: "This week",
};

export type CcOverviewRange = "today" | "week" | "month";

export type CcOverviewKpi = {
  id: string;
  label: string;
  value: number;
  display: string;
  sub: string;
};

export type CcOverviewWeekBar = {
  label: string;
  start: string;
  end: string;
  amount: number;
};

export type CcOverviewUpcoming = {
  id: string;
  time: string;
  client: string;
  service: string;
};

export type CcOverviewPayload = {
  range: CcOverviewRange;
  asOf: string;
  lastSyncedAt: string | null;
  kpis: CcOverviewKpi[];
  weeks: CcOverviewWeekBar[];
  upcoming: CcOverviewUpcoming[];
  source: string;
};

export function chicagoTodayYmd(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Shift a YYYY-MM-DD calendar day by `days` (Chicago date arithmetic). */
export function shiftYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return utc.toISOString().slice(0, 10);
}

export function chicagoMonthStartYmd(ymd: string = chicagoTodayYmd()): string {
  return `${ymd.slice(0, 7)}-01`;
}

/** Inclusive start YMD for Overview range (America/Chicago calendar). */
export function overviewRangeStart(range: CcOverviewRange, today = chicagoTodayYmd()): string {
  if (range === "today") return today;
  if (range === "week") return shiftYmd(today, -6);
  return chicagoMonthStartYmd(today);
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

/** Last 8 Mon–Sun-ish buckets ending today (7-day windows walking back). */
export function lastEightWeekWindows(today = chicagoTodayYmd()): { start: string; end: string; label: string }[] {
  const out: { start: string; end: string; label: string }[] = [];
  let end = today;
  for (let i = 0; i < 8; i++) {
    const start = shiftYmd(end, -6);
    const mid = shiftYmd(start, 3);
    const [y, m, d] = mid.split("-").map(Number);
    const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    out.unshift({ start, end, label });
    end = shiftYmd(start, -1);
  }
  return out;
}

export function mapTaskRow(row: Record<string, unknown>, messages: Record<string, unknown>[] = []): CcTask {
  return {
    id: String(row.id),
    title: String(row.title || ""),
    detail: String(row.detail || ""),
    cat: (row.cat as CcTaskCat) || "task",
    due: (row.due as CcTaskDue) || "today",
    status: (row.status as CcTaskStatus) || "open",
    assignedTo: String(row.assigned_to || ""),
    by: String(row.created_by || ""),
    remindAt: (row.remind_at as CcRemindAt) || null,
    remindState: (row.remind_state as CcTask["remindState"]) || "none",
    thread: messages.map((m) => ({
      id: String(m.id),
      author: String(m.author || ""),
      body: String(m.body || ""),
      at: String(m.created_at || ""),
    })),
    updatedAt: String(row.updated_at || ""),
    createdAt: String(row.created_at || ""),
  };
}
