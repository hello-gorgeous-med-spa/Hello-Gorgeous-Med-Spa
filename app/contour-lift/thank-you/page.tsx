import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ContourBookLink } from "@/components/marketing/ContourBookLink";
import { ContourLiftThankYouTrack } from "./ContourLiftThankYouTrack";

const PINK = "#E6007E";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Thank you — Hello Gorgeous Contour Lift™",
    description:
      "We received your Contour Lift™ request. A member of the Hello Gorgeous team will be in touch. Book online or learn more about Quantum RF in Oswego, IL.",
    path: "/contour-lift/thank-you",
  }),
};

export default function ContourLiftThankYouPage() {
  return (
    <>
      <ContourLiftThankYouTrack />
      <main className="min-h-[80vh] border-b-2 border-black bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">You’re in — thank you</h1>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            We received your request for the Hello Gorgeous Contour Lift™. Our team will reach out using your preferred
            contact method.
          </p>
          <p className="mt-2 text-sm text-white/70">If you need us sooner, text or call the front desk from our site.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/services/quantum-rf"
              className="inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-md px-8 text-sm font-bold uppercase tracking-widest text-white transition hover:opacity-95"
              style={{ backgroundColor: PINK }}
              data-cl-event="contour_lift_thankyou_explore"
              data-cl-only
            >
              Explore Contour Lift
            </Link>
            <ContourBookLink
              className="inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-md border-2 border-white px-8 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
              data-cl-event="contour_lift_book_click"
              data-cl-placement="thank_you"
            >
              Book consultation
            </ContourBookLink>
          </div>
          <p className="mt-8 text-sm text-white/60">
            <Link href="/" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
              Return home
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
