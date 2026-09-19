/**
 * Public-facing team roster — Meet the Team page & nav.
 */

import {
  DANI_FULL_NAME,
  DANI_IMAGE,
  RYAN_FULL_NAME,
  RYAN_IMAGE,
  RYAN_MEDIUM_BIO,
  TEAM_FOUNDERS_IMAGE,
} from "@/lib/founder-credentials";
import {
  KRISTINA_BIO_PARAGRAPHS,
  KRISTINA_FULL_NAME,
  KRISTINA_IMAGE,
  KRISTINA_QUOTE,
} from "@/lib/kristina-huda";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";
import { SITE } from "@/lib/seo";

export type TeamMember = {
  id: string;
  slug: string;
  fullName: string;
  /** Uppercase pill above the name (e.g. RE GEN SPECIALIST) */
  badge: string;
  /** Role line under the name */
  title: string;
  bioParagraphs: readonly string[];
  specialties: readonly string[];
  image: {
    src: string;
    alt: string;
    /** Tailwind object-fit/position override (default object-cover object-top) */
    objectClassName?: string;
  };
  /** Signature quote shown in the editorial profile card */
  quote?: string;
  /** New hire — show welcome callout */
  isNewHire?: boolean;
  profileHref?: string;
  profileLabel?: string;
};

export const MEET_THE_TEAM_SEO_DESCRIPTION =
  "Meet the Hello Gorgeous Med Spa team in Oswego, IL — Danielle Alcala-Glazier, Ryan Kent, FNP-BC (RE GEN RX prescriber), Kristina Huda, BSN, RN (injector), Dr. Mukesh Arora, MD, plus Michelle Colby, Laura Witt, and Jen Vokoun.";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "kristina-huda",
    slug: "kristina-huda",
    fullName: KRISTINA_FULL_NAME,
    badge: "RN Injector",
    title: "Registered Nurse · Aesthetic Injector",
    isNewHire: true,
    image: {
      src: KRISTINA_IMAGE,
      alt: `${KRISTINA_FULL_NAME}, RN injector at Hello Gorgeous Med Spa in Oswego, IL`,
      objectClassName: "object-cover object-[center_28%]",
    },
    quote: KRISTINA_QUOTE,
    bioParagraphs: KRISTINA_BIO_PARAGRAPHS,
    specialties: [
      "Neuromodulators",
      "Dermal fillers",
      "IV hydration",
      "Vitamin infusions",
      "Wellness support",
    ],
  },
  {
    id: "michelle-colby",
    slug: "michelle-colby",
    fullName: "Michelle Colby",
    badge: "Office · Laser · InMode",
    title: "Office Manager · Laser Hair & IPL Tech · Certified InMode Instructor",
    image: {
      src: "/images/team/michelle-colby-2026.jpg",
      alt: "Michelle Colby, Office Manager, Laser Hair Tech and Certified InMode Instructor at Hello Gorgeous Med Spa in Oswego, IL",
    },
    quote:
      "Great results start with the right technology — and a tech who takes the time to do it right.",
    bioParagraphs: [
      "Michelle Colby is Hello Gorgeous Med Spa’s office manager, laser hair and IPL technician, and a certified InMode instructor. She keeps the floor running smoothly and brings a calm, detail-first approach to every appointment — whether you’re booking laser hair removal, an IPL photofacial, or an advanced InMode treatment on Morpheus8, Solaria CO₂, Quantum RF, or Luxora.",
      "As a certified InMode instructor, Michelle trains to manufacturer standards and helps clients understand candidacy, comfort, downtime, and realistic timelines. Her office-manager background means clear communication, strong follow-through, and a treatment plan tailored to your goals — without pressure.",
      "When she’s not in the treatment room or at the front desk, you’ll often find Michelle at the gym, in her flower gardens, trying a new recipe, or spending time with her family. She believes looking and feeling your best should feel supportive, balanced, and achievable.",
    ],
    specialties: [
      "Office management",
      "Laser hair removal",
      "IPL photofacials",
      "InMode instructor (certified)",
      "Morpheus8 Burst",
      "Solaria CO₂",
      "Quantum RF",
      "Luxora",
      "FlowWave / shockwave",
    ],
  },
  {
    id: "laura-witt",
    slug: "laura-witt",
    fullName: "Laura C. Witt",
    badge: "Client Relations",
    title: "Client Relations & Wellness Sales Specialist",
    isNewHire: true,
    image: {
      src: "/images/team/laura-witt-2026.jpg",
      alt: "Laura C. Witt, Client Relations and Wellness Sales Specialist at Hello Gorgeous Med Spa in Oswego, IL",
      objectClassName: "object-cover object-[center_22%]",
    },
    quote:
      "I love creating memorable experiences through genuine connections.",
    bioParagraphs: [
      "Laura C. Witt is a customer-focused professional with more than 25 years of experience in sales, client relations, health and wellness coaching, and mortgage lending. Throughout her career, she has built a reputation for creating meaningful connections, solving problems with empathy, and delivering exceptional service in fast-paced environments.",
      "Known for her positive attitude, professionalism, and strong communication skills, Laura thrives in roles where teamwork and customer care are top priorities. She enjoys meeting people from diverse backgrounds, adapting to new challenges, and creating memorable experiences through genuine connections.",
      "As she transitions into the aesthetics industry, Laura is excited to bring her passion for helping others, attention to detail, and commitment to excellence to a role where she can contribute to both beauty and wellness experiences.",
    ],
    specialties: [
      "Client relations",
      "Health & wellness coaching",
      "Sales & consultations",
      "Customer care",
    ],
  },
  {
    id: "jen-vokoun",
    slug: "jen-vokoun",
    fullName: "Jen Vokoun",
    badge: "Meet Your Artist",
    title: "Permanent Makeup & Brow Artist",
    image: {
      src: "/images/brow-journey/jen-vokoun.jpg",
      alt: "Jen Vokoun, Permanent Makeup and Brow Artist at Hello Gorgeous Med Spa in Oswego, IL",
    },
    quote:
      "I want you to leave loving your brows — and understanding exactly how they'll heal into something even more beautiful.",
    bioParagraphs: [
      "Jen brings an artist's eye and a steady, meticulous hand to every brow at Hello Gorgeous Med Spa. She's known for natural, custom-mapped results that suit your face, your skin, and your lifestyle — never a one-size-fits-all trend.",
      "From your first consultation through your perfecting touch-up, Jen walks you through every step so you feel calm, informed, and cared for — the Hello Gorgeous way.",
    ],
    specialties: [
      "Microblading",
      "Ombré / powder",
      "Combo & nano",
      "Custom brow mapping",
      "Tina Davies pigments",
    ],
    profileHref: "/microblading-brow-pmu-oswego-il",
    profileLabel: "Your Brow Journey with Jen →",
  },
];

