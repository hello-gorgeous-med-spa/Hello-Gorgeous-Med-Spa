import { BOOKING_URL, LEGACY_FRESHA_ORG_BOOKING_URL } from "@/lib/flows";
import type { ServicePageData, ServicePageFaq } from "./types";

const NP_BULLETS = [
  "Full-authority nurse practitioner (FNP-BC) on site — not a remote medical director",
  "Free consultations so you know your plan before you commit",
  "Same-day and next-day appointments when our schedule allows",
  "Best of Oswego recognition and 10+ years serving Kendall County",
];

export function bookingUrlFor(freshaServiceId?: string): string {
  if (freshaServiceId) {
    const u = new URL(LEGACY_FRESHA_ORG_BOOKING_URL);
    u.searchParams.set("serviceId", freshaServiceId);
    return u.toString();
  }
  return BOOKING_URL;
}

export function metaTitle(serviceName: string): string {
  return `${serviceName} in Oswego, IL | Hello Gorgeous Med Spa`;
}

export function metaDescription(keyword: string, extra: string): string {
  const base = `${keyword} at Hello Gorgeous Med Spa in Oswego, IL. ${extra}`;
  return base.length <= 160 ? base : `${base.slice(0, 157)}…`;
}

export function standardFaqs(
  serviceName: string,
  keyword: string,
  extras: ServicePageFaq[] = []
): ServicePageFaq[] {
  return [
    {
      q: `Where can I get ${serviceName} in Oswego, IL?`,
      a: `Hello Gorgeous Med Spa is located at 74 W. Washington St., Oswego, IL 60543. We serve ${keyword} clients from Naperville, Aurora, Plainfield, Yorkville, and Kendall County.`,
    },
    {
      q: `How do I book ${serviceName} near me?`,
      a: "Book online through our scheduling page or call (630) 636-6193. We offer free consultations for most services.",
    },
    {
      q: "Do you offer free consultations?",
      a: "Yes. We recommend a consultation for first-time clients so we can review goals, medical history, and build a safe, personalized plan.",
    },
    {
      q: "Who performs treatments at Hello Gorgeous?",
      a: "Licensed nurse practitioners and trained clinical staff under NP-led oversight. Injectable and medical treatments are not performed by unlicensed aestheticians alone.",
    },
    {
      q: `Is ${serviceName} safe?`,
      a: "When performed by qualified medical providers with proper screening, these treatments have strong safety profiles. We review contraindications at every visit.",
    },
    ...extras,
  ];
}

export function educationBlock(
  serviceName: string,
  keyword: string,
  paragraphs: string[]
): string[] {
  const intro = [
    `${serviceName} is one of the most requested treatments at Hello Gorgeous Med Spa in Oswego. Clients searching for "${keyword}" often want a provider who combines medical oversight, honest pricing, and natural-looking results — not a one-size-fits-all menu.`,
    `Our team has served Oswego and the western suburbs for more than a decade. Whether you are new to ${serviceName} or returning for maintenance, we focus on education first: what the treatment does, what it does not do, and what timeline you should expect.`,
  ];
  return [...intro, ...paragraphs];
}

export function expectSteps(serviceName: string): string[] {
  return [
    `Consultation: We discuss your goals, medical history, and whether ${serviceName} is appropriate.`,
    "Treatment planning: You receive clear pricing, expected results, and downtime (if any) before we begin.",
    `Your visit: Treatment is performed by our clinical team with comfort measures and aftercare instructions.`,
    "Follow-up: We schedule any recommended touch-ups or check-ins and remain available by phone for concerns.",
  ];
}

export function definePage(
  partial: Omit<ServicePageData, "metaTitle" | "metaDescription" | "bookingUrl"> & {
    metaDescriptionExtra: string;
    freshaServiceId?: string;
  }
): ServicePageData {
  return {
    ...partial,
    metaTitle: metaTitle(partial.serviceName),
    metaDescription: metaDescription(partial.targetKeyword, partial.metaDescriptionExtra),
    bookingUrl: bookingUrlFor(partial.freshaServiceId),
    whyBullets: partial.whyBullets?.length ? partial.whyBullets : NP_BULLETS,
  };
}
