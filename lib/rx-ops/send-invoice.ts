import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getClinicEncounter } from "@/lib/rx-clinic-encounter";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import {
  emailClientRxPaymentLink,
  smsClientRxPaymentLink,
} from "@/lib/rx-invoice-notify";
import {
  defaultInvoiceTemplateForTrack,
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
  templateRequiresShippingAddress,
} from "@/lib/rx-invoice-templates";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { intakeTrackFromSlug } from "@/lib/rx-dispatch";
import { loadSubmissionById } from "@/lib/rx-submission-context";
import { fetchRegenFulfillmentOrder } from "@/lib/regen/order-fulfillment";
import { regenOrderTotalUsd } from "@/lib/regen/order-patient-status";
import { logRxOpsAudit } from "@/lib/rx-ops/audit";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export type RxOpsInvoiceDelivery = "link" | "email" | "sms" | "both";

export type SendRxOpsInvoiceInput = {
  requestKind: RxOpsRequestKind;
  requestId: string;
  templateId?: string;
  customAmountUsd?: number;
  delivery?: RxOpsInvoiceDelivery;
  staffEmail: string;
  staffNote?: string;
};

export type SendRxOpsInvoiceResult =
  | {
      ok: true;
      url: string;
      ledgerId: string | null;
      amountUsd: number;
      notify: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } };
    }
  | { ok: false; error: string; status: number };

type InvoiceContext = {
  clientName: string;
  email: string;
  phone: string;
  clientId: string | null;
  submissionId: string | null;
  intakeRef: string | null;
  track: "glp1" | "peptide" | "unknown";
  lineLabel: string;
  squareName: string;
  amountUsd: number;
  templateId: string | null;
  templateName: string | null;
  trackLedger: "weight-loss" | "peptides" | "fees";
  askShipping: boolean;
  source: "staff_invoice" | "clinic_terminal";
  metadata?: Record<string, unknown>;
};

