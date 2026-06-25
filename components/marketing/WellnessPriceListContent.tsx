import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL, HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { formatPrepayLine } from "@/lib/peptide-retail-pricing";
import { SITE } from "@/lib/seo";
import {
  WELLNESS_PRICE_LIST_FLYER_PATH,
  WELLNESS_PRICE_LIST_HIGHLIGHTS,
  WELLNESS_PRICE_LIST_SECTIONS,
} from "@/lib/wellness-price-list";

function PriceCard({
  item,
  compact,
}: {
  item: (typeof WELLNESS_PRICE_LIST_SECTIONS)[number]["items"][number];
  compact?: boolean;
}) {
  const inner = (
    <div
      className={`flex flex-col h-full rounded-2xl border-4 border-black bg-white overflow-hidden shadow-[5px_5px_0_0_rgba(230,0,126,0.28)] ${compact ? "" : "hover:border-[#E6007E]/60 transition"}`}
    >
      {item.image ? (
        <div className={`relative w-full ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, 240px"
          />
        </div>
      ) : (
        <div className={`bg-gradient-to-br from-[#FFF0F7] to-white ${compact ? "h-16" : "h-24"} border-b-4 border-black`} />
      )}
      <div className={`flex flex-col flex-1 ${compact ? "p-3" : "p-4"}`}>
        <div className="flex flex-wrap items-start gap-1.5">
          <p className={`font-black text-black leading-snug ${compact ? "text-sm" : "text-base"}`}>{item.name}</p>
          {item.consultFirst ? (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black text-white shrink-0">
              Consult
            </span>
          ) : null}
        </div>
        {item.note && !compact ? (
          <p className="mt-1 text-xs text-black/65 line-clamp-2">{item.note}</p>
        ) : null}
        <div className="mt-auto pt-2">
          <p className={`font-black text-[#E6007E] ${compact ? "text-sm" : "text-lg"}`}>{item.priceLabel}</p>
          {item.memberPriceLabel ? (
            <p className="text-[10px] font-bold text-black/55 mt-0.5">{item.memberPriceLabel}</p>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (item.href && !compact) {
    return (
      <Link href={item.href} className="block h-full group">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function WellnessPriceListContent() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-[#FFF0F7] via-white to-gray-50">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(230,0,126,0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(255,45,142,0.1), transparent)",
          }}
        />
      </div>

      <section className="border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#2d1020] to-black text-white py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Oswego, IL · NP-supervised wellness
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Wellness{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                price list
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto font-medium">
              Peptides, Vitamin Bar shots, hormones &amp; GLP-1 — published starting rates you can share with clients.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {WELLNESS_PRICE_LIST_HIGHLIGHTS.map((h) => (
                <span
                  key={h.label}
                  className="rounded-full border-2 border-white/25 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur"
                >
                  {h.label}: <span className="text-[#FFB8DC]">{h.value}</span>
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={WELLNESS_PRICE_LIST_FLYER_PATH} variant="gradient">
                Print brochure
              </CTA>
              <CTA href={BOOKING_URL} variant="outline">
                Book consult
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-2 justify-center">
          {WELLNESS_PRICE_LIST_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide hover:border-[#E6007E] hover:text-[#E6007E] transition"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {WELLNESS_PRICE_LIST_SECTIONS.map((section, sIdx) => (
        <Section
          key={section.id}
          id={section.id}
          className={`scroll-mt-28 border-b-4 border-black ${sIdx % 2 === 0 ? "bg-white" : "bg-gradient-to-b from-[#FFF0F7]/50 to-white"}`}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <FadeUp>
              <div className="flex items-start gap-4 mb-8">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white font-black text-sm">
                  {section.number}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">{section.eyebrow}</p>
                  <h2 className="text-2xl md:text-3xl font-black text-black mt-1">{section.title}</h2>
                  <p className="mt-2 text-black/75 max-w-3xl">{section.intro}</p>
                </div>
              </div>
            </FadeUp>

            {section.id === "peptides" ? (
              <FadeUp delayMs={40}>
                <div className="mb-8 rounded-3xl border-4 border-black bg-white p-5 md:p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#E6007E] uppercase tracking-wider">Before you start</p>
                    <p className="text-3xl font-black text-black mt-1">${PEPTIDE_CONSULT_FEE_USD} NP consult</p>
                    <p className="text-sm text-black/65 mt-1">
                      Required for new peptide protocols · telehealth with Ryan Kent, FNP-BC
                    </p>
                  </div>
                  <p className="text-sm font-bold text-black/70 md:text-right">
                    Example prepay: {formatPrepayLine(149)}
                  </p>
                </div>
              </FadeUp>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {section.items.map((item, i) => (
                <FadeUp key={item.id} delayMs={60 + i * 20}>
                  <PriceCard item={item} />
                </FadeUp>
              ))}
            </div>

            {section.footerNote ? (
              <FadeUp delayMs={200}>
                <p className="mt-8 text-xs text-black/55 max-w-3xl leading-relaxed">{section.footerNote}</p>
              </FadeUp>
            ) : null}
          </div>
        </Section>
      ))}

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Hand this to clients — or print your own</h2>
          <p className="text-white/90 font-medium mb-6">
            Download the brochure for front-desk handouts. Full list always lives at hellogorgeousmedspa.com/wellness-price-list
          </p>
          <p className="text-sm text-white/75 mb-8">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
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
