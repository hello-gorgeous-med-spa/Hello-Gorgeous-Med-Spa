import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import {
  getGbpPublicSpotlights,
  gbpSpotlightHref,
} from "@/lib/google-business-public-spotlight";
import { SITE } from "@/lib/seo";

/** Phase 8 — surfaces Google Business post themes on /reviews for local pack alignment. */
export function GoogleBusinessSpotlight() {
  const spotlights = getGbpPublicSpotlights();

  return (
    <Section className="!py-12 md:!py-14">
      <FadeUp>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
          On Google right now
        </p>
        <h2 className="mt-3 text-2xl font-black text-black md:text-3xl">
          What we&apos;re promoting locally
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-black/65">
          Same offers we post on our{" "}
          <a
            href={SITE.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#E6007E] underline"
          >
            Google Business Profile
          </a>
          — book in-clinic or start Hello Gorgeous RX™ online.
        </p>
      </FadeUp>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {spotlights.map((item, i) => (
          <FadeUp key={item.id} delayMs={i * 50}>
            <article className="flex h-full flex-col rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
                {item.label.replace(/^Blast — /, "")}
              </p>
              <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-black/75 line-clamp-6">
                {item.message.split("\n").slice(0, 5).join("\n")}
              </p>
              <Link
                href={gbpSpotlightHref(item.linkPath)}
                className="mt-4 text-sm font-bold text-[#E6007E] hover:underline"
              >
                Learn more →
              </Link>
            </article>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
