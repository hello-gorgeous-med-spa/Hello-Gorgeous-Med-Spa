import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import {
  chicagoWeekStartYmd,
  mapLauraTaskRow,
  CC_LAURA_TASK_CATEGORIES,
} from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const COOKIE = "hg_cc_laura";

const CATEGORY_IDS = CC_LAURA_TASK_CATEGORIES.map((c) => c.id) as [string, ...string[]];

function noDb() {
  return NextResponse.json(
    { error: "Database unavailable — run migrations / check Supabase env" },
    { status: 503 },
  );
}

function lauraUnlocked(request: NextRequest, role: string): boolean {
  if (role === "owner" || role === "admin") return true;
  return request.cookies.get(COOKIE)?.value === "1";
}

function weekStartFromIso(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return chicagoWeekStartYmd(ymd);
}

const unlockSchema = z.object({
  code: z.string().trim().min(1).max(32),
});

const hoursSchema = z.object({
  task: z.string().trim().min(1).max(200),
  hrs: z.number().positive().max(24),
});

const weekSchema = z.object({
  checks: z.record(z.boolean()).optional(),
  invoiceSubmitted: z.boolean().optional(),
});

const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  orgName: z.string().trim().max(200).optional().default(""),
  category: z.enum(CATEGORY_IDS).optional().default("meeting"),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
  scheduledLocal: z.string().trim().max(32).optional(), // datetime-local fallback
  locationOrLink: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

const taskUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  orgName: z.string().trim().max(200).optional(),
  category: z.enum(CATEGORY_IDS).optional(),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
  scheduledLocal: z.string().trim().max(32).optional(),
  locationOrLink: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
  outcome: z.string().trim().max(2000).optional(),
});

/** Parse datetime-local (America/Chicago assumed) to ISO. */
function localChicagoToIso(local: string | undefined): string | null {
  if (!local || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(local)) return null;
  // Treat as Chicago wall time by appending offset estimate via Date parsing with fixed -05/-06 is fragile;
  // store as local string interpreted at noon offset: use Temporal-less approach — append Z after converting.
  // Simpler: treat as UTC-naive and mark as Chicago by formatting; for scheduling UI, append offset from Intl.
  const probe = new Date(`${local}:00`);
  if (Number.isNaN(probe.getTime())) {
    const p2 = new Date(local);
    if (Number.isNaN(p2.getTime())) return null;
    return p2.toISOString();
  }
  // Better: interpret as Chicago
  const [datePart, timePart] = local.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  // Get Chicago offset for that calendar day
  const approx = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeZoneName: "shortOffset",
    hour: "2-digit",
  }).formatToParts(approx);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "GMT-5";
  const m = tzName.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/i);
  const offH = m ? Number(m[1]) : -5;
  const offM = m?.[2] ? Number(m[2]) : 0;
  const offsetMs = (offH * 60 + Math.sign(offH || 1) * offM) * 60_000;
  const utc = Date.UTC(y, mo - 1, d, hh, mm, 0) - offsetMs;
  return new Date(utc).toISOString();
}

