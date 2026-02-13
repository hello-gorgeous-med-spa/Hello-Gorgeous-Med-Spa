import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { VirtualConsultation } from "@/components/VirtualConsultation";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Virtual Consultation | Personalized Treatment Recommendations | Oswego, IL",
  description:
    "Get instant treatment recommendations tailored to your concerns. Select your areas of interest—forehead, lips, skin, weight & more—and our team will create your personalized plan. Free, no-pressure.",
  path: "/virtual-consultation",
});

export default function VirtualConsultationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      {/* Hero – High-Glam Conversion Section */}
      <section className="bg-[#FDF7FA] px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup */}
          <div className="mx-auto max-w-[320px] md:max-w-[420px] order-2 md:order-1">
            <Image
              src="/images/hg-virtual-consult-phone.png"
              alt="Hello Gorgeous Virtual Consultation"
              width={420}
              height={820}
              sizes="(max-width: 768px) 320px, 420px"
              priority
              className="w-full h-auto drop-shadow-2xl transition-transform duration-500 md:hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <p className="text-sm uppercase tracking-[0.3em] text-[#E6007E] mb-4 font-semibold">
              Instant Personalized Beauty Plan
            </p>

            <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#111111] mb-6">
              Get Your Virtual Consultation.
            </h1>

            <p className="text-base md:text-lg text-[#5E5E66] mb-10 max-w-xl">
              Click the areas you&apos;d like to improve and receive customized
              treatment recommendations curated by our aesthetic specialists.
              Your glow-up starts here.
            </p>

            <Link
              href="#consultation-tool"
              className="inline-block w-full md:w-auto text-center bg-[#E6007E] hover:bg-[#B0005F] text-white px-10 py-4 rounded-md uppercase tracking-widest text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start My Virtual Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Tool Section */}
      <section
        id="consultation-tool"
        className="bg-white px-6 py-16 md:px-12 md:py-24"
      >
        <VirtualConsultation />
      </section>
    </>
  );
}
