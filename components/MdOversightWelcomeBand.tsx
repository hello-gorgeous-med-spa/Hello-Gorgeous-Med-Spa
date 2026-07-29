import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { CONVERSION_HIERARCHY } from "@/lib/illinois-excellence";
import { DANI_FULL_NAME } from "@/lib/founder-credentials";
import {
  DANI_CLINICAL_CREDENTIALS,
  DR_ARORA_PROFILE,
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
              Owner-operator with clinical credentials. Board-certified NP on site. Collaborating
              physician oversight. Real people — not a letterhead.
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
          {MD_OVERSIGHT_TEAM.map((provider, i) => (
            <FadeUp key={provider.name} delayMs={i * 50}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="relative aspect-[4/5] bg-[#f8f4f0]">
                  <Image
                    src={provider.image}
                    alt={provider.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
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
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={100}>
          <div className="mt-10 overflow-hidden rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  Why we chose him for oversight
                </p>
                <h3 className="mt-2 font-serif text-2xl font-bold text-black">{arora.name}</h3>
                <p className="mt-1 text-sm font-medium text-black/60">{arora.credentialsLine}</p>
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
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  What patients are saying
                </p>
                <p className="mt-2 text-xs text-black/50">
                  Themes from patient feedback about Dr. Arora — summarized, not individual quotes.
                </p>
                <div className="mt-4 space-y-3">
                  {arora.patientThemes.map((theme) => (
                    <div
                      key={theme.title}
                      className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4"
                    >
                      <p className="text-sm font-bold text-[#E6007E]">{theme.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-black/80">{theme.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t-2 border-black/10 pt-6">
              <CTA href={CONVERSION_HIERARCHY.primary.href} variant="gradient">
                {CONVERSION_HIERARCHY.primary.label}
              </CTA>
              <Link
                href="/providers"
                className="inline-flex items-center justify-center rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                Meet the full team →
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
