// ============================================================
// MEMBER MESSAGES API - List and send messages
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ messages: [] });

    const email = req.nextUrl.searchParams.get("email");
    if (!email?.trim()) return NextResponse.json({ messages: [] });

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) return NextResponse.json({ messages: [] });

    const { data: messages, error } = await supabase
      .from("member_messages")
      .select("id, sender_type, message_body, sent_at, read_at")
      .eq("client_id", client.id)
      .order("sent_at", { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ messages: [] });

    return NextResponse.json({
      messages: (messages || []).map((m) => ({
        id: m.id,
        senderType: m.sender_type,
        body: m.message_body,
        sentAt: m.sent_at,
        readAt: m.read_at,
      })),
    });
  } catch {
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const body = await req.json();
    const { email, messageBody } = body;

    if (!email?.trim() || !messageBody?.trim()) {
      return NextResponse.json({ error: "Email and message required." }, { status: 400 });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const { data: msg, error } = await supabase
      .from("member_messages")
      .insert({
        client_id: client.id,
        sender_type: "client",
        message_body: messageBody.trim().slice(0, 4000),
      })
      .select("id, sent_at")
      .single();

    if (error) {
      console.error("[member-messages POST]", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: msg.id, sentAt: msg.sent_at });
  } catch (err) {
    console.error("[member-messages POST]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
