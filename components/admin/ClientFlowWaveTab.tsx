"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { FlowWaveIntakeWithClient, FlowWaveSessionWithClient } from "@/lib/flowwave-intake";
import { flowWaveIntakeUrl } from "@/lib/flowwave-focus";

function screeningBadge(result: string) {
  if (result === "contraindicated") return "bg-red-100 text-red-800";
  if (result === "caution") return "bg-amber-100 text-amber-900";
  if (result === "cleared") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-700";
}

export function ClientFlowWaveTab({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const [intakes, setIntakes] = useState<FlowWaveIntakeWithClient[]>([]);
  const [sessions, setSessions] = useState<FlowWaveSessionWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [intRes, sesRes] = await Promise.all([
        fetch(`/api/admin/flowwave/intakes?client_id=${encodeURIComponent(clientId)}&limit=20`),
        fetch(`/api/admin/flowwave/sessions?client_id=${encodeURIComponent(clientId)}&limit=30`),
      ]);
      const intData = await intRes.json();
      const sesData = await sesRes.json();
      if (intRes.ok) setIntakes(intData.rows || []);
      if (sesRes.ok) setSessions(sesData.rows || []);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  const latestIntake = intakes[0];
  const blocked = intakes.some((i) => i.screening_result === "contraindicated");

  if (loading) {
    return <div className="animate-pulse h-40 bg-white rounded-xl border border-black/10" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-black">FlowWave / Shockwave</h2>
          <p className="text-sm text-black/60 mt-1">
            Intake screening, SOAP notes, and session history for {clientName}.
          </p>
        </div>
        <Link
          href={flowWaveIntakeUrl({ clientId })}
          className="px-4 py-2 rounded-full bg-[#1A5F8A] text-white text-sm font-bold hover:bg-[#134d72]"
        >
          + New intake / session
        </Link>
      </div>

      {blocked && (
        <div className="rounded-2xl border-4 border-red-600 bg-red-50 p-4">
          <p className="font-black text-sm uppercase tracking-wider text-red-800">
            Contraindication on file
          </p>
          <p className="text-sm mt-1 text-red-900">
            Review latest intake before scheduling treatment.
          </p>
        </div>
      )}

      {latestIntake && (
        <div className="rounded-2xl border-4 border-black bg-[#D5E8F5]/40 p-5 shadow-[6px_6px_0_0_rgba(26,95,138,0.25)]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1A5F8A]">Latest intake</p>
          <p className="font-black mt-1">
            {latestIntake.treatment_area || "General"} —{" "}
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${screeningBadge(latestIntake.screening_result)}`}
            >
              {latestIntake.screening_result}
            </span>
          </p>
          <p className="text-sm text-black/70 mt-1">
            {latestIntake.primary_complaint || "No complaint recorded"}
          </p>
          <p className="text-xs text-black/50 mt-2">
            {new Date(latestIntake.created_at).toLocaleString()}
            {latestIntake.clinician ? ` · ${latestIntake.clinician}` : ""}
          </p>
          <Link
            href={flowWaveIntakeUrl({ clientId, intakeId: latestIntake.id })}
            className="inline-block mt-3 text-sm font-bold text-[#1A5F8A] hover:underline"
          >
            Open intake →
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl border-4 border-black overflow-hidden">
        <div className="bg-[#1A5F8A] text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">
          Session log ({sessions.length})
        </div>
        {sessions.length === 0 ? (
          <p className="p-6 text-sm text-black/60">No sessions logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase text-black/50">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Area</th>
                  <th className="px-4 py-2">Intensity</th>
                  <th className="px-4 py-2">Hz</th>
                  <th className="px-4 py-2">Shots</th>
                  <th className="px-4 py-2">Pain</th>
                  <th className="px-4 py-2">Clinician</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-black/5 hover:bg-[#D5E8F5]/30">
                    <td className="px-4 py-2">{s.session_number ?? "—"}</td>
                    <td className="px-4 py-2">{s.session_date}</td>
                    <td className="px-4 py-2">{s.treatment_area || "—"}</td>
                    <td className="px-4 py-2">{s.intensity ?? "—"}</td>
                    <td className="px-4 py-2">{s.frequency_hz ?? "—"}</td>
                    <td className="px-4 py-2">{s.shots_delivered ?? "—"}</td>
                    <td className="px-4 py-2">
                      {s.pain_before != null || s.pain_after != null
                        ? `${s.pain_before ?? "?"} → ${s.pain_after ?? "?"}`
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{s.clinician || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {intakes.length > 1 && (
        <div className="bg-white rounded-2xl border-4 border-black overflow-hidden">
          <div className="bg-[#1A5F8A] text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">
            All intakes
          </div>
          <ul className="divide-y divide-black/5">
            {intakes.map((i) => (
              <li key={i.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-sm">
                    {i.treatment_area || "Intake"} ·{" "}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${screeningBadge(i.screening_result)}`}>
                      {i.screening_result}
                    </span>
                  </p>
                  <p className="text-xs text-black/50">{new Date(i.created_at).toLocaleString()}</p>
                </div>
                <Link
                  href={flowWaveIntakeUrl({ clientId, intakeId: i.id })}
                  className="text-sm font-bold text-[#1A5F8A]"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
