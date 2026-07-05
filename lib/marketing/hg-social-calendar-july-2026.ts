/**
 * Hello Gorgeous Med Spa — core brand social calendar (July 2026).
 * Botox, Morpheus8, Solaria, weight loss, trust, local SEO.
 *
 * Copy guardrail: sell Hello Gorgeous on its own strengths — never name,
 * compare to, or disparage competitors.
 *
 *   npx tsx scripts/publish-hg-social-calendar.ts --week=1
 *   npx tsx scripts/publish-hg-social-calendar.ts --all --dry-run
 */

export type HgSocialPost = {
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
const BOOK = `${SITE}/book`;

export const HG_SOCIAL_CALENDAR_JULY_2026: HgSocialPost[] = [
  {
    slug: "hg-welcome-oswego",
    week: 1,
    dayLabel: "Mon W1",
    label: "Hello Gorgeous — full-service med spa Oswego",
    channels: ["google", "facebook", "instagram"],
    message: `Hello Gorgeous Med Spa — downtown Oswego 💕

Full-service medical aesthetics & wellness under one roof:
→ Botox, fillers & advanced skin resurfacing
→ Morpheus8 Burst · Solaria CO₂ · Quantum RF
→ GLP-1 weight loss · hormones · IV therapy
→ NP on site 7 days a week

Book your free consult 👇

#HelloGorgeous #MedSpa #OswegoIL #FoxValley #MedicalAesthetics`,
    link: `${SITE}/services`,
    imagePath: "/images/hero-banner.png",
  },
  {
    slug: "hg-botox-new-client",
    week: 1,
    dayLabel: "Wed W1",
    label: "Botox new client — $10/unit",
    channels: ["google", "facebook", "instagram"],
    message: `New to Hello Gorgeous? Botox from $10/unit 💉

Natural-looking results with Botox, Dysport & Jeuveau — mapped and dosed by experienced injectors at our Oswego clinic.

✓ Free 15-minute consult for first-timers
✓ Same-week appointments
✓ Forehead · frown lines · crow's feet & more

Book online 👇

#Botox #Dysport #HelloGorgeous #OswegoIL #NaturalResults`,
    link: `${SITE}/services/botox`,
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  {
    slug: "hg-morpheus8-burst",
    week: 1,
    dayLabel: "Fri W1",
    label: "Morpheus8 Burst — face & body RF",
    channels: ["google", "facebook", "instagram"],
    message: `Morpheus8 Burst at Hello Gorgeous ✨

Our deepest RF microneedling technology — face AND body — for skin tightening, texture, scars & post-weight-loss laxity.

✓ Burst technology up to 8mm depth
✓ NP-directed treatment plans
✓ Oswego clinic · Fox Valley

Learn more & book 👇

#Morpheus8 #RFMicroneedling #SkinTightening #HelloGorgeous #OswegoIL`,
    link: `${SITE}/services/morpheus8`,
    imagePath: "/images/homepage-services/morpheus8-burst-verified-provider.png",
  },
  {
    slug: "hg-solaria-co2",
    week: 2,
    dayLabel: "Mon W2",
    label: "Solaria CO₂ laser resurfacing",
    channels: ["google", "facebook", "instagram"],
    message: `Solaria CO₂ fractional laser — dramatic skin renewal 🔆

Targets wrinkles, sun damage, acne scars & uneven texture with precision resurfacing at Hello Gorgeous Med Spa in Oswego.

✓ Gold-standard CO₂ technology
✓ Personalized recovery plan
✓ NP-supervised every visit

Book your consultation 👇

#SolariaCO2 #LaserResurfacing #HelloGorgeous #OswegoIL #SkinRenewal`,
    link: `${SITE}/services/solaria-co2`,
    imagePath: "/images/promo/solaria-co2-promo-flyer.png",
  },
  {
    slug: "hg-dermal-fillers",
    week: 2,
    dayLabel: "Wed W2",
    label: "Dermal fillers — lips, cheeks & contour",
    channels: ["google", "facebook", "instagram"],
    message: `Fillers that look like you — just refreshed 💋

Premium hyaluronic acid fillers for lips, cheeks, jawline & under-eyes — artfully placed at Hello Gorgeous in Oswego.

✓ Juvederm · Restylane · RHA
✓ Free consult to map your goals
✓ Natural movement, beautiful volume

Book your filler consult 👇

#DermalFillers #LipFiller #HelloGorgeous #OswegoIL #MedSpa`,
    link: `${SITE}/services/dermal-fillers`,
    imagePath: "/images/homepage-buyer-paths/injectables.png",
  },
  {
    slug: "hg-weight-loss-glp1",
    week: 2,
    dayLabel: "Fri W2",
    label: "In-clinic GLP-1 weight loss",
    channels: ["google", "facebook", "instagram"],
    message: `Medical weight loss with real follow-up 💪

Physician-supervised GLP-1 programs at Hello Gorgeous Med Spa — semaglutide & tirzepatide with Ryan Kent, FNP-BC in Oswego.

✓ Same-day visits available
✓ Weekly check-ins & dosing adjustments
✓ Address loose skin with our InMode technology too

Start your consult 👇

#GLP1 #MedicalWeightLoss #HelloGorgeous #OswegoIL #WeightLoss`,
    link: `${SITE}/services/weight-loss`,
    imagePath: "/images/homepage-buyer-paths/weight-loss-hormones.png",
  },
  {
    slug: "hg-quantum-rf",
    week: 3,
    dayLabel: "Mon W3",
    label: "Quantum RF subdermal contouring",
    channels: ["google", "facebook", "instagram"],
    message: `Quantum RF — surgical-level tightening without surgery ⚡

Subdermal radiofrequency for face, neck & body contouring at Hello Gorgeous Med Spa in Oswego.

✓ Internal RF for deep tissue contraction
✓ Face · neck · jawline · body
✓ NP-directed care

Explore Quantum RF 👇

#QuantumRF #BodyContouring #HelloGorgeous #OswegoIL #SkinTightening`,
    link: `${SITE}/services/quantum-rf`,
    imagePath: "/images/quantum-rf/og-quantum-rf-social-share.png",
  },
  {
    slug: "hg-medical-trust-np",
    week: 3,
    dayLabel: "Wed W3",
    label: "NP-directed care — Ryan Kent, FNP-BC",
    channels: ["google", "facebook", "instagram"],
    message: `Your med spa should feel like a real clinic 🩺

At Hello Gorgeous Med Spa, Ryan Kent, FNP-BC screens patients, prescribes when appropriate, and is on site in Oswego 7 days a week.

✓ 74 W. Washington, Oswego IL
✓ (630) 636-6193
✓ Medical aesthetics + wellness under one roof

Meet the team & book 👇

#HelloGorgeous #MedSpa #OswegoIL #NPDirected #FoxValley`,
    link: `${SITE}/about`,
    imagePath: "/images/providers/ryan-kent-clinic.jpg",
  },
  {
    slug: "hg-botox-naperville-local",
    week: 3,
    dayLabel: "Fri W3",
    label: "Botox near Naperville — Fox Valley",
    channels: ["google", "facebook", "instagram"],
    message: `Fox Valley — Botox & fillers 15 min from Naperville 🏠

Hello Gorgeous Med Spa in downtown Oswego:
→ Botox, Dysport & Jeuveau
→ Lip filler & facial contouring
→ Morpheus8 Burst · Solaria · Quantum RF
→ Free consult for new clients

Book 👇

#Botox #Naperville #HelloGorgeous #OswegoIL #MedSpa`,
    link: `${SITE}/botox-naperville-il`,
    imagePath: "/images/morpheus8/morpheus8-burst-deep-jowls-jawline-before-after.png",
  },
  {
    slug: "hg-first-time-book",
    week: 4,
    dayLabel: "Mon W4",
    label: "First visit — free consult + vitamin injection",
    channels: ["google", "facebook", "instagram"],
    message: `New here? We'd love to meet you ✨

Book your first consultation at Hello Gorgeous Med Spa and receive a complimentary vitamin injection — B12, Vitamin D, Biotin, or Glutathione.

✓ Free consult · no pressure
✓ Oswego · easy from Naperville, Aurora & Plainfield
✓ Book online in 60 seconds

Reserve your spot 👇

#HelloGorgeous #NewClient #OswegoIL #MedSpa #FreeConsult`,
    link: BOOK,
    imagePath: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
  },
  {
    slug: "hg-faq-education",
    week: 4,
    dayLabel: "Wed W4",
    label: "Patient FAQ — answers before you book",
    channels: ["google", "facebook", "instagram"],
    message: `Questions before your first visit? 📖

Our FAQ covers Botox pricing, filler downtime, Morpheus8 recovery, GLP-1 programs, financing & more — straight answers from Hello Gorgeous Med Spa in Oswego.

Browse FAQs or book a free consult 👇

#HelloGorgeous #MedSpaFAQ #OswegoIL #PatientEducation`,
    link: `${SITE}/faq`,
    imagePath: "/images/education/skin-layers-injection-depth-reference.png",
  },
  {
    slug: "hg-reviews-book",
    week: 4,
    dayLabel: "Fri W4",
    label: "Thank you + book your visit",
    channels: ["google", "facebook", "instagram"],
    message: `Grateful for every client who trusts Hello Gorgeous 💕

Whether you're exploring Botox, Morpheus8, weight loss, or your first med spa visit — our Oswego team is here with NP-directed care and transparent pricing.

Ready when you are 👇

#HelloGorgeous #OswegoIL #MedSpa #FoxValley #BookNow`,
    link: BOOK,
    imagePath: "/images/team/danielle-alcala-glazier-portrait.png",
  },
];

export function getHgSocialPosts(filter?: {
  week?: number;
  slug?: string;
}): HgSocialPost[] {
  let posts = HG_SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  return posts;
}

export function listHgSocialSlugs(): string[] {
  return HG_SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
