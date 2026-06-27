import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  RX_LEDGER_SOURCES,
  RX_LEDGER_STATUSES,
  RX_LEDGER_TRACKS,
  listRxPaymentLedger,
  type RxLedgerPaymentStatus,
  type RxLedgerSource,
} from "@/lib/rx-payment-ledger";
import type { RxInvoiceTrack } from "@/lib/rx-invoice-templates";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx-ledger — spreadsheet rows + summary stats */
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
  const limit = parseInt(sp.get("limit") || "200", 10);
  const offset = parseInt(sp.get("offset") || "0", 10);

  try {
    const { rows, stats, tableReady } = await listRxPaymentLedger({
      status,
      track,
      source,
      search,
      dateFrom,
      dateTo,
      limit,
      offset,
    });

    return NextResponse.json({
      rows,
      stats,
      tableReady,
      filters: {
        statuses: RX_LEDGER_STATUSES,
        tracks: RX_LEDGER_TRACKS,
        sources: RX_LEDGER_SOURCES,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not load ledger";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
