// ============================================================
// API: Fix What Bothers Me — submit concern & list (admin)
// POST = submit from website; GET = list for admin (auth required later)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { suggestServicesFromConcern, suggestedSlugsFromConcern } from "@/lib/concerns";
import { recordLead, getUTMFromRequest } from "@/lib/leads";

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

      // Unified lead capture (Client Intelligence Engine) — require email
      if (email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        const url = request.url || "";
        const utm = getUTMFromRequest(url, request.headers.get("referer"));
        await recordLead(supabase, {
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || undefined,
          full_name: name?.trim() || undefined,
          source: "website",
          lead_type: "concern",
          metadata: { suggested_slugs: slugs },
          ...utm,
        });
      }
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
