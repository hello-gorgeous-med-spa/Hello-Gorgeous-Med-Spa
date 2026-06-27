"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { FlowWaveIntakeWithClient, FlowWaveSessionWithClient } from "@/lib/flowwave-intake";
import { flowWaveIntakeUrl } from "@/lib/flowwave-focus";

function badgeClass(screening: string) {
  if (screening === "contraindicated") return "bg-red-500/20 text-red-200";
  if (screening === "caution") return "bg-amber-500/20 text-amber-200";
  if (screening === "cleared") return "bg-green-500/20 text-green-200";
  return "bg-gray-700 text-gray-300";
}

export default function FlowWaveCommandCenterPage() {
  const [intakes, setIntakes] = useState<FlowWaveIntakeWithClient[]>([]);
  const [sessions, setSessions] = useState<FlowWaveSessionWithClient[]>([]);
  const [counts, setCounts] = useState({ contraindicated: 0, caution: 0, cleared: 0 });
  const [tableReady, setTableReady] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/flowwave?limit=50");
      const data = await res.json();
      if (res.ok) {
        setIntakes(data.intakes || []);
        setSessions(data.sessions || []);
        setCounts(data.counts || { contraindicated: 0, caution: 0, cleared: 0 });
        setTableReady(data.tableReady !== false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D5E8F5]">
              Hello Gorgeous Admin
            </p>
            <h1 className="text-3xl font-black mt-1">FlowWave FOCUS Command</h1>
            <p className="text-white/60 mt-2 text-sm max-w-xl">
              Shockwave / CRT intakes, contraindication screening, SOAP notes, and session logs —
              portal records for Ryan and Danielle.
            </p>
          </div>
          <Link
            href="/admin/flowwave/intake"
            className="px-5 py-2.5 rounded-full bg-[#1A5F8A] text-white font-bold text-sm hover:bg-[#134d72]"
          >
            + New intake
          </Link>
        </div>

        {!tableReady && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100 text-sm">
            FlowWave tables not migrated yet. Run{" "}
            <code className="bg-black/30 px-1 rounded">supabase db push</code> to apply{" "}
            <code className="bg-black/30 px-1 rounded">20260625150000_flowwave_focus.sql</code>.
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-red-300">Contraindicated</p>
            <p className="text-3xl font-black mt-1">{counts.contraindicated}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-amber-300">Caution review</p>
            <p className="text-3xl font-black mt-1">{counts.caution}</p>
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wider text-green-300">Cleared / in treatment</p>
            <p className="text-3xl font-black mt-1">{counts.cleared}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="bg-[#1A5F8A] px-4 py-3 font-bold text-sm uppercase tracking-wider">
            Recent intakes
          </div>
          {loading ? (
            <div className="p-8 animate-pulse bg-white/5 h-32" />
          ) : intakes.length === 0 ? (
            <p className="p-8 text-white/50 text-sm">No intakes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-white/40 border-b border-white/10">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Screening</th>
                    <th className="px-4 py-3">Clinician</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {intakes.map((i) => (
                    <tr key={i.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(i.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{i.client_name || "—"}</td>
                      <td className="px-4 py-3">{i.treatment_area || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeClass(i.screening_result)}`}
                        >
                          {i.screening_result}
                        </span>
                      </td>
                      <td className="px-4 py-3">{i.clinician || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={flowWaveIntakeUrl({
                            clientId: i.client_id,
                            intakeId: i.id,
                          })}
                          className="text-[#D5E8F5] font-bold hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="bg-[#1A5F8A] px-4 py-3 font-bold text-sm uppercase tracking-wider">
            Recent sessions
          </div>
          {loading ? (
            <div className="p-8 animate-pulse bg-white/5 h-32" />
          ) : sessions.length === 0 ? (
            <p className="p-8 text-white/50 text-sm">No sessions logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-white/40 border-b border-white/10">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Intensity</th>
                    <th className="px-4 py-3">Shots</th>
                    <th className="px-4 py-3">Clinician</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 25).map((s) => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">{s.session_date}</td>
                      <td className="px-4 py-3">{s.client_name || "—"}</td>
                      <td className="px-4 py-3">{s.treatment_area || "—"}</td>
                      <td className="px-4 py-3">{s.intensity ?? "—"}</td>
                      <td className="px-4 py-3">{s.shots_delivered ?? "—"}</td>
                      <td className="px-4 py-3">{s.clinician || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
