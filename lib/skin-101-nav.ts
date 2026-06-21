/** Client education hub — Science Explainer Series */

export const SKIN_101_PATH = "/skin-101";

export type Skin101Guide = {
  slug: string;
  path: string;
  title: string;
  shortTitle: string;
  tagline: string;
  excerpt: string;
  badge?: string;
  pdfPath?: string;
  relatedServiceLinks?: { label: string; href: string }[];
};

export const SKIN_101_GUIDES: Skin101Guide[] = [
  {
    slug: "skincare-acids",
    path: `${SKIN_101_PATH}/skincare-acids`,
    title: "The Skincare Acids Guide",
    shortTitle: "Skincare Acids",
    tagline: "Seven acids, seven jobs",
    excerpt:
      "A plain-language breakdown of lactic, glycolic, mandelic, hyaluronic, azelaic, salicylic, and vitamin C — what each does, who it's for, and how to pair them without fighting your routine.",
    badge: "NEW",
    pdfPath: "/handouts/education/skincare-acids-guide.pdf",
    relatedServiceLinks: [
      { label: "Facials & Peels", href: "/services/facials-and-peels" },
      { label: "Microneedling Menu", href: "/services/microneedling" },
      { label: "AnteAGE Microneedling", href: "/services/anteage-microneedling-exosomes" },
    ],
  },
  {
    slug: "collagen-types",
    path: `${SKIN_101_PATH}/collagen-types`,
    title: "Not All Collagen Is The Same",
    shortTitle: "Collagen Types",
    tagline: "Know what's behind the marketing",
    excerpt:
      "Type I, III, IV, and VII do different jobs in your skin. See what microneedling, RF, CO₂, PRP, exosomes, and retinoids actually target — and what's still emerging.",
    badge: "NEW",
    pdfPath: "/handouts/education/collagen-types-guide.pdf",
    relatedServiceLinks: [
      { label: "Morpheus8 Burst", href: "/morpheus8-burst-oswego" },
      { label: "Solaria CO₂", href: "/solaria-co2-oswego" },
      { label: "PRP & PRF", href: "/services/prf-prp" },
      { label: "Regenerative Medicine", href: "/regenerative-medicine-oswego-il" },
    ],
  },
  {
    slug: "lymphatic-drainage",
    path: `${SKIN_101_PATH}/lymphatic-drainage`,
    title: "Facial Lymphatic Drainage",
    shortTitle: "Lymphatic Drainage",
    tagline: "De-puff — done in the right order",
    excerpt:
      "Why neck comes first, how light your pressure should be, and when lymphatic massage is safe after Botox, filler, microneedling, lasers, and Sculptra.",
    badge: "NEW",
    pdfPath: "/handouts/education/lymphatic-drainage-guide.pdf",
    relatedServiceLinks: [
      { label: "Facials & Peels", href: "/services/facials-and-peels" },
      { label: "Botox Oswego", href: "/botox-oswego" },
      { label: "Lip Filler", href: "/lip-filler-oswego" },
      { label: "Pre & Post Care", href: "/pre-post-care" },
    ],
  },
];

export const SKIN_101_NAV = {
  label: "Skin 101",
  href: SKIN_101_PATH,
  links: [
    {
      label: "Skin 101 Hub",
      href: SKIN_101_PATH,
      sub: "Science Explainer Series — learn before you book",
      badge: "NEW",
    },
    ...SKIN_101_GUIDES.map((g) => ({
      label: g.shortTitle,
      href: g.path,
      sub: g.tagline,
      badge: g.badge,
    })),
    {
      label: "FAQ",
      href: "/faq",
      sub: "Straight answers about treatments & booking",
    },
    {
      label: "Blog & Guides",
      href: "/blog",
      sub: "Long-form articles from Hello Gorgeous",
    },
    {
      label: "Help Me Choose",
      href: "/help-me-choose",
      sub: "Not sure where to start? We'll point you",
    },
  ],
};

export function isSkin101Active(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === SKIN_101_PATH || pathname.startsWith(`${SKIN_101_PATH}/`);
}
