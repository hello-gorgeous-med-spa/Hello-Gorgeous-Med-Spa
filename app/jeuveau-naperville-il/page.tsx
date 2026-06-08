import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Jeuveau (#Newtox) near Naperville Naperville, IL | Hello Gorgeous Med Spa',
  description: 'Jeuveau (#Newtox) near Naperville Naperville, IL at Hello Gorgeous Med Spa — 15 minutes from Naperville. FDA-approved, made exclusively for cosmetic use. Licensed NPs, free consultations.',
  keywords: ['jeuveau naperville il','jeuveau near naperville','newtox naperville il','jeuveau vs botox naperville','jeuveau injections naperville','prabotulinumtoxina naperville','cosmetic neurotoxin naperville il'],
  alternates: { canonical: `${SITE.url}/jeuveau-naperville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/jeuveau-naperville-il`, title: 'Jeuveau (#Newtox) near Naperville Naperville, IL | Hello Gorgeous', description: 'Jeuveau — the newest FDA-approved neurotoxin, made exclusively for cosmetic use. 15 minutes from Naperville.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get Jeuveau near Naperville Naperville, IL?', answer: 'Hello Gorgeous Med Spa offers Jeuveau (#Newtox) 15 minutes from Naperville. 15 minutes from Naperville via Route 34. Our licensed NPs administer Jeuveau for glabellar lines (11s), forehead wrinkles, crow\'s feet, and more.' },
  { question: 'What is Jeuveau and how is it different from Botox near Naperville?', answer: 'Jeuveau (prabotulinumtoxinA) is the first neurotoxin FDA-approved exclusively for cosmetic — not medical — use. It uses Hi-Pure manufacturing technology. Clinical trials showed comparable results to Botox, and many injectors love its consistent, predictable outcomes.' },
  { question: 'Is Jeuveau the same as #Newtox?', answer: 'Yes — #Newtox is the brand nickname for Jeuveau, coined because it\'s the newest FDA-approved botulinum toxin type A on the market. It\'s manufactured by Evolus and was approved in 2019.' },
  { question: 'How long does Jeuveau last near Naperville?', answer: 'Jeuveau typically lasts 3–4 months. Results vary based on dosage, treatment area, and individual metabolism.' },
  { question: 'Who is a good candidate for Jeuveau near Naperville?', answer: 'Jeuveau is ideal for adults looking for a modern, cosmetics-focused neurotoxin. It\'s particularly popular with clients who want an alternative to Botox and those who appreciate the latest in FDA-approved aesthetic treatments.' },
];
export default function JeuveauNapervillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Jeuveau near Naperville Naperville', url: `${SITE.url}/jeuveau-naperville-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">✨ #Newtox · 15 minutes from Naperville · Licensed NPs</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Jeuveau near Naperville Naperville, IL</span> — The Newest FDA-Approved Neurotoxin
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Jeuveau (#Newtox) is FDA-approved <strong className="text-white">exclusively for cosmetic use</strong> — the only neurotoxin made solely with aesthetics in mind. <strong className="text-white">15 minutes from Naperville</strong> at Hello Gorgeous Med Spa in Oswego, IL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ FDA Approved</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Cosmetic-Only Formula</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Hi-Pure Technology</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> · 15 minutes from Naperville via Route 34. · Also offering: <Link href="/botox-vs-dysport-vs-jeuveau" className="text-[#FF2D8E] underline">Botox · Dysport · Xeomin →</Link></p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Jeuveau near Naperville Naperville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="botox" serviceLabel={"Jeuveau near Naperville Naperville"} heading={"Neurotoxin clients near Naperville love Hello Gorgeous"} intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Jeuveau — 15 minutes from Naperville</h2>
            <p className="text-xl text-gray-300 mb-8">#Newtox · FDA Approved · Free Consultations · Open 7 Days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
