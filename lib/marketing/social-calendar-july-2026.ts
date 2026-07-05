/**
 * 4-week FlowWave + RE GEN social/GBP calendar — July 2026 launch window.
 * Publish via: node scripts/publish-social-calendar.mjs --week=1
 */

export type SocialCalendarPost = {
  slug: string;
  week: number;
  dayLabel: string;
  label: string;
  brand: "flowwave" | "regen";
  channels: Array<"google" | "facebook" | "instagram">;
  message: string;
  link: string;
  imagePath: string;
};

const SITE = "https://www.hellogorgeousmedspa.com";

export const SOCIAL_CALENDAR_JULY_2026: SocialCalendarPost[] = [
  // Week 1 — FlowWave launch + RE GEN education
  {
    slug: "fw-intro-launch",
    week: 1,
    dayLabel: "Mon W1",
    label: "FlowWave launch — shockwave therapy now at Hello Gorgeous",
    brand: "flowwave",
    channels: ["google", "facebook", "instagram"],
    message: `NEW at Hello Gorgeous — FlowWave FOCUS shockwave therapy 💫

Focused acoustic waves for deep-tissue pain, sports recovery & men's wellness — non-invasive, drug-free, 3–10 minute sessions.

✓ NP-directed every session
✓ Knees · shoulders · back · hips & more
✓ Intro special: $175 first session (any area)

Book your free screening 👇

#FlowWave #ShockwaveTherapy #PainRelief #SportsRecovery #OswegoIL #HelloGorgeous #MedSpa`,
    link: `${SITE}/services/flowwave`,
    imagePath: "/images/flowwave/flowwave-recovery-banner.png",
  },
  {
    slug: "regen-glp1-learn",
    week: 1,
    dayLabel: "Thu W1",
    label: "RE GEN Learn — What is GLP-1?",
    brand: "regen",
    channels: ["google", "facebook"],
    message: `What is GLP-1 — and how does it support weight management? 📚

Our new RE GEN Learn guide breaks down how GLP-1 medications work, who may benefit, side effects to watch for, and how Hello Gorgeous delivers NP-supervised programs across Illinois.

No hype. Just clear, provider-reviewed education.

Read the guide 👇

Ryan Kent, FNP-BC · Hello Gorgeous Med Spa · Oswego, IL

#ReGen #GLP1 #WeightLoss #MedicalWeightLoss #Illinois #PatientEducation`,
    link: `${SITE}/rx/learn/what-is-glp-1`,
    imagePath: "/images/shop-rx/tirzepatide-glp1.png",
  },
  // Week 2 — FlowWave pain/recovery + RE GEN peptides
  {
    slug: "fw-pain-recovery",
    week: 2,
    dayLabel: "Mon W2",
    label: "FlowWave — deep pain relief without downtime",
    brand: "flowwave",
    channels: ["google", "facebook", "instagram"],
    message: `Still icing the same knee every night? 🦵

FlowWave FOCUS reaches up to 12 cm deep — targeting muscle, tendon & joint tissue that surface treatments miss.

→ 3–10 min sessions
→ Zero downtime
→ NP screening included
→ Oswego · Naperville · Aurora area

First session $175 any area 👇

#ShockwaveTherapy #KneePain #ShoulderPain #Recovery #FlowWave #FoxValley`,
    link: `${SITE}/shockwave-therapy-oswego-il`,
    imagePath: "/images/flowwave/flowwave-zones-banner.png",
  },
  {
    slug: "regen-peptides-learn",
    week: 2,
    dayLabel: "Thu W2",
    label: "RE GEN Learn — What are peptides?",
    brand: "regen",
    channels: ["google", "facebook", "instagram"],
    message: `Peptides are everywhere on social media — but what are they actually? 🧬

RE GEN Learn explains peptide therapy in plain language: how signaling peptides work, common wellness uses, safety considerations, and how our NP-supervised protocols ship across Illinois.

Start informed before you start your intake 👇

#Peptides #PeptideTherapy #ReGen #Recovery #Longevity #Illinois #HelloGorgeous`,
    link: `${SITE}/rx/learn/what-are-peptides`,
    imagePath: "/images/rx-care/peptide-molecule-hero.png",
  },
  // Week 3 — FlowWave men's wellness + RE GEN trust
  {
    slug: "fw-mens-wellness",
    week: 3,
    dayLabel: "Mon W3",
    label: "FlowWave men's wellness — discreet NP-directed care",
    brand: "flowwave",
    channels: ["google", "facebook"],
    message: `Men's wellness at Hello Gorgeous — private, provider-directed, zero judgment. 🔒

FlowWave FOCUS shockwave for men's wellness is handled with full discretion by our nurse practitioners in Oswego.

Discreet consults · Confidential care · Real medical oversight

Learn more 👇

#MensHealth #MensWellness #FlowWave #Shockwave #OswegoIL #HelloGorgeous`,
    link: `${SITE}/services/flowwave`,
    imagePath: "/images/flowwave/flowwave-mens-banner.png",
  },
  {
    slug: "regen-trust-local",
    week: 3,
    dayLabel: "Thu W3",
    label: "RE GEN trust — real clinic, real providers",
    brand: "regen",
    channels: ["google", "facebook", "instagram"],
    message: `RE GEN isn't a faceless online pharmacy — it's the prescription arm of Hello Gorgeous Med Spa in Oswego, IL. 🩺

✓ Ryan Kent, FNP-BC on site
✓ US-licensed compounding pharmacies
✓ Transparent pricing — no hidden fees
✓ Call us: (630) 636-6193

Weight loss · peptides · hormones — gorgeous, delivered.

Start your intake 👇`,
    link: `${SITE}/rx`,
    imagePath: "/images/regen/regen-brand-banner.jpg",
  },
  // Week 4 — FlowWave brochure/PDF + RE GEN weight loss CTA
  {
    slug: "fw-brochure-pdf",
    week: 4,
    dayLabel: "Mon W4",
    label: "FlowWave brochure — download & explore",
    brand: "flowwave",
    channels: ["google", "facebook", "instagram"],
    message: `Everything you need to know about FlowWave FOCUS — in one place. 📄

Download our shockwave therapy brochure or explore the interactive version on our site.

Focused waves · 12 cm depth · NP-directed · Intro $175

Oswego, IL · Serving the Fox Valley 👇

#FlowWave #ShockwaveTherapy #PainRelief #MedSpa #Oswego #HelloGorgeous`,
    link: `${SITE}/services/flowwave/brochure`,
    imagePath: "/images/flowwave/flowwave-device-banner.png",
  },
  {
    slug: "regen-weight-loss-cta",
    week: 4,
    dayLabel: "Thu W4",
    label: "RE GEN GLP-1 programs — start your intake",
    brand: "regen",
    channels: ["google", "facebook", "instagram"],
    message: `Ready to stop guessing and start a provider-guided weight loss plan? 💪

RE GEN GLP-1 programs — compounded semaglutide & tirzepatide with transparent pricing from $125/mo.

✓ 5-minute online intake
✓ NP review by Ryan Kent, FNP-BC
✓ Shipped across Illinois
✓ Flat $30 shipping

Start today 👇

#GLP1 #Semaglutide #Tirzepatide #WeightLoss #ReGen #Illinois #Telehealth`,
    link: `${SITE}/rx/weight-loss`,
    imagePath: "/brochure/assets/glp-weight-loss.png",
  },
];

export function getSocialCalendarPosts(filter?: {
  week?: number;
  slug?: string;
  brand?: "flowwave" | "regen";
}): SocialCalendarPost[] {
  let posts = SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  if (filter?.brand) posts = posts.filter((p) => p.brand === filter.brand);
  return posts;
}

export function listSocialCalendarSlugs(): string[] {
  return SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
