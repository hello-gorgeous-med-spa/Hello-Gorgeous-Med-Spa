"use client";

import Image from "next/image";
import Link from "next/link";
import {
  getProposalCredibilityBlocks,
  type ProposalCredibilityBlock,
} from "@/lib/proposals/credibility";
import type { ProposalOption } from "@/lib/proposals/utils";

function CredibilityCard({ block }: { block: ProposalCredibilityBlock }) {
  return (
    <article className="overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      <div className="grid gap-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="p-5 md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E6007E]">{block.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-black text-black">{block.title}</h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">{block.summary}</p>
          <p className="mt-3 text-sm font-semibold text-black/90">{block.trustLine}</p>

          {block.chips.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {block.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border-2 border-black bg-[#FFF0F7] px-3 py-1 text-[11px] font-bold text-black"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {block.pillars.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {block.pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-xl border-2 border-black/10 bg-[#FFF0F7] p-3">
                  <p className="text-lg font-black text-[#E6007E]">
                    {pillar.stat}
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-wide text-black/50">
                      {pillar.statLabel}
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-bold text-black">{pillar.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-black/75">{pillar.body}</p>
                </div>
              ))}
            </div>
          ) : null}

          {block.areas?.length ? (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-black/55">Common treatment areas</p>
              <p className="mt-1 text-sm text-black/80">{block.areas.join(" · ")}</p>
            </div>
          ) : null}

          {block.steps?.length ? (
            <ol className="mt-5 space-y-2">
              {block.steps.map((step) => (
                <li key={step.step} className="flex gap-3 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-xs font-black text-white">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-bold text-black">{step.title}</p>
                    <p className="text-xs text-black/70">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          <Link
            href={block.learnMoreHref}
            className="mt-5 inline-flex text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-2"
          >
            Learn more on our site →
          </Link>
        </div>

        {block.imageSrc ? (
          <div
            className="flex items-center justify-center border-t-4 border-black p-3 md:border-l-4 md:border-t-0 md:p-5"
            style={{ background: block.imageBg || "#0a0a0a" }}
          >
            {/* Square frame so InMode text graphics (FASTER / BIGGER / burst) are not cropped */}
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-xl">
              <Image
                src={block.imageSrc}
                alt={block.imageAlt || block.title}
                fill
                className={block.imageFit === "contain" ? "object-contain" : "object-cover"}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ProposalCredibilityBand({
  options,
  className = "",
}: {
  options: ProposalOption[];
  className?: string;
}) {
  const blocks = getProposalCredibilityBlocks(options);
  if (!blocks.length) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E6007E]">Why this plan</p>
        <h2 className="mt-1 text-2xl font-black text-black">Technology & credibility</h2>
        <p className="mt-1 text-sm text-black/70">
          Educational overview of what&apos;s in your proposal — so you know exactly what you&apos;re investing in.
        </p>
      </div>
      {blocks.map((block) => (
        <CredibilityCard key={block.id} block={block} />
      ))}
      <p className="text-xs text-black/50">
        Educational only. Final candidacy, settings, and expectations are confirmed at your in-person consult with our medical team.
      </p>
    </section>
  );
}
