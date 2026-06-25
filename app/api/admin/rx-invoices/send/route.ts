import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import {
  emailClientRxPaymentLink,
  smsClientRxPaymentLink,
} from "@/lib/rx-invoice-notify";
import {
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
} from "@/lib/rx-invoice-templates";

export const dynamic = "force-dynamic";

type Delivery = "link" | "email" | "sms" | "both";

function parseDelivery(raw: unknown): Delivery {
  if (raw === "email" || raw === "sms" || raw === "both") return raw;
  return "link";
}

/**
 * POST /api/admin/rx-invoices/send
 * Create a Square payment link from a premade template and optionally email/text the client.
 */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: {
    templateId?: string;
    clientName?: string;
    email?: string;
    phone?: string;
    note?: string;
    customAmountUsd?: number;
    delivery?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const templateId = String(body.templateId || "").trim();
  const template = getRxInvoiceTemplate(templateId);
  if (!template) {
    return NextResponse.json({ error: "Unknown invoice template" }, { status: 404 });
  }

  const customRaw =
    body.customAmountUsd != null && Number.isFinite(Number(body.customAmountUsd))
      ? Number(body.customAmountUsd)
      : undefined;

  const amountUsd = resolveTemplateAmountUsd(template, customRaw);
  if (amountUsd == null || amountUsd <= 0) {
    return NextResponse.json(
      {
        error: template.allowCustomAmount
          ? "Enter a custom amount for this line item"
          : "This template requires a valid fixed amount",
      },
      { status: 400 },
    );
  }

  const clientName = String(body.clientName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const staffNote = String(body.note || "").trim();
  const delivery = parseDelivery(body.delivery);

  if (delivery === "email" || delivery === "both") {
    if (!email) {
      return NextResponse.json({ error: "Client email is required to send by email" }, { status: 400 });
    }
  }
  if (delivery === "sms" || delivery === "both") {
    if (!phone) {
      return NextResponse.json({ error: "Client phone is required to send by text" }, { status: 400 });
    }
  }

  const clientLabel = clientName || email || phone || "Client";
  const descriptionParts = [
    template.lineLabel,
    clientLabel !== "Client" ? clientLabel : null,
    staffNote || null,
    auth.user.email ? `Sent by ${auth.user.email}` : null,
  ].filter(Boolean);

  const linkResult = await createRxPaymentLink({
    squareName: template.squareName,
    amountUsd,
    clientLabel,
    description: descriptionParts.join(" · "),
  });

  if (!linkResult.ok) {
    return NextResponse.json({ error: linkResult.error }, { status: linkResult.status });
  }

  const url = linkResult.url;
  const notify: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } } =
    {};

  if (delivery === "email" || delivery === "both") {
    notify.email = await emailClientRxPaymentLink({
      to: email,
      clientName,
      itemName: template.name,
      amountUsd,
      url,
      staffNote,
    });
  }

  if (delivery === "sms" || delivery === "both") {
    notify.sms = await smsClientRxPaymentLink({
      phone,
      clientName,
      itemName: template.name,
      amountUsd,
      url,
    });
  }

  const deliveryFailed =
    (notify.email && !notify.email.ok) || (notify.sms && !notify.sms.ok);

  return NextResponse.json({
    ok: !deliveryFailed || delivery === "link",
    url,
    template: {
      id: template.id,
      name: template.name,
      amountUsd,
    },
    notify,
    sentBy: auth.user.email,
    sentAt: new Date().toISOString(),
  });
}
