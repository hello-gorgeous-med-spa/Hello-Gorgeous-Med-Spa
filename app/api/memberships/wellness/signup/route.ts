// ============================================================
// WELLNESS MEMBERSHIP SIGNUP API
// Creates client + pending member_subscription
// Payment: in-person/Square or Stripe when configured
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

const PROGRAM_SLUGS = ["precision-hormone", "metabolic-reset"] as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      programSlug,
      hipaaConsent,
      termsConsent,
      medicalHistoryNote,
    } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!PROGRAM_SLUGS.includes(programSlug)) {
      return NextResponse.json({ error: "Please select a valid program." }, { status: 400 });
    }

    if (!hipaaConsent || !termsConsent) {
      return NextResponse.json(
        { error: "HIPAA consent and terms acceptance are required." },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Get program
    const { data: program, error: programError } = await supabase
      .from("membership_programs")
      .select("id, slug, name, price_cents, wellness_credits_per_period")
      .eq("slug", programSlug)
      .eq("is_active", true)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        { error: "Program not found. Please contact us." },
        { status: 404 }
      );
    }

    // 2. Find or create client
    let clientId: string;
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
      await supabase
        .from("clients")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId);
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: normalizedEmail,
          phone: phone?.trim() || null,
          client_type: "wellness_member",
          status: "active",
          source: "wellness_signup",
        })
        .select("id")
        .single();

      if (clientError || !newClient) {
        console.error("[wellness-signup] client create error:", clientError);
        return NextResponse.json(
          { error: "Could not create account. Please try again or contact us." },
          { status: 500 }
        );
      }
      clientId = newClient.id;
    }

    // 3. Check for existing active subscription
    const { data: existingSub } = await supabase
      .from("member_subscriptions")
      .select("id, status")
      .eq("client_id", clientId)
      .eq("program_id", program.id)
      .in("status", ["active"])
      .single();

    if (existingSub) {
      return NextResponse.json(
        {
          error: "You already have an active subscription to this program.",
          redirectUrl: "/portal",
        },
        { status: 400 }
      );
    }

    // 4. Create member_subscription (inactive until payment)
    const { error: subError } = await supabase.from("member_subscriptions").insert({
      client_id: clientId,
      program_id: program.id,
      status: "inactive",
      wellness_credit_balance: 0,
    });

    if (subError) {
      if (subError.code === "23505") {
        return NextResponse.json(
          { error: "You've already requested this program. We'll be in touch." },
          { status: 400 }
        );
      }
      console.error("[wellness-signup] subscription error:", subError);
      return NextResponse.json(
        { error: "Could not create membership. Please try again." },
        { status: 500 }
      );
    }

    const memberCode = `HG-WM-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      memberCode,
      program: program.name,
      message:
        "Your membership request has been received. We'll contact you shortly to complete payment and activate your membership.",
      redirectUrl: "/portal",
      paymentRequired: true,
      instructions:
        "Please call (630) 636-6193 or reply to our follow-up email to complete payment and activate your membership.",
    });
  } catch (err) {
    console.error("[wellness-signup]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us." },
      { status: 500 }
    );
  }
}