export async function GET(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const unlocked = lauraUnlocked(request, auth.user.role);
  const db = getSupabase();
  if (!db) return noDb();

  const weekStart = chicagoWeekStartYmd();

  if (!unlocked) {
    return NextResponse.json({ unlocked: false, weekStart });
  }

  const [{ data: hours }, { data: week }, { data: tasks }] = await Promise.all([
    db
      .from("hg_cc_laura_hours")
      .select("*")
      .eq("week_start", weekStart)
      .order("created_at", { ascending: true }),
    db.from("hg_cc_laura_weeks").select("*").eq("week_start", weekStart).maybeSingle(),
    db
      .from("hg_cc_laura_tasks")
      .select("*")
      .order("scheduled_at", { ascending: true, nullsFirst: false })
      .limit(100),
  ]);

  const mapped = (tasks || []).map((t) => mapLauraTaskRow(t as Record<string, unknown>));
  const upcoming = mapped.filter((t) => t.status === "scheduled");
  const doneThisWeek = mapped.filter(
    (t) => t.status === "completed" && t.weekStart === weekStart,
  );

  return NextResponse.json({
    unlocked: true,
    weekStart,
    hours: (hours || []).map((h) => ({
      id: h.id,
      task: h.task,
      hrs: Number(h.hrs),
      date: h.logged_on || "Today",
    })),
    checks: (week?.checks || {}) as Record<string, boolean>,
    invoiceSubmitted: !!week?.invoice_submitted,
    tasks: mapped,
    taskStats: {
      upcoming: upcoming.length,
      completedThisWeek: doneThisWeek.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const action = body?.action as string | undefined;

  if (action === "unlock") {
    const parsed = unlockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
    const expected = process.env.LAURA_DESK_CODE || "987654";
    if (parsed.data.code !== expected) {
      return NextResponse.json({ error: "Incorrect code" }, { status: 403 });
    }
    const res = NextResponse.json({ unlocked: true });
    res.cookies.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  if (!lauraUnlocked(request, auth.user.role)) {
    return NextResponse.json({ error: "Laura's Desk locked" }, { status: 403 });
  }

  const weekStart = chicagoWeekStartYmd();

  if (action === "hours") {
    const parsed = hoursSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid hours entry" }, { status: 400 });
    }
    const { data, error } = await db
      .from("hg_cc_laura_hours")
      .insert({
        week_start: weekStart,
        task: parsed.data.task,
        hrs: parsed.data.hrs,
        logged_on: "Today",
        created_by_user_id: auth.user.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      hour: {
        id: data.id,
        task: data.task,
        hrs: Number(data.hrs),
        date: data.logged_on || "Today",
      },
    });
  }

  if (action === "week") {
    const parsed = weekSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid week update" }, { status: 400 });
    }

    const { data: existing } = await db
      .from("hg_cc_laura_weeks")
      .select("*")
      .eq("week_start", weekStart)
      .maybeSingle();

    const nextChecks = parsed.data.checks ?? (existing?.checks as Record<string, boolean>) ?? {};
    const invoiceSubmitted =
      parsed.data.invoiceSubmitted ?? !!existing?.invoice_submitted;

    const { data, error } = await db
      .from("hg_cc_laura_weeks")
      .upsert(
        {
          week_start: weekStart,
          checks: nextChecks,
          invoice_submitted: invoiceSubmitted,
          updated_at: new Date().toISOString(),
          updated_by: auth.user.email || auth.user.id,
        },
        { onConflict: "week_start" },
      )
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (parsed.data.invoiceSubmitted && !existing?.invoice_submitted) {
      await db.from("hg_cc_notifications").insert({
        body: "Laura Witt submitted her weekly plan + invoice — $250 (10 hrs).",
        delivery: "Logged in Command Center",
        unread: true,
      });
    }

    return NextResponse.json({
      checks: (data.checks || {}) as Record<string, boolean>,
      invoiceSubmitted: !!data.invoice_submitted,
    });
  }

  if (action === "task_create") {
    const parsed = taskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid meeting / task" }, { status: 400 });
    }
    const scheduledAt =
      parsed.data.scheduledAt ?? localChicagoToIso(parsed.data.scheduledLocal) ?? null;
    const { data, error } = await db
      .from("hg_cc_laura_tasks")
      .insert({
        title: parsed.data.title,
        org_name: parsed.data.orgName || "",
        category: parsed.data.category,
        scheduled_at: scheduledAt,
        week_start: weekStartFromIso(scheduledAt) || weekStart,
        location_or_link: parsed.data.locationOrLink || "",
        notes: parsed.data.notes || "",
        status: "scheduled",
        created_by_user_id: auth.user.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ task: mapLauraTaskRow(data as Record<string, unknown>) });
  }

  if (action === "task_update") {
    const parsed = taskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid task update" }, { status: 400 });
    }
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (parsed.data.title !== undefined) patch.title = parsed.data.title;
    if (parsed.data.orgName !== undefined) patch.org_name = parsed.data.orgName;
    if (parsed.data.category !== undefined) patch.category = parsed.data.category;
    if (parsed.data.locationOrLink !== undefined) {
      patch.location_or_link = parsed.data.locationOrLink;
    }
    if (parsed.data.notes !== undefined) patch.notes = parsed.data.notes;
    if (parsed.data.status !== undefined) patch.status = parsed.data.status;
    if (parsed.data.outcome !== undefined) patch.outcome = parsed.data.outcome;

    if (parsed.data.scheduledAt !== undefined || parsed.data.scheduledLocal !== undefined) {
      const scheduledAt =
        parsed.data.scheduledAt !== undefined
          ? parsed.data.scheduledAt
          : localChicagoToIso(parsed.data.scheduledLocal);
      patch.scheduled_at = scheduledAt;
      patch.week_start = weekStartFromIso(scheduledAt) || weekStart;
    }

    const { data, error } = await db
      .from("hg_cc_laura_tasks")
      .update(patch)
      .eq("id", parsed.data.id)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (parsed.data.status === "completed") {
      await db.from("hg_cc_notifications").insert({
        body: `Laura completed: ${data.title}${data.org_name ? ` · ${data.org_name}` : ""}`,
        delivery: "Laura's Desk",
        unread: true,
      });
    }

    return NextResponse.json({ task: mapLauraTaskRow(data as Record<string, unknown>) });
  }

  if (action === "task_delete") {
    const id = typeof body?.id === "string" ? body.id : "";
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const { error } = await db.from("hg_cc_laura_tasks").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
