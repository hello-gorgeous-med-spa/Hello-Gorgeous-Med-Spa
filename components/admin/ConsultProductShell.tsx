"use client";

import Link from "next/link";
import { CONSULT_OPS_ACTIONS, CONSULT_PIPELINE, CONSULT_PRODUCT } from "@/lib/consults/product-story";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SERIF = "var(--font-playfair), Georgia, serif";

type Props = {
  hideCta?: boolean;
  /** Compact = hero + ops links only (new consult page) */
  compact?: boolean;
};

export function ConsultProductShell({ hideCta = false, compact = false }: Props) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 10% 0%, rgba(230,0,126,0.12), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 10%, rgba(255,45,142,0.1), transparent 50%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f5f5f5 100%)
          `,
        }}
      />

      <header className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
            {CONSULT_PRODUCT.eyebrow}
          </p>
          <h1
            className="mt-3 max-w-xl text-4xl font-medium leading-[1.08] text-black md:text-5xl"
            style={{ fontFamily: SERIF }}
          >
            {CONSULT_PRODUCT.headline}{" "}
            <span
              className="bg-gradient-to-r from-[#9b0a4d] via-[#E6007E] to-[#FF2D8E] bg-clip-text italic text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              {CONSULT_PRODUCT.headlineAccent}
            </span>
          </h1>
        </div>
        <div className="lg:pb-1">
          <p className="text-sm leading-relaxed text-black/70 md:text-base">{CONSULT_PRODUCT.subhead}</p>
          {!hideCta ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={CONSULT_PRODUCT.ctaHref}
                className="inline-flex rounded-full border-2 border-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#000]"
                style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
              >
                {CONSULT_PRODUCT.ctaLabel}
              </Link>
              <Link
                href="/admin/command-center"
                className="text-xs font-bold uppercase tracking-widest text-black/55 underline-offset-4 hover:text-black hover:underline"
              >
                Command Center →
              </Link>
            </div>
          ) : null}
        </div>
      </header>

      {/* Ops desk — real links, not a marketing chart */}
      <section className="mt-10 overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]">
        <div
          className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 px-5 py-5 md:px-8 md:py-6"
          style={{
            background:
              "radial-gradient(ellipse 70% 120% at 100% 0%, rgba(230,0,126,0.4), transparent 55%)",
          }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
              Company desk
            </p>
            <h2
              className="mt-2 max-w-lg text-2xl font-medium leading-tight text-white md:text-3xl"
              style={{ fontFamily: SERIF }}
            >
              What you need, one tap away
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">
              Consult, proposal, send, book, care guides, contraindications — synced to the tools you
              already built.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              {CONSULT_PRODUCT.statusChip}
            </span>
          </div>
        </div>

        <ul className="grid gap-3 p-4 sm:grid-cols-2 md:gap-4 md:p-6">
          {CONSULT_OPS_ACTIONS.map((action, i) => (
            <li key={action.id}>
              <Link
                href={action.href}
                className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-white/25 bg-white/5 px-5 py-5 transition hover:border-[#FFB8DC] hover:bg-white/10 md:px-6 md:py-6"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    className="mt-2 text-xl font-medium text-white group-hover:text-[#FFB8DC]"
                    style={{ fontFamily: SERIF }}
                  >
                    {action.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/90">{action.detail}</p>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {!compact ? (
        <section className="mt-10 rounded-[1.75rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.3)] md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
            Easy flow
          </p>
          <h2 className="mt-2 text-2xl font-medium text-black md:text-3xl" style={{ fontFamily: SERIF }}>
            Fewer tabs. Same system — in order.
          </h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-5">
            {CONSULT_PIPELINE.map((s) => (
              <li key={s.step}>
                <Link
                  href={s.href}
                  className="block h-full rounded-2xl border-2 border-black/10 bg-gradient-to-b from-white to-rose-50/80 p-4 transition hover:border-[#E6007E] hover:shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black text-xs font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                    >
                      {s.step}
                    </span>
                    <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black/50">
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-black text-black">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-black/60">{s.detail}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
