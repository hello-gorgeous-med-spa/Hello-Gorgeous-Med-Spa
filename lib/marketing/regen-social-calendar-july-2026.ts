/**
 * RE GEN-only social calendar — July 2026 distribution blitz.
 *
 *   npx tsx scripts/publish-regen-social-calendar.ts --week=1
 *   npx tsx scripts/publish-regen-social-calendar.ts --slug=regen-launch-full
 *   npx tsx scripts/publish-regen-social-calendar.ts --all --dry-run
 */

export type RegenSocialPost = {
  slug: string;
  week: number;
  dayLabel: string;
  label: string;
  channels: Array<"google" | "facebook" | "instagram">;
  message: string;
  link: string;
  imagePath: string;
};

const SITE = "https://www.hellogorgeousmedspa.com";
const RX = `${SITE}/rx`;

export const REGEN_SOCIAL_CALENDAR_JULY_2026: RegenSocialPost[] = [
  {
    slug: "regen-launch-full",
    week: 1,
    dayLabel: "Mon W1",
    label: "RE GEN launch — full catalog",
    channels: ["google", "facebook", "instagram"],
    message: `Introducing RE GEN — prescription weight loss, peptides & hormones, delivered across Illinois. 💊

Real clinic in Oswego. Real NP. Not a sketchy online pharmacy.

→ GLP-1 from $125/mo
→ Peptides $175–$200/mo
→ TRT & HRT — provider-guided
→ Shipped from US pharmacies

Start your intake 👇

Ryan Kent, FNP-BC · Hello Gorgeous Med Spa

#ReGen #HelloGorgeous #MedicalWeightLoss #Peptides #TRT #Illinois #Telehealth`,
    link: RX,
    imagePath: "/promo-kit/regen-social-provider.jpg",
  },
  {
    slug: "regen-glp1-learn",
    week: 1,
    dayLabel: "Wed W1",
    label: "RE GEN Learn — What is GLP-1?",
    channels: ["google", "facebook", "instagram"],
    message: `What is GLP-1? 📚

Our RE GEN Learn guide explains how GLP-1 medications work, who may benefit, side effects, and how Hello Gorgeous delivers NP-supervised programs across Illinois.

Education first — then your intake.

Read the guide 👇`,
    link: `${SITE}/rx/learn/what-is-glp-1`,
    imagePath: "/images/shop-rx/tirzepatide-glp1.png",
  },
  {
    slug: "regen-weight-loss-cta",
    week: 1,
    dayLabel: "Fri W1",
    label: "RE GEN GLP-1 programs — start intake",
    channels: ["google", "facebook", "instagram"],
    message: `Medical weight loss that fits your life 💪

RE GEN GLP-1 — compounded semaglutide & tirzepatide with transparent pricing from $125/mo.

✓ 5-minute online intake
✓ NP review by Ryan Kent, FNP-BC
✓ Shipped across Illinois
✓ Flat $30 shipping

Start today 👇`,
    link: `${RX}/weight-loss`,
    imagePath: "/brochure/assets/glp-weight-loss.png",
  },
  {
    slug: "regen-peptides-learn",
    week: 2,
    dayLabel: "Mon W2",
    label: "RE GEN Learn — What are peptides?",
    channels: ["google", "facebook", "instagram"],
    message: `Peptides are everywhere online — but what are they actually? 🧬

RE GEN Learn breaks down peptide therapy in plain language: how it works, common uses, and NP oversight before anything ships.

Start informed 👇`,
    link: `${SITE}/rx/learn/what-are-peptides`,
    imagePath: "/images/rx-care/peptide-molecule-hero.png",
  },
  {
    slug: "regen-hormones-learn",
    week: 2,
    dayLabel: "Wed W2",
    label: "RE GEN Learn — Hormone therapy / TRT",
    channels: ["google", "facebook"],
    message: `TRT & HRT — what's the difference? 🩺

RE GEN Learn explains hormone therapy for men and women: labs, monitoring, and how our Oswego NP team supervises programs shipped across Illinois.

Read before you start 👇`,
    link: `${SITE}/rx/learn/what-is-hormone-therapy`,
    imagePath: "/images/regen/banner-h1.jpg",
  },
  {
    slug: "regen-peptides-hub",
    week: 2,
    dayLabel: "Fri W2",
    label: "RE GEN Peptide programs",
    channels: ["google", "facebook", "instagram"],
    message: `Recovery. Energy. Optimization. 💉

RE GEN peptide protocols — BPC-157, sermorelin, NAD+, and more — with NP review and transparent monthly pricing.

Illinois telehealth · US compounding pharmacies · Flat $30 shipping

Browse peptides 👇`,
    link: `${RX}/peptides`,
    imagePath: "/images/shop-rx/new-peptide-protocol.png",
  },
  {
    slug: "regen-trust-clinic",
    week: 3,
    dayLabel: "Mon W3",
    label: "RE GEN trust — real clinic",
    channels: ["google", "facebook", "instagram"],
    message: `Your health deserves more than a faceless website. 🩺

RE GEN is Hello Gorgeous Med Spa — a real clinic at 74 W. Washington, Oswego with providers you can call.

✓ Ryan Kent, FNP-BC on site
✓ US-licensed pharmacies
✓ Transparent pricing
✓ (630) 636-6193

Gorgeous, delivered 👇`,
    link: RX,
    imagePath: "/images/regen/regen-brand-banner.jpg",
  },
  {
    slug: "regen-how-it-works",
    week: 3,
    dayLabel: "Wed W3",
    label: "How RE GEN works — full journey",
    channels: ["google", "facebook"],
    message: `From browse to doorstep — how RE GEN works 📦

1️⃣ Pick your treatment
2️⃣ Complete intake online
3️⃣ NP review & approval
4️⃣ Shipped to your door in Illinois

No membership fee. One clear path.

Learn the full journey 👇`,
    link: `${SITE}/rx/learn/how-regen-works`,
    imagePath: "/images/regen/regen-flyer-services.jpg",
  },
  {
    slug: "regen-hormones-hub",
    week: 3,
    dayLabel: "Fri W3",
    label: "RE GEN Hormones & TRT",
    channels: ["google", "facebook", "instagram"],
    message: `Low energy? Brain fog? Hormones may be worth a conversation. ⚡

RE GEN offers TRT, women's bioidentical HRT, clomiphene & HCG — lab-guided and NP-supervised.

Real clinic. Real follow-up. Illinois shipping.

Explore hormones 👇`,
    link: `${RX}/hormones`,
    imagePath: "/images/shop-rx/hrt/testosterone-trt.png",
  },
  {
    slug: "regen-spa-qr-start",
    week: 4,
    dayLabel: "Mon W4",
    label: "In-spa QR — scan to start RE GEN",
    channels: ["google", "facebook"],
    message: `At Hello Gorgeous Med Spa? Scan & start RE GEN on your phone 📱

Weight loss · peptides · hormones — NP-directed care shipped across Illinois.

Same team you trust in Oswego — now at your doorstep.

Scan or tap 👇`,
    link: `${RX}/start?utm_source=spa`,
    imagePath: "/images/regen/regen-provider-hero.jpg",
  },
  {
    slug: "regen-learn-hub",
    week: 4,
    dayLabel: "Wed W4",
    label: "RE GEN Learn — patient education hub",
    channels: ["google", "facebook", "instagram"],
    message: `Questions before you start GLP-1, peptides, or hormones? 📖

RE GEN Learn — provider-reviewed guides on weight loss, peptides, hormone therapy, and how our programs work.

No hype. Just clear answers from Hello Gorgeous Med Spa.

Browse guides 👇`,
    link: `${SITE}/rx/learn`,
    imagePath: "/images/regen/regen-og-image.jpg",
  },
  {
    slug: "regen-weight-loss-naperville",
    week: 4,
    dayLabel: "Fri W4",
    label: "RE GEN weight loss — Fox Valley",
    channels: ["google", "facebook"],
    message: `Fox Valley — medical weight loss shipped to your door 🏠

RE GEN GLP-1 programs for Naperville, Aurora, Oswego & beyond — NP-supervised, transparent pricing from $125/mo.

15 min from Naperville to our Oswego clinic if you ever want in-person care too.

Start intake 👇`,
    link: `${SITE}/regen-weight-loss-naperville-il`,
    imagePath: "/brochure/assets/glp-weight-loss.png",
  },
];

export function getRegenSocialPosts(filter?: {
  week?: number;
  slug?: string;
}): RegenSocialPost[] {
  let posts = REGEN_SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  return posts;
}

export function listRegenSocialSlugs(): string[] {
  return REGEN_SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
