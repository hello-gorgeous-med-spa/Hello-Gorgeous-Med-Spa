import type { Metadata } from "next";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, breadcrumbJsonLd, eventJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { VIP_DEVICE_NIGHT, vipDeviceNightMapsUrl } from "@/lib/vip-device-night-event";

const pagePath = "/events/vip-device-night";
const pageUrl = `${SITE.url}${pagePath}`;

const RSVP_URL = `${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}utm_source=website&utm_medium=vip_device_night&utm_campaign=may_2026`;

const EVENT_FAQS = [
  {
    question: "When and where is VIP Device Night?",
    answer: `Thursday, May 7, 2026, starting at 6:00 PM at Freddie's Off the Chain, 11 S Madison St, Oswego, IL 60543. We're hosting a fun night with appetizers, a taco station, and goodies — cash bar available (21+ to drink).`,
  },
  {
    question: "What will Hello Gorgeous showcase at the event?",
    answer:
      "We'll introduce our Solaria CO₂ fractional laser, Morpheus8 Burst and Deep (RF microneedling), and Quantum RF body contouring — in plain language, with our clinical team on hand to answer questions. Treatments are scheduled after medical evaluation at the med spa, not performed at the restaurant.",
  },
  {
    question: "What is the event Botox offer?",
    answer:
      "We're promoting VIP event pricing at $10 per unit for neuromodulator (e.g., Botox) for qualified candidates who sign up per event rules. A medical evaluation is required; not everyone is a candidate. Full terms are provided at check-in.",
  },
  {
    question: "Will there be raffles and VIP packages?",
    answer:
      "Yes — we'll run raffles with prizes and offer special VIP packages for devices and treatments, available for purchase or deposit that night. Package details and eligibility are shared at the event.",
  },
  {
    question: "How do I RSVP?",
    answer: `Call us at ${SITE.phone}, book a consultation online, or message us on social and mention "VIP Device Night." Walk-ins welcome if space allows — RSVPs help us plan food and staffing.`,
  },
] as const;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "VIP Device Night May 7, 2026 | Solaria, Morpheus8, Quantum RF | Oswego",
    description: `Hello Gorgeous VIP night at Freddie's Off the Chain, Oswego — May 7, 2026, 6 PM. Tacos, apps, cash bar. Solaria, Morpheus8 Burst & Deep, Quantum RF. Event Botox $10/unit (rules apply). Raffles & VIP packages. ${SITE.phone}`,
    path: pagePath,
  }),
  keywords: [
    "Hello Gorgeous event Oswego",
    "med spa VIP night Oswego IL",
    "Solaria CO2 event",
    "Morpheus8 Burst Oswego",
    "Quantum RF Oswego",
    "Freddie's Off the Chain Oswego",
    "Botox special Oswego",
  ],
};

