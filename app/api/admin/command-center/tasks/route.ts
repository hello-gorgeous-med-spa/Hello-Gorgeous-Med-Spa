import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import { mapTaskRow } from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  detail: z.string().trim().max(2000).optional().default(""),
  cat: z.enum(["call", "order", "rx", "fax", "task"]).optional().default("task"),
  due: z.enum(["today", "tomorrow", "week"]).optional().default("today"),
  assignedTo: z.string().trim().max(80).optional().default(""),
  remindAt: z
    .enum(["9am", "lunch", "2pm", "eod", "none"])
    .optional()
    .nullable(),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "on_it", "done"]).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  detail: z.string().trim().max(2000).optional(),
  assignedTo: z.string().trim().max(80).optional(),
  remindAt: z.enum(["9am", "lunch", "2pm", "eod", "none"]).optional().nullable(),
  remindState: z.enum(["none", "set", "due", "snoozed", "done"]).optional(),
});

function noDb() {
  return NextResponse.json(
    { error: "Database unavailable — run migrations / check Supabase env" },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const { data: tasks, error } = await db
    .from("hg_cc_tasks")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = (tasks || []).map((t) => t.id);
  let messagesByTask: Record<string, Record<string, unknown>[]> = {};
  if (ids.length) {
    const { data: msgs } = await db
      .from("hg_cc_task_messages")
      .select("*")
      .in("task_id", ids)
      .order("created_at", { ascending: true });
    for (const m of msgs || []) {
      const tid = String(m.task_id);
      if (!messagesByTask[tid]) messagesByTask[tid] = [];
      messagesByTask[tid].push(m);
    }
  }

  return NextResponse.json({
    tasks: (tasks || []).map((t) => mapTaskRow(t, messagesByTask[t.id] || [])),
    role: auth.user.role,
    userId: auth.user.id,
    email: auth.user.email,
  });
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const p = parsed.data;
  const by =
    auth.user.email?.split("@")[0] ||
    (auth.user.role === "owner" ? "Danielle" : "Staff");

  const remindAt = p.remindAt && p.remindAt !== "none" ? p.remindAt : null;

  const { data, error } = await db
    .from("hg_cc_tasks")
    .insert({
      title: p.title,
      detail: p.detail || "",
      cat: p.cat,
      due: p.due,
      assigned_to: p.assignedTo || "",
      created_by: by,
      created_by_user_id: auth.user.id,
      remind_at: remindAt,
      remind_state: remindAt ? "set" : "none",
      status: "open",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: mapTaskRow(data, []) });
}

export async function PATCH(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { id, ...rest } = parsed.data;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (rest.status) patch.status = rest.status;
  if (rest.title) patch.title = rest.title;
  if (rest.detail !== undefined) patch.detail = rest.detail;
  if (rest.assignedTo !== undefined) patch.assigned_to = rest.assignedTo;
  if (rest.remindAt !== undefined) {
    patch.remind_at = rest.remindAt === "none" ? null : rest.remindAt;
    if (rest.remindAt && rest.remindAt !== "none") patch.remind_state = "set";
    if (rest.remindAt === "none") patch.remind_state = "none";
  }
  if (rest.remindState) patch.remind_state = rest.remindState;

  const { data, error } = await db
    .from("hg_cc_tasks")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: msgs } = await db
    .from("hg_cc_task_messages")
    .select("*")
    .eq("task_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ task: mapTaskRow(data, msgs || []) });
}

export async function DELETE(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await db.from("hg_cc_tasks").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
