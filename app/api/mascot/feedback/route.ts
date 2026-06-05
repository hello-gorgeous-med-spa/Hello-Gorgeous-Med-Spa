// ============================================================
// Mascot feedback — send to owner (widget) & list (admin)
// POST = submit from chat widget; GET = list for owner (admin)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, isAdminConfigured } from "@/lib/hgos/supabase";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Please include a message to send." },
        { status: 400 }
      );
    }

    const contactName = typeof body?.contactName === "string" ? body.contactName.trim() : null;
    const contactEmail = typeof body?.contactEmail === "string" ? body.contactEmail.trim() : null;
    const contactPhone = typeof body?.contactPhone === "string" ? body.contactPhone.trim() : null;

    if (isAdminConfigured()) {
      const supabase = createAdminSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("mascot_feedback").insert({
          message,
          contact_name: contactName || null,
          contact_email: contactEmail || null,
          contact_phone: contactPhone || null,
          source: "widget",
        });
        if (error) console.error("mascot_feedback insert error:", error);
      }
    }

    const contactLine = [contactName, contactEmail, contactPhone].filter(Boolean).join(" • ") || "No contact info";
    const emailBody = `From the Hello Gorgeous chat widget:\n\nContact: ${contactLine}\n\nMessage:\n${message}`;

    void alertStaffOnFormSubmission({
      formName: "Mascot chat",
      emailSubject: `[Mascot] ${message.slice(0, 50)}${message.length > 50 ? "…" : ""}`,
      emailBody,
      smsLines: [contactLine, message.slice(0, 200)],
      replyTo: contactEmail && contactEmail.includes("@") ? contactEmail : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Done! Danielle will get this and can follow up with you.",
    });
  } catch (e) {
    console.error("Mascot feedback POST error:", e);
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
      return NextResponse.json({ items: [] });
    }

    const { data, error } = await supabase
      .from("mascot_feedback")
      .select("id, message, contact_name, contact_email, contact_phone, source, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("mascot_feedback list error:", error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: data || [] });
  } catch (e) {
    console.error("Mascot feedback GET error:", e);
    return NextResponse.json({ items: [] });
  }
}
