import { getSupabase } from "@/lib/supabase-server";
import { buildBluefinHostedPayUrl, isBluefinPayconexConfigured } from "@/lib/bluefin-payconex";
import { parsePatientFromOrderNotes } from "@/lib/regen/clinic-invoice";

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
    .select("order_number, notes, amount_cents, customer_name, customer_email, customer_phone")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) {
    return <PayBlocked message="Invoice not found. Call (630) 636-6193." />;
  }

  const amountUsd = Number(order.amount_cents || 0) / 100;
  if (!(amountUsd > 0) || !isBluefinPayconexConfigured()) {
    return (
      <PayBlocked message="This invoice is not ready for online pay. Call (630) 636-6193 and we will send a Bluefin link." />
    );
  }

  const parsed = parsePatientFromOrderNotes(String(order.notes || ""));
  const name = String(order.customer_name || parsed.name || "Patient").trim();
  const parts = name.split(/\s+/);
  const payUrl = buildBluefinHostedPayUrl({
    amountUsd,
    firstName: parts[0] || "Patient",
    lastName: parts.slice(1).join(" ") || "REGEN",
    email: String(order.customer_email || parsed.email || "") || undefined,
    phone: String(order.customer_phone || "") || undefined,
    orderNumber: String(order.order_number),
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10">
      <div className="mx-auto max-w-[680px] text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">REGEN RX</p>
        <h1 className="mt-3 text-3xl font-black">Pay your clinic invoice</h1>
        <p className="mt-2 text-white/70 font-medium">
          ${amountUsd.toFixed(2)} · card is entered on Bluefin, not this site
        </p>
        <iframe
          title="Bluefin payment form"
          src={payUrl}
          className="mt-8 w-full rounded-2xl border-2 border-white/15 bg-white"
          height={850}
          width={660}
          style={{ maxWidth: "100%" }}
        />
        <p className="mt-4 text-sm text-white/50">
          Form will not load?{" "}
          <a href={payUrl} className="text-[#FFB8DC] underline">
            Open the Bluefin page
          </a>
        </p>
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
