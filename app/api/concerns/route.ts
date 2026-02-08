// ============================================================
// API: Fix What Bothers Me — submit concern & list (admin)
// POST = submit from website; GET = list for admin (auth required later)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { suggestServicesFromConcern, suggestedSlugsFromConcern } from "@/lib/concerns";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Please share what's on your mind." },
        { status: 400 }
      );
    }

    const suggestions = suggestServicesFromConcern(message);
    const slugs = suggestedSlugsFromConcern(message);

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("concern_submissions").insert({
        name: name?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        message: message.trim(),
        suggested_service_slugs: slugs,
        status: "new",
        source: "web",
      });
      if (error) console.error("Concern submission insert error:", error);
      // Still return success + suggestions so client sees thank-you and can book (e.g. if table not yet migrated)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. We'll review this and get back to you.",
      suggested: suggestions,
    });
  } catch (e) {
    console.error("Concerns POST error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ concerns: [] });
    }

    const { data, error } = await supabase
      .from("concern_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Concerns GET error:", error);
      return NextResponse.json({ concerns: [] });
    }

    return NextResponse.json({ concerns: data || [] });
  } catch (e) {
    console.error("Concerns GET error:", e);
    return NextResponse.json({ concerns: [] });
  }
}
