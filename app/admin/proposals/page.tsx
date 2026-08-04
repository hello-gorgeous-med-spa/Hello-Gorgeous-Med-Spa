"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import { proposalStatusBadges } from "@/lib/proposals/status-badges";
import { calculateTotal, type ProposalOption } from "@/lib/proposals/utils";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SOFT_PINK = "#FFB8DC";
const BG_COOL = "#E8ECF4";

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

function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const hours = Math.floor((now - then) / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProposalsPortalPage() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<TreatmentProposalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [showBanner, setShowBanner] = useState(true);
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

    // Pipeline readiness: % of proposals that have moved past draft
    const readiness = total > 0 ? Math.round(((sent + accepted + paid) / total) * 100) : 0;

    return { total, draft, sent, accepted, paid, totalValue, paidValue, readiness };
  }, [proposals]);

  const recentProposals = useMemo(() => {
    return [...proposals]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
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

  const NAV_LINKS = [
    { label: "Home", href: "/admin/proposals", active: true },
    { label: "Pipeline", href: "/admin/proposals?filter=sent", badge: stats.sent || undefined },
    { label: "Consults", href: "/admin/proposals/consults" },
    { label: "Templates", href: "/admin/proposals/templates", disabled: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: BG_COOL }}>
      {/* Dark portal nav bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f172a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo / brand */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              HG
            </div>
            <span className="text-sm font-bold tracking-wide text-white">PROPOSALS</span>
          </div>

          {/* Center nav links */}
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.disabled ? "#" : link.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  link.active
                    ? "text-white"
                    : link.disabled
                    ? "cursor-not-allowed text-white/30"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                style={link.active ? { background: `linear-gradient(135deg, ${HOT}, ${PINK})` } : undefined}
              >
                {link.label}
                {link.badge !== undefined && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side: user */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              Admin Hub
            </Link>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${SOFT_PINK}, ${HOT})` }}
              title="Danielle"
            >
              D
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Greeting section */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              HG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Hey gorgeous. <span className="text-slate-500">Welcome to Proposals.</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Dismissible info banner */}
        {showBanner && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/80 px-5 py-4 backdrop-blur">
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span className="mr-2 rounded bg-amber-200 px-1.5 py-0.5 text-xs font-bold text-amber-800">TIP</span>
                Build proposals with packages for higher close rates.{" "}
                <a
                  href="/staff/protocols/guides/InMode-Packages-How-To-Sell.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 underline decoration-amber-400 hover:text-amber-700"
                >
                  Read the selling guide
                </a>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="shrink-0 text-sm text-slate-400 hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Quick actions card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Actions</h2>
                </div>
                <Link
                  href="/admin/proposals/new"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: PINK }}
                >
                  + New proposal
                </Link>
              </div>

              {/* Suggested starters */}
              <div className="space-y-2">
                <Link
                  href="/admin/proposals/new"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-sm">📝</span>
                  <span className="text-sm font-medium text-slate-700">
                    Start fresh proposal — add services, build pricing options
                  </span>
                </Link>
                <Link
                  href="/admin/proposals/consults"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-sm">📋</span>
                  <span className="text-sm font-medium text-slate-700">Build from consult notes — turn consults into proposals</span>
                </Link>
                <Link
                  href="/build-your-proposal"
                  target="_blank"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-sm">🔗</span>
                  <span className="text-sm font-medium text-slate-700">Public builder link — share with clients to self-build</span>
                </Link>
              </div>
            </div>

            {/* Feature cards row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* New Proposal Card */}
              <Link
                href="/admin/proposals/new"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ background: `linear-gradient(135deg, ${HOT}20, ${PINK}15)` }}
                >
                  💬
                </div>
                <h3 className="mb-2 font-bold text-slate-900">New Proposal</h3>
                <p className="mb-3 text-sm text-slate-500">
                  Walk through services, build Good/Better/Best options, and send a beautiful proposal.
                </p>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: PINK }}>
                  Get started →
                </span>
              </Link>

              {/* Build from Consult Card */}
              <Link
                href="/admin/proposals/consults"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ background: `linear-gradient(135deg, ${HOT}20, ${PINK}15)` }}
                >
                  📄
                </div>
                <h3 className="mb-2 font-bold text-slate-900">Consult Desk</h3>
                <p className="mb-3 text-sm text-slate-500">
                  Review past consults, flag follow-ups, and convert discussions into treatment plans.
                </p>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: PINK }}>
                  Open desk →
                </span>
              </Link>
            </div>

            {/* All Proposals Section */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <h2 className="font-bold text-slate-900">All Proposals</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-1">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFilter(opt.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          filter === opt.value
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-40 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div
                        className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                        style={{ borderColor: `${PINK} transparent ${PINK} ${PINK}` }}
                      />
                      <p className="mt-3 text-sm text-slate-500">Loading proposals…</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
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
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="font-semibold text-slate-600">No proposals found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {filter !== "all" || search ? "Try adjusting your filters." : "Create your first proposal to get started."}
                    </p>
                    <Link
                      href="/admin/proposals/new"
                      className="mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                    >
                      + New proposal
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredProposals.map((proposal) => {
                      const badges = proposalStatusBadges(proposal);
                      const total = getProposalTotal(proposal);
                      const isExpired = new Date(proposal.expires_at) < new Date();

                      return (
                        <div
                          key={proposal.id}
                          className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-semibold text-slate-900">{proposal.client_name}</h3>
                              <span className="text-lg font-bold" style={{ color: PINK }}>
                                {formatCurrency(total)}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span>{proposal.client_email || proposal.client_phone || "No contact"}</span>
                              <span>·</span>
                              <span>{timeAgo(proposal.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {badges.map((badge) => (
                              <span
                                key={badge.key}
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            ))}
                            {isExpired && proposal.status !== "expired" && (
                              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                                Expired
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/proposals/${proposal.id}/preview`}
                              className="rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                            >
                              Preview
                            </Link>
                            <Link
                              href={`/admin/proposals/${proposal.id}/edit`}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => openChart(proposal)}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              Notes
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === proposal.id}
                              onClick={() => void deleteProposal(proposal)}
                              className="rounded-full border border-red-100 px-2 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === proposal.id ? "…" : "×"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Pipeline Readiness Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h3 className="text-sm font-bold text-slate-700">Pipeline readiness</h3>
              </div>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ color: PINK }}>
                  {stats.readiness}%
                </span>
                <span className="text-sm text-slate-500">of proposals active</span>
              </div>
              <p className="text-sm text-slate-500">
                Track how many proposals have moved past draft. Higher readiness means more potential revenue in play.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900">{stats.sent}</p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900">{stats.accepted}</p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400">Accepted</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold" style={{ color: PINK }}>{stats.paid}</p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400">Paid</p>
                </div>
              </div>
            </div>

            {/* Academy / Learning Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <h3 className="text-sm font-bold text-slate-700">HG Academy</h3>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                Sharpen your skills with protocols, selling guides, and treatment science.
              </p>
              <div className="space-y-2">
                <a
                  href="/staff/protocols/guides/InMode-Packages-How-To-Sell.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  📦 Selling InMode packages
                </a>
                <a
                  href="/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  📝 Proposals staff how-to
                </a>
                <Link
                  href="/regen-science"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  🧬 Regen science hub
                </Link>
              </div>
            </div>

            {/* Recent Proposals Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h3 className="text-sm font-bold text-slate-700">Recent proposals</h3>
              </div>
              {loading ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : recentProposals.length === 0 ? (
                <p className="text-sm text-slate-400">No proposals yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentProposals.map((proposal) => (
                    <Link
                      key={proposal.id}
                      href={`/admin/proposals/${proposal.id}/preview`}
                      className="block rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 transition hover:bg-slate-100"
                    >
                      <p className="truncate font-semibold text-slate-900">{proposal.client_name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                        <span
                          className={`capitalize ${
                            proposal.status === "accepted" || proposal.payment_status === "paid"
                              ? "text-emerald-600"
                              : proposal.status === "sent" || proposal.status === "viewed"
                              ? "text-blue-600"
                              : ""
                          }`}
                        >
                          {proposal.payment_status === "paid" ? "Paid" : proposal.status}
                        </span>
                        <span>·</span>
                        <span>{timeAgo(proposal.created_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/admin/proposals?filter=all"
                className="mt-4 block text-sm font-semibold hover:underline"
                style={{ color: PINK }}
              >
                View all proposals →
              </Link>
            </div>

            {/* Pipeline Value Card */}
            <div
              className="rounded-2xl p-5 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">Pipeline value</p>
              <p className="mt-1 text-3xl font-bold">{formatCurrency(stats.totalValue)}</p>
              <div className="mt-3 border-t border-white/20 pt-3">
                <p className="text-sm text-white/80">
                  Collected: <span className="font-bold text-white">{formatCurrency(stats.paidValue)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chart notes modal */}
      {chartProposal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="proposal-chart-title"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PINK }}>
                  Reference notes
                </p>
                <h2 id="proposal-chart-title" className="text-lg font-bold text-slate-900">
                  {chartProposal.client_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setChartProposal(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-5">
              {chartProposal.internal_notes ? (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700">
                  {chartProposal.internal_notes}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No notes yet on this proposal.</p>
              )}
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Add note</span>
                <textarea
                  value={chartNote}
                  onChange={(event) => setChartNote(event.target.value)}
                  rows={4}
                  placeholder="Consult goals, package discussed, follow-up reminders…"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                />
              </label>
              {chartNotice && (
                <p className="text-sm font-medium" style={{ color: PINK }}>
                  {chartNotice}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={chartSaving || !chartNote.trim()}
                  onClick={() => void saveChartNote()}
                  className="rounded-full px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                >
                  {chartSaving ? "Saving…" : "Save note"}
                </button>
                {chartProposal.client_id ? (
                  <Link
                    href={`/admin/charting/new?template=general&client_id=${encodeURIComponent(chartProposal.client_id)}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Open full charting
                  </Link>
                ) : (
                  <Link
                    href="/admin/charting"
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
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
