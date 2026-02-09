// ============================================================
// API: LIST BOOKABLE SERVICES (for widget / public)
// Returns services that allow online booking
// ============================================================

import { NextResponse } from "next/server";
import { createAdminSupabaseClient, isAdminConfigured } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ services: [] });
    }
    const supabase = createAdminSupabaseClient();
    if (!supabase) return NextResponse.json({ services: [] });

    const { data: services, error } = await supabase
      .from("services")
      .select("id, name, slug, duration_minutes")
      .eq("is_active", true)
      .eq("allow_online_booking", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Booking services list error:", error);
      return NextResponse.json({ services: [] });
    }

    return NextResponse.json({
      services: (services || []).map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        duration_minutes: s.duration_minutes ?? 30,
      })),
    });
  } catch (e) {
    console.error("Booking services API:", e);
    return NextResponse.json({ services: [] });
  }
}
