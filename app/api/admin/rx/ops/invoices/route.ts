import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  resendRxOpsLedgerInvoice,
  sendRxOpsInvoice,
  type RxOpsInvoiceDelivery,
} from "@/lib/rx-ops/send-invoice";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export const dynamic = "force-dynamic";

function parseKind(raw: unknown): RxOpsRequestKind | null {
  if (raw === "intake" || raw === "clinic" || raw === "regen") return raw;
  return null;
}

function parseDelivery(raw: unknown): RxOpsInvoiceDelivery {
  if (raw === "email" || raw === "sms" || raw === "both" || raw === "link") return raw;
  return "both";
}

/**
 * POST /api/admin/rx/ops/invoices
 * HGRX-050 — create Square payment link from an ops request and deliver by SMS/email.
 */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: {
    requestKind?: string;
    requestId?: string;
    templateId?: string;
    customAmountUsd?: number;
    delivery?: string;
    note?: string;
    ledgerId?: string;
    resend?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const delivery = parseDelivery(body.delivery);

  if (body.resend && body.ledgerId) {
    const result = await resendRxOpsLedgerInvoice({
      ledgerId: String(body.ledgerId).trim(),
      delivery,
      staffEmail: auth.user.email,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  }

  const requestKind = parseKind(body.requestKind);
  const requestId = String(body.requestId || "").trim();
  if (!requestKind || !requestId) {
    return NextResponse.json({ error: "requestKind and requestId required" }, { status: 400 });
  }

  const result = await sendRxOpsInvoice({
    requestKind,
    requestId,
    templateId: body.templateId,
    customAmountUsd:
      body.customAmountUsd != null && Number.isFinite(Number(body.customAmountUsd))
        ? Number(body.customAmountUsd)
        : undefined,
    delivery,
    staffEmail: auth.user.email,
    staffNote: body.note,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
