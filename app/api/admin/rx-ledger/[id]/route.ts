import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
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

/** PATCH /api/admin/rx-ledger/[id] — update status or chart note for compliance */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: {
    paymentStatus?: string;
    chartNote?: string | null;
    staffNote?: string | null;
    paidAt?: string | null;
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

  let paidAt = body.paidAt;
  if (paymentStatus === "paid" && paidAt === undefined) {
    paidAt = new Date().toISOString();
  }
  if (paymentStatus && paymentStatus !== "paid") {
    paidAt = body.paidAt ?? null;
  }

  const row = await updateRxPaymentLedger(id, {
    paymentStatus,
    chartNote: body.chartNote,
    staffNote: body.staffNote,
    paidAt,
  });

  if (!row) {
    return NextResponse.json({ error: "Could not update row" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row });
}
