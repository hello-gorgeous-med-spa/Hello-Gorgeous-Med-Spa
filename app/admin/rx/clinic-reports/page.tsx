"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { ClinicRxReport } from "@/lib/rx-clinic-refill";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function ClinicRxReportsPage() {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState<ClinicRxReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rx/clinic-reports?days=${days}`);
      const data = await res.json();
      if (res.ok) setReport(data.report);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™
          </p>
          <h1 className="text-3xl font-black text-black">Clinic RX Reports</h1>
          <p className="text-black/60 mt-1 text-sm">
            In-person sales — revenue, owner discounts, and fulfillment at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/rx" className="text-sm font-bold text-[#E6007E] underline">
            Command Center
          </Link>
          <Link href="/admin/rx-ledger" className="text-sm font-bold text-[#E6007E] underline">
            Ledger
          </Link>
          <Link href="/admin/rx/regen-sales" className="text-sm font-bold text-[#E6007E] underline">
            RE GEN sales
          </Link>
          <Link href="/admin/rx/my-book" className="text-sm font-bold text-[#E6007E] underline">
            My book
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        {[30, 90].map((d) => (
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

      {loading || !report ? (
        <p className="text-black/50">Loading…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Paid sales", value: String(report.paidCount) },
              { label: "Revenue", value: formatUsd(report.paidTotalUsd) },
              { label: "Owner discounts", value: formatUsd(report.discountTotalUsd) },
              { label: "Shipped", value: String(report.shippedCount) },
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

          {Object.keys(report.byMedication).length > 0 && (
            <section className="rounded-2xl border-4 border-black bg-white p-5">
              <h2 className="font-black mb-3">By medication</h2>
              <ul className="space-y-2 text-sm">
                {Object.entries(report.byMedication).map(([med, stats]) => (
                  <li key={med} className="flex justify-between border-b border-black/5 pb-2">
                    <span>{med}</span>
                    <span className="font-bold">
                      {stats.count} sales · {formatUsd(stats.totalUsd)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border-4 border-black bg-amber-50/50 p-5">
            <h2 className="font-black mb-1">Owner discount audit</h2>
            <p className="text-xs text-black/60 mb-4">
              {report.discountCount} discounts in the last {report.days} days — all visible, no
              surprises.
            </p>
            {report.discounts.length === 0 ? (
              <p className="text-sm text-black/50">No owner discounts in this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-black/50 border-b border-black/10">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Client</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Reason</th>
                      <th className="py-2">Authorized by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.discounts.map((d) => (
                      <tr key={d.encounterId} className="border-b border-black/5">
                        <td className="py-2 pr-4">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-4">{d.clientName || "—"}</td>
                        <td className="py-2 pr-4 font-bold text-amber-800">
                          -{formatUsd(d.amountUsd)}
                        </td>
                        <td className="py-2 pr-4">{d.reason || "—"}</td>
                        <td className="py-2">{d.authorizedBy || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {report.awaitingPaymentCount > 0 && (
            <p className="text-sm text-black/70">
              {report.awaitingPaymentCount} clinic sale(s) awaiting payment — check{" "}
              <Link href="/admin/rx/clinic-sale" className="text-[#E6007E] font-bold underline">
                Clinic RX Sale
              </Link>
              .
            </p>
          )}
        </>
      )}
    </div>
  );
}
