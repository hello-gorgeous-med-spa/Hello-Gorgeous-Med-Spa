/** Specials hub — canonical route and nav links. */

export const SPECIALS_PATH = "/specials";

/** Top conversion picks — shown above the full menu. */
export const SPECIALS_FEATURED = [
  {
    title: "Fall Makeover",
    accentLine: "$100 · $200 · $150 off",
    description:
      "Inside + out for fall. Repair $100 off + complimentary gift card. Prevent (Morpheus8) $200 off. Lose $150 off. Consult to lock your plan.",
    href: "/fall-makeover",
    badge: "Fall",
  },
  {
    title: "This is us",
    accentLine: "New downtown studio",
    description:
      "Real night in the Washington Street studio — friends, treatments, and the room we built. Not a stock set.",
    href: "/#this-is-us",
    badge: "Studio",
  },
  {
    title: "HydraFacial Glow Special",
    accentLine: "$129 · Hydra + dermaplaning",
    description:
      "Rejuva Fresh HydraFacial, dermaplaning, oxygen spray, and 2 premium machine add-ons — limited-time clinic special.",
    href: "/hydrafacial-oswego-il#special",
    badge: "New",
  },
  {
    title: "Oswego specials",
    accentLine: "Lashes $89 · Laser from $69 · IPL $79",
    description:
      "Full-set lashes $89 · laser chin/lip $69, medium $89, Brazilian/back/full legs $129 · dermaplaning & HydraFacial.",
    href: "/oswego-specials",
    badge: "Hot",
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
    label: "Fall Makeover — Repair · Prevent · Lose",
    href: "/fall-makeover",
    sub: "$100 off Repair + gift card · $200 off Prevent · $150 off Lose",
    badge: "FALL",
  },
  {
    label: "This is us — new downtown studio",
    href: "/#this-is-us",
    sub: "Event-night photos from Washington Street",
    badge: "STUDIO",
  },
  {
    label: "Oswego Specials Hub",
    href: "/oswego-specials",
    sub: "Lashes $89 · Laser from $69 · HydraFacial $129 · IPL $79",
    badge: "SEO",
  },
  {
    label: "HydraFacial Glow Special",
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
