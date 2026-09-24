/**
 * Automatic clinic invoice after Ryan approves.
 * Prices from the Formulation ticket. Pay link is Bluefin PayConex.
 * We email + SMS it — Charm is not in this loop.
 */

import { getSupabase } from "@/lib/supabase-server";
import { buildBluefinHostedPayUrl, isBluefinPayconexConfigured } from "@/lib/bluefin-payconex";
import { FORMULATION_TIRZ_B6_INJECTABLE_PACKS } from "@/lib/glp1-formulation-catalog";
import { GLP1_SQUARE_CLINIC } from "@/lib/glp1-program-pricing";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { resolveFormulationTicket } from "@/lib/regen/formulation-dispatch";
import {
  formulationRetailUsdForSku,
  formulationShopRetail,
  isFormulationSheetProgram,
  type FormulationShopId,
} from "@/lib/regen/formulation-client-pricing";
import { GORGEOUS20_CODE, GORGEOUS20_PERCENT } from "@/lib/regen-gorgeous20";
import { REGEN_MARKUP, REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";
import { REGEN_TELEHEALTH_FEE_USD } from "@/lib/regen/telehealth-consult";
import { getResendFromAddress } from "@/lib/resend-config";
import { Resend } from "resend";

export type ClinicInvoiceQuote = {
  amountUsd: number;
  productUsd: number;
  shippingUsd: number;
  discountUsd: number;
  consultCreditUsd: number;
  label: string;
  ready: boolean;
  reason?: string;
  charmManual: boolean;
  lines: { label: string; amountUsd: number }[];
};

const SEMA_SKUS = new Set(["2488", "2489", "2490", "2491", "2492", "2493"]);

function retailFromWholesale(wholesale: number): number {
  return Math.round(wholesale * REGEN_MARKUP * 100) / 100;
}

function emptyQuote(label: string, reason: string): ClinicInvoiceQuote {
  return {
    amountUsd: 0,
    productUsd: 0,
    shippingUsd: 0,
    discountUsd: 0,
    consultCreditUsd: 0,
    label,
    ready: false,
    reason,
    charmManual: true,
    lines: [],
  };
}

export function quoteClinicInvoice(input: {
  goal?: string | null;
  program?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  amountPaid?: number | null;
  medicalHistory?: Record<string, unknown> | null;
  overrideUsd?: number | null;
  applyGorgeous20?: boolean;
  applyConsultCredit?: boolean;
}): ClinicInvoiceQuote {
  if (input.overrideUsd && input.overrideUsd > 0) {
    const amountUsd = Math.round(input.overrideUsd * 100) / 100;
    return {
      amountUsd,
      productUsd: amountUsd,
      shippingUsd: 0,
      discountUsd: 0,
      consultCreditUsd: 0,
      label: "Staff amount",
      ready: true,
      charmManual: !isBluefinPayconexConfigured(),
      lines: [{ label: "Staff amount", amountUsd }],
    };
  }

  const ticket = resolveFormulationTicket({
    goal: input.goal,
    program: input.program,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    medicalHistory: input.medicalHistory,
  });

  if (ticket.pharmacy !== "Formulation Rx" || ticket.status !== "ready") {
    return emptyQuote(
      ticket.lines[0]?.productName || ticket.program,
      ticket.status === "ready"
        ? "BoomRx lines need a staff amount before we can invoice."
        : "Ryan must pick the SKU (or type a dollar amount) before we can invoice.",
    );
  }

  let productUsd = 0;
  const names: string[] = [];
  for (const line of ticket.lines) {
    const sku = String(line.sku || "");
    names.push(line.productName);
    const bySku = formulationRetailUsdForSku(sku);
    if (bySku != null) {
      productUsd += bySku * (line.quantity || 1);
      continue;
    }
    const shopId = ticket.program as FormulationShopId;
    if (isFormulationSheetProgram(ticket.program)) {
      productUsd += formulationShopRetail(shopId) * (line.quantity || 1);
      continue;
    }
    const tirz = FORMULATION_TIRZ_B6_INJECTABLE_PACKS.find((p) => p.sku === sku);
    if (tirz) {
      productUsd += retailFromWholesale(tirz.wholesaleUsd) * (line.quantity || 1);
      continue;
    }
    if (SEMA_SKUS.has(sku)) {
      productUsd += GLP1_SQUARE_CLINIC.semaConsultFirstUsd * (line.quantity || 1);
      continue;
    }
  }

  if (!(productUsd > 0) && /tirz|weight/i.test(String(input.goal))) {
    productUsd = GLP1_SQUARE_CLINIC.tirzConsultFirstUsd;
  }

  if (!(productUsd > 0) && input.amountPaid && input.amountPaid > 0) {
    productUsd = Math.round(Number(input.amountPaid) * 100) / 100;
  }

  if (!(productUsd > 0)) {
    return emptyQuote(
      names[0] || ticket.program,
      "No catalog price for this SKU. Type the dollars on Orders, then send.",
    );
  }

  const history = input.medicalHistory || {};
  const promo =
    String(history.promo || history.promoCode || "").toUpperCase() === GORGEOUS20_CODE;
  const applyGorgeous20 = input.applyGorgeous20 ?? promo;
  const applyConsultCredit =
    input.applyConsultCredit ??
    history.consultCredit === true ||
    history.applyConsultCredit === true;

  const productRounded = Math.round(productUsd * 100) / 100;
  const discountUsd = applyGorgeous20
    ? Math.round(productRounded * (GORGEOUS20_PERCENT / 100) * 100) / 100
    : 0;
  const consultCreditUsd = applyConsultCredit ? REGEN_TELEHEALTH_FEE_USD : 0;
  const shippingUsd = REGEN_SHIPPING_USD;
  const amountUsd = Math.max(
    0,
    Math.round((productRounded - discountUsd - consultCreditUsd + shippingUsd) * 100) / 100,
  );
  const label = names.filter(Boolean).join(" + ") || ticket.program;
  const lines = [
    { label: `Medication — ${label}`, amountUsd: productRounded },
    ...(discountUsd > 0
      ? [{ label: `GORGEOUS20 (${GORGEOUS20_PERCENT}% off medication)`, amountUsd: -discountUsd }]
      : []),
    ...(consultCreditUsd > 0
      ? [{ label: `$${consultCreditUsd} phone consult credit`, amountUsd: -consultCreditUsd }]
      : []),
    { label: "Shipping", amountUsd: shippingUsd },
    { label: "Clinic invoice total", amountUsd },
  ];

  return {
    amountUsd,
    productUsd: productRounded,
    shippingUsd,
    discountUsd,
    consultCreditUsd,
    label,
    ready: true,
    charmManual: !isBluefinPayconexConfigured(),
    lines,
  };
}

export function parsePatientFromOrderNotes(notes?: string | null): { name?: string; email?: string; intakeId?: string } {
  const text = String(notes || "");
  const nameMatch = text.match(/INTAKE [^\s]+ · ([^·]+) ·/);
  const emailMatch = text.match(/· ([^\s@]+@[^\s]+) ·/);
  const intakeMatch = text.match(/INTAKE ([0-9a-f-]{8,})/i);
  return {
    name: nameMatch?.[1]?.trim(),
    email: emailMatch?.[1]?.trim(),
    intakeId: intakeMatch?.[1],
  };
}

export async function sendClinicInvoice(opts: {
  orderNumber: string;
  orderId?: string;
  patientName: string;
  email?: string | null;
  phone?: string | null;
  quote: ClinicInvoiceQuote;
}): Promise<
  | { ok: true; payUrl: string; emailed: boolean; texted: boolean; charmManual?: boolean }
  | { ok: false; error: string }
> {
  if (!opts.quote.ready || !(opts.quote.amountUsd > 0)) {
    return { ok: false, error: opts.quote.reason || "Need a dollar amount to invoice." };
  }
  if (!isBluefinPayconexConfigured()) {
    return { ok: true, payUrl: "", emailed: false, texted: false, charmManual: true };
  }

  const parts = opts.patientName.replace(/\s+/g, " ").trim().split(" ");
  const firstName = parts[0] || "Patient";
  const lastName = parts.slice(1).join(" ") || "REGEN";

  let payUrl: string;
  try {
    payUrl = buildBluefinHostedPayUrl({
      amountUsd: opts.quote.amountUsd,
      firstName,
      lastName,
      email: opts.email || undefined,
      phone: opts.phone || undefined,
      orderNumber: opts.orderNumber,
    });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not build pay link" };
  }

  const amount = `$${opts.quote.amountUsd.toFixed(2)}`;
  let emailed = false;
  let texted = false;

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && opts.email) {
    const resend = new Resend(apiKey);
    const from = getResendFromAddress() || "REGEN RX <provider@hellogorgeousmedspa.com>";
    const { error } = await resend.emails.send({
      from,
      to: opts.email,
      subject: `Your REGEN invoice is ready — ${amount}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
          <p>Hi ${firstName},</p>
          <p>Your clinician approved your plan. Pay the clinic invoice to start pharmacy fulfillment.</p>
          <p style="font-size:18px;font-weight:800">${opts.quote.label}<br/>${amount}
            <span style="font-size:13px;font-weight:500"> (includes $${opts.quote.shippingUsd.toFixed(2)} shipping)</span>
          </p>
          <p><a href="${payUrl}" style="display:inline-block;background:#E6007E;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:800">Pay securely</a></p>
          <p style="font-size:13px;color:#555">You will enter your card on Bluefin — not on our website. Compounded medication is not FDA-approved. Illinois only.</p>
          <p>Hello Gorgeous · REGEN RX · (630) 636-6193</p>
        </div>
      `,
    });
    emailed = !error;
    if (error) console.error("[clinic-invoice] email failed", error);
  }

  if (opts.phone) {
    const sms = await sendSms(
      opts.phone,
      `REGEN RX: your clinic invoice is ${amount}. Pay to start shipping: ${payUrl} Reply STOP to opt out.`,
    );
    texted = sms.success;
  }

  if (!emailed && !texted) {
    return { ok: false, error: "Pay link built, but email and SMS both failed. Check Resend / Twilio." };
  }

  const supabase = getSupabase();
  if (supabase && opts.orderId) {
    await supabase
      .from("regen_orders")
      .update({
        notes: `INVOICE ${amount} · ${payUrl}`,
        pharmacy_error: `Invoice sent ${amount}. Pay link emailed/texted.`,
        amount_cents: Math.round(opts.quote.amountUsd * 100),
        updated_at: new Date().toISOString(),
      })
      .eq("id", opts.orderId);
  }

  return { ok: true, payUrl, emailed, texted };
}
