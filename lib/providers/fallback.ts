import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from "@/lib/provider-credentials";

/** Code-controlled provider images. Override DB values so you never need to run migrations for headshot changes. */
export const PROVIDER_HEADSHOT_OVERRIDES: Record<string, string> = {
  danielle: "/images/team/danielle.png",
  ryan: "/images/providers/ryan-kent-clinic.jpg",
};

export function applyProviderImageOverrides<T extends { slug?: string | null; headshot_url?: string | null }>(
  provider: T
): T {
  const override = provider.slug ? PROVIDER_HEADSHOT_OVERRIDES[provider.slug] : undefined;
  if (override) {
    return { ...provider, headshot_url: override };
  }
  return provider;
}

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
    philosophy: "Every plan should feel luxurious, safe, and obsessed with your goals. I believe in honest conversations, natural results, and building long-term relationships with every client who walks through our doors.",
    headshot_url: "/images/team/danielle.png",
    hero_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-1.png",
    intro_video_url: "/videos/providers/danielle/intro-clip.mp4",
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
    philosophy: "Medical weight loss and hormone therapy built around safety, labs, and data. I take a comprehensive approach to wellness, understanding that true transformation comes from addressing the root cause, not just the symptoms.",
    headshot_url: "/images/providers/ryan-kent-clinic.jpg",
    hero_image_url: "https://hellogorgeousmedspa.com/images/gallery/treatment-2.png",
    intro_video_url: "/videos/mascots/ryan/ryan-intro.mp4",
    booking_url: "/book?provider=ryan",
  },
};

export const PROVIDER_MEDIA_FALLBACK: Record<string, ProviderMediaFallback[]> = {
  danielle: [
    // Videos
    {
      id: "fallback-danielle-vid-1",
      media_type: "video",
      status: "published",
      service_tag: "lip_filler",
      title: "Lip Filler Technique Explained",
      description: "Watch Danielle demonstrate her signature lip enhancement technique for natural, balanced results.",
      video_url: "/videos/providers/danielle/intro-clip.mp4",
      thumbnail_url: "/images/team/danielle.png",
      duration_seconds: 45,
      featured: true,
    },
    {
      id: "fallback-danielle-vid-2",
      media_type: "video",
      status: "published",
      service_tag: "botox",
      title: "Treatment Day Walk-Through",
      description: "What to expect during your visit - from consultation to aftercare instructions.",
      video_url: "/videos/providers/danielle/treatment-demo.mov",
      thumbnail_url: "/images/team/danielle.png",
      duration_seconds: 60,
      featured: false,
    },
    {
      id: "fallback-danielle-vid-3",
      media_type: "video",
      status: "published",
      service_tag: "other",
      title: "Behind the Scenes at Hello Gorgeous",
      description: "Take a peek inside our studio and see how we create a premium, comfortable experience.",
      video_url: "/videos/providers/danielle/behind-scenes.mov",
      thumbnail_url: "/images/team/danielle.png",
      duration_seconds: 90,
      featured: false,
    },
    // Before/After
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
      alt_text: "Before and after lip filler with Danielle Alcala in Oswego IL",
    },
  ],
  ryan: [
    // Videos
    {
      id: "fallback-ryan-vid-1",
      media_type: "video",
      status: "published",
      service_tag: "hormone_therapy",
      title: "Understanding Hormone Optimization",
      description: "Ryan explains how bioidentical hormone therapy works and who can benefit.",
      video_url: "/videos/mascots/ryan/ryan-intro.mp4",
      thumbnail_url: "/images/providers/ryan-kent-clinic.jpg",
      duration_seconds: 120,
      featured: true,
    },
    // Before/After
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
      featured: true,
      consent_confirmed: true,
      watermark_enabled: true,
      alt_text: "Before and after medical weight loss with Ryan Kent in Oswego IL",
    },
  ],
};
