import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Thank You",
  description: "Your appointment request has been received. We look forward to seeing you.",
  path: "/book/thank-you",
});

export default function BookThankYouPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#FF2D8E] mb-4">
          Thank you for booking
        </h1>
        <p className="text-lg text-black/80 mb-8">
          We&apos;ve received your appointment request and will confirm shortly. We can&apos;t wait to see you at Hello Gorgeous.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-6 rounded-xl bg-[#FF2D8E] text-white font-semibold hover:bg-[#FF2D8E]/90 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
