import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Medical Weight Loss Near Joliet, IL | Semaglutide & Tirzepatide | Hello Gorgeous',
  description:
    'Clinician-supervised semaglutide & tirzepatide weight loss near Joliet, IL at Hello Gorgeous Med Spa in Oswego — just 20 min away. Real prescriptions, real results. Book today.',
  keywords: [
    'medical weight loss joliet il',
    'semaglutide near joliet il',
    'tirzepatide joliet il',
    'weight loss injections joliet',
    'ozempic near joliet il',
    'wegovy joliet il',
    'mounjaro joliet il',
    'glp1 joliet il',
    'weight loss clinic joliet',
    'best weight loss doctor joliet',
    'medically supervised weight loss joliet il',
    'semaglutide will county il',
  ],
  alternates: { canonical: `${SITE.url}/weight-loss-joliet-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-joliet-il`,
    title: 'Medical Weight Loss Near Joliet, IL | Semaglutide & Tirzepatide',
    description: 'Clinician-supervised semaglutide & tirzepatide programs near Joliet. Real prescriptions. 20 min from Joliet in Oswego, IL.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Where can I get semaglutide or tirzepatide near Joliet, IL?',
    answer: 'Hello Gorgeous Med Spa in Oswego offers clinician-supervised semaglutide and tirzepatide weight loss programs — just 20 minutes from Joliet. Our nurse practitioners evaluate eligibility and write prescriptions on-site.',
  },
  {
    question: 'What is semaglutide and how does it work?',
    answer: 'Semaglutide (brand names Ozempic/Wegovy) is a GLP-1 receptor agonist that reduces appetite, slows gastric emptying, and improves blood sugar regulation. Patients typically lose 15–20% of body weight when combined with lifestyle changes.',
  },
  {
    question: 'What is tirzepatide and how is it different from semaglutide?',
    answer: 'Tirzepatide (brand names Mounjaro/Zepbound) targets both GLP-1 and GIP receptors, often producing greater weight loss — 20–25% in clinical trials. Our providers will help you choose the right program.',
  },
  {
    question: 'Who qualifies for medical weight loss near Joliet?',
    answer: 'Eligibility is determined through a consultation. Generally, candidates have a BMI of 27+ with a weight-related condition, or a BMI of 30+. Our providers review your full health history to personalize your plan.',
  },
  {
    question: 'How much does medical weight loss cost near Joliet?',
    answer: 'Program costs vary based on medication, dosage, and treatment plan. We offer transparent pricing with no hidden fees. Book a free consultation to discuss your options.',
  },
  {
    question: 'Do you offer ongoing support for weight loss patients?',
    answer: 'Yes — we provide regular check-ins, dosage adjustments, and support throughout your program. Clients also receive aftercare push notifications through our client app to stay on track.',
  },
];

export default function WeightLossJolietPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Near Joliet, IL', url: `${SITE.url}/joliet-il` },
    { name: 'Weight Loss Near Joliet', url: `${SITE.url}/weight-loss-joliet-il` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Joliet')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">Serving Joliet • Plainfield • Bolingbrook • Will County</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Medical Weight Loss Near Joliet</span> — Semaglutide & Tirzepatide
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Clinician-supervised GLP-1 weight loss programs at Hello Gorgeous Med Spa in Oswego — <strong className="text-white">just 20 minutes from Joliet</strong>. Real nurse practitioners. Real prescriptions. Real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">📍 <strong>74 W. Washington Street, Oswego, IL</strong> — ~20 min from Joliet via I-80 → Route 34</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Our Medical Weight Loss Programs</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Clinician-supervised, evidence-based, personalized to you.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: 'Semaglutide Program',
                  subtitle: 'GLP-1 Receptor Agonist',
                  desc: 'Weekly injections that reduce appetite and promote sustainable weight loss. Clients typically lose 15–20% of body weight. Based on the same molecule as Ozempic® and Wegovy®.',
                  results: '15–20% avg weight loss',
                  emoji: '💉',
                },
                {
                  name: 'Tirzepatide Program',
                  subtitle: 'GLP-1 + GIP Dual Agonist',
                  desc: 'Dual-action mechanism targeting both GLP-1 and GIP receptors. Clinical trials show up to 20–25% weight loss. Based on the same molecule as Mounjaro® and Zepbound®.',
                  results: '20–25% avg weight loss',
                  emoji: '🏆',
                },
              ].map((p) => (
                <div key={p.name} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#FF2D8E] transition-all">
                  <span className="text-4xl mb-4 block">{p.emoji}</span>
                  <h3 className="text-2xl font-bold mb-1">{p.name}</h3>
                  <p className="text-[#FF2D8E] font-medium text-sm mb-4">{p.subtitle}</p>
                  <p className="text-gray-600 mb-6">{p.desc}</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-sm text-gray-500">Clinical trial avg results</p>
                    <p className="font-bold text-gray-900">{p.results}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Weight Loss Near Joliet — FAQs</h2>
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

        <RealPatientReviews service="weight-loss" serviceLabel="Weight Loss Near Joliet" heading="Real weight loss results near Joliet" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Weight Loss Journey — 20 Min from Joliet</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Semaglutide & tirzepatide · Clinician supervised · Open 7 days</p>
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
