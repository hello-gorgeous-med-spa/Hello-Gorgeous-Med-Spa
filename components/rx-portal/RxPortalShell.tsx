"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { getSession, type AuthSession } from "@/lib/hgos/auth";
import {
  hgosRoleToPortalSkin,
  portalNavForSkin,
  RX_PORTAL_BASE,
  type RxPortalRoleSkin,
} from "@/lib/rx-portal/nav";

type Props = {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
};

export function RxPortalShell({ children, title, actions }: Props) {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [skin, setSkin] = useState<RxPortalRoleSkin>("staff");

  useEffect(() => {
    void getSession().then((s) => {
      setSession(s);
      setSkin(hgosRoleToPortalSkin(s?.user.role));
    });
  }, []);

  const path = pathname ?? "";
  const nav = portalNavForSkin(skin);
  const displayName =
    [session?.user.firstName, session?.user.lastName].filter(Boolean).join(" ") ||
    session?.user.email ||
    "Team member";
  const roleLabel =
    skin === "provider" ? "Provider" : skin === "admin" ? "Admin" : "Staff";

  return (
    <div className="min-h-screen flex bg-[#f1f5f9] text-slate-900">
      <aside className="w-64 shrink-0 bg-[#0B1F33] text-white flex flex-col">
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-teal-300/90">
            Hello Gorgeous RX
          </p>
          <h1 className="mt-1 text-lg font-black leading-tight">
            Provider <span className="text-teal-300">Portal</span>
          </h1>
          <div className="mt-4 rounded-xl bg-white/5 px-3 py-2.5">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-[11px] text-white/55 mt-0.5">{roleLabel} view</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Main
          </p>
          {nav.map((item) => {
            const active =
              item.href === RX_PORTAL_BASE
                ? path === RX_PORTAL_BASE
                : path === item.href || path.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-teal-500 text-[#0B1F33]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      active ? "bg-[#0B1F33]/20 text-[#0B1F33]" : "bg-emerald-400 text-[#0B1F33]"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/staff/protocols"
            className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            Settings / Protocols
          </Link>
          <Link
            href="/login?returnTo=%2Frx-portal"
            className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            Switch account
          </Link>
          <Link href="/" className="block rounded-lg px-3 py-2 text-xs text-white/40 hover:text-white/70">
            ← Site home
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#0B1F33]">{title ?? "Dashboard"}</h2>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="px-6 py-3 text-[11px] text-slate-400 border-t border-slate-200 bg-white">
          256-bit encrypted connection · HIPAA-ready architecture · Use Google Chrome for best
          experience
        </footer>
      </div>
    </div>
  );
}
