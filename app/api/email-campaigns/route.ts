import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: campaigns, error } = await supabase
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.log("[Email Campaigns] Table may not exist yet:", error.message);
      return NextResponse.json({ campaigns: [] });
    }

    return NextResponse.json({ campaigns: campaigns || [] });
  } catch (error: any) {
    console.error("[Email Campaigns] Error:", error);
    return NextResponse.json({ campaigns: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subject, recipientCount, status } = body;

    const { data, error } = await supabase
      .from("email_campaigns")
      .insert({
        name,
        subject,
        recipient_count: recipientCount,
        status,
        sent_at: status === "sent" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error("[Email Campaigns] Insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, campaign: data });
  } catch (error: any) {
    console.error("[Email Campaigns] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
