import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tirzepatide in Oswego, IL | Mounjaro/Zepbound | Hello Gorgeous Med Spa',
  description:
    'Clinician-supervised tirzepatide weight loss in Oswego, IL at Hello Gorgeous Med Spa. Same molecule as Mounjaro & Zepbound. 20–25% avg weight loss. Free consultations.',
  keywords: [
    'tirzepatide oswego il',
    'tirzepatide near me oswego',
    'mounjaro near me oswego il',
    'zepbound oswego il',
    'tirzepatide weight loss oswego',
    'glp1 gip weight loss oswego',
    'tirzepatide clinic oswego il',
    'best tirzepatide provider oswego',
    'mounjaro prescription oswego il',
    'tirzepatide kendall county il',
    'dual agonist weight loss oswego',
    'tirzepatide vs semaglutide oswego',
  ],
  alternates: { canonical: `${SITE.url}/tirzepatide-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/tirzepatide-oswego-il`,
    title: 'Tirzepatide in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'Clinician-supervised tirzepatide (Mounjaro/Zepbound equivalent) in Oswego. 20–25% avg weight loss. Licensed NPs, free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'Where can I get tirzepatide in Oswego, IL?', answer: 'Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego offers clinician-supervised tirzepatide weight loss programs. Our licensed nurse practitioners evaluate eligibility and manage your program.' },
  { question: 'Is tirzepatide the same as Mounjaro or Zepbound?', answer: 'Tirzepatide is the active molecule in Mounjaro (approved for type 2 diabetes) and Zepbound (approved for weight loss). We offer clinician-supervised tirzepatide programs for eligible clients.' },
  { question: 'How is tirzepatide different from semaglutide?', answer: 'Tirzepatide is a dual agonist — it activates both GLP-1 and GIP receptors, compared to semaglutide which only targets GLP-1. Clinical trials show tirzepatide produces greater average weight loss (20–25%) compared to semaglutide (15–20%).' },
  { question: 'How much weight can I lose with tirzepatide?', answer: 'The SURMOUNT-1 clinical trial showed 20–25% average body weight loss with tirzepatide over 72 weeks. Some participants lost over 25% of their body weight. Results vary by individual.' },
  { question: 'Who qualifies for tirzepatide near Oswego?', answer: 'Tirzepatide is generally appropriate for adults with a BMI of 30+, or 27+ with a weight-related condition. Our providers review your complete health history to determine the best program for you.' },
  { question: 'Does tirzepatide have more side effects than semaglutide?', answer: 'Both medications have similar side effect profiles — primarily GI effects like nausea, especially early in treatment. Tirzepatide may have slightly different tolerability for some patients. Your provider will help manage your experience.' },
  { question: 'Can I switch from semaglutide to tirzepatide?', answer: 'Yes — many clients transition between programs. Your provider will guide the transition timeline and dosage adjustment to minimize side effects and maximize results.' },
];

export default function TirzepatideOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Weight Loss Oswego', url: `${SITE.url}/weight-loss-oswego-il` },
    { name: 'Tirzepatide Oswego IL', url: `${SITE.url}/tirzepatide-oswego-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Serving Oswego · Naperville · Aurora · Plainfield · Kendall County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Tirzepatide in Oswego, IL</span> — The Next-Level Weight Loss Option
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              The dual GLP-1 + GIP agonist — same molecule as Mounjaro® and Zepbound®. Clinical trials show <strong className="text-white">20–25% average body weight loss</strong>. Prescribed and supervised by licensed nurse practitioners in Oswego, IL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { v: '20–25%', l: 'Avg weight loss', s: 'SURMOUNT-1 trial' },
                { v: 'Dual', l: 'GLP-1 + GIP', s: 'dual agonist mechanism' },
                { v: 'Weekly', l: 'Injection', s: 'self-administered' },
                { v: 'NP On Site', l: 'Clinician oversight', s: 'full prescriptive authority' },
              ].map(s => (
                <div key={s.v} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-[#FF2D8E]">{s.v}</p>
                  <p className="text-white text-sm font-semibold mt-1">{s.l}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL 60543</strong> · Open 7 days · {SITE.phone}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Tirzepatide vs. Semaglutide — Which Is Right for You?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="text-left p-4 rounded-tl-xl">Feature</th>
                    <th className="text-center p-4 bg-[#FF2D8E]">Tirzepatide</th>
                    <th className="text-center p-4 rounded-tr-xl">Semaglutide</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Mechanism', 'GLP-1 + GIP dual agonist', 'GLP-1 agonist only'],
                    ['Avg weight loss', '20–25%', '15–20%'],
                    ['Dosing', 'Weekly injection', 'Weekly injection'],
                    ['Common brand names', 'Mounjaro®, Zepbound®', 'Ozempic®, Wegovy®'],
                    ['Available at HG?', '✓ Yes', '✓ Yes'],
                    ['Free consultation?', '✓ Yes', '✓ Yes'],
                  ].map(([feat, tir, sem], i) => (
                    <tr key={feat} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-medium text-gray-800">{feat}</td>
                      <td className="p-4 text-center text-[#FF2D8E] font-semibold">{tir}</td>
                      <td className="p-4 text-center text-gray-600">{sem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">Your provider will recommend the best option based on your health history, goals, and response to treatment.</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Tirzepatide in Oswego — FAQs</h2>
            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RealPatientReviews service="weight-loss" serviceLabel="Tirzepatide in Oswego" heading="Real weight loss results in Oswego" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready for 20–25% Weight Loss? Book Your Free Consult.</h2>
            <p className="text-xl text-gray-300 mb-8">In Oswego, IL · Licensed NPs · Free consultations · Open 7 days</p>
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
