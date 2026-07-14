"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import type { ClinicRxReport } from "@/lib/rx-clinic-refill";
import type { RegenSalesByStaffReport } from "@/lib/regen/sales-attribution";

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

export function RxPortalSpend() {
  const [days, setDays] = useState(30);
  const [clinic, setClinic] = useState<ClinicRxReport | null>(null);
  const [regen, setRegen] = useState<RegenSalesByStaffReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [clinicRes, salesRes] = await Promise.all([
        fetch(`/api/admin/rx/clinic-reports?days=${days}`),
        fetch(`/api/admin/rx/regen-sales?days=${days}`),
      ]);
      const clinicJson = await clinicRes.json();
      const salesJson = await salesRes.json();
      if (clinicRes.ok) setClinic(clinicJson.report ?? null);
      if (salesRes.ok) setRegen(salesJson.report ?? null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <RxPortalShell
      title="Spend Reports"
      actions={
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx-ledger" className="font-semibold text-teal-700 hover:underline">
            Ledger
          </Link>
          <Link
            href="/admin/rx/clinic-reports"
            className="font-semibold text-teal-700 hover:underline"
          >
            Clinic detail
          </Link>
          <Link href="/admin/rx/regen-sales" className="font-semibold text-teal-700 hover:underline">
            RE GEN sales
          </Link>
        </div>
      }
    >
      <div className="mb-4 flex gap-2">
        {[30, 90].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays(d)}
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              days === d
                ? "border-teal-500 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Last {d} days
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Clinic RX revenue
            </p>
            <p className="mt-2 text-2xl font-black text-teal-600">
              {clinic ? formatUsd(clinic.paidTotalUsd) : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Clinic paid sales
            </p>
            <p className="mt-2 text-2xl font-black text-[#0B1F33]">{clinic?.paidCount ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              RE GEN revenue
            </p>
            <p className="mt-2 text-2xl font-black text-teal-600">
              {regen ? formatUsd(regen.paidTotalUsd) : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              RE GEN paid sales
            </p>
            <p className="mt-2 text-2xl font-black text-[#0B1F33]">
              {regen?.paidOrderCount ?? "—"}
            </p>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-slate-500">
        Aggregated clinic + RE GEN spend for owner/staff. Full breakouts live in Admin RX.
      </p>
    </RxPortalShell>
  );
}
