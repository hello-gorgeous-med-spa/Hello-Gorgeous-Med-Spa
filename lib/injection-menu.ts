/** The Injection Menu — peptides & vitamin wellness shots (in-spa poster). */

import { PEPTIDES_HUB_PATH, peptideTopicHref } from "@/lib/peptides-hub";
import { BOOKING_URL } from "@/lib/flows";

export const INJECTION_MENU_PATH = "/injection-menu";
export const INJECTION_MENU_PDF = "/docs/Hello-Gorgeous-Injection-Menu.pdf";

export const INJECTION_MENU_POSTER = {
  src: "/images/promo/injection-menu-poster.png",
  alt: "Hello Gorgeous Med Spa Injection Menu — peptide therapies and vitamin wellness shots, Oswego IL",
} as const;

export type InjectionMenuItem = {
  name: string;
  subtitle?: string;
  description: string;
  tags: string[];
  favorite?: boolean;
  href: string;
  consultFirst?: boolean;
};

export type InjectionMenuSection = {
  id: string;
  heading: string;
  tagline: string;
  items: InjectionMenuItem[];
};

export const INJECTION_MENU_SECTIONS: InjectionMenuSection[] = [
  {
    id: "peptides",
    heading: "Signature Peptide & Advanced Therapies",
    tagline: "advanced wellness · provider-guided",
    items: [
      {
        name: "PT-141 (Bremelanotide)",
        description: "Reignites desire and intimacy — supports libido for women & men.",
        tags: ["INTIMACY", "CONFIDENCE", "MEN & WOMEN"],
        href: peptideTopicHref("pt-141"),
      },
      {
        name: "GHK-Cu (Copper Peptide)",
        description: "Repair & renew — supports collagen, skin glow, hair & tissue recovery.",
        tags: ["SKIN", "HAIR", "ANTI-AGING"],
        favorite: true,
        href: peptideTopicHref("ghk-cu-injectable"),
      },
      {
        name: "Tesamorelin",
        description: "Lean & defined — targets stubborn midsection fat & supports recovery.",
        tags: ["BODY COMPOSITION", "ENERGY"],
        href: peptideTopicHref("tesamorelin"),
      },
      {
        name: "GLP-1 Weight Loss (Semaglutide / Tirzepatide)",
        description: "Calms appetite & supports steady, sustainable weight goals.",
        tags: ["WEIGHT", "APPETITE"],
        favorite: true,
        consultFirst: true,
        href: "/rx/metabolic",
      },
      {
        name: "NAD+",
        description: "Cellular energy & clarity — supports focus, recovery & healthy aging.",
        tags: ["ENERGY", "MENTAL CLARITY", "LONGEVITY"],
        favorite: true,
        href: "/services/nad-plus-injections-oswego-il",
      },
      {
        name: "Glutathione",
        description: "The master antioxidant — brightens skin & supports gentle detox.",
        tags: ["SKIN BRIGHTENING", "DETOX", "ANTIOXIDANT"],
        href: peptideTopicHref("glutathione"),
      },
      {
        name: "BPC-157 (Body Protection Compound)",
        description: "Repair & recover — supports gut, joints, tendons & tissue healing.",
        tags: ["RECOVERY", "GUT HEALTH", "JOINTS"],
        href: peptideTopicHref("bpc-157"),
      },
      {
        name: "Sermorelin",
        description: "Supports your own growth hormone — better sleep, recovery & lean tone.",
        tags: ["RECOVERY", "SLEEP", "ANTI-AGING"],
        href: peptideTopicHref("sermorelin"),
      },
      {
        name: "Naltrexone (Low-Dose / LDN)",
        description:
          "A gentle low-dose therapy that supports mood, inflammation, cravings & overall wellness.",
        tags: ["WELLNESS", "CRAVINGS", "BALANCE"],
        href: "/contact",
      },
    ],
  },
  {
    id: "vitamins",
    heading: "Vitamin & Wellness Injections",
    tagline: "fast, simple, feel-good boosts",
    items: [
      {
        name: "B12 (Methylcobalamin)",
        description: "The classic energy boost — supports metabolism & a brighter mood.",
        tags: ["ENERGY", "METABOLISM", "MOOD"],
        favorite: true,
        href: "/free-vitamin",
      },
      {
        name: "MIC / Lipo (Lipotropic)",
        description: "Fat-burning blend that supports your weight & wellness goals.",
        tags: ["FAT METABOLISM", "SLIMMING SUPPORT"],
        href: "/services/iv-therapy",
      },
      {
        name: "Vitamin Complex",
        description: "Full-spectrum B blend for all-over vitality & everyday balance.",
        tags: ["VITALITY", "IMMUNE", "DAILY BOOST"],
        href: "/services/iv-therapy",
      },
      {
        name: "Taurine",
        description: "Amino-acid support for stamina, focus & faster recovery.",
        tags: ["ENDURANCE", "FOCUS", "RECOVERY"],
        href: "/services/iv-therapy",
      },
      {
        name: "Biotin",
        description: "Beauty from within — supports hair, skin & nail strength.",
        tags: ["HAIR", "SKIN", "NAILS"],
        href: "/free-vitamin",
      },
      {
        name: "Niagen (Nicotinamide Riboside)",
        description: "NAD+ precursor — supports cellular energy, metabolism & healthy aging.",
        tags: ["CELLULAR ENERGY", "LONGEVITY", "RECOVERY"],
        href: "/services/nad-plus-injections-oswego-il",
      },
    ],
  },
];

export const INJECTION_MENU_BOOK_HREF = BOOKING_URL;
export const INJECTION_MENU_PEPTIDES_HREF = PEPTIDES_HUB_PATH;
