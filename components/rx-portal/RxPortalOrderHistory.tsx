"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { RxPortalPipelineStepper } from "@/components/rx-portal/RxPortalPipelineStepper";
import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";

type PortalOrder = {
  reference: string;
  createdAt: string;
  status: string;
  patientName?: string | null;
  patientEmail?: string | null;
  dob?: string | null;
  totalUsd: number;
  paidAt?: string | null;
  npApprovedAt?: string | null;
  pharmacyOrderedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  trackingNumber?: string | null;
  shipLabel: string;
  detailHref: string;
};

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function RxPortalOrderHistory() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState(searchParams.get("q") || "");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rx-portal/orders?limit=100");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders((data.orders ?? []) as PortalOrder[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((o) => {
      const hay = [o.reference, o.patientName, o.patientEmail, o.trackingNumber, o.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [orders, q]);

  return (
    <RxPortalShell
      title="Order History"
      actions={
        <Link
          href="/rx-portal/place-order"
          className="inline-flex items-center rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-[#0B1F33] hover:bg-teal-400"
        >
          + New Order
        </Link>
      }
    >
      <div className="mb-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search orders by patient name, order #, tracking #..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading orders…</p>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
          No orders match.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Order #</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Patient</th>
                <th className="px-4 py-3 font-bold">Ship</th>
                <th className="px-4 py-3 font-bold">Total</th>
                <th className="px-4 py-3 font-bold">RX Status</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.reference} className={i % 2 ? "bg-slate-50/60" : "bg-white"}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0B1F33]">
                    {o.reference}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#0B1F33]">{o.patientName || "—"}</p>
                    {o.dob ? <p className="text-[11px] text-slate-500">DOB: {o.dob}</p> : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase text-sky-800">
                      {o.shipLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-teal-700">{formatUsd(o.totalUsd)}</td>
                  <td className="px-4 py-3">
                    <RxPortalPipelineStepper
                      signals={{
                        status: o.status,
                        paidAt: o.paidAt,
                        npApprovedAt: o.npApprovedAt,
                        pharmacyOrderedAt: o.pharmacyOrderedAt,
                        shippedAt: o.shippedAt,
                        deliveredAt: o.deliveredAt,
                        trackingNumber: o.trackingNumber,
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        href={o.detailHref}
                        className="rounded-md bg-teal-500 px-2.5 py-1 text-[11px] font-bold text-[#0B1F33] hover:bg-teal-400"
                      >
                        Invoice
                      </Link>
                      <Link
                        href={o.detailHref}
                        className="rounded-md bg-[#0B1F33] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800"
                      >
                        Rx
                      </Link>
                      <Link
                        href="/rx-portal/place-order"
                        className="rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-sky-500"
                      >
                        Reorder
                      </Link>
                      {o.trackingNumber ? (
                        <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-mono text-slate-600">
                          {o.trackingNumber}
                          <span
                            className={`ml-1 font-sans font-bold ${
                              o.deliveredAt ? "text-emerald-600" : "text-sky-600"
                            }`}
                          >
                            {o.deliveredAt ? "Delivered" : "In Transit"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">No tracking yet</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RxPortalShell>
  );
}
