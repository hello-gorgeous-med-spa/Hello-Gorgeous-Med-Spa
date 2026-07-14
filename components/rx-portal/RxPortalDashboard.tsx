"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import { RX_PORTAL_PHARMACY_PLACE_ORDER_URL } from "@/lib/rx-portal/nav";

type Counts = {
  needsReview: number;
  readyToShip: number;
  shipped: number;
};

export function RxPortalDashboard() {
  const [counts, setCounts] = useState<Counts>({ needsReview: 0, readyToShip: 0, shipped: 0 });
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rx-portal/orders?limit=100");
      const data = await res.json();
      if (res.ok && data.counts) setCounts(data.counts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <RxPortalShell
      title="Dashboard"
      actions={
        <Link
          href="/rx-portal/place-order"
          className="inline-flex items-center rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-[#0B1F33] hover:bg-teal-400"
        >
          + New Order
        </Link>
      }
    >
      <div className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const needle = q.trim();
            if (needle) {
              window.location.href = `/rx-portal/orders?q=${encodeURIComponent(needle)}`;
            }
          }}
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders by patient name, order #, batch #, tracking #..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-800">
            Illinois practice
          </h3>
          <p className="mt-2 text-sm text-amber-950/80 leading-relaxed">
            Hello Gorgeous RX fulfills eligible <strong>Illinois</strong> prescriptions after NP
            approval. Out-of-state requests need clinical/ops review before promising shipment.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 lg:col-span-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-800">
            Shipping schedule
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-sky-950/85 list-disc pl-5">
            <li>
              <strong>Shipping days:</strong> typically Monday–Thursday via compounding pharmacy.
            </li>
            <li>
              <strong>Deadlines:</strong> orders not submitted/processed by Thursday afternoon often
              ship the following Monday.
            </li>
            <li>
              <strong>Cancellation:</strong> pharmacy orders generally cannot be canceled after 24
              hours once submitted.
            </li>
            <li>
              <strong>Processing:</strong> sterile compounding often 3–4 business days; non-sterile
              faster — confirm in FormuConnect / vendor portal.
            </li>
          </ul>
          <a
            href={RX_PORTAL_PHARMACY_PLACE_ORDER_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-3 text-sm font-bold text-teal-700 hover:underline"
          >
            Open pharmacy Place Order portal →
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Needs review", value: counts.needsReview, href: "/rx-portal/orders" },
          { label: "Ready to ship", value: counts.readyToShip, href: "/rx-portal/orders" },
          { label: "Shipped", value: counts.shipped, href: "/rx-portal/orders" },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400 transition"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-black text-teal-600">
              {loading ? "—" : c.value}
            </p>
          </Link>
        ))}
      </div>
    </RxPortalShell>
  );
}
