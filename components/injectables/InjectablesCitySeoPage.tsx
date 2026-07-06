import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { LocalSeoConversionStrip } from "@/components/seo/LocalSeoConversionStrip";
import {
  INJECTABLES_CITY_HERO_IMAGE,
  INJECTABLES_CITY_PRICING,
  INJECTABLES_CITY_SERVICE_HIGHLIGHTS,
  injectablesCityCrossLinks,
  type InjectablesCitySeoContent,
} from "@/lib/injectables-city-seo";
import { INJECTABLES_MARKETING, INJECTABLES_PATH } from "@/lib/injectables-marketing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export function InjectablesCitySeoPage({ content }: { content: InjectablesCitySeoContent }) {
  const crossLinks = injectablesCityCrossLinks(content.slug);
  const pricing = INJECTABLES_CITY_PRICING;

  return (
    <main className="bg-white">
      <section className="relative bg-black py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1020] via-black to-black opacity-95" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">
              {content.heroEyebrow}
            </p>
            <h1 className="mb-4 text-3xl font-black leading-tight md:text-5xl">
              Botox & Fillers in{" "}
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                {content.heroAccent}
              </span>
            </h1>
            <p className="mb-6 max-w-xl text-lg text-white/90 md:text-xl">
              NP-led neurotoxins and dermal fillers at Hello Gorgeous — Botox {pricing.botox}, lip
              filler {pricing.lipFiller}, all five neurotoxin brands, and Lip Studio preview in
              Oswego.
            </p>
            <p className="mb-8 text-sm text-[#FFB8DC]">
              Full menu, pricing & FAQs on our Botox & Fillers flagship page.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={INJECTABLES_PATH}
                className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-3.5 font-bold text-white transition hover:opacity-90"
              >
                Botox & Fillers menu
              </Link>
              <Link
                href={PRIMARY_BOOKING_CTA.href}
                className="inline-flex justify-center rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white transition hover:bg-white hover:text-black"
              >
                Book free consult
              </Link>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-[#E6007E]/40 bg-gradient-to-br from-[#2d1020] to-black p-8">
            <Image
              src={INJECTABLES_CITY_HERO_IMAGE}
              alt={content.heroImageAlt}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
      </section>

      {content.driveNote ? (
        <section className="border-y-2 border-black/10 bg-[#FFF0F7] py-8">
          <p className="px-4 text-center text-base font-semibold text-black/85">{content.driveNote}</p>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <h2 className="mb-4 text-2xl font-bold text-black md:text-3xl">
          Why {content.cityLabel} clients choose Hello Gorgeous
        </h2>
        <p className="mb-4 text-lg text-gray-700">{content.localLead}</p>
        <p className="mb-6 text-lg text-gray-700">
          Our Oswego clinic is medically supervised — not a volume-injection shop. We map honest
          units and syringes to your anatomy, preserve natural movement, and keep hyaluronidase on
          hand when medically appropriate.
        </p>
        <p className="mb-8 text-lg text-gray-700">
          We welcome clients from <strong>Oswego</strong>, <strong>Naperville</strong>,{" "}
          <strong>Aurora</strong>, <strong>Plainfield</strong>, <strong>Yorkville</strong>,{" "}
          <strong>Montgomery</strong>, and <strong>Kendall County</strong>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {INJECTABLES_CITY_SERVICE_HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="flex gap-2 rounded-xl border-2 border-black/10 bg-rose-50/50 px-4 py-3 font-medium text-black/85"
            >
              <span className="text-[#E6007E]">▸</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-100 bg-neutral-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-black">{content.pricingHeading}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Botox (first-time)", price: pricing.botox, highlight: true },
              { name: "Lip filler", price: pricing.lipFiller, detail: "1 syringe" },
              { name: "Dermal filler", price: pricing.dermalFiller, detail: "per syringe" },
              { name: "Neurotoxins", price: pricing.neurotoxinBrands, detail: "Full menu at consult" },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl border-4 p-5 ${
                  pkg.highlight
                    ? "border-[#E6007E] bg-rose-50 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
                    : "border-black bg-white"
                }`}
              >
                <p className="font-bold text-black">{pkg.name}</p>
                <p className="mt-1 text-2xl font-black text-[#E6007E]">{pkg.price}</p>
                {pkg.detail ? <p className="text-sm text-gray-600">{pkg.detail}</p> : null}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Full pricing, brand comparison & Lip Studio on{" "}
            <Link href={INJECTABLES_PATH} className="font-semibold text-[#E6007E] hover:underline">
              Botox & Fillers menu →
            </Link>
          </p>
        </div>
      </section>

      <LocalSeoConversionStrip />

      <section className="border-t border-gray-100 bg-neutral-50 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-black">Injectables FAQ</h2>
          <FAQAccordion items={content.faqs} />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#E6007E]">Also serving</p>
          <div className="flex flex-wrap justify-center gap-2">
            {crossLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border-2 border-black/15 px-4 py-2 text-sm font-semibold text-black/80 transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-12 text-center text-white">
        <p className="mb-4 text-sm text-white/80">
          {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
          {SITE.address.postalCode}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={INJECTABLES_PATH}
            className="inline-flex rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white transition hover:bg-[#FF2D8E]"
          >
            Explore injectables menu
          </Link>
          <Link
            href={PRIMARY_BOOKING_CTA.href}
            className="inline-flex rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white transition hover:bg-white hover:text-black"
          >
            Book consult
          </Link>
          <a
            href={INJECTABLES_MARKETING.phoneHref}
            className="inline-flex rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white transition hover:bg-white hover:text-black"
          >
            Call {INJECTABLES_MARKETING.phoneDisplay}
          </a>
        </div>
      </section>
    </main>
  );
}
