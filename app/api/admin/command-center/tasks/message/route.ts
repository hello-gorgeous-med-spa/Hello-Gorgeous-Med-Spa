import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const schema = z.object({
  taskId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const author =
    auth.user.email?.split("@")[0] ||
    (auth.user.role === "owner" ? "Danielle" : "Staff");

  const { data, error } = await db
    .from("hg_cc_task_messages")
    .insert({
      task_id: parsed.data.taskId,
      author,
      author_user_id: auth.user.id,
      body: parsed.data.body,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await db
    .from("hg_cc_tasks")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", parsed.data.taskId);

  return NextResponse.json({
    message: {
      id: data.id,
      author: data.author,
      body: data.body,
      at: data.created_at,
    },
  });
}
