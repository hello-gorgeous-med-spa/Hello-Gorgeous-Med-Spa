import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { REGENERATIVE_NAV } from "@/lib/regenerative-medicine-nav";
import { NAD_PLUS_INJECTIONS_PATH } from "@/lib/nad-plus-injections";
import { SITE } from "@/lib/seo";

export function RegenerativeMedicineHub() {
  return (
    <>
      <section className="border-b-4 border-black bg-gradient-to-br from-black via-[#1a0a12] to-black text-white py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Oswego, IL · Naperville · Aurora · Plainfield
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Regenerative{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Medicine
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto font-medium">
              PRP, PRF, AnteAGE® exosomes & biosomes, P.E.A.R.L., and NAD+ — organized in one place so you can choose the
              right cellular wellness path with NP-directed care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient">
                Book consultation
              </CTA>
              <CTA href={NAD_PLUS_INJECTIONS_PATH} variant="outline">
                NAD+ injections
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      <Section className="bg-white border-b-4 border-black py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-black">Why Hello Gorgeous for regeneration?</h2>
              <p className="mt-4 text-black/80 font-medium leading-relaxed">
                We built our regenerative menu around <strong className="text-[#E6007E]">AnteAGE®</strong> professional
                technology — bone marrow–derived exosomes and biosomes manufactured under cGMP standards — combined with
                your own biology through <strong>PRP and PRF</strong>, plus quick <strong>NAD+</strong> wellness injections.
              </p>
              <p className="mt-4 text-black/70 text-sm">
                Medical oversight from <Link href="/providers" className="text-[#E6007E] font-bold hover:underline">Ryan Kent, FNP-BC</Link>
                . Educational planning from our founder-led aesthetic team.
              </p>
            </FadeUp>
            <FadeUp delayMs={40}>
              <div className="rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src="/images/homepage-services/anteage-md-brightening.png"
                  alt="AnteAGE regenerative skincare at Hello Gorgeous Med Spa Oswego IL"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </FadeUp>
          </div>

          {REGENERATIVE_NAV.sections.map((section, sIdx) => (
            <FadeUp key={section.heading} delayMs={sIdx * 30}>
              <div className="mb-12">
                <h3 className="text-xl font-black text-[#E6007E] mb-6 flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6007E] text-white text-sm font-black">
                    {sIdx + 1}
                  </span>
                  {section.heading}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group block rounded-3xl border-4 border-black bg-white p-5 shadow-[5px_5px_0_0_rgba(230,0,126,0.25)] hover:border-[#E6007E] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-black group-hover:text-[#E6007E]">{link.label}</p>
                        {link.badge ? (
                          <span className="shrink-0 rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                            {link.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-black/65 font-medium">{link.sub}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto text-center px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Not sure where to start?</h2>
          <p className="text-white/90 font-medium mb-8">
            Book a consult — we&apos;ll map PRF, AnteAGE, microneedling, or NAD+ based on your goals, downtime, and history.
          </p>
          <CTA href={BOOKING_URL} variant="white">
            Book on Fresha
          </CTA>
          <p className="mt-6 text-sm text-white/70">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
        </div>
      </Section>
    </>
  );
}
