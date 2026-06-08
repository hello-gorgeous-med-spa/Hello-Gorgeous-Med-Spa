import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Daxxify in Oswego, IL | 6-Month Neurotoxin | Hello Gorgeous Med Spa',
  description: 'Daxxify in Oswego, IL at Hello Gorgeous Med Spa — the only FDA-approved neurotoxin that lasts 6 months. Peptide-powered, no animal proteins. Licensed NPs. Free consultations.',
  keywords: [
    'daxxify oswego il', 'daxxify near me oswego', 'daxxify injections oswego',
    'longest lasting botox oswego', '6 month neurotoxin oswego il',
    'daxxify vs botox oswego', 'daxxify cost oswego il',
    'revance daxxify oswego', 'daxibotulinumtoxina oswego',
    'best neurotoxin oswego il', 'daxxify near naperville',
    'daxxify illinois', 'all 5 neurotoxins oswego',
  ],
  alternates: { canonical: `${SITE.url}/daxxify-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/daxxify-oswego-il`,
    title: 'Daxxify in Oswego, IL — 6-Month Neurotoxin | Hello Gorgeous Med Spa',
    description: 'Daxxify lasts up to 6 months — twice as long as Botox. Now available in Oswego at Hello Gorgeous. The only med spa in the Fox Valley with all 5 FDA-approved neurotoxins.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'What is Daxxify and where can I get it in Oswego, IL?',
    answer: 'Daxxify (daxibotulinumtoxinA) is the newest and longest-lasting FDA-approved neurotoxin, made by Revance Therapeutics. It\'s the only botulinum toxin formulated with a proprietary stabilizing peptide instead of human or animal proteins. Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego now offers Daxxify — the only provider in the Fox Valley with all five FDA-approved neurotoxins.',
  },
  {
    question: 'How long does Daxxify last compared to Botox?',
    answer: 'Daxxify lasts up to 6 months for most clients — compared to 3–4 months for Botox, Dysport, Jeuveau, and Xeomin. In clinical trials, 80% of patients maintained their results at 6 months. Some clients see results lasting even longer. This means roughly 2 treatments per year instead of 3–4.',
  },
  {
    question: 'What makes Daxxify different from other neurotoxins?',
    answer: 'Daxxify is the only FDA-approved neurotoxin that: (1) uses a proprietary peptide exchange technology for stabilization, (2) contains no human or animal-derived proteins, and (3) consistently lasts up to 6 months. It\'s also the first new neurotoxin FDA-approved in over a decade.',
  },
  {
    question: 'How fast does Daxxify work?',
    answer: 'Many clients see initial results within 1–2 days — faster than Botox (3–7 days). Full results typically appear within 1 week.',
  },
  {
    question: 'Is Daxxify FDA-approved?',
    answer: 'Yes — Daxxify received FDA approval in 2022 for the treatment of moderate-to-severe glabellar lines (the "11s" between the eyebrows). It\'s the most thoroughly studied new neurotoxin in years, with one of the largest clinical trial datasets in neurotoxin history.',
  },
  {
    question: 'How much does Daxxify cost in Oswego, IL?',
    answer: 'Daxxify is priced at consultation based on your treatment area and unit needs. Because it lasts up to 6 months, the cost per month is often comparable or lower than getting Botox every 3–4 months. Book a free consultation at Hello Gorgeous to get your personalized quote.',
  },
  {
    question: 'Who is a good candidate for Daxxify near Oswego?',
    answer: 'Daxxify is ideal for clients who: want fewer annual treatments, are frustrated with Botox wearing off at 3 months, want the latest and longest-lasting FDA-approved option, or prefer a formula with no human or animal proteins. Your NP will evaluate your goals at a free consultation.',
  },
  {
    question: 'Does Hello Gorgeous offer all 5 FDA-approved neurotoxins?',
    answer: 'Yes — Hello Gorgeous is the only med spa in the Oswego and Fox Valley area offering all five FDA-approved neurotoxins: Botox, Dysport, Jeuveau, Xeomin, and now Daxxify. Your licensed NP will recommend the right brand for your face, goals, and treatment history.',
  },
];

const COMPARE = [
  { name: 'Botox', duration: '3–4 months', onset: '3–7 days', protein: 'Yes', highlight: false },
  { name: 'Dysport', duration: '3–5 months', onset: '1–3 days', protein: 'Yes', highlight: false },
  { name: 'Jeuveau', duration: '3–4 months', onset: '2–5 days', protein: 'Yes', highlight: false },
  { name: 'Xeomin', duration: '3–4 months', onset: '3–7 days', protein: 'None', highlight: false },
  { name: 'Daxxify ✨ NEW', duration: '5–6 months', onset: '1–2 days', protein: 'None (peptide)', highlight: true },
];

