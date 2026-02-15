// ============================================================
// ADMIN: Wellness membership overview
// ============================================================

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const [subsRes, labsRes, medsRes, messagesRes] = await Promise.all([
      supabase
        .from("member_subscriptions")
        .select(`
          id,
          status,
          wellness_credit_balance,
          created_at,
          client:clients(id, first_name, last_name, email),
          program:membership_programs(id, name, slug)
        `)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("member_lab_uploads")
        .select("id, client_id, file_name, uploaded_at, processed_at")
        .is("deleted_at", null)
        .order("uploaded_at", { ascending: false })
        .limit(20),
      supabase
        .from("member_medications")
        .select("id, client_id, med_name, refill_status, refill_requested_at")
        .eq("refill_status", "pending"),
      supabase
        .from("member_messages")
        .select("id, client_id, sender_type, message_body, sent_at")
        .eq("sender_type", "client")
        .order("sent_at", { ascending: false })
        .limit(20),
    ]);

    const subscriptions = (subsRes.data || []).map((s: any) => ({
      id: s.id,
      status: s.status,
      wellnessCredits: s.wellness_credit_balance,
      createdAt: s.created_at,
      client: s.client,
      program: s.program,
    }));

    const labs = labsRes.data || [];
    const refillRequests = medsRes.data || [];
    const recentMessages = messagesRes.data || [];

    return NextResponse.json({
      subscriptions,
      labs,
      refillRequests,
      recentMessages,
      stats: {
        activeMembers: subscriptions.filter((s: any) => s.status === "active").length,
        totalLabs: labs.length,
        pendingRefills: refillRequests.length,
        unreadMessages: recentMessages.length,
      },
    });
  } catch (err) {
    console.error("[admin wellness overview]", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
