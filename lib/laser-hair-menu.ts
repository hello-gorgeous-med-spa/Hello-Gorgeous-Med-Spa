import { LASER_HAIR_MEMBERSHIPS } from "@/data/laser-hair-memberships";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const LASER_HAIR_MENU_PATH = "/services/laser-hair-removal" as const;

export const LASER_HAIR_MENU: ServiceMenuConfig = {
  path: LASER_HAIR_MENU_PATH,
  metaTitle: "Laser Hair Removal Menu | $59 Year-End Specials | Hello Gorgeous Oswego",
  metaDescription:
    "Laser hair removal in Oswego — $59 year-end special on underarms, bikini, Brazilian, upper/lower legs, chin/neck/face through Dec 31, 2026. Hello Gorgeous Med Spa.",
  hero: {
    eyebrow: "Oswego, IL · All skin types",
    titleAccent: "Laser Hair Removal",
    subtitle:
      "Medical-grade Zemits DuoCratus laser. Year-end $59 specials on listed areas — locked through December 31, 2026.",
    secondaryCta: { label: "Year-end $59 specials", href: "/oswego-specials#laser" },
  },
  sections: [
    {
      id: "pay-per-session",
      number: "01",
      title: "Year-End $59 Specials",
      description:
        "Price locked through December 31, 2026 — $59 per session on every listed area. No package required.",
      highlights: [
        "Underarms · bikini · Brazilian",
        "Upper legs · lower legs",
        "Chin / neck / face",
        "Zemits DuoCratus medical-grade platform",
        "Series recommended for lasting reduction",
      ],
      pricing: [
        { label: "Underarms", price: "$59", href: "/oswego-specials#laser", note: "Thru Dec 31, 2026" },
        { label: "Bikini", price: "$59", href: "/oswego-specials#laser", note: "Thru Dec 31, 2026" },
        { label: "Brazilian", price: "$59", href: "/oswego-specials#laser", note: "Thru Dec 31, 2026" },
        { label: "Upper legs", price: "$59", href: "/oswego-specials#laser", note: "Thru Dec 31, 2026" },
        { label: "Lower legs", price: "$59", href: "/oswego-specials#laser", note: "Thru Dec 31, 2026" },
        { label: "Chin / neck / face", price: "$59", href: "/oswego-specials#laser", note: "Thru Dec 31, 2026" },
      ],
      learnMoreHref: "/oswego-specials#laser",
      badge: "2026",
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
        { label: "Listed areas — year-end special", price: "$59", href: "/oswego-specials#laser" },
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
  faqs: [
    {
      question: "Which areas are $59 through the end of 2026?",
      answer:
        "Underarms, bikini, Brazilian, upper legs, lower legs, and chin/neck/face — $59 per session per area at Hello Gorgeous Med Spa in Oswego through December 31, 2026.",
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
