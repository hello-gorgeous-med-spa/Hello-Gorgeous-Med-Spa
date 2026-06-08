import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Botox vs Dysport vs Jeuveau vs Xeomin vs Daxxify | What\'s the Difference? | Hello Gorgeous Med Spa',
  description: 'Botox, Dysport, Jeuveau, Xeomin, and Daxxify — what\'s the real difference? Hello Gorgeous Med Spa in Oswego, IL is the only Fox Valley provider with all five FDA-approved neurotoxins. Free consultations.',
  keywords: [
    'botox vs dysport',
    'botox vs jeuveau',
    'botox vs xeomin',
    'daxxify vs botox',
    'dysport vs botox oswego il',
    'jeuveau vs botox near me',
    'xeomin vs botox oswego',
    'daxxify oswego il',
    'which neurotoxin is best',
    'newtox vs botox',
    '6 month neurotoxin oswego',
    'botox alternatives oswego il',
    'dysport near me oswego',
    'jeuveau near me oswego',
    'xeomin near me oswego',
    'daxxify near me oswego',
    'neurotoxin comparison',
    'all 5 neurotoxins oswego',
    'best wrinkle injection oswego il',
  ],
  alternates: { canonical: `${SITE.url}/botox-vs-dysport-vs-jeuveau` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/botox-vs-dysport-vs-jeuveau`,
    title: 'All 5 Neurotoxins Compared | Hello Gorgeous Med Spa',
    description: 'The definitive guide to Botox, Dysport, Jeuveau, Xeomin & Daxxify. We offer all five — and our NPs will tell you exactly which one is right for your face.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const TOXINS = [
  {
    name: 'Botox',
    brand: 'AbbVie (Allergan)',
    molecule: 'OnabotulinumtoxinA',
    nickname: 'The Original',
    onset: '3–7 days',
    duration: '3–4 months',
    spreadFactor: 'Low',
    unitSystem: 'Botox units',
    bestFor: ['First-timers wanting predictability', 'Forehead, 11s, crow\'s feet', 'Precision areas (brow lift, lip flip)', 'Clients who know exactly what they want'],
    emoji: '💉',
    color: 'blue',
  },
  {
    name: 'Dysport',
    brand: 'Galderma',
    molecule: 'AbobotulinumtoxinA',
    nickname: 'The Fast Starter',
    onset: '1–3 days',
    duration: '3–5 months',
    spreadFactor: 'Moderate (diffuses more)',
    unitSystem: 'Dysport units (2.5–3x Botox)',
    bestFor: ['Larger treatment areas (forehead, glabella)', 'Clients who want faster onset', 'Clients who feel Botox has "stopped working"', 'Natural, soft movement'],
    emoji: '⚡',
    color: 'purple',
  },
  {
    name: 'Jeuveau',
    brand: 'Evolus',
    molecule: 'PrabotulinumtoxinA',
    nickname: '#Newtox',
    onset: '2–5 days',
    duration: '3–4 months',
    spreadFactor: 'Low–Moderate',
    unitSystem: '1:1 with Botox units',
    bestFor: ['Aesthetics-focused clients', 'Those wanting a Botox alternative at competitive pricing', 'Glabellar lines (11s)', 'Clients curious about newer formulations'],
    emoji: '✨',
    color: 'pink',
  },
  {
    name: 'Xeomin',
    brand: 'Merz',
    molecule: 'IncobotulinumtoxinA',
    nickname: 'The Naked Toxin',
    onset: '3–7 days',
    duration: '3–4 months',
    spreadFactor: 'Low',
    unitSystem: '1:1 with Botox units',
    bestFor: ['Clients who have developed resistance to Botox', 'Those with protein sensitivities', 'Precision areas', '"Clean" formulation seekers'],
    emoji: '🧬',
    color: 'green',
  },
  {
    name: 'Daxxify',
    brand: 'Revance',
    molecule: 'DaxibotulinumtoxinA',
    nickname: 'The 6-Month Toxin',
    onset: '1–2 days',
    duration: 'Up to 6 months',
    spreadFactor: 'Low',
    unitSystem: 'Daxxify units',
    bestFor: ['Clients who want the longest-lasting results', 'Fewer annual touch-ups (2×/year vs 3–4)', 'Peptide-based formula with no animal proteins', 'Fast onset seekers who also want duration'],
    emoji: '👑',
    color: 'gold',
  },
];

const COMPARISON = [
  { label: 'Manufacturer', botox: 'AbbVie (Allergan)', dysport: 'Galderma', jeuveau: 'Evolus', xeomin: 'Merz', daxxify: 'Revance' },
  { label: 'Molecule', botox: 'OnabotulinumtoxinA', dysport: 'AbobotulinumtoxinA', jeuveau: 'PrabotulinumtoxinA', xeomin: 'IncobotulinumtoxinA', daxxify: 'DaxibotulinumtoxinA' },
  { label: 'Onset', botox: '3–7 days', dysport: '1–3 days', jeuveau: '2–5 days', xeomin: '3–7 days', daxxify: '1–2 days' },
  { label: 'Duration', botox: '3–4 months', dysport: '3–5 months', jeuveau: '3–4 months', xeomin: '3–4 months', daxxify: 'Up to 6 months' },
  { label: 'Spread', botox: 'Low', dysport: 'Moderate', jeuveau: 'Low–Mod', xeomin: 'Low', daxxify: 'Low' },
  { label: 'Complexing Proteins', botox: 'Yes', dysport: 'Yes', jeuveau: 'Yes', xeomin: 'None (naked)', daxxify: 'None (peptide)' },
  { label: 'FDA Approved', botox: '✓', dysport: '✓', jeuveau: '✓', xeomin: '✓', daxxify: '✓' },
];

const FAQS = [
  { question: 'What is the difference between Botox, Dysport, Jeuveau, Xeomin, and Daxxify?', answer: 'All five are FDA-approved botulinum toxin type A neurotoxins that temporarily relax muscles to reduce wrinkles. Dysport tends to kick in faster (1–3 days). Xeomin is "naked" — free of complexing proteins. Jeuveau is FDA-approved exclusively for cosmetic use. Daxxify uses peptide stabilization, has no animal proteins, and lasts up to 6 months — the longest of any FDA-approved neurotoxin. Botox remains the most studied and widely known.' },
  { question: 'Which neurotoxin lasts the longest?', answer: 'Daxxify lasts up to 6 months for most clients — longer than Botox, Jeuveau, and Xeomin (3–4 months) and typically longer than Dysport (3–5 months). Individual results vary based on metabolism, treatment area, and dosage.' },
  { question: 'Can Botox stop working over time?', answer: 'Some clients report that Botox becomes less effective over many years of use. This is often due to antibody development against the complexing proteins. Switching to Xeomin (which has no complexing proteins), Dysport, Jeuveau, or Daxxify can be effective for these clients.' },
  { question: 'Does Dysport spread more than Botox?', answer: 'Yes — Dysport has a higher diffusion rate, which makes it excellent for large areas like the forehead. For precision areas like the lip flip or corners of the mouth, a lower-spread toxin like Botox, Xeomin, or Daxxify is typically preferred.' },
  { question: 'What is Jeuveau and is it as good as Botox?', answer: 'Jeuveau (prabotulinumtoxinA) is the first neurotoxin FDA-approved exclusively for cosmetic use in the US. It\'s manufactured using a Hi-Pure technology and clinical trials showed results comparable to Botox. Many clients and injectors love it as a modern alternative.' },
  { question: 'What is Xeomin and why is it called the "naked" neurotoxin?', answer: 'Xeomin (incobotulinumtoxinA) is formulated without the complexing proteins found in other neurotoxins. This "naked" formulation may reduce the chance of antibody resistance developing over time, making it a strong choice for long-term clients.' },
  { question: 'What is Daxxify and why is it different?', answer: 'Daxxify (daxibotulinumtoxinA) is the newest FDA-approved neurotoxin, stabilized with a proprietary peptide instead of human or animal proteins. It has among the fastest onset (1–2 days for many clients) and the longest duration — up to 6 months in clinical trials.' },
  { question: 'Which neurotoxins does Hello Gorgeous offer?', answer: 'We offer all five FDA-approved neurotoxins: Botox, Dysport, Jeuveau, Xeomin, and Daxxify. We are the only med spa in the Fox Valley with all five. During your free consultation, your licensed nurse practitioner will recommend the best option based on your treatment goals, history, and face.' },
  { question: 'Is Dysport cheaper than Botox?', answer: 'Dysport is priced per unit, but requires more units than Botox (roughly 2.5–3 Dysport units = 1 Botox unit). The overall treatment cost is often comparable. Your provider will give you an exact quote at consultation based on your areas and goals.' },
];

export default function BotoxVsDysportPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', url: SITE.url },
        { name: 'Botox vs Dysport vs Jeuveau vs Xeomin', url: `${SITE.url}/botox-vs-dysport-vs-jeuveau` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-4 text-lg">Oswego, IL · Licensed NPs · All 5 FDA-Approved Neurotoxins</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#FF2D8E]">Botox vs Dysport vs Jeuveau vs Xeomin vs Daxxify</span> — What's the Real Difference?
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              All five are FDA-approved neurotoxins. All five relax wrinkle-causing muscles. But they are <strong className="text-white">not the same</strong> — and choosing the right one for your face, metabolism, and goals matters. At Hello Gorgeous, we are the <strong className="text-white">only Fox Valley provider with all five</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Botox Available</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Dysport Available</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Jeuveau Available</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">✓ Xeomin Available</span>
              <span className="bg-[#FF2D8E]/20 border border-[#FF2D8E]/40 px-4 py-2 rounded-full text-[#FF2D8E] font-semibold">✓ Daxxify NEW</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">⭐ {SITE.reviewRating} Stars</span>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              New to Daxxify?{" "}
              <Link href="/daxxify-oswego-il" className="text-[#FF2D8E] underline underline-offset-2">
                See our Daxxify Oswego page →
              </Link>
            </p>
          </div>
        </section>

        {/* Brand Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">All Five FDA-Approved Neurotoxins</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Same category. Different formulations. Different strengths. Here's what you need to know about each one.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TOXINS.map((t) => (
                <div key={t.name} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#FF2D8E]/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-3xl mb-2 block">{t.emoji}</span>
                      <h3 className="text-2xl font-bold">{t.name}</h3>
                      <p className="text-[#FF2D8E] text-sm font-semibold">{t.nickname}</p>
                      <p className="text-gray-500 text-xs mt-1">{t.brand} · {t.molecule}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Onset</p>
                      <p className="font-semibold text-sm">{t.onset}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-semibold text-sm">{t.duration}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Spread</p>
                      <p className="font-semibold text-sm">{t.spreadFactor}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Best For</p>
                    <ul className="space-y-2">
                      {t.bestFor.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-[#FF2D8E]">✓</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Botox</th>
                    <th className="text-center p-4 font-semibold text-[#FF2D8E]">Dysport</th>
                    <th className="text-center p-4 font-semibold">Jeuveau</th>
                    <th className="text-center p-4 font-semibold">Xeomin</th>
                    <th className="text-center p-4 font-semibold text-[#FF2D8E]">Daxxify</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-semibold text-gray-700">{row.label}</td>
                      <td className="p-4 text-center text-gray-600">{row.botox}</td>
                      <td className="p-4 text-center text-gray-600 font-medium">{row.dysport}</td>
                      <td className="p-4 text-center text-gray-600">{row.jeuveau}</td>
                      <td className="p-4 text-center text-gray-600">{row.xeomin}</td>
                      <td className="p-4 text-center text-gray-600 font-medium">{row.daxxify}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">* Results vary by individual. Consult with your NP to determine the best option for your goals.</p>
          </div>
        </section>

        {/* Quick Picker */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Which One Is Right for You?</h2>
            <p className="text-center text-gray-600 mb-12">Our NPs make this recommendation at your free consultation — but here's a quick guide:</p>
            <div className="space-y-4">
              {[
                { if: 'You\'re new to injectables', then: 'Botox', why: 'Most studied, most predictable, ideal starting point.' },
                { if: 'You want the fastest results', then: 'Dysport', why: 'Kicks in 1–3 days vs. 3–7 for others.' },
                { if: 'You feel Botox has stopped working', then: 'Xeomin or Dysport', why: 'Different protein structures may overcome resistance.' },
                { if: 'You\'re treating a large area like the forehead', then: 'Dysport', why: 'Higher diffusion covers more area naturally.' },
                { if: 'You want a "clean" formulation with no complexing proteins', then: 'Xeomin', why: 'The only naked neurotoxin — pure botulinum toxin A.' },
                { if: 'You want a modern, aesthetics-focused brand', then: 'Jeuveau', why: 'FDA-approved exclusively for cosmetic use with Hi-Pure technology.' },
                { if: 'You want the longest-lasting results (up to 6 months)', then: 'Daxxify', why: 'Peptide-stabilized, fast onset, and the only neurotoxin with up to 6-month duration in trials.' },
              ].map((item) => (
                <div key={item.if} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/3">
                    <p className="text-sm text-gray-500 mb-1">If...</p>
                    <p className="font-semibold">{item.if}</p>
                  </div>
                  <div className="md:w-1/4">
                    <p className="text-sm text-gray-500 mb-1">Consider</p>
                    <p className="font-bold text-[#FF2D8E] text-lg">{item.then}</p>
                  </div>
                  <div className="md:flex-1">
                    <p className="text-sm text-gray-600">{item.why}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center bg-[#FF2D8E]/5 border border-[#FF2D8E]/20 rounded-2xl p-8">
              <p className="text-lg font-semibold mb-2">Still not sure? That's exactly what a free consultation is for.</p>
              <p className="text-gray-600 mb-6">Our licensed NPs evaluate your anatomy, treatment history, and goals — and tell you exactly which neurotoxin will give you the best result.</p>
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all">Book Free Consultation →</Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">All Five Neurotoxins — FAQs</h2>
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

        <RealPatientReviews service="botox" serviceLabel="Neurotoxin Injections" heading="Real clients. Real results. All five brands." intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />

        {/* CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">We Carry All Five — Let's Find Your Perfect Match</h2>
            <p className="text-xl text-gray-300 mb-8">Botox · Dysport · Jeuveau · Xeomin · Daxxify · Free Consultations · Oswego, IL</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Free Consultation</Link>
              <Link href="/daxxify-oswego-il" className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#FF2D8E] text-[#FF2D8E] font-semibold rounded-xl hover:bg-[#FF2D8E] hover:text-white transition-all text-lg">Learn About Daxxify</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
