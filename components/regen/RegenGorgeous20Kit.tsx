"use client";

import { useState } from "react";
import Link from "next/link";
import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import {
  GORGEOUS20_CODE,
  GORGEOUS20_COPY,
  GORGEOUS20_EXAMPLES,
  GORGEOUS20_HERO,
  GORGEOUS20_LEGAL,
  GORGEOUS20_PERCENT,
  GORGEOUS20_PORTRAIT,
  GORGEOUS20_START_HREF,
  REGEN_VIAL_LINEUP,
} from "@/lib/regen-gorgeous20";
import { SITE } from "@/lib/seo";

const BRAND = {
  teal: "#0D9488",
  pink: "#E91E8C",
  dark: "#0A0A0A",
  cream: "#FAF9F6",
};

const COPY_BLOCKS = [
  { id: "sms", label: "Text / SMS", text: GORGEOUS20_COPY.sms },
  { id: "ig", label: "Instagram", text: GORGEOUS20_COPY.instagram },
  { id: "fb", label: "Facebook", text: GORGEOUS20_COPY.facebook },
  { id: "gbp", label: "Google Business", text: GORGEOUS20_COPY.gbp },
] as const;

export function RegenGorgeous20Kit() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="min-h-screen" style={{ background: BRAND.dark, color: BRAND.cream }}>
      <RegenPublicNav />

      <section className="relative overflow-hidden">
        <img
          src={GORGEOUS20_HERO}
          alt="Danielle and Ryan Kent, FNP-BC in REGEN RX scrubs"
          className="h-[56vh] min-h-[340px] w-full object-cover object-[50%_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em]" style={{ color: BRAND.teal }}>
            Hello Gorgeous × REGEN RX
          </p>
          <h1 className="font-serif text-4xl font-black leading-tight md:text-6xl">
            Same Danielle. Same Ryan.
            <span className="block" style={{ color: BRAND.pink }}>
              First order {GORGEOUS20_PERCENT}% off.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Code <strong style={{ color: BRAND.pink }}>{GORGEOUS20_CODE}</strong> on the
            payment screen. Ryan Kent, FNP-BC prescribes only when it is clinically
            right for you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={GORGEOUS20_START_HREF}
              className="rounded-full px-7 py-3 text-sm font-extrabold text-white"
              style={{ background: BRAND.pink }}
            >
              Start your visit
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border-2 border-white/30 px-7 py-3 text-sm font-extrabold print:hidden"
            >
              Print / save cards
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: BRAND.teal }}>
          What Ryan can prescribe
        </p>
        <h2 className="mt-2 font-serif text-3xl font-black md:text-4xl">
          Examples — not a cart.
        </h2>
        <p className="mt-3 max-w-2xl text-white/70">
          You are asking for a consult. If it is appropriate, it ships to your Illinois
          door. Compounded medications are not FDA-approved.
        </p>
        <img
          src={REGEN_VIAL_LINEUP}
          alt="REGEN RX vials"
          className="mt-8 w-full rounded-3xl object-cover"
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GORGEOUS20_EXAMPLES.map((ex) => (
            <Link
              key={ex.name}
              href={ex.href}
              className="rounded-2xl border p-4 transition hover:border-[#E91E8C]"
              style={{ borderColor: `${BRAND.teal}40`, background: "#111" }}
            >
              <b className="block text-sm">{ex.name}</b>
              <small className="mt-1 block text-xs text-white/55">{ex.detail}</small>
              <em className="mt-2 block text-sm font-extrabold not-italic" style={{ color: BRAND.pink }}>
                {ex.from}
              </em>
            </Link>
          ))}
        </div>
      </section>

      <section className="print:hidden mx-auto max-w-6xl px-6 pb-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: BRAND.teal }}>
          Copy and post
        </p>
        <h2 className="mt-2 font-serif text-3xl font-black">Text, Instagram, Facebook, Google.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {COPY_BLOCKS.map((block) => (
            <div key={block.id} className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <strong>{block.label}</strong>
                <button
                  type="button"
                  onClick={() => copy(block.id, block.text)}
                  className="rounded-full px-4 py-1.5 text-xs font-extrabold text-white"
                  style={{ background: BRAND.pink }}
                >
                  {copied === block.id ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 pb-20">
        <p className="print:hidden text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: BRAND.teal }}>
          Print-shop cards
        </p>

        <article className="g20-card overflow-hidden rounded-[28px] border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(233,30,140,0.35)]">
          <div className="grid md:grid-cols-2">
            <img
              src={GORGEOUS20_PORTRAIT}
              alt="Danielle and Ryan holding syringes"
              className="h-full min-h-[320px] w-full object-cover"
            />
            <div className="flex flex-col justify-between p-8">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: BRAND.teal }}>
                  First order
                </p>
                <p className="mt-2 font-serif text-6xl font-black" style={{ color: BRAND.pink }}>
                  {GORGEOUS20_PERCENT}%
                </p>
                <p className="mt-1 text-2xl font-black">off with {GORGEOUS20_CODE}</p>
                <p className="mt-4 text-white/70">
                  Enter the code on the Stripe payment screen. Same Danielle. Same Ryan
                  Kent, FNP-BC. New door.
                </p>
              </div>
              <p className="mt-8 text-sm font-extrabold" style={{ color: BRAND.pink }}>
                tryregenrx.com/start
              </p>
            </div>
          </div>
        </article>

        <article className="g20-card rounded-[28px] border-4 border-black bg-[#111] p-8 shadow-[8px_8px_0_0_rgba(13,148,136,0.35)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: BRAND.teal }}>
            Examples we can prescribe
          </p>
          <h3 className="mt-2 font-serif text-3xl font-black">Ryan decides.</h3>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {GORGEOUS20_EXAMPLES.map((ex) => (
              <li key={ex.name} className="border-b border-white/10 pb-2 text-sm">
                <strong>{ex.name}</strong>
                <span className="text-white/55"> — {ex.detail}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-white/45">{GORGEOUS20_LEGAL}</p>
          <p className="mt-3 text-sm">
            {SITE.phone} · {SITE.address.addressLocality}, IL · tryregenrx.com
          </p>
        </article>
      </section>

      <style>{`
        @media print {
          @page { size: letter portrait; margin: 0.4in; }
          nav, .print\\:hidden { display: none !important; }
          .g20-card { break-inside: avoid; page-break-inside: avoid; margin-bottom: 0.4in; }
        }
      `}</style>
    </div>
  );
}
