import type { Metadata } from "next";
import Image from "next/image";

import { ReviewsList } from "@/components/ReviewsList";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";

const GOOGLE_REVIEW_URL = "https://g.page/r/CYQOWmT_HcwQEBM/review";

export const metadata: Metadata = pageMetadata({
  title: "Reviews",
  description: `See what clients say about Hello Gorgeous Med Spa. Read our reviews or leave one on Google after your visit. Oswego, Naperville, Aurora & surrounding areas.`,
  path: "/reviews",
});

export default function ReviewsPage() {

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
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">
              We’re proud of what our clients say. Read their feedback below or leave one
              on Google after your visit—your voice helps others in Oswego, Naperville, Aurora, and
              the surrounding area find us.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-2xl font-bold text-white mb-6">Client feedback</h2>
          <p className="text-black text-sm mb-4">
            Reviews from our database—including past feedback we've preserved. Updated live.
          </p>
          <ReviewsList />
        </FadeUp>
      </Section>

      <Section id="leave-review">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <FadeUp>
            <div className="rounded-2xl border border-black bg-gradient-to-b from-black/60 to-black p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Leave a Google review
              </h2>
              <p className="text-black mb-6">
                Love your visit? Tell the world on Google. Your review helps others find us
                and means the world to our team.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                >
                  <span>★</span> Leave a Google review
                </a>
              </div>
              <p className="mt-6 text-sm text-black">
                Opens Google so you can rate and write your review. Thank you for supporting our
                small business!
              </p>
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="rounded-2xl border border-black bg-black/40 p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Scan to leave a Google review</h3>
              <p className="text-black text-sm mb-6">
                Use your phone camera to scan—opens our Google review page
              </p>
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-4 bg-white rounded-2xl hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/images/google-review-qr.png"
                  alt="QR code to leave a Google review for Hello Gorgeous Med Spa"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </a>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <div className="rounded-2xl border border-black bg-black/40 p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              After your appointment
            </h2>
            <p className="text-black">
              We may send you a follow-up with a direct link to leave a Google review. You can also
              use this page or the QR code above anytime—we appreciate every piece of feedback.
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
