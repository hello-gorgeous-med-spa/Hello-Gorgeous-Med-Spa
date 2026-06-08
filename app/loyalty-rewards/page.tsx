import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Loyalty Rewards Program | Bronze, Gold & Platinum | Hello Gorgeous Med Spa',
  description:
    'Earn rewards on every visit at Hello Gorgeous Med Spa in Oswego, IL. Bronze, Gold, and Platinum tiers with real perks. Refer a friend and you both get $25. Join the client app.',
  keywords: [
    'med spa loyalty program oswego il',
    'med spa rewards program',
    'hello gorgeous rewards',
    'med spa membership rewards',
    'earn points med spa',
    'med spa loyalty program near me',
    'refer a friend med spa',
    'med spa referral program oswego',
    'best med spa loyalty program illinois',
    'med spa vip program oswego',
    'client rewards medical spa',
    'med spa perks oswego il',
  ],
  alternates: { canonical: `${SITE.url}/loyalty-rewards` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/loyalty-rewards`,
    title: 'Loyalty Rewards Program | Hello Gorgeous Med Spa Oswego, IL',
    description: 'Bronze, Gold & Platinum loyalty tiers. Refer a friend, you both get $25. Exclusive app-only perks. Join free.',
    siteName: SITE.name,
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: 'How does the Hello Gorgeous loyalty program work?',
    answer: 'Every visit counts toward your lifetime visit total. Reach 5 visits and you unlock Gold tier — reach 15 and you\'re Platinum. Each tier unlocks new perks, discounts, and exclusive benefits. Track your tier in the free client app.',
  },
  {
    question: 'What are the loyalty tier perks at Hello Gorgeous?',
    answer: 'Bronze (0+ visits): priority booking, birthday offers, app-exclusive deals. Gold (5+ visits): 10% member pricing, early access to new treatments, complimentary consultations. Platinum (15+ visits): complimentary add-ons, VIP event invitations, dedicated concierge support.',
  },
  {
    question: 'How does the referral program work?',
    answer: 'Every client receives a unique referral link in the Hello Gorgeous app. When a friend uses your link and books their first appointment, you both receive $25 credit toward any service.',
  },
  {
    question: 'How do I access my loyalty tier and referral link?',
    answer: 'Download the Hello Gorgeous client app at hellogorgeousmedspa.com/app. Your tier status, referral link, and reward points are all in the "Me" tab.',
  },
  {
    question: 'Does loyalty status reset?',
    answer: 'No — your lifetime visit count never resets. Once you reach Gold or Platinum, you keep those perks as long as you remain an active client.',
  },
  {
    question: 'Can I use my referral credit on any service?',
    answer: 'Yes — the $25 referral credit applies to any service at Hello Gorgeous Med Spa. Your friend\'s $25 credit also applies to their first booking.',
  },
];

const TIERS = [
  {
    id: 'bronze',
    emoji: '🥉',
    name: 'Bronze Member',
    visits: '0+ Visits',
    color: '#cd7f32',
    border: 'border-[#cd7f32]/40',
    bg: 'bg-[#cd7f32]/5',
    perks: [
      'Priority booking access',
      'Birthday month exclusive offers',
      'App-only flash deals',
      'Reward points on every visit',
      'Aftercare push notifications',
    ],
  },
  {
    id: 'gold',
    emoji: '🥇',
    name: 'Gold Member',
    visits: '5+ Visits',
    color: '#f59e0b',
    border: 'border-[#f59e0b]/50',
    bg: 'bg-[#f59e0b]/5',
    featured: true,
    perks: [
      'Everything in Bronze',
      '10% member pricing on select services',
      'Early access to new treatments',
      'Complimentary skin consultations',
      'Exclusive monthly Gold-only deals',
    ],
  },
  {
    id: 'platinum',
    emoji: '💎',
    name: 'Platinum Member',
    visits: '15+ Visits',
    color: '#7B4FFF',
    border: 'border-[#7B4FFF]/50',
    bg: 'bg-[#7B4FFF]/5',
    perks: [
      'Everything in Gold',
      'Complimentary add-ons with qualifying treatments',
      'VIP event invitations',
      'Dedicated concierge support',
      'Best-of-the-best exclusive offers',
    ],
  },
];

export default function LoyaltyRewardsPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE.url },
    { name: 'Loyalty Rewards', url: `${SITE.url}/loyalty-rewards` },
  ];

  const programSchema = {
    '@context': 'https://schema.org',
    '@type': 'LoyaltyProgram',
    name: 'Hello Gorgeous Med Spa Loyalty Program',
    description: 'Bronze, Gold, and Platinum loyalty tiers for Hello Gorgeous Med Spa clients in Oswego, IL. Earn rewards on every visit and refer friends for $25 credit.',
    provider: {
      '@type': 'MedicalBusiness',
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(programSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center gap-3 text-4xl mb-6">🥉🥇💎</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Rewards That <span className="text-[#FF2D8E]">Grow With You</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Every visit to Hello Gorgeous Med Spa earns you status. Bronze, Gold, and Platinum tiers unlock exclusive perks, member pricing, and VIP access — the more you come, the more you get.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">
                Join Free in the App
              </Link>
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">
                Book Your Next Visit
              </Link>
            </div>
          </div>
        </section>

        {/* Tier cards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Your Loyalty Tiers</h2>
            <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">Tiers are based on lifetime visits and never reset. Unlock the next tier and keep every perk from the one before.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {TIERS.map((tier) => (
                <div key={tier.id} className={`relative rounded-2xl border-2 p-8 ${tier.border} ${tier.bg} ${tier.featured ? 'shadow-xl scale-105' : ''}`}>
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-[#f59e0b] text-black text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <span className="text-5xl">{tier.emoji}</span>
                    <h3 className="text-2xl font-bold mt-3" style={{ color: tier.color }}>{tier.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tier.visits}</p>
                  </div>
                  <ul className="space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-gray-700">
                        <span style={{ color: tier.color }} className="font-bold mt-0.5">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Referral section */}
        <section className="py-20 bg-gradient-to-br from-[#7B4FFF]/10 to-[#FF2D8E]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-5xl mb-6 block">💜</span>
            <h2 className="text-3xl font-bold mb-4">Refer a Friend — You Both Get $25</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Every Hello Gorgeous client gets a unique referral link in the app. Share it — when your friend books their first appointment, <strong>you get $25 credit</strong> and so do they. No limits.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                <div className="text-center">
                  <p className="text-4xl font-black text-[#7B4FFF]">$25</p>
                  <p className="text-sm text-gray-500 mt-1">You get</p>
                </div>
                <div className="text-3xl text-gray-300">+</div>
                <div className="text-center">
                  <p className="text-4xl font-black text-[#FF2D8E]">$25</p>
                  <p className="text-sm text-gray-500 mt-1">Your friend gets</p>
                </div>
              </div>
            </div>
            <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 bg-[#7B4FFF] text-white font-semibold rounded-xl hover:bg-[#6b3fff] transition-all text-lg">
              Get Your Referral Link in the App →
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-14">How to Join & Start Earning</h2>
            <div className="grid md:grid-cols-3 gap-10 text-center">
              {[
                { step: '1', icon: '📱', title: 'Download the App', desc: 'Visit hellogorgeousmedspa.com/app on your phone and add it to your home screen. Log in to your portal to unlock your tier and referral link.' },
                { step: '2', icon: '💉', title: 'Book & Visit', desc: 'Every appointment you complete counts toward your lifetime visit total. Watch your tier climb with each visit.' },
                { step: '3', icon: '🎁', title: 'Unlock Perks', desc: 'Perks activate automatically at 5 visits (Gold) and 15 visits (Platinum). Referral credits are applied within 24 hours of a friend\'s first booking.' },
              ].map((s) => (
                <div key={s.step}>
                  <div className="w-16 h-16 bg-[#FF2D8E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{s.icon}</span>
                  </div>
                  <div className="w-8 h-8 bg-[#FF2D8E] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-sm">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Loyalty Program FAQs</h2>
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

        {/* CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Earning Today — It's Free</h2>
            <p className="text-xl text-gray-300 mb-8">Every visit counts. Bronze starts immediately. Gold at 5 visits. Platinum at 15. Your status never expires.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Join Free in the App</Link>
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Book Your Next Visit</Link>
            </div>
            <p className="mt-6 text-gray-500 text-sm">📍 74 W. Washington Street, Oswego, IL 60543 · {SITE.phone}</p>
          </div>
        </section>
      </main>
    </>
  );
}
