"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import { proposalStatusBadges } from "@/lib/proposals/status-badges";

export default function ProposalsListPage() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<TreatmentProposalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [chartProposal, setChartProposal] = useState<TreatmentProposalRecord | null>(null);
  const [chartNote, setChartNote] = useState("");
  const [chartSaving, setChartSaving] = useState(false);
  const [chartNotice, setChartNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/proposals");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load proposals.");
      setProposals(data.proposals || []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load proposals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const deleteProposal = async (proposal: TreatmentProposalRecord) => {
    const ok = window.confirm(
      `Delete proposal for ${proposal.client_name}? This cannot be undone.`
    );
    if (!ok) return;
    setDeletingId(proposal.id);
    try {
      const response = await fetch(`/api/proposals/${proposal.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to delete proposal.");
      setProposals((prev) => prev.filter((item) => item.id !== proposal.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete proposal.");
    } finally {
      setDeletingId(null);
    }
  };

  const openChart = (proposal: TreatmentProposalRecord) => {
    setChartProposal(proposal);
    setChartNote("");
    setChartNotice(null);
  };

  const saveChartNote = async () => {
    if (!chartProposal || !chartNote.trim()) return;
    setChartSaving(true);
    setChartNotice(null);
    try {
      const response = await fetch(`/api/proposals/${chartProposal.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: chartNote.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save note.");

      setProposals((prev) =>
        prev.map((item) => (item.id === chartProposal.id ? data.proposal : item))
      );
      setChartProposal(data.proposal);
      setChartNote("");

      if (data.charted && data.chartNoteId) {
        setChartNotice(
          `Saved on proposal and chart note created. Open charting to review.`
        );
      } else if (data.clientId) {
        setChartNotice("Saved on proposal. Chart note could not be created — try Charting manually.");
      } else {
        setChartNotice(
          "Saved on proposal. No matching client profile found yet — note stays on this proposal for reference."
        );
      }
    } catch (saveError) {
      setChartNotice(saveError instanceof Error ? saveError.message : "Failed to save note.");
    } finally {
      setChartSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-black">Treatment proposals</h1>
          <p className="mt-1 text-sm text-black/70">
            Create, review, and print consult plans.{" "}
            <a
              href="/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E6007E] underline"
            >
              Staff how-to
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/staff/protocols/guides/InMode-Packages-How-To-Sell.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-black bg-[#FFF0F7] px-4 py-2.5 text-sm font-bold text-black"
          >
            How to sell packages
          </a>
          <a
            href="/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-black bg-white px-4 py-2.5 text-sm font-bold text-black"
          >
            How to use
          </a>
          <Link href="/admin/proposals/new" className="rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white">
            + New proposal
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-black bg-white">
        <table className="w-full">
          <thead className="bg-[#FFF0F7]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Client</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Created</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Expires</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/70">
                  Loading proposals...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm font-semibold text-red-600">
                  {error}
                </td>
              </tr>
            ) : proposals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/70">
                  No proposals yet.
                </td>
              </tr>
            ) : (
              proposals.map((proposal) => {
                const badges = proposalStatusBadges(proposal);
                return (
                  <tr key={proposal.id} className="border-t border-black/10">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-black">{proposal.client_name}</p>
                      <p className="text-xs text-black/60">
                        {proposal.client_email || proposal.client_phone || "No contact"}
                      </p>
                      {proposal.internal_notes ? (
                        <p className="mt-1 text-[11px] font-medium text-[#E6007E]">Has chart notes</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge) => (
                          <span
                            key={badge.key}
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70">
                      {new Date(proposal.expires_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openChart(proposal)}
                          className="rounded-full border border-black/30 bg-white px-3 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                        >
                          Chart
                        </button>
                        <Link
                          href={`/admin/proposals/${proposal.id}/edit`}
                          className="rounded-full border border-black px-3 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/proposals/${proposal.id}/preview`}
                          className="rounded-full bg-[#E6007E] px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Preview
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === proposal.id}
                          onClick={() => void deleteProposal(proposal)}
                          className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === proposal.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {chartProposal ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="proposal-chart-title"
        >
          <div className="w-full max-w-lg rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div className="flex items-start justify-between gap-3 border-b-2 border-black px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
                  Reference notes
                </p>
                <h2 id="proposal-chart-title" className="text-lg font-black text-black">
                  Chart — {chartProposal.client_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setChartProposal(null)}
                className="rounded-full border border-black/20 px-3 py-1 text-xs font-bold text-black/60"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 px-5 py-4">
              {chartProposal.internal_notes ? (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-black/10 bg-[#FFF0F7] p-3 text-xs whitespace-pre-wrap text-black/80">
                  {chartProposal.internal_notes}
                </div>
              ) : (
                <p className="text-xs text-black/55">No notes yet on this proposal.</p>
              )}
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-black/50">
                  Add note
                </span>
                <textarea
                  value={chartNote}
                  onChange={(event) => setChartNote(event.target.value)}
                  rows={4}
                  placeholder="Consult goals, package discussed, follow-up reminders…"
                  className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2 text-sm text-black"
                />
              </label>
              {chartNotice ? <p className="text-xs font-medium text-[#E6007E]">{chartNotice}</p> : null}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={chartSaving || !chartNote.trim()}
                  onClick={() => void saveChartNote()}
                  className="rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                >
                  {chartSaving ? "Saving…" : "Save note"}
                </button>
                {chartProposal.client_id ? (
                  <Link
                    href={`/admin/charting/new?template=general&client_id=${encodeURIComponent(chartProposal.client_id)}`}
                    className="rounded-full border-2 border-black px-4 py-2 text-xs font-bold text-black"
                  >
                    Open full charting
                  </Link>
                ) : (
                  <Link
                    href="/admin/charting"
                    className="rounded-full border border-black/30 px-4 py-2 text-xs font-bold text-black/70"
                  >
                    Charting hub
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
