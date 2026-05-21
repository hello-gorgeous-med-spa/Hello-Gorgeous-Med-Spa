import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import { MORE_SPECIALS_LINKS } from "@/lib/specials";

export function MoreSpecialsSection() {
  return (
    <Section className="bg-white border-b-4 border-black py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <FadeUp>
          <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-3">
            More current specials
          </h2>
          <p className="text-center text-black/65 font-medium max-w-xl mx-auto mb-10">
            Memberships, VIP model days, laser promos, and new-client offers — all in one place.
          </p>
        </FadeUp>
        <div className="grid gap-4 sm:grid-cols-2">
          {MORE_SPECIALS_LINKS.map((item, idx) => (
            <FadeUp key={item.href} delayMs={idx * 30}>
              <Link
                href={item.href}
                className="group block h-full rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] transition hover:border-[#E6007E]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-black group-hover:text-[#E6007E]">{item.label}</p>
                  {"badge" in item && item.badge ? (
                    <span className="shrink-0 rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-black/65 font-medium">{item.sub}</p>
                <span className="mt-3 inline-block text-sm font-bold text-[#E6007E] group-hover:underline">
                  View offer →
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
