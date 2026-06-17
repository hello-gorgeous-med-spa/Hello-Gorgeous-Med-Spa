export type BuyerPathCategory = {
  id: string;
  title: string;
  summary: string;
  treatments: string[];
  href: string;
  cta: string;
};

export const HOMEPAGE_BUYER_PATHS: BuyerPathCategory[] = [
  {
    id: "injectables",
    title: "Injectables",
    summary: "Neuromodulators, fillers, and under-eye rejuvenation with NP oversight.",
    treatments: ["Botox", "Dysport", "Jeuveau", "Lip filler", "Facial balancing", "PRF under-eye"],
    href: "/services/injectables",
    cta: "Explore Injectables",
  },
  {
    id: "skin-laser",
    title: "Skin + Laser",
    summary: "Resurfacing, tightening, and glow — from clinical lasers to HydraFacial.",
    treatments: ["Solaria CO₂", "IPL", "Microneedling", "Morpheus8", "Chemical peels", "HydraFacial"],
    href: "/solaria-co2-oswego",
    cta: "Explore Skin Treatments",
  },
  {
    id: "body",
    title: "Body Contouring",
    summary: "Non-surgical contouring and skin tightening for stomach, thighs, arms, and more.",
    treatments: ["Quantum RF", "Morpheus8 Body", "Burst", "Skin tightening", "Cellulite improvement"],
    href: "/body-contouring-oswego-il",
    cta: "Explore Body Treatments",
  },
  {
    id: "wellness-programs",
    title: "Weight Loss + Hormones",
    summary: "Medical weight loss and hormone optimization with labs and follow-up built in.",
    treatments: ["GLP-1 weight loss", "HRT", "TRT", "BioTE", "Peptide support", "Wellness consults"],
    href: "/glp-1-weight-loss-oswego",
    cta: "Explore Wellness Programs",
  },
  {
    id: "iv-wellness",
    title: "IV Therapy + Wellness",
    summary: "IV drips, vitamin injections, and recovery support in our Oswego clinic.",
    treatments: ["IV therapy", "Vitamin injections", "NAD+", "Glutathione", "Wellness support"],
    href: "/iv-therapy",
    cta: "Explore Wellness Services",
  },
];
