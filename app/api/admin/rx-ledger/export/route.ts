import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  listRxPaymentLedger,
  rxLedgerToCsv,
  type RxLedgerPaymentStatus,
  type RxLedgerSource,
} from "@/lib/rx-payment-ledger";
import type { RxInvoiceTrack } from "@/lib/rx-invoice-templates";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx-ledger/export — CSV download for compliance records */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const sp = req.nextUrl.searchParams;
  const status = (sp.get("status") || "all") as RxLedgerPaymentStatus | "all";
  const track = (sp.get("track") || "all") as RxInvoiceTrack | "all";
  const source = (sp.get("source") || "all") as RxLedgerSource | "all";
  const search = sp.get("search") || undefined;
  const dateFrom = sp.get("dateFrom") || undefined;
  const dateTo = sp.get("dateTo") || undefined;

  try {
    const { rows, tableReady } = await listRxPaymentLedger({
      status,
      track,
      source,
      search,
      dateFrom,
      dateTo,
      limit: 5000,
      offset: 0,
    });

    if (!tableReady) {
      return NextResponse.json(
        { error: "Ledger table not ready — run database migrations first." },
        { status: 503 },
      );
    }

    const csv = rxLedgerToCsv(rows);
    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rx-payment-ledger-${stamp}.csv"`,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Export failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
