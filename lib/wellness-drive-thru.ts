import { squareAppointmentServiceUrl, SQUARE_WELLNESS_DRIVE_THRU_VARIATION_ID } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export const WELLNESS_DRIVE_THRU_PATH = "/20-minute-wellness" as const;

/** Square Appointments — $20 / 15 min. Does not change the $25 vitamin bar. */
export const WELLNESS_DRIVE_THRU_BOOK_HREF = squareAppointmentServiceUrl(
  SQUARE_WELLNESS_DRIVE_THRU_VARIATION_ID,
);

export const WELLNESS_DRIVE_THRU_SEO = {
  title: "20-Minute Wellness Shot | $20 | Oswego IL",
  description:
    "Skip the drive-thru. A $20 IM wellness shot at Hello Gorgeous Med Spa in Oswego — B12, Lipo, glutathione, Tri-Immune, biotin, or vitamin D3. Book a 15-minute visit on Square. A licensed RN gives the shot. Not self-administered. Results vary.",
  ogAlt: "20-minute wellness shot menu at Hello Gorgeous Med Spa in Oswego",
} as const;

export const WELLNESS_DRIVE_THRU_FAQ = [
  {
    question: "How do I book a 20-minute wellness shot?",
    answer:
      "Pick a shot on this page, then tap Book. That opens Square Appointments for the $20 20-Minute Wellness Shot, a 15-minute visit. Tell us which shot you want when you arrive. Walk-ins are welcome when a nurse is free. A booking is what holds the vial.",
  },
  {
    question: "Who gives the shot?",
    answer:
      "A healthcare professional gives the intramuscular injection in the clinic at 74 W. Washington Street, Oswego. These shots are not self-administered.",
  },
  {
    question: "What does the $20 include?",
    answer:
      "One shot from the lunch menu: B12 Energy, Lipo Skinny, Glow glutathione, Tri-Immune, Biotin Beauty, or Vitamin D3. The regular Vitamin Injection Bar is a separate $25 visit.",
  },
  {
    question: "Will a wellness shot make me lose weight or glow for days?",
    answer:
      "No. A wellness shot is not a weight-loss treatment and not a guarantee of energy, skin, hair, or how you will feel. People respond differently. Screening happens at check-in.",
  },
] as const;

export type WellnessShot = {
  id: string;
  code: string;
  name: string;
  aka: string;
  tagline: string;
  dose: string;
  does: string;
  bestFor: string;
  oral: string;
  emoji: string;
};

export const WELLNESS_SHOTS: WellnessShot[] = [
  {
    id: "b12",
    code: "01",
    name: "B12 ENERGY",
    aka: "vs. coffee",
    tagline: "The 3pm Slump Killer",
    dose: "Methylcobalamin 5mg",
    does: "Pure cellular energy in 10 minutes.",
    bestFor: "Desk burnout, brain fog, Monday",
    oral: "Coffee = jitters + crash. This = clean ATP.",
    emoji: "⚡",
  },
  {
    id: "micc",
    code: "02",
    name: "LIPO SKINNY",
    aka: "vs. diet",
    tagline: "Metabolism + Fat Burn",
    dose: "MICC + B12",
    does: "Methionine Inositol Choline burns stored fat.",
    bestFor: "Bloat, cravings, weight-loss plateau",
    oral: "Diet pills = 20% absorbed. IM = 90% to blood.",
    emoji: "🔥",
  },
  {
    id: "glow",
    code: "03",
    name: "GLOW",
    aka: "vs. filter",
    tagline: "Detox + Bright Skin",
    dose: "Glutathione 600mg",
    does: "Master antioxidant. Clears dullness from inside.",
    bestFor: "Dull skin, breakouts, post-weekend detox",
    oral: "Cream sits on skin. This bleaches toxins out.",
    emoji: "✨",
  },
  {
    id: "immune",
    code: "04",
    name: "IMMUNITY",
    aka: "vs. sick days",
    tagline: "Tri-Immune: C + Glut + Zinc",
    dose: "Vitamin C + Glut + Zinc",
    does: "Your sick-day insurance policy.",
    bestFor: "Travel, kids bringing germs home, flu season",
    oral: "Orange juice = sugar. This = direct immune armor.",
    emoji: "🛡️",
  },
  {
    id: "biotin",
    code: "05",
    name: "BIOTIN BEAUTY",
    aka: "vs. extensions",
    tagline: "Hair • Skin • Nails",
    dose: "Biotin + B-Complex",
    does: "Grows what your gummies promised.",
    bestFor: "Thinning, breakage, brittle nails",
    oral: "Gummies = candy. Shot = follicle fuel.",
    emoji: "💅",
  },
  {
    id: "d3",
    code: "06",
    name: "D3 SUNSHINE",
    aka: "vs. energy drink",
    tagline: "The Sunshine Shot",
    dose: "Vitamin D3 50k IU",
    does: "Midwest winter antidote. Mood + energy lift.",
    bestFor: "Tired, moody, never sees sun (hello, IL)",
    oral: "Energy drink = 27g sugar. This = actual sun.",
    emoji: "☀️",
  },
];

export const WELLNESS_DRIVE_THRU_PHONE = `tel:+1${SITE.phone.replace(/\D/g, "")}`;
export const WELLNESS_DRIVE_THRU_PHONE_DISPLAY = "(630) 636-6193";
