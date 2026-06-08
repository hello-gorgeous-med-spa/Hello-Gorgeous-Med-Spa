import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Masseter Botox (Jaw Slimming) in Oswego, IL | Hello Gorgeous Med Spa',
  description: 'Masseter Botox for jaw slimming, TMJ relief & teeth grinding in Oswego, IL. Licensed NPs. Reduces jaw width, relieves clenching & migraine headaches. Free consultations.',
  keywords: [
    'masseter botox oswego il', 'jaw slimming botox oswego', 'jaw botox near me',
    'tmj botox oswego il', 'teeth grinding botox oswego', 'masseter reduction oswego',
    'jaw clenching treatment oswego', 'face slimming botox oswego',
    'masseter botox naperville', 'bruxism botox oswego il', 'jaw botox near naperville',
  ],
  alternates: { canonical: `${SITE.url}/masseter-botox-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/masseter-botox-oswego-il`,
    title: 'Masseter Botox (Jaw Slimming) in Oswego, IL | Hello Gorgeous',
    description: 'Botox in the masseter muscle for jaw slimming, TMJ relief & bruxism. Licensed NPs in Oswego. Free consultations.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'What is masseter Botox and is it available in Oswego, IL?', answer: 'Masseter Botox involves injecting botulinum toxin into the masseter (jaw) muscle to relax it. This reduces the bulk of the muscle, creating a slimmer, more oval face shape — and relieves symptoms of TMJ disorder, teeth grinding (bruxism), and jaw clenching. Hello Gorgeous offers masseter Botox in Oswego.' },
  { question: 'Does masseter Botox help with teeth grinding near Oswego?', answer: 'Yes — masseter Botox is one of the most effective treatments for bruxism (teeth grinding) and jaw clenching. By relaxing the masseter muscle, it reduces the force of grinding, alleviates jaw pain, headaches, and can protect your teeth from wear.' },
  { question: 'How many units of Botox are needed for jaw slimming?', answer: 'Most clients need 20–40 units per side (40–80 units total) for masseter Botox. The exact amount depends on the size and strength of your masseter muscle, which your NP will assess at your free consultation.' },
  { question: 'How long does masseter Botox last?', answer: 'Masseter Botox typically lasts 3–6 months. With consistent treatment over 1–2 years, the muscle can permanently reduce in size, and many clients need less frequent touch-ups over time.' },
  { question: 'When will I see results from jaw slimming Botox?', answer: 'You\'ll feel TMJ/grinding relief within 1–2 weeks. The visible jaw slimming effect takes 4–6 weeks to become noticeable as the muscle gradually atrophies. Full results appear at 2–3 months.' },
  { question: 'Is masseter Botox painful?', answer: 'The masseter is a large, accessible muscle — injections are brief and most clients describe minimal discomfort. Numbing cream is available. No downtime is required.' },
  { question: 'Who is a good candidate for masseter Botox near Oswego?', answer: 'Ideal candidates have a wide or square jawline they want to slim, suffer from bruxism or jaw clenching, experience TMJ headaches or jaw pain, or wake up with sore teeth or tight jaw muscles.' },
];

export default function MasseterBotoxOswegoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', url: SITE.url },
        { name: 'Masseter Botox Oswego IL', url: `${SITE.url}/masseter-botox-oswego-il` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">🦷 Oswego, IL · TMJ · Bruxism · Jaw Slimming</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Masseter Botox in Oswego, IL</span> — Slim Your Jaw. End the Grind.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Botox injected into the masseter muscle does two powerful things: <strong className="text-white">slims a wide or square jawline</strong> for a more oval face shape, and <strong className="text-white">relieves TMJ pain, teeth grinding, and jaw clenching</strong>. Licensed NPs. Free consultations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Jaw Slimming</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ TMJ Relief</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Stops Teeth Grinding</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free Consultations</span>
            </div>
          </div>
        </section>

        {/* Two Benefits */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">One Treatment. Two Life-Changing Results.</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#FF2D8E]/5 border-2 border-[#FF2D8E]/20 rounded-2xl p-8">
                <span className="text-4xl mb-4 block">✨</span>
                <h3 className="text-xl font-bold mb-4">Jaw Slimming & Face Contouring</h3>
                <p className="text-gray-600 mb-4">The masseter is the chewing muscle along your jaw. When it\'s overdeveloped, it creates a wide, square lower face. Botox gradually reduces the muscle bulk over 6–12 weeks, creating a slimmer, softer, more feminine oval or heart-shaped face.</p>
                <ul className="space-y-2 text-sm">
                  {['Slimmer lower face', 'More oval or heart-shaped face', 'Non-surgical face contouring', 'Results build over 2–3 months', 'Long-lasting with consistent treatment'].map(b => (
                    <li key={b} className="flex items-center gap-2 text-gray-700"><span className="text-[#FF2D8E]">✓</span>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-8">
                <span className="text-4xl mb-4 block">🦷</span>
                <h3 className="text-xl font-bold mb-4">TMJ Relief & Bruxism Treatment</h3>
                <p className="text-gray-600 mb-4">Teeth grinding (bruxism) and jaw clenching can cause chronic headaches, jaw pain, cracked teeth, and disrupted sleep. Masseter Botox relaxes the muscle, dramatically reducing grinding force and providing real relief.</p>
                <ul className="space-y-2 text-sm">
                  {['Reduces teeth grinding force', 'Relieves jaw pain & tension', 'Fewer morning headaches', 'Protects teeth from wear', 'Relief felt within 1–2 weeks'].map(b => (
                    <li key={b} className="flex items-center gap-2 text-gray-700"><span className="text-blue-500">✓</span>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Masseter Botox Oswego — FAQs</h2>
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

        <RealPatientReviews service="botox" serviceLabel="Masseter Botox in Oswego" heading="Jaw Botox clients love Hello Gorgeous" intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Book Masseter Botox in Oswego</h2>
            <p className="text-xl text-gray-300 mb-8">Jaw slimming · TMJ relief · Bruxism treatment · Free consultations · Open 7 days</p>
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
