import type { Metadata } from "next";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, breadcrumbJsonLd, eventJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { THE_GLOW_SOCIAL, theGlowSocialMapsUrl } from "@/lib/the-glow-social-event";
import { GlowSocialPromoSlideshow } from "@/components/events/GlowSocialPromoSlideshow";

const pagePath = "/events/the-glow-social";
const pageUrl = `${SITE.url}${pagePath}`;

const RSVP_URL = `${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}utm_source=website&utm_medium=the_glow_social&utm_campaign=may_2026`;

const EVENT_FAQS = [
  {
    question: "When and where is The Glow Social?",
    answer: `Thursday, May 14, 2026, from 5:00 to 8:00 PM at Freddie's Off the Chain, 11 S Madison St, Oswego, IL 60543. Appetizers are on us; cash bar available (21+ to drink, please drink responsibly).`,
  },
  {
    question: "Is there a cost to attend?",
    answer:
      "The event is FREE to attend, but RSVP is required so we can plan food, staffing, and on-site vitamin injections. Spots are limited.",
  },
  {
    question: "What will Hello Gorgeous showcase?",
    answer:
      "We'll share our Trifecta technologies — Solaria CO₂, Morpheus8 Burst, and Quantum RF — plus weight loss and wellness programs, in plain language. Live demos and free consults; medical treatments are scheduled at the med spa after evaluation, not performed at the restaurant.",
  },
  {
    question: "What is the raffle and who can win?",
    answer:
      "We will award three grand prizes (Morpheus8 Burst or Solaria, a qualified weight-loss month, and 20 units of Botox) plus bonus raffle mechanics at check-in. Every confirmed guest receives a complimentary vitamin injection (B12, B-Complex, or MIC) on site while supplies and schedule allow. All prizes require medical eligibility; rules and odds disclosed at the event.",
  },
  {
    question: "How do I RSVP?",
    answer: `Book online (${SITE.name} booking), call ${SITE.phone}, or message us on social and mention "The Glow Social." RSVP early for an extra raffle entry per flyer terms.`,
  },
] as const;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "The Glow Social May 14, 2026 | VIP Night | Freddie's Oswego | Hello Gorgeous",
    description: `FREE VIP night May 14, 2026, 5–8 PM at Freddie's Oswego — beauty, bites & bubbly. Solaria, Morpheus8 Burst, Quantum RF, wellness consults, raffle & guest vitamin shots. RSVP: ${SITE.phone}`,
    path: pagePath,
  }),
  keywords: [
    "Hello Gorgeous event Oswego",
    "The Glow Social Oswego IL",
    "med spa VIP night May 2026",
    "Freddie's Off the Chain Oswego",
    "Morpheus8 event Oswego",
    "Solaria CO2 event",
    "Quantum RF Oswego",
  ],
};

