import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { RealPatientReviews } from '@/components/RealPatientReviews';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Men's Wellness at Hello Gorgeous Med Spa | Brotox, Hormones & Peptides | Oswego IL",
  description:
    'Hello Gorgeous Med Spa offers Brotox, hormone optimization, peptide therapy & men\'s wellness in Oswego IL. Look sharp. Feel stronger. Lab-guided care for men.',
  keywords: [
    'brotox oswego il',
    'mens botox near me',
    'mens hormone therapy oswego',
    'TRT oswego il',
    'peptide therapy men',
    'mens med spa near me',
    'mens wellness chicago suburbs',
  ],
  alternates: { canonical: `${SITE.url}/mens-wellness` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/mens-wellness`,
    title: "Men's Wellness | Brotox, Hormones & Peptides | Hello Gorgeous Med Spa",
    description: 'Brotox, hormone optimization, peptide therapy & men\'s wellness in Oswego IL. Look sharp. Feel stronger.',
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

const GIFT_CARD_URL = 'https://app.squareup.com/gift/T47CHJDW8177K/order';

const SERVICES = [
  {
    icon: '💉',
    title: 'Brotox',
    subtitle: 'Botox for Men',
    tagline: 'Soften lines. Look rested. Own the room.',
    href: '/brotox',
    external: false,
  },
  {
    icon: '🧬',
    title: 'Hormone Optimization',
    subtitle: 'TRT & Hormone Care',
    tagline: 'Energy, strength, libido, mood. Lab-guided TRT & hormone care.',
    href: '/mens-hormones',
    external: false,
  },
  {
    icon: '⚡',
    title: 'Peptide Therapy',
    subtitle: 'Performance & Recovery',
    tagline: 'Recovery, performance, longevity. Peptides for men who want more.',
    href: '/peptide-therapy-men',
    external: false,
  },
  {
    icon: '🎁',
    title: 'Brotox Gift Card',
    subtitle: 'The Perfect Gift',
    tagline: 'Give the gift of confidence. Perfect for dads, husbands & boyfriends.',
    href: GIFT_CARD_URL,
    external: true,
  },
];

const WHY_CHOOSE = [
  {
    title: 'Private & Judgment-Free',
    description: "No awkward gym talk. No judgment. Just results-focused care in a comfortable, confidential environment designed for real people.",
  },
  {
    title: 'Licensed NP Injectors',
    description: 'Every treatment is performed by licensed nurse practitioners — medical professionals who know anatomy, dosing, and how to deliver natural-looking outcomes.',
  },
  {
    title: 'Lab-Guided Wellness Plans',
    description: 'Hormone and peptide protocols are built around your actual lab results, not guesswork. You get a plan tailored to your biology.',
  },
];

const FAQS = [
  {
    question: 'What is Brotox?',
    answer: 'Brotox is simply Botox designed and dosed specifically for men. Men typically have stronger facial muscles and require more units than women. The goal is always natural-looking results — rested and sharp, not frozen.',
  },
  {
    question: 'Does Botox for men look natural?',
    answer: 'Yes — when done correctly by an experienced injector. Our licensed NPs use conservative dosing strategies tailored to male facial anatomy so results look natural. Most people will just think you look well-rested.',
  },
  {
    question: 'What is hormone optimization for men?',
    answer: 'Hormone optimization (including TRT — testosterone replacement therapy) addresses low testosterone and other hormonal imbalances that cause fatigue, low libido, weight gain, mood issues, and reduced performance. We start with comprehensive lab work and build a personalized protocol.',
  },
  {
    question: 'What are peptides and what can they do for men?',
    answer: 'Peptides are short chains of amino acids that signal your body to perform specific functions — like boosting growth hormone, accelerating recovery, improving sleep, or enhancing fat metabolism. They are often used by men who want to optimize performance, recovery, and longevity.',
  },
  {
    question: 'Is it awkward for men at a med spa?',
    answer: "Not here. We see men regularly and our team is experienced, professional, and judgment-free. You'll be treated like any other patient focused on looking and feeling their best.",
  },
  {
    question: 'How do I get started with men\'s wellness at Hello Gorgeous?',
    answer: "Book a men's wellness consultation online or call us at (630) 636-6193. We'll go over your goals, review your health history, and recommend the right starting point — whether that's Brotox, a hormone panel, peptides, or a combination.",
  },
];

export default function MensWellnessPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: "Men's Wellness", url: `${SITE.url}/mens-wellness` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Oswego')) }} />

      <main className="bg-gray-950 text-white">
        {/* ── HERO ── */}
        <section
          className="relative py-24 lg:py-36 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,45,142,0.1) 0%, transparent 50%), #030712',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-4">
              Hello Gorgeous Med Spa · Oswego, IL
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
              Gorgeous{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #FF2D8E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                for Him.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
              Brotox · Hormones · Peptides · Recovery — designed for men who want to look sharp and feel stronger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                Book a Men&apos;s Consult
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all text-lg"
              >
                See All Men&apos;s Services
              </a>
            </div>
          </div>
        </section>

        {/* ── SERVICES GRID ── */}
        <section id="services" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Men&apos;s Wellness Services</h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Medical-grade treatments and therapies designed around how men look, feel, and perform.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((svc) => {
                const Tag = svc.external ? 'a' : Link;
                const props = svc.external
                  ? { href: svc.href, target: '_blank', rel: 'noopener noreferrer' }
                  : { href: svc.href };
                return (
                  // @ts-expect-error mixed anchor / Link props
                  <Tag
                    key={svc.title}
                    {...props}
                    className="group block bg-gray-900 border border-gray-800 hover:border-[#FF2D8E] rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-pink-900/20"
                  >
                    <div className="text-4xl mb-4">{svc.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FF2D8E] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-blue-400 text-sm font-medium mb-3">{svc.subtitle}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{svc.tagline}</p>
                    <p className="text-[#FF2D8E] text-sm font-semibold mt-4 group-hover:underline">
                      {svc.external ? 'Buy Gift Card →' : 'Learn More →'}
                    </p>
                  </Tag>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── WHY MEN CHOOSE US ── */}
        <section className="py-20 lg:py-28 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Why Men Choose Hello Gorgeous
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {WHY_CHOOSE.map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-1 bg-[#FF2D8E] mx-auto mb-6 rounded" />
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FATHER'S DAY / GIFT SECTION ── */}
        <section
          className="py-20 lg:py-28 overflow-hidden relative"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(255,45,142,0.12) 0%, transparent 60%), #030712',
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#FF2D8E] font-semibold uppercase tracking-widest text-sm mb-4">
              Father&apos;s Day · Birthdays · Just Because
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Skip the Tie.
              <br />
              <span className="text-[#FF2D8E]">Gift the Confidence.</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Brotox gift cards, men&apos;s wellness consults, and hormone optimization sessions make genuinely useful gifts. He&apos;ll actually use it — and thank you for it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={GIFT_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
              >
                🎁 Gift Brotox Today
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all text-lg"
              >
                Gift a Consult
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 lg:py-28 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Men&apos;s Wellness FAQ
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RealPatientReviews />
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section
          className="py-20 lg:py-28 text-center"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%), #030712',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Feel Like{' '}
              <span className="text-[#FF2D8E]">Yourself Again?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              One consultation. Real answers. A plan built around you.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-xl"
            >
              Book Men&apos;s Consult
            </a>
            <p className="text-gray-500 text-sm mt-6">
              74 W. Washington St, Oswego IL · (630) 636-6193
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
