// ============================================================
// CHECKOUT API - SQUARE PRIMARY
// ============================================================
// 
// ⚠️  STRIPE IS DEPRECATED FOR HELLO GORGEOUS MED SPA
// 
// Decision: FINAL (Owner Decision)
// Primary Processor: SQUARE
// 
// Memberships are handled through Square or in-person payments.
// Online checkout redirects to booking with payment at appointment.
// ============================================================

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

// Membership pricing configuration
const MEMBERSHIP_PRICING = {
  monthly: {
    price: 49,
    interval: "month",
    freeService: false,
  },
  annual: {
    price: 399,
    interval: "year",
    freeService: true,
    freeServiceValue: 75,
  },
};

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, plan, payment_method } = body;

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!plan || !["monthly", "annual"].includes(plan)) {
      return NextResponse.json(
        { error: "Please select a valid plan" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const selectedPlan = MEMBERSHIP_PRICING[plan as keyof typeof MEMBERSHIP_PRICING];
    const supabase = createServerSupabaseClient();

    // Generate membership code
    const memberCode = `HG-MBR-${Date.now().toString(36).toUpperCase()}`;

    // Log membership interest
    console.log(`[MEMBERSHIP REQUEST] ${new Date().toISOString()}`);
    console.log(`  Email: ${normalizedEmail}`);
    console.log(`  Plan: ${plan}`);
    console.log(`  Price: $${selectedPlan.price}/${selectedPlan.interval}`);

    // For memberships, we create a pending membership record
    // Payment is collected in-person via Square at the spa
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .insert({
        email: normalizedEmail,
        membership_type: plan,
        status: 'pending_payment',
        price_cents: selectedPlan.price * 100,
        billing_interval: selectedPlan.interval,
        free_service_eligible: selectedPlan.freeService,
        membership_code: memberCode,
      })
      .select()
      .single();

    if (membershipError) {
      console.warn('Membership record creation warning:', membershipError.message);
    }

    // Return success with instructions for in-person payment
    return NextResponse.json({
      success: true,
      message: "Membership request received. Complete payment at your next visit.",
      processor: "square",
      payment_method: "in_person",
      plan: plan,
      price: selectedPlan.price,
      interval: selectedPlan.interval,
      freeServiceEligible: selectedPlan.freeService,
      memberCode: memberCode,
      instructions: "Visit Hello Gorgeous Med Spa to complete your membership with Square payment.",
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
