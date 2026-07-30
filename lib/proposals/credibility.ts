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
import {
  QUANTUM_RF_MARKETING,
  QUANTUM_RF_PATH,
  QUANTUM_RF_WHAT_IT_DOES,
} from "@/lib/quantum-rf-marketing";
import type { ProposalOption } from "@/lib/proposals/utils";

export type ProposalCredibilityPillar = {
  title: string;
  body: string;
  stat: string;
  statLabel: string;
};

export type ProposalCredibilityBlock = {
  id: "morpheus8" | "solaria" | "quantum" | "clinic" | "injectables" | "weight-loss";
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
    ids.has("morpheus8-3pack") ||
    ids.has("quantum-rf-neck-pkg") ||
    ids.has("quantum-rf-abdomen-pkg") ||
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

export function proposalIncludesQuantum(options: ProposalOption[]): boolean {
  const ids = serviceIdsFromOptions(options);
  return ids.has("quantum-rf") || ids.has("quantum-rf-neck-pkg") || ids.has("quantum-rf-abdomen-pkg");
}

export function proposalIncludesInjectables(options: ProposalOption[]): boolean {
  const ids = serviceIdsFromOptions(options);
  return [
    "botox",
    "dysport",
    "jeuveau",
    "xeomin",
    "daxxify",
    "lip-flip",
    "dermal-filler",
    "lip-filler",
    "filler-half-syringe",
    "filler-2-syringe",
    "hyaluronidase",
    "sculptra",
    "kybella",
  ].some((id) => ids.has(id));
}

export function proposalIncludesWeightLoss(options: ProposalOption[]): boolean {
  const ids = serviceIdsFromOptions(options);
  return [...ids].some((id) => id.startsWith("glp1-") || id === "hormone-therapy");
}

export function getProposalCredibilityBlocks(options: ProposalOption[]): ProposalCredibilityBlock[] {
  const blocks: ProposalCredibilityBlock[] = [];
  const hasM8 = proposalIncludesMorpheus8(options);
  const hasSolaria = proposalIncludesSolaria(options);
  const hasQuantum = proposalIncludesQuantum(options);
  const hasInjectables = proposalIncludesInjectables(options);
  const hasWeightLoss = proposalIncludesWeightLoss(options);

  if (hasM8 || hasSolaria || hasQuantum) {
    blocks.push({
      id: "clinic",
      eyebrow: "Why Hello Gorgeous",
      title: "InMode verified · NP-directed care in Oswego",
      summary:
        "We invested in the real InMode stack — Morpheus8 Burst + Deep, Solaria CO₂, and Quantum RF — so your plan is built on medical-grade technology, not a watered-down copycat.",
      trustLine: MORPHEUS8_MARKETING.trustLine,
      pillars: [],
      chips: [...MORPHEUS8_INMODE_STORY.chips],
      learnMoreHref: hasM8 ? MORPHEUS8_PATH : hasSolaria ? SOLARIA_CO2_PATH : QUANTUM_RF_PATH,
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

  if (hasQuantum) {
    blocks.push({
      id: "quantum",
      eyebrow: QUANTUM_RF_MARKETING.eyebrow,
      title: "What Quantum RF does",
      summary: QUANTUM_RF_MARKETING.subhead,
      trustLine: QUANTUM_RF_MARKETING.trustLine,
      pillars: QUANTUM_RF_WHAT_IT_DOES.map((item) => ({
        title: item.title,
        body: item.body,
        stat: item.stat,
        statLabel: item.statLabel,
      })),
      chips: ["Body contour", "Skin tighten", "In-office", "Trifecta-ready"],
      learnMoreHref: QUANTUM_RF_PATH,
    });
  }

  if (hasInjectables) {
    blocks.push({
      id: "injectables",
      eyebrow: "Injectables · NP on site",
      title: "Neurotoxins & fillers, medically directed",
      summary:
        "Botox, Dysport, and hyaluronic acid fillers are planned around your goals — with candid dosing, facial balance, and follow-up built into the Hello Gorgeous process.",
      trustLine: "On-site nurse practitioner oversight — not remote chart sign-off alone.",
      pillars: [
        {
          title: "Custom mapping",
          body: "Units and syringe plans are individualized — never a one-size menu push.",
          stat: "1:1",
          statLabel: "consult",
        },
        {
          title: "Safety first",
          body: "Medical history, contraindications, and aftercare are reviewed before we inject.",
          stat: "MD/NP",
          statLabel: "oversight",
        },
      ],
      chips: ["Botox / Dysport", "Lips & contour", "Natural balance"],
      learnMoreHref: "/services/injectables",
    });
  }

  if (hasWeightLoss) {
    blocks.push({
      id: "weight-loss",
      eyebrow: "Medical weight loss",
      title: "GLP-1 programs with clinical follow-through",
      summary:
        "Semaglutide and tirzepatide plans include medication at published dose tiers, labs, and ongoing oversight — not a vial-and-hope approach.",
      trustLine: "NP evaluation first. Dose and pricing follow your clinical plan.",
      pillars: [
        {
          title: "Dose-based pricing",
          body: "Monthly cost scales with weekly dose — transparent tiers after evaluation.",
          stat: "Tiered",
          statLabel: "pricing",
        },
        {
          title: "Ongoing support",
          body: "Labs, coaching touchpoints, and reorder check-ins keep your plan safe and on track.",
          stat: "Care",
          statLabel: "included",
        },
      ],
      chips: ["Semaglutide", "Tirzepatide", "NP-led"],
      learnMoreHref: "/glp1-weight-loss",
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
