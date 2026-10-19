import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  GOLDEN_TICKET_CAMPAIGN,
  GOLDEN_TICKET_CRM_TAG,
  GOLDEN_TICKET_PACKAGES,
  goldenTicketInvoiceNotes,
  type GoldenTicketPackageId,
} from "@/lib/campaigns/golden-ticket-2026";
import { createHelcimInvoice, initializeHelcimPay, isHelcimConfigured } from "@/lib/helcim";
import { emailHelcimInvoiceLink, smsHelcimInvoiceLink } from "@/lib/helcim-notify";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { normalizeToE164 } from "@/lib/phone-e164";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const PACKAGE_IDS = new Set(GOLDEN_TICKET_PACKAGES.map((p) => p.id));

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? "").trim().slice(0, 80);
    const email = String(body?.email ?? "").trim().slice(0, 120).toLowerCase();
    const phone = normalizeToE164(String(body?.phone ?? "").trim());
    const packageId = String(body?.packageId ?? "").trim() as GoldenTicketPackageId;
    const notes = String(body?.notes ?? "").trim().slice(0, 500);
    const wantInvoice = body?.invoice !== false;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Add your name and a valid phone number." },
        { status: 400 },
      );
    }
    if (!PACKAGE_IDS.has(packageId)) {
      return NextResponse.json(
        { success: false, error: "Choose a Golden Ticket package." },
        { status: 400 },
      );
    }

    const pkg = GOLDEN_TICKET_PACKAGES.find((p) => p.id === packageId)!;
    const helcimOn = isHelcimConfigured();
    const createInvoice = wantInvoice && helcimOn;

    let invoice:
      | {
          invoiceId: number;
          invoiceNumber: string;
          payUrl: string | null;
        }
      | null = null;
    let checkoutToken: string | null = null;
    let invoiceError: string | null = null;

    if (createInvoice) {
      const created = await createHelcimInvoice({
        description: pkg.flyerName,
        amountUsd: pkg.ticketPriceUsd,
        sku: `GT-${pkg.id.toUpperCase()}`,
        notes: goldenTicketInvoiceNotes(pkg),
        contactName: name,
        email: email || undefined,
        phone,
      });
      if (created.ok) {
        invoice = {
          invoiceId: created.data.invoiceId,
          invoiceNumber: created.data.invoiceNumber,
          payUrl: created.data.payUrl,
        };
        const pay = await initializeHelcimPay({
          amountUsd: pkg.ticketPriceUsd,
          invoiceNumber: created.data.invoiceNumber,
          allowPartial: true,
          saveCard: true,
          contactName: name,
          email: email || undefined,
          phone,
        });
        if (pay.ok) checkoutToken = pay.data.checkoutToken;
      } else {
        invoiceError = created.error;
        console.error("[golden-ticket/request] helcim invoice", created.error);
      }
    }

    const supabase = getSupabase();
    let savedId = crypto.randomUUID();
    if (supabase) {
      const { data, error } = await supabase
        .from("vip_waitlist")
        .insert({
          campaign: GOLDEN_TICKET_CAMPAIGN,
          name,
          email: email || `${phone.replace(/\D/g, "")}@request.local`,
          phone,
          concerns: [pkg.flyerName],
          qualification_data: {
            packageId,
            ticketPriceUsd: pkg.ticketPriceUsd,
            containsMedication: pkg.containsMedication,
            notes: notes || undefined,
            source: "golden-ticket-page",
            processor: invoice ? "helcim" : "request",
            helcimInvoiceId: invoice?.invoiceId,
            helcimInvoiceNumber: invoice?.invoiceNumber,
            helcimPayUrl: invoice?.payUrl,
          },
          crm_tag: GOLDEN_TICKET_CRM_TAG,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) {
        console.error("[golden-ticket/request] db", error);
        return NextResponse.json(
          { success: false, error: "Could not save your request. Call (630) 636-6193." },
          { status: 500 },
        );
      }
      savedId = data?.id ?? savedId;
    }

    if (invoice?.payUrl && email) {
      void emailHelcimInvoiceLink({
        to: email,
        clientName: name,
        itemName: pkg.flyerName,
        amountUsd: pkg.ticketPriceUsd,
        url: invoice.payUrl,
      });
    }
    if (invoice?.payUrl) {
      void smsHelcimInvoiceLink({
        phone,
        itemName: pkg.flyerName,
        amountUsd: pkg.ticketPriceUsd,
        url: invoice.payUrl,
      });
    }

    void alertStaffOnFormSubmission({
      formName: "Golden Ticket request",
      emailSubject: `Golden Ticket — ${pkg.shortName} · ${name}`,
      emailBody: [
        `Package: ${pkg.flyerName} ($${pkg.ticketPriceUsd.toLocaleString()})`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        notes ? `Notes: ${notes}` : null,
        invoice
          ? `Helcim invoice ${invoice.invoiceNumber}${invoice.payUrl ? ` — ${invoice.payUrl}` : ""}`
          : pkg.containsMedication
            ? "Medication-related collection — request only (Helcim not connected)."
            : "Face collection — Square checkout is live.",
        invoiceError ? `Helcim note: ${invoiceError}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      smsLines: [pkg.shortName, `$${pkg.ticketPriceUsd}`, name, phone, invoice?.invoiceNumber || ""],
      replyTo: email || undefined,
    });

    return NextResponse.json({
      success: true,
      id: savedId,
      packageId,
      helcim: helcimOn,
      invoiceNumber: invoice?.invoiceNumber ?? null,
      payUrl: invoice?.payUrl ?? null,
      checkoutToken,
      invoiceError,
    });
  } catch (err) {
    console.error("[golden-ticket/request]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Call (630) 636-6193." },
      { status: 500 },
    );
  }
}
