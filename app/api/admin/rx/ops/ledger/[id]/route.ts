import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { logRxOpsAudit } from "@/lib/rx-ops/audit";
import {
  updateRxPaymentLedger,
  type RxLedgerPaymentStatus,
} from "@/lib/rx-payment-ledger";

export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set<RxLedgerPaymentStatus>([
  "pending",
  "paid",
  "failed",
  "refunded",
  "unknown",
]);

/**
 * PATCH /api/admin/rx/ops/ledger/[id]
 * HGRX-052 — mark refunded / update compliance note from RX Ops console.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  let body: {
    paymentStatus?: string;
    chartNote?: string | null;
    staffNote?: string | null;
    requestKind?: string;
    requestId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentStatus = body.paymentStatus?.trim() as RxLedgerPaymentStatus | undefined;
  if (paymentStatus && !VALID_STATUSES.has(paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  const row = await updateRxPaymentLedger(id, {
    paymentStatus,
    chartNote: body.chartNote,
    staffNote: body.staffNote,
    paidAt: paymentStatus === "paid" ? new Date().toISOString() : paymentStatus ? null : undefined,
  });

  if (!row) {
    return NextResponse.json({ error: "Could not update row" }, { status: 500 });
  }

  if (paymentStatus === "refunded") {
    await logRxOpsAudit({
      requestKind:
        body.requestKind === "clinic" || body.requestKind === "regen"
          ? body.requestKind
          : "intake",
      requestId: body.requestId?.trim() || row.intake_ref || row.submission_id || id,
      action: "payment_refunded",
      actorEmail: auth.user.email,
      detail: { ledgerId: id, amountUsd: row.amount_usd },
    });
  }

  return NextResponse.json({ ok: true, row });
}
