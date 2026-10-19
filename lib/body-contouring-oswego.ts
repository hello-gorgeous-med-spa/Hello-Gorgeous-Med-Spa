/**
 * Body contouring Oswego hub — HG-SEO-014.
 * Canonical route: /body-contouring-oswego-il
 * Do not describe Quantum RF as non-invasive. Do not guarantee fat reduction.
 */

import { goldenTicketPackage } from "@/lib/campaigns/golden-ticket-2026";
import {
  SQUARE_MORPHEUS8_3X_BOOKING_URL,
  SQUARE_QUANTUM_ABDOMEN_BOOKING_URL,
  SQUARE_QUANTUM_NECK_BOOKING_URL,
} from "@/lib/flows";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { QUANTUM_RF_MARKETING, QUANTUM_RF_PATH } from "@/lib/quantum-rf-marketing";
import { SITE } from "@/lib/seo";

export const BODY_CONTOURING_PATH = "/body-contouring-oswego-il" as const;

export const BODY_CONTOURING_SEO = {
  title: "Body Contouring Oswego IL | Quantum RF & Morpheus8",
  description:
    "Body contouring in Oswego, IL with Quantum RF by Dr. Mukesh Arora, MD and Morpheus8 Body Burst. Abdomen, arms, and other treatment areas after consultation. Serving Naperville, Aurora, Plainfield, Yorkville, and Montgomery.",
  keywords: [
    "body contouring Oswego IL",
    "body contouring Oswego",
    "Quantum RF Oswego",
    "Morpheus8 Body Burst Oswego",
    "skin tightening abdomen Oswego",
    "body contouring Naperville",
    "body contouring Aurora IL",
    "Morpheus8 Body Plainfield",
    "Quantum RF Yorkville",
    "body contouring Montgomery IL",
  ],
} as const;

export const BODY_CONTOURING_HEADLINE = "Advanced Body Contouring in Oswego, Illinois";

export const BODY_GOLDEN_TICKET = goldenTicketPackage("body");

export const BODY_CONTOURING_BOOKING = {
  consultHref: `${PRIMARY_BOOKING_CTA.href}?utm_source=website&utm_medium=body_contouring&utm_campaign=hg_seo_014`,
  consultLabel: PRIMARY_BOOKING_CTA.label,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  quantumAbdomen: SQUARE_QUANTUM_ABDOMEN_BOOKING_URL,
  quantumNeck: SQUARE_QUANTUM_NECK_BOOKING_URL,
  morpheus8x3: SQUARE_MORPHEUS8_3X_BOOKING_URL,
  goldenTicketHref: "/golden-ticket",
} as const;

export const BODY_CONTOURING_TECH = [
  {
    name: "Quantum RF with Dr. Mukesh Arora, MD",
    tag: "Minimally invasive subdermal RF",
    depth: "Beneath the skin through small access points, under local anesthesia",
    best: "Abdomen, arms, neck/jawline, and other areas where a clinician maps more significant laxity after an in-person exam.",
    how: "A small probe delivers controlled radiofrequency energy under the skin. It is not a surface spa device and it is not described as non-invasive. Candidacy, area selection, and expected change are set at consultation — fat reduction is not guaranteed.",
    href: QUANTUM_RF_PATH,
    physician: MEDICAL_DIRECTOR.displayName,
  },
  {
    name: "Morpheus8 Body Burst",
    tag: "Deep RF microneedling",
    depth: "Up to 8mm, with Burst delivering multiple depths in one pass",
    best: "Skin texture, crepey skin, mild-to-moderate laxity, and tightening over larger surface areas such as the abdomen, arms, and thighs.",
    how: "Ultrafine micro-pins deliver radiofrequency energy at multiple depths to remodel collagen. Topical numbing is typical. Social downtime is usually a few days, longer on body areas.",
    href: "/services/morpheus8",
    physician: null,
  },
] as const;

export const BODY_CONTOURING_AREAS = [
  "Abdomen",
  "Arms",
  "Flanks",
  "Thighs",
  "Knees",
  "Neck and jawline, when clinically appropriate",
] as const;

