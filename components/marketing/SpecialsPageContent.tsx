"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  QUANTUM_RF_LAUNCH_PACKAGES,
  QUANTUM_RF_LAUNCH_PATH,
} from "@/lib/quantum-rf-launch-promo";
import {
  SIGNATURE_MENU_POSTER,
  SIGNATURE_MENU_SECTIONS,
} from "@/lib/signature-treatment-menu";
import { MORE_SPECIALS_LINKS } from "@/lib/specials";
import { SITE } from "@/lib/seo";

function MenuCard({
  title,
  accentLine,
  description,
  href,
  badge,
}: {
  title: string;
  accentLine: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#151922] p-6 transition-all duration-300 hover:border-[#FF2D8E]/50 hover:shadow-[0_0_24px_rgba(255,45,142,0.12)]"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="font-serif text-2xl text-white tracking-tight group-hover:text-[#FFB8DC] transition-colors">
          {title}
        </h3>
        {badge ? (
          <span className="rounded-full border border-[#FF2D8E]/40 bg-[#FF2D8E]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#FFB8DC]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="text-sm font-medium leading-relaxed text-[#7dd3fc]">{accentLine}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{description}</p>
      <span className="mt-5 text-sm font-bold text-[#FF2D8E] group-hover:underline">View offer →</span>
    </Link>
  );
}

const SIGNATURE_CARDS = SIGNATURE_MENU_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    title: item.title,
    accentLine: [section.heading, item.price].filter(Boolean).join(" · "),
    description: item.details?.join(" · ") ?? "Book a free consultation to confirm candidacy and pricing.",
    href: item.href,
  }))
);

const QUANTUM_CARDS = QUANTUM_RF_LAUNCH_PACKAGES.map((pkg) => ({
  title: pkg.name,
  accentLine: `${pkg.price} · ${pkg.financing}`,
  description: `${pkg.bonus}. ${pkg.highlights.slice(0, 2).join(" · ")}`,
  href: `${QUANTUM_RF_LAUNCH_PATH}#packages`,
  badge: pkg.badge,
}));

export function SpecialsPageContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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

      <Section className="relative border-b-4 border-black py-14 md:py-20 !px-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
              Oswego, IL · NP on site 7 days a week
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight">
              Specials &amp;{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Signature Menu
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75 leading-relaxed">
              Botox $10/unit, lip filler, Morpheus8, Quantum RF, Solaria CO₂, Trifecta packages, memberships, and
              limited-time promos — all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <CTA href={BOOKING_URL} variant="gradient" className="!px-8 !py-4">
                Book on Fresha
              </CTA>
              <CTA href="#menu" variant="outline" className="!border-[#FF2D8E] !text-[#FFB8DC] hover:!bg-[#FF2D8E] hover:!text-white !px-8 !py-4">
                View signature menu
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section id="menu" className="scroll-mt-24 border-b-4 border-black bg-[#0a0a0a] py-10 md:py-14 !px-0">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <FadeUp>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151922] p-3 md:p-4">
              <Image
                src={SIGNATURE_MENU_POSTER.src}
                alt={SIGNATURE_MENU_POSTER.alt}
                width={1200}
                height={1550}
                className="h-auto w-full rounded-xl"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Scan the QR on the poster to book on Fresha, or use the button above.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-[#0a0a0a] py-12 md:py-16 !px-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-center font-serif text-3xl md:text-4xl text-white tracking-tight">
              Signature Treatment Menu
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-500">
              Injectable specials, Morpheus8, Solaria CO₂, and the InMode Trifecta.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SIGNATURE_CARDS.map((card, idx) => (
              <FadeUp key={`${card.title}-${card.href}`} delayMs={idx * 30}>
                <MenuCard {...card} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-[#0a0a0a] py-12 md:py-16 !px-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-center font-serif text-3xl md:text-4xl text-white tracking-tight">
              Quantum RF Launch
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-500">
              Neck &amp; abdomen body contouring — FREE Morpheus8 Burst included.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {QUANTUM_CARDS.map((card, idx) => (
              <FadeUp key={card.title} delayMs={idx * 40}>
                <MenuCard {...card} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-[#0a0a0a] py-12 md:py-16 !px-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-center font-serif text-3xl md:text-4xl text-white tracking-tight">
              More Current Specials
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-500">
              Memberships, VIP model days, laser promos, and new-client offers.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MORE_SPECIALS_LINKS.map((item, idx) => (
              <FadeUp key={item.href} delayMs={idx * 30}>
                <MenuCard
                  title={item.label}
                  accentLine={item.sub}
                  description="Tap to view full details, eligibility, and booking options."
                  href={item.href}
                  badge={"badge" in item ? item.badge : undefined}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] border-t-4 border-black py-14 md:py-16 !px-0">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white">Beautifully you. Confidently gorgeous.</h2>
          <p className="mt-4 font-medium text-white/90">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book on Fresha
            </CTA>
            <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
              Call {SITE.phone}
            </CTA>
          </div>
        </div>
      </Section>
    </div>
  );
}
