"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Filter = "needs_review" | "ready_to_ship" | "shipped" | "all";

type OrderSummary = {
  reference: string;
  title: string;
  totalUsd: number;
  status: string;
  needsReview: boolean;
  readyToShip: boolean;
  patientName: string | null;
  phone: string | null;
  email: string | null;
  goal: string | null;
  paidAt: string | null;
  intakeCompletedAt: string | null;
  telehealthRequired: boolean;
  telehealthCompletedAt: string | null;
  npApprovedAt: string | null;
  pharmacyOrderedAt: string | null;
  shippedAt: string | null;
  trackingNumber: string | null;
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "needs_review", label: "Needs NP review" },
  { id: "ready_to_ship", label: "Ready to ship" },
  { id: "shipped", label: "Shipped" },
  { id: "all", label: "All paid" },
];

function statusBadge(order: OrderSummary) {
  if (order.shippedAt || order.status === "shipped") {
    return "bg-green-500/20 text-green-300";
  }
  if (order.npApprovedAt) return "bg-blue-500/20 text-blue-200";
  if (order.intakeCompletedAt) return "bg-amber-500/20 text-amber-200";
  return "bg-gray-700 text-gray-300";
}

export default function RegenOrdersFulfillmentPage() {
  const [filter, setFilter] = useState<Filter>("needs_review");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [counts, setCounts] = useState({ needsReview: 0, readyToShip: 0, shipped: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rx/regen-orders?filter=${filter}&limit=60`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setCounts(data.counts || { needsReview: 0, readyToShip: 0, shipped: 0, total: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">RE GEN online</p>
            <h1 className="text-2xl font-black">
              Fulfillment <span className="text-[#FF2D8E]">queue</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              NP approve → pharmacy order → ship with tracking. Patients get SMS at approve and ship.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link href="/admin/rx" className="text-[#FFB8DC] hover:text-white">
              ← Command Center
            </Link>
            <Link href="/admin/rx/pharmacy-orders" className="text-[#FFB8DC] hover:text-white">
              Pharmacy sheet →
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                filter === f.id
                  ? "bg-[#E6007E] text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"
              }`}
            >
              {f.label}
              {f.id === "needs_review" && counts.needsReview > 0 ? ` (${counts.needsReview})` : ""}
              {f.id === "ready_to_ship" && counts.readyToShip > 0 ? ` (${counts.readyToShip})` : ""}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 py-12 text-center">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500 py-12 text-center">No orders in this queue.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-[10px] uppercase tracking-wider text-[#FFB8DC]">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.reference} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-bold">{order.reference}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{order.title}</p>
                      <p className="text-[11px] text-gray-500">${order.totalUsd.toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.patientName || "—"}</p>
                      <p className="text-[11px] text-gray-500">{order.phone || order.email || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-400 space-y-0.5">
                      <p>{order.intakeCompletedAt ? "✓ Intake" : "○ Intake"}</p>
                      {order.telehealthRequired ? (
                        <p>{order.telehealthCompletedAt ? "✓ Telehealth" : "○ Telehealth"}</p>
                      ) : null}
                      <p>{order.npApprovedAt ? "✓ NP approved" : "○ NP review"}</p>
                      <p>{order.shippedAt ? "✓ Shipped" : "○ Ship"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadge(order)}`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                      {order.trackingNumber ? (
                        <p className="text-[10px] text-gray-500 mt-1 font-mono">{order.trackingNumber}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/rx/regen-orders/${encodeURIComponent(order.reference)}`}
                        className="text-[#FFB8DC] font-bold text-xs hover:underline"
                      >
                        Fulfill →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
