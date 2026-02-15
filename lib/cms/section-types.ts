// Section type definitions
export interface CMSSection {
  id: string;
  type: string;
  content: Record<string, unknown>;
  visible: boolean;
}

export interface ServiceItem {
  image?: string;
  icon?: string;
  name: string;
  description?: string;
  price?: string;
  url?: string;
}

export interface TestimonialItem {
  rating?: number;
  text: string;
  name: string;
  location?: string;
  service?: string;
}

export interface ProviderItem {
  image?: string;
  name: string;
  credentials?: string;
  bio?: string;
  url?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GalleryImage {
  url: string;
  alt?: string;
}

export const SECTION_TYPE_INFO = {
  hero: { name: 'Hero', icon: '🎯', color: 'purple' },
  services_grid: { name: 'Services Grid', icon: '🏥', color: 'blue' },
  pricing: { name: 'Pricing Cards', icon: '💰', color: 'green' },
  providers: { name: 'Provider Bios', icon: '👩‍⚕️', color: 'pink' },
  testimonials: { name: 'Testimonials', icon: '⭐', color: 'yellow' },
  faq: { name: 'FAQ', icon: '❓', color: 'orange' },
  promo_banner: { name: 'Promo Banner', icon: '🎉', color: 'red' },
  booking: { name: 'Booking Widget', icon: '📅', color: 'indigo' },
  text: { name: 'Text Block', icon: '📝', color: 'gray' },
  image: { name: 'Image', icon: '🖼️', color: 'cyan' },
  video: { name: 'Video', icon: '🎬', color: 'rose' },
  gallery: { name: 'Gallery', icon: '📸', color: 'teal' },
  contact: { name: 'Contact Section', icon: '📞', color: 'emerald' },
  cta: { name: 'CTA Block', icon: '🔗', color: 'violet' },
  divider: { name: 'Divider', icon: '➖', color: 'slate' },
} as const;

export type SectionType = keyof typeof SECTION_TYPE_INFO;