export const BODY_CONTOURING_CITIES = [
  "Oswego",
  "Naperville",
  "Aurora",
  "Plainfield",
  "Yorkville",
  "Montgomery",
] as const;

export const BODY_CONTOURING_EXPECTATIONS = [
  {
    title: "What it can help",
    body: "RF body treatments are used to support skin tightening and contour refinement in selected areas. Many patients notice progressive firming over weeks to months as collagen remodels. Your plan is based on tissue quality, medical history, and goals — not a preset package.",
  },
  {
    title: "What it is not",
    body: "Quantum RF is not a non-invasive spa treatment and it is not a substitute for surgical body lift or liposuction for every patient. We do not guarantee fat reduction, a clothing size, or a surgical-looking result. Cellulite is multifactorial; texture may improve, but dimpling does not always resolve.",
  },
  {
    title: "Recovery",
    body: "Morpheus8 Body Burst typically involves several days of redness and swelling; body areas often need about 5–7 days of social downtime. Quantum RF typically involves 3–7 days of swelling, with a compression garment often recommended for body areas. Exact recovery depends on the area treated and is reviewed before you book.",
  },
] as const;

export const BODY_CONTOURING_PHOTOS = [
  {
    src: QUANTUM_RF_MARKETING.images.drAroraTreating1,
    alt: "Dr. Mukesh Arora, MD performing Quantum RF at Hello Gorgeous Med Spa in Oswego, Illinois",
    caption: "Quantum RF with Dr. Mukesh Arora, MD — Medical Director and treating physician.",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicAbdomenBaBranded1,
    alt: "Hello Gorgeous patient abdomen photography after body contouring consultation and treatment in Oswego",
    caption: "Abdomen photography used with documented marketing consent. Individual results vary.",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicAbdomenBaSideBranded,
    alt: "Side-view abdomen photography from a Hello Gorgeous Med Spa body contouring patient",
    caption: "Side view, documented marketing consent on file. Not a typical result and not a guarantee.",
  },
] as const;

export const BODY_CONTOURING_FAQS = [
  {
    question: "What is body contouring at Hello Gorgeous in Oswego?",
    answer:
      "Body contouring here means consultation-based radiofrequency treatment planning with Quantum RF, performed by Dr. Mukesh Arora, MD, and Morpheus8 Body Burst. We assess abdomen, arms, and other appropriate areas in person. Treatment is not one-size-fits-all, and results vary.",
  },
  {
    question: "Is Quantum RF non-invasive?",
    answer:
      "No. Quantum RF is a minimally invasive procedure: a small probe is used under the skin with local anesthesia. Tiny access points are not the same as a large surgical incision, but it is not a surface-only, non-invasive treatment.",
  },
  {
    question: "Will body contouring reduce fat?",
    answer:
      "Some patients see a change in contour after Quantum RF, but fat reduction is not guaranteed. Skin tightening and collagen remodeling are the more consistent treatment goals. If another approach would serve you better, we say so at consult.",
  },
  {
    question: "Who performs Quantum RF and Morpheus8 Body Burst?",
    answer: `Quantum RF is performed by ${MEDICAL_DIRECTOR.displayName}, Medical Director. Morpheus8 Body Burst is delivered by trained clinical staff under physician-directed protocols. Danielle Alcala-Glazier owns the practice. Prescription items in packages, including Golden Ticket Body, require a separate clinical review.`,
  },
  {
    question: "Do you treat patients from Naperville, Aurora, Plainfield, Yorkville, and Montgomery?",
    answer:
      "Yes. The clinic is at 74 W. Washington Street in downtown Oswego, convenient to Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley. There are no separate city landing pages for this service — this is the canonical body-contouring page.",
  },
  {
    question: "How do I book?",
    answer:
      "Start with a free consultation. From there you can book Quantum RF abdomen or neck packages, Morpheus8 Burst series, or request the VIP Golden Ticket Body Collection. Medication-containing packages are request-only until clinical and payment-policy eligibility is verified — they are not available as instant checkout.",
  },
] as const;
