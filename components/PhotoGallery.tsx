"use client";

import Image from "next/image";
import { Section, FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

// Add your photos to public/images/gallery/ then add an entry here.
// Use descriptive alt text for accessibility and a short caption for the hover overlay.
const galleryImages = [
  {
    src: "/images/brow/combo-brows-blonde-before-after-danielle-alcala.png",
    alt: "Combo hybrid brows before and after by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL",
    caption: "Combo Brows",
  },
  {
    src: "/images/brow/combo-ombre-brows-before-after-danielle-alcala.png",
    alt: "Combo ombré brows before and after by Danielle Alcala Hello Gorgeous Med Spa Oswego IL",
    caption: "Combo & Ombré",
  },
  {
    src: "/images/brow/danielle-alcala-brow-pmu-portfolio-before-after.png",
    alt: "Microblading, powder, combo and nano brows before and after by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL",
    caption: "Brow PMU — My Work",
  },
  {
    src: "/images/brow/natural-light-stroke-brows-before-after-danielle-alcala.png",
    alt: "Natural light stroke brows before and after microblading by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL",
    caption: "Natural Light Stroke Brows",
  },
  {
    src: "/images/brow/natural-light-stroke-brows-vertical-before-after-danielle-alcala.png",
    alt: "Natural light stroke hand-stroke brows before and after by Danielle Alcala Hello Gorgeous Med Spa Oswego IL",
    caption: "Hand Stroke — Natural Light",
  },
  {
    src: "/images/brow/powder-nano-brows-before-after-danielle-alcala.png",
    alt: "Powder and nano brow PMU before and after by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL",
    caption: "Powder & Nano Brows",
  },
  {
    src: "/images/brow/powder-brows-before-after.png",
    alt: "Powder brows before and after permanent makeup at Hello Gorgeous Med Spa",
    caption: "Powder Brows PMU",
  },
  {
    src: "/images/gallery/before-after.png",
    alt: "Before and after Botox treatment results",
    caption: "Real Results",
  },
  {
    src: "/images/gallery/treatment-1.png",
    alt: "Treatment in progress at Hello Gorgeous Med Spa",
    caption: "Expert Care",
  },
  {
    src: "/images/gallery/treatment-2.png",
    alt: "Ryan Kent providing consultation",
    caption: "Personalized Consultations",
  },
  {
    src: "/images/gallery/treatment-3.png",
    alt: "Behind the scenes at Hello Gorgeous",
    caption: "State-of-the-Art Facility",
  },
  // To add more: 1) Put image files in public/images/gallery/ (e.g. my-photo.jpg)
  // 2) Uncomment and edit a line below, or add new lines following the same shape.
  // { src: "/images/gallery/treatment-4.png", alt: "Describe the photo", caption: "Caption" },
  // { src: "/images/gallery/my-photo.jpg", alt: "Describe the photo", caption: "Caption" },
];

export function PhotoGallery() {
  return (
    <Section className="relative py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="relative">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-sm font-medium tracking-wide">REAL RESULTS</p>
            <h2 className="mt-4 text-2xl md:text-4xl font-serif font-bold text-[#FF2D8E]">See the Difference</h2>
            <p className="mt-4 text-base md:text-lg text-[#FF2D8E] max-w-2xl mx-auto">
              Real patients, real results. See what Hello Gorgeous Med Spa can do for you.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, idx) => (
            <FadeUp key={image.src} delayMs={100 * idx}>
              <div className="group relative aspect-square rounded-xl overflow-hidden border-2 border-black hover:border-[#FF2D8E]/30 shadow-md hover:shadow-xl transition">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition">
                  <p className="text-white font-semibold">{image.caption}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={400}>
          <div className="mt-12 text-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 px-8 py-4 bg-[#FF2D8E] text-white font-semibold rounded-full hover:bg-black transition shadow-lg shadow-[#FF2D8E]/25 w-full md:w-auto"
            >
              Book Your Transformation
            </a>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
