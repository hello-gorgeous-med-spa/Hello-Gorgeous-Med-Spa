"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ConsultProductShell } from "@/components/admin/ConsultProductShell";
import {
  CONSULT_STATUS_LABELS,
  CONSULT_VERTICAL_LABELS,
  type ConsultStatus,
  type ConsultVertical,
  type TreatmentConsultRecord,
} from "@/lib/consults/types";

const SERIF = "var(--font-playfair), Georgia, serif";
const PINK = "#E6007E";

export default function ConsultsListPage() {
  const [loading, setLoading] = useState(true);
  const [consults, setConsults] = useState<TreatmentConsultRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [vertical, setVertical] = useState<"" | ConsultVertical>("");
  const [status, setStatus] = useState<"" | ConsultStatus>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (vertical) params.set("vertical", vertical);
      if (status) params.set("status", status);
      const response = await fetch(`/api/consults?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load consults.");
      setConsults(data.consults || []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load consults.");
    } finally {
      setLoading(false);
    }
  }, [vertical, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="relative mx-auto max-w-6xl space-y-10 p-6 pb-16">
      <ConsultProductShell />

      <section className="scroll-mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
              Live queue
            </p>
            <h2 className="mt-1 text-3xl font-medium text-black" style={{ fontFamily: SERIF }}>
              Open consults
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold"
              value={vertical}
              onChange={(e) => setVertical(e.target.value as "" | ConsultVertical)}
            >
              <option value="">All verticals</option>
              {(Object.keys(CONSULT_VERTICAL_LABELS) as ConsultVertical[]).map((key) => (
                <option key={key} value={key}>
                  {CONSULT_VERTICAL_LABELS[key]}
                </option>
              ))}
            </select>
            <select
              className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold"
              value={status}
              onChange={(e) => setStatus(e.target.value as "" | ConsultStatus)}
            >
              <option value="">All statuses</option>
              {(Object.keys(CONSULT_STATUS_LABELS) as ConsultStatus[]).map((key) => (
                <option key={key} value={key}>
                  {CONSULT_STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="text-sm text-black/55">Loading queue…</p>
        ) : consults.length === 0 ? (
          <div className="rounded-[1.5rem] border-4 border-dashed border-black/25 bg-white/70 p-10 text-center">
            <p className="text-lg font-medium" style={{ fontFamily: SERIF }}>
              No consults yet — open the first room
            </p>
            <p className="mt-2 text-sm text-black/55">
              Weight loss has the full screen + education pack. Injectables and Morpheus8 are ready
              too.
            </p>
            <Link
              href="/admin/proposals/consults/new"
              className="mt-5 inline-flex rounded-full border-2 border-black bg-[#E6007E] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#000]"
            >
              Open a consult
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b-4 border-black bg-[#0a0a0a] text-[10px] uppercase tracking-[0.18em] text-[#FFB8DC]">
                <tr>
                  <th className="px-4 py-3.5 font-bold">Client</th>
                  <th className="px-4 py-3.5 font-bold">Vertical</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold">Updated</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {consults.map((consult) => (
                  <tr key={consult.id} className="border-b border-black/10 hover:bg-[#FFF0F7]/60">
                    <td className="px-4 py-3.5 font-semibold text-black">{consult.client_name}</td>
                    <td className="px-4 py-3.5 text-black/70">
                      {CONSULT_VERTICAL_LABELS[consult.vertical]}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full border border-black/10 bg-[#FFF0F7] px-2.5 py-0.5 text-xs font-bold text-[#E6007E]">
                        {CONSULT_STATUS_LABELS[consult.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-black/45">
                      {new Date(consult.updated_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/proposals/consults/${consult.id}`}
                        className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-black hover:bg-[#E6007E] hover:text-white"
                      >
                        Open room
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
