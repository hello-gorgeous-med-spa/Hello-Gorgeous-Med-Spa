import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL, FRESHA_BOOKING_URL_DANIELLE, FRESHA_BOOKING_URL_RYAN } from "@/lib/flows";
import {
  IV_DRIP_MENU,
  IV_THERAPY_SERVICE_PATH,
  ivBagBuilderUrl,
  ivDripMenuItemListJsonLd,
} from "@/lib/iv-drip-menu";
import { IV_BAG_SIZES, IV_BAG_TARGET_RANGE } from "@/lib/iv-bag-builder";
import { SERVICES, faqJsonLd, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `https://www.hellogorgeousmedspa.com${IV_THERAPY_SERVICE_PATH}`;

const service = SERVICES.find((s) => s.slug === "iv-therapy")!;

function DripCard({ drip }: { drip: (typeof IV_DRIP_MENU)[number] }) {
  return (
    <article className="group h-full rounded-2xl border border-white/10 bg-[#151922] p-6 transition-all duration-300 hover:border-[#FF2D8E]/50 hover:shadow-[0_0_24px_rgba(255,45,142,0.12)]">
      <h3 className="font-serif text-2xl text-white tracking-tight">{drip.name}</h3>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#7dd3fc]">
        {drip.ingredients.join(" • ")}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-gray-400">{drip.description}</p>
    </article>
  );
}

export function IvTherapyServicePage() {
  const buildUrl = ivBagBuilderUrl();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(service.faqs, PAGE_URL)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ivDripMenuItemListJsonLd(PAGE_URL)) }}
      />

      <div className="bg-[#0a0a0a] text-white min-h-screen">
        {/* Ambient pink wash */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 70% 45% at 50% -5%, rgba(230,0,126,0.18) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 100% 40%, rgba(255,45,142,0.1) 0%, transparent 50%),
              #0a0a0a
            `,
          }}
        />

        {/* Hero */}
        <Section className="relative border-b-4 border-black py-14 md:py-20 !px-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <Link
                href="/services/body-wellness"
                className="inline-flex items-center gap-2 rounded-full border border-[#FF2D8E]/30 bg-[#FF2D8E]/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#FFB8DC] hover:bg-[#FF2D8E]/20 transition-colors"
              >
                <span aria-hidden>⚡</span>
                Body &amp; Wellness
              </Link>
              <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight">
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  IV Therapy
                </span>
              </h1>
              <p className="mt-2 text-lg text-[#FFB8DC] font-semibold">{service.heroTitle}</p>
              <p className="mt-4 max-w-2xl text-lg text-white/75 leading-relaxed">{service.heroSubtitle}</p>

              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                  Book IV Therapy
                </CTA>
                <CTA href={buildUrl} variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4">
                  Build Your IV Bag — from ${IV_BAG_SIZES[0].basePrice}
                </CTA>
              </div>
              <p className="mt-4 text-sm text-white/45">
                Or book with{" "}
                <Link href={FRESHA_BOOKING_URL_DANIELLE} className="text-[#FFB8DC] underline underline-offset-2 hover:text-white">
                  Danielle
                </Link>{" "}
                ·{" "}
                <Link href={FRESHA_BOOKING_URL_RYAN} className="text-[#FFB8DC] underline underline-offset-2 hover:text-white">
                  Ryan
                </Link>{" "}
                · NP on site 7 days a week · Oswego, Naperville, Aurora &amp; Plainfield
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* Signature drip grid — reference layout */}
        <Section className="py-12 md:py-16 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="mb-10 max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Signature menu</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">Choose your drip</h2>
                <p className="mt-2 text-white/55">
                  Clinician-guided IV formulations sourced through Olympia Pharmacy — same menu in our app and on site.
                </p>
              </div>
            </FadeUp>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {IV_DRIP_MENU.map((drip, i) => (
                <FadeUp key={drip.id} delayMs={40 * (i % 4)}>
                  <DripCard drip={drip} />
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Build Your IV Bag */}
        <Section className="border-y-4 border-black bg-[#030712] py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <FadeUp>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">Custom in the app</p>
              <h2 className="mt-2 text-3xl font-black text-white">Build Your IV Bag</h2>
              <p className="mt-3 text-white/65 max-w-xl mx-auto">
                Pick {IV_BAG_SIZES[0].volumeLabel} (${IV_BAG_SIZES[0].basePrice}) or {IV_BAG_SIZES[1].volumeLabel} (${IV_BAG_SIZES[1].basePrice}),
                stack B12, glutathione, vitamin C, Tri-Immune &amp; more — most custom bags land ${IV_BAG_TARGET_RANGE.min}–${IV_BAG_TARGET_RANGE.max}.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <CTA href={buildUrl} variant="gradient">
                  Open IV Builder in App
                </CTA>
                <CTA href="/app?tab=vitamin" variant="outline" className="!border-white/30 !text-white hover:!bg-white hover:!text-black">
                  Vitamin Bar Shots
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Quick benefits strip */}
        <Section className="py-12 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "💧", title: "100% Absorption", body: "Bypass digestion for immediate nutrient delivery" },
              { icon: "⚡", title: "Instant Energy", body: "Feel revitalized within hours, not days" },
              { icon: "🛡️", title: "Immune Support", body: "High-dose vitamins to boost your body's defenses" },
              { icon: "✨", title: "Glowing Skin", body: "Hydration from the inside out for radiant results" },
            ].map((item, i) => (
              <FadeUp key={item.title} delayMs={50 * i}>
                <div className="rounded-2xl border-2 border-black bg-[#151922] p-5 shadow-[4px_4px_0_0_rgba(255,45,142,0.25)]">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="mt-2 font-bold text-[#FF2D8E]">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Section>

        {/* Expert + FAQ */}
        <Section className="py-14 bg-[#030712] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <FadeUp>
                <ServiceExpertWidget serviceName={service.name} slug={service.slug} category={service.category} />
              </FadeUp>
            </div>
            <div className="lg:col-span-7">
              <FadeUp delayMs={80}>
                <h2 className="text-2xl font-black text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-2xl border border-white/10 bg-[#151922] overflow-hidden open:border-[#FF2D8E]/40"
                    >
                      <summary className="cursor-pointer px-5 py-4 font-semibold text-white hover:text-[#FFB8DC] transition-colors list-none flex items-center justify-between gap-3">
                        {faq.question}
                        <span className="text-[#FF2D8E] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                      </summary>
                      <p className="px-5 pb-4 text-sm text-white/65 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* Closing CTA — HG pink band */}
        <section
          className="border-t-4 border-black py-16 md:py-20"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to drip?</h2>
            <p className="text-white/90 text-lg mb-8">
              Book your IV session or build a custom bag in the Hello Gorgeous app — Ryan Kent, FNP-BC on site 7 days a week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <CTA href={BOOKING_URL} variant="white">
                Book Now
              </CTA>
              <CTA href={buildUrl} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#E6007E]">
                Build Your IV Bag
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/75">
              📍 74 W Washington St, Oswego, IL · 📞 (630) 636-6193
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
