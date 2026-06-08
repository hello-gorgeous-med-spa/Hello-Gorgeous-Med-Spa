import { SITE } from "@/lib/seo";
import { squareGiftCardUrl } from "@/lib/gift-cards";

export const GENTLEMENS_CLUB_PATH = "/gentlemens-club" as const;
export const GENTLEMENS_CLUB_URL = `${SITE.url}${GENTLEMENS_CLUB_PATH}`;

export const GENTLEMENS_CLUB_HERO_IMAGE = "/images/gentlemens-club/gentlemens-club-hero.png";
export const GENTLEMENS_CLUB_FATHERS_DAY_IMAGE = "/images/gentlemens-club/fathers-day-brotox.png";

export const GENTLEMENS_CLUB_HERO_IMAGES = [
  {
    src: GENTLEMENS_CLUB_HERO_IMAGE,
    alt: "The Gentlemen's Club — Brotox, hormones, peptide therapy and recovery for men at Hello Gorgeous Med Spa Oswego IL",
    label: "The Gentlemen's Club",
  },
  {
    src: GENTLEMENS_CLUB_FATHERS_DAY_IMAGE,
    alt: "Happy Father's Day — Gift Brotox membership at Hello Gorgeous Med Spa Oswego IL",
    label: "Gift Brotox",
  },
] as const;

export type GentlemensClubTier = {
  id: string;
  name: string;
  pricePerMonth: number;
  summary: string;
  perks: string[];
  highlight?: boolean;
  footnote?: string;
  squarePayUrl?: string;
};

export const GENTLEMENS_CLUB_TIERS: GentlemensClubTier[] = [
  {
    id: "the-gentleman",
    name: "The Gentleman",
    pricePerMonth: 99,
    highlight: true,
    summary: "Monthly wellness shot plus member pricing on Brotox and every service.",
    perks: [
      "Monthly wellness shot (B12, Lipo-C, or NAD+)",
      "Member pricing on all services",
      "Priority booking",
      "Discounted Brotox treatments",
    ],
    footnote: "No contracts. Cancel anytime.",
    squarePayUrl: "https://square.link/u/8e9WK7ma",
  },
  {
    id: "the-distinguished-gentleman",
    name: "The Distinguished Gentleman",
    pricePerMonth: 149,
    summary: "Everything in The Gentleman plus hormone and peptide optimization support.",
    perks: [
      "Everything in The Gentleman",
      "Monthly hormone check-in",
      "Peptide protocol support",
      "Exclusive member events",
    ],
    footnote: "For the man serious about optimization.",
    squarePayUrl: "https://square.link/u/uemvpZVN",
  },
];

export const GENTLEMENS_CLUB_PILLS = ["BROTOX", "HORMONES", "PEPTIDE THERAPY", "RECOVERY"] as const;

export const GENTLEMENS_CLUB_FAQS = [
  {
    question: "What is The Gentlemen's Club?",
    answer:
      "The Gentlemen's Club is Hello Gorgeous Med Spa's exclusive men's wellness membership. It gives members access to member-only pricing on Brotox, hormone optimization, peptide therapy, and monthly wellness shots — all in a private, judgment-free environment.",
  },
  {
    question: "What's included in the membership?",
    answer:
      "Membership includes monthly wellness shots (B12, Lipo-C, or NAD+), member pricing on all neurotoxin (Brotox) treatments, priority booking, and discounted add-on services. The Distinguished Gentleman tier adds monthly hormone check-ins, peptide protocol support, and access to exclusive member events.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No contracts. Both tiers are month-to-month and can be cancelled anytime. We want you here because it's working for you — not because you're locked in.",
  },
  {
    question: "Who are the providers?",
    answer:
      "All services are delivered or supervised by licensed Nurse Practitioners with specialized training in men's aesthetics, hormone optimization, and regenerative medicine. You'll see the same providers at every visit.",
  },
  {
    question: "What is Brotox?",
    answer:
      "Brotox is the popular term for Botox (or any FDA-approved neurotoxin) administered specifically for men. Men typically require more units due to stronger facial muscles, and the goal is a sharp, natural result — not frozen or softened. It's one of the highest-satisfaction treatments men receive.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a complimentary consult using the link on this page or call us at (630) 636-6193. We'll walk you through the membership options, answer your questions, and get you started the same day if you're ready.",
  },
] as const;

export const GENTLEMENS_CLUB_BENEFITS = [
  {
    icon: "💉",
    title: "Brotox",
    description: "Member pricing on every neurotoxin treatment. Look sharp, no big deal.",
  },
  {
    icon: "🧬",
    title: "Hormone Optimization",
    description: "Lab-guided TRT and hormone care. Energy, strength, libido, mood.",
  },
  {
    icon: "⚡",
    title: "Peptide Therapy",
    description: "Recovery, performance, body composition. The cutting edge.",
  },
  {
    icon: "💪",
    title: "Monthly Wellness Shot",
    description: "B12, Lipo-C, or NAD+ every month. Your call.",
  },
] as const;

export const GENTLEMENS_CLUB_PILLARS = [
  {
    title: "Private & judgment-free environment",
    description:
      "Men's wellness shouldn't feel awkward. Our space is designed for comfort and discretion.",
  },
  {
    title: "Licensed NP providers",
    description:
      "All care is delivered by licensed Nurse Practitioners — medical expertise, not just aesthetics.",
  },
  {
    title: "Science-backed protocols",
    description: "Lab work, evidence-based treatments, ongoing monitoring. No guesswork, no fads.",
  },
] as const;

export const FOR_HIM_SERVICES = [
  {
    id: "brotox",
    icon: "💉",
    label: "Brotox",
    blurb: "Botox for men. Soften lines, look rested, own the room. 15-minute treatment.",
    badge: "POPULAR",
    href: "/brotox",
    cta: "Book Brotox",
  },
  {
    id: "hormones",
    icon: "🧬",
    label: "Hormone Optimization",
    blurb: "Energy. Strength. Libido. Mood. Recovery. Lab-guided TRT & hormone care.",
    badge: "RX",
    href: "/mens-hormones",
    cta: "Book Consult",
  },
  {
    id: "peptides",
    icon: "⚡",
    label: "Peptide Therapy",
    blurb: "BPC-157, Sermorelin, NAD+, AOD-9604 & more. Recovery, performance, longevity.",
    badge: "NEW",
    href: "/peptide-therapy-men",
    cta: "Learn More",
  },
  {
    id: "giftcard",
    icon: "🎁",
    label: "Gift Brotox",
    blurb: "Perfect for dads, husbands & boyfriends. Delivered instantly via Square.",
    badge: "GIFT",
    href: squareGiftCardUrl({ utmMedium: "gentlemens_club", utmCampaign: "gift_brotox" }),
    cta: "Buy Gift Card",
    external: true,
  },
] as const;

export function appForHimUrl(options?: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): string {
  const url = new URL("/app", SITE.url);
  url.searchParams.set("tab", "forhim");
  url.searchParams.set("utm_source", options?.utmSource ?? "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "gentlemens_club");
  url.searchParams.set("utm_campaign", options?.utmCampaign ?? "for_him_tab");
  return url.toString();
}
