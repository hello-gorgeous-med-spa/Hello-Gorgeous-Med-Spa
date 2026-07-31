"use client";

import Link from "next/link";
import {
  CONSULT_BENEFITS,
  CONSULT_OUTCOMES,
  CONSULT_PIPELINE,
  CONSULT_PRODUCT,
} from "@/lib/consults/product-story";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SERIF = "var(--font-playfair), Georgia, serif";

type Props = {
  /** When true, hide the big CTA (e.g. already on new page) */
  hideCta?: boolean;
  /** Compact = skip benefits + pipeline (for embed above a queue) */
  compact?: boolean;
};

export function ConsultProductShell({ hideCta = false, compact = false }: Props) {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient wash */}
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

      {/* Hero */}
      <header className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: PINK }}
          >
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
          <p className="text-sm leading-relaxed text-black/65 md:text-base">
            {CONSULT_PRODUCT.subhead}
          </p>
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
                href="/admin/proposals"
                className="text-xs font-bold uppercase tracking-widest text-black/50 underline-offset-4 hover:text-black hover:underline"
              >
                Proposals →
              </Link>
            </div>
          ) : null}
        </div>
      </header>

      {/* Outcome instrument panel */}
      <section className="mt-10 overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] text-white shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]">
        <div
          className="border-b border-white/10 px-5 py-5 md:px-8 md:py-6"
          style={{
            background:
              "radial-gradient(ellipse 70% 120% at 100% 0%, rgba(230,0,126,0.35), transparent 55%)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
                Outcome chart
              </p>
              <h2
                className="mt-2 max-w-lg text-2xl font-medium leading-tight md:text-3xl"
                style={{ fontFamily: SERIF }}
              >
                What changes when the consult is grounded
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                {CONSULT_PRODUCT.statusChip}
              </span>
            </div>
          </div>
          <div className="mt-5 hidden grid-cols-[1.2fr_1fr_auto_1fr] gap-3 border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 md:grid">
            <span>Outcome</span>
            <span>Manual process</span>
            <span className="w-8 text-center">→</span>
            <span>With Hello Gorgeous</span>
          </div>
        </div>

        <ul className="divide-y divide-white/10 px-3 py-3 md:px-5 md:py-4">
          {CONSULT_OUTCOMES.map((row) => (
            <li
              key={row.id}
              className="grid gap-3 rounded-2xl px-2 py-4 md:grid-cols-[1.2fr_1fr_auto_1fr] md:items-center md:gap-3 md:px-3"
            >
              <div>
                <p className="text-sm font-bold text-white">{row.outcome}</p>
                <p className="mt-0.5 text-xs text-white/45">{row.outcomeDetail}</p>
              </div>
              <div>
                <p className="text-xs text-white/55 md:text-[13px]">{row.manual}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#c45c5c]"
                    style={{ width: `${row.manualFill}%` }}
                  />
                </div>
              </div>
              <div className="hidden h-8 w-8 items-center justify-center rounded-full border-2 border-[#FFB8DC] bg-[#E6007E] text-xs font-black text-white md:flex">
                →
              </div>
              <div>
                <p className="text-xs text-white/85 md:text-[13px]">{row.withHg}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${row.withFill}%`,
                      background: `linear-gradient(90deg, ${HOT}, ${PINK})`,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="border-t border-white/10 px-5 py-3 text-[11px] text-[#FFB8DC]/85 md:px-8">
          Bars visualize workflow change — not fabricated outcome percentages. Results depend on
          screening, provider judgment, and follow-through.
        </p>
      </section>

      {!compact ? (
        <>
          {/* Numbered benefits */}
          <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CONSULT_BENEFITS.map((b) => (
              <article
                key={b.n}
                className="relative overflow-hidden rounded-[1.35rem] border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.28)]"
              >
                <span
                  className="pointer-events-none absolute -right-1 -top-3 text-6xl font-medium text-black/[0.06]"
                  style={{ fontFamily: SERIF }}
                  aria-hidden
                >
                  {b.n}
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: PINK }}>
                  {b.n}
                </p>
                <h3
                  className="mt-2 text-lg font-medium leading-snug text-black"
                  style={{ fontFamily: SERIF }}
                >
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{b.body}</p>
              </article>
            ))}
          </section>

          {/* Pipeline */}
          <section className="mt-10 rounded-[1.75rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.3)] md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
              The grounded consult path
            </p>
            <h2
              className="mt-2 text-2xl font-medium text-black md:text-3xl"
              style={{ fontFamily: SERIF }}
            >
              Templates do the heavy lifting. Your NP keeps authority.
            </h2>
            <ol className="mt-6 grid gap-3 md:grid-cols-5">
              {CONSULT_PIPELINE.map((s) => (
                <li
                  key={s.step}
                  className="rounded-2xl border-2 border-black/10 bg-gradient-to-b from-white to-rose-50/80 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black text-xs font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                    >
                      {s.step}
                    </span>
                    <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black/45">
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-black text-black">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-black/55">{s.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : null}
    </div>
  );
}
