/**
 * Fall into Facials — Aug/Sept 2026 blast.
 * Same offer everywhere: Facebook, Google, website, Square Marketing.
 * Uses live menu prices (Glow $129, Trifecta $199). No new coupon unless desk adds one.
 */

export const FALL_FACIALS_CAMPAIGN = {
  name: "HG Fall into Facials — Aug 2026",
  seasonLabel: "Fall into Facials",
  imagePath: "/images/marketing/fall-into-facials-2026.jpg" as const,
  bookPath:
    "/services/facials-and-peels?ref=fall_facials_2026&utm_source=square&utm_medium=email&utm_campaign=fall_into_facials_2026",
  socialPath:
    "/services/facials-and-peels?utm_source=social&utm_medium=page_post&utm_campaign=fall_into_facials_2026",
  gbpPath:
    "/services/facials-and-peels?utm_source=google&utm_medium=gbp_post&utm_campaign=fall_into_facials_2026",
  squareAudience: "HG All Opt-In",
  squareObjective: "Send a newsletter / promote a service",
  sendWhen: "Wednesday 11:00 AM America/Chicago",
  brandPink: "#E6007E",
  phoneDisplay: "(630) 636-6193",
} as const;

export const FALL_FACIALS_SQUARE = {
  campaignName: FALL_FACIALS_CAMPAIGN.name,
  subject: "Fall into Facials, {{first_name}} 🍂 your glow reset is ready",
  subjectAlt: "{{first_name}}, summer skin is tired. Fall facials are in.",
  previewText: "HydraFacial Glow $129 · Trifecta $199 · book in Oswego this week",
  header: "FALL INTO FACIALS",
  buttonLabel: "Book your fall facial",
  buttonUrl: `https://www.hellogorgeousmedspa.com${FALL_FACIALS_CAMPAIGN.bookPath}`,
  body: `Hi {{first_name}},

Summer was a lot — sun, AC, late nights, leftover SPF. Fall is when skin looks dull, dry, and a little congested if we don't give it a real reset.

This is the month to Fall into Facials at Hello Gorgeous.

What to book:
• HydraFacial Glow Special — $129
  Cleanse, extract, hydrate, dermaplane, O₂, plus 2 add-ons. Same-day glow, no downtime.
• The Trifecta — $199
  HydraFacial + dermaplaning + O₂ infusion + microneedling in one visit.
• Signature facials from $89
  Calm Restore, Clarity, Gorgeous Glow, Collagen Reset — matched to your skin, not a menu script.

Ryan Kent, FNP-BC is on site. We customize the protocol — we don't guess.

Book online: https://www.hellogorgeousmedspa.com/services/facials-and-peels?ref=fall_facials_2026
Or call (630) 636-6193 · 74 W Washington St, Oswego

xo,
Danielle & the Hello Gorgeous team`,
  sms: `Hello Gorgeous: Fall into Facials. HydraFacial Glow $129 · Trifecta $199. Book: hellogorgeousmedspa.com/facials-oswego Reply STOP to opt out.`,
} as const;

export const FALL_FACIALS_FACEBOOK = `🍂 FALL INTO FACIALS — Hello Gorgeous Med Spa, Oswego

Summer skin is tired. Fall is when we reset it.

This week's glow menu:
• HydraFacial Glow Special — $129 (dermaplane + O₂ + 2 add-ons)
• The Trifecta — $199 (HydraFacial + dermaplane + O₂ + microneedling)
• Signature facials from $89

Medical-grade. No downtime on the Glow. NP on site.

Serving Naperville, Aurora, Plainfield & the Fox Valley.

Book your fall facial 👇`;

export const FALL_FACIALS_GBP = `🍂 Fall into Facials — Hello Gorgeous Med Spa, Oswego IL

Reset summer-tired skin with a medical-grade facial:

• HydraFacial Glow Special $129
• The Trifecta $199
• Signature facials from $89

Same-day glow · downtown Oswego · Ryan Kent, FNP-BC on site

Book online — tap Learn more`;

export const FALL_FACIALS_WEBSITE_BLURB = {
  eyebrow: "FALL INTO FACIALS",
  headline: "Summer skin is tired. Fall is your reset.",
  body: "HydraFacial Glow Special $129 · The Trifecta $199 · signature protocols from $89. Book in Oswego this week.",
  cta: "Book a fall facial ›",
} as const;