async function resolveInvoiceContext(
  kind: RxOpsRequestKind,
  id: string,
  templateIdOverride: string | undefined,
  customAmountUsd: number | undefined,
  admin: SupabaseClient,
): Promise<InvoiceContext | { error: string; status: number }> {
  if (kind === "intake") {
    const submission = await loadSubmissionById(admin, id);
    if (!submission) return { error: "Submission not found", status: 404 };

    const track = intakeTrackFromSlug(submission.slug ?? "");
    const templateId =
      templateIdOverride?.trim() ||
      defaultInvoiceTemplateForTrack(track === "glp1" ? "glp1" : track === "peptide" ? "peptide" : "unknown");
    const template = getRxInvoiceTemplate(templateId);
    if (!template) return { error: "Unknown invoice template", status: 404 };

    const amountUsd = resolveTemplateAmountUsd(template, customAmountUsd);
    if (amountUsd == null || amountUsd <= 0) {
      return { error: "Invalid invoice amount", status: 400 };
    }

    return {
      clientName: submission.clientName?.trim() || "",
      email: submission.clientEmail?.trim() || "",
      phone: submission.clientPhone?.trim() || "",
      clientId: submission.clientId,
      submissionId: submission.submissionId,
      intakeRef: submission.intakeRef,
      track,
      lineLabel: template.lineLabel,
      squareName: template.squareName,
      amountUsd,
      templateId: template.id,
      templateName: template.name,
      trackLedger: template.track,
      askShipping: templateRequiresShippingAddress(template),
      source: "staff_invoice",
    };
  }

  if (kind === "regen") {
    const order = await fetchRegenFulfillmentOrder(admin, id);
    if (!order) return { error: "RE GEN order not found", status: 404 };

    const amountUsd = customAmountUsd ?? regenOrderTotalUsd(order);
    if (amountUsd <= 0) return { error: "Invalid order total", status: 400 };

    const items = Array.isArray(order.items) ? order.items : [];
    const itemNames = items
      .map((i) => (typeof i === "object" && i && "name" in i ? String((i as { name?: string }).name) : ""))
      .filter(Boolean);

    return {
      clientName: order.customer_name?.trim() || "",
      email: order.customer_email?.trim() || "",
      phone: order.customer_phone?.trim() || "",
      clientId: null,
      submissionId: null,
      intakeRef: order.reference,
      track: "unknown",
      lineLabel: itemNames.length ? itemNames.join(", ") : `RE GEN · ${order.goal || "RX"}`,
      squareName: `Hello Gorgeous RE GEN™ — ${order.reference}`,
      amountUsd,
      templateId: null,
      templateName: "RE GEN order",
      trackLedger: "peptides",
      askShipping: true,
      source: "staff_invoice",
      metadata: { regenOrderRef: order.reference },
    };
  }

  const encounter = await getClinicEncounter(id, admin);
  if (!encounter) return { error: "Clinic encounter not found", status: 404 };

  let clientName = "";
  let email = "";
  let phone = "";
  if (encounter.client_id) {
    const { data: clientRow } = await admin
      .from("clients")
      .select("first_name, last_name, phone, email")
      .eq("id", encounter.client_id)
      .maybeSingle();
    if (clientRow) {
      clientName = `${clientRow.first_name || ""} ${clientRow.last_name || ""}`.trim();
      email = String(clientRow.email || "").trim();
      phone = String(clientRow.phone || "").trim();
    }
  }

  const quote = encounter.pricing_snapshot?.quote;
  const templateId =
    templateIdOverride?.trim() ||
    quote?.invoiceTemplateId ||
    defaultInvoiceTemplateForTrack("peptide");
  const template = getRxInvoiceTemplate(templateId);
  if (!template) return { error: "Unknown invoice template", status: 404 };

  const amountUsd =
    customAmountUsd ??
    (encounter.final_total_usd > 0 ? encounter.final_total_usd : resolveTemplateAmountUsd(template));
  if (amountUsd == null || amountUsd <= 0) {
    return { error: "Invalid clinic encounter amount", status: 400 };
  }

  return {
    clientName,
    email,
    phone,
    clientId: encounter.client_id,
    submissionId: null,
    intakeRef: encounter.id,
    track: "unknown",
    lineLabel: quote?.lineLabel ?? `${encounter.medication} ${encounter.dose_label || ""}`.trim(),
    squareName: template.squareName,
    amountUsd,
    templateId: template.id,
    templateName: template.name,
    trackLedger: template.track,
    askShipping: true,
    source: "clinic_terminal",
    metadata: { clinicEncounterId: encounter.id },
  };
}

