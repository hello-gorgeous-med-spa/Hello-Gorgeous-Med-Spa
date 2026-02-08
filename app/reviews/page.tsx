import type { Metadata } from "next";

import { ReviewsList } from "@/components/ReviewsList";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL, REVIEWS_URL } from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Reviews",
  description: `See what clients say about Hello Gorgeous Med Spa. Read our reviews or leave one after your visit. Oswego, Naperville, Aurora & surrounding areas.`,
  path: "/reviews",
});

export default function ReviewsPage() {
  const absoluteReviewsUrl =
    REVIEWS_URL.startsWith("http") ? REVIEWS_URL : `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.hellogorgeousmedspa.com"}${REVIEWS_URL}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(absoluteReviewsUrl)}`;

  return (
    <>
      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              CLIENT FEEDBACK
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Our reviews
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              We’re proud of what our clients say. Read their feedback below or leave one
              after your visit—your voice helps others in Oswego, Naperville, Aurora, and
              the surrounding area find us.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-2xl font-bold text-white mb-6">Client feedback</h2>
          <ReviewsList />
        </FadeUp>
      </Section>

      <Section id="leave-review">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Our reviews
              </h2>
              <p className="text-gray-300 mb-6">
                See what clients are saying and leave a review after your appointment. Your
                feedback helps others find us and means the world to our team.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href={REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                >
                  <span>★</span> See our reviews
                </a>
                <a
                  href={REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all"
                >
                  Leave a review
                </a>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Same link for reading and leaving reviews. Thank you for supporting our
                small business!
              </p>
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Scan to open reviews</h3>
              <p className="text-gray-400 text-sm mb-6">
                Use your phone camera to scan and open our reviews page
              </p>
              <div className="inline-block p-4 bg-white rounded-2xl">
                <img
                  src={qrCodeUrl}
                  alt="QR code to Hello Gorgeous Med Spa reviews"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <div className="rounded-2xl border border-gray-800 bg-black/40 p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              After your appointment
            </h2>
            <p className="text-gray-300">
              We may send you a follow-up with a direct link to leave a review. You can also
              use this page or the link above anytime—we appreciate every piece of feedback.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book your next visit
              </CTA>
              <CTA href="/contact" variant="outline">
                Contact us
              </CTA>
            </div>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