export default function VipDeviceNightPage() {
  const eventLd = eventJsonLd({
    name: VIP_DEVICE_NIGHT.headline,
    startDate: VIP_DEVICE_NIGHT.startDateIso,
    endDate: VIP_DEVICE_NIGHT.endDateIso,
    description: `${VIP_DEVICE_NIGHT.tagline}. Hosted by ${SITE.name}. ${VIP_DEVICE_NIGHT.hostedFood} ${VIP_DEVICE_NIGHT.barNote}`,
    location: {
      name: VIP_DEVICE_NIGHT.venue.name,
      streetAddress: VIP_DEVICE_NIGHT.venue.streetAddress,
      addressLocality: VIP_DEVICE_NIGHT.venue.addressLocality,
      addressRegion: VIP_DEVICE_NIGHT.venue.addressRegion,
      postalCode: VIP_DEVICE_NIGHT.venue.postalCode,
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
              { name: "VIP Device Night", url: pageUrl },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(EVENT_FAQS, pageUrl)) }}
      />

      <main className="bg-white text-black min-h-screen">
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(230,0,126,0.22),transparent_55%)]" />
          <div className="relative max-w-4xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-22 text-center">
            <p className="text-[#E6007E] text-xs font-bold uppercase tracking-[0.25em] mb-3">Invite-style VIP night</p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">{VIP_DEVICE_NIGHT.headline}</h1>
            <p className="mt-4 text-lg md:text-xl text-white/85 max-w-2xl mx-auto">{VIP_DEVICE_NIGHT.tagline}</p>
            <div className="mt-8 inline-flex flex-col sm:flex-row gap-3 sm:gap-6 text-left sm:text-center bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mx-auto max-w-xl">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">When</p>
                <p className="font-semibold text-white">
                  {VIP_DEVICE_NIGHT.display.dateLine}
                </p>
                <p className="text-white/70 text-sm">
                  {VIP_DEVICE_NIGHT.display.timeLine}
                  {VIP_DEVICE_NIGHT.display.endTimeHint ? ` · ends ${VIP_DEVICE_NIGHT.display.endTimeHint}` : ""}
                </p>
              </div>
              <div className="hidden sm:block w-px bg-white/15 self-stretch" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Where</p>
                <p className="font-semibold text-white">{VIP_DEVICE_NIGHT.venue.name}</p>
                <p className="text-white/70 text-sm">
                  {VIP_DEVICE_NIGHT.venue.streetAddress}, {VIP_DEVICE_NIGHT.venue.addressLocality},{" "}
                  {VIP_DEVICE_NIGHT.venue.addressRegion} {VIP_DEVICE_NIGHT.venue.postalCode}
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={RSVP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold px-8 py-3.5 hover:bg-[#c90a68] transition-colors"
              >
                RSVP — book consult
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] transition-colors"
              >
                Call {SITE.phone}
              </a>
              <a
                href={vipDeviceNightMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] transition-colors"
              >
                Directions ↗
              </a>
            </div>
          </div>
        </section>

        <section className="py-14 px-6 border-b border-black/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">The vibe</h2>
            <p className="mt-4 text-black/75 leading-relaxed">
              {VIP_DEVICE_NIGHT.hostedFood} {VIP_DEVICE_NIGHT.barNote} It&apos;s a <strong>fun night out</strong> with your
              med spa team — not a lecture hall. Come for tacos, stay for the tech (and the raffles).
            </p>
          </div>
        </section>

        <section className="py-14 px-6 bg-black/[0.02]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10">What we&apos;re showcasing</h2>
            <ul className="space-y-4">
              {VIP_DEVICE_NIGHT.highlights.map((line) => (
                <li key={line} className="flex gap-3 text-black/85">
                  <span className="text-[#E6007E] font-bold flex-shrink-0">✦</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 px-6">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border-2 border-[#E6007E]/30 bg-gradient-to-br from-[#E6007E]/[0.06] to-white p-8">
              <h3 className="text-xl font-bold font-serif text-[#E6007E]">{VIP_DEVICE_NIGHT.botoxEvent.label}</h3>
              <p className="mt-3 text-3xl font-bold">{VIP_DEVICE_NIGHT.botoxEvent.pricePerUnitDisplay}</p>
              <p className="mt-4 text-sm text-black/65 leading-relaxed">{VIP_DEVICE_NIGHT.botoxEvent.footnote}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold font-serif">VIP packages &amp; raffles</h3>
              <p className="mt-3 text-black/75 text-sm leading-relaxed">
                Special packages for Solaria, Morpheus8, Quantum RF, and combo plans — sold the night of the event. Raffle
                prizes and bonus entries for guests who book consults or purchase packages (details at check-in).
              </p>
            </div>
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
            Educational and promotional event hosted by {SITE.name}. Nothing on this page is a guarantee of results.
            All treatments require evaluation; contraindications may apply. Alcohol does not mix with some medications —
            ask your clinician. Raffle and promotional rules available at the event.
          </p>
          <Link href="/" className="inline-block mt-6 text-[#E6007E] font-semibold hover:underline">
            ← Back to Hello Gorgeous
          </Link>
        </section>
      </main>
    </>
  );
}
