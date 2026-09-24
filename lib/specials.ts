/** Specials hub — canonical route and nav links. */

export const SPECIALS_PATH = "/specials";

export const SPECIALS_SEO = {
  title: "Solaria CO₂ $599 Fall Special & Menu | Oswego IL",
  description:
    "Fall specials at Hello Gorgeous Med Spa in Oswego: InMode Solaria CO₂ fractional resurfacing $599 with complimentary recovery serum. Botox $10/unit, Morpheus8, Quantum RF. Book a consult.",
  keywords: [
    "Solaria CO2 special Oswego",
    "CO2 laser $599 Oswego IL",
    "Solaria fall special Oswego",
    "med spa specials Oswego",
    "Solaria sale Naperville Aurora",
    "Hello Gorgeous specials",
  ],
} as const;

/** Top conversion picks — shown above the full menu. */
export const SPECIALS_FEATURED = [
  {
    title: "VIP Glow Night",
    accentLine: "One night · RSVP + tell us what you want",
    description:
      "Jammies, champagne, and night-only pricing: Solaria $450 · Morpheus8 $399 · Botox $7/unit · Microblading $399 incl. touch-up. Bring a friend — we prep her IV bag too.",
    href: "/vip-glow",
    badge: "RSVP",
  },
  {
    title: "VIP model spots filled — $500 off",
    accentLine: "$500 off any area · Sept & Oct",
    description:
      "All 20 model spots are filled. Purchase any treatment area in September or October and take $500 off. 0% financing through Cherry for qualified clients.",
    href: "/vip-model",
    badge: "$500 OFF",
  },
  {
    title: "Solaria CO₂ fall special",
    accentLine: "$599 · recovery serum included",
    description:
      "Limited-time InMode Solaria CO₂ fractional resurfacing — complimentary recovery serum included. Results vary. Consultation required.",
    href: "/services/solaria-co2",
    badge: "Fall",
  },
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
    accentLine: "Lashes $89 · Laser from $79 · IPL $79",
    description:
      "Full-set lashes $89 · laser Small $79, Medium $99, Large $129 · dermaplaning & HydraFacial.",
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
    label: "VIP Glow Night RSVP",
    href: "/vip-glow",
    sub: "Solaria $450 · Morpheus8 $399 · Botox $7/u · Microblading $399",
    badge: "TONIGHT",
  },
  {
    label: "Solaria CO₂ fall special",
    href: "/services/solaria-co2",
    sub: "$599 InMode Solaria CO₂ · complimentary recovery serum",
    badge: "FALL",
  },
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
    sub: "Lashes $89 · Laser from $79 · HydraFacial $129 · IPL $79",
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
    label: "VIP Model — $500 off any area",
    href: "/vip-model",
    sub: "All 20 spots filled · purchase in Sept or Oct · 0% with Cherry",
    badge: "$500 OFF",
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
