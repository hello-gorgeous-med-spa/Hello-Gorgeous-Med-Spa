export type ProcedureType =
  | "Injection"
  | "Laser"
  | "RF"
  | "Topical"
  | "IV"
  | "Wellness"
  | "Surgical adjunct";

export type InModeBadge = "morpheus8" | "solaria" | "quantum";

export type ServicePageFaq = { q: string; a: string };

export type ServicePageData = {
  slug: string;
  serviceName: string;
  fullServiceName: string;
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  valueProp: string;
  /** Extended hero copy below the value prop (Phase 1+ pages) */
  heroContent?: string;
  /** Transparent pricing blurb before FAQs */
  pricing?: string;
  /** Custom closing CTA line above book button */
  closingCta?: string;
  /** Fresha booking URL (generic org or per-service deep link when IDs are set) */
  bookingUrl: string;
  freshaServiceId?: string;
  procedureType: ProcedureType;
  bodyLocation?: string;
  whyBullets: string[];
  howItWorksParagraphs: string[];
  whatToExpectSteps: string[];
  faqs: ServicePageFaq[];
  relatedServices: string[];
  inModeBadge?: InModeBadge;
  /** uncontested = 600+ words; contested = 1000+ */
  tier: "uncontested" | "contested";
  /** Full-width promo flyer (social/print creative) shown on the page */
  promoFlyerImage?: string;
  promoFlyerAlt?: string;
  /** In-clinic treatment / device photos for trust and Google Images */
  clinicalPhotos?: {
    src: string;
    alt: string;
    frame?: "portrait" | "landscape";
    objectPosition?: string;
  }[];
  /** Procedure or FAQ videos for the dark menu landing */
  clinicalVideos?: {
    src: string;
    title: string;
    description?: string;
    poster?: string;
    label?: string;
    aspect?: "video" | "portrait";
  }[];
};
