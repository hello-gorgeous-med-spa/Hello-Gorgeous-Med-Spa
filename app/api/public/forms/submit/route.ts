// HG_DEV_008 — Public form submission (intake / consent). Links to client when phone matches.

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { resolveOrCreateClientForIntake } from "@/lib/resolveClientForIntake";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: {
    slug?: string;
    responses?: Record<string, unknown>;
    signer_name?: string;
    signature_data?: string;
    client_phone?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = String(body?.slug || "").trim();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const { data: tmpl, error: te } = await admin
    .from("hg_form_templates")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (te || !tmpl) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  const responses = body.responses && typeof body.responses === "object" ? body.responses : {};
  const signerName = body.signer_name ? String(body.signer_name).trim() : null;
  const signatureData = body.signature_data ? String(body.signature_data) : null;
  const clientPhone = body.client_phone ? String(body.client_phone).trim() : null;

  let clientId: string | null = null;
  if (clientPhone) {
    const { clientId: resolved } = await resolveOrCreateClientForIntake(admin, {
      clientPhone,
      signerName: signerName,
      source: `intake_form:${slug}`,
    });
    clientId = resolved;
  }

  const token = randomBytes(24).toString("hex");
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;

  const { data: row, error: insErr } = await admin
    .from("hg_form_submissions")
    .insert({
      template_id: tmpl.id,
      client_id: clientId,
      access_token: token,
      responses_json: responses,
      signer_name: signerName,
      signature_data: signatureData,
      client_phone: clientPhone,
      submitter_ip: ip,
      user_agent: ua,
    })
    .select("id, submitted_at")
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    id: row.id,
    submitted_at: row.submitted_at,
    reference: token.slice(0, 8).toUpperCase(),
  });
}
