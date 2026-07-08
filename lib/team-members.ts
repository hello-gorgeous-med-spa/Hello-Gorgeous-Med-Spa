/**
 * Public-facing team roster — Meet the Team page & nav.
 */

import {
  ABOUT_DANI_IMAGE,
  DANI_FULL_NAME,
  RYAN_FULL_NAME,
  RYAN_IMAGE,
  TEAM_FOUNDERS_IMAGE,
} from "@/lib/founder-credentials";
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
  image: { src: string; alt: string };
  /** New hire — show welcome callout */
  isNewHire?: boolean;
  profileHref?: string;
};

export const MEET_THE_TEAM_SEO_DESCRIPTION =
  "Meet the Hello Gorgeous Med Spa team in Oswego, IL — Michelle Colby (client care & front desk), Marissa Murray (licensed esthetician & lash artist), plus founders Danielle Alcala-Glazier and Ryan Kent, FNP-BC.";

export const NEW_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "michelle-colby",
    slug: "michelle-colby",
    fullName: "Michelle Colby",
    badge: "RE GEN Specialist",
    title: "Client Care Specialist & Front Desk Manager",
    isNewHire: true,
    image: {
      src: "/images/team/michelle-colby.jpg",
      alt: "Michelle Colby, Client Care Specialist and Front Desk Manager at Hello Gorgeous Med Spa in Oswego, IL",
    },
    bioParagraphs: [
      "Michelle is passionate about helping people look and feel their very best from the inside out. She believes that confidence starts with feeling healthy, and she loves educating patients about peptide therapy, hormone optimization, and wellness treatments that support long-term health and vitality.",
      "Known for her friendly personality and genuine compassion, Michelle enjoys building meaningful relationships with her patients and creating a welcoming, comfortable experience for everyone who walks through the door. She is committed to continuing her education in regenerative medicine and staying current on the latest advancements so she can provide knowledgeable, personalized care.",
      "When she's not at the med spa, you'll likely find Michelle working out at the gym, tending to her flower gardens, trying new recipes in the kitchen, or spending quality time with her family. She believes that living a healthy lifestyle should be enjoyable, balanced, and inspiring — and she loves helping others achieve the same.",
    ],
    specialties: [
      "Peptide therapy",
      "Hormone optimization",
      "Wellness & longevity",
      "Client care",
    ],
  },
  {
    id: "marissa-murray",
    slug: "marissa-murray",
    fullName: "Marissa Murray",
    badge: "Licensed Esthetician",
    title: "Certified Lash Artist",
    isNewHire: true,
    image: {
      src: "/images/team/marissa-murray.jpg",
      alt: "Marissa Murray, Licensed Esthetician and Certified Lash Artist at Hello Gorgeous Med Spa in Oswego, IL",
    },
    bioParagraphs: [
      "Marissa is a licensed esthetician with over 8 years of experience and a true passion for helping clients feel confident, comfortable, and cared for. Her favorite part of esthetics is listening closely to each client's needs, understanding their goals, and creating a personalized experience that feels genuine, thoughtful, and results-driven.",
      "What sets Marissa apart is her heart for exceptional customer service. She believes every client deserves to feel heard, never rushed, and never pressured. Her approach is centered around education, trust, and customized treatment plans rather than heavy selling.",
      "After meeting with Danielle, the owner of Hello Gorgeous Med Spa, Marissa knew immediately that this was the perfect place for her. She felt aligned with the culture, the standards, and the freedom to customize protocols based on what each client truly needs — Hello Gorgeous lets her practice esthetics in a way that feels authentic: caring, honest, and personalized.",
      "She is extremely excited to join the Hello Gorgeous family and cannot wait to build lasting relationships with clients while helping them look and feel their absolute best.",
    ],
    specialties: [
      "Facials & skincare",
      "Lash extensions",
      "Lash lifts & tints",
      "Brow services",
    ],
  },
];

export const LEADERSHIP_TEAM: TeamMember[] = [
  {
    id: "danielle",
    slug: "danielle",
    fullName: DANI_FULL_NAME,
    badge: "Owner & Founder",
    title: "Licensed Esthetician",
    profileHref: "/about#dani",
    image: {
      src: ABOUT_DANI_IMAGE,
      alt: `${DANI_FULL_NAME}, founder of Hello Gorgeous Med Spa in Oswego, IL`,
    },
    bioParagraphs: [
      "Danielle built Hello Gorgeous from the ground up — family-owned, hands-on every day, and invested in technology most local practices don't offer.",
    ],
    specialties: ["Morpheus8 · Quantum RF · Solaria", "Brows & skin", "InMode Trifecta"],
  },
  {
    id: "ryan",
    slug: "ryan",
    fullName: RYAN_FULL_NAME,
    badge: "Medical Director",
    title: "Board-Certified Family Nurse Practitioner",
    profileHref: "/about#ryan",
    image: {
      src: RYAN_IMAGE,
      alt: `${RYAN_FULL_NAME}, Medical Director at Hello Gorgeous Med Spa`,
    },
    bioParagraphs: [
      "Ryan holds full prescriptive authority in Illinois and is on site seven days a week — GLP-1, hormones, peptides, injectables, and advanced device oversight.",
    ],
    specialties: ["GLP-1 weight loss", "Hormone therapy", "Peptides", "Medical aesthetics"],
  },
];

export const TEAM_FOUNDERS_GROUP_IMAGE = TEAM_FOUNDERS_IMAGE;

export function meetTheTeamJsonLd() {
  const all = [...NEW_TEAM_MEMBERS, ...LEADERSHIP_TEAM];
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