export default function TheGlowSocialPage() {
  const eventLd = eventJsonLd({
    name: `${THE_GLOW_SOCIAL.headline} — ${THE_GLOW_SOCIAL.subhead}`,
    startDate: THE_GLOW_SOCIAL.startDateIso,
    endDate: THE_GLOW_SOCIAL.endDateIso,
    description: `${THE_GLOW_SOCIAL.tagline}. ${THE_GLOW_SOCIAL.costNote} ${THE_GLOW_SOCIAL.foodBar}`,
    location: {
      name: THE_GLOW_SOCIAL.venue.name,
      streetAddress: THE_GLOW_SOCIAL.venue.streetAddress,
      addressLocality: THE_GLOW_SOCIAL.venue.addressLocality,
      addressRegion: THE_GLOW_SOCIAL.venue.addressRegion,
      postalCode: THE_GLOW_SOCIAL.venue.postalCode,
    },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "The Glow Social", url: pageUrl },
            ])
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(EVENT_FAQS, pageUrl)) }} />

      <main className="bg-white text-black min-h-screen">
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(230,0,126,0.2),transparent_50%)]" />
          <div className="relative max-w-4xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-22 text-center">
            <p className="text-[#E6007E] text-xs font-bold uppercase tracking-[0.25em] mb-3">Exclusive VIP invitation</p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">{THE_GLOW_SOCIAL.headline}</h1>
            <p className="mt-3 text-xl md:text-2xl text-[#E6007E]/90 font-medium">{THE_GLOW_SOCIAL.subhead}</p>
            <p className="mt-4 text-lg md:text-xl text-white/85 max-w-2xl mx-auto">{THE_GLOW_SOCIAL.tagline}</p>
            <div className="mt-8 inline-flex flex-col sm:flex-row gap-3 sm:gap-6 text-left sm:text-center bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mx-auto max-w-xl">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">When</p>
                <p className="font-semibold text-white">{THE_GLOW_SOCIAL.display.dateLine}</p>
                <p className="text-white/70 text-sm">{THE_GLOW_SOCIAL.display.timeLine}</p>
              </div>
              <div className="hidden sm:block w-px bg-white/15 self-stretch" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Where</p>
                <p className="font-semibold text-white">{THE_GLOW_SOCIAL.venue.name}</p>
                <p className="text-white/70 text-sm">
                  {THE_GLOW_SOCIAL.venue.streetAddress}, {THE_GLOW_SOCIAL.venue.addressLocality},{" "}
                  {THE_GLOW_SOCIAL.venue.addressRegion} {THE_GLOW_SOCIAL.venue.postalCode}
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-white/70 max-w-lg mx-auto">{THE_GLOW_SOCIAL.hostsNote}</p>
            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <a
                href={RSVP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold px-8 py-3.5 hover:bg-[#c90a68] transition-colors"
              >
                RSVP — reserve your spot
              </a>
              <a
                href={THE_GLOW_SOCIAL.flyerPdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] transition-colors"
              >
                Download flyer PDF
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] transition-colors"
              >
                Call {SITE.phone}
              </a>
              <a
                href={theGlowSocialMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] transition-colors"
              >
                Directions ↗
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 px-4 md:px-6 bg-zinc-950 text-white border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Event graphics</h2>
            <p className="mt-2 text-sm text-white/65 max-w-xl mx-auto">
              Swipe or use arrows — promo art for The Glow Social and a quick look at our signature resurfacing technologies.
            </p>
          </div>
          <GlowSocialPromoSlideshow />
        </section>

        <section className="py-14 px-6 border-b border-black/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">The vibe</h2>
            <p className="mt-4 text-black/75 leading-relaxed">
              {THE_GLOW_SOCIAL.foodBar} {THE_GLOW_SOCIAL.costNote}
            </p>
          </div>
        </section>

        <section className="py-14 px-6 bg-black/[0.02]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-6">What you&apos;ll experience</h2>
            <ul className="space-y-3 mb-10">
              {THE_GLOW_SOCIAL.eventHighlights.map((line) => (
                <li key={line} className="flex gap-3 text-black/85">
                  <span className="text-[#E6007E] font-bold flex-shrink-0">★</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-6">
              {THE_GLOW_SOCIAL.experiences.map((x) => (
                <div key={x.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#E6007E]">{x.title}</h3>
                  <p className="mt-2 text-black/75 text-sm leading-relaxed">{x.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 px-6">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border-2 border-[#E6007E]/30 bg-gradient-to-br from-[#E6007E]/[0.06] to-white p-8">
              <h3 className="text-xl font-bold font-serif text-[#E6007E]">{THE_GLOW_SOCIAL.everyGuest.title}</h3>
              <p className="mt-3 text-black/80 text-sm leading-relaxed">{THE_GLOW_SOCIAL.everyGuest.detail}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-8">
              <h3 className="text-xl font-bold font-serif">The raffle — 3 winners</h3>
              <ul className="mt-4 space-y-3 text-sm text-black/75">
                {THE_GLOW_SOCIAL.raffleGrandPrizes.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-[#E6007E] flex-shrink-0">✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-14 px-6 bg-zinc-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8">Earn bonus raffle entries</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {THE_GLOW_SOCIAL.bonusEntries.map((line) => (
                <li
                  key={line}
                  className="flex gap-2 text-sm text-black/80 bg-white rounded-xl border border-black/5 px-4 py-3"
                >
                  <span className="text-[#E6007E] font-bold flex-shrink-0">✦</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-black/50 text-center">
              Bonus entry rules are summarized from the official flyer; final rules, verification, and eligibility are confirmed at check-in.
            </p>
          </div>
        </section>

        <section className="py-14 px-6 bg-black text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10">FAQ</h2>
            <div className="space-y-8">
              {EVENT_FAQS.map((f) => (
                <div key={f.question}>
                  <h3 className="font-bold text-lg text-[#E6007E]">{f.question}</h3>
                  <p className="mt-2 text-white/75 text-sm leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-6 text-center border-t border-black/5">
          <p className="text-xs text-black/50 max-w-xl mx-auto leading-relaxed">
            Educational and promotional event hosted by {SITE.name}. Nothing on this page guarantees results, treatment, or
            raffle outcomes. All injectable and prescription services require medical evaluation; contraindications may
            apply. Alcohol does not mix with some medications — ask your clinician. Full raffle and promotional rules at the
            event. {THE_GLOW_SOCIAL.hostsNote}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href="/events/vip-device-night" className="text-[#E6007E] font-semibold hover:underline">
              VIP Device Night (May 14) →
            </Link>
            <Link href="/" className="text-[#E6007E] font-semibold hover:underline">
              ← Back to Hello Gorgeous
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
