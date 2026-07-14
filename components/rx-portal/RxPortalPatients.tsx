"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import type { RxPatientSummary } from "@/lib/rx-patients/types";

export function RxPortalPatients() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<RxPatientSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/rx/ops/patients?q=${encodeURIComponent(query)}&limit=40`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setRows((data.patients ?? []) as RxPatientSummary[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void search(q.trim());
    }, 280);
    return () => clearTimeout(t);
  }, [q, search]);

  return (
    <RxPortalShell
      title="My Patients"
      actions={
        <Link href="/admin/rx/ops" className="text-sm font-semibold text-teal-700 hover:underline">
          Full RX Ops →
        </Link>
      }
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search patients by name, email, or phone…"
        className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Searching…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
          {q.trim() ? "No patients match." : "Type to search the RX patient chart."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Patient</th>
                <th className="px-4 py-3 font-bold">Contact</th>
                <th className="px-4 py-3 font-bold">State</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id} className={i % 2 ? "bg-slate-50/60" : "bg-white"}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#0B1F33]">{p.name}</p>
                    {p.rxActive ? (
                      <span className="text-[10px] font-bold uppercase text-teal-600">Active RX</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <p>{p.email || "—"}</p>
                    <p className="text-xs text-slate-400">{p.phone || ""}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.state || "—"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/rx/ops?patient=${encodeURIComponent(p.id)}`}
                      className="rounded-md bg-teal-500 px-2.5 py-1 text-[11px] font-bold text-[#0B1F33]"
                    >
                      Open chart
                    </Link>
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
