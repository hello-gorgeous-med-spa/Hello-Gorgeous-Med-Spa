"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Order = {
  id: string;
  order_number?: string;
  status?: string;
  amount_cents?: number;
  total?: number;
  customer_name?: string;
  created_at: string;
  notes?: string;
};

function dollars(o: Order) {
  if (Number(o.amount_cents) > 0) return Number(o.amount_cents) / 100;
  return Number(o.total || 0);
}

export default function PaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const oRes = await fetch("/api/regen/ops/orders?status=all", { cache: "no-store" });
    if (oRes.ok) {
      const j = await oRes.json();
      setOrders(j.orders || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function sendPay(order: Order, forceResend = false) {
    setSending(order.id);
    const res = await fetch("/api/regen/ops/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, forceResend }),
    });
    const json = await res.json();
    setSending(null);
    if (!res.ok) {
      setMsg((prev) => ({ ...prev, [order.id]: json.error || "Could not send the pay link." }));
      return;
    }
    if (json.charmManual) {
      setMsg((prev) => ({
        ...prev,
        [order.id]: `Charm backup · $${Number(json.quote?.amountUsd || 0).toFixed(2)}. Create that invoice in Charm and send the payment link.`,
      }));
    } else {
      setMsg((prev) => ({
        ...prev,
        [order.id]: `Sent $${Number(json.quote?.amountUsd || 0).toFixed(2)}${json.emailed ? " · email" : ""}${json.texted ? " · text" : ""}${json.payUrl ? ` · ${json.payUrl}` : ""}`,
      }));
    }
    await load();
  }

  const paid = orders.filter((o) => /paid|shipped|sent_to_pharmacy/i.test(String(o.status || "")));
  const open = orders.filter((o) => !/paid|shipped|sent_to_pharmacy/i.test(String(o.status || "")));
  const month = paid.reduce((sum, o) => sum + dollars(o), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Money</h1>
          <p className="text-white/50">
            PayConex texts tryregenrx.com/pay. Charm is the backup if the card box fails. Refunds live in Charm / Bluefin.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/ops/desk" className="px-3 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold">
            Walk-in invoice
          </Link>
          <button onClick={() => void load()} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-sm">Open invoices</p>
          <p className="text-white text-2xl font-bold">{open.length}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-sm">Posted (this list)</p>
          <p className="text-white text-2xl font-bold">${month.toFixed(0)}</p>
        </div>
      </div>

      {loading && <p className="text-white/40">Loading…</p>}
      {!loading && orders.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">
          No invoices yet. Approve on Today or enter a walk-in.
        </div>
      )}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium">{o.order_number || o.id}</p>
                <p className="text-white/45 text-sm">
                  {o.customer_name || "Patient"} · {o.status} · {new Date(o.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-white text-xl font-bold">${dollars(o).toFixed(2)}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                disabled={sending === o.id}
                onClick={() => void sendPay(o, /INVOICE \$/.test(String(o.notes || "")))}
                className="px-3 py-2 rounded-lg bg-[#E6007E] text-white text-sm disabled:opacity-50"
              >
                {sending === o.id ? "Sending…" : "Send PayConex link"}
              </button>
              <Link href="/ops/orders" className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">
                Orders
              </Link>
            </div>
            {msg[o.id] ? <p className="text-[#FFB8DC] text-sm mt-2">{msg[o.id]}</p> : null}
          </div>
        ))}
      </div>
      <Link href="/ops/reports" className="inline-block text-teal-400 text-sm">
        Open reports →
      </Link>
    </div>
  );
}
