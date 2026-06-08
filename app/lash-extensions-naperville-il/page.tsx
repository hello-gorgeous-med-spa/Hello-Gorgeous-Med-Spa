import { Metadata } from 'next';
import Link from 'next/link';
import { SITE, siteJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { RealPatientReviews } from '@/components/RealPatientReviews';
export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Lash Extensions Near Naperville, IL | Classic, Hybrid & Volume | Hello Gorgeous',
  description: 'Lash extensions near Naperville, IL at Hello Gorgeous Med Spa in Oswego — 15 min away. Classic, hybrid & volume sets. Lash Fill Membership $150/mo includes 2 fills + 2 biotin injections.',
  keywords: ['lash extensions naperville il','lash extensions near naperville','eyelash extensions naperville il','lash fills near naperville','volume lashes naperville il','lash membership naperville','best lash extensions near naperville'],
  alternates: { canonical: `${SITE.url}/lash-extensions-naperville-il` },
  openGraph: { type: 'website', url: `${SITE.url}/lash-extensions-naperville-il`, title: 'Lash Extensions Near Naperville, IL | Hello Gorgeous Med Spa', description: 'Classic, hybrid & volume lash extensions 15 min from Naperville. Lash Fill Membership $150/mo.', siteName: SITE.name },
  robots: { index: true, follow: true },
};
const FAQS = [
  { question: 'Where can I get lash extensions near Naperville, IL?', answer: 'Hello Gorgeous Med Spa in Oswego is 15 minutes from Naperville via Route 34. We offer classic, hybrid, and volume lash extension sets, plus lash fills and our Lash Fill Membership at $150/month.' },
  { question: 'What is the Lash Fill Membership for Naperville clients?', answer: 'Our Lash Fill Membership is $150/month and includes 2 lash extension fills + 2 biotin injections per month. Biotin supports lash health from the inside out. Join through the Hello Gorgeous client app.' },
  { question: 'How long do lash extensions last near Naperville?', answer: 'Full sets last 6–8 weeks before a new set is needed. Fills every 2–3 weeks maintain fullness. Our $150/month membership gives you 2 fills monthly — ideal for Naperville-area clients who want consistently gorgeous lashes.' },
];
export default function LashNapervillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', url: SITE.url }, { name: 'Lash Extensions Near Naperville', url: `${SITE.url}/lash-extensions-naperville-il` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('Naperville')) }} />
      <main className="bg-white">
        <section className="bg-black text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#FF2D8E] font-medium mb-3 text-lg">📍 15 Minutes from Naperville</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"><span className="text-[#FF2D8E]">Lash Extensions Near Naperville, IL</span> — Wake Up Beautiful</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">Classic, hybrid & volume lash extensions — <strong className="text-white">15 minutes from Naperville</strong>. Lash Fill Membership <strong className="text-white">$150/month</strong> includes 2 fills + 2 biotin injections every month.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Lash Appointment</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">📞 {SITE.phone}</a>
            </div>
            <p className="text-sm text-gray-400">📍 74 W. Washington Street, Oswego, IL — 15 min from Naperville via Route 34</p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Lash Extensions Near Naperville — FAQs</h2>
            <div className="space-y-6">{FAQS.map((faq, i) => (<div key={i} className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-lg mb-3">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div>))}</div>
          </div>
        </section>
        <RealPatientReviews service="lash" serviceLabel={"Lash Extensions Near Naperville"} heading={"Naperville lash clients love Hello Gorgeous"} intro={`${SITE.reviewCount}+ verified Google reviews · ${SITE.reviewRating} stars`} />
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Book Your Lashes — 15 Min from Naperville</h2>
            <p className="text-xl text-gray-300 mb-8">Lash Fill Membership $150/mo · Classic, Hybrid & Volume · Open 7 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-[#e0267d] transition-all text-lg">Book Online Now</Link>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all text-lg">Call {SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
