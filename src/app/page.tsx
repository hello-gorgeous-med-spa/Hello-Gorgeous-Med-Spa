import type { Metadata } from "next";

import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { FadeUp } from "@/components/ui/FadeUp";
import { faqsHome } from "@/content/faqs";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Home",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL. Luxury medical aesthetics—Botox/Dysport, fillers, GLP‑1 weight loss, hormone therapy, PRF/PRP. Serving Naperville, Aurora, and Plainfield.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* SEO */}
      <SiteJsonLd />
      <FAQJsonLd faqs={faqsHome} />

      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              LUXURY MEDICAL AESTHETICS IN OSWEGO, IL
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Look{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                refreshed
              </span>
              . Feel confident.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Provider-led injectables and regenerative aesthetics—built for natural-looking
              results and a high-end experience.{" "}
              <span className="text-white font-semibold">
                Serving Oswego, Naperville, Aurora, and Plainfield.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a
                className="group px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                href="/book"
              >
                Book Now
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a
                className="px-8 py-4 border border-white/20 rounded-full text-lg font-semibold hover:bg-white/5 transition-all duration-300"
                href="/services"
              >
                See Services
              </a>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Provider-led care</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                <span>Natural-looking results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400">✓</span>
                <span>Luxury experience</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

