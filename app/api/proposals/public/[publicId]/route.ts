import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { publicId } = await context.params;
  if (!publicId) return NextResponse.json({ error: "publicId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("treatment_proposals")
    .select(
      "id,public_id,client_name,created_at,expires_at,status,concerns,options,pdf_url,view_count,viewed_at,client_instructions,media,payment_status,payment_kind,payment_amount_usd,payment_url,payment_option_name,paid_at,accepted_option,accepted_at,declined_at"
    )
    .eq("public_id", publicId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  const expired = data.expires_at ? new Date(data.expires_at).getTime() < Date.now() : false;
  if (expired) return NextResponse.json({ error: "Proposal has expired." }, { status: 410 });

  const updatedViewCount = (data.view_count || 0) + 1;
  // Don't overwrite terminal statuses when recording a view.
  const nextStatus =
    data.status === "draft"
      ? "viewed"
      : data.status === "accepted" || data.status === "declined" || data.status === "expired"
        ? data.status
        : data.status === "sent"
          ? "viewed"
          : data.status;

  await supabase
    .from("treatment_proposals")
    .update({ viewed_at: new Date().toISOString(), view_count: updatedViewCount, status: nextStatus })
    .eq("id", data.id);

  return NextResponse.json({
    proposal: {
      id: data.id,
      public_id: data.public_id,
      client_name: data.client_name,
      created_at: data.created_at,
      expires_at: data.expires_at,
      status: nextStatus,
      concerns: data.concerns || [],
      options: data.options || [],
      pdf_url: data.pdf_url || null,
      client_instructions: data.client_instructions || null,
      media: Array.isArray(data.media) ? data.media : [],
      payment_status: data.payment_status || "unpaid",
      payment_kind: data.payment_kind || null,
      payment_amount_usd: data.payment_amount_usd ?? null,
      payment_url: data.payment_url || null,
      payment_option_name: data.payment_option_name || null,
      paid_at: data.paid_at || null,
      accepted_option: data.accepted_option || null,
      accepted_at: data.accepted_at || null,
      declined_at: data.declined_at || null,
      view_count: updatedViewCount,
    },
  });
}
