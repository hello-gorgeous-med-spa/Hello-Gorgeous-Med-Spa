// ============================================================
// GET CURRENT MEMBER SUBSCRIPTION
// Returns wellness membership status for identified client
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ subscription: null });
    }

    const email = req.nextUrl.searchParams.get("email");
    if (!email?.trim()) {
      return NextResponse.json({ subscription: null });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ subscription: null });
    }

    const { data: sub, error } = await supabase
      .from("member_subscriptions")
      .select("id, status, wellness_credit_balance, current_period_start, current_period_end, program_id")
      .eq("client_id", client.id)
      .eq("status", "active")
      .single();

    if (error || !sub) {
      return NextResponse.json({ subscription: null });
    }

    let program: { id: string; slug: string; name: string } | null = null;
    if (sub.program_id) {
      const { data: prog } = await supabase
        .from("membership_programs")
        .select("id, slug, name")
        .eq("id", sub.program_id)
        .single();
      program = prog;
    }

    return NextResponse.json({
      subscription: {
        id: sub.id,
        status: sub.status,
        wellnessCreditBalance: sub.wellness_credit_balance ?? 0,
        currentPeriodStart: sub.current_period_start,
        currentPeriodEnd: sub.current_period_end,
        program,
      },
    });
  } catch {
    return NextResponse.json({ subscription: null });
  }
}
