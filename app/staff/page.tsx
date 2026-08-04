"use client";

import Link from "next/link";
import { useState } from "react";
import { SQUARE_STAFF_APPOINTMENTS_URL } from "@/lib/flows";
import { BESTIE_SQUARE_DISCOUNT } from "@/lib/square/bestie-discount";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SOFT_PINK = "#FFB8DC";
const BG_COOL = "#E8ECF4";

const NAV_LINKS = [
  { label: "Home", href: "/staff", active: true },
  { label: "Academy", href: "/staff/protocols" },
  { label: "Science", href: "/regen-science" },
  { label: "Proposals", href: "/admin/proposals" },
];

export default function StaffHubPage() {
  const [showBanner, setShowBanner] = useState(true);

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
            <span className="text-sm font-bold tracking-wide text-white">STAFF HUB</span>
          </div>

          {/* Center nav links */}
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  link.active
                    ? "text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                style={link.active ? { background: `linear-gradient(135deg, ${HOT}, ${PINK})` } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
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
              title="Staff"
            >
              ✦
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-3 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                link.active ? "bg-white/20 text-white" : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
                Hey gorgeous. <span className="text-slate-500">Welcome to Staff Hub.</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">Your training, tools &amp; resources in one place.</p>
            </div>
          </div>
        </div>

        {/* Dismissible info banner */}
        {showBanner && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/80 px-5 py-4 backdrop-blur">
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span className="mr-2 rounded bg-amber-200 px-1.5 py-0.5 text-xs font-bold text-amber-800">TIP</span>
                Bookmark this page or add to your home screen for quick access.{" "}
                <a
                  href="/docs/HG-Staff-Ops-Desk-Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 underline decoration-amber-400 hover:text-amber-700"
                >
                  Download the Ops Desk Guide
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
                  <span className="text-lg">⚡</span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Actions</h2>
                </div>
                <Link
                  href="/staff/assistant"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: PINK }}
                >
                  Front desk help →
                </Link>
              </div>

              <div className="space-y-2">
                <a
                  href={SQUARE_STAFF_APPOINTMENTS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm">⬛</span>
                  <span className="text-sm font-medium text-slate-700">
                    Book in Square — seller calendar for scheduling clients
                  </span>
                </a>
                <Link
                  href="/staff/assistant"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-sm">📞</span>
                  <span className="text-sm font-medium text-slate-700">
                    Front Desk Assistant — instant answers while on calls
                  </span>
                </Link>
                <Link
                  href="/admin/promos/bestie"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm">💕</span>
                  <span className="text-sm font-medium text-slate-700">
                    Bestie ${BESTIE_SQUARE_DISCOUNT.amountUsd} Off — code {BESTIE_SQUARE_DISCOUNT.code}
                  </span>
                </Link>
              </div>
            </div>

            {/* Feature cards row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Academy Card */}
              <Link
                href="/staff/protocols"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ background: `linear-gradient(135deg, ${HOT}20, ${PINK}15)` }}
                >
                  🎓
                </div>
                <h3 className="mb-2 font-bold text-slate-900">HG Academy</h3>
                <p className="mb-3 text-sm text-slate-500">
                  Protocol guides, dosing cheat sheets, social templates &amp; RX invoice tools.
                </p>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: PINK }}>
                  Open Academy →
                </span>
              </Link>

              {/* Front Desk Assistant Card */}
              <Link
                href="/staff/assistant"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ background: `linear-gradient(135deg, ${HOT}20, ${PINK}15)` }}
                >
                  📞
                </div>
                <h3 className="mb-2 font-bold text-slate-900">Front Desk Assistant</h3>
                <p className="mb-3 text-sm text-slate-500">
                  On a call? Get instant answers for menu, pricing, booking &amp; RX scripts.
                </p>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: PINK }}>
                  Get help →
                </span>
              </Link>

              {/* Pharmacy Catalog Card */}
              <Link
                href="/staff/pharmacy-catalog"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ background: `linear-gradient(135deg, ${HOT}20, ${PINK}15)` }}
                >
                  💊
                </div>
                <h3 className="mb-2 font-bold text-slate-900">Pharmacy Catalog</h3>
                <p className="mb-3 text-sm text-slate-500">
                  Compare prices across pharmacies, check stock, and reference product info.
                </p>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: PINK }}>
                  Open catalog →
                </span>
              </Link>

              {/* Promo Kit Card */}
              <a
                href="/promo-kit/"
                target="_blank"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ background: `linear-gradient(135deg, ${HOT}20, ${PINK}15)` }}
                >
                  🎨
                </div>
                <h3 className="mb-2 font-bold text-slate-900">Promo Kit</h3>
                <p className="mb-3 text-sm text-slate-500">
                  Social graphics, marketing assets, and branded templates ready to share.
                </p>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: PINK }}>
                  Browse assets →
                </span>
              </a>
            </div>

            {/* Staff Guides Section */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-bold text-slate-900">Staff Guides &amp; PDFs</h2>
              </div>
              <div className="divide-y divide-slate-100 p-4">
                <a
                  href="/docs/HG-Staff-Ops-Desk-Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-lg">📄</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">Staff Ops Desk Guide</p>
                    <p className="text-xs text-slate-500">Admin · Command Center · Proposals · Consents</p>
                  </div>
                  <span className="text-slate-400">↓</span>
                </a>
                <a
                  href="/docs/HG-Laura-Desk-How-To.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: `${PINK}15` }}>💗</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">Laura&apos;s Desk How-To</p>
                    <p className="text-xs text-slate-500">Marketing hub · hours · meetings · Text Studio</p>
                  </div>
                  <span className="text-slate-400">↓</span>
                </a>
                <a
                  href="/staff/regen-study-guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-lg">📚</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">RE GEN Study Guide</p>
                    <p className="text-xs text-slate-500">Product knowledge &amp; training</p>
                  </div>
                  <span className="text-slate-400">↓</span>
                </a>
                <a
                  href="/staff/pharmacy-install-card.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-lg">📲</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">Install Instructions</p>
                    <p className="text-xs text-slate-500">Add Pharmacy Selector to home screen</p>
                  </div>
                  <span className="text-slate-400">↓</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Science Hub Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">🧬</span>
                <h3 className="text-sm font-bold text-slate-700">Science Hub</h3>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                See what clients see — explore regenerative science, peptides &amp; treatment info.
              </p>
              <div className="space-y-2">
                <Link
                  href="/regen-science"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  🔬 Regen Science Hub
                </Link>
                <Link
                  href="/peptides"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  💉 Peptides Library
                </Link>
                <a
                  href="/rx/brochure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  📄 RE GEN Brochure (print)
                </a>
              </div>
            </div>

            {/* Marketing & Media Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">📺</span>
                <h3 className="text-sm font-bold text-slate-700">Marketing &amp; Media</h3>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                In-spa displays, social assets &amp; brand materials.
              </p>
              <div className="space-y-2">
                <a
                  href="/regen-tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  📺 In-Spa TV Loop
                </a>
                <a
                  href="/promo-kit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  🎨 Promo Kit
                </a>
                <Link
                  href="/staff/protocols"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  📱 Social Templates
                </Link>
              </div>
            </div>

            {/* Admin Tools Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h3 className="text-sm font-bold text-slate-700">Admin Tools</h3>
              </div>
              <div className="space-y-2">
                <Link
                  href="/admin"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  🏠 Admin Hub
                </Link>
                <Link
                  href="/admin/command-center"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  🎛️ Command Center
                </Link>
                <Link
                  href="/admin/owner"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  👑 Owner Dashboard
                </Link>
                <Link
                  href="/admin/proposals"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  📋 Proposals Portal
                </Link>
              </div>
            </div>

            {/* Team CTA Card */}
            <div
              className="rounded-2xl p-5 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">Team resources</p>
              <p className="mt-2 text-lg font-bold">Questions? Text Dani 💕</p>
              <div className="mt-3 border-t border-white/20 pt-3">
                <p className="text-sm text-white/80">
                  Admin login:{" "}
                  <Link href="/login?returnTo=/admin&staff=1" className="font-bold text-white hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
