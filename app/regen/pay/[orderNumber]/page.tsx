import type { Metadata } from "next";

import { RegenPayCheckout } from "@/components/regen/RegenPayCheckout";
import { RegenPayInvoiceChrome } from "@/components/regen/RegenPayInvoiceChrome";
import { bluefinAccountId, isBluefinAccountConfigured, PAYCONEX_IFRAME_LIB } from "@/lib/bluefin-payconex";
import { parsePatientFromOrderNotes } from "@/lib/regen/clinic-invoice";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pay clinic invoice",
  robots: { index: false, follow: false },
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function shippingFromOrder(order: Record<string, unknown>) {
  const direct = asRecord(order.shipping_address);
  const intake = asRecord(order.intake_data);
  const nested = direct || asRecord(intake?.shipping);
  if (!nested) return {};
  return {
    street: String(nested.street1 || nested.street || nested.line1 || "").trim(),
    city: String(nested.city || "").trim(),
    state: String(nested.state || "IL").trim().slice(0, 2).toUpperCase(),
    zip: String(nested.zip || nested.postal || nested.postalCode || "").trim(),
  };
}

export default async function RegenPayPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return <PayBlocked message="Call (630) 636-6193 — we cannot load this invoice right now." />;
  }

  const { data: order } = await supabase
    .from("regen_orders")
    .select(
      "order_number, notes, amount_cents, customer_name, customer_email, customer_phone, status, intake_data, medication",
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) {
    return <PayBlocked message="Invoice not found. Call (630) 636-6193." />;
  }

  const status = String(order.status || "");
  if (status === "paid" || status === "sent_to_pharmacy" || status === "shipped") {
    return <PayBlocked message="This invoice is already paid. If you have questions, call (630) 636-6193." />;
  }

  const amountUsd = Number(order.amount_cents || 0) / 100;
  const accountId = bluefinAccountId();
  if (!(amountUsd > 0) || !isBluefinAccountConfigured() || !accountId) {
    return (
      <PayBlocked message="This invoice is not ready for online pay. Call (630) 636-6193 and we will send a Bluefin link." />
    );
  }

  const parsed = parsePatientFromOrderNotes(String(order.notes || ""));
  const name = String(order.customer_name || parsed.name || "Patient").trim();
  const parts = name.split(/\s+/);
  const firstName = parts[0] || "Patient";
  const lastName = parts.slice(1).join(" ") || "REGEN";
  const email = String(order.customer_email || parsed.email || "") || undefined;
  const phone = String(order.customer_phone || "") || undefined;
  const ship = shippingFromOrder(order as Record<string, unknown>);
  const medication = String(order.medication || "").trim();
  const label = medication
    ? `${medication} · clinic invoice ${orderNumber}`
    : `Clinic invoice ${orderNumber}`;

  return (
    <RegenPayInvoiceChrome title="Secure clinic invoice">
      <div className="mb-5 grid grid-cols-2 gap-3 border border-[#c8c8c8] bg-[#f7f7f7] px-3 py-3 text-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#666]">Invoice</p>
          <p className="font-medium">{orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#666]">Amount due</p>
          <p className="text-lg font-semibold">${amountUsd.toFixed(2)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#666]">Patient</p>
          <p>
            {firstName} {lastName}
            {email ? ` · ${email}` : ""}
          </p>
        </div>
      </div>
      <RegenPayCheckout
        orderNumber={String(order.order_number)}
        amountUsd={amountUsd}
        label={label}
        accountId={accountId}
        iframeLib={PAYCONEX_IFRAME_LIB}
        billing={{
          firstName,
          lastName,
          email,
          phone,
          ...ship,
        }}
      />
    </RegenPayInvoiceChrome>
  );
}

function PayBlocked({ message }: { message: string }) {
  return (
    <RegenPayInvoiceChrome title="Clinic invoice">
      <p className="text-sm text-[#444]">{message}</p>
    </RegenPayInvoiceChrome>
  );
}
