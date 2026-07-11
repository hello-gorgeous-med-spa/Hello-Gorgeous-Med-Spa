"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { RegenSalesByStaffReport } from "@/lib/regen/sales-attribution";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function channelLabel(channel: string): string {
  if (channel === "staff_portal") return "Staff portal";
  if (channel === "staff_assisted") return "Staff-assisted online";
  if (channel === "in_clinic") return "In-clinic";
  return "Online";
}

export default function RegenSalesByStaffPage() {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState<RegenSalesByStaffReport | null>(null);
  const [viewerRole, setViewerRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rx/regen-sales?days=${days}`);
      const data = await res.json();
      if (res.ok) {
        setReport(data.report);
        setViewerRole(data.viewerRole ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  const isOwnerView = report?.scope === "all";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™ · RE GEN
          </p>
          <h1 className="text-3xl font-black text-black">
            {isOwnerView ? "Sales by staff" : "My RE GEN sales"}
          </h1>
          <p className="text-black/60 mt-1 text-sm max-w-xl">
            {isOwnerView
              ? "Paid online orders and in-clinic RE GEN catalog sales — attributed to Michelle, Laura, Ryan, and the rest of the team."
              : "Your credited RE GEN sales from the staff portal and in-clinic checkout."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx" className="font-bold text-[#E6007E] underline">
            Command Center
          </Link>
          <Link href="/admin/rx/clinic-reports" className="font-bold text-[#E6007E] underline">
            Clinic reports
          </Link>
          <Link href="/admin/rx/regen-orders" className="font-bold text-[#E6007E] underline">
            Fulfillment
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        {[7, 30, 90].map((d) => (
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
              { label: "Paid sales", value: String(report.paidOrderCount) },
              { label: "Revenue", value: formatUsd(report.paidTotalUsd) },
              {
                label: isOwnerView ? "Staff credited" : "Your sales",
                value: String(report.byStaff.reduce((n, s) => n + s.orderCount, 0)),
              },
              {
                label: "Unassigned online",
                value: isOwnerView ? String(report.unassignedCount) : "—",
              },
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

          {isOwnerView && report.unassignedCount > 0 && (
            <p className="text-sm text-amber-800 bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3">
              {report.unassignedCount} self-serve online order(s) ({formatUsd(report.unassignedTotalUsd)})
              have no staff attribution — use the staff portal or in-clinic sale to credit sellers going forward.
            </p>
          )}

          {report.byStaff.length === 0 ? (
            <p className="text-sm text-black/50">No paid RE GEN sales in this period.</p>
          ) : (
            <div className="space-y-4">
              {report.byStaff.map((staff) => (
                <section
                  key={staff.userId || staff.email || staff.displayName}
                  className="rounded-2xl border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedStaff(
                        expandedStaff === staff.displayName ? null : staff.displayName,
                      )
                    }
                    className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-rose-50/40"
                  >
                    <div>
                      <h2 className="font-black text-lg">{staff.displayName}</h2>
                      {staff.email && (
                        <p className="text-xs text-black/50">{staff.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#E6007E] text-xl">
                        {formatUsd(staff.totalUsd)}
                      </p>
                      <p className="text-xs text-black/55">
                        {staff.orderCount} sale{staff.orderCount === 1 ? "" : "s"} · portal{" "}
                        {staff.portalCount} · clinic {staff.clinicCount}
                      </p>
                    </div>
                  </button>

                  {expandedStaff === staff.displayName && (
                    <div className="border-t-2 border-black/10 px-5 py-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-black/50 border-b border-black/10">
                              <th className="py-2 pr-4">Date</th>
                              <th className="py-2 pr-4">Ref</th>
                              <th className="py-2 pr-4">Customer</th>
                              <th className="py-2 pr-4">Channel</th>
                              <th className="py-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {staff.sales.map((sale) => (
                              <tr key={`${sale.source}-${sale.id}`} className="border-b border-black/5">
                                <td className="py-2 pr-4">
                                  {new Date(sale.soldAt).toLocaleDateString()}
                                </td>
                                <td className="py-2 pr-4 font-mono text-xs">{sale.reference}</td>
                                <td className="py-2 pr-4">{sale.customerName || "—"}</td>
                                <td className="py-2 pr-4">{channelLabel(sale.salesChannel)}</td>
                                <td className="py-2 font-bold">{formatUsd(sale.totalUsd)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {viewerRole && viewerRole !== "owner" && viewerRole !== "admin" && (
            <p className="text-xs text-black/45">
              Showing only sales credited to you. Owner sees the full team rollup.
            </p>
          )}
        </>
      )}
    </div>
  );
}
