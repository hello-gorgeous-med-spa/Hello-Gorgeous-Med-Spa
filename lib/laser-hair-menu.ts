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
  metaTitle: "Laser Hair Removal | Small $79 · Medium $99 · Large $129 | Hello Gorgeous Oswego",
  metaDescription: `Laser hair removal in Oswego on the Zemits DuoCratus Pro, an 808 nm diode laser. ${LASER_HAIR_MENU_BLURB}`,
  hero: {
    eyebrow: "Oswego, IL · Zemits DuoCratus Pro",
    titleAccent: "Laser Hair Removal",
    subtitle: `Zemits DuoCratus Pro — 808 nm diode laser for hair reduction, with IPL on the same platform. ${LASER_HAIR_MENU_BLURB}`,
    secondaryCta: { label: "Book laser", href: "/book?ref=laser_hair_menu" },
  },
  sections: [
    {
      id: "pay-per-session",
      number: "01",
      title: "Pay Per Session",
      description: `No package required. ${LASER_HAIR_PERFORMERS} perform every listed area on the Zemits DuoCratus Pro.`,
      highlights: [
        `Small — chin or lip ${LASER_HAIR_TIERS.small.priceLabel}`,
        `Medium — underarms, upper or lower legs, bikini ${LASER_HAIR_TIERS.medium.priceLabel}`,
        `Large — Brazilian, back, full legs ${LASER_HAIR_TIERS.large.priceLabel}`,
        "Zemits DuoCratus Pro · 808 nm diode, plus IPL",
        "Series recommended for lasting reduction",
      ],
      pricing: LASER_HAIR_AREAS.map((area) => ({
        label: area.label,
        price: laserHairPriceLabel(area.price),
        href: "/book?service=laser-hair-removal",
        note: `${area.tier === "small" ? "Small" : area.tier === "medium" ? "Medium" : "Large"} area`,
      })),
      learnMoreHref: "/book?service=laser-hair-removal",
    },
    {
      id: "packages",
      number: "02",
      title: "Packages",
      description: "Book Small, Medium, or Large in Square — then tell us the area at the chair.",
      highlights: [
        "One booking — pick your area size",
        "Custom extra areas quoted in clinic",
        "Memberships for long-term savings",
      ],
      pricing: [
        {
          label: "Laser Hair Removal — Pick Your Area",
          price: "$79–$129",
          href: "/book?service=laser-hair-removal",
          note: "Small $79 · Medium $99 · Large $129",
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
        "Hair removal on the DuoCratus Pro is an 808 nm diode. The energy is chosen for your skin at the visit. Darker hair responds more readily because the laser looks for pigment. Blonde, red, and gray hair may not. We say no when the settings are not a fit.",
    },
  ],
};
