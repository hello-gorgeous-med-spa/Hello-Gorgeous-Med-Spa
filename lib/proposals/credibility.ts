/**
 * Client-facing credibility / education blocks for treatment proposals.
 * Pulled from flagship Journey marketing so proposals explain *why*, not only price.
 */

import {
  MORPHEUS8_INMODE_STORY,
  MORPHEUS8_MARKETING,
  MORPHEUS8_PATH,
  MORPHEUS8_STEPS,
  MORPHEUS8_TREATMENT_AREAS,
  MORPHEUS8_WHAT_IT_DOES,
} from "@/lib/morpheus8-marketing";
import {
  SOLARIA_CO2_PATH,
  SOLARIA_MARKETING,
  SOLARIA_WHAT_IT_DOES,
} from "@/lib/solaria-marketing";
import type { ProposalOption } from "@/lib/proposals/utils";

export type ProposalCredibilityPillar = {
  title: string;
  body: string;
  stat: string;
  statLabel: string;
};

export type ProposalCredibilityBlock = {
  id: "morpheus8" | "solaria" | "clinic";
  eyebrow: string;
  title: string;
  summary: string;
  trustLine: string;
  pillars: ProposalCredibilityPillar[];
  chips: string[];
  areas?: string[];
  steps?: Array<{ step: string; title: string; body: string }>;
  learnMoreHref: string;
  imageSrc?: string;
  imageAlt?: string;
};

function serviceIdsFromOptions(options: ProposalOption[]): Set<string> {
  const ids = new Set<string>();
  for (const option of options) {
    for (const service of option.services) {
      ids.add(service.id);
    }
  }
  return ids;
}

export function proposalIncludesMorpheus8(options: ProposalOption[]): boolean {
  const ids = serviceIdsFromOptions(options);
  return (
    ids.has("pkg-transformation") ||
    ids.has("pkg-ultimate") ||
    [...ids].some((id) => id.startsWith("morpheus8"))
  );
}

export function proposalIncludesSolaria(options: ProposalOption[]): boolean {
  const ids = serviceIdsFromOptions(options);
  return (
    ids.has("pkg-transformation") ||
    [...ids].some((id) => id.startsWith("solaria"))
  );
}

export function getProposalCredibilityBlocks(options: ProposalOption[]): ProposalCredibilityBlock[] {
  const blocks: ProposalCredibilityBlock[] = [];
  const hasM8 = proposalIncludesMorpheus8(options);
  const hasSolaria = proposalIncludesSolaria(options);

  if (hasM8 || hasSolaria) {
    blocks.push({
      id: "clinic",
      eyebrow: "Why Hello Gorgeous",
      title: "InMode verified · NP-directed care in Oswego",
      summary:
        "We invested in the real InMode stack — Morpheus8 Burst + Deep, Solaria CO₂, and Quantum RF — so your plan is built on medical-grade technology, not a watered-down copycat.",
      trustLine: MORPHEUS8_MARKETING.trustLine,
      pillars: [],
      chips: [...MORPHEUS8_INMODE_STORY.chips],
      learnMoreHref: hasM8 ? MORPHEUS8_PATH : SOLARIA_CO2_PATH,
      imageSrc: MORPHEUS8_MARKETING.images.verified,
      imageAlt: "InMode Verified Provider — Morpheus8 Burst at Hello Gorgeous Med Spa",
    });
  }

  if (hasM8) {
    blocks.push({
      id: "morpheus8",
      eyebrow: MORPHEUS8_MARKETING.eyebrow,
      title: "What Morpheus8 Burst + Deep does",
      summary: MORPHEUS8_MARKETING.subhead,
      trustLine:
        "Burst delivers RF at multiple tissue depths in one pulse — up to 8mm — for collagen remodeling beneath the surface. A series of 3 is typical; results keep building for 3–6 months.",
      pillars: MORPHEUS8_WHAT_IT_DOES.map((item) => ({
        title: item.title,
        body: item.body,
        stat: item.stat,
        statLabel: item.statLabel,
      })),
      chips: ["Skin tightening", "Acne scars", "Texture", "Face + body"],
      areas: [...MORPHEUS8_TREATMENT_AREAS],
      steps: MORPHEUS8_STEPS.map((s) => ({ step: s.step, title: s.title, body: s.body })),
      learnMoreHref: MORPHEUS8_PATH,
      imageSrc: MORPHEUS8_MARKETING.images.bodyTech,
      imageAlt: "Morpheus8 Burst technology — InMode RF microneedling",
    });
  }

  if (hasSolaria) {
    blocks.push({
      id: "solaria",
      eyebrow: SOLARIA_MARKETING.eyebrow,
      title: "What Solaria CO₂ does",
      summary: SOLARIA_MARKETING.subhead,
      trustLine: SOLARIA_MARKETING.trustLine,
      pillars: SOLARIA_WHAT_IT_DOES.map((item) => ({
        title: item.title,
        body: item.body,
        stat: item.stat,
        statLabel: item.statLabel,
      })),
      chips: ["Fine lines", "Sun damage", "Acne scars", "Texture"],
      learnMoreHref: SOLARIA_CO2_PATH,
      imageSrc: SOLARIA_MARKETING.images.device,
      imageAlt: "InMode Solaria CO₂ laser at Hello Gorgeous",
    });
  }

  return blocks;
}

/** Plain-text lines for PDF / SMS-friendly summaries. */
export function proposalCredibilityPdfLines(options: ProposalOption[]): string[] {
  const lines: string[] = [];
  for (const block of getProposalCredibilityBlocks(options)) {
    lines.push(block.title);
    lines.push(block.summary);
    if (block.trustLine) lines.push(block.trustLine);
    for (const pillar of block.pillars) {
      lines.push(`${pillar.title} (${pillar.stat} ${pillar.statLabel}): ${pillar.body}`);
    }
    if (block.chips.length) lines.push(`Highlights: ${block.chips.join(" · ")}`);
    lines.push("");
  }
  return lines;
}
