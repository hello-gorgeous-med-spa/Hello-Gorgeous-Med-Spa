import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import { chicagoTodayYmd } from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  itemId: z.string().trim().min(1).max(80),
  done: z.boolean(),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
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

  const day =
    new URL(request.url).searchParams.get("day") || chicagoTodayYmd();

  const { data, error } = await db
    .from("hg_cc_checklist_days")
    .select("*")
    .eq("day", day)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    day,
    checks: (data?.checks as Record<string, boolean>) || {},
  });
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

  const day = parsed.data.day || chicagoTodayYmd();
  const { data: existing } = await db
    .from("hg_cc_checklist_days")
    .select("*")
    .eq("day", day)
    .maybeSingle();

  const checks = {
    ...((existing?.checks as Record<string, boolean>) || {}),
    [parsed.data.itemId]: parsed.data.done,
  };

  const by = auth.user.email || auth.user.id;
  const { data, error } = await db
    .from("hg_cc_checklist_days")
    .upsert(
      {
        day,
        checks,
        updated_at: new Date().toISOString(),
        updated_by: by,
      },
      { onConflict: "day" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    day,
    checks: (data.checks as Record<string, boolean>) || {},
  });
}
