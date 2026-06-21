"use client";

import Image from "next/image";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import type { PeptideTier } from "@/data/peptides";
import { getPeptideThumbnail } from "@/lib/peptide-featured";
import { getPeptideTopicsByCategory, peptideTopicHref, tierBadge } from "@/lib/peptides-hub";

function TierPill({ tier }: { tier: PeptideTier }) {
  const badge = tierBadge(tier);
  if (!badge) return null;
  return (
    <span className="rounded-full border border-black/15 bg-black/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black/60">
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.2)] transition hover:border-[#E6007E]/70 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
    >
      {thumbnailImage && thumbnailAlt ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-black">
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
          className={`text-lg font-black text-black group-hover:text-[#E6007E] ${thumbnailImage ? "" : "mt-3"}`}
        >
          {name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-black/70">{tagline}</p>
        <p className="mt-4 text-sm font-bold text-[#E6007E]">Read guide →</p>
      </div>
    </Link>
  );
}

export function PeptidesHubGrid() {
  const groups = getPeptideTopicsByCategory();

  return (
    <Section id="peptide-topics" className="border-t-4 border-black bg-gradient-to-b from-white to-[#FFF0F7]">
      <FadeUp>
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white border-2 border-black mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">Education hub</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            Browse by <span className="text-[#E6007E]">topic</span>
          </h2>
          <p className="mt-4 text-black/75 max-w-2xl mx-auto">
            Tap any topic to learn what it does, how it helps, and whether it fits your goals — then book a{" "}
            <strong>$49 NP-led consult</strong> to build your plan.
          </p>
        </div>
      </FadeUp>

      <div className="space-y-12">
        {groups.map((group, idx) => (
          <FadeUp key={group.category} delayMs={idx * 50}>
            <div>
              <h3 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black/50">
                <span>{group.category}</span>
                <span className="h-px flex-1 bg-black/15" aria-hidden />
              </h3>
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
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
