/**
 * Map proposal catalog services → public pre/post care guides.
 */

import { SITE } from "@/lib/seo";
import type { ProposalOption } from "@/lib/proposals/utils";

export type ProposalCareGuide = {
  id: string;
  title: string;
  path: string;
  description: string;
};

const CARE_BY_SERVICE_ID: Record<string, ProposalCareGuide> = {
  "pkg-transformation": {
    id: "morpheus8-burst",
    title: "Morpheus8 Burst",
    path: "/pre-post-care/morpheus8-burst",
    description: "Pre & post care for RF microneedling (Burst + Deep).",
  },
  "pkg-ultimate": {
    id: "morpheus8-burst",
    title: "Morpheus8 Burst",
    path: "/pre-post-care/morpheus8-burst",
    description: "Pre & post care for RF microneedling (Burst + Deep).",
  },
  "morpheus8-face": {
    id: "morpheus8-burst",
    title: "Morpheus8 Burst",
    path: "/pre-post-care/morpheus8-burst",
    description: "Pre & post care for RF microneedling (Burst + Deep).",
  },
  "morpheus8-neck": {
    id: "morpheus8-burst",
    title: "Morpheus8 Burst",
    path: "/pre-post-care/morpheus8-burst",
    description: "Pre & post care for RF microneedling (Burst + Deep).",
  },
  "morpheus8-body": {
    id: "morpheus8-burst",
    title: "Morpheus8 Burst",
    path: "/pre-post-care/morpheus8-burst",
    description: "Pre & post care for RF microneedling (Burst + Deep).",
  },
  "solaria-co2-full": {
    id: "solaria-co2",
    title: "Solaria CO₂",
    path: "/pre-post-care/solaria-co2",
    description: "Pre & post care for fractional CO₂ resurfacing.",
  },
  "solaria-co2-partial": {
    id: "solaria-co2",
    title: "Solaria CO₂",
    path: "/pre-post-care/solaria-co2",
    description: "Pre & post care for fractional CO₂ resurfacing.",
  },
  "quantum-rf": {
    id: "quantum-rf",
    title: "Quantum RF",
    path: "/pre-post-care/quantum-rf",
    description: "Pre & post care for subdermal RF tightening.",
  },
  botox: {
    id: "botox",
    title: "Botox / Dysport / Jeuveau",
    path: "/pre-post-care/botox",
    description: "Neurotoxin pre and post care.",
  },
  dysport: {
    id: "botox",
    title: "Botox / Dysport / Jeuveau",
    path: "/pre-post-care/botox",
    description: "Neurotoxin pre and post care.",
  },
  "dermal-filler": {
    id: "filler",
    title: "Dermal Fillers",
    path: "/pre-post-care/filler",
    description: "Filler pre and post care.",
  },
  "lip-filler": {
    id: "filler",
    title: "Lip / Dermal Fillers",
    path: "/pre-post-care/filler",
    description: "Filler pre and post care.",
  },
  "prp-facial": {
    id: "prp-prf",
    title: "PRP / PRF",
    path: "/pre-post-care/prp-prf",
    description: "PRP/PRF regenerative care guide.",
  },
  "ez-prf-gel": {
    id: "prp-prf",
    title: "PRP / PRF",
    path: "/pre-post-care/prp-prf",
    description: "PRP/PRF regenerative care guide.",
  },
  "hormone-therapy": {
    id: "hormone-therapy",
    title: "Hormone Therapy",
    path: "/pre-post-care/hormone-therapy",
    description: "Hormone therapy care guide.",
  },
  "glp1-consult": {
    id: "weight-loss",
    title: "Weight Loss Therapy",
    path: "/pre-post-care/weight-loss",
    description: "GLP-1 / medical weight loss care guide.",
  },
  jeuveau: {
    id: "botox",
    title: "Botox / Dysport / Jeuveau",
    path: "/pre-post-care/botox",
    description: "Neurotoxin pre and post care.",
  },
  xeomin: {
    id: "botox",
    title: "Botox / Dysport / Jeuveau",
    path: "/pre-post-care/botox",
    description: "Neurotoxin pre and post care.",
  },
  daxxify: {
    id: "botox",
    title: "Botox / Dysport / Jeuveau",
    path: "/pre-post-care/botox",
    description: "Neurotoxin pre and post care.",
  },
  "lip-flip": {
    id: "botox",
    title: "Botox / Dysport / Jeuveau",
    path: "/pre-post-care/botox",
    description: "Neurotoxin pre and post care.",
  },
  "filler-half-syringe": {
    id: "filler",
    title: "Dermal Fillers",
    path: "/pre-post-care/filler",
    description: "Filler pre and post care.",
  },
  "filler-2-syringe": {
    id: "filler",
    title: "Dermal Fillers",
    path: "/pre-post-care/filler",
    description: "Filler pre and post care.",
  },
  "morpheus8-3pack": {
    id: "morpheus8-burst",
    title: "Morpheus8 Burst",
    path: "/pre-post-care/morpheus8-burst",
    description: "Pre & post care for RF microneedling (Burst + Deep).",
  },
  "quantum-rf-neck-pkg": {
    id: "quantum-rf",
    title: "Quantum RF",
    path: "/pre-post-care/quantum-rf",
    description: "Pre & post care for subdermal RF tightening.",
  },
  "quantum-rf-abdomen-pkg": {
    id: "quantum-rf",
    title: "Quantum RF",
    path: "/pre-post-care/quantum-rf",
    description: "Pre & post care for subdermal RF tightening.",
  },
  "microneedling-ha": {
    id: "microneedling",
    title: "Microneedling",
    path: "/pre-post-care/microneedling",
    description: "Microneedling prep and aftercare.",
  },
  "microneedling-growth-factors": {
    id: "microneedling",
    title: "Microneedling",
    path: "/pre-post-care/microneedling",
    description: "Microneedling prep and aftercare.",
  },
  "baby-tox-luxe": {
    id: "microneedling",
    title: "Microneedling",
    path: "/pre-post-care/microneedling",
    description: "Microneedling prep and aftercare.",
  },
  "microneedling-exosomes": {
    id: "microneedling",
    title: "Microneedling",
    path: "/pre-post-care/microneedling",
    description: "Microneedling prep and aftercare.",
  },
  "microneedling-3pack": {
    id: "microneedling",
    title: "Microneedling",
    path: "/pre-post-care/microneedling",
    description: "Microneedling prep and aftercare.",
  },
  "microneedling-prp-combo": {
    id: "prp-prf",
    title: "PRP / PRF",
    path: "/pre-post-care/prp-prf",
    description: "PRP/PRF regenerative care guide.",
  },
  "prp-express": {
    id: "prp-prf",
    title: "PRP / PRF",
    path: "/pre-post-care/prp-prf",
    description: "PRP/PRF regenerative care guide.",
  },
  "prf-under-eye": {
    id: "prp-prf",
    title: "PRP / PRF",
    path: "/pre-post-care/prp-prf",
    description: "PRP/PRF regenerative care guide.",
  },
  "prf-hair-restoration": {
    id: "prp-prf",
    title: "PRP / PRF",
    path: "/pre-post-care/prp-prf",
    description: "PRP/PRF regenerative care guide.",
  },
  "hydrafacial-glow-special": {
    id: "microneedling",
    title: "Facial / Skin Treatments",
    path: "/pre-post-care/microneedling",
    description: "Skin treatment prep and aftercare guidance.",
  },
  "glass-glow-facial": {
    id: "microneedling",
    title: "Facial / Skin Treatments",
    path: "/pre-post-care/microneedling",
    description: "Skin treatment prep and aftercare guidance.",
  },
  "laser-hair-listed-area": {
    id: "laser",
    title: "Laser / Light Treatments",
    path: "/pre-post-care/laser",
    description: "Laser hair removal prep and aftercare.",
  },
  "laser-brazilian-3mo": {
    id: "laser",
    title: "Laser / Light Treatments",
    path: "/pre-post-care/laser",
    description: "Laser hair removal prep and aftercare.",
  },
  hydrafacial: {
    id: "microneedling",
    title: "Facial / Skin Treatments",
    path: "/pre-post-care/microneedling",
    description: "Skin treatment prep and aftercare guidance.",
  },
  "ipl-photofacial": {
    id: "laser",
    title: "Laser / Light Treatments",
    path: "/pre-post-care/laser",
    description: "Light-based treatment prep and aftercare.",
  },
  "ghk-cu-formulation-30": {
    id: "prp-prf",
    title: "Peptide / Regenerative Care",
    path: "/pre-post-care/prp-prf",
    description: "Supportive care notes for regenerative protocols.",
  },
  "ghk-cu-formulation-90": {
    id: "prp-prf",
    title: "Peptide / Regenerative Care",
    path: "/pre-post-care/prp-prf",
    description: "Supportive care notes for regenerative protocols.",
  },
};

/** Extra Solaria guide when Transformation package is present. */
const SOLARIA_GUIDE: ProposalCareGuide = {
  id: "solaria-co2",
  title: "Solaria CO₂",
  path: "/pre-post-care/solaria-co2",
  description: "Pre & post care for fractional CO₂ resurfacing.",
};

function isGlp1ServiceId(id: string): boolean {
  return id.startsWith("glp1-");
}

export function careGuidesForProposalOptions(options: ProposalOption[]): ProposalCareGuide[] {
  const byId = new Map<string, ProposalCareGuide>();

  for (const option of options) {
    for (const service of option.services) {
      const mapped = CARE_BY_SERVICE_ID[service.id];
      if (mapped) byId.set(mapped.id, mapped);
      else if (isGlp1ServiceId(service.id)) {
        byId.set("weight-loss", CARE_BY_SERVICE_ID["glp1-consult"]);
      }

      if (service.id === "pkg-transformation") {
        byId.set(SOLARIA_GUIDE.id, SOLARIA_GUIDE);
      }
    }
  }

  return [...byId.values()];
}

export function absoluteCareGuideUrl(path: string, baseUrl = SITE.url): string {
  return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
