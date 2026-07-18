/** Education graphics for Botox & Fillers marketing pages. */

export type InjectablesEducationAudience = "botox" | "filler" | "both";

export type InjectablesEducationCard = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  audience: InjectablesEducationAudience;
  href?: string;
};

const BASE = "/images/injectables/education";

export const INJECTABLES_EDUCATION_CARDS: InjectablesEducationCard[] = [
  {
    id: "first-time-filler",
    title: "First-time filler: what to expect",
    image: `${BASE}/first-time-filler.png`,
    imageAlt: "First time filler — consult, numbing, and injections at Hello Gorgeous",
    audience: "filler",
    href: "/lip-filler-oswego",
  },
  {
    id: "less-bruising",
    title: "3 tips for less bruising after fillers",
    image: `${BASE}/less-bruising-tips.png`,
    imageAlt: "Tips to reduce bruising after dermal filler — Hello Gorgeous Med Spa",
    audience: "filler",
    href: "/pre-post-care/filler",
  },
  {
    id: "lips",
    title: "Lips",
    image: `${BASE}/lips.png`,
    imageAlt: "Lip filler aesthetic — Hello Gorgeous Med Spa Oswego",
    audience: "filler",
    href: "/lip-filler-oswego",
  },
  {
    id: "glow-lips",
    title: "Natural lip enhancement",
    image: `${BASE}/glow-lips-portrait.png`,
    imageAlt: "Glowing skin and lips — lip filler inspiration at Hello Gorgeous",
    audience: "filler",
    href: "/lip-filler-oswego",
  },
  {
    id: "dissolving",
    title: "Dissolving facial filler",
    image: `${BASE}/dissolving-filler.png`,
    imageAlt: "Hyaluronidase dissolving facial filler — Hello Gorgeous Med Spa",
    audience: "filler",
    href: "/dermal-fillers-oswego",
  },
  {
    id: "collagen",
    title: "Why collagen is so important",
    image: `${BASE}/why-collagen.png`,
    imageAlt: "Why collagen matters for skin volume and firmness",
    audience: "both",
    href: "/services/morpheus8",
  },
  {
    id: "anti-aging-50s",
    title: "Anti-aging in your 50s",
    image: `${BASE}/anti-aging-50s.png`,
    imageAlt: "Anti-aging in your 50s — filler, Botox, and RF microneedling",
    audience: "both",
    href: "/services/injectables",
  },
  {
    id: "tell-injector",
    title: "Things you should always tell your injector",
    image: `${BASE}/tell-your-injector.png`,
    imageAlt: "What to tell your injector before Botox or filler",
    audience: "both",
  },
  {
    id: "hyperhidrosis",
    title: "Botox for hyperhidrosis",
    image: `${BASE}/botox-hyperhidrosis.png`,
    imageAlt: "Botox for hyperhidrosis — excessive sweating treatment",
    audience: "botox",
    href: "/hyperhidrosis-botox",
  },
  {
    id: "masseter",
    title: "Masseter Botox",
    image: `${BASE}/masseter-botox.png`,
    imageAlt: "Masseter Botox for jawline slimming — Hello Gorgeous Oswego",
    audience: "botox",
    href: "/masseter-botox-oswego-il",
  },
];

export function educationCardsFor(audience: InjectablesEducationAudience): InjectablesEducationCard[] {
  if (audience === "both") return INJECTABLES_EDUCATION_CARDS;
  return INJECTABLES_EDUCATION_CARDS.filter((c) => c.audience === audience || c.audience === "both");
}
