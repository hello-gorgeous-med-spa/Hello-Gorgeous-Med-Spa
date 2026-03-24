import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/seo";
import { CTA } from "@/components/CTA";
import { ContentWithLinks } from "@/components/ContentWithLinks";
import { GeoContextBlock } from "@/components/GeoContextBlock";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import {
  GBP_SERVICE_SLUGS,
  GBP_SLUG_TO_SERVICE,
  MED_SPA_LOCATION_SLUGS,
  MED_SPA_SLUG_TO_CITY,
} from "@/lib/gbp-urls";
import { LOCATION_PAGE_CONTENT } from "@/lib/local-seo-content";
import {
  SERVICES,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  serviceHrefBySlug,
  serviceJsonLd,
  serviceLocationJsonLd,
  servicePublicPath,
  siteJsonLd,
} from "@/lib/seo";
import { CITIES, DEVICES, getCityDeviceSlug } from "@/data/city-seo";

const ALL_LOCAL_SLUGS = [...GBP_SERVICE_SLUGS, ...MED_SPA_LOCATION_SLUGS];

function parseTreatmentCitySlug(slug: string) {
  for (const city of CITIES) {
    for (const device of DEVICES) {
      if (getCityDeviceSlug(city, device) === slug) return { city, device };
    }
  }
  return null;
}

export function generateStaticParams() {
  const localParams = ALL_LOCAL_SLUGS.map((slug) => ({ slug }));
  const cityParams: { slug: string }[] = [];
  for (const city of CITIES) {
    for (const device of DEVICES) {
      cityParams.push({ slug: getCityDeviceSlug(city, device) });
    }
  }
  return [...localParams, ...cityParams];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const treatmentParsed = parseTreatmentCitySlug(slug);
  if (treatmentParsed) {
    const { city, device } = treatmentParsed;
    const title = `${device.shortName} in ${city.name}, IL | Hello Gorgeous Med Spa`;
    const description = `${device.shortName} ${device.tagline.toLowerCase()} now available near ${city.name}, IL. ${city.nearbyNote} from Hello Gorgeous Med Spa in Oswego. NP on site 7 days. Book free consultation.`;
    return {
      title,
      description,
      keywords: [
        `${device.shortName} ${city.name}`,
        `${device.shortName} ${city.name} IL`,
        `${device.shortName} near me`,
        `skin tightening ${city.name} IL`,
        `med spa ${city.name}`,
        `best med spa near ${city.name}`,
      ],
      alternates: { canonical: `${SITE.url}/${slug}` },
      openGraph: { type: "website", title, description, url: `${SITE.url}/${slug}`, siteName: SITE.name },
    };
  }

  if (GBP_SLUG_TO_SERVICE[slug]) {
    const { serviceSlug, cityLabel } = GBP_SLUG_TO_SERVICE[slug];
    const s = SERVICES.find((x) => x.slug === serviceSlug);
    if (!s) return pageMetadata({ title: "Service", description: "Service.", path: `/${slug}` });
    return pageMetadata({
      title: `${s.name} in ${cityLabel} | Hello Gorgeous Med Spa`,
      description: `${s.heroTitle} — ${s.short} Book a consultation at Hello Gorgeous Med Spa. Serving Oswego, Naperville, Aurora, Plainfield.`,
      path: `/${slug}`,
    });
  }

  if (MED_SPA_SLUG_TO_CITY[slug]) {
    const { cityLabel } = MED_SPA_SLUG_TO_CITY[slug];
    return pageMetadata({
      title: `Med Spa in ${cityLabel} | Hello Gorgeous`,
      description: `Luxury med spa serving ${cityLabel}. Botox, fillers, weight loss, hormone therapy, microneedling, IV therapy. Book your consultation.`,
      path: `/${slug}`,
    });
  }

  return { title: "Not Found" };
}

const CONTEXTUAL_LINKS: Record<string, string> = {
  "Weight Loss in Oswego": "/weight-loss-oswego-il",
  "PRF Hair Restoration in Oswego": "/prf-hair-restoration-oswego-il",
  "Hormone Therapy in Oswego": "/hormone-therapy-oswego-il",
  "Botox in Oswego": "/botox-oswego-il",
};

