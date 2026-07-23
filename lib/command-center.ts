/** Command Center — shared types + Team Hub checklist template */

export const CC_STAFF = [
  "Danielle",
  "Ryan",
  "Marissa",
  "Michelle",
  "Laura",
  "Jen",
] as const;

/** Prototype staff list order for message From dropdown */
export const CC_MSG_FROM = ["Ryan", "Marissa", "Danielle", "Michelle", "Laura", "Jen"] as const;

export const CC_MSG_TO = ["Everyone", ...CC_MSG_FROM] as const;

export const CC_MSG_TEMPLATES: { label: string; text: string }[] = [
  { label: "— Choose a template —", text: "" },
  {
    label: "Relay to a provider",
    text: "Relay: [client] asked about [topic]. Can you follow up with them today?",
  },
  {
    label: "Client running late",
    text: "Heads up — [client] is running ~15 min late for their [time] appointment.",
  },
  {
    label: "Please call a client back",
    text: "Can you please call [client] at [phone] about [reason]?",
  },
  {
    label: "Shift coverage needed",
    text: "Need coverage for [day/time]. Please let me know if you can take it.",
  },
  {
    label: "Supply / restock",
    text: "We're low on [item] — please reorder or restock today.",
  },
  {
    label: "Team announcement",
    text: "Team — [announcement]. Thank you!",
  },
  {
    label: "Kudos / great job",
    text: "Amazing work today, team — [note]. You're the best! 💕",
  },
  {
    label: "Meeting reminder",
    text: "Reminder: team huddle [day] at [time]. See you there!",
  },
];

export const CC_TIME_OFF_TYPES = ["Vacation", "Sick", "Personal", "Other"] as const;
export type CcTimeOffType = (typeof CC_TIME_OFF_TYPES)[number];
export type CcTimeOffStatus = "pending" | "approved" | "denied";

export type CcStaffMessage = {
  id: string;
  from: string;
  to: string;
  text: string;
  time: string;
  createdAt: string;
};

export type CcTimeOff = {
  id: string;
  who: string;
  type: CcTimeOffType;
  start: string;
  end: string;
  note: string;
  status: CcTimeOffStatus;
  decidedBy: string | null;
  createdAt: string;
};

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

export function formatCcRelativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function mapStaffMessageRow(row: Record<string, unknown>): CcStaffMessage {
  const createdAt = String(row.created_at || "");
  return {
    id: String(row.id),
    from: String(row.from_name || ""),
    to: String(row.to_name || ""),
    text: String(row.body || ""),
    time: formatCcRelativeTime(createdAt),
    createdAt,
  };
}

export function mapTimeOffRow(row: Record<string, unknown>): CcTimeOff {
  return {
    id: String(row.id),
    who: String(row.who || ""),
    type: (row.type as CcTimeOffType) || "Vacation",
    start: String(row.start_date || "").slice(0, 10),
    end: String(row.end_date || row.start_date || "").slice(0, 10),
    note: String(row.note || ""),
    status: (row.status as CcTimeOffStatus) || "pending",
    decidedBy: row.decided_by ? String(row.decided_by) : null,
    createdAt: String(row.created_at || ""),
  };
}

const CC_MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatCcDateRange(start: string, end: string): string {
  const fmt = (s: string) => {
    if (!s) return "";
    const p = s.split("-");
    return `${CC_MO[(+p[1]) - 1] || ""} ${+p[2]}`;
  };
  const a = fmt(start);
  if (!end || end === start) return a;
  return `${a} → ${fmt(end)}`;
}
