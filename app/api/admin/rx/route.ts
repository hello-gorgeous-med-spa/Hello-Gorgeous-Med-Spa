import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { RxPaymentLedgerRow } from "@/lib/rx-payment-ledger";
import {
  RX_INTAKE_SLUGS,
  defaultDispatchFromIntake,
  intakeDisplayName,
  intakeTrackFromSlug,
  type RxDispatchRecord,
} from "@/lib/rx-dispatch";
import { intakeRefFromToken } from "@/lib/rx-submission-context";

export const dynamic = "force-dynamic";

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);

type TemplateRow = { id: string; slug: string; title: string };

type SubmissionRow = {
  id: string;
  submitted_at: string;
  signer_name: string | null;
  client_phone: string | null;
  client_id: string | null;
  access_token: string | null;
  responses_json: Record<string, unknown> | null;
  template_id: string;
};

export type RxCommandCenterItem = {
  submissionId: string;
  submittedAt: string;
  intakeRef: string;
  slug: string;
  templateTitle: string;
  track: "peptide" | "glp1" | "unknown";
  patientName: string;
  phone: string | null;
  email: string | null;
  qualified: boolean;
  dispatchStatus: string;
  paymentStatus: string | null;
  paymentAmountUsd: number | null;
  ledgerId: string | null;
  unreadMessages: number;
};

function mapLedger(raw: Record<string, unknown>): RxPaymentLedgerRow {
  return raw as unknown as RxPaymentLedgerRow;
}

function pickLedgerForSubmission(
  submissionId: string,
  intakeRef: string,
  rows: RxPaymentLedgerRow[],
): RxPaymentLedgerRow | null {
  const matches = rows.filter(
    (r) =>
      r.submission_id === submissionId ||
      (intakeRef && r.intake_ref?.toUpperCase().startsWith(intakeRef.toUpperCase())),
  );
  if (!matches.length) return null;
  return matches.find((r) => r.payment_status === "paid") ?? matches[0];
}

/** GET /api/admin/rx — unified RX command center queue */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "40", 10)));

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug, title")
    .in("slug", [...RX_INTAKE_SLUGS]);

  const templateById = new Map((templates as TemplateRow[] | null)?.map((t) => [t.id, t]) ?? []);
  const templateIds = Array.from(templateById.keys());
  if (!templateIds.length) return NextResponse.json({ items: [] });

  const { data: submissions } = await admin
    .from("hg_form_submissions")
    .select(
      "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
    )
    .in("template_id", templateIds)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  const rows = (submissions ?? []) as SubmissionRow[];
  const submissionIds = rows.map((r) => r.id);
  const intakeRefs = rows.map((r) => intakeRefFromToken(r.access_token)).filter(Boolean);

  let dispatchBySubmission = new Map<string, RxDispatchRecord>();
  if (submissionIds.length) {
    const { data: dispatchRows } = await admin
      .from("hg_rx_dispatch")
      .select("*")
      .in("submission_id", submissionIds);
    if (dispatchRows) {
      dispatchBySubmission = new Map(
        (dispatchRows as RxDispatchRecord[]).map((d) => [d.submission_id, d]),
      );
    }
  }

  let ledgerRows: RxPaymentLedgerRow[] = [];
  if (submissionIds.length) {
    const { data: bySubmission } = await admin
      .from("hg_rx_payment_ledger")
      .select("*")
      .in("submission_id", submissionIds)
      .order("created_at", { ascending: false });
    ledgerRows = ((bySubmission ?? []) as Record<string, unknown>[]).map(mapLedger);
  }
  if (intakeRefs.length) {
    const { data: byRef } = await admin
      .from("hg_rx_payment_ledger")
      .select("*")
      .in("intake_ref", intakeRefs)
      .order("created_at", { ascending: false });
    const extra = ((byRef ?? []) as Record<string, unknown>[]).map(mapLedger);
    ledgerRows = [...ledgerRows, ...extra];
  }

  let unreadByRef = new Map<string, number>();
  if (intakeRefs.length) {
    const { data: threads } = await admin
      .from("hg_rx_message_threads")
      .select("intake_ref, unread_staff_count")
      .in("intake_ref", intakeRefs);
    for (const t of threads ?? []) {
      unreadByRef.set(String(t.intake_ref).toUpperCase(), Number(t.unread_staff_count) || 0);
    }
  }

  const items: RxCommandCenterItem[] = rows
    .map((row) => {
      const template = templateById.get(row.template_id);
      const slug = template?.slug ?? "";
      if (!RX_SLUG_SET.has(slug)) return null;

      const responses = row.responses_json ?? {};
      const ref = intakeRefFromToken(row.access_token);
      const dispatch = dispatchBySubmission.get(row.id);
      const defaults = defaultDispatchFromIntake({
        slug,
        signerName: row.signer_name,
        responses,
      });
      const dispatchStatus = dispatch?.status ?? defaults.status;
      const ledger = pickLedgerForSubmission(row.id, ref, ledgerRows);

      return {
        submissionId: row.id,
        submittedAt: row.submitted_at,
        intakeRef: ref,
        slug,
        templateTitle: template?.title ?? slug,
        track: intakeTrackFromSlug(slug),
        patientName: intakeDisplayName(slug, row.signer_name, responses),
        phone: row.client_phone || String(responses.phone || "") || null,
        email: String(responses.email || "") || null,
        qualified: responses.qualified === true,
        dispatchStatus,
        paymentStatus: ledger?.payment_status ?? null,
        paymentAmountUsd: ledger?.amount_usd ?? null,
        ledgerId: ledger?.id ?? null,
        unreadMessages: unreadByRef.get(ref) ?? 0,
      };
    })
    .filter(Boolean) as RxCommandCenterItem[];

  return NextResponse.json({ items });
}
