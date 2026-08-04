"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hgos/AuthContext";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import { calculateTotal, type ProposalOption } from "@/lib/proposals/utils";
import {
  DESK_BG,
  DESK_HOT,
  DESK_NAV,
  DESK_NAV_LINKS,
  DESK_PINK,
  DESK_SOFT,
  DESK_SWITCHER,
  deskSkinForUser,
  greetingName,
  tilesForSkin,
} from "@/lib/desk";

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
  const hours = Math.floor((Date.now() - new Date(date).getTime()) / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DeskPortalHome() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [proposals, setProposals] = useState<TreatmentProposalRecord[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(true);

  const role = user?.role ?? null;
  const skin = deskSkinForUser(role, user?.email);
  const tiles = useMemo(() => tilesForSkin(skin), [skin]);
  const name = greetingName(user?.firstName, user?.email);
  const isOwnerAdmin = role === "owner" || role === "admin";

  const navLinks = DESK_NAV_LINKS.filter((l) => !("ownerAdminOnly" in l && l.ownerAdminOnly) || isOwnerAdmin);

  const loadProposals = useCallback(async () => {
    try {
      const response = await fetch("/api/proposals");
      const data = await response.json();
      if (response.ok) setProposals(data.proposals || []);
    } catch {
      /* sidebar is optional */
    } finally {
      setProposalsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProposals();
  }, [loadProposals]);

  const stats = useMemo(() => {
    const total = proposals.length;
    const sent = proposals.filter((p) => p.status === "sent" || p.status === "viewed").length;
    const accepted = proposals.filter((p) => p.status === "accepted").length;
    const paid = proposals.filter(
      (p) => p.payment_status === "paid" || p.payment_status === "deposit_paid",
    ).length;
    const readiness = total > 0 ? Math.round(((sent + accepted + paid) / total) * 100) : 0;
    return { total, sent, accepted, paid, readiness };
  }, [proposals]);

  const recent = useMemo(
    () =>
      [...proposals]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    [proposals],
  );

  const primaryTiles = tiles.filter((t) => t.primary);
  const otherTiles = tiles.filter((t) => !t.primary);

  const switcherItems = DESK_SWITCHER.filter((item) => !("ownerOnly" in item && item.ownerOnly) || isOwnerAdmin);

  return (
    <div className="min-h-screen" style={{ background: DESK_BG }}>
      <header className="sticky top-0 z-20 border-b border-white/10" style={{ background: DESK_NAV }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ background: `linear-gradient(135deg, ${DESK_HOT}, ${DESK_PINK})` }}
            >
              HG
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-white">DESK</span>
              <span className="hidden text-[10px] font-medium text-white/50 sm:block">Hello Gorgeous</span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    active ? "text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${DESK_HOT}, ${DESK_PINK})` } : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSwitchOpen((v) => !v)}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              Switch desk ▾
            </button>
            {switchOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-30 cursor-default"
                  aria-label="Close switcher"
                  onClick={() => setSwitchOpen(false)}
                />
                <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <p className="border-b border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Go to
                  </p>
                  {switcherItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setSwitchOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      <span aria-hidden>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${DESK_SOFT}, ${DESK_HOT})` }}
              title={user?.email || "You"}
            >
              {(user?.firstName?.[0] || user?.email?.[0] || "✦").toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {navLinks.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active ? "bg-white/20 text-white" : "text-white/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${DESK_HOT}, ${DESK_PINK})` }}
            >
              HG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Hey {name}. <span className="text-slate-500">Welcome to your desk.</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                One front door for the business — sell, RE GEN, team, train, and books.
              </p>
            </div>
          </div>
        </div>

        {showBanner && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-pink-200/60 bg-white/90 px-5 py-4 shadow-sm">
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span
                  className="mr-2 rounded px-1.5 py-0.5 text-xs font-bold text-white"
                  style={{ background: DESK_PINK }}
                >
                  TIP
                </span>
                This is your front door. Everything else opens from here — you do not need five hubs.
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

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {primaryTiles.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {primaryTiles.map((tile) => (
                  <Link
                    key={tile.id}
                    href={tile.href}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                      style={{ background: `linear-gradient(135deg, ${DESK_HOT}22, ${DESK_PINK}18)` }}
                    >
                      {tile.icon}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#E6007E]">{tile.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{tile.description}</p>
                    <span className="mt-4 inline-block text-sm font-semibold" style={{ color: DESK_PINK }}>
                      Open →
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">All destinations</h2>
              </div>
              <div className="space-y-2">
                {otherTiles.map((tile) => (
                  <Link
                    key={tile.id}
                    href={tile.href}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base shadow-sm">
                      {tile.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-800">{tile.title}</span>
                      <span className="block truncate text-xs text-slate-500">{tile.description}</span>
                    </span>
                    <span className="text-sm font-semibold" style={{ color: DESK_PINK }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span aria-hidden>✨</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Proposal readiness</h2>
              </div>
              <p className="text-4xl font-black text-slate-900">{proposalsLoading ? "—" : `${stats.readiness}%`}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${stats.readiness}%`,
                    background: `linear-gradient(90deg, ${DESK_HOT}, ${DESK_PINK})`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {stats.total} proposals · {stats.sent} sent · {stats.accepted} accepted · {stats.paid} paid
              </p>
              <Link
                href="/admin/proposals"
                className="mt-3 inline-block text-sm font-semibold hover:underline"
                style={{ color: DESK_PINK }}
              >
                Open proposals →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden>📄</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Recent proposals</h2>
              </div>
              {proposalsLoading ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : recent.length === 0 ? (
                <p className="text-sm text-slate-500">No proposals yet. Start from Sell.</p>
              ) : (
                <ul className="space-y-3">
                  {recent.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/admin/proposals/${p.id}/edit`}
                        className="block rounded-xl border border-slate-100 px-3 py-2 hover:border-pink-200 hover:bg-pink-50/40"
                      >
                        <span className="block text-sm font-semibold text-slate-800">{p.client_name}</span>
                        <span className="text-xs text-slate-500">
                          {p.status} · {formatCurrency(getProposalTotal(p))} · {timeAgo(p.created_at)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/admin/proposals"
                className="mt-3 inline-block text-sm font-semibold hover:underline"
                style={{ color: DESK_PINK }}
              >
                View all proposals →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden>🔬</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">What clients see</h2>
              </div>
              <div className="space-y-2">
                <Link
                  href="/regen-science"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Regen Science Hub ↗
                </Link>
                <Link
                  href="/regen-science/education"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Peptide Education ↗
                </Link>
                <Link
                  href="/admin/academy"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  RE GEN Academy (staff)
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
