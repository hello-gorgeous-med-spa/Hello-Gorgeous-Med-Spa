import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Semaglutide in Oswego, IL | Weight Loss Injections | Hello Gorgeous Med Spa',
  description:
    'Clinician-supervised semaglutide weight loss in Oswego, IL at Hello Gorgeous Med Spa. Licensed NPs on site. Same as Ozempic/Wegovy. Free consultations. Book today.',
  keywords: [
    'semaglutide oswego il',
    'semaglutide near me oswego',
    'ozempic near me oswego il',
    'wegovy oswego il',
    'glp1 weight loss oswego',
    'weight loss injections oswego il',
    'semaglutide clinic oswego',
    'semaglutide prescription oswego il',
    'medical weight loss oswego',
    'ozempic prescription oswego il',
    'best semaglutide clinic illinois',
    'semaglutide kendall county il',
  ],
  alternates: { canonical: `${SITE.url}/semaglutide-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/semaglutide-oswego-il`,
    title: 'Semaglutide Weight Loss in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'Clinician-supervised semaglutide (Ozempic/Wegovy equivalent) in Oswego, IL. Licensed NPs, free consultations, real results.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'Where can I get semaglutide in Oswego, IL?', answer: 'Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego offers clinician-supervised semaglutide weight loss programs. Our licensed nurse practitioners evaluate eligibility and manage your program with regular check-ins.' },
  { question: 'Is semaglutide the same as Ozempic or Wegovy?', answer: 'Semaglutide is the active molecule in Ozempic (diabetes) and Wegovy (weight loss). We offer clinician-supervised semaglutide programs for eligible clients. Ask about our current availability and pricing at your free consultation.' },
  { question: 'How much weight can I lose with semaglutide in Oswego?', answer: 'Clinical trials show an average of 15–20% body weight loss with semaglutide over 68 weeks when combined with lifestyle changes. Individual results vary based on starting weight, adherence, and metabolism.' },
  { question: 'Who qualifies for semaglutide near Oswego, IL?', answer: 'Candidates generally have a BMI of 30+, or a BMI of 27+ with a weight-related condition (high blood pressure, type 2 diabetes, high cholesterol). Our providers review your full health history at consultation.' },
  { question: 'What does semaglutide treatment in Oswego cost?', answer: 'Program costs include medication, provider visits, and ongoing monitoring. We offer transparent pricing with no hidden fees. Book a free consultation to get your personalized quote.' },
  { question: 'How does semaglutide work for weight loss?', answer: 'Semaglutide is a GLP-1 receptor agonist that mimics a gut hormone, reducing appetite, slowing gastric emptying, and improving insulin sensitivity. Most clients feel fuller faster and experience significantly reduced cravings.' },
  { question: 'Are there side effects of semaglutide?', answer: 'Common side effects include mild nausea, especially in the first 1–2 weeks as your body adjusts. Starting with a low dose and titrating up slowly minimizes side effects. Our providers guide you through the entire process.' },
  { question: 'Do I need a prescription for semaglutide in Oswego?', answer: 'Yes — semaglutide is a prescription medication. Our licensed nurse practitioners can evaluate and prescribe on-site for eligible clients after a proper medical consultation.' },
];

const STATS = [
  { value: '15–20%', label: 'Average weight loss', sub: 'in clinical trials' },
  { value: '68 weeks', label: 'Study duration', sub: 'sustained results' },
  { value: 'Weekly', label: 'Injection frequency', sub: 'self-administered' },
  { value: 'NP On Site', label: 'Provider oversight', sub: 'licensed clinicians' },
];

export default function SemaglutideOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Weight Loss Oswego', url: `${SITE.url}/weight-loss-oswego-il` },
    { name: 'Semaglutide Oswego IL', url: `${SITE.url}/semaglutide-oswego-il` },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalTherapy',
    name: 'Semaglutide Weight Loss Program',
    alternateName: ['Ozempic Weight Loss', 'Wegovy Program', 'GLP-1 Weight Loss Oswego'],
    description: 'Clinician-supervised semaglutide weight loss program at Hello Gorgeous Med Spa in Oswego, IL.',
    recognizingAuthority: { '@type': 'MedicalOrganization', name: 'Hello Gorgeous Med Spa' },
    relevantSpecialty: 'Weight Management',
    provider: {
      '@type': 'MedicalBusiness',
      name: SITE.name, url: SITE.url, telephone: SITE.phone,
      address: { '@type': 'PostalAddress', streetAddress: SITE.address.streetAddress, addressLocality: SITE.address.addressLocality, addressRegion: SITE.address.addressRegion, postalCode: SITE.address.postalCode },
      areaServed: ['Oswego, IL', 'Naperville, IL', 'Aurora, IL', 'Plainfield, IL', 'Yorkville, IL', 'Montgomery, IL'].map(c => ({ '@type': 'City', name: c })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Serving Oswego · Naperville · Aurora · Plainfield · Yorkville</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-[#FF2D8E]">Semaglutide in Oswego, IL</span> — Clinician-Supervised Weight Loss
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  The same molecule as Ozempic® and Wegovy® — prescribed and monitored by <strong className="text-white">licensed nurse practitioners on site</strong> in Oswego. Real prescriptions. Real results. No wellness coaching gimmicks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
                  <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs On Site</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Prescription On-Site</span>
                  <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s) => (
                  <div key={s.value} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-3xl font-black text-[#FF2D8E]">{s.value}</p>
                    <p className="text-white font-semibold mt-1 text-sm">{s.label}</p>
                    <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL 60543</strong> · {SITE.phone} · Open 7 days</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">How Semaglutide Works</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Semaglutide is a GLP-1 receptor agonist — a class of medication proven in large clinical trials to produce significant, sustained weight loss.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🧠', title: 'Reduces Appetite', desc: 'Semaglutide acts on brain receptors that control hunger, helping you feel satisfied with less food and reducing cravings significantly.' },
                { icon: '⏱️', title: 'Slows Digestion', desc: 'By slowing gastric emptying, semaglutide helps you feel full longer after meals, reducing overall caloric intake naturally.' },
                { icon: '📊', title: 'Improves Metabolism', desc: 'GLP-1 improves insulin sensitivity and blood sugar regulation, creating a better metabolic environment for sustained fat loss.' },
              ].map((item) => (
                <div key={item.title} className="text-center p-6 bg-gray-50 rounded-2xl">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Also Consider: Tirzepatide</h2>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-[#FF2D8E]/20 p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🏆</span>
                <div>
                  <h3 className="text-xl font-bold">Tirzepatide (Mounjaro/Zepbound equivalent)</h3>
                  <p className="text-[#FF2D8E] font-medium text-sm">Dual GLP-1 + GIP Receptor Agonist</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Tirzepatide targets both GLP-1 and GIP receptors, often producing greater weight loss than semaglutide — clinical trials show 20–25% body weight loss. Your provider will help you determine which is right for you.</p>
              <Link href="/tirzepatide-oswego-il" className="text-[#FF2D8E] font-semibold hover:underline">Learn about Tirzepatide in Oswego →</Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Semaglutide in Oswego — FAQs</h2>
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

        <RealPatientReviews service="weight-loss" serviceLabel="Semaglutide in Oswego" heading="Real weight loss results in Oswego, IL" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Semaglutide Journey in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Licensed NPs · Prescription on-site · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Consultation Now</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
