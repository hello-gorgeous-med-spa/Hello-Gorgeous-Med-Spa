import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Dysport near Joliet Joliet, IL | Fast-Acting Neurotoxin | Hello Gorgeous Med Spa',
  description: 'Dysport near Joliet Joliet, IL at Hello Gorgeous Med Spa — 20 minutes from Joliet. FDA-approved, fast-acting (1–3 days). Licensed NPs, free consultations. Same-day appointments available.',
  keywords: ['dysport joliet il','dysport near joliet','dysport vs botox joliet','dysport injections joliet il','dysport clinic joliet','fast botox joliet il','abobotulinumtoxina joliet'],
  alternates: { canonical: `${SITE.url}/dysport-joliet-il` },
  openGraph: { type: 'website', url: `${SITE.url}/dysport-joliet-il`, title: 'Dysport near Joliet Joliet, IL | Hello Gorgeous Med Spa', description: 'Fast-acting Dysport 20 minutes from Joliet. FDA-approved, licensed NPs, free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get Dysport near Joliet Joliet, IL?', answer: 'Hello Gorgeous Med Spa offers Dysport 20 minutes from Joliet. 20 minutes from Joliet via I-80 to Route 34. Our licensed nurse practitioners administer Dysport for forehead lines, glabellar lines (11s), crow\'s feet, and more.' },
  { question: 'How is Dysport different from Botox near Joliet?', answer: 'Dysport (abobotulinumtoxinA) tends to kick in faster — often 1–3 days vs. 3–7 for Botox. It also diffuses more, making it excellent for larger areas like the forehead. Many clients prefer Dysport for its natural, soft movement.' },
  { question: 'How much does Dysport cost near Joliet?', answer: 'Dysport is priced per unit. Because it requires roughly 2.5–3 units to equal one Botox unit, we\'ll quote your total based on your areas at your free consultation. Overall treatment cost is typically comparable to Botox.' },
  { question: 'How long does Dysport last?', answer: 'Dysport typically lasts 3–5 months — often slightly longer than Botox for some clients. Results vary based on metabolism, dosage, and treatment area.' },
  { question: 'Is Dysport safe?', answer: 'Yes — Dysport is FDA-approved and has a long safety record. All injections at Hello Gorgeous are performed by licensed nurse practitioners with full prescriptive authority and advanced injection training.' },
];
export default function DysportJolietPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Dysport near Joliet Joliet', url: `${SITE.url}/dysport-joliet-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Joliet')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">⚡ Fast-Acting · 20 minutes from Joliet · Licensed NPs</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Dysport near Joliet Joliet, IL</span> — Results in 1–3 Days
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Dysport is the <strong className="text-white">fastest-acting FDA-approved neurotoxin</strong> — many clients see results in just 1–3 days. Ideal for forehead lines, 11s, and crow\'s feet. Available <strong className="text-white">20 minutes from Joliet</strong> at Hello Gorgeous Med Spa in Oswego.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ FDA Approved</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Results in 1–3 Days</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Lasts 3–5 Months</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> · 20 minutes from Joliet via I-80 to Route 34. · Also offering: <Link href="/botox-vs-dysport-vs-jeuveau" className="text-[#FF2D8E] underline">Botox · Jeuveau · Xeomin →</Link></p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Dysport near Joliet Joliet — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="botox" serviceLabel={"Dysport near Joliet Joliet"} heading={"Neurotoxin clients near Joliet love Hello Gorgeous"} intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Dysport — 20 minutes from Joliet</h2>
            <p className="text-xl text-gray-300 mb-8">Results in 1–3 days · Lasts 3–5 months · Free consultations · Open 7 days</p>
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
