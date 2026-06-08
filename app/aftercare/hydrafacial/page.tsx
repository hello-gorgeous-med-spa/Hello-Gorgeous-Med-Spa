import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'HydraFacial Aftercare Instructions | What to Do After HydraFacial | Hello Gorgeous',
  description:
    'Simple HydraFacial aftercare guide from Hello Gorgeous Med Spa in Oswego, IL. Protect your glow and extend your results with these easy post-treatment tips from your provider.',
  keywords: [
    'hydrafacial aftercare',
    'what to do after hydrafacial',
    'hydrafacial aftercare instructions',
    'after hydrafacial tips',
    'hydrafacial recovery',
    'hydrafacial do and donts',
    'can i wear makeup after hydrafacial',
    'hydrafacial aftercare oswego',
    'how to care for skin after hydrafacial',
    'hydrafacial results how long',
    'dermaplaning aftercare',
    'after facial skincare routine',
  ],
  alternates: { canonical: `${SITE.url}/aftercare/hydrafacial` },
  openGraph: {
    type: 'article',
    url: `${SITE.url}/aftercare/hydrafacial`,
    title: 'HydraFacial Aftercare Guide | Hello Gorgeous Med Spa',
    description: 'Simple post-HydraFacial care to protect your glow and extend your results. From our licensed providers in Oswego, IL.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  { question: 'Can I wear makeup after a HydraFacial?', answer: 'Wait at least 6 hours before applying makeup — ideally the rest of the day. Your skin\'s pores are freshly cleared and you want the serums to fully absorb without interference. If you must wear makeup, use mineral products and apply very gently.' },
  { question: 'Can I go in the sun after a HydraFacial?', answer: 'Avoid direct sun exposure for 24 hours and always wear SPF 30+ afterward. Your skin is freshly exfoliated and more susceptible to sun damage. SPF protects your HydraFacial investment.' },
  { question: 'How long do HydraFacial results last?', answer: 'Results are immediately visible and typically last 4–6 weeks with proper skincare. Monthly treatments are ideal for maintaining your glow — which is why we offer the Glow Facial Membership at $99/month.' },
  { question: 'Can I exercise after a HydraFacial?', answer: 'Avoid intense exercise for 24 hours after your HydraFacial. Sweating can irritate freshly treated skin. Light activity is generally fine.' },
  { question: 'What products should I use after a HydraFacial?', answer: 'For the first 24 hours: gentle cleanser, your provided serums or hyaluronic acid, and SPF. Avoid active ingredients like retinol, AHAs, BHAs, and Vitamin C for 24–48 hours post-treatment.' },
  { question: 'Is it normal to be red after a HydraFacial?', answer: 'Mild pinkness for 1–4 hours is normal. Most clients have no visible redness at all. If redness persists beyond 24 hours or you develop a reaction, contact us.' },
  { question: 'When can I get another HydraFacial?', answer: 'Monthly HydraFacials are ideal. Our Glow Facial Membership at $99/month makes monthly treatments easy and affordable — includes HydraFacial + dermaplaning + biotin injection.' },
];

export default function HydrafacialAftercarePage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Aftercare', url: `${SITE.url}/aftercare` },
    { name: 'HydraFacial Aftercare', url: `${SITE.url}/aftercare/hydrafacial` },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">HydraFacial Aftercare Guide</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">The good news — HydraFacial has virtually no downtime. Here's how to protect your glow and get the most out of your treatment.</p>
          </div>
        </section>

        <section className="py-10 bg-[#FF2D8E]/5 border-y border-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-center mb-6">⚡ Quick Reference</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-green-700 mb-3">✅ Do's</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {['Apply provided serums or hyaluronic acid moisturizer', 'Wear SPF 30+ — protect your fresh skin', 'Stay hydrated — inside and out', 'Use gentle cleanser for 24 hours', 'Let your skin breathe — no makeup for 6 hours'].map(i => <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{i}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-red-700 mb-3">❌ Avoid for 24 Hours</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {['Makeup (especially heavy coverage)', 'Direct sun exposure', 'Retinol, AHAs, BHAs, Vitamin C', 'Intense exercise or sweating', 'Saunas, steam rooms, hot tubs', 'Other facial treatments or RF devices'].map(i => <li key={i} className="flex gap-2"><span className="text-red-500">✗</span>{i}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Recovery: Hour by Hour</h2>
            <div className="space-y-6">
              {[
                { period: 'Immediately After', icon: '✨', items: ['Your skin should look and feel amazing — immediate glow!', 'Mild pinkness may be visible for 1–4 hours', 'Pores are freshly cleared and serums are absorbing', 'Avoid touching your face unnecessarily'] },
                { period: 'Hours 1–6', icon: '🧖', items: ['Avoid applying makeup', 'If you had dermaplaning, your skin is especially fresh — protect it', 'Apply a gentle hydrating serum or moisturizer', 'No sun exposure — apply SPF if going outdoors'] },
                { period: 'Hours 6–24', icon: '💧', items: ['You can now apply light makeup if needed', 'Avoid retinol, acids, and exfoliating products tonight', 'Gentle cleanser and moisturizer only', 'Drink plenty of water to support the hydration infusion'] },
                { period: 'Days 2–7', icon: '🌟', items: ['Resume your normal skincare routine', 'Your skin should look its best this week', 'Continue daily SPF', 'Avoid aggressive exfoliants for 48 hours total', 'Notice and enjoy the glow!'] },
                { period: 'Maintain Your Glow', icon: '📅', items: ['Book monthly HydraFacials for best results', 'Consider our Glow Facial Membership at $99/month', 'Includes HydraFacial + dermaplaning + biotin injection monthly', 'Rollover credit applies toward upgrade treatments'] },
              ].map((period) => (
                <div key={period.period} className="border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{period.icon}</span>
                    <h3 className="font-bold text-lg">{period.period}</h3>
                  </div>
                  <ul className="space-y-2">
                    {period.items.map((item) => <li key={item} className="flex items-start gap-2 text-gray-700 text-sm"><span className="text-[#FF2D8E] mt-0.5">→</span>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">HydraFacial Aftercare — FAQs</h2>
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

        <section className="py-16 bg-gradient-to-br from-[#FF2D8E]/10 to-[#FF2D8E]/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Keep the Glow Going — $99/Month</h2>
            <p className="text-gray-600 mb-8 text-lg">Monthly HydraFacial + dermaplaning + biotin injection. Rollover credit. Join in the app.</p>
            <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Join Glow Facial Membership →</Link>
          </div>
        </section>

        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Get Aftercare Reminders in the App</h2>
            <p className="text-xl text-gray-300 mb-8">We automatically send Day 1 and Day 3 check-in notifications after your HydraFacial. Download the Hello Gorgeous client app.</p>
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
