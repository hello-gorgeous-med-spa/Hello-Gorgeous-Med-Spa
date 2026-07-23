import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import {
  chicagoWeekStartYmd,
} from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const COOKIE = "hg_cc_laura";

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

  const [{ data: hours }, { data: week }] = await Promise.all([
    db
      .from("hg_cc_laura_hours")
      .select("*")
      .eq("week_start", weekStart)
      .order("created_at", { ascending: true }),
    db.from("hg_cc_laura_weeks").select("*").eq("week_start", weekStart).maybeSingle(),
  ]);

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
  });
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const action = body?.action as string | undefined;

  // Unlock with access code (Laura contractor) — owner/admin already unlocked
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

    // Invoice submit → owner notification
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

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

