import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { CONVERSION_HIERARCHY } from "@/lib/illinois-excellence";
import {
  MEDICAL_TEAM_QUOTE,
  MEDICAL_TRUST_BADGES,
  MEDICAL_TRUST_PROVIDERS,
} from "@/lib/medical-trust";

type Surface = "light" | "dark" | "rose";

type Props = {
  surface?: Surface;
  showBookCta?: boolean;
  className?: string;
};

const surfaceStyles: Record<
  Surface,
  { wrap: string; card: string; title: string; body: string; chip: string }
> = {
  light: {
    wrap: "bg-white border-y-4 border-black",
    card: "border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]",
    title: "text-black",
    body: "text-black/75",
    chip: "border-2 border-black/10 bg-[#FFF0F7] text-[#E6007E]",
  },
  dark: {
    wrap: "bg-gradient-to-br from-[#0a0a0a] via-[#1a0a14] to-[#2d1020] border-y-4 border-black",
    card: "border-2 border-white/15 bg-white/5 backdrop-blur",
    title: "text-white",
    body: "text-white/75",
    chip: "border border-white/20 bg-white/10 text-[#FFB8DC]",
  },
  rose: {
    wrap: "bg-gradient-to-b from-[#FFF0F7] to-white border-y-4 border-black",
    card: "border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]",
    title: "text-black",
    body: "text-black/75",
    chip: "border-2 border-black/10 bg-white text-[#E6007E]",
  },
};

export function MedicalTrustBand({
  surface = "light",
  showBookCta = true,
  className = "",
}: Props) {
  const s = surfaceStyles[surface];

  return (
    <section className={`${s.wrap} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-6">
        <div className={`overflow-hidden rounded-3xl ${s.card}`}>
          <div className="grid gap-8 p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-10">
            <FadeUp>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                Real providers · Real medical oversight
              </p>
              <h2 className={`mt-3 text-2xl font-black md:text-3xl ${s.title}`}>
                {MEDICAL_TRUST_PROVIDERS[0].name} leads every prescription
              </h2>
              <p className={`mt-4 text-base leading-relaxed ${s.body}`}>
                Illinois patients deserve more than a checkout flow. Our NP is on site 7 days a week —
                reviewing intakes, labs, and refills while {MEDICAL_TRUST_PROVIDERS[1].name.split(",")[0]}{" "}
                leads in-clinic aesthetics and client experience.
              </p>
              <blockquote
                className={`mt-5 border-l-4 border-[#E6007E] pl-4 text-lg font-medium italic ${surface === "dark" ? "text-white/90" : "text-black/85"}`}
              >
                &ldquo;{MEDICAL_TEAM_QUOTE}&rdquo;
              </blockquote>
              <div className="mt-5 flex flex-wrap gap-2">
                {MEDICAL_TRUST_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${s.chip}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/providers" className="text-sm font-bold text-[#E6007E] hover:underline">
                  Meet the full team →
                </Link>
                <Link
                  href="/rx/request"
                  className={`text-sm font-semibold hover:text-[#E6007E] ${surface === "dark" ? "text-white/70" : "text-black/60"}`}
                >
                  Browse RX catalog →
                </Link>
              </div>
              {showBookCta ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <CTA href={CONVERSION_HIERARCHY.primary.href} variant="gradient">
                    {CONVERSION_HIERARCHY.primary.label}
                  </CTA>
                  <CTA
                    href={CONVERSION_HIERARCHY.secondary.rxPortal.href}
                    variant="outline"
                    className={surface === "dark" ? "!border-white/40 !text-white" : undefined}
                  >
                    {CONVERSION_HIERARCHY.secondary.rxPortal.label}
                  </CTA>
                </div>
              ) : null}
            </FadeUp>

            <FadeUp delayMs={80}>
              <div className="grid grid-cols-2 gap-3">
                {MEDICAL_TRUST_PROVIDERS.map((provider) => (
                  <div
                    key={provider.name}
                    className="overflow-hidden rounded-2xl border-2 border-black bg-[#f8f4f0]"
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={provider.image}
                        alt={provider.imageAlt}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 45vw, 220px"
                      />
                    </div>
                    <div className="border-t-2 border-black bg-white p-3">
                      <p className="text-sm font-bold text-black">{provider.name}</p>
                      <p className="text-[11px] font-semibold text-[#E6007E]">{provider.role}</p>
                      <p className="mt-1 text-[11px] text-black/60">{provider.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