export async function sendRxOpsInvoice(
  input: SendRxOpsInvoiceInput,
  client?: SupabaseClient | null,
): Promise<SendRxOpsInvoiceResult> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable", status: 503 };

  const delivery = input.delivery ?? "both";
  const ctx = await resolveInvoiceContext(
    input.requestKind,
    input.requestId,
    input.templateId,
    input.customAmountUsd,
    admin,
  );
  if ("error" in ctx) return { ok: false, error: ctx.error, status: ctx.status };

  if (delivery === "email" || delivery === "both") {
    if (!ctx.email) return { ok: false, error: "Client email required for email delivery", status: 400 };
  }
  if (delivery === "sms" || delivery === "both") {
    if (!ctx.phone) return { ok: false, error: "Client phone required for text delivery", status: 400 };
  }

  const clientLabel = ctx.clientName || ctx.email || ctx.phone || "Client";
  const descriptionParts = [
    ctx.lineLabel,
    ctx.intakeRef ? `Ref ${ctx.intakeRef}` : null,
    input.staffNote?.trim() || null,
    `Sent by ${input.staffEmail}`,
  ].filter(Boolean);

  const linkResult = await createRxPaymentLink({
    squareName: ctx.squareName,
    amountUsd: ctx.amountUsd,
    clientLabel,
    description: descriptionParts.join(" · "),
    askForShippingAddress: ctx.askShipping,
  });

  if (!linkResult.ok) {
    return { ok: false, error: linkResult.error, status: linkResult.status };
  }

  const itemName = ctx.templateName || ctx.lineLabel;
  const notify: {
    email?: { ok: boolean; error?: string };
    sms?: { ok: boolean; error?: string };
  } = {};

  if (delivery === "email" || delivery === "both") {
    notify.email = await emailClientRxPaymentLink({
      to: ctx.email,
      clientName: ctx.clientName,
      itemName,
      amountUsd: ctx.amountUsd,
      url: linkResult.url,
      staffNote: input.staffNote,
    });
  }
  if (delivery === "sms" || delivery === "both") {
    notify.sms = await smsClientRxPaymentLink({
      phone: ctx.phone,
      clientName: ctx.clientName,
      itemName,
      amountUsd: ctx.amountUsd,
      url: linkResult.url,
    });
  }

  const ledgerRow = await insertRxPaymentLedger(
    {
      clientId: ctx.clientId,
      clientName: clientLabel,
      clientEmail: ctx.email || null,
      clientPhone: ctx.phone || null,
      submissionId: ctx.submissionId,
      intakeRef: ctx.intakeRef,
      source: ctx.source,
      templateId: ctx.templateId,
      templateName: ctx.templateName,
      track: ctx.trackLedger,
      lineLabel: ctx.lineLabel,
      amountUsd: ctx.amountUsd,
      paymentUrl: linkResult.url,
      squarePaymentLinkId: linkResult.paymentLinkId,
      squareOrderId: linkResult.orderId,
      deliveryMethod: delivery,
      sentBy: input.staffEmail,
      staffNote: input.staffNote?.trim() || `RX Ops invoice · ${input.requestKind}:${input.requestId}`,
      metadata: ctx.metadata,
    },
    admin,
  );

  await logRxOpsAudit(
    {
      requestKind: input.requestKind,
      requestId: input.requestId,
      action: "invoice_sent",
      actorEmail: input.staffEmail,
      detail: {
        ledgerId: ledgerRow?.id,
        amountUsd: ctx.amountUsd,
        delivery,
        templateId: ctx.templateId,
      },
    },
    admin,
  );

  return {
    ok: true,
    url: linkResult.url,
    ledgerId: ledgerRow?.id ?? null,
    amountUsd: ctx.amountUsd,
    notify,
  };
}

export async function resendRxOpsLedgerInvoice(
  input: {
    ledgerId: string;
    delivery: RxOpsInvoiceDelivery;
    staffEmail: string;
  },
  client?: SupabaseClient | null,
): Promise<SendRxOpsInvoiceResult> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable", status: 503 };

  const { data, error } = await admin
    .from("hg_rx_payment_ledger")
    .select("*")
    .eq("id", input.ledgerId)
    .maybeSingle();

  if (error || !data) return { ok: false, error: "Ledger row not found", status: 404 };

  const url = String(data.payment_url || "").trim();
  if (!url) return { ok: false, error: "No payment URL on this row", status: 400 };

  const email = String(data.client_email || "").trim();
  const phone = String(data.client_phone || "").trim();
  const clientName = String(data.client_name || "").trim();
  const amountUsd = Number(data.amount_usd) || 0;
  const itemName = String(data.template_name || data.line_label || "RX payment");

  if (input.delivery === "email" || input.delivery === "both") {
    if (!email) return { ok: false, error: "No email on ledger row", status: 400 };
  }
  if (input.delivery === "sms" || input.delivery === "both") {
    if (!phone) return { ok: false, error: "No phone on ledger row", status: 400 };
  }

  const notify: {
    email?: { ok: boolean; error?: string };
    sms?: { ok: boolean; error?: string };
  } = {};

  if (input.delivery === "email" || input.delivery === "both") {
    notify.email = await emailClientRxPaymentLink({
      to: email,
      clientName,
      itemName,
      amountUsd,
      url,
    });
  }
  if (input.delivery === "sms" || input.delivery === "both") {
    notify.sms = await smsClientRxPaymentLink({
      phone,
      clientName,
      itemName,
      amountUsd,
      url,
    });
  }

  await admin
    .from("hg_rx_payment_ledger")
    .update({
      delivery_method: input.delivery,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.ledgerId);

  await logRxOpsAudit(
    {
      requestKind: "intake",
      requestId: String(data.submission_id || data.intake_ref || input.ledgerId),
      action: "invoice_resent",
      actorEmail: input.staffEmail,
      detail: { ledgerId: input.ledgerId, delivery: input.delivery },
    },
    admin,
  );

  return { ok: true, url, ledgerId: input.ledgerId, amountUsd, notify };
}
