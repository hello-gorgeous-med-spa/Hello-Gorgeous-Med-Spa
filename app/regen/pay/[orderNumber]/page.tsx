import { RegenPayCheckout } from "@/components/regen/RegenPayCheckout";
import { bluefinAccountId, isBluefinAccountConfigured, PAYCONEX_IFRAME_LIB } from "@/lib/bluefin-payconex";
import { parsePatientFromOrderNotes } from "@/lib/regen/clinic-invoice";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

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
    .select("order_number, notes, amount_cents, customer_name, customer_email, customer_phone, status")
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
  const invoiceMatch = String(order.notes || "").match(/INVOICE (\$[\d.]+)/);
  const label = invoiceMatch ? `Clinic invoice ${invoiceMatch[1]}` : "Clinic invoice";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10">
      <div className="mx-auto max-w-[560px] text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">REGEN RX</p>
        <h1 className="mt-3 text-3xl font-black">Pay your clinic invoice</h1>
        <p className="mt-2 text-white/70 font-medium">
          ${amountUsd.toFixed(2)} · card is entered on Bluefin, not stored on this site
        </p>
        <RegenPayCheckout
          orderNumber={String(order.order_number)}
          amountUsd={amountUsd}
          label={label}
          firstName={firstName}
          lastName={lastName}
          email={email}
          accountId={accountId}
          iframeLib={PAYCONEX_IFRAME_LIB}
        />
      </div>
    </main>
  );
}

function PayBlocked({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">REGEN RX</p>
        <h1 className="mt-3 text-3xl font-black">Pay your clinic invoice</h1>
        <p className="mt-4 text-white/70 font-medium">{message}</p>
      </div>
    </main>
  );
}
