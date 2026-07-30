import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { calculateTotal, type ProposalOption } from "@/lib/proposals/utils";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    if (!publicId) return NextResponse.json({ error: "publicId is required." }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "").toLowerCase();
    const optionName = String(body?.optionName || "").trim();

    if (action !== "accept" && action !== "decline") {
      return NextResponse.json({ error: "action must be accept or decline." }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    const { data, error } = await supabase
      .from("treatment_proposals")
      .select(
        "id,public_id,client_name,client_email,client_phone,status,expires_at,options,accepted_option,payment_status"
      )
      .eq("public_id", publicId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

    const expired = data.expires_at ? new Date(data.expires_at).getTime() < Date.now() : false;
    if (expired) return NextResponse.json({ error: "Proposal has expired." }, { status: 410 });

    if (data.status === "declined" && action === "decline") {
      return NextResponse.json({
        success: true,
        status: "declined",
        message: "This proposal was already declined.",
      });
    }

    if (data.payment_status === "paid" || data.payment_status === "deposit_paid") {
      return NextResponse.json(
        { error: "This plan already has a payment on file. Call us if you need changes." },
        { status: 409 }
      );
    }

    const options = (Array.isArray(data.options) ? data.options : []) as ProposalOption[];
    const now = new Date().toISOString();

    if (action === "accept") {
      if (!optionName) {
        return NextResponse.json({ error: "Please choose a plan option to accept." }, { status: 400 });
      }
      const selected = options.find((option) => option.name === optionName);
      if (!selected) {
        return NextResponse.json({ error: "That plan option was not found on this proposal." }, { status: 400 });
      }

      const total = calculateTotal(selected);
      const { error: updateError } = await supabase
        .from("treatment_proposals")
        .update({
          status: "accepted",
          accepted_option: optionName,
          accepted_at: now,
          declined_at: null,
          updated_at: now,
        })
        .eq("id", data.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      await alertStaffOnFormSubmission({
        formName: "Treatment proposal accepted",
        emailSubject: `Proposal accepted — ${data.client_name} chose ${optionName}`,
        emailBody: [
          `${data.client_name} accepted their treatment proposal.`,
          `Plan: ${optionName}`,
          `Total: $${total.toFixed(2)}`,
          `Public link: ${SITE.url}/proposals/${data.public_id}`,
          `Email: ${data.client_email || "n/a"}`,
          `Phone: ${data.client_phone || "n/a"}`,
          `Admin: ${SITE.url}/admin/proposals`,
        ].join("\n"),
        smsLines: [
          data.client_name,
          `Accepted: ${optionName}`,
          `$${total.toFixed(0)}`,
          data.client_phone || data.client_email || "",
        ],
        replyTo: data.client_email || undefined,
      });

      return NextResponse.json({
        success: true,
        status: "accepted",
        accepted_option: optionName,
        message: `You chose ${optionName}. We'll follow up to lock in your appointments.`,
      });
    }

    const { error: declineError } = await supabase
      .from("treatment_proposals")
      .update({
        status: "declined",
        declined_at: now,
        accepted_option: null,
        accepted_at: null,
        updated_at: now,
      })
      .eq("id", data.id);

    if (declineError) {
      return NextResponse.json({ error: declineError.message }, { status: 500 });
    }

    await alertStaffOnFormSubmission({
      formName: "Treatment proposal declined",
      emailSubject: `Proposal declined — ${data.client_name}`,
      emailBody: [
        `${data.client_name} declined their treatment proposal.`,
        `Public link: ${SITE.url}/proposals/${data.public_id}`,
        `Email: ${data.client_email || "n/a"}`,
        `Phone: ${data.client_phone || "n/a"}`,
        `Admin: ${SITE.url}/admin/proposals`,
      ].join("\n"),
      smsLines: [data.client_name, "Declined proposal", data.client_phone || data.client_email || ""],
      replyTo: data.client_email || undefined,
    });

    return NextResponse.json({
      success: true,
      status: "declined",
      message: "Thanks for letting us know. We're here if you want to revisit later.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save your response.";
    console.error("[proposals/public/respond]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
