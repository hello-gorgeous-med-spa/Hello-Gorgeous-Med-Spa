import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  listRxInvoiceTemplates,
  rxInvoiceTracks,
} from "@/lib/rx-invoice-templates";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx-invoices/templates — premade RX invoice menu for staff UI */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  return NextResponse.json({
    tracks: rxInvoiceTracks(),
    templates: listRxInvoiceTemplates(),
  });
}
