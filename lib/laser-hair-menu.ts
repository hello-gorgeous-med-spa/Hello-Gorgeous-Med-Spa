import { LASER_HAIR_MEMBERSHIPS } from "@/data/laser-hair-memberships";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const LASER_HAIR_MENU_PATH = "/services/laser-hair-removal" as const;

export const LASER_HAIR_MENU: ServiceMenuConfig = {
  path: LASER_HAIR_MENU_PATH,
  metaTitle: "Laser Hair Removal Menu | Pay-Per-Session & Memberships | Hello Gorgeous Oswego",
  metaDescription:
    "Laser hair removal in Oswego — underarms $79, lip/chin $59, Brazilian $129, legs $149. Memberships from $69/mo. Spring specials. Hello Gorgeous Med Spa.",
  hero: {
    eyebrow: "Oswego, IL · All skin types",
    titleAccent: "Laser Hair Removal",
    subtitle:
      "Permanent reduction with medical-grade laser technology. Pay-per-session pricing or membership packages — smooth, maintenance-free results.",
    secondaryCta: { label: "Spring special", href: "/spring-special-laser-hair" },
  },
  sections: [
    {
      id: "pay-per-session",
      number: "01",
      title: "Pay-Per-Session",
      description:
        "No packages required — book individual sessions by area. Safe for all skin types, administered by trained clinicians.",
      highlights: [
        "All skin types welcome (Fitz I–VI)",
        "Clinician-administered every visit",
        "Face · body · bikini · underarms",
        "6–8 sessions typical for permanent reduction",
        "Touch-ups as needed after series",
      ],
      pricing: [
        { label: "Underarms", price: "$79", href: "/laser-hair-removal-oswego-il" },
        { label: "Upper lip or chin", price: "$59", href: "/laser-hair-removal-oswego-il" },
        { label: "Brazilian / bikini", price: "$129", href: "/laser-hair-removal-oswego-il" },
        { label: "Full legs or arms", price: "$149", href: "/laser-hair-removal-oswego-il" },
        { label: "Small area (custom)", price: "From $79", href: "/laser-hair-removal-oswego-il" },
        { label: "Medium area", price: "$150–$200", href: "/laser-hair-removal-oswego-il", note: "Quoted at consult" },
        { label: "Large area", price: "$250–$400", href: "/laser-hair-removal-oswego-il", note: "Quoted at consult" },
      ],
      learnMoreHref: "/laser-hair-removal-oswego-il",
    },
    {
      id: "spring-special",
      number: "02",
      title: "Spring Specials",
      description:
        "Limited-time laser promos — pay-per-session pricing with no package commitment, plus seasonal Brazilian packages.",
      highlights: [
        "Underarms $79 · Bikini $129",
        "No packages required for session pricing",
        "Brazilian 3-month package available",
        "Book spring promos while slots last",
        "New & returning clients welcome",
      ],
      pricing: [
        { label: "Underarms (spring promo)", price: "$79", href: "/spring-special-laser-hair" },
        { label: "Lip / chin (spring promo)", price: "$59", href: "/spring-special-laser-hair" },
        { label: "Bikini (spring promo)", price: "$129", href: "/spring-special-laser-hair" },
        { label: "Brazilian 3-month package", price: "$499", href: "/spring-special-laser-hair", note: "Apr–Jun · book by Mar 31 for add-ons" },
      ],
      learnMoreHref: "/spring-special-laser-hair",
      badge: "SPRING",
    },
    {
      id: "memberships",
      number: "03",
      title: "Laser Memberships",
      description:
        "Lock in smooth skin with monthly membership pricing — up to 30% savings vs pay-per-session, with guaranteed results after your plan.",
      highlights: [
        "24-month treatment plans",
        "Guaranteed permanent results",
        "Lifetime touch-ups $50/area after membership",
        "Small · medium · large · full body tiers",
        "Serving Oswego, Naperville, Aurora & Plainfield",
      ],
      pricing: LASER_HAIR_MEMBERSHIPS.tiers.map((tier) => ({
        label: `${tier.name} membership`,
        price: `$${tier.price}/mo`,
        href: "/laser-hair-memberships",
        note: tier.description,
      })),
      learnMoreHref: "/laser-hair-memberships",
      badge: "SAVE 30%",
    },
  ],
  faqs: [
    {
      question: "How many sessions do I need?",
      answer:
        "Most areas need 6–8 sessions spaced 4–6 weeks apart for permanent reduction. Hormonal areas like face and bikini may need occasional maintenance touch-ups.",
    },
    {
      question: "Is laser hair removal safe for dark skin?",
      answer:
        "Yes — our laser is safe for Fitzpatrick types I through VI when settings are adjusted for your skin. We assess candidacy at your first visit.",
    },
    {
      question: "Membership vs pay-per-session?",
      answer:
        "Pay-per-session is best for trying one area or seasonal touch-ups. Memberships save up to 30% monthly and include a structured 24-month plan with lifetime touch-up pricing after completion.",
    },
  ],
};
