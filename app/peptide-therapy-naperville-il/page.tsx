import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Peptide Therapy Near Naperville, IL | Hello Gorgeous Med Spa — Oswego',
  description: 'Clinician-prescribed peptide therapy near Naperville, IL at Hello Gorgeous Med Spa in Oswego — 15 min away. BPC-157, CJC-1295, TB-500. Anti-aging, fat loss & recovery.',
  keywords: ['peptide therapy naperville il','peptide therapy near naperville','bpc 157 naperville','cjc 1295 naperville il','peptide clinic near naperville','regenerative medicine naperville il','anti aging peptides naperville'],
  alternates: { canonical: `${SITE.url}/peptide-therapy-naperville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/peptide-therapy-naperville-il`, title: 'Peptide Therapy Near Naperville, IL | Hello Gorgeous', description: 'BPC-157, CJC-1295, TB-500 peptide therapy 15 min from Naperville. Licensed NPs, free consultations.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get peptide therapy near Naperville, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is 15 minutes from Naperville via Route 34. We offer clinician-prescribed peptide protocols for anti-aging, fat loss, recovery, and gut health.' },
  { question: 'What peptides do you offer near Naperville?', answer: 'We offer BPC-157, CJC-1295/Ipamorelin, TB-500, Sermorelin, and more. Your licensed NP will create a personalized protocol based on your health history and goals.' },
  { question: 'How do I start peptide therapy near Naperville?', answer: 'Book a free consultation at hellogorgeousmedspa.com/book or call (630) 636-6193. The drive from Naperville is just 15 minutes via Route 34.' },
];
export default function PeptideNapervillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Peptide Therapy Near Naperville', url: `${SITE.url}/peptide-therapy-naperville-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 15 Minutes from Naperville · DuPage County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Peptide Therapy Near Naperville, IL</span> — Optimize. Recover. Perform.</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Clinician-prescribed peptide protocols — <strong className="text-white">15 minutes from Naperville</strong> in Oswego. BPC-157, CJC-1295/Ipamorelin, TB-500, and more. Real prescriptions by licensed nurse practitioners.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 15 min from Naperville via Route 34</p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Peptide Therapy Near Naperville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Peptide Therapy — 15 Min from Naperville</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Clinician prescribed · Open 7 days</p>
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
