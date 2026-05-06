export type FunnelDefinition = {
  slug: string;
  title: string;
  intro: string;
  recommendedServiceLinks: { label: string; href: string }[];
};

export const FUNNEL_DEFINITIONS: FunnelDefinition[] = [
  {
    slug: "morpheus8-candidacy",
    title: "Am I a candidate for Morpheus8?",
    intro: "Quick intake to assess your concern profile, timeline goals, and preferred consultation path.",
    recommendedServiceLinks: [
      { label: "Morpheus8 Service", href: "/services/morpheus8" },
      { label: "Morpheus8 Hub", href: "/morpheus8" },
    ],
  },
  {
    slug: "skin-tightening-match",
    title: "Which skin tightening treatment fits me?",
    intro: "Compare your concern depth, downtime tolerance, and treatment goals to build the next consultation conversation.",
    recommendedServiceLinks: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Solaria CO2", href: "/services/solaria-co2" },
    ],
  },
  {
    slug: "facelift-vs-quantum-rf",
    title: "Facelift vs Quantum RF?",
    intro: "Structured intake to clarify candidacy, recovery expectations, and when surgical referral may be the better path.",
    recommendedServiceLinks: [
      { label: "Comparison Guide", href: "/compare/quantum-rf-vs-facelift" },
      { label: "Quantum RF Service", href: "/services/quantum-rf" },
    ],
  },
  {
    slug: "weight-loss-fit",
    title: "What weight loss option fits me?",
    intro: "Gather your concern profile, urgency, and preference so we can route you to the best consult format.",
    recommendedServiceLinks: [
      { label: "Weight Loss Service", href: "/services/weight-loss" },
      { label: "GLP-1 Comparison", href: "/compare/glp1-vs-traditional-weight-loss" },
    ],
  },
];

export function getFunnelBySlug(slug: string): FunnelDefinition | undefined {
  return FUNNEL_DEFINITIONS.find((item) => item.slug === slug);
}
