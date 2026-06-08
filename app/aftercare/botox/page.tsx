import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Botox Aftercare Instructions | What to Do After Botox | Hello Gorgeous Med Spa',
  description:
    'Complete Botox aftercare guide from Hello Gorgeous Med Spa in Oswego, IL. What to do and avoid after Botox for the best results — day by day instructions from your NP.',
  keywords: [
    'botox aftercare',
    'what to do after botox',
    'botox aftercare instructions',
    'botox recovery tips',
    'after botox care',
    'botox do and donts',
    'how long after botox can i exercise',
    'can i lay down after botox',
    'botox aftercare oswego il',
    'after botox what not to do',
    'botox healing process',
    'botox results timeline',
  ],
  alternates: { canonical: `${SITE.url}/aftercare/botox` },
  openGraph: {
    type: 'article',
    url: `${SITE.url}/aftercare/botox`,
    title: 'Botox Aftercare Guide | Hello Gorgeous Med Spa',
    description: 'Day-by-day Botox aftercare instructions from our licensed NPs. Maximize your results and avoid common mistakes.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'Can I lay down after Botox?',
    answer: 'Avoid lying down for at least 4 hours after Botox injections. This prevents the toxin from migrating to unintended areas before it fully binds to the muscle.',
  },
  {
    question: 'Can I exercise after Botox?',
    answer: 'Avoid strenuous exercise for 24 hours after Botox. Exercise increases blood flow and may cause the Botox to disperse before it sets properly.',
  },
  {
    question: 'When will I see Botox results?',
    answer: 'Botox typically begins working within 3–5 days, with full results visible at 10–14 days. If you notice asymmetry after day 14, contact us — we\'ll assess whether a touch-up is appropriate.',
  },
  {
    question: 'Can I wear makeup after Botox?',
    answer: 'Avoid applying makeup or touching your face for at least 4 hours after treatment. After that, apply products gently without rubbing the injected areas.',
  },
  {
    question: 'What should I avoid after Botox?',
    answer: 'For 24 hours after Botox: avoid alcohol, exercise, facials, heat (saunas, hot tubs), lying down, rubbing the treated area, and blood-thinning medications (if applicable). Sleep face-up the first night.',
  },
  {
    question: 'Should I massage the area after Botox?',
    answer: 'Do NOT massage Botox injection sites. This can cause the toxin to spread to unintended muscles. If there\'s visible bruising, gentle cold compress (no pressure) is fine.',
  },
  {
    question: 'How long does Botox last?',
    answer: 'Botox typically lasts 3–4 months. First-time patients may notice it wearing off a bit sooner. Consistent treatments often last longer over time.',
  },
  {
    question: 'I have a small bump at the injection site — is that normal?',
    answer: 'Small bumps at injection sites are completely normal and typically resolve within 20–30 minutes. If swelling, redness, or asymmetry persists beyond a week, contact us.',
  },
];

const TIMELINE = [
  { day: 'Day 0 (Treatment Day)', icon: '💉', instructions: ['Stay upright for 4 hours — no lying down', 'No exercise or physical exertion', 'No alcohol', 'No rubbing or touching injection sites', 'Gentle cold compress (no pressure) if needed for bruising', 'Mild redness and small bumps are normal and will resolve'] },
  { day: 'Days 1–3', icon: '😌', instructions: ['You can resume normal daily activities', 'Avoid facials, massages, or laser treatments on the face', 'Avoid saunas, hot yoga, and steam rooms', 'Some patients notice early onset — full results take longer', 'Small bruises may still be visible — this is normal'] },
  { day: 'Days 3–7', icon: '✨', instructions: ['Botox begins visibly activating', 'You may see full range of movement still — this is normal', 'Avoid any head-down yoga poses or inversions', 'Continue avoiding facials and RF treatments in treated areas'] },
  { day: 'Days 7–14', icon: '🌟', instructions: ['Full results become visible by day 10–14', 'Evaluate symmetry and overall results', 'If asymmetry is noted after day 14, contact us for a touch-up assessment', 'Enjoy your results!'] },
  { day: 'Months 3–4', icon: '📅', instructions: ['Results begin to naturally fade', 'Book your follow-up appointment before they fully wear off', 'Consistent treatments may help results last longer over time', 'We\'ll send you a reminder through the Hello Gorgeous app'] },
];

export default function BotoxAftercarePage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Aftercare', url: `${SITE.url}/aftercare` },
    { name: 'Botox Aftercare', url: `${SITE.url}/aftercare/botox` },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Botox Aftercare Instructions',
    description: 'Complete day-by-day Botox aftercare guide from Hello Gorgeous Med Spa in Oswego, IL.',
    author: { '@type': 'MedicalBusiness', name: SITE.name, url: SITE.url },
    about: { '@type': 'MedicalProcedure', name: 'Botox Injections' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />

      <main className="bg-white">
        <section className="bg-black text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#FF2D8E] font-medium mb-3">Hello Gorgeous Med Spa · Oswego, IL</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Botox Aftercare Guide</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to know to protect your results and heal beautifully — straight from our licensed nurse practitioners.
            </p>
          </div>
        </section>

        {/* Quick reference */}
        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-center mb-6">⚡ Quick Reference: Do's & Don'ts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-green-700 mb-3">✅ Do's</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {['Stay upright for 4 hours after treatment', 'Apply gentle cold compress for bruising (no pressure)', 'Sleep on your back the first night', 'Keep facial expressions normal (smiling, frowning is fine)', 'Contact us with any concerns'].map(item => <li key={item} className="flex gap-2"><span className="text-green-500">✓</span>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-red-700 mb-3">❌ Don'ts (First 24 Hours)</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {['Lie down or do inversions', 'Exercise or do strenuous activity', 'Drink alcohol', 'Rub or massage injection sites', 'Get a facial, massage, or RF treatment', 'Use a sauna, hot tub, or steam room'].map(item => <li key={item} className="flex gap-2"><span className="text-red-500">✗</span>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Day-by-Day Botox Recovery Timeline</h2>
            <div className="space-y-8">
              {TIMELINE.map((period) => (
                <div key={period.day} className="border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{period.icon}</span>
                    <h3 className="font-bold text-lg">{period.day}</h3>
                  </div>
                  <ul className="space-y-2">
                    {period.instructions.map((inst) => (
                      <li key={inst} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-[#FF2D8E] mt-0.5">→</span>{inst}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Botox Aftercare — FAQs</h2>
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
            <h2 className="text-3xl font-bold mb-6">Get Aftercare Reminders in the App</h2>
            <p className="text-xl text-gray-300 mb-8">We automatically send post-treatment push notifications at Day 1, 3, and 7 to keep you on track. Download the Hello Gorgeous client app.</p>
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
