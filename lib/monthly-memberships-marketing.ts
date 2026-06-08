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
      "We offer five monthly plans: The Glow Pass ($49/mo) for Vitamin Bar shots, Energy Unlimited ($89/mo) for four mix-and-match shots, VIP Wellness ($149/mo) for weekly shots plus premium add-ons, Glow Facial Membership ($99/mo) for a monthly HydraFacial with Dermaplaning and Biotin shot, and Lash Fill Membership ($150/mo) for two lash fills and two Biotin shots each month. All plans include member perks like priority booking and discounted add-ons.",
  },
  {
    question: "How do I join a Hello Gorgeous membership?",
    answer:
      "Open the Hello Gorgeous client app at hellogorgeousmedspa.com/app, tap the Membership tab, and choose your plan — checkout is secure through Square. You can also visit our monthly memberships page for full details or call 630-636-6193 and our team will help you enroll in person.",
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

export function membershipsItemListJsonLd(pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hello Gorgeous Med Spa Monthly Memberships",
    description:
      "Monthly wellness, facial, and lash membership plans at Hello Gorgeous Med Spa in Oswego, IL.",
    url: pageUrl,
    numberOfItems: VITAMIN_MEMBERSHIPS.length,
    itemListElement: VITAMIN_MEMBERSHIPS.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: m.name,
        description: m.summary,
        image: m.image ? `${SITE.url}${m.image}` : undefined,
        brand: { "@type": "Brand", name: SITE.name },
        offers: {
          "@type": "Offer",
          price: String(m.pricePerMonth),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pageUrl,
          seller: { "@type": "MedicalBusiness", name: SITE.name, telephone: SITE.phone },
        },
      },
    })),
  };
}

/** Google Business Profile post — all five plans, link to SEO page. */
export const MEMBERSHIPS_SHOWCASE_GBP_MESSAGE = `⭐ Monthly memberships at Hello Gorgeous Med Spa — Oswego, IL

Vitamin Bar · facials · lashes — one simple monthly price.

💉 The Glow Pass — $49/mo · 2 shots + member pricing
⚡ Energy Unlimited — $89/mo · 4 shots, mix & match (most popular)
👑 VIP Wellness — $149/mo · weekly shot + Glutathione or NAD+
✨ Glow Facial — $99/mo · HydraFacial + Dermaplaning + Biotin
💕 Lash Fill — $150/mo · 2 fills + 2 Biotin shots

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

Join in the Hello Gorgeous app (Membership tab) or tap the link for full details + flyers 👇

Ryan Kent, FNP-BC on site 7 days a week · Naperville · Aurora · Plainfield`;
