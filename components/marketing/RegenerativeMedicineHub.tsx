import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  REGENERATIVE_MEDICINE_PATH,
  REGENERATIVE_MENU_HUBS,
  REGENERATIVE_NAV,
} from "@/lib/regenerative-medicine-nav";
import { SITE } from "@/lib/seo";

function MenuHubCard({ label, href, sub, badge }: { label: string; href: string; sub: string; badge?: string }) {
  const cta = badge === "MENU" ? "Open menu →" : "Learn more →";
  return (
    <Link
      href={href}
      className="group block rounded-2xl border-4 border-black bg-[#151922] p-5 shadow-[6px_6px_0_0_rgba(255,45,142,0.3)] transition-all duration-300 hover:border-[#FF2D8E]/50 hover:shadow-[0_0_32px_rgba(255,45,142,0.15),6px_6px_0_0_rgba(255,45,142,0.4)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-serif text-lg text-white group-hover:text-[#FFB8DC] transition-colors">{label}</p>
        {badge ? (
          <span className="shrink-0 rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFB8DC]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{sub}</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#FF2D8E] group-hover:underline">
        {cta}
      </p>
    </Link>
  );
}

export function RegenerativeMedicineHub() {
  const hubSections = REGENERATIVE_NAV.sections.map((section) => ({
    ...section,
    links: section.links.filter((link) => link.href !== REGENERATIVE_MEDICINE_PATH),
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(230,0,126,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 100% 40%, rgba(125,211,252,0.08) 0%, transparent 50%),
            #0a0a0a
          `,
        }}
      />

      <Section className="relative border-b-4 border-black py-14 md:py-20 !px-0">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">
              Oswego, IL · Naperville · Aurora · Plainfield
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight">
              Regenerative{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Medicine
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75 leading-relaxed">
              PRP, PRF, AnteAGE® exosomes, microneedling, and EZ PRF Gel — every regenerative path in one place with
              numbered menus, published pricing, and NP-directed care.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                Book consultation
              </CTA>
              <CTA href="/services/microneedling" variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4">
                Microneedling menu
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="!px-0 py-4 md:py-8 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Start here</p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl text-white">Regenerative menu hubs</h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">
              Same dark menu layout as injectables and wellness — numbered sections, expandable pricing, FAQs on each page.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REGENERATIVE_MENU_HUBS.map((link, i) => (
              <FadeUp key={link.href} delayMs={i * 40}>
                <MenuHubCard {...link} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!px-0 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 mb-14">
            <FadeUp>
              <h2 className="font-serif text-2xl md:text-3xl text-white">Why Hello Gorgeous for regeneration?</h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                We built our regenerative program around <strong className="text-[#FFB8DC]">AnteAGE®</strong> professional
                technology — bone marrow–derived exosomes and biosomes — combined with your own biology through{" "}
                <strong className="text-white">PRP and PRF</strong>, plus microneedling and Morpheus8 stacks.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Medical oversight from{" "}
                <Link href="/providers" className="text-[#FF2D8E] font-bold hover:underline">
                  Ryan Kent, FNP-BC
                </Link>
                . NAD+ and IV wellness live on the{" "}
                <Link href="/services/wellness" className="text-[#FF2D8E] font-bold hover:underline">
                  Wellness Menu
                </Link>
                .
              </p>
            </FadeUp>
            <FadeUp delayMs={40}>
              <div className="overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
                <Image
                  src="/images/homepage-services/anteage-md-brightening.png"
                  alt="AnteAGE regenerative skincare at Hello Gorgeous Med Spa Oswego IL"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            </FadeUp>
          </div>

          {hubSections.map((section, sIdx) => (
            <FadeUp key={section.heading} delayMs={sIdx * 30}>
              <article className="border-b border-white/10 py-10 md:py-12 last:border-b-0">
                <div className="flex gap-5 md:gap-10">
                  <span
                    className="shrink-0 font-serif text-5xl md:text-6xl leading-none text-white/10 tabular-nums select-none"
                    aria-hidden
                  >
                    {String(sIdx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl md:text-3xl text-white tracking-tight">{section.heading}</h3>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {section.links.map((link) => (
                        <MenuHubCard key={link.href} {...link} />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] border-t-4 border-black py-14 md:py-16 !px-0">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white">Not sure where to start?</h2>
          <p className="mt-3 text-white/90 font-medium">
            Book a consult — we&apos;ll map PRF, AnteAGE, microneedling, or facial PRP based on your goals, downtime, and history.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book online
            </CTA>
            <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]">
              Call {SITE.phone}
            </CTA>
          </div>
          <p className="mt-6 text-sm text-white/70">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL
          </p>
        </div>
      </Section>
    </div>
  );
}
