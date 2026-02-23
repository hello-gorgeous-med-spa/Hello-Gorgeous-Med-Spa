/**
 * GET /api/face/roadmap-prefill?session_id=...
 * Returns recommended services from a journey roadmap session for pre-selecting on Face Blueprint.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

const ROADMAP_TO_FACE_SERVICE: Record<string, string> = {
  botox: "botox_smoothing",
  dysport: "botox_smoothing",
  jeuveau: "botox_smoothing",
  "lip filler": "lip_filler_volume",
  "lip fillers": "lip_filler_volume",
  filler: "lip_filler_volume",
  chin: "chin_projection",
  jawline: "jawline_contour",
  "under eye": "undereye_correction",
  "under-eye": "undereye_correction",
  "co2": "co2_texture_smoothing",
  laser: "co2_texture_smoothing",
  "co2 laser": "co2_texture_smoothing",
};

const FACE_SERVICE_IDS = new Set([
  "botox_smoothing",
  "lip_filler_volume",
  "chin_projection",
  "jawline_contour",
  "undereye_correction",
  "co2_texture_smoothing",
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      return NextResponse.json(
        { error: "session_id required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { recommended_services: [] },
        { status: 200 }
      );
    }

    const { data: session, error } = await supabase
      .from("journey_sessions")
      .select("ai_summary, recommended_services")
      .eq("id", session_id)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { recommended_services: [] },
        { status: 200 }
      );
    }

    const recommended = (session.recommended_services as Array<{ service: string }>) || [];
    const names = recommended.map((r) => (r.service || "").toLowerCase());
    const faceIds: string[] = [];
    const seen = new Set<string>();

    for (const name of names) {
      for (const [key, faceId] of Object.entries(ROADMAP_TO_FACE_SERVICE)) {
        if (name.includes(key) && FACE_SERVICE_IDS.has(faceId) && !seen.has(faceId)) {
          seen.add(faceId);
          faceIds.push(faceId);
        }
      }
    }

    return NextResponse.json({
      roadmap_session_id: session_id,
      recommended_services: faceIds,
    });
  } catch (e) {
    console.error("face/roadmap-prefill error", e);
    return NextResponse.json(
      { recommended_services: [] },
      { status: 200 }
    );
  }
}