export default function DaxxifyOswegoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', url: SITE.url },
        { name: 'Daxxify Oswego IL', url: `${SITE.url}/daxxify-oswego-il` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-[#FF2D8E] text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
              🆕 NOW AVAILABLE IN OSWEGO — THE ONLY PROVIDER IN THE FOX VALLEY
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Daxxify in Oswego, IL</span> —<br />The Neurotoxin That Lasts <span className="text-[#FF2D8E]">6 Months</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Daxxify is the <strong className="text-white">newest and longest-lasting FDA-approved neurotoxin</strong> — up to 6 months on a single treatment. Peptide-powered. No animal proteins. Results in as little as 1–2 days. Now available at Hello Gorgeous — the <strong className="text-white">only med spa in the Fox Valley with all 5 FDA-approved neurotoxins</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-[#FF2D8E]/20 border border-[#FF2D8E]/40 px-4 py-2 rounded-full text-[#FF2D8E] font-semibold">✓ Lasts Up to 6 Months</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Results in 1–2 Days</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ No Animal Proteins</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ FDA Approved 2022</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>

        {/* Why Daxxify */}
        <section className="py-16 bg-gradient-to-br from-[#FF2D8E]/5 to-purple-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Why Daxxify Is Different</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Every other neurotoxin uses human serum albumin or animal-derived proteins as stabilizers. Daxxify uses a proprietary <strong>peptide exchange technology</strong> — a first in the industry.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { emoji: '⏱️', title: 'Lasts Up to 6 Months', desc: '80% of clinical trial patients maintained results at 6 months. That\'s 2 treatments per year instead of 3–4.' },
                { emoji: '🧬', title: 'Peptide-Powered Formula', desc: 'The only neurotoxin stabilized with a proprietary peptide — no human or animal-derived proteins of any kind.' },
                { emoji: '⚡', title: 'Fast Onset', desc: 'Many clients see initial results in 1–2 days — among the fastest of any neurotoxin currently available.' },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <span className="text-5xl mb-4 block">{f.emoji}</span>
                  <h3 className="font-bold text-lg mb-3">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">All 5 Neurotoxins — Side by Side</h2>
            <p className="text-center text-gray-600 mb-10">Hello Gorgeous is the <strong>only provider in the Fox Valley</strong> offering all five.</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left p-4 font-semibold">Neurotoxin</th>
                    <th className="text-center p-4 font-semibold">Duration</th>
                    <th className="text-center p-4 font-semibold">Onset</th>
                    <th className="text-center p-4 font-semibold">Animal Proteins</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={row.name} className={row.highlight ? 'bg-[#FF2D8E]/10 border-y-2 border-[#FF2D8E]/30' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className={`p-4 font-bold ${row.highlight ? 'text-[#FF2D8E]' : 'text-gray-800'}`}>{row.name}</td>
                      <td className={`p-4 text-center font-semibold ${row.highlight ? 'text-[#FF2D8E]' : 'text-gray-600'}`}>{row.duration}</td>
                      <td className="p-4 text-center text-gray-600">{row.onset}</td>
                      <td className="p-4 text-center text-gray-600">{row.protein}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">*Individual results vary. Consult your NP for a personalized recommendation.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Daxxify Oswego — FAQs</h2>
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

        <RealPatientReviews service="botox" serviceLabel="Daxxify in Oswego" heading="Our neurotoxin clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified reviews · ${SITE.reviewRating} stars`} />

        {/* CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[#FF2D8E] text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
              🆕 NOW AVAILABLE — ONLY AT HELLO GORGEOUS IN THE FOX VALLEY
            </div>
            <h2 className="text-3xl font-bold mb-4">Be Among the First to Try Daxxify in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">6-month results · FDA approved · Free consultations · Open 7 days · All 5 neurotoxins available</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Daxxify Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
            <p className="text-gray-500 text-sm mt-6">Also offering: <Link href="/botox-oswego-il" className="text-gray-400 underline">Botox</Link> · <Link href="/dysport-oswego-il" className="text-gray-400 underline">Dysport</Link> · <Link href="/jeuveau-oswego-il" className="text-gray-400 underline">Jeuveau</Link> · <Link href="/xeomin-oswego-il" className="text-gray-400 underline">Xeomin</Link></p>
          </div>
        </section>
      </main>
    </>
  );
}
