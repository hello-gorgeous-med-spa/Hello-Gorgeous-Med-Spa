"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { ClinicalReview } from "@/components/ClinicalReview";
import { FadeUp, Section } from "@/components/Section";
import type { ProtocolPageModel } from "@/lib/regen/catalog/protocol-pages";
import { RX_PROTOCOLS_PATH } from "@/lib/regen/catalog/protocol-pages";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const JUMP = [
  { href: "#what", label: "What it is" },
  { href: "#benefits", label: "Benefits" },
  { href: "#how-used", label: "How it's used" },
  { href: "#who-shouldnt", label: "Who shouldn't" },
  { href: "#side-effects", label: "Side effects" },
  { href: "#start", label: "Start intake" },
] as const;

type Props = {
  protocol: ProtocolPageModel;
  related: ProtocolPageModel[];
};

function StampCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-10">
      <div className="mb-6 flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-lg font-black text-white"
          aria-hidden
        >
          {index}
        </span>
        <h2 className="text-2xl font-black leading-tight text-black md:text-3xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, question }: { items: string[]; question: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="flex items-start gap-2 text-lg font-bold text-[#E6007E]">
        <span className="mt-0.5 text-black" aria-hidden>
          ▸
        </span>
        {question}
      </p>
      <ul className="mt-3 space-y-2 pl-6 font-medium leading-relaxed text-black/85">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function RxProtocolPageContent({ protocol, related }: Props) {
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
            <h1 className="mb-4 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
              {protocol.name}{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                protocol
              </span>
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              {protocol.tagline}. Educational summary from Hello Gorgeous Med Spa — your dose is set
              at consult with Ryan Kent, FNP-BC.
            </p>
            <p className="mb-8 text-2xl font-black text-[#FFB8DC]">{protocol.priceText}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA
                href={protocol.consultHref}
                variant="gradient"
                className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]"
              >
                {protocol.consultCta}
              </CTA>
              <CTA
                href={protocol.productHref}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black"
              >
                View in shop
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Questions? Call{" "}
              <a
                href={`tel:${SITE.phone}`}
                className="font-bold text-[#FFB8DC] underline decoration-[#E6007E] hover:text-white"
              >
                {SITE.phone}
              </a>
            </p>
          </div>
        </Section>

        <Section className="!py-12 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="On this page" className="mx-auto max-w-5xl px-4 md:px-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              On this page
            </p>
            <ul className="flex flex-wrap gap-2">
              {JUMP.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:border-[#E6007E] hover:text-[#E6007E] hover:shadow-md"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        <Section id="what" className="scroll-mt-28 !py-16 bg-white/50 md:!py-20">
          <FadeUp>
            <div className="mx-auto grid max-w-5xl items-start gap-8 px-4 md:grid-cols-[minmax(0,1fr)_220px] md:px-6">
              <StampCard index={1} title={`What is ${protocol.name}?`}>
                <p className="font-medium leading-relaxed text-black/85">{protocol.what}</p>
                {protocol.note ? (
                  <p className="mt-6 border-t-2 border-black/10 pt-4 text-sm font-medium text-black/65">
                    {protocol.note}
                  </p>
                ) : null}
              </StampCard>
              <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={protocol.image}
                  alt=""
                  fill
                  className="object-contain p-4"
                  sizes="220px"
                />
              </div>
            </div>
          </FadeUp>
        </Section>

        <Section id="benefits" className="scroll-mt-28 !py-16 bg-gradient-to-b from-white to-[#FFF5FA] md:!py-20">
          <FadeUp>
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <StampCard index={2} title="What it's studied for">
                <BulletList items={protocol.benefits} question="Possible benefits" />
              </StampCard>
            </div>
          </FadeUp>
        </Section>

        <Section id="how-used" className="scroll-mt-28 !py-16 bg-white/50 md:!py-20">
          <FadeUp>
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <StampCard index={3} title="How it's used">
                <p className="font-medium leading-relaxed text-black/85">{protocol.howUsed}</p>
                <p className="mt-4 text-sm font-medium text-black/55">
                  Strength, dose, and schedule are set by Ryan Kent, FNP-BC at your consult — this
                  page does not prescribe.
                </p>
              </StampCard>
            </div>
          </FadeUp>
        </Section>

        <Section id="who-shouldnt" className="scroll-mt-28 !py-16 bg-gradient-to-b from-white to-[#FFF5FA] md:!py-20">
          <FadeUp>
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <StampCard index={4} title="Who shouldn't use this">
                <BulletList items={protocol.contra} question="Talk to your provider first if" />
              </StampCard>
            </div>
          </FadeUp>
        </Section>

        <Section id="side-effects" className="scroll-mt-28 !py-16 bg-white/50 md:!py-20">
          <FadeUp>
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <StampCard index={5} title="Side effects">
                <BulletList items={protocol.side} question="What people commonly notice" />
              </StampCard>
            </div>
          </FadeUp>
        </Section>

        <Section className="!py-12">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <ClinicalReview />
          </div>
        </Section>

        {related.length > 0 ? (
          <Section className="border-t-4 border-black bg-white/70 !py-16">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
                Same goal
              </p>
              <h2 className="mt-2 font-serif text-2xl font-black text-black md:text-3xl">
                More {protocol.hubLabel.toLowerCase()} protocols
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.drugKey}>
                    <Link
                      href={item.path}
                      className="block rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.28)] transition hover:-translate-y-0.5"
                    >
                      <p className="font-black text-black">{item.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-medium text-black/60">
                        {item.tagline}
                      </p>
                      <p className="mt-3 text-sm font-black text-[#E6007E]">{item.priceText}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
                <Link href={protocol.hubPath} className="text-[#E6007E] underline decoration-2 underline-offset-4">
                  {protocol.hubLabel} hub →
                </Link>
                <Link href={RX_PROTOCOLS_PATH} className="text-black/70 underline decoration-2 underline-offset-4">
                  All protocols →
                </Link>
                <Link href={protocol.productHref} className="text-black/70 underline decoration-2 underline-offset-4">
                  Shop {protocol.productName} →
                </Link>
              </div>
            </div>
          </Section>
        ) : null}

        <Section id="start" className="relative scroll-mt-28 overflow-hidden border-t-4 border-black !py-20">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <h2 className="mb-4 text-3xl font-black text-white drop-shadow-md md:text-4xl">
              Start with a consult, not a cart
            </h2>
            <p className="mx-auto mb-4 max-w-xl text-lg text-white/95">
              {protocol.priceText} starting point. Ryan Kent, FNP-BC sets your protocol after intake
              — you&apos;re invoiced for medication only after he approves it.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href={protocol.consultHref} variant="white" className="shadow-xl">
                {protocol.consultCta}
              </CTA>
              <Link
                href={protocol.hubPath}
                className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 font-bold text-white shadow-lg transition hover:bg-white hover:text-[#E6007E]"
              >
                {protocol.hubLabel} hub
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
