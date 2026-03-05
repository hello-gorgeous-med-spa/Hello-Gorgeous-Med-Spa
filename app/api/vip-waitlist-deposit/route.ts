import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type Body = {
  section: "quantum" | "morpheus8";
  treatmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  crmTag?: string;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const { section, treatmentId, firstName, lastName, email, phone, crmTag } = body;

    if (!email || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, phone" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (supabase) {
      const name = `${firstName} ${lastName}`.trim();
      const { error } = await supabase.from("vip_waitlist").insert({
        campaign: "vip_skin_tightening",
        name,
        email: email.toLowerCase(),
        phone,
        qualification_data: { section, treatmentId },
        crm_tag: crmTag ?? "VIP Waitlist 2026",
        status: "pending",
      });
      if (error) {
        console.error("vip-waitlist-deposit DB error:", error);
        return NextResponse.json(
          { error: "Failed to save. Please try again or call us." },
          { status: 500 }
        );
      }
    }

    // TODO: Charge $500 deposit via Stripe/Square when ready
    // TODO: Send automatic confirmation email (Resend) if desired
    return NextResponse.json({ success: true, message: "You're on the list." });
  } catch (e) {
    console.error("vip-waitlist-deposit error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
