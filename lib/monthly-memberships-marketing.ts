import { GENTLEMENS_CLUB_HERO_IMAGE } from "@/lib/gentlemens-club";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { SITE } from "@/lib/seo";
import { WELLNESS_MEMBERSHIP_PLANS } from "@/lib/wellness-memberships";

export const MONTHLY_MEMBERSHIPS_PATH = "/monthly-memberships" as const;
export const MONTHLY_MEMBERSHIPS_URL = `${SITE.url}${MONTHLY_MEMBERSHIPS_PATH}`;

export const MONTHLY_MEMBERSHIPS_OG_IMAGE = "/images/memberships/energy-unlimited.png";

export type MembershipFaq = { question: string; answer: string };

export const MONTHLY_MEMBERSHIPS_FAQS: MembershipFaq[] = [
  {
    question: "What monthly wellness memberships does Hello Gorgeous offer in Oswego, IL?",
    answer:
      `Four pillars: Vitamin Bar plans (Glow Pass $49/mo, Energy Unlimited $89/mo, VIP Wellness $149/mo), hormone memberships (The Gentlemen's Club from $99/mo for men, Women's Hormone Member $99/mo), NP-supervised wellness programs (Precision Hormone $199/mo, Metabolic Reset GLP-1 from $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo), and peptide memberships (Peptide Member $79/mo, Peptide Protocol from $149/mo). Aesthetic facial/lash memberships are coming later.`,
  },
  {
    question: "How do I join a Hello Gorgeous membership?",
    answer:
      "Vitamin Bar and Gentlemen's Club: join in the Hello Gorgeous app (Membership tab) or use the Square checkout link on each plan. Peptide, hormone, and wellness programs start with a free consult — book online or call 630-636-6193. Ryan Kent, FNP-BC sets up your protocol and billing at your visit.",
  },
  {
    question: "Are peptide medications included in the membership fee?",
    answer:
      "Peptide membership fees cover consult support, protocol management, and member pricing. Peptide medication and cold-chain shipping are billed separately based on your NP-approved protocol — typical supplies from $149/mo.",
  },
  {
    question: "Can I cancel my med spa membership?",
    answer:
      "Yes. Square-billed plans are month-to-month with no long-term contract. Cancel through your Square receipt or contact our front desk at least 5 days before your next billing date.",
  },
  {
    question: "Do Hello Gorgeous membership credits roll over?",
    answer:
      "Vitamin Bar plans have plan-specific rollover rules — the Glow Pass rolls over one unused standard shot; Energy Unlimited and VIP Wellness are designed to use your monthly allotment each month. Clinical program benefits (labs, prescriptions) are managed at your NP visits.",
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
  const items = WELLNESS_MEMBERSHIP_PLANS.map((m) =>
    membershipProductJsonLd(
      m.name,
      m.summary,
      m.pricePerMonth,
      m.learnMoreHref ? `${SITE.url}${m.learnMoreHref}` : pageUrl,
      m.image ? `${SITE.url}${m.image}` : `${SITE.url}${GENTLEMENS_CLUB_HERO_IMAGE}`,
    ),
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hello Gorgeous Med Spa Wellness Memberships",
    description:
      "Monthly peptide, hormone, wellness, and Vitamin Bar membership plans at Hello Gorgeous Med Spa in Oswego, IL.",
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item,
    })),
  };
}

/** Google Business Profile post — wellness memberships focus. */
export const MEMBERSHIPS_SHOWCASE_GBP_MESSAGE = `⭐ Wellness memberships at Hello Gorgeous Med Spa — Oswego, IL

Peptides · hormones · NP programs · Vitamin Bar — one monthly price.

💉 Glow Pass — $49/mo · 2 Vitamin Bar shots
⚡ Energy Unlimited — $89/mo · 4 shots, mix & match
👑 VIP Wellness — $149/mo · weekly shot + Glutathione or NAD+
👔 Gentlemen's Club — from $99/mo · Brotox, hormones & peptides
🧬 Peptide Member — $79/mo · consult waived + member pricing
📊 Precision Hormone — $199/mo · labs, HRT & IV support
⚡ Metabolic Reset — GLP-1 from $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo

Join in the Hello Gorgeous app or book a free consult.
Ryan Kent, FNP-BC · Naperville · Aurora · Plainfield`;

/** Facebook Page post — wellness memberships focus. */
export const MEMBERSHIPS_SHOWCASE_FACEBOOK_MESSAGE = `⭐ YOUR monthly wellness — now on membership at Hello Gorgeous Med Spa, Oswego IL

Peptides. Hormones. NP-supervised programs. Vitamin Bar drive-thru.

💉 The Glow Pass — $49/mo
⚡ Energy Unlimited — $89/mo ⭐ MOST POPULAR
👑 VIP Wellness — $149/mo
👔 THE GENTLEMEN'S CLUB — from $99/mo
🧬 Peptide Member — $79/mo (meds separate)
📊 Precision Hormone Program — $199/mo
⚡ Metabolic Reset — GLP-1 from $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo (semaglutide from $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo)

Join in the Hello Gorgeous app or book a free consult 👇

Ryan Kent, FNP-BC on site 7 days a week · Naperville · Aurora · Plainfield`;
