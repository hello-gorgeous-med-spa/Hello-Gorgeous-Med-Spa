/**
 * GET /api/leads — List feature leads (admin only).
 * Query: ?source=face_blueprint|journey|hormone|lip_studio & limit=100 & offset=0
 *
 * POST /api/leads — Capture email + phone + opt-in before unlocking a feature.
 * Also records into unified leads table (Client Intelligence Engine).
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { getOwnerSession } from "@/lib/get-owner-session";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { recordLead, getUTMFromRequest } from "@/lib/leads";

const SOURCES = ["face_blueprint", "journey", "hormone", "lip_studio"] as const;
const SOURCE_TO_LEAD_TYPE = { face_blueprint: "face", journey: "roadmap", hormone: "hormone", lip_studio: "face" } as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\(\)\+]{10,25}$/;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  let query = supabase
    .from("feature_leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (source && SOURCES.includes(source as (typeof SOURCES)[number])) {
    query = query.eq("source", source);
  }

  const { data: leads, error, count } = await query;
  if (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ leads: leads ?? [], total: count ?? 0 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, source, marketing_opt_in } = body;

    const emailTrim = typeof email === "string" ? email.trim().toLowerCase() : "";
    const phoneTrim = typeof phone === "string" ? phone.replace(/\s/g, "").trim() : "";
    const src = typeof source === "string" && SOURCES.includes(source as (typeof SOURCES)[number]) ? source : null;
    const optIn = Boolean(marketing_opt_in);

    if (!emailTrim || !EMAIL_REGEX.test(emailTrim)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!phoneTrim || !PHONE_REGEX.test(phoneTrim)) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }
    if (!src) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }
    if (!optIn) {
      return NextResponse.json(
        { error: "Please agree to receive updates and marketing to continue" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from("feature_leads").insert({
        email: emailTrim,
        phone: phoneTrim,
        source: src,
        marketing_opt_in: optIn,
      });
      // Unified leads table (Client Intelligence Engine)
      const url = request.url || "";
      const utm = getUTMFromRequest(url, request.headers.get("referer"));
      await recordLead(supabase, {
        email: emailTrim,
        phone: phoneTrim,
        source: "website",
        lead_type: SOURCE_TO_LEAD_TYPE[src],
        metadata: { feature_source: src, marketing_opt_in: optIn },
        ...utm,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("leads API error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
