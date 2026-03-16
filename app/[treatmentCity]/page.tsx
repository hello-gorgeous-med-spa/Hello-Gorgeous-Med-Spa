import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/seo";
import { CITIES, DEVICES, getCityDeviceSlug } from "@/data/city-seo";

export async function generateStaticParams() {
  const params: { treatmentCity: string }[] = [];
  for (const city of CITIES) {
    for (const device of DEVICES) {
      params.push({ treatmentCity: getCityDeviceSlug(city, device) });
    }
  }
  return params;
}

function parseSlug(slug: string) {
  for (const city of CITIES) {
    for (const device of DEVICES) {
      if (getCityDeviceSlug(city, device) === slug) {
        return { city, device };
      }
    }
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ treatmentCity: string }> }): Promise<Metadata> {
  const { treatmentCity } = await params;
  const parsed = parseSlug(treatmentCity);
  if (!parsed) return { title: "Not Found" };
  const { city, device } = parsed;

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
    alternates: { canonical: `${SITE.url}/${treatmentCity}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE.url}/${treatmentCity}`,
      siteName: SITE.name,
    },
  };
}

export default async function CityDevicePage({ params }: { params: Promise<{ treatmentCity: string }> }) {
  const { treatmentCity } = await params;
  const parsed = parseSlug(treatmentCity);
  if (!parsed) notFound();
  const { city, device } = parsed;

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
        {/* Hero */}
        <section className="bg-black text-white py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6">
            <p style={{ color: device.accentColor }} className="text-sm font-semibold uppercase tracking-widest mb-4">
              Now Serving {city.name}, Illinois
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-serif">
              {device.shortName}
              <br />
              <span style={{ color: device.accentColor }}>Near {city.name}, IL</span>
            </h1>
            <p className="text-xl text-white/80 mb-4 max-w-2xl">
              {device.description}
            </p>
            <p className="text-lg text-white/60 mb-8">
              {city.nearbyNote} from Hello Gorgeous Med Spa in Oswego. NP on site 7 days a week with same-day consultations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                style={{ backgroundColor: device.accentColor }}
                className="inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-lg text-lg transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Book Free Consultation
              </Link>
              <a
                href="tel:6306366193"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg text-lg transition-all"
              >
                📞 630-636-6193
              </a>
            </div>
          </div>
        </section>

        {/* Why travel from City */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-serif">
              {city.name} Residents: Advanced Technology Is {city.driveTime} Away
            </h2>
            <p className="text-black/70 text-lg mb-6">
              You don&apos;t need to drive to Chicago for the most advanced aesthetic technology. Hello Gorgeous Med Spa in
              Oswego is just <strong>{city.driveTime} from {city.name}</strong> — and we have technology that no other
              provider in the western suburbs carries.
            </p>
            <div className="p-6 rounded-2xl border-2 border-black/10 bg-black/[0.02]">
              <p className="text-black/80 font-semibold mb-2">What makes us different:</p>
              <p className="text-black/70">{device.uniqueAdvantage}</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Why Choose <span style={{ color: device.accentColor }}>{device.shortName}</span>?
            </h2>
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

        {/* Conditions */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 font-serif">
              What {device.shortName} Treats
            </h2>
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

        {/* NP on site */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              NP on Site <span style={{ color: device.accentColor }}>7 Days a Week</span>
            </h2>
            <div className="prose prose-lg prose-invert max-w-none text-white/80 space-y-4">
              <p>
                Hello Gorgeous has a board-certified Family Nurse Practitioner (FNP-BC) on site every day of the week.
                That means:
              </p>
              <ul className="space-y-2">
                <li><strong>Same-day medical consultations</strong> — no waiting weeks</li>
                <li><strong>Same-day prescriptions</strong> — antivirals for laser, hormones, weight loss medications</li>
                <li><strong>Clinical oversight on every treatment</strong> — not a remote medical director</li>
                <li><strong>Continuity of care</strong> — same providers, every visit</li>
              </ul>
              <p>
                This isn&apos;t a chain med spa with rotating injectors. This is your medical team — Danielle and Ryan — who
                know your history, your goals, and your treatment plan.
              </p>
            </div>
          </div>
        </section>

        {/* The Trifecta */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-black via-[#0a0510] to-black text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">
              Exclusive to Hello Gorgeous
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              The InMode Trifecta
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
              Three Class 4 medical devices. $500K+ investment. No other med spa in the western suburbs has all three.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {DEVICES.map((d) => (
                <Link
                  key={d.slug}
                  href={d.detailsPage}
                  className="block p-6 rounded-2xl border transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: d.slug === device.slug ? d.accentColor : 'rgba(255,255,255,0.1)',
                    background: d.slug === device.slug ? `${d.accentColor}15` : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div style={{ color: d.accentColor }} className="text-sm font-bold uppercase tracking-wider mb-2">
                    {d.slug === device.slug ? "You're viewing" : "Also available"}
                  </div>
                  <div className="text-white font-bold text-lg mb-1">{d.shortName}</div>
                  <div className="text-white/50 text-sm">{d.tagline}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              {city.name} — Your {device.shortName}
              <br />
              <span style={{ color: device.accentColor }}>Consultation Is Free</span>
            </h2>
            <p className="text-white/60 text-lg mb-4">
              {city.nearbyNote} from Hello Gorgeous Med Spa in Oswego.
            </p>
            <p className="text-white/40 text-sm mb-10">
              Open 7 days a week. Same-day appointments available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                href="/book"
                style={{ backgroundColor: device.accentColor }}
                className="inline-flex items-center justify-center px-10 py-4 text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg"
              >
                Book Free Consultation
              </Link>
              <a
                href="tel:6306366193"
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full text-lg transition-all"
              >
                📞 630-636-6193
              </a>
            </div>

            {/* Other cities */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-white/30 text-sm mb-4">Also serving:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${getCityDeviceSlug(c, device)}`}
                    className="px-4 py-2 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors"
                  >
                    {device.shortName} in {c.name}
                  </Link>
                ))}
                <Link
                  href={device.detailsPage}
                  className="px-4 py-2 rounded-full border text-sm transition-colors"
                  style={{ borderColor: `${device.accentColor}40`, color: device.accentColor }}
                >
                  Full {device.shortName} Details
                </Link>
              </div>
            </div>

            {/* Other devices for this city */}
            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-3">
                {otherDevices.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${getCityDeviceSlug(city, d)}`}
                    className="px-4 py-2 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors"
                  >
                    {d.shortName} in {city.name}
                  </Link>
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
