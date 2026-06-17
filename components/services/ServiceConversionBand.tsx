import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import type { ServiceConversionProfile } from "@/lib/service-conversion-profiles";

function ConversionCard({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: string;
}) {
  return (
    <div className="h-full rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] md:p-6">
      <h3 className="text-sm font-black uppercase tracking-wider text-[#E6007E]">{title}</h3>
      {accent ? <p className="mt-2 text-sm font-bold text-black/80">{accent}</p> : null}
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm font-medium leading-snug text-black/75">
            <span className="shrink-0 font-bold text-[#FF2D8E]" aria-hidden>
              ▸
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceConversionBand({
  serviceName,
  profile,
  bookingHref,
}: {
  serviceName: string;
  profile: ServiceConversionProfile;
  bookingHref: string;
}) {
  return (
    <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white !px-0 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              At a glance
            </span>
            <h2 className="mt-4 text-2xl font-black text-black md:text-3xl">
              Is {serviceName} right for you?
            </h2>
            <p className="mt-3 text-sm font-medium text-black/65">{profile.pricingNote}</p>
          </div>
        </FadeUp>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <FadeUp delayMs={40}>
            <ConversionCard title="What it helps with" items={profile.helpsWith} />
          </FadeUp>
          <FadeUp delayMs={80}>
            <ConversionCard title="Who it's for" items={profile.idealFor} />
          </FadeUp>
          <FadeUp delayMs={120}>
            <ConversionCard title="Downtime & recovery" items={[profile.downtime]} accent="Plan ahead — we'll tell you honestly." />
          </FadeUp>
          <FadeUp delayMs={160}>
            <ConversionCard title="Treatment plan" items={[profile.treatmentPlan]} accent="Customized at your free consultation." />
          </FadeUp>
        </div>

        <FadeUp delayMs={200}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTA href={bookingHref} variant="gradient" className="!px-8 !py-4">
              Book Free Consultation
            </CTA>
            <Link
              href="/help-me-choose"
              className="text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-4 hover:text-[#FF2D8E]"
            >
              Not sure? Help me choose →
            </Link>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
