"use client";

import Image from "next/image";
import { Section, FadeUp } from "@/components/Section";

const galleryImages = [
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
];

export function PhotoGallery() {
  return (
    <Section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-950/10 to-black" />
      <div className="relative">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-pink-400 text-lg font-medium tracking-wide">REAL RESULTS</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">See the Difference</h2>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              Real patients, real results. See what Hello Gorgeous Med Spa can do for you.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, idx) => (
            <FadeUp key={image.src} delayMs={100 * idx}>
              <div className="group relative aspect-square rounded-2xl overflow-hidden border border-pink-500/20 hover:border-pink-500/50 transition">
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
              href="https://fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition shadow-lg shadow-pink-500/25"
            >
              Book Your Transformation
            </a>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
