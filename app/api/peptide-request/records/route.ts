// Fetch Hello Gorgeous RX™ submission summaries by access token (client-owned receipt links).

import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { isPeptideFormSlug } from "@/lib/peptide-form-alert";

export const dynamic = "force-dynamic";

const MAX_TOKENS = 25;

type RecordRow = {
  access_token: string | null;
  submitted_at: string;
  responses_json: Record<string, unknown> | null;
  signer_name: string | null;
  template?: { slug: string } | null;
};

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: { tokens?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tokens = Array.isArray(body.tokens)
    ? body.tokens.map((t) => String(t).trim()).filter(Boolean).slice(0, MAX_TOKENS)
    : [];

  if (tokens.length === 0) {
    return NextResponse.json({ records: [] });
  }

  const { data, error } = await admin
    .from("hg_form_submissions")
    .select("access_token, submitted_at, responses_json, signer_name, template:hg_form_templates(slug)")
    .in("access_token", tokens);

  if (error) {
    console.error("[peptide-request/records]", error.message);
    return NextResponse.json({ error: "Could not load records" }, { status: 500 });
  }

  const rows = (data ?? []) as RecordRow[];
  const records = rows
    .filter((row) => {
      const slug = row.template?.slug ?? "";
      return isPeptideFormSlug(slug);
    })
    .map((row) => {
      const responses = row.responses_json ?? {};
      const slug = row.template?.slug ?? "";
      const ref = String(row.access_token ?? "").slice(0, 8).toUpperCase();
      const requestType =
        slug === "peptide-refill-request" ||
        String(responses.request_type || "").toLowerCase().includes("refill")
          ? "refill"
          : "new";
      const peptides = Array.isArray(responses.selected_peptides)
        ? (responses.selected_peptides as string[])
        : [];

      return {
        recordToken: row.access_token,
        reference: ref,
        submittedAt: row.submitted_at,
        signerName: row.signer_name,
        requestType,
        peptideNames: peptides,
        qualified: responses.qualified === true,
        providerFlags: responses.provider_flags,
      };
    });

  return NextResponse.json({ records });
}
