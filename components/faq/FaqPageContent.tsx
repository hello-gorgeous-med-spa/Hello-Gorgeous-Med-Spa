"use client";

import Link from "next/link";
import type { ClipboardEvent, ReactNode } from "react";
import { useCallback, useEffect } from "react";

import { CTA } from "@/components/CTA";
import { Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import type { FAQPageSection } from "@/lib/med-spa-faq-data";
import { MED_SPA_FAQ_SECTIONS } from "@/lib/med-spa-faq-data";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function blockClipboard(e: ClipboardEvent<HTMLElement>) {
  e.preventDefault();
}

export function FaqPageContent({ seoIntro }: { seoIntro?: ReactNode }) {
  const blockContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  /** Deters casual copy — not a security boundary (HTML is still public). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  return (
    <div
      id="faq-protected-root"
      data-faq-protected
      className="relative min-h-[100dvh] touch-pan-y [-webkit-touch-callout:none]"
      onCopy={blockClipboard}
      onCut={blockClipboard}
      onContextMenu={blockContext}
      onDragStart={(e) => e.preventDefault()}
      aria-describedby="faq-copy-notice"
    >
      <p id="faq-copy-notice" className="sr-only">
        This page uses copy protection. For personal help, use Book or call {SITE.phone}.
      </p>

      {/* Ambient brand wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        {/* Hero */}
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            {/* No FadeUp on hero — opacity:0 delays LCP for text */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
              Hello Gorgeous
            </div>
            <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4 max-w-2xl mx-auto leading-relaxed">
              {HG_TAGLINE}
            </p>
            <p className="text-xs md:text-sm uppercase tracking-widest text-white/70 font-medium mb-4">
              Oswego · Naperville · Aurora · Plainfield
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
              Med Spa{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                FAQ
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
              Straight answers about treatments, safety, booking, and financing — the same vibe as our{" "}
              <Link href="/best-med-spa-oswego-il" className="text-[#FFB8DC] font-semibold underline decoration-[#E6007E] underline-offset-4 hover:text-white">
                #1 Best Med Spa in Oswego
              </Link>
              . Book online or call{" "}
              <a
                href={`tel:${SITE.phone}`}
                className="font-bold text-[#FFB8DC] hover:text-white underline decoration-[#E6007E]"
              >
                {SITE.phone}
              </a>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                Book a free consultation
              </CTA>
              <CTA href="/services" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                View services
              </CTA>
            </div>
          </div>
        </Section>

        {seoIntro}

        {/* Topic chips */}
        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="FAQ topics" className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to a topic
            </p>
            <ul className="flex flex-wrap gap-2">
              {MED_SPA_FAQ_SECTIONS.map((sec) => (
                <li key={sec.slug}>
                  <a
                    href={`#${sec.slug}`}
                    className="inline-block text-sm px-4 py-2 rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 text-black font-medium shadow-sm hover:border-[#E6007E] hover:text-[#E6007E] hover:shadow-md transition-all"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        {/* FAQ sections */}
        {MED_SPA_FAQ_SECTIONS.map((sec, idx) => (
          <FaqSectionBlock key={sec.slug} section={sec} index={idx} />
        ))}

        {/* Closing CTA */}
        <Section className="relative !py-20 overflow-hidden border-t-4 border-black">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-md">Still have questions?</h2>
            <p className="text-white/95 text-lg mb-10 max-w-xl mx-auto">
              We love talking through your goals — book online or reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white" className="shadow-xl">
                Book online
              </CTA>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#E6007E] transition shadow-lg"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}

function FaqSectionBlock({ section, index }: { section: FAQPageSection; index: number }) {
  const isAlt = index % 2 === 1;
  return (
    <Section
      id={section.slug}
      className={`scroll-mt-28 !py-16 md:!py-20 ${isAlt ? "bg-white/50" : "bg-gradient-to-b from-white to-[#FFF5FA]"}`}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl border-4 border-black p-8 md:p-10 bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex items-start gap-3 mb-6">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white text-lg font-black border-2 border-black"
              aria-hidden
            >
              {index + 1}
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">{section.title}</h2>
              {section.summary && <p className="text-black/65 mt-2 leading-relaxed font-medium">{section.summary}</p>}
            </div>
          </div>
          <dl className="space-y-0 border-t-2 border-black/10 mt-6">
            {section.items.map((item) => (
              <div key={item.question} className="border-b border-black/10 last:border-b-0">
                <dt className="pt-6 pb-2">
                  <span className="text-lg font-bold text-[#E6007E] flex items-start gap-2">
                    <span className="text-black mt-0.5" aria-hidden>
                      ▸
                    </span>
                    {item.question}
                  </span>
                </dt>
                <dd className="pb-6 pl-6 text-black/85 leading-relaxed font-medium select-none">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
