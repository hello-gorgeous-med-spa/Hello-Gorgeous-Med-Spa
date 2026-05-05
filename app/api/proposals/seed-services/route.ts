import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/get-owner-session";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { HELLO_GORGEOUS_SERVICES } from "@/lib/proposals/seed-services";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const payload = HELLO_GORGEOUS_SERVICES.map((service, index) => ({
    service_id: service.id,
    name: service.name,
    category: service.category,
    description: service.description || null,
    base_price: service.price,
    unit: service.unit,
    sort_order: index,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from("services_catalog")
    .upsert(payload, { onConflict: "service_id" })
    .select("id, service_id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, count: data?.length ?? 0 });
}
