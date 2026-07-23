import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import {
  CC_STAFF,
  mapTimeOffRow,
} from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  who: z.string().trim().min(1).max(80),
  type: z.enum(["Vacation", "Sick", "Personal", "Other"]),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  note: z.string().trim().max(500).optional().default(""),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["approved", "denied"]),
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
    .from("hg_cc_time_off")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    requests: (data || []).map((r) => mapTimeOffRow(r as Record<string, unknown>)),
  });
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid time-off request" }, { status: 400 });
  }
  if (!(CC_STAFF as readonly string[]).includes(parsed.data.who)) {
    return NextResponse.json({ error: "Invalid who" }, { status: 400 });
  }

  const end = parsed.data.end || parsed.data.start;

  const { data, error } = await db
    .from("hg_cc_time_off")
    .insert({
      who: parsed.data.who,
      type: parsed.data.type,
      start_date: parsed.data.start,
      end_date: end,
      note: parsed.data.note || "",
      status: "pending",
      created_by_user_id: auth.user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    request: mapTimeOffRow(data as Record<string, unknown>),
  });
}

export async function PATCH(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  if (auth.user.role !== "owner" && auth.user.role !== "admin") {
    return NextResponse.json({ error: "Owner approval required" }, { status: 403 });
  }

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const decidedBy =
    auth.user.role === "owner" ? "Owner" : "Admin";

  const { data, error } = await db
    .from("hg_cc_time_off")
    .update({
      status: parsed.data.status,
      decided_by: decidedBy,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    request: mapTimeOffRow(data as Record<string, unknown>),
  });
}
