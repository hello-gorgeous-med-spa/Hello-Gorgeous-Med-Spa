import { LASER_HAIR_MEMBERSHIPS } from "@/data/laser-hair-memberships";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { LASER_59_VALID_THROUGH } from "@/lib/oswego-specials";

export const LASER_HAIR_MENU_PATH = "/services/laser-hair-removal" as const;

export const LASER_HAIR_MENU: ServiceMenuConfig = {
  path: LASER_HAIR_MENU_PATH,
  metaTitle: "Laser Hair Removal Menu | $59 Any Listed Area | Hello Gorgeous Oswego",
  metaDescription: `Laser hair removal in Oswego — $59 any listed area through ${LASER_59_VALID_THROUGH}: face, neck/chin, underarm, upper/lower legs, back, bikini, Brazilian. Hello Gorgeous Med Spa.`,
  hero: {
    eyebrow: "Oswego, IL · All skin types",
    titleAccent: "Laser Hair Removal",
    subtitle: `Medical-grade Zemits DuoCratus laser. Any listed area only $59 — through ${LASER_59_VALID_THROUGH}.`,
    secondaryCta: { label: "$59 laser specials", href: "/oswego-specials#laser" },
  },
  sections: [
    {
      id: "pay-per-session",
      number: "01",
      title: "$59 Any Listed Area",
      description: `Now through ${LASER_59_VALID_THROUGH} — $59 per session on every listed area. No package required. Book with Marissa.`,
      highlights: [
        "Face · neck / chin · underarm",
        "Upper legs · lower legs · back",
        "Bikini · Brazilian",
        "Zemits DuoCratus medical-grade platform",
        "Series recommended for lasting reduction",
      ],
      pricing: [
        { label: "Face", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Neck / chin", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Underarm", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Upper legs", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Lower legs", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Back", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Bikini", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
        { label: "Brazilian", price: "$59", href: "/oswego-specials#laser", note: `Thru ${LASER_59_VALID_THROUGH}` },
      ],
      learnMoreHref: "/oswego-specials#laser",
      badge: "July",
    },
    {
      id: "spring-special",
      number: "02",
      title: "Packages & Standard Pricing",
      description: "Seasonal Brazilian packages and standard pricing for areas outside the $59 list.",
      highlights: [
        "Brazilian 3-month package when offered",
        "Full arms / custom large areas quoted",
        "Memberships for long-term savings",
      ],
      pricing: [
        { label: "Listed areas — July special", price: "$59", href: "/oswego-specials#laser" },
        {
          label: "Brazilian 3-month package",
          price: "$499",
          href: "/spring-special-laser-hair",
          note: "Seasonal package",
        },
        { label: "Full legs or arms (standard)", price: "$149", href: "/laser-hair-removal-oswego-il" },
      ],
      learnMoreHref: "/oswego-specials#laser",
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
  gallery: [
    {
      src: "/images/laser-hair-removal/duocratus-pro-device.png",
      alt: "Zemits DuoCratus Pro laser hair removal system at Hello Gorgeous Med Spa",
      caption: "Zemits DuoCratus Pro — medical-grade laser platform",
    },
    {
      src: "/images/laser-hair-removal/diode-laser-underarm-treatment.png",
      alt: "Diode laser hair removal underarm treatment at Hello Gorgeous Med Spa",
      caption: "In-treatment diode laser session",
    },
  ],
  faqs: [
    {
      question: `Which areas are $59 through ${LASER_59_VALID_THROUGH}?`,
      answer: `Face, neck/chin, underarm, upper legs, lower legs, back, bikini, and Brazilian — $59 per session per area at Hello Gorgeous Med Spa in Oswego through ${LASER_59_VALID_THROUGH}.`,
    },
    {
      question: "How many sessions do I need?",
      answer:
        "Most areas need 6–8 sessions spaced 4–6 weeks apart for permanent reduction. Hormonal areas like face and bikini may need occasional maintenance touch-ups.",
    },
    {
      question: "Is laser hair removal safe for dark skin?",
      answer:
        "Yes — our Zemits DuoCratus laser is safe for Fitzpatrick types I through VI when settings are adjusted for your skin. We assess candidacy at your first visit.",
    },
  ],
};