/** @deprecated Use TEAM_MEMBERS — kept as alias while pages migrate. */
export const NEW_TEAM_MEMBERS = TEAM_MEMBERS;

export const LEADERSHIP_TEAM: TeamMember[] = [
  {
    id: "danielle",
    slug: "danielle",
    fullName: DANI_FULL_NAME,
    badge: "Owner & Founder",
    title: "Licensed Esthetician",
    profileHref: "/about#dani",
    profileLabel: "Full profile →",
    image: {
      src: DANI_IMAGE,
      alt: `${DANI_FULL_NAME}, founder of Hello Gorgeous Med Spa in Oswego, IL`,
    },
    quote: "Family-owned, hands-on every day — this is my life's work, not a franchise.",
    bioParagraphs: [
      "Danielle built Hello Gorgeous from the ground up — family-owned, hands-on every day, and invested in technology most local practices don't offer.",
    ],
    specialties: ["Morpheus8 · Quantum RF · Solaria", "Brows & skin", "InMode Trifecta"],
  },
  {
    id: "ryan-kent",
    slug: "ryan-kent",
    fullName: RYAN_FULL_NAME,
    badge: "Prescriber · RE GEN RX",
    title: "Nurse Practitioner · FNP-BC",
    profileHref: "/providers/ryan",
    profileLabel: "Full profile →",
    image: {
      src: RYAN_IMAGE,
      alt: `${RYAN_FULL_NAME}, RE GEN RX prescriber at Hello Gorgeous Med Spa in Oswego, IL`,
    },
    quote: "Consult first. I review the chart. Then I write the plan — or I don't.",
    bioParagraphs: [RYAN_MEDIUM_BIO],
    specialties: ["Medical weight loss", "Hormones", "Peptide protocols", "Labs & refills"],
  },
  {
    id: "kristina-leadership",
    slug: "kristina-row",
    fullName: KRISTINA_FULL_NAME,
    badge: "RN Injector",
    title: "Registered Nurse",
    profileHref: "/meet-the-team#kristina-huda",
    profileLabel: "Read Kristina’s bio →",
    image: {
      src: KRISTINA_IMAGE,
      alt: `${KRISTINA_FULL_NAME}, RN injector at Hello Gorgeous Med Spa in Oswego, IL`,
      objectClassName: "object-cover object-[center_28%]",
    },
    bioParagraphs: [
      "Our RN injector for neuromodulators, fillers, IVs, and wellness support. She does not prescribe — Ryan Kent, FNP-BC writes every prescription.",
    ],
    specialties: ["Neuromodulators", "Fillers", "IVs"],
  },
  {
    id: "dr-arora",
    slug: "dr-arora",
    fullName: MEDICAL_DIRECTOR.displayName,
    badge: "Medical Director",
    title: "Internal Medicine",
    profileHref: MEDICAL_DIRECTOR.profilePath,
    profileLabel: "Full profile →",
    image: {
      src: MEDICAL_DIRECTOR.image,
      alt: MEDICAL_DIRECTOR.imageAlt,
    },
    bioParagraphs: [
      "Physician Medical Director for Hello Gorgeous. Thirty-plus years in Internal Medicine. Patient-first oversight — unhurried visits, clear communication, long-term trust.",
    ],
    specialties: ["Physician oversight", "Internal Medicine"],
  },
];

export const TEAM_FOUNDERS_GROUP_IMAGE = TEAM_FOUNDERS_IMAGE;

export function meetTheTeamJsonLd() {
  const all = [...TEAM_MEMBERS, ...LEADERSHIP_TEAM.filter((m) => m.id !== "kristina-leadership")];
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/meet-the-team`,
    url: `${SITE.url}/meet-the-team`,
    name: "Meet the Team | Hello Gorgeous Med Spa",
    description: MEET_THE_TEAM_SEO_DESCRIPTION,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: all.map((m) => ({
      "@type": "Person",
      name: m.fullName,
      jobTitle: m.title,
      image: `${SITE.url}${m.image.src}`,
      worksFor: { "@id": `${SITE.url}/#organization` },
    })),
  };
}
