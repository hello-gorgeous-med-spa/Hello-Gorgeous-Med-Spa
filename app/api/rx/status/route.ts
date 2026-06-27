import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { defaultDispatchFromIntake } from "@/lib/rx-dispatch";
import { buildRxPatientStatus } from "@/lib/rx-patient-status";
import {
  getLatestLedgerForIntakeRef,
  getLatestLedgerForSubmission,
} from "@/lib/rx-payment-ledger";
import { loadSubmissionByIntakeRef } from "@/lib/rx-submission-context";

export const dynamic = "force-dynamic";

/** GET /api/rx/status?ref=&email= — patient journey status */
export async function GET(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const intakeRef = req.nextUrl.searchParams.get("ref") || "";
  const email = req.nextUrl.searchParams.get("email") || "";
  if (!intakeRef.trim() || !email.trim()) {
    return NextResponse.json({ error: "Reference and email required" }, { status: 400 });
  }

  const submission = await loadSubmissionByIntakeRef(admin, intakeRef, email);
  if (!submission) {
    return NextResponse.json({ error: "Reference and email do not match our records" }, { status: 403 });
  }

  const [ledger, dispatchRes] = await Promise.all([
    getLatestLedgerForSubmission(submission.submissionId, admin).then(
      (row) => row ?? getLatestLedgerForIntakeRef(submission.intakeRef, admin),
    ),
    admin.from("hg_rx_dispatch").select("*").eq("submission_id", submission.submissionId).maybeSingle(),
  ]);

  const dispatchRow = dispatchRes.data;
  const dispatch = dispatchRow
    ? { ...defaultDispatchFromIntake({ slug: submission.slug ?? "", signerName: submission.clientName, responses: submission.responses }), ...dispatchRow, submission_id: submission.submissionId }
    : defaultDispatchFromIntake({ slug: submission.slug ?? "", signerName: submission.clientName, responses: submission.responses });

  const status = buildRxPatientStatus({
    submission,
    ledger: ledger ?? null,
    dispatch: { ...dispatch, submission_id: submission.submissionId },
  });

  return NextResponse.json({ status });
}
