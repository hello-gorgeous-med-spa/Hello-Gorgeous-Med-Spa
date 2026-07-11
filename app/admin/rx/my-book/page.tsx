"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { StaffRegenBook } from "@/lib/regen/staff-book";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function saleHref(sale: StaffRegenBook["recentSales"][0]): string {
  if (sale.source === "online_order") {
    return `/admin/rx/regen-orders/${encodeURIComponent(sale.reference)}`;
  }
  return `/admin/rx/clinic-sale?mode=regen`;
}

export default function MyRegenBookPage() {
  const [days, setDays] = useState(90);
  const [book, setBook] = useState<StaffRegenBook | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rx/my-book?days=${days}`);
      const data = await res.json();
      if (res.ok) setBook(data.book);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™ · RE GEN
          </p>
          <h1 className="text-3xl font-black text-black">My book of business</h1>
          <p className="text-black/60 mt-1 text-sm max-w-xl">
            Patients and orders credited to you — portal checkout and in-clinic RE GEN sales.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx/my-day" className="font-bold text-[#E6007E] underline">
            My day
          </Link>
          <Link href="/admin/rx/leaderboard" className="font-bold text-[#E6007E] underline">
            Leaderboard
          </Link>
          <Link href="/admin/rx/commission-payouts" className="font-bold text-[#E6007E] underline">
            My payouts
          </Link>
          <Link href="/admin/rx/portal" className="font-bold text-[#E6007E] underline">
            RE GEN Portal
          </Link>
          <Link href="/admin/rx/clinic-sale?mode=regen" className="font-bold text-[#E6007E] underline">
            In-clinic sale
          </Link>
          <Link href="/admin/rx/regen-sales" className="font-bold text-[#E6007E] underline">
            Sales report
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        {[30, 90, 180].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-full border-2 text-sm font-bold ${
              days === d ? "border-[#E6007E] bg-rose-50 text-[#E6007E]" : "border-black/20"
            }`}
          >
            Last {d} days
          </button>
        ))}
      </div>

      {loading || !book ? (
        <p className="text-black/50">Loading…</p>
      ) : (
        <>
          <div className="rounded-2xl border-4 border-[#E6007E] bg-gradient-to-r from-[#FFF0F7] to-white p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
              {book.staffDisplayName}
            </p>
            {book.commissionRate != null && (
              <p className="text-sm text-black/65 mt-1">
                RE GEN commission rate:{" "}
                <strong>{(book.commissionRate * 100).toFixed(0)}%</strong> on collected sales
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Paid sales", value: String(book.paidSaleCount) },
              { label: "Revenue credited", value: formatUsd(book.paidTotalUsd) },
              {
                label: "Est. commission",
                value:
                  book.estimatedCommissionUsd != null
                    ? formatUsd(book.estimatedCommissionUsd)
                    : "—",
              },
              { label: "My patients", value: String(book.uniqueClients) },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
              >
                <p className="text-xs text-black/50 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-black mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {book.openPipelineCount > 0 && (
            <p className="text-sm text-amber-800 bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3">
              {book.openPipelineCount} order(s) still in fulfillment pipeline — follow up in{" "}
              <Link href="/admin/rx/regen-orders" className="font-bold underline">
                RE GEN Fulfillment
              </Link>
              .
            </p>
          )}

          <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
            <h2 className="font-black text-lg mb-4">My patients</h2>
            {book.clients.length === 0 ? (
              <p className="text-sm text-black/50">
                No credited RE GEN sales yet — sell via the staff portal or in-clinic checkout.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-black/50 border-b border-black/10">
                      <th className="py-2 pr-4">Patient</th>
                      <th className="py-2 pr-4">Sales</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">Last sale</th>
                      <th className="py-2">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {book.clients.map((c) => (
                      <tr key={c.key} className="border-b border-black/5">
                        <td className="py-2 pr-4">
                          {c.clientId ? (
                            <Link
                              href={`/admin/clients/${c.clientId}`}
                              className="font-bold text-[#E6007E] hover:underline"
                            >
                              {c.name}
                            </Link>
                          ) : (
                            <span className="font-bold">{c.name}</span>
                          )}
                          {c.email && (
                            <p className="text-xs text-black/45">{c.email}</p>
                          )}
                        </td>
                        <td className="py-2 pr-4">{c.saleCount}</td>
                        <td className="py-2 pr-4 font-bold">{formatUsd(c.totalUsd)}</td>
                        <td className="py-2 pr-4">
                          {new Date(c.lastSaleAt).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          {c.openOrders > 0 ? (
                            <span className="text-xs font-bold text-amber-700">
                              {c.openOrders} open
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border-4 border-black bg-white p-5">
            <h2 className="font-black text-lg mb-4">Recent sales</h2>
            {book.recentSales.length === 0 ? (
              <p className="text-sm text-black/50">No sales in this period.</p>
            ) : (
              <ul className="space-y-2">
                {book.recentSales.slice(0, 20).map((sale) => (
                  <li
                    key={`${sale.source}-${sale.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 px-4 py-3"
                  >
                    <div>
                      <p className="font-bold">{sale.customerName || "Patient"}</p>
                      <p className="text-xs text-black/50 font-mono">{sale.reference}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#E6007E]">
                        {formatUsd(sale.totalUsd)}
                      </span>
                      <Link
                        href={saleHref(sale)}
                        className="text-xs font-bold text-black underline"
                      >
                        View →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
