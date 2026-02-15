// ============================================================
// MEMBER MEDICATIONS API - List, add, update
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ medications: [] });

    const email = req.nextUrl.searchParams.get("email");
    if (!email?.trim()) return NextResponse.json({ medications: [] });

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) return NextResponse.json({ medications: [] });

    const { data: meds, error } = await supabase
      .from("member_medications")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ medications: [] });

    return NextResponse.json({
      medications: (meds || []).map((m) => ({
        id: m.id,
        medName: m.med_name,
        dosage: m.dosage,
        unit: m.unit,
        category: m.category,
        startDate: m.start_date,
        endDate: m.end_date,
        refillStatus: m.refill_status,
        refillRequestedAt: m.refill_requested_at,
        notes: m.notes,
        createdAt: m.created_at,
      })),
    });
  } catch {
    return NextResponse.json({ medications: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const body = await req.json();
    const { email, medName, dosage, unit, category, startDate, endDate, notes } = body;

    if (!email?.trim() || !medName?.trim()) {
      return NextResponse.json({ error: "Email and medication name required." }, { status: 400 });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const { data: med, error } = await supabase
      .from("member_medications")
      .insert({
        client_id: client.id,
        med_name: medName.trim(),
        dosage: dosage?.trim() || null,
        unit: unit?.trim() || "units",
        category: category || null,
        start_date: startDate || null,
        end_date: endDate || null,
        refill_status: "active",
        notes: notes?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[member-meds POST]", error);
      return NextResponse.json({ error: "Failed to add medication." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: med.id });
  } catch (err) {
    console.error("[member-meds POST]", err);
    return NextResponse.json({ error: "Failed to add medication." }, { status: 500 });
  }
}
