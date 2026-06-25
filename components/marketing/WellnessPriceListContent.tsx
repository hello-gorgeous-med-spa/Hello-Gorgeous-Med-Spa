import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL, HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { formatPrepayLine } from "@/lib/peptide-retail-pricing";
import { SITE } from "@/lib/seo";
import {
  WELLNESS_PRICE_LIST_FAQS,
  WELLNESS_PRICE_LIST_FLYER_PATH,
  WELLNESS_PRICE_LIST_HIGHLIGHTS,
  WELLNESS_PRICE_LIST_SECTIONS,
} from "@/lib/wellness-price-list";

const QR_APP = `/api/app/qr-code?target=${encodeURIComponent("/wellness-price-list")}&utm_medium=price_list&utm_campaign=wellness_menu&width=180`;

function ServiceCard({
  item,
}: {
  item: (typeof WELLNESS_PRICE_LIST_SECTIONS)[number]["items"][number];
}) {
  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#2d1020]/12 bg-white shadow-[0_8px_30px_rgba(45,16,32,0.06)] transition hover:border-[#E6007E]/35 hover:shadow-[0_12px_40px_rgba(230,0,126,0.1)]">
      {item.image ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.name}
            fill
            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d1020]/50 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-[#FFF0F7] via-[#FAF7F4] to-white" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="font-serif text-lg font-semibold leading-snug text-[#2d1020]">{item.name}</h3>
          {item.consultFirst ? (
            <span className="shrink-0 rounded-full border border-[#2d1020]/15 bg-[#FAF7F4] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2d1020]/70">
              Consult
            </span>
          ) : null}
        </div>

        {item.tagline ? (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C9917A]">
            {item.tagline}
          </p>
        ) : null}

        {item.benefits && item.benefits.length > 0 ? (
          <ul className="mt-3 space-y-1.5 flex-1">
            {item.benefits.slice(0, 3).map((b) => (
              <li key={b} className="flex gap-2 text-sm text-[#2d1020]/75">
                <span className="mt-0.5 text-[#E6007E]" aria-hidden>
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : item.note ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#2d1020]/70">{item.note}</p>
        ) : null}

        <div className="mt-4 border-t border-[#2d1020]/8 pt-3">
          <p className="text-xl font-semibold text-[#E6007E]">{item.priceLabel}</p>
          {item.memberPriceLabel ? (
            <p className="mt-0.5 text-xs font-medium text-[#2d1020]/55">{item.memberPriceLabel}</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block h-full">
        {card}
      </Link>
    );
  }
  return card;
}

export function WellnessPriceListContent() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#FAF7F4]">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(255,184,220,0.25), transparent), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(230,0,126,0.08), transparent)",
          }}
        />
      </div>

      {/* Hero */}
      <section className="border-b border-[#2d1020]/10 bg-gradient-to-br from-[#2d1020] via-[#1a1228] to-[#0a0a0a] text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[#FFB8DC] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                  Hello Gorgeous Med Spa · Oswego, IL
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
                  Advanced{" "}
                  <span className="italic text-[#FFB8DC]">Wellness</span>
                  <br />
                  Therapies
                </h1>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#C9917A]">
                  Optimize health · Enhance recovery · Elevate wellness
                </p>
                <p className="mt-5 max-w-xl text-lg text-white/80 font-light leading-relaxed">
                  Peptide therapy, vitamin injections, IV drips, medical weight loss, hormone optimization &amp;
                  memberships — published starting rates you can share with clients.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <CTA href={BOOKING_URL} variant="gradient">
                    Schedule consultation
                  </CTA>
                  <CTA href={WELLNESS_PRICE_LIST_FLYER_PATH} variant="outline">
                    Print brochure
                  </CTA>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-3">
                {WELLNESS_PRICE_LIST_HIGHLIGHTS.slice(0, 4).map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-5 backdrop-blur-sm"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FFB8DC]/90">
                      {h.label}
                    </p>
                    <p className="mt-1 font-serif text-2xl text-white">{h.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category nav */}
      <nav className="sticky top-0 z-20 border-b border-[#2d1020]/10 bg-[#FAF7F4]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 justify-center">
          {WELLNESS_PRICE_LIST_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-[#2d1020]/15 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2d1020]/80 transition hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Service sections */}
      {WELLNESS_PRICE_LIST_SECTIONS.map((section, sIdx) => (
        <Section
          key={section.id}
          id={section.id}
          className={`scroll-mt-28 border-b border-[#2d1020]/8 ${sIdx % 2 === 0 ? "bg-white" : "bg-[#FAF7F4]"}`}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <FadeUp>
              <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#2d1020]/10 pb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9917A]">
                    {section.eyebrow}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-[#2d1020]">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[#2d1020]/70 leading-relaxed">{section.intro}</p>
                </div>
                <span className="font-serif text-5xl font-light text-[#E6007E]/20">{section.number}</span>
              </div>
            </FadeUp>

            {section.id === "peptides" ? (
              <FadeUp delayMs={40}>
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-[#C9917A]/30 bg-gradient-to-r from-[#FFF8F5] to-white p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#C9917A]">Before you start</p>
                    <p className="mt-1 font-serif text-3xl text-[#2d1020]">${PEPTIDE_CONSULT_FEE_USD} NP consult</p>
                    <p className="mt-1 text-sm text-[#2d1020]/65">
                      Required for new peptide protocols · telehealth with Ryan Kent, FNP-BC
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[#2d1020]/70 md:text-right">
                    Example prepay: {formatPrepayLine(149)}
                  </p>
                </div>
              </FadeUp>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {section.items.map((item, i) => (
                <FadeUp key={item.id} delayMs={60 + i * 15}>
                  <ServiceCard item={item} />
                </FadeUp>
              ))}
            </div>

            {section.footerNote ? (
              <FadeUp delayMs={200}>
                <p className="mt-10 text-xs text-[#2d1020]/50 max-w-3xl leading-relaxed italic">{section.footerNote}</p>
              </FadeUp>
            ) : null}
          </div>
        </Section>
      ))}

      {/* FAQ + CTA band */}
      <Section className="bg-white border-b border-[#2d1020]/8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeUp>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9917A]">Good to know</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#2d1020]">Wellness FAQs</h2>
              <dl className="mt-8 space-y-6">
                {WELLNESS_PRICE_LIST_FAQS.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-serif text-lg font-semibold text-[#2d1020]">{faq.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-[#2d1020]/70">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </FadeUp>

            <FadeUp delayMs={80}>
              <div className="space-y-5">
                <div className="rounded-xl border border-[#C9917A]/35 bg-gradient-to-br from-[#FFF8F5] to-[#FAF7F4] p-8">
                  <h3 className="font-serif text-2xl font-semibold text-[#2d1020]">Schedule your consultation</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#2d1020]/70">
                    Ryan Kent, FNP-BC · full prescriptive authority · on site seven days a week. Your personalized quote
                    is confirmed before you commit.
                  </p>
                  <p className="mt-4 font-semibold text-[#E6007E] text-lg">{SITE.phone}</p>
                  <p className="text-sm text-[#2d1020]/60">
                    {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL
                  </p>
                  <div className="mt-6">
                    <CTA href={BOOKING_URL} variant="gradient">
                      Book now
                    </CTA>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-[#2d1020] to-[#1a1228] p-8 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-[#FFB8DC]">Curious about pricing?</h3>
                      <p className="mt-2 text-sm text-white/75 leading-relaxed">
                        Scan for the full live menu, member rates, and Hello Gorgeous app checkout.
                      </p>
                      <p className="mt-3 text-xs text-white/50">hellogorgeousmedspa.com/wellness-price-list</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={QR_APP} alt="Scan for full wellness menu" width={100} height={100} className="rounded-lg border border-white/20 bg-white p-1 shrink-0" />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* Closing CTA */}
      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">Hand this to clients — or print your own</h2>
          <p className="text-white/90 font-light mb-6 leading-relaxed">
            Download the brochure for front-desk handouts. The full list always lives at hellogorgeousmedspa.com/wellness-price-list
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={WELLNESS_PRICE_LIST_FLYER_PATH} variant="white">
              Open print brochure
            </CTA>
            <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="outline">
              Start Hello Gorgeous RX
            </CTA>
          </div>
        </div>
      </Section>
    </>
  );
}
