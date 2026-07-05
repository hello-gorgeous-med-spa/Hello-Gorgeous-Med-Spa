import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { LocalSeoConversionStrip } from "@/components/seo/LocalSeoConversionStrip";
import {
  BROW_CITY_HERO_IMAGE,
  BROW_JOURNEY_TECHNIQUE_HIGHLIGHTS,
  browMicrobladingCityCrossLinks,
  type BrowMicrobladingCitySeoContent,
} from "@/lib/brow-microblading-city-seo";
import {
  BROW_JOURNEY_CONTACT,
  BROW_JOURNEY_PATH,
  BROW_JOURNEY_PRICING,
} from "@/lib/brow-journey-marketing";
import { SITE } from "@/lib/seo";

export function BrowMicrobladingCitySeoPage({
  content,
}: {
  content: BrowMicrobladingCitySeoContent;
}) {
  const crossLinks = browMicrobladingCityCrossLinks(content.slug);
  const pricing = BROW_JOURNEY_PRICING;

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
              Microblading & Brow PMU in{" "}
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                {content.heroAccent}
              </span>
            </h1>
            <p className="mb-6 max-w-xl text-lg text-white/90 md:text-xl">
              Wake up with brows you love — microblading, powder, combo & nano brows by Jen Vokoun
              at Hello Gorgeous. Custom mapping, Tina Davies pigments, and NP-directed screening in
              Oswego.
            </p>
            <p className="mb-8 text-sm text-[#FFB8DC]">
              Full experience: techniques, healing timeline, pricing & FAQs on Your Brow Journey.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={BROW_JOURNEY_PATH}
                className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-3.5 font-bold text-white transition hover:opacity-90"
              >
                Your Brow Journey
              </Link>
              <Link
                href={BROW_JOURNEY_CONTACT.bookHref}
                className="inline-flex justify-center rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white transition hover:bg-white hover:text-black"
              >
                Book free consult
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-[#E6007E]/40">
            <Image
              src={BROW_CITY_HERO_IMAGE}
              alt={content.heroImageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {content.driveNote ? (
        <section className="border-y-2 border-black/10 bg-[#FFF0F7] py-8">
          <p className="px-4 text-center text-base font-semibold text-black/85">
            {content.driveNote}
          </p>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <h2 className="mb-4 text-2xl font-bold text-black md:text-3xl">
          Why {content.cityLabel} clients choose Hello Gorgeous
        </h2>
        <p className="mb-4 text-lg text-gray-700">{content.localLead}</p>
        <p className="mb-6 text-lg text-gray-700">
          Our Oswego studio is medically supervised — not a quick stencil-and-go shop. Jen maps your
          brows to your facial structure, walks you through healing, and includes a perfecting
          touch-up so your healed result is soft and natural.
        </p>
        <p className="mb-8 text-lg text-gray-700">
          We welcome clients from <strong>Oswego</strong>, <strong>Naperville</strong>,{" "}
          <strong>Aurora</strong>, <strong>Plainfield</strong>, <strong>Yorkville</strong>,{" "}
          <strong>Montgomery</strong>, and <strong>Kendall County</strong>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {BROW_JOURNEY_TECHNIQUE_HIGHLIGHTS.map((item) => (
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
              { name: "Microblading", price: pricing.microblading },
              { name: "Combo brows", price: pricing.combo, highlight: true },
              { name: "Touch-up", price: pricing.touchup, detail: "Included w/ initial" },
              { name: "Meet Jen special", price: pricing.meetMicroblading, detail: "Limited time" },
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
            Full pricing, pre-care, healing timeline & financing on{" "}
            <Link href={BROW_JOURNEY_PATH} className="font-semibold text-[#E6007E] hover:underline">
              Your Brow Journey →
            </Link>
          </p>
        </div>
      </section>

      <LocalSeoConversionStrip />

      <section className="border-t border-gray-100 bg-neutral-50 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-black">Microblading FAQ</h2>
          <FAQAccordion items={content.faqs} />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#E6007E]">
            Also serving
          </p>
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
          {SITE.address.streetAddress}, {SITE.address.addressLocality},{" "}
          {SITE.address.addressRegion} {SITE.address.postalCode}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={BROW_JOURNEY_PATH}
            className="inline-flex rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white transition hover:bg-[#FF2D8E]"
          >
            Explore Your Brow Journey
          </Link>
          <Link
            href={BROW_JOURNEY_CONTACT.bookHref}
            className="inline-flex rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white transition hover:bg-white hover:text-black"
          >
            Book consult
          </Link>
          <a
            href={BROW_JOURNEY_CONTACT.phoneTel}
            className="inline-flex rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white transition hover:bg-white hover:text-black"
          >
            Call {BROW_JOURNEY_CONTACT.phoneDisplay}
          </a>
        </div>
      </section>
    </main>
  );
}
