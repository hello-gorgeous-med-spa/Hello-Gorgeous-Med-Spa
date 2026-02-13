import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** GET - List media, optionally filter by use_case */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const useCase = searchParams.get("use_case");

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ media: [] });
  }

  let query = supabase.from("media").select("*").order("created_at", { ascending: false });
  if (useCase) {
    query = query.eq("use_case", useCase);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ media: data || [] });
}
