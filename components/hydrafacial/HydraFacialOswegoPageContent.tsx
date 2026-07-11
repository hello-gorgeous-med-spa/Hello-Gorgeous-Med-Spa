import Link from "next/link";

import {
  JOURNEY_SECTION_BG_A,
  JOURNEY_SECTION_BG_B,
  JourneyPinkBtn,
  JourneySectionHead,
} from "@/components/marketing/JourneyPageUi";
import { RealPatientReviews } from "@/components/RealPatientReviews";
import { HydraFacialHero } from "@/components/hydrafacial/HydraFacialHero";
import {
  HYDRAFACIAL_MARKETING,
  HYDRAFACIAL_MEMBERSHIP,
  HYDRAFACIAL_FAQS,
  HYDRAFACIAL_TREATS,
} from "@/lib/hydrafacial-marketing";
import { SITE } from "@/lib/seo";

export function HydraFacialOswegoPageContent() {
  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <HydraFacialHero
        localityLine="Oswego · Naperville · Aurora · Yorkville"
        title={
          <>
            HydraFacial in{" "}
            <span className="text-[#FF2D8E]">Oswego, IL</span>
          </>
        }
        description={`${HYDRAFACIAL_MARKETING.subhead} Glow Facial Membership from $99/month.`}
      />

      <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-20`}>
        <div className="mx-auto max-w-4xl rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#FF2D8E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black">
                {HYDRAFACIAL_MEMBERSHIP.badge}
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                Monthly glow — HydraFacial + dermaplaning
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {HYDRAFACIAL_MEMBERSHIP.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-[#FF2D8E]" aria-hidden>
                      ✓
                    </span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <p className="font-serif text-4xl font-bold text-[#FF2D8E]">
                {HYDRAFACIAL_MEMBERSHIP.price}
                <span className="text-lg font-semibold text-white/55">{HYDRAFACIAL_MEMBERSHIP.priceNote}</span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <JourneyPinkBtn href={HYDRAFACIAL_MARKETING.appHref}>{HYDRAFACIAL_MEMBERSHIP.ctaLabel}</JourneyPinkBtn>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <JourneySectionHead
            eyebrow="What it treats"
            title="One treatment,"
            titleAccent="dozens of benefits"
            description="Medical-grade vortex technology for all skin types — immediate glow, zero downtime."
            center
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HYDRAFACIAL_TREATS.map((item) => (
              <article
                key={item.concern}
                className="rounded-[20px] border border-white/14 bg-[#0a0206] p-5"
              >
                <h3 className="font-serif text-lg font-bold text-[#FF2D8E]">{item.concern}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-20`}>
        <div className="mx-auto max-w-[900px]">
          <JourneySectionHead eyebrow="FAQ" title="HydraFacial" titleAccent="questions" center />
          <div className="mt-10 space-y-3">
            {HYDRAFACIAL_FAQS.map((faq, idx) => (
              <details
                key={faq.question}
                className="group rounded-[20px] border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/50"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span>{faq.question}</span>
                    <span className="text-[#FF2D8E] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/80">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white text-black">
        <RealPatientReviews
          service="facial"
          serviceLabel="HydraFacial in Oswego"
          heading="Real HydraFacial results in Oswego"
          intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`}
        />
      </div>

      <section className="bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-serif text-[34px] font-bold leading-tight lg:text-[46px]">
            Ready to glow?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/80">
            Free consultations · Glow Facial Membership $99/mo · Open 7 days · Oswego IL
          </p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Link
              href={HYDRAFACIAL_MARKETING.bookHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-black"
            >
              Book online now
            </Link>
            <a
              href={HYDRAFACIAL_MARKETING.phoneHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              Call {HYDRAFACIAL_MARKETING.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
