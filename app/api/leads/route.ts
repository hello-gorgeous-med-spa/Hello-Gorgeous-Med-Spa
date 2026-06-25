/**
 * GET /api/leads — List feature leads (admin only).
 * Query: ?source=face_blueprint|journey|hormone|lip_studio|peptide_guide & limit=100 & offset=0
 *
 * POST /api/leads — Capture email + phone + opt-in before unlocking a feature.
 * Also records into unified leads table (Client Intelligence Engine).
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { getOwnerSession } from "@/lib/get-owner-session";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { recordLead, getUTMFromRequest } from "@/lib/leads";

const FEATURE_SOURCES = ["face_blueprint", "journey", "hormone", "lip_studio"] as const;
const GUIDE_SOURCES = ["peptide_guide"] as const;
const GENERIC_SOURCES = ["exit_intent", "subscribe", "popup", "footer", "homepage"] as const;
const ALL_SOURCES = [...FEATURE_SOURCES, ...GUIDE_SOURCES, ...GENERIC_SOURCES] as const;
const SOURCE_TO_LEAD_TYPE: Record<string, string> = { 
  face_blueprint: "face", 
  journey: "roadmap", 
  hormone: "hormone", 
  lip_studio: "face",
  peptide_guide: "peptide",
  exit_intent: "subscribe",
  subscribe: "subscribe",
  popup: "subscribe",
  footer: "subscribe",
  homepage: "subscribe",
};
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

  if (source && (FEATURE_SOURCES.includes(source as (typeof FEATURE_SOURCES)[number]) || GUIDE_SOURCES.includes(source as (typeof GUIDE_SOURCES)[number]))) {
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
    const src = typeof source === "string" && ALL_SOURCES.includes(source as (typeof ALL_SOURCES)[number]) ? source : null;
    const optIn = Boolean(marketing_opt_in);
    const isFeatureSource = src && FEATURE_SOURCES.includes(src as (typeof FEATURE_SOURCES)[number]);
    const isGuideSource = src && GUIDE_SOURCES.includes(src as (typeof GUIDE_SOURCES)[number]);

    if (!emailTrim || !EMAIL_REGEX.test(emailTrim)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    // Phone required for interactive feature gates (not guide downloads)
    if (isFeatureSource && (!phoneTrim || !PHONE_REGEX.test(phoneTrim))) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }
    if (!src) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }
    // Opt-in required for feature + guide captures
    if ((isFeatureSource || isGuideSource) && !optIn) {
      return NextResponse.json(
        { error: "Please agree to receive updates and marketing to continue" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      if (isFeatureSource || isGuideSource) {
        await supabase.from("feature_leads").insert({
          email: emailTrim,
          phone: phoneTrim || null,
          source: src,
          marketing_opt_in: optIn,
        });
      }
      // Unified leads table (Client Intelligence Engine) — all sources
      const url = request.url || "";
      const utm = getUTMFromRequest(url, request.headers.get("referer"));
      await recordLead(supabase, {
        email: emailTrim,
        phone: phoneTrim || undefined,
        source: "website",
        lead_type: SOURCE_TO_LEAD_TYPE[src] || "subscribe",
        metadata: { feature_source: src, marketing_opt_in: optIn },
        ...utm,
      });
      
      // If phone provided, update sms_opt_in for nurture
      if (phoneTrim && optIn) {
        await supabase
          .from("leads")
          .update({ sms_opt_in: true })
          .eq("email", emailTrim)
          .order("created_at", { ascending: false })
          .limit(1);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("leads API error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
