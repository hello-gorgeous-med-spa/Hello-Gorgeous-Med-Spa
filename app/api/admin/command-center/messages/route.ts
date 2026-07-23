import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import { CC_MSG_FROM, CC_MSG_TO, mapStaffMessageRow } from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const postSchema = z.object({
  from: z.string().trim().min(1).max(80),
  to: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(2000),
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

  const { data, error } = await db
    .from("hg_cc_staff_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    messages: (data || []).map((r) => mapStaffMessageRow(r as Record<string, unknown>)),
  });
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  if (!(CC_MSG_FROM as readonly string[]).includes(parsed.data.from)) {
    return NextResponse.json({ error: "Invalid from" }, { status: 400 });
  }
  if (!(CC_MSG_TO as readonly string[]).includes(parsed.data.to)) {
    return NextResponse.json({ error: "Invalid to" }, { status: 400 });
  }

  const { data, error } = await db
    .from("hg_cc_staff_messages")
    .insert({
      from_name: parsed.data.from,
      to_name: parsed.data.to,
      body: parsed.data.text,
      created_by_user_id: auth.user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: mapStaffMessageRow(data as Record<string, unknown>),
  });
}
