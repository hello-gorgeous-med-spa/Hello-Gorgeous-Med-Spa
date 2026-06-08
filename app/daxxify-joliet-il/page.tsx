import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Daxxify Near Joliet, IL | 6-Month Neurotoxin | Hello Gorgeous Med Spa',
  description: 'Daxxify near Joliet, IL at Hello Gorgeous Med Spa in Oswego — 20 min away. The longest-lasting FDA-approved neurotoxin, up to 6 months. Licensed NPs. Free consultations.',
  keywords: ['daxxify joliet il','daxxify near joliet','daxxify near me joliet','6 month botox near joliet','longest lasting neurotoxin joliet','daxxify vs botox joliet','revance daxxify near joliet'],
  alternates: { canonical: `${SITE.url}/daxxify-joliet-il` },
  openGraph: { type: 'website', url: `${SITE.url}/daxxify-joliet-il`, title: 'Daxxify Near Joliet, IL | 6-Month Neurotoxin | Hello Gorgeous', description: 'Daxxify — lasts up to 6 months — 20 min from Joliet. Only provider in the Fox Valley with all 5 neurotoxins.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get Daxxify near Joliet, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is 20 minutes from Joliet via I-80 to Route 34. We are the only provider in the Fox Valley offering all five FDA-approved neurotoxins — Botox, Dysport, Jeuveau, Xeomin, and now Daxxify.' },
  { question: 'How long does Daxxify last compared to Botox near Joliet?', answer: 'Daxxify lasts up to 6 months — compared to 3–4 months for Botox. In clinical trials, 80% of patients maintained results at 6 months. That means roughly 2 treatments per year vs. 3–4 for Botox.' },
  { question: 'What makes Daxxify different near Joliet?', answer: 'Daxxify is the only neurotoxin with a proprietary peptide-based formula — no human or animal proteins. It also has the fastest onset of any neurotoxin (results in 1–2 days for many clients) and the longest duration at up to 6 months.' },
  { question: 'How far is the drive from Joliet to get Daxxify?', answer: '20 minutes from Joliet via I-80 to Route 34 to Hello Gorgeous Med Spa at 74 W. Washington Street, Oswego, IL. Most clients tell us the drive is absolutely worth it for 6 months of results.' },
  { question: 'Does Hello Gorgeous offer all 5 neurotoxins near Joliet?', answer: 'Yes — we are the only med spa in the Fox Valley offering Botox, Dysport, Jeuveau, Xeomin, AND Daxxify. Your licensed NP will recommend the best option for your goals at your free consultation.' },
];
export default function DaxxifyJolietPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Daxxify Near Joliet', url: `${SITE.url}/daxxify-joliet-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Joliet')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-[#FF2D8E] text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
              🆕 NOW AVAILABLE · 20 MIN FROM Joliet · ONLY PROVIDER IN THE FOX VALLEY
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Daxxify Near Joliet, IL</span> — 6-Month Results. One Treatment.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Daxxify is the <strong className="text-white">longest-lasting FDA-approved neurotoxin</strong> — up to 6 months per treatment. Available <strong className="text-white">20 minutes from Joliet</strong> at Hello Gorgeous Med Spa in Oswego. The only provider in the Fox Valley with all 5 neurotoxins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-[#FF2D8E]/20 border border-[#FF2D8E]/40 px-4 py-2 rounded-full text-[#FF2D8E] font-semibold">✓ Lasts Up to 6 Months</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Results in 1–2 Days</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ No Animal Proteins</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ 20 Min from Joliet</span>
            </div>
          </div>
        </section>
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> · 20 min from Joliet via I-80 to Route 34 · <Link href="/botox-vs-dysport-vs-jeuveau" className="text-[#FF2D8E] underline">Compare all 5 neurotoxins →</Link></p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Daxxify Near Joliet — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="botox" serviceLabel={"Daxxify Near Joliet"} heading={"Neurotoxin clients near Joliet choose Hello Gorgeous"} intro={`${SITE.reviewCount}+ verified reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Book Daxxify — 20 Min from Joliet</h2>
            <p className="text-xl text-gray-300 mb-8">6-month results · FDA approved · All 5 neurotoxins · Free consultations · Open 7 days</p>
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
