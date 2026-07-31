"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONSULT_STATUS_LABELS,
  CONSULT_VERTICAL_LABELS,
  type ConsultStatus,
  type ConsultVertical,
  type TreatmentConsultRecord,
} from "@/lib/consults/types";

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
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-black">Consults</h1>
          <p className="mt-1 text-sm text-black/70">
            Screen → educate → recommend → create a proposal.{" "}
            <Link href="/admin/proposals" className="font-semibold text-[#E6007E] underline">
              Proposals
            </Link>
          </p>
        </div>
        <Link
          href="/admin/proposals/consults/new"
          className="rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white"
        >
          + New consult
        </Link>
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

      {error ? (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-black/55">Loading…</p>
      ) : consults.length === 0 ? (
        <div className="rounded-[1.5rem] border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <p className="font-bold">No consults yet</p>
          <p className="mt-1 text-sm text-black/60">Start with a weight-loss screen when someone inquires.</p>
          <Link
            href="/admin/proposals/consults/new"
            className="mt-4 inline-flex rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white"
          >
            New consult
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b-4 border-black bg-[#FFF0F7] text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Vertical</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {consults.map((consult) => (
                <tr key={consult.id} className="border-b border-black/10">
                  <td className="px-4 py-3 font-semibold">{consult.client_name}</td>
                  <td className="px-4 py-3">{CONSULT_VERTICAL_LABELS[consult.vertical]}</td>
                  <td className="px-4 py-3">{CONSULT_STATUS_LABELS[consult.status]}</td>
                  <td className="px-4 py-3 text-black/55">
                    {new Date(consult.updated_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/proposals/consults/${consult.id}`}
                      className="font-bold text-[#E6007E] underline"
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
    </div>
  );
}
