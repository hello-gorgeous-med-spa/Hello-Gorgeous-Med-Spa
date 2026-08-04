"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import { proposalStatusBadges } from "@/lib/proposals/status-badges";
import { calculateTotal, type ProposalOption } from "@/lib/proposals/utils";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SERIF = "var(--font-playfair), Georgia, serif";

type FilterStatus = "all" | "draft" | "sent" | "accepted" | "paid" | "expired";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProposalTotal(proposal: TreatmentProposalRecord): number {
  const options = proposal.options as ProposalOption[] | undefined;
  if (!options?.length) return 0;
  return calculateTotal(options[1] || options[0]);
}

export default function ProposalsListPage() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<TreatmentProposalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [chartProposal, setChartProposal] = useState<TreatmentProposalRecord | null>(null);
  const [chartNote, setChartNote] = useState("");
  const [chartSaving, setChartSaving] = useState(false);
  const [chartNotice, setChartNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

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

  const stats = useMemo(() => {
    const total = proposals.length;
    const draft = proposals.filter((p) => p.status === "draft").length;
    const sent = proposals.filter((p) => p.status === "sent" || p.status === "viewed").length;
    const accepted = proposals.filter((p) => p.status === "accepted").length;
    const paid = proposals.filter((p) => p.payment_status === "paid" || p.payment_status === "deposit_paid").length;
    const totalValue = proposals.reduce((sum, p) => sum + getProposalTotal(p), 0);
    const paidValue = proposals
      .filter((p) => p.payment_status === "paid" || p.payment_status === "deposit_paid")
      .reduce((sum, p) => sum + (p.payment_amount_usd || getProposalTotal(p)), 0);
    return { total, draft, sent, accepted, paid, totalValue, paidValue };
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    let list = proposals;
    if (filter === "draft") list = list.filter((p) => p.status === "draft");
    else if (filter === "sent") list = list.filter((p) => p.status === "sent" || p.status === "viewed");
    else if (filter === "accepted") list = list.filter((p) => p.status === "accepted");
    else if (filter === "paid") list = list.filter((p) => p.payment_status === "paid" || p.payment_status === "deposit_paid");
    else if (filter === "expired") list = list.filter((p) => p.status === "expired");

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.client_name?.toLowerCase().includes(q) ||
          p.client_email?.toLowerCase().includes(q) ||
          p.client_phone?.includes(q)
      );
    }
    return list;
  }, [proposals, filter, search]);

  const deleteProposal = async (proposal: TreatmentProposalRecord) => {
    const ok = window.confirm(`Delete proposal for ${proposal.client_name}? This cannot be undone.`);
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

      setProposals((prev) => prev.map((item) => (item.id === chartProposal.id ? data.proposal : item)));
      setChartProposal(data.proposal);
      setChartNote("");

      if (data.charted && data.chartNoteId) {
        setChartNotice(`Saved on proposal and chart note created. Open charting to review.`);
      } else if (data.clientId) {
        setChartNotice("Saved on proposal. Chart note could not be created — try Charting manually.");
      } else {
        setChartNotice("Saved on proposal. No matching client profile found yet — note stays on this proposal for reference.");
      }
    } catch (saveError) {
      setChartNotice(saveError instanceof Error ? saveError.message : "Failed to save note.");
    } finally {
      setChartSaving(false);
    }
  };

  const FILTER_OPTIONS: Array<{ value: FilterStatus; label: string }> = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "accepted", label: "Accepted" },
    { value: "paid", label: "Paid" },
    { value: "expired", label: "Expired" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Dark header bar with stats */}
      <header
        className="border-b-4 border-black"
        style={{
          background: `radial-gradient(ellipse 80% 100% at 100% 0%, rgba(230,0,126,0.25), transparent 60%), linear-gradient(125deg, #1a0a12 0%, #2d1020 45%, #0a0a0a 100%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">Staff portal</span>
              </div>
              <h1 className="mt-3 text-3xl font-medium text-white md:text-4xl" style={{ fontFamily: SERIF }}>
                Treatment{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Proposals
                </span>
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Create, review, and manage client treatment plans.{" "}
                <a
                  href="/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E] hover:text-white"
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
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
              >
                Selling packages
              </a>
              <Link
                href="/admin/proposals/consults"
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
              >
                Consults
              </Link>
              <Link
                href="/admin/proposals/new"
                className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-black text-white shadow-[4px_4px_0_0_#000]"
                style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
              >
                + New proposal
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total", value: stats.total, accent: false },
              { label: "Draft", value: stats.draft, accent: false },
              { label: "Sent", value: stats.sent, accent: false },
              { label: "Accepted", value: stats.accepted, accent: true },
              { label: "Paid", value: stats.paid, accent: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border px-4 py-3 ${
                  stat.accent ? "border-[#E6007E]/40 bg-[#E6007E]/10" : "border-white/15 bg-white/5"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                <p className={`mt-1 text-2xl font-medium ${stat.accent ? "text-[#FFB8DC]" : "text-white"}`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">
            <span>Pipeline: {formatCurrency(stats.totalValue)}</span>
            <span>Collected: {formatCurrency(stats.paidValue)}</span>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="border-b border-black/10 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3">
          <div className="flex flex-wrap gap-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  filter === opt.value
                    ? "bg-black text-white"
                    : "border border-black/15 text-black/70 hover:border-black hover:text-black"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="w-full max-w-xs rounded-lg border border-black/15 bg-white px-3 py-2 text-sm placeholder:text-black/40 focus:border-[#E6007E] focus:outline-none"
          />
        </div>
      </div>

      {/* Proposals grid */}
      <main className="mx-auto max-w-7xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E6007E] border-t-transparent" />
              <p className="mt-3 text-sm text-black/60">Loading proposals…</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white"
            >
              Retry
            </button>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-black/20 bg-white p-12 text-center">
            <p className="text-lg font-bold text-black/70">No proposals found</p>
            <p className="mt-1 text-sm text-black/50">
              {filter !== "all" || search ? "Try adjusting your filters." : "Create your first proposal to get started."}
            </p>
            <Link
              href="/admin/proposals/new"
              className="mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-white"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              + New proposal
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProposals.map((proposal) => {
              const badges = proposalStatusBadges(proposal);
              const total = getProposalTotal(proposal);
              const isExpired = new Date(proposal.expires_at) < new Date();
              const daysSinceCreated = Math.floor((Date.now() - new Date(proposal.created_at).getTime()) / 86400000);

              return (
                <article
                  key={proposal.id}
                  className="group relative overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] transition-shadow hover:shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
                >
                  {/* Card header */}
                  <div className="border-b border-black/10 bg-gradient-to-r from-[#FFF0F7] to-white px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-black">{proposal.client_name}</h3>
                        <p className="truncate text-xs text-black/60">
                          {proposal.client_email || proposal.client_phone || "No contact info"}
                        </p>
                      </div>
                      <p className="shrink-0 text-xl font-black text-[#E6007E]">{formatCurrency(total)}</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="space-y-3 p-4">
                    {/* Status badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((badge) => (
                        <span
                          key={badge.key}
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      ))}
                      {isExpired && proposal.status !== "expired" && (
                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">
                          Expired
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/60">
                      <span>Created {daysSinceCreated === 0 ? "today" : `${daysSinceCreated}d ago`}</span>
                      <span>Expires {new Date(proposal.expires_at).toLocaleDateString()}</span>
                    </div>

                    {proposal.internal_notes && (
                      <p className="rounded-lg bg-[#FFF0F7] px-2 py-1.5 text-[11px] font-medium text-[#E6007E]">
                        Has staff notes
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link
                        href={`/admin/proposals/${proposal.id}/preview`}
                        className="flex-1 rounded-full px-3 py-2 text-center text-xs font-bold text-white"
                        style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/admin/proposals/${proposal.id}/edit`}
                        className="rounded-full border-2 border-black px-3 py-2 text-xs font-bold text-black hover:bg-black hover:text-white"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => openChart(proposal)}
                        className="rounded-full border border-black/30 px-3 py-2 text-xs font-bold text-black/70 hover:border-[#E6007E] hover:text-[#E6007E]"
                      >
                        Notes
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === proposal.id}
                        onClick={() => void deleteProposal(proposal)}
                        className="rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        aria-label="Delete proposal"
                      >
                        {deletingId === proposal.id ? "…" : "×"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Chart notes modal */}
      {chartProposal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="proposal-chart-title"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div
              className="flex items-start justify-between gap-3 border-b-2 border-black px-5 py-4"
              style={{
                background: `radial-gradient(ellipse 60% 100% at 100% 0%, rgba(230,0,126,0.15), transparent 60%), linear-gradient(to right, #FFF0F7, white)`,
              }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">Reference notes</p>
                <h2 id="proposal-chart-title" className="text-lg font-black text-black">
                  {chartProposal.client_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setChartProposal(null)}
                className="rounded-full border border-black/20 px-3 py-1 text-xs font-bold text-black/60 hover:border-black hover:text-black"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-5">
              {chartProposal.internal_notes ? (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-black/10 bg-[#FFF0F7] p-3 text-sm whitespace-pre-wrap text-black/80">
                  {chartProposal.internal_notes}
                </div>
              ) : (
                <p className="text-sm text-black/55">No notes yet on this proposal.</p>
              )}
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-black/50">Add note</span>
                <textarea
                  value={chartNote}
                  onChange={(event) => setChartNote(event.target.value)}
                  rows={4}
                  placeholder="Consult goals, package discussed, follow-up reminders…"
                  className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2 text-sm text-black focus:border-[#E6007E] focus:outline-none"
                />
              </label>
              {chartNotice && <p className="text-sm font-medium text-[#E6007E]">{chartNotice}</p>}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={chartSaving || !chartNote.trim()}
                  onClick={() => void saveChartNote()}
                  className="rounded-full px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                >
                  {chartSaving ? "Saving…" : "Save note"}
                </button>
                {chartProposal.client_id ? (
                  <Link
                    href={`/admin/charting/new?template=general&client_id=${encodeURIComponent(chartProposal.client_id)}`}
                    className="rounded-full border-2 border-black px-4 py-2 text-sm font-bold text-black"
                  >
                    Open full charting
                  </Link>
                ) : (
                  <Link
                    href="/admin/charting"
                    className="rounded-full border border-black/30 px-4 py-2 text-sm font-bold text-black/70"
                  >
                    Charting hub
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
