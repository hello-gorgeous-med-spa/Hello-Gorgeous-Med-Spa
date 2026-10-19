import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { createHelcimInvoice, initializeHelcimPay, isHelcimConfigured } from "@/lib/helcim";
import { emailHelcimInvoiceLink, smsHelcimInvoiceLink } from "@/lib/helcim-notify";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/helcim/invoice
 * Staff: create a Helcim invoice and optionally email/text the pay-or-setup link.
 */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  if (!isHelcimConfigured()) {
    return NextResponse.json({ error: "Helcim is not configured. Add HELCIM_API_TOKEN." }, { status: 503 });
  }

  let body: {
    description?: string;
    amountUsd?: number;
    notes?: string;
    clientName?: string;
    email?: string;
    phone?: string;
    sku?: string;
    delivery?: "link" | "email" | "sms" | "both";
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const description = String(body.description || "").trim();
  const amountUsd = Number(body.amountUsd);
  const clientName = String(body.clientName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const delivery = body.delivery === "email" || body.delivery === "sms" || body.delivery === "both" ? body.delivery : "link";

  if (!description) {
    return NextResponse.json({ error: "Add a line-item description." }, { status: 400 });
  }
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
  }
  if ((delivery === "email" || delivery === "both") && !email) {
    return NextResponse.json({ error: "Email is required to send the invoice." }, { status: 400 });
  }
  if ((delivery === "sms" || delivery === "both") && !phone) {
    return NextResponse.json({ error: "Phone is required to text the invoice." }, { status: 400 });
  }

  const invoice = await createHelcimInvoice({
    description,
    amountUsd,
    sku: body.sku,
    notes: body.notes,
    contactName: clientName || undefined,
    email: email || undefined,
    phone: phone || undefined,
  });

  if (!invoice.ok) {
    return NextResponse.json({ error: invoice.error }, { status: invoice.status });
  }

  const pay = await initializeHelcimPay({
    amountUsd,
    invoiceNumber: invoice.data.invoiceNumber,
    allowPartial: true,
    saveCard: true,
    contactName: clientName || undefined,
    email: email || undefined,
    phone: phone || undefined,
  });

  const url = invoice.data.payUrl;
  const notify: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } } = {};

  if (url && (delivery === "email" || delivery === "both") && email) {
    notify.email = await emailHelcimInvoiceLink({
      to: email,
      clientName,
      itemName: description,
      amountUsd,
      url,
    });
  }
  if (url && (delivery === "sms" || delivery === "both") && phone) {
    notify.sms = await smsHelcimInvoiceLink({
      phone,
      itemName: description,
      amountUsd,
      url,
    });
  }

  return NextResponse.json({
    ok: true,
    invoice: invoice.data,
    checkoutToken: pay.ok ? pay.data.checkoutToken : null,
    payUrl: url,
    notify,
    sentBy: auth.user.email,
  });
}
