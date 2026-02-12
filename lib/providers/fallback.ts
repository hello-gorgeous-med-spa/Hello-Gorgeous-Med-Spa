import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from "@/lib/provider-credentials";

export type ProviderFallback = {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  color_hex: string;
  credentials: string;
  tagline: string;
  short_bio: string;
  philosophy: string;
  headshot_url: string;
  hero_image_url: string;
  intro_video_url: string;
  booking_url: string;
};

export type ProviderMediaFallback = {
  id: string;
  media_type: "video" | "before_after";
  status: "published";
  service_tag: "botox" | "lip_filler" | "prp" | "hormone_therapy" | "weight_loss" | "microneedling" | "laser" | "other";
  title: string;
  description: string;
  video_url?: string;
  before_image_url?: string;
  after_image_url?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  width?: number;
  height?: number;
  featured?: boolean;
  consent_confirmed?: boolean;
  watermark_enabled?: boolean;
  alt_text?: string;
};

export const PROVIDER_FALLBACKS: Record<string, ProviderFallback> = {
  danielle: {
    id: "b7e6f872-3628-418a-aefb-aca2101f7cb2",
    slug: "danielle",
    first_name: "Danielle",
    last_name: "Alcala",
    display_name: "Danielle Alcala, RN-S",
    email: "hello.gorgeous@hellogorgeousmedspa.com",
    color_hex: "#ec4899",
    credentials: DANIELLE_CREDENTIALS,
    tagline: "Precision injectables + concierge-level care",
    short_bio: "Founder & aesthetic expert obsessed with personalized, confidence-building outcomes.",
    philosophy: "Every plan should feel luxurious, safe, and obsessed with your goals.",
    headshot_url: "https://hellogorgeousmedspa.com/images/team/danielle.png",
    hero_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-1.png",
    intro_video_url: "https://hellogorgeousmedspa.com/videos/mascots/founder/founder-vision.mp4",
    booking_url: "/book?provider=danielle",
  },
  ryan: {
    id: "47ab9361-4a68-4ab8-a860-c9c9fd64d26c",
    slug: "ryan",
    first_name: "Ryan",
    last_name: "Kent",
    display_name: "Ryan Kent, FNP-BC",
    email: "ryan@hellogorgeousmedspa.com",
    color_hex: "#3b82f6",
    credentials: RYAN_CREDENTIALS,
    tagline: "Full-practice authority NP | metabolic & regenerative care",
    short_bio: "Nurse Practitioner leading hormone optimization, weight loss, and regenerative protocols.",
    philosophy: "Medical weight loss and hormone therapy built around safety, labs, and data.",
    headshot_url: "https://hellogorgeousmedspa.com/images/team/ryan-kent.png",
    hero_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-2.png",
    intro_video_url: "https://hellogorgeousmedspa.com/videos/mascots/ryan/ryan-intro.mp4",
    booking_url: "/book?provider=ryan",
  },
};

export const PROVIDER_MEDIA_FALLBACK: Record<string, ProviderMediaFallback[]> = {
  danielle: [
    {
      id: "fallback-danielle-ba-1",
      media_type: "before_after",
      status: "published",
      service_tag: "lip_filler",
      title: "Balanced lip refresh",
      description: "Subtle volume restoration with softened borders and hydrated finish.",
      before_image_url: "https://hellogorgeousmedspa.com/images/gallery/before-after.png",
      after_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-3.png",
      thumbnail_url: "https://hellogorgeousmedspa.com/images/gallery/before-after.png",
      featured: true,
      consent_confirmed: true,
      watermark_enabled: true,
      alt_text: "Before and after lip filler with Danielle Alcala",
    },
  ],
  ryan: [
    {
      id: "fallback-ryan-ba-1",
      media_type: "before_after",
      status: "published",
      service_tag: "weight_loss",
      title: "Medical weight loss milestone",
      description: "GLP-1 guided weight loss with metabolic oversight and custom labs.",
      before_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-1.png",
      after_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-2.png",
      thumbnail_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-2.png",
      featured: false,
      consent_confirmed: true,
      watermark_enabled: true,
      alt_text: "Before and after medical weight loss with Ryan Kent",
    },
  ],
};
