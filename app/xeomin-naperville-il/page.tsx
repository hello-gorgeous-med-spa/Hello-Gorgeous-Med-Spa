import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Xeomin (Naked Neurotoxin) near Naperville Naperville, IL | Hello Gorgeous Med Spa',
  description: 'Xeomin — the "naked neurotoxin" — near Naperville Naperville, IL at Hello Gorgeous Med Spa. No complexing proteins. FDA-approved. Ideal for clients with Botox resistance. Free consultations.',
  keywords: ['xeomin naperville il','xeomin near naperville','naked neurotoxin naperville','xeomin vs botox naperville','incobotulinumtoxina naperville il','botox resistance naperville il','pure botulinum toxin naperville'],
  alternates: { canonical: `${SITE.url}/xeomin-naperville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/xeomin-naperville-il`, title: 'Xeomin near Naperville Naperville, IL | Hello Gorgeous Med Spa', description: 'Xeomin — the "naked" neurotoxin with no complexing proteins. 15 minutes from Naperville. Free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get Xeomin near Naperville Naperville, IL?', answer: 'Hello Gorgeous Med Spa offers Xeomin 15 minutes from Naperville. 15 minutes from Naperville via Route 34. Our licensed NPs use Xeomin for forehead lines, glabellar lines, crow\'s feet, and clients who have developed resistance to other neurotoxins.' },
  { question: 'What makes Xeomin different from Botox near Naperville?', answer: 'Xeomin (incobotulinumtoxinA) is the only "naked" neurotoxin — it\'s formulated without complexing proteins found in Botox, Dysport, and Jeuveau. This may reduce the risk of antibody resistance over time, making it an excellent choice for long-term neurotoxin users.' },
  { question: 'What does "naked neurotoxin" mean?', answer: 'Most neurotoxins contain complexing proteins that surround the active botulinum toxin molecule. Xeomin strips those away, leaving only the pure active ingredient. This "naked" formulation may lower the chance your body builds antibodies that reduce effectiveness.' },
  { question: 'Is Xeomin good for people who feel Botox stopped working near Naperville?', answer: 'Yes — if you feel Botox has become less effective over years of use, switching to Xeomin is often recommended. The protein-free formula sidesteps the antibody resistance that can develop with protein-containing toxins.' },
  { question: 'How long does Xeomin last near Naperville?', answer: 'Xeomin typically lasts 3–4 months, similar to Botox. Results vary by dosage, area, and metabolism.' },
];
export default function XeominNapervillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Xeomin near Naperville Naperville', url: `${SITE.url}/xeomin-naperville-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">🧬 The Naked Neurotoxin · 15 minutes from Naperville · Licensed NPs</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Xeomin near Naperville Naperville, IL</span> — Pure. Protein-Free. Powerful.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Xeomin is the <strong className="text-white">only neurotoxin with no complexing proteins</strong> — pure incobotulinumtoxinA. Lower risk of antibody resistance. Ideal for long-term injectors. Available <strong className="text-white">15 minutes from Naperville</strong> at Hello Gorgeous Med Spa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ No Complexing Proteins</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ FDA Approved</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Botox Resistance Solution</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> · 15 minutes from Naperville via Route 34. · Also offering: <Link href="/botox-vs-dysport-vs-jeuveau" className="text-[#FF2D8E] underline">Botox · Dysport · Jeuveau →</Link></p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Xeomin near Naperville Naperville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="botox" serviceLabel={"Xeomin near Naperville Naperville"} heading={"Hello Gorgeous neurotoxin clients near Naperville"} intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Xeomin — 15 minutes from Naperville</h2>
            <p className="text-xl text-gray-300 mb-8">The Naked Neurotoxin · No Complexing Proteins · Free Consultations · Open 7 Days</p>
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
