import {
  GENTLEMENS_CLUB_HERO_IMAGE,
  GENTLEMENS_CLUB_TIERS,
  GENTLEMENS_CLUB_URL,
} from "@/lib/gentlemens-club";
import { VITAMIN_MEMBERSHIPS } from "@/lib/vitamin-bar";
import { SITE } from "@/lib/seo";

export const MONTHLY_MEMBERSHIPS_PATH = "/monthly-memberships" as const;
export const MONTHLY_MEMBERSHIPS_URL = `${SITE.url}${MONTHLY_MEMBERSHIPS_PATH}`;

export const MONTHLY_MEMBERSHIPS_OG_IMAGE = "/images/memberships/energy-unlimited.png";

export type MembershipFaq = { question: string; answer: string };

export const MONTHLY_MEMBERSHIPS_FAQS: MembershipFaq[] = [
  {
    question: "What monthly memberships does Hello Gorgeous Med Spa offer in Oswego, IL?",
    answer:
      "We offer Vitamin Bar plans (Glow Pass $49/mo, Energy Unlimited $89/mo, VIP Wellness $149/mo), aesthetic memberships (Glow Facial $99/mo, Lash Fill $150/mo), and The Gentlemen's Club for men (The Gentleman $99/mo, The Distinguished Gentleman $149/mo) with Brotox, hormone optimization, peptide therapy, and monthly wellness shots. All plans include member perks like priority booking and discounted add-ons.",
  },
  {
    question: "How do I join a Hello Gorgeous membership?",
    answer:
      "Vitamin Bar, facial, and lash plans: open the Hello Gorgeous client app at hellogorgeousmedspa.com/app, tap the Membership tab, and checkout through Square. The Gentlemen's Club: book a complimentary consult at hellogorgeousmedspa.com/gentlemens-club or call 630-636-6193 — we'll walk you through The Gentleman ($99/mo) or The Distinguished Gentleman ($149/mo).",
  },
  {
    question: "Can I cancel my med spa membership?",
    answer:
      "Yes. Memberships bill monthly through Square and you can manage or cancel your subscription from your Square receipt or by contacting our front desk. We recommend using your included benefits each month — some plans roll over unused credits (see each plan for details).",
  },
  {
    question: "What is the difference between Vitamin Bar memberships and facial or lash memberships?",
    answer:
      "Vitamin Bar plans (Glow Pass, Energy Unlimited, VIP Wellness) focus on drive-thru wellness shots, member pricing on add-ons, and skip-the-line priority. Facial and lash memberships bundle aesthetic services — a monthly HydraFacial plus Biotin, or two lash extension fills plus Biotin — with their own rollover rules and booking priority.",
  },
  {
    question: "Do Hello Gorgeous membership credits roll over?",
    answer:
      "It depends on the plan. The Glow Pass rolls over one unused standard shot. Glow Facial Membership credits roll over toward service upgrades. Lash Fill fills must be used within the month; Biotin shots roll over up to two. Energy Unlimited and VIP Wellness are designed to use your monthly allotment — check each plan on our memberships page for full terms.",
  },
];

export function appMembershipUrl(options?: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): string {
  const url = new URL("/app", SITE.url);
  url.searchParams.set("tab", "membership");
  url.searchParams.set("utm_source", options?.utmSource ?? "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "monthly_memberships");
  url.searchParams.set("utm_campaign", options?.utmCampaign ?? "join");
  return url.toString();
}

function membershipProductJsonLd(
  name: string,
  description: string,
  pricePerMonth: number,
  url: string,
  image?: string,
) {
  return {
    "@type": "Product",
    name,
    description,
    ...(image ? { image } : {}),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: String(pricePerMonth),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      seller: { "@type": "MedicalBusiness", name: SITE.name, telephone: SITE.phone },
    },
  };
}

export function membershipsItemListJsonLd(pageUrl: string) {
  const vitaminItems = VITAMIN_MEMBERSHIPS.map((m) =>
    membershipProductJsonLd(
      m.name,
      m.summary,
      m.pricePerMonth,
      pageUrl,
      m.image ? `${SITE.url}${m.image}` : undefined,
    ),
  );
  const gentlemenItems = GENTLEMENS_CLUB_TIERS.map((t) =>
    membershipProductJsonLd(
      t.name,
      t.summary,
      t.pricePerMonth,
      GENTLEMENS_CLUB_URL,
      `${SITE.url}${GENTLEMENS_CLUB_HERO_IMAGE}`,
    ),
  );
  const allItems = [...vitaminItems, ...gentlemenItems];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hello Gorgeous Med Spa Monthly Memberships",
    description:
      "Monthly wellness, facial, lash, and men's membership plans at Hello Gorgeous Med Spa in Oswego, IL.",
    url: pageUrl,
    numberOfItems: allItems.length,
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item,
    })),
  };
}

/** Google Business Profile post — all plans incl. Gentlemen's Club. */
export const MEMBERSHIPS_SHOWCASE_GBP_MESSAGE = `⭐ Monthly memberships at Hello Gorgeous Med Spa — Oswego, IL

Vitamin Bar · facials · lashes · men's wellness — one simple monthly price.

💉 The Glow Pass — $49/mo · 2 shots + member pricing
⚡ Energy Unlimited — $89/mo · 4 shots, mix & match (most popular)
👑 VIP Wellness — $149/mo · weekly shot + Glutathione or NAD+
✨ Glow Facial — $99/mo · HydraFacial + Dermaplaning + Biotin
💕 Lash Fill — $150/mo · 2 fills + 2 Biotin shots
👔 The Gentlemen's Club — from $99/mo · Brotox, hormones, peptides & recovery

Join in the Hello Gorgeous app or see every perk on our site.
Ryan Kent, FNP-BC · serving Naperville, Aurora & Plainfield.`;

/** Facebook Page post — same showcase, warmer tone. */
export const MEMBERSHIPS_SHOWCASE_FACEBOOK_MESSAGE = `⭐ YOUR monthly glow — now on membership at Hello Gorgeous Med Spa, Oswego IL

Stop paying full price every visit. Pick the plan that matches your routine:

💉 The Glow Pass — $49/mo
2 Vitamin Bar shots + member pricing on everything

⚡ Energy Unlimited — $89/mo ⭐ MOST POPULAR
4 shots/mo, mix & match · 10% off IV therapy

👑 VIP Wellness — $149/mo
Weekly shot + monthly Glutathione OR NAD+ · VIP drive-thru lane

✨ Glow Facial Membership — $99/mo
HydraFacial + Dermaplaning + Biotin every month · credits roll over

💕 Lash Fill Membership — $150/mo
2 lash fills + 2 Biotin shots · priority booking

👔 THE GENTLEMEN'S CLUB — from $99/mo
Brotox · hormones · peptide therapy · monthly wellness shot · no contracts
The Gentleman $99 · The Distinguished Gentleman $149

Join in the Hello Gorgeous app (Membership tab) or tap the link for full details + flyers 👇

Ryan Kent, FNP-BC on site 7 days a week · Naperville · Aurora · Plainfield`;
