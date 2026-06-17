/** Shared types for Defiant-style numbered service menu pages. */

export type ServiceMenuPriceRow = {
  label: string;
  price: string;
  note?: string;
  href?: string;
};

export type ServiceMenuSection = {
  id: string;
  number: string;
  title: string;
  description: string;
  highlights: string[];
  pricing: ServiceMenuPriceRow[];
  learnMoreHref: string;
  badge?: string;
};

export type ServiceMenuFaq = {
  question: string;
  answer: string;
};

export type ServiceMenuHero = {
  eyebrow: string;
  titleBefore?: string;
  titleAccent: string;
  titleAfter?: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type ServiceMenuGallerySlide = {
  src: string;
  alt: string;
  caption?: string;
  /** Portrait frame fits full-body clinic shots; landscape for wider procedure photos. */
  frame?: "portrait" | "landscape";
  objectPosition?: string;
};

export type ServiceMenuVideo = {
  src: string;
  title: string;
  description?: string;
  poster?: string;
};

export type ServiceMenuConfig = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  hero: ServiceMenuHero;
  /** Optional clinical photo carousel shown below the hero. */
  gallery?: ServiceMenuGallerySlide[];
  /** Optional procedure / FAQ videos shown below the gallery. */
  videos?: ServiceMenuVideo[];
  sections: ServiceMenuSection[];
  faqs: ServiceMenuFaq[];
};
