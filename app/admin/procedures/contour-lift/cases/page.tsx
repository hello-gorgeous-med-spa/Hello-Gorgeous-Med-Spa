"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CL_STATUS_LABEL, CL_QUANTUM_STATUSES, type ClQuantumStatus } from "@/lib/contour-clinical/case-status";

const PINK = "#E6007E";

type CaseRow = {
  id: string;
  created_at: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  status: string;
  lead_id: string | null;
  client_id: string | null;
  intake?: {
    has_submission: boolean;
    requires_provider_review: boolean | null;
    submitted_at: string | null;
  };
};

export default function ContourLiftCasesListPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const u = new URL("/api/admin/contour-lift/cases", window.location.origin);
      if (filter) u.searchParams.set("status", filter);
      const r = await fetch(u.toString(), { credentials: "include" });
      const j = (await r.json()) as { cases?: CaseRow[]; error?: string };
      if (!r.ok) throw new Error(j.error || "Failed to load");
      setCases(j.cases ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-black md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>
            <Link href="/admin/procedures/contour-lift" className="hover:underline">
              Contour / Quantum
            </Link>
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold">Leads &amp; cases</h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-black/70">
            Status
            <select
              className="ml-2 border-2 border-black px-2 py-1.5 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All</option>
              {CL_QUANTUM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {CL_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="border-2 border-black bg-white px-3 py-1.5 text-sm font-bold"
          >
            Refresh
          </button>
        </div>
      </div>

      {err ? <p className="text-sm text-red-700">{err}</p> : null}
      {loading ? <p className="text-sm text-black/50">Loading…</p> : null}

      <div className="overflow-x-auto border-2 border-black">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-3 py-2">Name / email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Intake</th>
              <th className="px-3 py-2">Lead</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-black/50">
                  No cases yet. Create one from a Contour lead on the case detail flow (or run migration
                  first).
                </td>
              </tr>
            ) : null}
            {cases.map((c) => (
              <tr key={c.id} className="border-t border-black/10">
                <td className="px-3 py-2">
                  <Link
                    href={`/admin/procedures/contour-lift/cases/${c.id}`}
                    className="font-semibold text-black underline-offset-2 hover:underline"
                  >
                    {c.full_name || "—"}
                  </Link>
                  <div className="text-xs text-black/60">{c.email}</div>
                </td>
                <td className="px-3 py-2">
                  <CaseBadge status={c.status as ClQuantumStatus} />
                </td>
                <td className="px-3 py-2 text-xs">
                  <IntakeBadge row={c} />
                </td>
                <td className="px-3 py-2 text-xs">
                  {c.lead_id ? <span className="font-mono text-black/80">{c.lead_id.slice(0, 8)}…</span> : "—"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {c.client_id ? <span className="font-mono">linked</span> : "—"}
                </td>
                <td className="px-3 py-2 text-xs text-black/60">
                  {new Date(c.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IntakeBadge({ row }: { row: CaseRow }) {
  const inb = row.intake;
  if (!inb?.has_submission) {
    return (
      <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
        Missing
      </span>
    );
  }
  if (inb.requires_provider_review) {
    return (
      <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "rgba(230,0,126,0.2)", color: PINK }}>
        Contra review
      </span>
    );
  }
  return (
    <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">Received</span>
  );
}

function CaseBadge({ status }: { status: ClQuantumStatus }) {
  const label = CL_STATUS_LABEL[status] ?? status;
  const warn =
    status === "needs_review" ||
    status === "intake_sent" ||
    status === "followup_needed" ||
    status === "new_inquiry";
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-xs font-bold"
      style={{
        backgroundColor: warn ? "rgba(230,0,126,0.12)" : "rgba(0,0,0,0.06)",
        color: warn ? PINK : "#111",
      }}
    >
      {label}
    </span>
  );
}
