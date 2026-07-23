"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export type CcShellView = "overview" | "team" | "marketing";

const PINK = "#FF2D8E";
const PINK_DEEP = "#E6007E";

type Props = {
  children: ReactNode;
  view: CcShellView;
  onViewChange: (v: CcShellView) => void;
  isOwner: boolean;
  role: string | null;
  displayName?: string;
};

const VIEW_NAV: { id: CcShellView; label: string; ownerOnly?: boolean }[] = [
  { id: "overview", label: "Overview", ownerOnly: true },
  { id: "team", label: "Team Hub" },
  { id: "marketing", label: "Marketing" },
];

const QUICK_LINKS = [
  { href: "/admin", label: "Admin home" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/sms", label: "SMS Studio" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/rx-portal", label: "RX Portal" },
];

export default function CommandCenterShell({
  children,
  view,
  onViewChange,
  isOwner,
  role,
  displayName,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const theme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const prev = theme?.content;
    if (theme) theme.content = PINK;
    return () => {
      if (theme && prev) theme.content = prev;
    };
  }, []);

  const roleLabel =
    role === "owner" ? "Owner" : role === "admin" ? "Admin" : role === "staff" ? "Staff" : "Team";

  const navItems = VIEW_NAV.filter((item) => !item.ownerOnly || isOwner);

  const NavButtons = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
        Run the day
      </p>
      {navItems.map((item) => {
        const active = view === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onViewChange(item.id);
              onNavigate?.();
            }}
            className={`w-full text-left flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-[#FF2D8E] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.id === "overview" ? (
              <span
                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                  active ? "bg-black/25 text-white" : "bg-[#FF2D8E]/25 text-[#FFB8DC]"
                }`}
              >
                Owner
              </span>
            ) : null}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#FFF5F9] text-[#111]">
      {/* Desktop sidebar */}
      <aside className="w-64 shrink-0 bg-[#0a0a0a] text-white hidden lg:flex lg:flex-col sticky top-0 h-screen">
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <p
            className="text-[11px] font-bold tracking-[0.22em] uppercase"
            style={{ color: PINK }}
          >
            Hello Gorgeous
          </p>
          <h1
            className="mt-1 text-xl font-black leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Command <span style={{ color: PINK }}>Center</span>
          </h1>
          <div className="mt-4 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <p className="text-sm font-semibold truncate">
              {displayName || "Team member"}
            </p>
            <p className="text-[11px] text-white/55 mt-0.5">{roleLabel} view</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavButtons />
          <p className="px-2 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Jump to
          </p>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            ← Back to Admin
          </Link>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-xs text-white/40 hover:text-white/70"
          >
            Site home
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/55"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[280px] bg-[#0a0a0a] text-white flex flex-col shadow-2xl">
            <div className="px-5 pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: PINK }}>
                  Hello Gorgeous
                </p>
                <h1
                  className="mt-1 text-lg font-black"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Command <span style={{ color: PINK }}>Center</span>
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-white/70 text-xl leading-none px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <NavButtons onNavigate={() => setMobileOpen(false)} />
              <p className="px-2 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Jump to
              </p>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-black text-white px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wide"
          >
            Menu
          </button>
          <div className="text-center min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
              Command Center
            </div>
            <div className="text-sm font-bold truncate">{roleLabel}</div>
          </div>
          <Link
            href="/admin"
            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold"
          >
            Admin
          </Link>
        </header>

        {/* Mobile view pills */}
        <div className="lg:hidden sticky top-[52px] z-20 bg-[#FFF5F9]/95 backdrop-blur border-b border-black/5 px-3 py-2">
          <div className="inline-flex w-full rounded-full bg-black/[0.06] p-1 gap-0.5 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className="flex-1 min-w-[88px] px-3 py-2 rounded-full text-xs font-bold transition-colors"
                style={{
                  background: view === item.id ? PINK : "transparent",
                  color: view === item.id ? "#fff" : "#444",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop accent strip */}
        <div
          className="hidden lg:block h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${PINK} 0%, ${PINK_DEEP} 55%, #9b0a4d 100%)`,
          }}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-16 max-w-[1280px] w-full mx-auto">
          {children}
        </main>

        <footer className="px-6 py-3 text-[11px] text-[#888] border-t border-black/5 bg-white/80">
          Hello Gorgeous Command Center · Oswego ops board · Square sync + Team Hub
        </footer>
      </div>
    </div>
  );
}
