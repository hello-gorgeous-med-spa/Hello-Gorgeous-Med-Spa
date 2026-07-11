"use client";

import Image from "next/image";
import Link from "next/link";

import {
  JOURNEY_SECTION_BG_B,
  JourneyEyebrow,
  JourneySectionHead,
} from "@/components/marketing/JourneyPageUi";
import type { PeptideTier } from "@/data/peptides";
import { getPeptideThumbnail } from "@/lib/peptide-featured";
import { getPeptideTopicsByCategory, peptideTopicHref, tierBadge } from "@/lib/peptides-hub";

function TierPill({ tier }: { tier: PeptideTier }) {
  const badge = tierBadge(tier);
  if (!badge) return null;
  return (
    <span className="rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/70 backdrop-blur">
      {badge}
    </span>
  );
}

function TopicCard({
  slug,
  name,
  tagline,
  accent,
  tier,
  thumbnailImage,
  thumbnailAlt,
}: {
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  tier: PeptideTier;
  thumbnailImage?: `/${string}`;
  thumbnailAlt?: string;
}) {
  return (
    <Link
      href={peptideTopicHref(slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/14 bg-[#0a0206] shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#FF2D8E] hover:shadow-[0_20px_40px_rgba(255,45,142,0.18)] motion-reduce:hover:translate-y-0"
    >
      {thumbnailImage && thumbnailAlt ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
          <Image
            src={thumbnailImage}
            alt={thumbnailAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute top-2 right-2">
            <TierPill tier={tier} />
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2 p-5 pb-0">
          <span
            className="inline-block h-2 w-10 rounded-full"
            style={{ background: accent }}
            aria-hidden
          />
          <TierPill tier={tier} />
        </div>
      )}
      <div className={thumbnailImage ? "flex flex-1 flex-col p-5" : "flex flex-1 flex-col px-5 pb-5"}>
        <h3
          className={`font-serif text-lg font-bold text-white group-hover:text-[#FF2D8E] ${thumbnailImage ? "" : "mt-3"}`}
        >
          {name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{tagline}</p>
        <p className="mt-4 text-sm font-bold text-[#FF2D8E]">Read guide →</p>
      </div>
    </Link>
  );
}

export function PeptidesHubGrid() {
  const groups = getPeptideTopicsByCategory();

  return (
    <section id="peptide-topics" className={`scroll-mt-20 ${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
      <div className="mx-auto max-w-[1200px]">
        <JourneySectionHead
          eyebrow="Education hub"
          title="Browse by"
          titleAccent="topic"
          description="Tap any topic to learn what it does, how it helps, and whether it fits your goals — then book a $49 NP-led consult to build your plan."
          center
        />

        <div className="mt-12 space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="mb-4 flex items-center gap-3">
                <JourneyEyebrow>{group.category}</JourneyEyebrow>
                <span className="h-px flex-1 bg-white/15" aria-hidden />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.topics.map((topic) => {
                  const thumbnail = getPeptideThumbnail(topic.slug);
                  return (
                    <TopicCard
                      key={topic.slug}
                      slug={topic.slug}
                      name={topic.name}
                      tagline={topic.tagline}
                      accent={topic.accent}
                      tier={topic.tier}
                      thumbnailImage={thumbnail?.src}
                      thumbnailAlt={thumbnail?.alt}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
