"use client";

import Image from "next/image";
import Link from "next/link";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  REGEN_LANDING_CATEGORIES,
  REGEN_LANDING_GRID,
  REGEN_LANDING_HERO,
  REGEN_LANDING_QUICK_ACTIONS,
  REGEN_LANDING_TRUST,
} from "@/lib/regen-landing-page";
import { REGEN_BRAND } from "@/lib/regen-brand";
import type { RxCategoryHubId } from "@/lib/rx-category-hubs";

function TrustIcon({ icon }: { icon: (typeof REGEN_LANDING_TRUST)[number]["icon"] }) {
  const className = "h-5 w-5 text-[#E6007E]";
  if (icon === "clipboard") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    );
  }
  if (icon === "heart") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}

function CategoryTile({
  hubId,
  href,
  image,
  imageAlt,
}: {
  hubId: RxCategoryHubId;
  href: string;
  image: string;
  imageAlt: string;
}) {
  const copy = REGEN_LANDING_GRID[hubId];

  return (
    <Link
      href={href}
      className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-lg bg-neutral-900 sm:min-h-[260px]"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 100vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      <div className="relative p-5 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] sm:text-[13px]">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm leading-snug text-white/85">{copy.blurb}</p>
      </div>
    </Link>
  );
}

function QuickActionCard({
  title,
  blurb,
  href,
  image,
  imageAlt,
}: {
  title: string;
  blurb: string;
  href: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl bg-[#FFF0F7] transition hover:bg-[#FFE4F2]"
    >
      <div className="relative aspect-[4/3] bg-white">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 items-end justify-between gap-3 p-4 pt-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-neutral-600">{blurb}</p>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6007E] text-white transition group-hover:bg-[#FF2D8E]"
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function RegenLandingPageContent() {
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center lg:py-16">
          <FadeUp>
            <RegenLogo width={220} priority />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-900">
              {REGEN_LANDING_HERO.headline}{" "}
              <span className="text-neutral-600">{REGEN_LANDING_HERO.headlineAccent}</span>
            </p>
            <ul className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
              {REGEN_LANDING_TRUST.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5">
                  <TrustIcon icon={item.icon} />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/rx/weight-loss"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Explore categories
              </Link>
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400"
              >
                Book consult
              </Link>
            </div>
          </FadeUp>

          <FadeUp className="relative aspect-square overflow-hidden rounded-2xl bg-[#FFF0F7]">
            <Image
              src={REGEN_LANDING_HERO.heroImage}
              alt={REGEN_LANDING_HERO.heroImageAlt}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </FadeUp>
        </div>
      </section>

      {/* Category grid */}
      <Section className="border-b border-neutral-200" containerClassName="!max-w-6xl">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {REGEN_LANDING_CATEGORIES.map((hub) => (
              <CategoryTile
                key={hub.id}
                hubId={hub.id}
                href={hub.hubPath}
                image={hub.previewImage}
                imageAlt={hub.previewAlt}
              />
            ))}
        </div>
      </Section>

      {/* Quick actions */}
      <Section className="border-b border-neutral-200 bg-[#FFF0F7]" containerClassName="!max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REGEN_LANDING_QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.id} {...action} />
            ))}
        </div>
      </Section>

      {/* Footer strip */}
      <section className="border-t border-neutral-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-neutral-500">{REGEN_BRAND.tagline}</p>
          <p className="mt-2 text-xs text-neutral-400">
            Ryan Kent, FNP-BC · Hello Gorgeous Med Spa · Oswego, IL
          </p>
        </div>
      </section>
    </div>
  );
}