const TREATMENT_FAQ_TEMPLATES: Record<string, { howLong?: string; cost?: string; isSafe?: string }> = {
  "botox-dysport-jeuveau": { howLong: "Most clients see results for about 3–4 months.", cost: "Botox starts at $10/unit for new clients. We'll provide clear pricing at your consultation.", isSafe: "Yes. Botox is FDA-approved. Our injectors use precise dosing for natural results." },
  "weight-loss-therapy": { howLong: "Many clients see noticeable changes within the first few months.", cost: "Pricing depends on your plan. We'll outline costs during your consultation.", isSafe: "Yes. Our programs are medically supervised with lab monitoring." },
  "prf-prp": { howLong: "Many protocols recommend a series. Results can be gradual over weeks to months.", cost: "PRF/PRP pricing varies by treatment area. We'll provide clear pricing at your consultation.", isSafe: "Yes. PRF and PRP use your own blood-derived components." },
  "biote-hormone-therapy": { howLong: "Some notice improvements within weeks.", cost: "Costs depend on protocol and labs. We'll outline at your consultation.", isSafe: "Yes. BioTE is administered by licensed providers with lab monitoring." },
  "lip-filler": { howLong: "Often 6–12+ months depending on product.", cost: "Lip filler pricing depends on product and volume.", isSafe: "Yes. Lip fillers are FDA-approved. Our injectors use conservative dosing." },
};

