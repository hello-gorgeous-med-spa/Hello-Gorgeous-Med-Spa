import { NextRequest, NextResponse } from "next/server";

import {
  GOLDEN_TICKET_PACKAGES,
  type GoldenTicketPackageId,
} from "@/lib/campaigns/golden-ticket-2026";
import { initializeHelcimPay, isHelcimConfigured } from "@/lib/helcim";

export const dynamic = "force-dynamic";

const PACKAGE_IDS = new Set(GOLDEN_TICKET_PACKAGES.map((p) => p.id));

/**
 * POST /api/golden-ticket/pay
 * Start a HelcimPay.js session for an existing Golden Ticket invoice.
 */
export async function POST(request: NextRequest) {
  if (!isHelcimConfigured()) {
    return NextResponse.json(
      { success: false, error: "Helcim invoicing is not connected yet." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const packageId = String(body?.packageId ?? "").trim() as GoldenTicketPackageId;
  const invoiceNumber = String(body?.invoiceNumber ?? "").trim();
  const amountUsd = Number(body?.amountUsd);
  const contactName = String(body?.name ?? "").trim().slice(0, 80);
  const phone = String(body?.phone ?? "").trim();

  if (!PACKAGE_IDS.has(packageId)) {
    return NextResponse.json({ success: false, error: "Choose a collection." }, { status: 400 });
  }
  if (!invoiceNumber) {
    return NextResponse.json({ success: false, error: "Missing invoice." }, { status: 400 });
  }

  const pkg = GOLDEN_TICKET_PACKAGES.find((p) => p.id === packageId)!;
  const amount = Number.isFinite(amountUsd) && amountUsd > 0 ? amountUsd : pkg.ticketPriceUsd;

  const pay = await initializeHelcimPay({
    amountUsd: amount,
    invoiceNumber,
    allowPartial: true,
    saveCard: true,
    contactName: contactName || undefined,
    phone: phone || undefined,
  });

  if (!pay.ok) {
    return NextResponse.json({ success: false, error: pay.error }, { status: pay.status });
  }

  return NextResponse.json({
    success: true,
    checkoutToken: pay.data.checkoutToken,
  });
}
