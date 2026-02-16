"use client";

import Link from "next/link";
import { Section, FadeUp } from "@/components/Section";
import { SERVICES } from "@/lib/seo";

const ICONS: Record<string, string> = {
  Injectables: "💉",
  Wellness: "⚖️",
  Regenerative: "🧬",
  "Skin & Face": "✨",
};

export function ServicesGrid() {
  const services = SERVICES.slice(0, 8);

  return (
    <Section className="bg-white py-[100px] px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <FadeUp>
          <h2 className="text-[38px] font-bold text-black text-center mb-16">
            Our Signature Services
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, idx) => (
            <FadeUp key={s.slug} delayMs={60 * idx}>
              <Link
                href={`/services/${s.slug}`}
                className="block h-full p-8 bg-white border border-black rounded-lg hover:border-[#FF2D8E] transition-all duration-200 group"
              >
                <span className="text-4xl block mb-4 text-[#FF2D8E]">
                  {ICONS[s.category] || "✨"}
                </span>
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#FF2D8E] transition-colors">
                  {s.name}
                </h3>
                <p className="text-black text-base leading-relaxed mb-4 line-clamp-3">
                  {s.short}
                </p>
                <span className="text-[#FF2D8E] font-semibold">
                  Explore →
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
