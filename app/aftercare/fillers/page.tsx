import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dermal Filler Aftercare Instructions | What to Do After Fillers | Hello Gorgeous',
  description:
    'Complete dermal filler aftercare guide from Hello Gorgeous Med Spa in Oswego, IL. What to expect after lip fillers, cheek fillers & more — day-by-day instructions from your NP.',
  keywords: [
    'dermal filler aftercare',
    'lip filler aftercare',
    'what to do after fillers',
    'filler aftercare instructions',
    'after filler swelling',
    'lip filler healing process',
    'filler aftercare tips',
    'after cheek filler what to expect',
    'filler bruising normal',
    'how long does filler swelling last',
    'filler aftercare oswego il',
    'what not to do after fillers',
  ],
  alternates: { canonical: `${SITE.url}/aftercare/fillers` },
  openGraph: {
    type: 'article',
    url: `${SITE.url}/aftercare/fillers`,
    title: 'Dermal Filler Aftercare Guide | Hello Gorgeous Med Spa',
    description: 'Day-by-day filler aftercare from our licensed NPs. Maximize results, minimize swelling, and know what\'s normal.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'How long does filler swelling last?', answer: 'Initial swelling is most significant in the first 24–72 hours. For lip fillers, you may see 50–100% more volume than your final result in the first day or two. Most swelling resolves by days 3–5, with full final results visible at 2–4 weeks.' },
  { question: 'Is bruising normal after fillers?', answer: 'Yes — bruising is completely normal and expected, especially with lip fillers. Most bruising resolves within 5–10 days. Arnica gel or supplements can help speed healing.' },
  { question: 'Can I wear makeup after fillers?', answer: 'Wait at least 4 hours before applying makeup to treated areas. Apply gently without rubbing or pressing on injection sites. Mineral makeup is gentler for sensitive post-treatment skin.' },
  { question: 'When can I exercise after fillers?', answer: 'Avoid strenuous exercise for 24 hours after filler injections. Exercise increases blood flow and can worsen swelling and bruising.' },
  { question: 'Should I ice my lips after filler?', answer: 'Yes — gentle icing (wrapped in cloth, no direct contact) for 10 minutes on, 10 off can help reduce swelling in the first few hours. Do not apply direct pressure.' },
  { question: 'My filler feels lumpy — is that normal?', answer: 'Yes, lumps and firmness are completely normal in the first 1–2 weeks as filler integrates with tissue. Most resolve naturally. If lumps persist beyond 4 weeks, contact us for assessment.' },
  { question: 'When will I see my final filler results?', answer: 'Full integration and final results are visible at 2–4 weeks after treatment. Swelling can make the area appear overfilled initially — be patient.' },
  { question: 'Can I get a massage or facial after fillers?', answer: 'Avoid facial massages, RF treatments, ultrasound facials, and any pressure on treated areas for at least 2 weeks after filler injections.' },
];

const TIMELINE = [
  { day: 'Day 0 (Treatment Day)', icon: '💉', instructions: ['Stay upright for 4 hours after treatment', 'Apply gentle ice/cold compress (no direct pressure) to reduce swelling', 'Avoid alcohol — increases bruising and swelling', 'No exercise or strenuous activity', 'Expect significant swelling — this is NORMAL, especially with lips', 'Do not massage or rub treated areas', 'Avoid extreme heat: saunas, hot yoga, hot showers', 'Sleep elevated if possible'] },
  { day: 'Days 1–3 (Peak Swelling)', icon: '🌊', instructions: ['Swelling is at its peak — do not panic about volume', 'Lips may look 2x your desired result — this is normal', 'Continue gentle icing for the first 24 hours', 'Arnica gel applied gently can help bruising', 'Avoid blood-thinning medications if possible', 'No facial massages or RF treatments', 'You may have asymmetry during this phase — filler is still settling'] },
  { day: 'Days 3–7', icon: '📉', instructions: ['Swelling begins to noticeably subside', 'Bruising continues to fade', 'Results starting to look more like your final outcome', 'Firmness and mild lumps are still normal', 'Resume normal skincare gently', 'Continue avoiding high-pressure facials and massages'] },
  { day: 'Weeks 1–2', icon: '✨', instructions: ['Most swelling and bruising fully resolved', 'Getting much closer to final result', 'If you still see lumps, most will continue to soften', 'You can resume RF facials and normal treatments', 'Evaluate your results — if asymmetry is significant, reach out'] },
  { day: 'Weeks 2–4 (Final Results)', icon: '🌟', instructions: ['Final results are visible — filler fully integrated', 'This is your true result', 'If you have concerns about symmetry or volume, contact us', 'Schedule your next appointment to maintain results', 'Most fillers last 6–18 months depending on area and product used'] },
];

export default function FillerAftercarePage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Aftercare', url: `${SITE.url}/aftercare` },
    { name: 'Filler Aftercare', url: `${SITE.url}/aftercare/fillers` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#FF2D8E] font-medium mb-3">Hello Gorgeous Med Spa · Oswego, IL</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Dermal Filler Aftercare Guide</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">What to expect, what to do, and what to avoid — day by day, from our licensed NPs who did your treatment.</p>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-center mb-6">⚡ Quick Reference: Do's & Don'ts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-green-700 mb-3">✅ Do's</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {['Apply gentle cold compress for swelling (no pressure)', 'Stay hydrated — hydration helps healing', 'Sleep elevated first night if lips were treated', 'Apply arnica gel to help bruising fade faster', 'Contact us with any questions or concerns'].map(i => <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{i}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-red-700 mb-3">❌ Don'ts (First 24–48 Hours)</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {['Drink alcohol', 'Exercise or do strenuous activity', 'Touch, rub, or massage treated areas', 'Apply direct heat (sauna, steam, hot shower)', 'Get a facial, massage, or RF treatment', 'Take blood-thinning medications if avoidable'].map(i => <li key={i} className="flex gap-2"><span className="text-red-500">✗</span>{i}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Day-by-Day Filler Recovery Timeline</h2>
            <div className="space-y-8">
              {TIMELINE.map((period) => (
                <div key={period.day} className="border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{period.icon}</span>
                    <h3 className="font-bold text-lg">{period.day}</h3>
                  </div>
                  <ul className="space-y-2">
                    {period.instructions.map((inst) => <li key={inst} className="flex items-start gap-2 text-gray-700 text-sm"><span className="text-[#FF2D8E] mt-0.5">→</span>{inst}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Filler Aftercare — FAQs</h2>
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
            <h2 className="text-3xl font-bold mb-6">Get Aftercare Reminders Automatically</h2>
            <p className="text-xl text-gray-300 mb-8">We send Day 1, 3, and 7 push notifications to keep you on track with your healing. Download the Hello Gorgeous client app.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Get the App</Link>
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Book Next Appointment</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
