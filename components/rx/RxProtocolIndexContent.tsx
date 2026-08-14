"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ClinicalReview } from "@/components/ClinicalReview";
import { FadeUp, Section } from "@/components/Section";
import type { ProtocolIndexGroup } from "@/lib/regen/catalog/protocol-pages";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

type Props = {
  groups: ProtocolIndexGroup[];
  count: number;
};

export function RxProtocolIndexContent({ groups, count }: Props) {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main>
        <Section className="relative !px-0 border-b-4 border-black py-16 lg:py-24">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              RE GEN · Hello Gorgeous RX
            </div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#FFB8DC] md:text-sm">
              Oswego · Naperville · Aurora · Plainfield
            </p>
            <h1 className="mb-6 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
              Compound{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                protocols
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              {count} educational pages — what each compound is, what it&apos;s studied for, and who
              should pause. Starting prices come from the catalog. Ryan Kent, FNP-BC sets your
              protocol after intake.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href="/rx/request" variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                Start intake
              </CTA>
              <CTA
                href="/rx"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black"
              >
                Browse the shop
              </CTA>
            </div>
          </div>
        </Section>

        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="Protocol goals" className="mx-auto max-w-5xl px-4 md:px-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to a goal
            </p>
            <ul className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <li key={group.goal}>
                  <a
                    href={`#${group.goalSlug}`}
                    className="inline-block rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:border-[#E6007E] hover:text-[#E6007E] hover:shadow-md"
                  >
                    {group.hubLabel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        {groups.map((group, index) => {
          const isAlt = index % 2 === 1;
          return (
            <Section
              key={group.goal}
              id={group.goalSlug}
              className={`scroll-mt-28 !py-16 md:!py-20 ${isAlt ? "bg-white/50" : "bg-gradient-to-b from-white to-[#FFF5FA]"}`}
            >
              <FadeUp>
                <div className="mx-auto max-w-5xl px-4 md:px-6">
                  <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
                        {group.goal}
                      </p>
                      <h2 className="mt-1 font-serif text-3xl font-black text-black">
                        {group.hubLabel}
                      </h2>
                    </div>
                    <Link
                      href={group.hubPath}
                      className="text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-4"
                    >
                      Open hub →
                    </Link>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.protocols.map((protocol) => (
                      <li key={protocol.drugKey}>
                        <Link
                          href={protocol.path}
                          className="flex h-full flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-0.5"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                            {protocol.form}
                          </p>
                          <h3 className="mt-1 font-black text-black">{protocol.name}</h3>
                          <p className="mt-2 line-clamp-2 flex-1 text-sm font-medium text-black/65">
                            {protocol.tagline}
                          </p>
                          <p className="mt-4 text-sm font-black text-[#E6007E]">{protocol.priceText}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </Section>
          );
        })}

        <Section className="!py-12">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <ClinicalReview />
          </div>
        </Section>

        <Section className="relative overflow-hidden border-t-4 border-black !py-20">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <h2 className="mb-4 text-3xl font-black text-white drop-shadow-md md:text-4xl">
              Ready when you are
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-white/95">
              Start intake, reserve your consult, and meet Ryan. Call{" "}
              <a href={`tel:${SITE.phone}`} className="font-bold underline decoration-white/50">
                {SITE.phone}
              </a>{" "}
              if you&apos;d rather talk it through.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href="/rx/request" variant="white" className="shadow-xl">
                Start intake
              </CTA>
              <Link
                href="/rx"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 font-bold text-white shadow-lg transition hover:bg-white hover:text-[#E6007E]"
              >
                Browse the shop
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
