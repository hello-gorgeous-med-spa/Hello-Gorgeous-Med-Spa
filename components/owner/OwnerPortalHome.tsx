"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hgos/AuthContext";
import {
  OWNER_BG,
  OWNER_HOT,
  OWNER_NAV,
  OWNER_NAV_LINKS,
  OWNER_PINK,
  OWNER_SOFT,
  OWNER_SWITCHER,
  OWNER_TILES,
  ownerGreeting,
  primaryTiles,
  tilesByCategory,
} from "@/lib/owner";

type OwnerStats = {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  noShowRate: number;
  activeUsers: number;
  pendingConsents: number;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OwnerPortalHome() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(true);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const name = ownerGreeting(user?.firstName, user?.email);
  const primary = useMemo(() => primaryTiles(), []);
  const businessTiles = useMemo(() => tilesByCategory("business").filter((t) => !t.primary), []);
  const systemTiles = useMemo(() => tilesByCategory("system").filter((t) => !t.primary), []);
  const governanceTiles = useMemo(() => tilesByCategory("governance"), []);
  const websiteTiles = useMemo(() => tilesByCategory("website").filter((t) => !t.primary), []);

  const loadStats = useCallback(async () => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split("T")[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const dashRes = await fetch("/api/dashboard").catch(() => null);
      const dashData = dashRes?.ok ? await dashRes.json().catch(() => ({})) : {};

      const aptsRes = await fetch(
        `/api/appointments?start_date=${monthStartStr}&end_date=${todayStr}&include_cancelled=true&limit=500`,
      ).catch(() => null);
      const aptsData = aptsRes?.ok ? await aptsRes.json().catch(() => ({})) : {};
      const appointments = aptsData.appointments || [];

      const completed = appointments.filter((a: any) => a.status === "completed");
      const noShows = appointments.filter((a: any) => a.status === "no_show");
      const totalScheduled = appointments.filter((a: any) => a.status !== "cancelled").length;
      const noShowRate = totalScheduled > 0 ? Math.round((noShows.length / totalScheduled) * 100) : 0;

      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayRevenue = completed
        .filter((a: any) => new Date(a.starts_at) >= todayStart)
        .reduce((s: number, a: any) => s + (a.service_price || 0), 0);
      const weekRevenue = completed
        .filter((a: any) => new Date(a.starts_at) >= weekAgo)
        .reduce((s: number, a: any) => s + (a.service_price || 0), 0);
      const monthRevenue = completed.reduce((s: number, a: any) => s + (a.service_price || 0), 0);

      setStats({
        todayRevenue: dashData.stats?.todayRevenue ?? todayRevenue,
        weekRevenue: dashData.stats?.weekRevenue ?? weekRevenue,
        monthRevenue: dashData.stats?.monthRevenue ?? monthRevenue,
        noShowRate,
        activeUsers: dashData.stats?.activeUsers ?? 0,
        pendingConsents: dashData.stats?.pendingConsents ?? 0,
      });
    } catch {
      setStats({
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        noShowRate: 0,
        activeUsers: 0,
        pendingConsents: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return (
    <div className="min-h-screen" style={{ background: OWNER_BG }}>
      {/* Dark sticky nav */}
      <header className="sticky top-0 z-20 border-b border-white/10" style={{ background: OWNER_NAV }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ background: `linear-gradient(135deg, ${OWNER_HOT}, ${OWNER_PINK})` }}
            >
              HG
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-white">OWNER</span>
              <span className="hidden text-[10px] font-medium text-white/50 sm:block">Founder Control</span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {OWNER_NAV_LINKS.map((link) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    active ? "text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${OWNER_HOT}, ${OWNER_PINK})` } : undefined}
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
              Switch ▾
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
                  {OWNER_SWITCHER.map((item) => (
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
              style={{ background: `linear-gradient(135deg, ${OWNER_SOFT}, ${OWNER_HOT})` }}
              title={user?.email || "Owner"}
            >
              👑
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {OWNER_NAV_LINKS.map((link) => {
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
        {/* Greeting */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${OWNER_HOT}, ${OWNER_PINK})` }}
            >
              👑
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Hey {name}. <span className="text-slate-500">Welcome to Owner Control.</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Founder dashboard — system health, revenue, governance, and CMS.
              </p>
            </div>
          </div>
        </div>

        {/* Tip banner */}
        {showBanner && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-pink-200/60 bg-white/90 px-5 py-4 shadow-sm">
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span
                  className="mr-2 rounded px-1.5 py-0.5 text-xs font-bold text-white"
                  style={{ background: OWNER_PINK }}
                >
                  TIP
                </span>
                This is your command center. Live System shows real-time health. Owner's Manual has SOPs.
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
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-6">
            {/* Primary feature cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {primary.map((tile) => (
                <Link
                  key={tile.id}
                  href={tile.href}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                    style={{ background: `linear-gradient(135deg, ${OWNER_HOT}22, ${OWNER_PINK}18)` }}
                  >
                    {tile.icon}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#E6007E]">{tile.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{tile.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold" style={{ color: OWNER_PINK }}>
                    Open →
                  </span>
                </Link>
              ))}
            </div>

            {/* Business & Operations */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">💼</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Business & Operations</h2>
              </div>
              <div className="space-y-2">
                {businessTiles.map((tile) => (
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
                    <span className="text-sm font-semibold" style={{ color: OWNER_PINK }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* System & Features */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">System & Features</h2>
              </div>
              <div className="space-y-2">
                {systemTiles.map((tile) => (
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
                    <span className="text-sm font-semibold" style={{ color: OWNER_PINK }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Governance & Compliance */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Governance & Compliance</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {governanceTiles.map((tile) => (
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
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Revenue snapshot */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span aria-hidden>💰</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Revenue snapshot</h2>
              </div>
              {statsLoading ? (
                <p className="text-4xl font-black text-slate-300">—</p>
              ) : (
                <>
                  <p className="text-4xl font-black text-slate-900">{formatCurrency(stats?.monthRevenue || 0)}</p>
                  <p className="text-xs text-slate-500">This month</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(stats?.todayRevenue || 0)}</p>
                      <p className="text-[10px] font-semibold uppercase text-slate-400">Today</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(stats?.weekRevenue || 0)}</p>
                      <p className="text-[10px] font-semibold uppercase text-slate-400">This week</p>
                    </div>
                  </div>
                </>
              )}
              <Link
                href="/admin/owner/economics"
                className="mt-3 inline-block text-sm font-semibold hover:underline"
                style={{ color: OWNER_PINK }}
              >
                Full reports →
              </Link>
            </div>

            {/* System health */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden>📡</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">System status</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
              </div>
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">No-show rate</span>
                  <span className="font-semibold text-slate-900">{stats?.noShowRate || 0}%</span>
                </div>
              </div>
              <Link
                href="/admin/owner/live-state"
                className="mt-3 inline-block text-sm font-semibold hover:underline"
                style={{ color: OWNER_PINK }}
              >
                Live system →
              </Link>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden>⚡</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick links</h2>
              </div>
              <div className="space-y-2">
                <Link
                  href="/admin/owner/website"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  🌐 Website CMS
                </Link>
                <Link
                  href="/admin/owner/manual"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  📖 Owner's Manual
                </Link>
                <Link
                  href="/admin/reports"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  📊 Reports
                </Link>
                <Link
                  href="/admin"
                  className="block rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  ⚙️ Admin Hub
                </Link>
              </div>
            </div>

            {/* Back to Desk CTA */}
            <div
              className="rounded-2xl p-5 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${OWNER_HOT}, ${OWNER_PINK})` }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">Navigation</p>
              <p className="mt-2 text-lg font-bold">Back to your desk</p>
              <div className="mt-3 border-t border-white/20 pt-3">
                <Link href="/desk" className="text-sm font-bold text-white hover:underline">
                  Open Desk →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