function localFaqs(serviceName: string, cityLabel: string, serviceSlug: string): Array<{ question: string; answer: string }> {
  const t = TREATMENT_FAQ_TEMPLATES[serviceSlug] || {};
  const items: Array<{ question: string; answer: string }> = [
    {
      question: `Do you offer ${serviceName} in ${cityLabel}?`,
      answer:
        "Yes—Hello Gorgeous Med Spa is located in Oswego, IL and serves clients from the surrounding area including Naperville, Aurora, Plainfield, and Yorkville. We offer consultations to determine the best plan for your goals.",
    },
  ];
  if (t.howLong) items.push({ question: `How long does ${serviceName} last?`, answer: t.howLong });
  if (t.cost) items.push({ question: `How much does ${serviceName} cost in Oswego?`, answer: t.cost });
  if (t.isSafe) items.push({ question: `Is ${serviceName} safe?`, answer: t.isSafe });
  items.push(
    { question: "Do I need a consultation first?", answer: "We recommend starting with a consultation so we can confirm candidacy, set expectations, and build a safe plan." },
    { question: "How do I book?", answer: "Use our Book page to schedule. If you have questions first, contact us or use the expert chat for general education." },
  );
  return items;
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const treatmentParsed = parseTreatmentCitySlug(slug);
  if (treatmentParsed) {
    const { city, device } = treatmentParsed;
    const otherDevices = DEVICES.filter((d) => d.slug !== device.slug);
    const otherCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 3);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalProcedure",
              name: device.name,
              description: device.description,
              provider: {
                "@type": "MedicalBusiness",
                name: SITE.name,
                telephone: SITE.phone,
                url: SITE.url,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: SITE.address.streetAddress,
                  addressLocality: SITE.address.addressLocality,
                  addressRegion: SITE.address.addressRegion,
                  postalCode: SITE.address.postalCode,
                },
                areaServed: { "@type": "City", name: city.name },
              },
            }),
          }}
        />
        <main className="bg-white">
          <section className="bg-black text-white py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-6">
              <p style={{ color: device.accentColor }} className="text-sm font-semibold uppercase tracking-widest mb-4">Now Serving {city.name}, Illinois</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-serif">
                {device.shortName}
                <br />
                <span style={{ color: device.accentColor }}>Near {city.name}, IL</span>
              </h1>
              <p className="text-xl text-white/80 mb-4 max-w-2xl">{device.description}</p>
              <p className="text-lg text-white/60 mb-8">{city.nearbyNote} from Hello Gorgeous Med Spa in Oswego. NP on site 7 days a week with same-day consultations.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book" style={{ backgroundColor: device.accentColor }} className="inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-lg text-lg transition-all hover:-translate-y-0.5 shadow-lg">Book Free Consultation</Link>
                <a href="tel:6306366193" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg text-lg transition-all">📞 630-636-6193</a>
              </div>
            </div>
          </section>
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-serif">{city.name} Residents: Advanced Technology Is {city.driveTime} Away</h2>
              <p className="text-black/70 text-lg mb-6">You don&apos;t need to drive to Chicago for the most advanced aesthetic technology. Hello Gorgeous Med Spa in Oswego is just <strong>{city.driveTime} from {city.name}</strong> — and we have technology that no other provider in the western suburbs carries.</p>
              <div className="p-6 rounded-2xl border-2 border-black/10 bg-black/[0.02]">
                <p className="text-black/80 font-semibold mb-2">What makes us different:</p>
                <p className="text-black/70">{device.uniqueAdvantage}</p>
              </div>
            </div>
          </section>
          <section className="py-16 md:py-20 bg-black text-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Why Choose <span style={{ color: device.accentColor }}>{device.shortName}</span>?</h2>
              <p className="text-white/60 text-lg mb-10">{device.tagline}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {device.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3 p-4 rounded-xl" style={{ border: `1px solid ${device.accentColor}30`, background: `${device.accentColor}08` }}>
                    <span style={{ color: device.accentColor }} className="text-lg mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-white/90">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 font-serif">What {device.shortName} Treats</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {device.conditions.map((c) => (
                  <div key={c} className="flex items-center gap-3 p-4 rounded-xl border border-black/10">
                    <span style={{ color: device.accentColor }} className="text-lg flex-shrink-0">•</span>
                    <span className="text-black/80">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 md:py-20 bg-black text-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">NP on Site <span style={{ color: device.accentColor }}>7 Days a Week</span></h2>
              <div className="prose prose-lg prose-invert max-w-none text-white/80 space-y-4">
                <p>Hello Gorgeous has a board-certified Family Nurse Practitioner (FNP-BC) on site every day of the week. That means:</p>
                <ul className="space-y-2">
                  <li><strong>Same-day medical consultations</strong> — no waiting weeks</li>
                  <li><strong>Same-day prescriptions</strong> — antivirals for laser, hormones, weight loss medications</li>
                  <li><strong>Clinical oversight on every treatment</strong> — not a remote medical director</li>
                  <li><strong>Continuity of care</strong> — same providers, every visit</li>
                </ul>
                <p>This isn&apos;t a chain med spa with rotating injectors. This is your medical team — Danielle and Ryan — who know your history, your goals, and your treatment plan.</p>
              </div>
            </div>
          </section>
          <section className="py-16 md:py-20 bg-gradient-to-b from-black via-[#0a0510] to-black text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">Exclusive to Hello Gorgeous</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">The InMode Trifecta</h2>
              <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">Three Class 4 medical devices. $500K+ investment. No other med spa in the western suburbs has all three.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {DEVICES.map((d) => (
                  <Link key={d.slug} href={d.detailsPage} className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]" style={{ borderColor: d.slug === device.slug ? d.accentColor : "rgba(255,255,255,0.1)", background: d.slug === device.slug ? `${d.accentColor}15` : "rgba(255,255,255,0.03)" }}>
                    <div style={{ color: d.accentColor }} className="text-sm font-bold uppercase tracking-wider mb-2">{d.slug === device.slug ? "You're viewing" : "Also available"}</div>
                    <div className="text-white font-bold text-lg mb-1">{d.shortName}</div>
                    <div className="text-white/50 text-sm">{d.tagline}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 md:py-24 bg-black text-white">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">{city.name} — Your {device.shortName}<br /><span style={{ color: device.accentColor }}>Consultation Is Free</span></h2>
              <p className="text-white/60 text-lg mb-4">{city.nearbyNote} from Hello Gorgeous Med Spa in Oswego.</p>
              <p className="text-white/40 text-sm mb-10">Open 7 days a week. Same-day appointments available.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link href="/book" style={{ backgroundColor: device.accentColor }} className="inline-flex items-center justify-center px-10 py-4 text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg">Book Free Consultation</Link>
                <a href="tel:6306366193" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full text-lg transition-all">📞 630-636-6193</a>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-white/30 text-sm mb-4">Also serving:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {otherCities.map((c) => (
                    <Link key={c.slug} href={`/${getCityDeviceSlug(c, device)}`} className="px-4 py-2 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors">{device.shortName} in {c.name}</Link>
                  ))}
                  <Link href={device.detailsPage} className="px-4 py-2 rounded-full border text-sm transition-colors" style={{ borderColor: `${device.accentColor}40`, color: device.accentColor }}>Full {device.shortName} Details</Link>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex flex-wrap justify-center gap-3">
                  {otherDevices.map((d) => (
                    <Link key={d.slug} href={`/${getCityDeviceSlug(city, d)}`} className="px-4 py-2 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors">{d.shortName} in {city.name}</Link>
                  ))}
                </div>
              </div>
              <div className="text-white/40 space-y-1 text-sm mt-10">
                <p className="font-semibold text-white/60">Hello Gorgeous Med Spa</p>
                <p>74 W Washington Street, Oswego, IL 60543</p>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (GBP_SLUG_TO_SERVICE[slug]) {
    const { serviceSlug, cityLabel } = GBP_SLUG_TO_SERVICE[slug];
    const s = SERVICES.find((x) => x.slug === serviceSlug);
    if (!s) notFound();
    const faqs = localFaqs(s.name, cityLabel, serviceSlug);
    const cityShort = cityLabel.replace(", IL", "");
    const breadcrumbs = [{ name: "Home", url: SITE.url }, { name: s.name, url: `${SITE.url}/${slug}` }];

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(s)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLocationJsonLd(s.name, cityLabel)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
        <Section className="relative bg-white">
          <div className="absolute inset-0 bg-white" />
          <div className="relative z-10">
            <FadeUp>
              <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">{cityLabel.toUpperCase()}</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">{s.name}</span> in {cityShort}, IL</h1>
              <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">{LOCATION_PAGE_CONTENT[slug]?.intro ?? s.heroSubtitle}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient">Book a Consultation</CTA>
                <CTA href={servicePublicPath(s)} variant="outline">Full service details</CTA>
                <CTA href="/contact" variant="outline">Contact Us</CTA>
              </div>
              <p className="mt-6 text-sm text-black/70">{SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode} · {SITE.phone}</p>
            </FadeUp>
          </div>
        </Section>
        <Section>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FadeUp>
                <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">Why choose Hello Gorgeous for {s.name} in {cityShort}?</h2>
                <p className="mt-4 text-black max-w-2xl">{LOCATION_PAGE_CONTENT[slug]?.aboutTreatment ? <ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.aboutTreatment} links={CONTEXTUAL_LINKS} /> : `We serve ${cityLabel} and the surrounding area from our Oswego location. Our clinical-first approach means personalized plans, clear expectations, and results you'll love.`}</p>
              </FadeUp>
              {LOCATION_PAGE_CONTENT[slug]?.aboutTreatment ? (
                <>
                  <FadeUp delayMs={40}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Who Is a Good Candidate for {s.name}?</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.candidacy} links={CONTEXTUAL_LINKS} /></p></FadeUp>
                  <FadeUp delayMs={80}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">What to Expect During Your {s.name} Appointment</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.whatToExpect} links={CONTEXTUAL_LINKS} /></p></FadeUp>
                  <FadeUp delayMs={120}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Is {s.name} Safe?</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.safetyAndTraining} links={CONTEXTUAL_LINKS} /></p></FadeUp>
                  <FadeUp delayMs={160}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">{s.name} for Kendall County Clients</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.communityContext} links={CONTEXTUAL_LINKS} /></p></FadeUp>
                  <FadeUp delayMs={200}>
                    <div className="mt-10 rounded-2xl border-2 border-black bg-white p-6">
                      <p className="text-black leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.callToAction} links={CONTEXTUAL_LINKS} /></p>
                      <div className="mt-6 flex flex-col sm:flex-row gap-4"><CTA href={BOOKING_URL} variant="white">Book a Consultation</CTA><CTA href={servicePublicPath(s)} variant="outline">View full {s.name} page</CTA><CTA href="/providers" variant="outline">Meet the Experts</CTA></div>
                    </div>
                  </FadeUp>
                </>
              ) : (
                <>
                  <div className="mt-10 grid gap-4">
                    {[{ t: "Consult-first", b: "We confirm candidacy, review goals, and build a plan designed around your outcomes and safety." }, { t: "Premium, not pushy", b: "A luxury experience with a clinical mindset—clear timelines and expectations." }, { t: `Serving ${cityShort} & the area`, b: "Convenient to Oswego, Naperville, Aurora, Plainfield, and Yorkville with flexible scheduling." }].map((x, idx) => (
                      <FadeUp key={x.t} delayMs={40 * idx}><div className="rounded-2xl border-2 border-black bg-white p-6"><h3 className="text-xl font-bold text-[#FF2D8E]">{x.t}</h3><p className="mt-3 text-black">{x.b}</p></div></FadeUp>
                    ))}
                  </div>
                  {LOCATION_PAGE_CONTENT[slug]?.whatToExpect && <FadeUp delayMs={120}><h2 className="mt-12 text-2xl font-bold text-[#FF2D8E]">What to expect in {cityShort}</h2><p className="mt-4 text-black max-w-2xl leading-relaxed">{LOCATION_PAGE_CONTENT[slug]?.whatToExpect}</p></FadeUp>}
                  <FadeUp delayMs={160}>
                    <div className="mt-10 rounded-2xl border-2 border-black bg-white p-6">
                      <h3 className="text-xl font-bold text-[#FF2D8E]">More about {s.name}</h3>
                      <p className="mt-3 text-black">{LOCATION_PAGE_CONTENT[slug]?.communityContext ?? LOCATION_PAGE_CONTENT[slug]?.community ?? "Read the full service overview, FAQs, and what to expect on our main service page."}</p>
                      <div className="mt-6 flex flex-col sm:flex-row gap-4"><CTA href={servicePublicPath(s)} variant="white">View full {s.name} page</CTA><CTA href="/providers" variant="outline">Meet the Experts</CTA></div>
                    </div>
                  </FadeUp>
                </>
              )}
            </div>
            <div className="lg:col-span-5"><FadeUp delayMs={120}><ServiceExpertWidget serviceName={s.name} slug={s.slug} category={s.category} /></FadeUp></div>
          </div>
        </Section>
        <Section>
          <FadeUp><h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">Frequently asked questions</h2><p className="mt-4 text-black max-w-2xl">Common questions about {s.name} in {cityLabel}.</p></FadeUp>
          <div className="mt-10 grid gap-4">
            {faqs.map((f, idx) => (
              <FadeUp key={f.question} delayMs={40 * idx}>
                <details className="group rounded-2xl border-2 border-black bg-white p-6"><summary className="cursor-pointer list-none text-lg font-semibold text-black flex items-center justify-between"><span>{f.question}</span><span className="text-black/60 group-open:rotate-45 transition-transform">+</span></summary><p className="mt-4 text-black">{f.answer}</p></details>
              </FadeUp>
            ))}
          </div>
          <div className="mt-12 text-center">
            <GeoContextBlock city={cityShort.toLowerCase().includes("naperville") ? "naperville" : cityShort.toLowerCase().includes("plainfield") ? "plainfield" : cityShort.toLowerCase().includes("aurora") ? "aurora" : "oswego"} className="mb-8" />
            <CTA href={BOOKING_URL} variant="white" className="group inline-flex">Book Now<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform ml-1 w-5 h-5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></CTA>
            <p className="text-sm text-black mt-8"><Link className="underline hover:text-[#FF2D8E]" href="/contact">Contact us</Link> with questions.</p>
          </div>
        </Section>
      </>
    );
  }

  if (MED_SPA_SLUG_TO_CITY[slug]) {
    const { cityLabel, hubPath } = MED_SPA_SLUG_TO_CITY[slug];
    const cityShort = cityLabel.replace(", IL", "");
    const medSpaBreadcrumbs = [{ name: "Home", url: SITE.url }, { name: `Med Spa ${cityShort}`, url: `${SITE.url}/${slug}` }];

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(medSpaBreadcrumbs)) }} />
        <Section className="relative bg-white">
          <div className="absolute inset-0 bg-white" />
          <div className="relative z-10">
            <FadeUp>
              <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">MED SPA NEAR YOU</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">Med Spa serving <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">{cityShort}</span></h1>
              <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">{LOCATION_PAGE_CONTENT[slug]?.intro ?? `Hello Gorgeous Med Spa is located in Oswego, IL and proudly serves ${cityLabel} and the surrounding area. Botox, dermal fillers, weight loss therapy, hormone optimization, microneedling, IV therapy, and more—all in a luxury, clinical-first setting.`}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient">Book a Consultation</CTA>
                <CTA href={hubPath} variant="outline">View {cityShort} services</CTA>
                <CTA href="/services" variant="outline">All Services</CTA>
              </div>
              <p className="mt-6 text-sm text-black/70">{SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode} · {SITE.phone}</p>
            </FadeUp>
          </div>
        </Section>
        <Section>
          <FadeUp><h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">Why Choose Our Med Spa in {cityShort}?</h2><p className="mt-4 text-black max-w-2xl leading-relaxed">{LOCATION_PAGE_CONTENT[slug]?.aboutTreatment ? <ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.aboutTreatment} links={CONTEXTUAL_LINKS} /> : "We offer a full range of medical aesthetics and wellness services."}</p></FadeUp>
          {LOCATION_PAGE_CONTENT[slug]?.aboutTreatment && (
            <>
              <FadeUp delayMs={40}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Who Is a Good Candidate for Our Med Spa?</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.candidacy} links={CONTEXTUAL_LINKS} /></p></FadeUp>
              <FadeUp delayMs={80}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">What to Expect at Our {cityShort} Med Spa</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.whatToExpect} links={CONTEXTUAL_LINKS} /></p></FadeUp>
              <FadeUp delayMs={120}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Safety and Training</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.safetyAndTraining} links={CONTEXTUAL_LINKS} /></p></FadeUp>
              <FadeUp delayMs={160}><h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Med Spa for Kendall County Clients</h2><p className="mt-4 text-black max-w-2xl leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.communityContext} links={CONTEXTUAL_LINKS} /></p></FadeUp>
              <FadeUp delayMs={200}><div className="mt-10 rounded-2xl border-2 border-black bg-white p-6"><p className="text-black leading-relaxed"><ContentWithLinks content={LOCATION_PAGE_CONTENT[slug]!.callToAction} links={CONTEXTUAL_LINKS} /></p></div></FadeUp>
            </>
          )}
          {(LOCATION_PAGE_CONTENT[slug]?.whatToExpect && !LOCATION_PAGE_CONTENT[slug]?.aboutTreatment) && <FadeUp><h2 className="mt-12 text-2xl font-bold text-[#FF2D8E]">What to expect at our {cityShort} med spa</h2><p className="mt-4 text-black max-w-2xl leading-relaxed">{LOCATION_PAGE_CONTENT[slug]?.whatToExpect}</p></FadeUp>}
          <h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Popular treatments for {cityShort} clients</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[{ name: "Botox, Dysport & Jeuveau", slug: "botox-dysport-jeuveau" }, { name: "Dermal Fillers", slug: "dermal-fillers" }, { name: "Lip Filler", slug: "lip-filler" }, { name: "Weight Loss Therapy", slug: "weight-loss-therapy" }, { name: "Hormone Therapy", slug: "biote-hormone-therapy" }, { name: "RF Microneedling", slug: "rf-microneedling" }, { name: "IV Therapy", slug: "iv-therapy" }].map((svc) => (
              <Link key={svc.slug} href={hubPath === "/locations" ? serviceHrefBySlug(svc.slug) : `${hubPath}/${svc.slug}`} className="block rounded-2xl border-2 border-black bg-white p-6 hover:border-[#FF2D8E] transition-colors"><h3 className="text-lg font-bold text-black">{svc.name}</h3><p className="mt-2 text-sm text-[#FF2D8E]">Learn more →</p></Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <GeoContextBlock city={slug.includes("naperville") ? "naperville" : slug.includes("plainfield") ? "plainfield" : slug.includes("aurora") ? "aurora" : "oswego"} className="mb-8" />
            <CTA href={BOOKING_URL} variant="white">Book Your Visit</CTA>
          </div>
        </Section>
      </>
    );
  }

  notFound();
}
