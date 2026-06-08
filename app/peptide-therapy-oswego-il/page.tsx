import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Peptide Therapy in Oswego, IL | BPC-157, CJC-1295 & More | Hello Gorgeous Med Spa',
  description:
    'Peptide therapy in Oswego, IL at Hello Gorgeous Med Spa. BPC-157, CJC-1295/Ipamorelin, TB-500 for anti-aging, fat loss, muscle recovery & longevity. Licensed NPs. Book today.',
  keywords: [
    'peptide therapy oswego il',
    'peptide therapy near me oswego',
    'bpc 157 oswego il',
    'cjc 1295 oswego il',
    'ipamorelin oswego il',
    'tb 500 oswego il',
    'peptides for weight loss oswego',
    'anti aging peptides oswego',
    'peptide clinic oswego il',
    'regenerative medicine oswego il',
    'peptide injections near me oswego',
    'growth hormone peptides oswego il',
  ],
  alternates: { canonical: `${SITE.url}/peptide-therapy-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/peptide-therapy-oswego-il`,
    title: 'Peptide Therapy in Oswego, IL | Hello Gorgeous Med Spa',
    description: 'BPC-157, CJC-1295, TB-500 peptide therapy in Oswego, IL. Anti-aging, fat loss, recovery. Licensed NPs. Free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const PEPTIDES = [
  { name: 'BPC-157', subtitle: 'Body Protection Compound', uses: ['Tissue healing & repair', 'Gut health & leaky gut', 'Joint & tendon recovery', 'Anti-inflammatory effects', 'Neurological protection'], emoji: '🔬' },
  { name: 'CJC-1295 / Ipamorelin', subtitle: 'Growth Hormone Secretagogues', uses: ['Increased growth hormone release', 'Lean muscle preservation', 'Improved sleep quality', 'Fat loss support', 'Anti-aging & recovery'], emoji: '💪' },
  { name: 'TB-500 (Thymosin Beta-4)', subtitle: 'Tissue Repair & Recovery', uses: ['Accelerated wound healing', 'Muscle & connective tissue repair', 'Reduced inflammation', 'Improved flexibility', 'Post-surgery recovery'], emoji: '⚡' },
  { name: 'Sermorelin', subtitle: 'Growth Hormone Releasing Hormone', uses: ['Natural HGH stimulation', 'Anti-aging effects', 'Improved body composition', 'Better sleep & energy', 'Bone density support'], emoji: '🌟' },
];

const FAQS = [
  { question: 'What is peptide therapy and is it available in Oswego, IL?', answer: 'Peptide therapy uses short chains of amino acids (peptides) that signal the body to perform specific functions — healing, fat burning, hormone release, or inflammation reduction. Hello Gorgeous Med Spa in Oswego offers clinician-supervised peptide therapy programs.' },
  { question: 'What peptides do you offer near Oswego?', answer: 'We offer BPC-157 (healing & gut health), CJC-1295/Ipamorelin (growth hormone, fat loss, sleep), TB-500 (tissue repair), and Sermorelin (natural HGH stimulation), among others. Your provider will recommend the right protocol for your goals.' },
  { question: 'Who is a good candidate for peptide therapy in Oswego?', answer: 'Peptide therapy is ideal for people looking to optimize recovery, slow aging, improve body composition, support gut health, or address chronic inflammation. It\'s popular among athletes, busy professionals, and those in their 30s–60s looking to feel their best.' },
  { question: 'Are peptides safe?', answer: 'Peptides are generally very well tolerated when prescribed and monitored by a licensed clinician. Our providers review your health history and goals to create a safe, personalized protocol.' },
  { question: 'How long does it take to see results from peptide therapy?', answer: 'Timeline varies by peptide and goal. Some clients notice improvements in sleep, energy, or recovery within 2–4 weeks. Body composition changes typically become noticeable at 8–12 weeks with consistent use.' },
  { question: 'Can I combine peptide therapy with other treatments?', answer: 'Yes — peptide therapy pairs well with GLP-1 weight loss programs, hormone therapy, and aesthetic treatments. Many clients combine protocols for comprehensive optimization. Your provider will create a personalized plan.' },
];

export default function PeptideTherapyOswegoPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Peptides', url: `${SITE.url}/peptides` },
    { name: 'Peptide Therapy Oswego IL', url: `${SITE.url}/peptide-therapy-oswego-il` },
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
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Oswego, IL · Serving Naperville · Aurora · Plainfield · Yorkville</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Peptide Therapy in Oswego, IL</span> — Optimize. Recover. Perform.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Clinician-prescribed peptide protocols for anti-aging, fat loss, recovery, gut health, and longevity. <strong className="text-white">Licensed nurse practitioners on site</strong> in Oswego — your peptide therapy starts with a real consultation, not a mail-order kit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Clinician Prescribed</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Personalized Protocols</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Licensed NPs On Site</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
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
            <h2 className="text-3xl font-bold text-center mb-4">Peptides We Offer in Oswego</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Each peptide has a specific mechanism and target. Your provider creates a protocol based on your goals, labs, and lifestyle.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {PEPTIDES.map((p) => (
                <div key={p.name} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#FF2D8E]/30 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{p.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <p className="text-[#FF2D8E] text-sm font-medium">{p.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {p.uses.map((u) => (
                      <li key={u} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-[#FF2D8E]">✓</span>{u}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Peptide Therapy Oswego — FAQs</h2>
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

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Peptide Protocol in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">Free consultations · Clinician prescribed · Personalized protocols · Open 7 days</p>
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
