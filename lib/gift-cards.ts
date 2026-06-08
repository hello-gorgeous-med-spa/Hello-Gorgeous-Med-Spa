/**
 * Hello Gorgeous eGift cards — Square checkout + on-site design showcase.
 * Owner: add designs under public/images/gift-cards/ and append to GIFT_CARD_DESIGNS.
 */

export const SQUARE_EGIFT_ORDER_URL =
  "https://app.squareup.com/gift/T47CHJDW8177K/order";

export function squareGiftCardUrl(options?: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): string {
  const url = new URL(SQUARE_EGIFT_ORDER_URL);
  url.searchParams.set("utm_source", options?.utmSource ?? "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "gift_cards");
  url.searchParams.set("utm_campaign", options?.utmCampaign ?? "egift_purchase");
  return url.toString();
}

export type GiftCardDesign = {
  id: string;
  name: string;
  tagline: string;
  image: `/${string}`;
};

/** Curated Square eGift art — shown in the website slideshow. */
export const GIFT_CARD_DESIGNS: GiftCardDesign[] = [
  {
    id: "classic-spa-glamour",
    name: "Classic Spa Glamour",
    tagline: "Timeless Hello Gorgeous pink & black",
    image: "/images/gift-cards/classic-spa-glamour.png",
  },
  {
    id: "gift-of-confidence",
    name: "Gift of Confidence",
    tagline: "Soft rose & baby's breath — our formal certificate look",
    image: "/images/gift-cards/gift-of-confidence.png",
  },
  {
    id: "pink-lip-gloss",
    name: "Pink Lip Gloss",
    tagline: "Black & white glam with a pop of pink",
    image: "/images/gift-cards/pink-lip-gloss.png",
  },
  {
    id: "better-late-than-ugly",
    name: "Better Late Than Ugly",
    tagline: "Bold, sassy & unapologetically gorgeous",
    image: "/images/gift-cards/better-late-than-ugly.png",
  },
  {
    id: "too-glam-to-give-a-damn",
    name: "Too Glam to Give a Damn",
    tagline: "Champagne energy & crown-worthy vibes",
    image: "/images/gift-cards/too-glam-to-give-a-damn.png",
  },
  {
    id: "too-busy-doing-me",
    name: "Too Busy Doing Me",
    tagline: "Self-care season — no apologies",
    image: "/images/gift-cards/too-busy-doing-me.png",
  },
  {
    id: "my-secret-weapon-my-lips",
    name: "My Secret Weapon… My Lips",
    tagline: "Rhinestone lips & injectable glam",
    image: "/images/gift-cards/my-secret-weapon-my-lips.png",
  },
  {
    id: "girl-do-you",
    name: "Girl, Do You",
    tagline: "Sparkle, attitude & Hello Gorgeous pink",
    image: "/images/gift-cards/girl-do-you.png",
  },
  {
    id: "i-love-me",
    name: "I Love Me",
    tagline: "Glitter script self-love classic",
    image: "/images/gift-cards/i-love-me.png",
  },
  {
    id: "i-love-me-sparkle",
    name: "I Love Me ✨",
    tagline: "Extra sparkle edition",
    image: "/images/gift-cards/i-love-me-sparkle.png",
  },
  {
    id: "boss-bitch",
    name: "Boss Bitch",
    tagline: "Stripes, lips & main-character energy",
    image: "/images/gift-cards/boss-bitch.png",
  },
  {
    id: "boss-bitch-stripes",
    name: "Boss Bitch Stripes",
    tagline: "Pink stripe power move",
    image: "/images/gift-cards/boss-bitch-stripes.png",
  },
  {
    id: "im-extra-best-ones-are",
    name: "I'm Extra (Best Ones Always Are)",
    tagline: "For the friend who goes all in",
    image: "/images/gift-cards/im-extra-best-ones-are.png",
  },
];

export const GIFT_CARD_PRESET_AMOUNTS = [25, 50, 100, 150, 200, 250] as const;
