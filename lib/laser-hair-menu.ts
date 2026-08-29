import { LASER_HAIR_MEMBERSHIPS } from "@/data/laser-hair-memberships";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import {
  LASER_HAIR_AREAS,
  LASER_HAIR_MENU_BLURB,
  LASER_HAIR_PERFORMERS,
  LASER_HAIR_TIERS,
  laserHairPriceLabel,
} from "@/lib/laser-hair-pricing";

export const LASER_HAIR_MENU_PATH = "/services/laser-hair-removal" as const;

export const LASER_HAIR_MENU: ServiceMenuConfig = {
  path: LASER_HAIR_MENU_PATH,
  metaTitle: "Laser Hair Removal | Chin & Lip $69 · Medium $89 · Large $129 | Hello Gorgeous Oswego",
  metaDescription: `Laser hair removal in Oswego — ${LASER_HAIR_MENU_BLURB} Medical-grade Zemits DuoCratus at Hello Gorgeous Med Spa.`,
  hero: {
    eyebrow: "Oswego, IL · All skin types",
    titleAccent: "Laser Hair Removal",
    subtitle: `Medical-grade Zemits DuoCratus. ${LASER_HAIR_MENU_BLURB}`,
    secondaryCta: { label: "Book laser", href: "/book?ref=laser_hair_menu" },
  },
  sections: [
    {
      id: "pay-per-session",
      number: "01",
      title: "Pay Per Session",
      description: `No package required. ${LASER_HAIR_PERFORMERS} perform every listed area on Zemits DuoCratus.`,
      highlights: [
        `Small — chin or lip ${LASER_HAIR_TIERS.small.priceLabel}`,
        `Medium — underarms, upper or lower legs, bikini ${LASER_HAIR_TIERS.medium.priceLabel}`,
        `Large — Brazilian, back, full legs ${LASER_HAIR_TIERS.large.priceLabel}`,
        "Zemits DuoCratus medical-grade platform",
        "Series recommended for lasting reduction",
      ],
      pricing: LASER_HAIR_AREAS.map((area) => ({
        label: area.label,
        price: laserHairPriceLabel(area.price),
        href: "/book?ref=laser_hair_menu",
        note: `${area.tier === "small" ? "Small" : area.tier === "medium" ? "Medium" : "Large"} area`,
      })),
      learnMoreHref: "/book?ref=laser_hair_menu",
    },
    {
      id: "packages",
      number: "02",
      title: "Packages",
      description: "Seasonal Brazilian packages when offered — otherwise book the area you want, per session.",
      highlights: [
        "Brazilian 3-month package when offered",
        "Custom large areas quoted in clinic",
        "Memberships for long-term savings",
      ],
      pricing: [
        {
          label: "Laser Brazilian — 3-Month Package",
          price: "$499",
          href: "/spring-special-laser-hair",
          note: "Book in Square · follow-ups as Prepaid Package Visit $0",
        },
      ],
      learnMoreHref: "/laser-hair-memberships",
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
      question: "How much is laser hair removal at Hello Gorgeous?",
      answer: LASER_HAIR_MENU_BLURB,
    },
    {
      question: "Who performs laser hair removal?",
      answer: `${LASER_HAIR_PERFORMERS} perform laser hair removal at Hello Gorgeous Med Spa in Oswego.`,
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
