import Image from "next/image";
import Link from "next/link";
import type { TreatmentSeoConfig } from "@/lib/gap-treatment-seo-content";
import { SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export function treatmentSeoMetadata(config: TreatmentSeoConfig) {
  return pageMetadata({
    title: config.metaTitle,
    description: config.metaDescription,
    path: config.pagePath,
  });
}

export function TreatmentSeoLanding({ config }: { config: TreatmentSeoConfig }) {
  const pageUrl = `${SITE.url}${config.pagePath}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: config.h1Lead, url: pageUrl },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(config.faqs, pageUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: config.procedureName,
            alternateName: config.alternateNames,
            procedureType: "https://schema.org/NoninvasiveProcedure",
            description: config.metaDescription,
            performer: { "@type": "MedicalBusiness", name: SITE.name, url: SITE.url },
            areaServed: SITE.serviceAreas?.map((a) => ({ "@type": "Place", name: a })),
          }),
        }}
      />

      <section className="relative bg-black text-white overflow-hidden border-b-4 border-black">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(80% 50% at 90% 0%, rgba(230,0,126,0.35) 0%, transparent 60%), radial-gradient(60% 50% at 10% 100%, rgba(255,45,142,0.25) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              {config.badge ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
                  <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" />
                  {config.badge}
                </span>
              ) : null}
              <p className="text-[#FFB8DC] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3">
                {config.localityLine}
              </p>
              <h1 className="text-4xl md:text-5xl font-black leading-[1.05] mb-5">
                {config.h1Lead}
                <br />
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  {config.h1Accent}
                </span>
              </h1>
              <p className="text-xl text-white/95 max-w-xl mb-3 font-semibold">{config.heroSub}</p>
              <p className="text-base text-white/80 max-w-xl mb-8">{config.heroBody}</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/book?service=${config.bookQuery}`}
                  className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
                >
                  Book Free Consultation →
                </Link>
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
                >
                  Call {SITE.phone}
                </a>
              </div>
              <p className="mt-6 text-sm text-white/60">{config.priceFrom}</p>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <Image
                src={config.heroImage}
                alt={config.heroImageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-black text-center mb-10">
            What we treat in <span className="text-[#E6007E]">Oswego, IL</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {config.treats.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-black text-[#E6007E] mb-1">{item.title}</h3>
                <p className="text-sm text-black/75">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#FFF0F7] to-white border-b-4 border-black">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-black mb-6 text-center">Why Hello Gorgeous</h2>
          <ul className="space-y-4">
            {config.whyUs.map((line) => (
              <li key={line} className="flex gap-3 text-black/85 font-medium">
                <span className="text-[#E6007E] font-bold">✓</span>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {config.relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border-2 border-black px-4 py-2 text-sm font-bold text-[#E6007E] hover:bg-[#FFF0F7]"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-black mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {config.faqs.map((faq) => (
              <div key={faq.question} className="border-b border-black/10 pb-6">
                <h3 className="font-bold text-[#E6007E] mb-2">{faq.question}</h3>
                <p className="text-black/80 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
