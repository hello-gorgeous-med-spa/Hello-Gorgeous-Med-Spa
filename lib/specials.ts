/** Specials hub — canonical route and nav links. */

export const SPECIALS_PATH = "/specials";

/** Top conversion picks — shown above the full menu. */
export const SPECIALS_FEATURED = [
  {
    title: "Oswego specials blast",
    accentLine: "Lashes $89 · Laser $59 · IPL $79",
    description:
      "Plus Marissa’s HydraFacial $129. Prices locked through Dec 31, 2026 — get Marissa busy.",
    href: "/oswego-specials",
    badge: "Hot",
  },
  {
    title: "HydraFacial + Dermaplaning",
    accentLine: "$129 with Marissa",
    description:
      "Rejuva Fresh HydraFacial, dermaplaning, oxygen spray, and 2 premium machine add-ons — book with Marissa.",
    href: "/hydrafacial-oswego-il#special",
    badge: "New",
  },
  {
    title: "First-time Botox",
    accentLine: "$10 per unit",
    description: "NP-directed neurotoxin with a written plan — not a revolving-door inject-only visit.",
    href: "/botox-oswego",
    badge: "Popular",
  },
  {
    title: "Lip filler",
    accentLine: "$450 · 1 syringe",
    description: "$399 each when you book 2 syringes. Natural volume with Dani's artistic eye.",
    href: "/lip-filler-oswego",
  },
] as const;

export const SPECIALS_JUMP_LINKS = [
  { id: "featured", label: "Featured" },
  { id: "menu", label: "Menu poster" },
  { id: "signature-menu", label: "Signature menu" },
  { id: "more-offers", label: "More offers" },
] as const;

export const MORE_SPECIALS_LINKS = [
  {
    label: "Oswego Specials Hub",
    href: "/oswego-specials",
    sub: "HydraFacial $129 · Lashes $89 · Laser $59 · IPL $79 · thru Dec 2026",
    badge: "SEO",
  },
  {
    label: "Marissa’s HydraFacial Glow Special",
    href: "/hydrafacial-oswego-il#special",
    sub: "$129 · HydraFacial + dermaplaning + O₂ + 2 add-ons",
    badge: "NEW",
  },
  {
    label: "Injection Menu",
    href: "/injection-menu",
    sub: "Peptides & vitamin wellness shots — provider-guided",
    badge: "NEW",
  },
  {
    label: "Quantum RF Launch Packages",
    href: "/quantum-rf-oswego#packages",
    sub: "Neck $2,499 · Abdomen $3,999 · FREE Morpheus8 Burst",
    badge: "NEW",
  },
  {
    label: "Spring Laser Hair Special",
    href: "/spring-special-laser-hair",
    sub: "Underarms $79 · Bikini $129 · No packages required",
    badge: "SPRING",
  },
  {
    label: "VIP Model Program",
    href: "/vip-model",
    sub: "Up to 50% off advanced treatments — limited spots",
    badge: "50% OFF",
  },
  {
    label: "Memberships",
    href: "/monthly-memberships",
    sub: "Vitamin Bar, facial, lash & Gentlemen's Club plans",
  },
  {
    label: "Free Vitamin Shot",
    href: "/free-vitamin",
    sub: "New clients only",
    badge: "FREE",
  },
  {
    label: "Financing",
    href: "/financing",
    sub: "CareCredit, Cherry & Affirm available",
  },
  {
    label: "Alle Rewards",
    href: "/alle-botox-rewards",
    sub: "Earn points on Botox & Juvederm",
  },
] as const;
