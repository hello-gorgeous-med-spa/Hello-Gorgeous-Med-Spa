import { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/flows';
import { faqJsonLd } from '@/lib/seo';

/** Update each spring campaign season */
const OFFER_BOOK_BY = "March 31, 2026";
const SESSION_MONTHS = "April · May · June 2026";

export const metadata: Metadata = {
  title: `Brazilian Laser Hair Removal Spring Special — 3 Sessions $499 | Hello Gorgeous Oswego IL`,
  description: `Best laser hair removal deal of the season: Brazilian package — 3 sessions (${SESSION_MONTHS}) for $499. Book by ${OFFER_BOOK_BY} for a FREE small area each visit. Medical-grade laser, NP on site. Oswego, Aurora, Naperville.`,
  keywords: [
    "Brazilian laser hair removal Oswego",
    "laser hair removal spring special",
    "laser hair removal package Oswego IL",
    "medical laser hair removal Aurora",
    "Hello Gorgeous laser hair",
  ],
  alternates: { canonical: `${SITE.url}/spring-special-laser-hair` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/spring-special-laser-hair`,
    title: "Spring Special — Brazilian Laser | 3 Sessions $499 | Hello Gorgeous",
    description: `Brazilian laser 3-session package. Book by ${OFFER_BOOK_BY}. Medical-grade device. Oswego, IL.`,
    images: [{ url: `${SITE.url}/images/laser/laser-hair-removal-results.png`, width: 1200, height: 630 }],
  },
};

const SPRING_SPECIAL_FAQS = [
  {
    question: "What’s included in the $499 Brazilian package?",
    answer:
      "Three Brazilian laser hair removal sessions scheduled across April, May, and June — one session per month — for $499 total. It’s our strongest seasonal value for that area.",
  },
  {
    question: "What is the free small-area bonus?",
    answer:
      `Clients who book this offer by ${OFFER_BOOK_BY} receive a FREE small area add-on at every session — choose underarms, lip, chin, or bikini line (as offered for this promotion). Ask at booking so we can note your choice.`,
  },
  {
    question: "What if I’m not smooth after 3 sessions?",
    answer:
      "If you’re not where we expect after your three included sessions, we include a complimentary touch-up as described when you book — we stand behind our process.",
  },
  {
    question: "Is this a spa laser or a medical laser?",
    answer:
      "We use medical-grade laser technology with full clinical oversight — not a basic spa device. Our nurse practitioner is on site for medical leadership every day we’re treating patients.",
  },
  {
    question: "Where is Hello Gorgeous?",
    answer:
      "74 W Washington St, Oswego, IL 60543. We serve Oswego, Aurora, Naperville, Plainfield, Yorkville, Montgomery, and nearby.",
  },
];

export default function SpringSpecialLaserHairPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(SPRING_SPECIAL_FAQS)) }}
      />
      <main className="bg-white">
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#FF2D8E25_0%,_transparent_55%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E] text-white text-sm font-bold mb-5">
              Spring special — limited time
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Brazilian laser hair removal —{" "}
              <span className="text-[#FF2D8E]">3-month package</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-2 max-w-2xl mx-auto">
              {SESSION_MONTHS} — all three sessions included.
            </p>
            <p className="text-3xl md:text-4xl font-bold text-white mb-8">
              Only <span className="text-[#FF2D8E]">$499</span> for all 3 months
            </p>

            <div className="max-w-xl mx-auto text-left rounded-2xl bg-white/10 border border-white/20 p-6 mb-10 space-y-4 text-gray-200 text-sm md:text-base">
              <p>
                <strong className="text-white">Book by {OFFER_BOOK_BY}</strong> — get a{" "}
                <strong className="text-white">FREE small area</strong> added to every session (underarms, lip, chin, or bikini line — your choice).
              </p>
              <p>
                <strong className="text-white">Not smooth after 3 sessions?</strong> We&apos;ll do a{" "}
                <strong className="text-white">FREE touch-up</strong>. Period.
              </p>
              <p className="text-gray-400 text-sm">
                Medical-grade laser with full clinical oversight — Class 4 medical device, not a spa toy. Your results are backed by our{" "}
                <strong className="text-white">NP on site</strong> every day we&apos;re treating.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition text-lg"
              >
                Book now — Fresha
              </a>
              <a
                href={`tel:${SITE.phone.replace(/-/g, "")}`}
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition text-lg"
              >
                Call {SITE.phone}
              </a>
            </div>
            <p className="mt-6 text-gray-400 text-sm">
              74 W. Washington St., Oswego, IL — Appointments first come, first served
            </p>
          </div>
        </section>

        <section className="py-14 px-4 bg-gray-50 border-y border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Summer-ready skin</h2>
            <p className="text-gray-700 text-lg">
              Stop shaving. Stop waxing. Three strategic sessions through spring get you on track for smooth skin when it counts — with a team that treats laser like medicine, not a coupon.
            </p>
            <p className="mt-6">
              <Link href="/laser-hair-memberships" className="text-[#FF2D8E] font-semibold hover:underline">
                See laser memberships &amp; other areas →
              </Link>
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-black text-center mb-10">Questions</h2>
            <div className="space-y-4">
              {SPRING_SPECIAL_FAQS.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold text-black mb-2">{faq.question}</h3>
                  <p className="text-gray-700 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-r from-[#FF2D8E] to-[#E91E8C]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Grab your spot</h2>
            <p className="text-white/90 mb-8">Brazilian 3-session package · $499 · Book by {OFFER_BOOK_BY} for the free small-area bonus</p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#FF2D8E] font-bold rounded-xl hover:bg-gray-100 transition text-lg"
            >
              Book on Fresha →
            </a>
            <p className="mt-6 text-white/80 text-sm">
              <Link href="/laser-hair-removal-oswego-il" className="underline">
                Laser hair removal Oswego
              </Link>
              {" · "}
              <Link href="/laser-hair-removal-aurora-il" className="underline">
                Aurora
              </Link>
              {" · "}
              <Link href="/laser-hair-removal-naperville-il" className="underline">
                Naperville
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
