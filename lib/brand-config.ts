// Hello Gorgeous Med Spa Brand Configuration
// Used across all AI-generated content and videos

export const BRAND_CONFIG = {
  name: "Hello Gorgeous Med Spa",
  tagline: "Where Beauty Meets Science",
  location: {
    address: "74 W Washington St",
    city: "Oswego",
    state: "IL",
    zip: "60543",
  },
  contact: {
    phone: "630-636-6193",
    tollFree: "833-474-3998",
    website: "hellogorgeousmedspa.com",
    email: "hello.gorgeous@hellogorgeousmedspa.com",
  },
  colors: {
    primary: "#E91E8C", // Hot pink
    secondary: "#000000", // Black
    accent: "#FF69B4", // Light pink
    gold: "#D4AF37", // Gold accent
    white: "#FFFFFF",
    gray: "#F5F5F5",
  },
  fonts: {
    headline: "Playfair Display",
    body: "Inter",
    accent: "Sacramento",
  },
  logo: "/images/hello-gorgeous-logo.png",
  socialHandles: {
    instagram: "@hellogorgeousmedspa",
    facebook: "HelloGorgeousMedSpa",
    tiktok: "@hellogorgeousmedspa",
  },
  defaultCTA: {
    primary: "Book Your Consultation",
    secondary: "Call Now",
    urgency: "Limited Spots Available",
  },
  videoDefaults: {
    duration: 30, // seconds
    fps: 30,
    formats: {
      vertical: { width: 1080, height: 1920 },
      square: { width: 1080, height: 1080 },
      horizontal: { width: 1920, height: 1080 },
    },
  },
};

// Campaign Templates with pre-filled content
export const CAMPAIGN_TEMPLATES = [
  {
    id: "weight-loss",
    name: "Weight Loss Promo",
    icon: "💪",
    service: "weightloss",
    defaultPrompt: "Weight loss transformation with Semaglutide/Tirzepatide",
    hooks: [
      "Struggling to lose weight?",
      "Down 20 pounds in 90 days",
      "The injection everyone's talking about",
      "Finally, weight loss that works",
    ],
    benefits: [
      "Lose 15-25 lbs in 12 weeks",
      "FDA-approved medication",
      "Physician supervised",
      "No crash dieting",
    ],
    cta: "Start Your Transformation",
    style: "energetic",
  },
  {
    id: "botox-special",
    name: "Botox Special",
    icon: "💉",
    service: "botox",
    defaultPrompt: "Botox anti-aging special with limited time pricing",
    hooks: [
      "Turn back the clock",
      "Wrinkles? Not anymore",
      "Look 10 years younger",
      "The secret to ageless skin",
    ],
    benefits: [
      "Quick 15-minute treatment",
      "No downtime",
      "Results in 3-5 days",
      "Lasts 3-4 months",
    ],
    cta: "Book Your Botox",
    style: "luxury",
  },
  {
    id: "laser-launch",
    name: "Laser Treatment Launch",
    icon: "✨",
    service: "solaria",
    defaultPrompt: "Solaria CO2 laser skin resurfacing launch",
    hooks: [
      "Resurface your skin",
      "Laser your way to flawless",
      "The gold standard in skin",
      "Transform your texture",
    ],
    benefits: [
      "Stimulates collagen",
      "Reduces fine lines",
      "Improves texture",
      "Minimal downtime",
    ],
    cta: "Experience Solaria",
    style: "luxury",
  },
  {
    id: "filler-promo",
    name: "Filler Promotion",
    icon: "👄",
    service: "fillers",
    defaultPrompt: "Lip filler and facial filler promotion",
    hooks: [
      "Perfect lips await",
      "Volume where you want it",
      "Enhance your natural beauty",
      "The pout you've dreamed of",
    ],
    benefits: [
      "Instant results",
      "Natural-looking volume",
      "Lasts 12-18 months",
      "Customized to you",
    ],
    cta: "Get Your Dream Lips",
    style: "luxury",
  },
  {
    id: "morpheus8-promo",
    name: "Morpheus8 RF",
    icon: "🔥",
    service: "morpheus8",
    defaultPrompt: "Morpheus8 RF microneedling for skin tightening",
    hooks: [
      "Tighten without surgery",
      "The celebrity secret",
      "Lift, tighten, transform",
      "RF that actually works",
    ],
    benefits: [
      "Tightens loose skin",
      "Reduces fat",
      "Stimulates collagen",
      "One treatment, visible results",
    ],
    cta: "Book Morpheus8",
    style: "energetic",
  },
  {
    id: "iv-therapy",
    name: "IV Therapy",
    icon: "💧",
    service: "iv",
    defaultPrompt: "IV vitamin therapy for energy and wellness",
    hooks: [
      "Instant energy boost",
      "Hydrate from within",
      "Feel amazing in 45 minutes",
      "The wellness secret",
    ],
    benefits: [
      "Immediate hydration",
      "Boosted energy",
      "Enhanced immunity",
      "Fast 30-45 min treatment",
    ],
    cta: "Book Your Drip",
    style: "clean",
  },
  {
    id: "prf-hair",
    name: "PRF Hair Restoration",
    icon: "💇",
    service: "prf",
    defaultPrompt: "PRF hair restoration treatment",
    hooks: [
      "Restore your confidence",
      "Hair growth is possible",
      "Your own platelets, real results",
      "Stop hiding, start growing",
    ],
    benefits: [
      "Uses your own platelets",
      "Stimulates hair follicles",
      "No surgery required",
      "Natural-looking results",
    ],
    cta: "Start Hair Restoration",
    style: "clean",
  },
  {
    id: "stretch-marks",
    name: "Stretch Mark Treatment",
    icon: "🌟",
    service: "stretchmarks",
    defaultPrompt: "Stretch mark treatment with Solaria CO2 laser",
    hooks: [
      "Stretch marks? Not anymore",
      "Restore your skin's beauty",
      "This isn't camouflage",
      "Collagen reconstruction",
    ],
    benefits: [
      "40-70% improvement",
      "Penetrates deep dermis",
      "Works where creams fail",
      "Stimulates collagen",
    ],
    cta: "Book Consultation",
    style: "luxury",
  },
];

export type CampaignTemplate = typeof CAMPAIGN_TEMPLATES[number];
