"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { CONVERSION_HIERARCHY } from "@/lib/illinois-excellence";
import { DANI_FULL_NAME } from "@/lib/founder-credentials";
import {
  DANI_CLINICAL_CREDENTIALS,
  DR_ARORA_FULL_NAME,
  DR_ARORA_PROFILE,
  DR_ARORA_SEO_BLURB,
  MD_OVERSIGHT_TEAM,
  STOREFRONT_TRUST_SIGN,
} from "@/lib/medical-trust";

type Props = {
  className?: string;
};

/** Homepage band — door plaque + Dani, Ryan, and Dr. Arora as medical leadership. */
export function MdOversightWelcomeBand({ className = "" }: Props) {
  const sign = STOREFRONT_TRUST_SIGN;
  const arora = DR_ARORA_PROFILE;
  const [aroraOpen, setAroraOpen] = useState(false);
  const dialogTitleId = useId();

  useEffect(() => {
    if (!aroraOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAroraOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [aroraOpen]);

  return (
    <section
      className={`border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#1a0a14] to-[#2d1020] ${className}`}
      aria-labelledby="md-oversight-welcome-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12 md:px-6 md:py-14">
        <FadeUp>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
              Hello Gorgeous Med Spa · Oswego
            </p>
            <h2
              id="md-oversight-welcome-heading"
              className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Medical leadership you can meet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/70">
              Owner-operator with clinical credentials. Medical Director Dr. Mukesh Arora, MD.
              Board-certified NP on site. Real people — not a letterhead.
            </p>
          </div>

          <div className="mx-auto mt-8 w-full max-w-xl">
            <div className="overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={sign.image}
                alt={sign.alt}
                width={1200}
                height={480}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </FadeUp>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {MD_OVERSIGHT_TEAM.map((provider, i) => {
            const isArora = provider.name === DR_ARORA_FULL_NAME;
            return (
              <FadeUp key={provider.name} delayMs={i * 50}>
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  {isArora ? (
                    <button
                      type="button"
                      onClick={() => setAroraOpen(true)}
                      className="group relative aspect-[4/5] bg-[#f8f4f0] text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E6007E] focus-visible:ring-offset-2"
                      aria-haspopup="dialog"
                      aria-expanded={aroraOpen}
                      aria-controls="arora-oversight-dialog"
                    >
                      <Image
                        src={provider.image}
                        alt={provider.imageAlt}
                        fill
                        className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10">
                        <span className="inline-flex items-center rounded-full border-2 border-white/40 bg-[#E6007E] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                          Learn more →
                        </span>
                      </span>
                    </button>
                  ) : (
                    <div className="relative aspect-[4/5] bg-[#f8f4f0]">
                      <Image
                        src={provider.image}
                        alt={provider.imageAlt}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col border-t-4 border-black p-4 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
                      {provider.badge}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-black sm:text-xl">
                      {provider.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#E6007E]">{provider.role}</p>
                    <p className="mt-2 text-sm leading-snug text-black/70">{provider.detail}</p>
                    {provider.name === DANI_FULL_NAME ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {DANI_CLINICAL_CREDENTIALS.map((cred) => (
                          <span
                            key={cred}
                            className="rounded-full border border-black/15 bg-[#FFF0F7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#E6007E]"
                          >
                            {cred}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {isArora ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setAroraOpen(true)}
                          className="mt-3 self-start text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-2 hover:text-[#FF2D8E]"
                        >
                          Why we chose him as Medical Director →
                        </button>
                        <a href="#dr-mukesh-arora" className="sr-only">
                          Read about Medical Director Dr. Mukesh Arora, MD at Hello Gorgeous
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        <FadeUp delayMs={100}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTA href={CONVERSION_HIERARCHY.primary.href} variant="gradient">
              {CONVERSION_HIERARCHY.primary.label}
            </CTA>
            <Link
              href="/providers"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
            >
              Meet the full team →
            </Link>
          </div>
        </FadeUp>

        {/* Always in the HTML for SEO/AEO — UI details live in the Learn more dialog. */}
        <article id="dr-mukesh-arora" className="sr-only">
          <h3>Why Hello Gorgeous chose {arora.name} as Medical Director</h3>
          <p>{DR_ARORA_SEO_BLURB}</p>
          <p>
            {arora.credentialsLine}. Graduated {arora.graduated}. Affiliated with{" "}
            {arora.affiliations.join(" and ")}.
          </p>
          <ul>
            {arora.whyWeChoseHim.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h4>What patients are saying about Dr. Arora</h4>
          <ul>
            {arora.patientThemes.map((theme) => (
              <li key={theme.title}>
                <strong>{theme.title}:</strong> {theme.body}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {aroraOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setAroraOpen(false)}
          role="presentation"
        >
          <div
            id="arora-oversight-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-4 border-black bg-white p-5 shadow-[12px_12px_0_0_rgba(230,0,126,0.35)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  Why we chose him as Medical Director
                </p>
                <h3 id={dialogTitleId} className="mt-2 font-serif text-2xl font-bold text-black">
                  {arora.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-black/60">{arora.credentialsLine}</p>
              </div>
              <button
                type="button"
                onClick={() => setAroraOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#FFF0F7] text-xl font-bold text-black hover:bg-[#E6007E] hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-black/80">
              Over 30 years in medicine. Graduated from {arora.graduated}. Affiliated with{" "}
              {arora.affiliations.join(" and ")}.
            </p>

            <ul className="mt-5 space-y-3">
              {arora.whyWeChoseHim.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-black/85">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E6007E]" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t-2 border-black/10 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                What patients are saying
              </p>
              <p className="mt-2 text-xs text-black/50">
                Themes from patient feedback about Dr. Arora — summarized, not individual quotes.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {arora.patientThemes.map((theme) => (
                  <div key={theme.title} className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4">
                    <p className="text-sm font-bold text-[#E6007E]">{theme.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/80">{theme.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t-2 border-black/10 pt-6">
              <CTA href={CONVERSION_HIERARCHY.primary.href} variant="gradient">
                {CONVERSION_HIERARCHY.primary.label}
              </CTA>
              <button
                type="button"
                onClick={() => setAroraOpen(false)}
                className="inline-flex items-center justify-center rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
