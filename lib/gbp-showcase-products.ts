/**
 * Flagship Google Business Profile showcase lineup.
 * Services API can store name + short description.
 * The knowledge-panel Products photo grid is still added in the GBP Products UI.
 */

export const GBP_SHOWCASE_CATEGORY = "categories/gcid:medical_spa";

export type GbpShowcaseProduct = {
  name: string;
  /** GBP service description — keep ≤250 characters. */
  description: string;
  /** Google Products UI — 1,000 character max. */
  productDescription: string;
  /** Optional starting price in whole USD (consult / per unit / per visit). */
  priceUsd?: number;
  priceNote?: string;
  sitePath: `/${string}`;
  photoPath: `/${string}`;
  productCategoryHint: string;
};

export const GBP_SHOWCASE_PRODUCTS: GbpShowcaseProduct[] = [
  {
    name: "Morpheus8 Burst",
    description:
      "InMode Morpheus8 Burst — RF microneedling for face and neck. Consult required. Results vary. Hello Gorgeous Med Spa, Oswego IL.",
    productDescription:
      "Morpheus8 Burst is the InMode RF microneedling people drive to Oswego for — face, jawline, and neck in one focused visit. Tiny pins + radiofrequency help tighten the look of crepey skin, soften texture, and refresh the lower face without a surgical facelift. We map your areas, numb you properly, and take our time. This is not a rushed spa add-on. You leave with a real plan for how many sessions you may want and how to baby the skin after. Complimentary consult. Medical oversight. Results vary and build as collagen remodels. Book Hello Gorgeous Med Spa — 74 W. Washington St. hellogorgeousmedspa.com/services/morpheus8",
    sitePath: "/services/morpheus8",
    photoPath: "/images/morpheus8/morpheus8-hero.jpg",
    productCategoryHint: "Skin treatment",
  },
  {
    name: "Morpheus8 Body",
    description:
      "Morpheus8 Body Burst — deeper RF for abdomen, arms, and other body areas. Consult required. Results vary. Oswego IL.",
    productDescription:
      "Morpheus8 Body is Burst technology for the places clothes don’t hide — abdomen, arms, knees, bra-line, and other stubborn texture. Deeper RF microneedling is designed to tighten the look of lax skin and smooth crepey areas after weight change or time. We treat you like a medical visit: consult, photos, numbing, and a plan you understand before we start. Packages available when a series is the smarter path. Not a wrap. Not a fad device. InMode, in clinic, in Oswego. Consult required. Results vary. hellogorgeousmedspa.com/services/morpheus8",
    sitePath: "/services/morpheus8",
    photoPath: "/images/home/morpheus8-body-burst-technology-inmode.png",
    productCategoryHint: "Body treatment",
  },
  {
    name: "Solaria CO2",
    description:
      "InMode Solaria fractional CO₂ laser for texture, tone, and resurfacing. Consult required. Results vary. Downtown Oswego.",
    productDescription:
      "Solaria is InMode fractional CO₂ — the laser you book when makeup cannot cover texture, sun damage, or dull tone anymore. We resurface with a medical device, not a facial that washes off. Expect a real consult: what we are treating, downtime, and how we keep you comfortable. Face, neck, and targeted areas. This is for clients who want a serious refresh and will follow aftercare. Fall specials when posted. Consult required. Results vary. Downtown Oswego. hellogorgeousmedspa.com/services/solaria-co2",
    sitePath: "/services/solaria-co2",
    photoPath: "/images/solaria/solaria-hero.jpg",
    productCategoryHint: "Laser treatment",
  },
  {
    name: "Quantum RF Lipo",
    description:
      "InMode Quantum RF for chin, neck, abdomen, and larger areas. Consult required. Results vary. Hello Gorgeous Med Spa.",
    productDescription:
      "Quantum RF Lipo is InMode radiofrequency for chin, neck, abdomen, and larger body areas when you want contour and tightening talk in the same room. Visits run long because we numb, treat, and do not rush you out the door. Flat clinical packages for chin/neck and abdomen-sized areas — ask at booking. Training-backed technique under medical direction. This is not a lunchtime gadget. Consult required. Results vary. Hello Gorgeous, 74 W. Washington St, Oswego. hellogorgeousmedspa.com/services/quantum-rf",
    sitePath: "/services/quantum-rf",
    photoPath: "/images/quantum-rf/quantum-hero.jpg",
    productCategoryHint: "Body treatment",
  },
  {
    name: "Xeomin",
    description:
      "Xeomin neuromodulator for frown lines and forehead. Mapped at consult. New-patient toxin specials when offered. Results vary.",
    productDescription:
      "Xeomin is a clean, “naked” neuromodulator — no extra proteins — for frown lines, forehead, and a rested look that still looks like you. We map your movement first. You will not be a frozen surprise. New patients: $9/unit on any toxin you choose. We sit down, explain how Xeomin compares to Botox, Dysport, and Jeuveau, walk the process, then treat at your pace. Results take days, not minutes. Follow-up when it is time to judge. Consult required. Results vary. hellogorgeousmedspa.com/botox-oswego",
    priceUsd: 9,
    priceNote: "from $9/unit new-patient special; consult required",
    sitePath: "/botox-oswego",
    photoPath: "/images/marketing/hello-gorgeous-storefront-windows-2026.png",
    productCategoryHint: "Neurotoxin",
  },
  {
    name: "Botox",
    description:
      "Botox Cosmetic — frown, forehead, and crow’s feet. Units mapped at consult. New-patient toxin specials when offered. Results vary.",
    productDescription:
      "Botox is the name everyone knows — and we still treat it like a medical visit. Frown, forehead, crow’s feet, lip flip, and preventative “baby tox” when it fits. Units are mapped to YOUR face, not a chart on the wall. New-patient special: $9/unit, any toxin you choose. We outline the difference, explain the process, numb if you want, and stay until you feel clear. Full effect is closer to 7–14 days. Complimentary clinical follow-up for true asymmetry in the published window. Consult required. Results vary. hellogorgeousmedspa.com/botox-oswego",
    priceUsd: 9,
    priceNote: "from $9/unit new-patient special; consult required",
    sitePath: "/botox-oswego",
    photoPath: "/images/marketing/hello-gorgeous-storefront-windows-2026.png",
    productCategoryHint: "Neurotoxin",
  },
  {
    name: "Dysport",
    description:
      "Dysport neuromodulator — often used for larger forehead areas. Units mapped at consult. Results vary. Oswego IL.",
    productDescription:
      "Dysport is the toxin many clients love for a softer, quicker-feeling forehead. Unit counts differ from Botox — we translate that in plain language so you are not comparing apples to oranges. New patients: $9/unit on the toxin you choose. We map movement, explain onset, and treat with a light hand so you look rested, not done. Ask us why Dysport vs Xeomin vs Jeuveau vs Botox for YOUR lines. Consult required. Results vary. Oswego. hellogorgeousmedspa.com/botox-oswego",
    priceUsd: 9,
    priceNote: "from $9/unit new-patient special; consult required",
    sitePath: "/botox-oswego",
    photoPath: "/images/marketing/hello-gorgeous-storefront-windows-2026.png",
    productCategoryHint: "Neurotoxin",
  },
  {
    name: "Jeuveau",
    description:
      "Jeuveau (#NEWTOX) for expression lines. Units mapped at consult. New-patient toxin specials when offered. Results vary.",
    productDescription:
      "Jeuveau (#NEWTOX) is modern neuromodulator for 11s, forehead, and expression lines — same careful mapping, same unhurried chair. New-patient special: $9/unit, any toxin you pick. We will tell you how Jeuveau sits next to Botox, Dysport, and Xeomin and help you choose for your face, not a trend. Process: consult, photos if needed, units, treat, aftercare. You should look like you slept. Consult required. Results vary. Hello Gorgeous Med Spa. hellogorgeousmedspa.com/botox-oswego",
    priceUsd: 9,
    priceNote: "from $9/unit new-patient special; consult required",
    sitePath: "/botox-oswego",
    photoPath: "/images/marketing/hello-gorgeous-storefront-windows-2026.png",
    productCategoryHint: "Neurotoxin",
  },
  {
    name: "Dermal Fillers",
    description:
      "HA and Merz fillers for lips, cheeks, folds, and contour. From $599/syringe. Consult required. Results vary. Oswego IL.",
    productDescription:
      "Dermal fillers at Hello Gorgeous are mapped to your face — lips, cheeks, smile lines, chin, and jawline — with a conservative hand so you look like you, just more rested. We currently place Revanesse (Versa and Lips+) and Merz fillers (Belotero and Radiesse). Half syringe $300. One syringe $599. Two syringes $1,098 (save $100). We pick the product for the area, not what is on a promo poster. Consult required. Results vary. Swelling is normal. hellogorgeousmedspa.com/dermal-fillers-oswego",
    priceUsd: 599,
    priceNote: "per syringe; half $300; two $1,098",
    sitePath: "/dermal-fillers-oswego",
    photoPath: "/images/injectables/hero-lip-injection.png",
    productCategoryHint: "Dermal filler",
  },
  {
    name: "Revanesse Versa",
    description:
      "Revanesse Versa HA filler for folds and facial volume. From $599/syringe. Consult required. Results vary.",
    productDescription:
      "Revanesse Versa is a hyaluronic acid filler we love for folds and facial volume — smooth, balanced, and built for a natural finish. Revanesse uses high-molecular-weight HA and is known for a lower swell factor than many HA fillers, which is why so many clients choose it when they do not want to look “done” for a week. We place it where structure is needed and keep you looking like yourself. $599/syringe. Consult required. Results vary. hellogorgeousmedspa.com/dermal-fillers-oswego",
    priceUsd: 599,
    priceNote: "per syringe",
    sitePath: "/dermal-fillers-oswego",
    photoPath: "/images/injectables/hero-lip-injection.png",
    productCategoryHint: "Dermal filler",
  },
  {
    name: "Revanesse Lips+",
    description:
      "Revanesse Lips+ for lip shape, hydration, and volume. From $599/syringe or $300 half. Consult required.",
    productDescription:
      "Revanesse Lips+ is our go-to for lip shape, hydration, and soft volume — FDA-cleared for lip augmentation in adults 22+. We map your lip line, talk through a half syringe vs a full, and build slowly so you can still drink a latte without announcing it to the room. Half syringe $300. Full syringe $599. Two-syringe packages when it is the right plan. Consult required. Results vary. Swelling settles. hellogorgeousmedspa.com/lip-filler-oswego",
    priceUsd: 599,
    priceNote: "per syringe; half $300",
    sitePath: "/lip-filler-oswego",
    photoPath: "/images/injectables/hero-lip-injection.png",
    productCategoryHint: "Dermal filler",
  },
  {
    name: "Belotero (Merz)",
    description:
      "Merz Belotero HA filler for fine lines and delicate areas. Quoted at consult. Results vary. Oswego IL.",
    productDescription:
      "Belotero is Merz’s silky HA filler — the one we reach for when the line is fine and the skin is thin. Think etched smile lines, lip lines, and delicate blending where a thicker gel would show. Integrates into the tissue for a soft, skin-like finish. We will tell you if Belotero, Revanesse, or Radiesse is the smarter tool for that spot. Consult required. Priced with the rest of our filler menu. Results vary. hellogorgeousmedspa.com/dermal-fillers-oswego",
    priceUsd: 599,
    priceNote: "per syringe; quoted at consult",
    sitePath: "/dermal-fillers-oswego",
    photoPath: "/images/injectables/hero-lip-injection.png",
    productCategoryHint: "Dermal filler",
  },
  {
    name: "Radiesse (Merz)",
    description:
      "Merz Radiesse biostimulator for structure and collagen support. Consult required. Results vary.",
    productDescription:
      "Radiesse is Merz’s calcium-based filler and biostimulator — structure now, collagen support over time. We use it for cheeks, jawline, chin, and hands when you want lift that is not only a soft HA pillow. This is not a lip filler. Your consult decides if Radiesse or an HA (Revanesse / Belotero) belongs in that area. Quoted at consult. Results vary and continue as your own collagen remodels. hellogorgeousmedspa.com/dermal-fillers-oswego",
    sitePath: "/dermal-fillers-oswego",
    photoPath: "/images/injectables/hero-lip-injection.png",
    productCategoryHint: "Dermal filler",
  },
  {
    name: "Peptide Therapy",
    description:
      "Hello Gorgeous RX peptide consults and protocols. Prescription only after clinician review. Consult required. Oswego IL.",
    productDescription:
      "Peptide therapy at Hello Gorgeous is a clinician-reviewed plan — not a mystery vial from the internet. Recovery, skin, wellness, and performance-style protocols after a real consult. We use medical-grade product from trusted compounding partners (including Vio) and then some. You get education, a clear next step, and follow-up. Prescriptions are written only by a licensed Illinois clinician. If a peptide is not right, we say so. Start at the RX request portal. Consult required. Results vary. hellogorgeousmedspa.com/rx/request",
    sitePath: "/rx/request",
    photoPath: "/images/regen/logo-full.png",
    productCategoryHint: "Wellness",
  },
  {
    name: "Vio Compounding GHK-Cu",
    description:
      "Vio Compounding GHK-Cu — medical-grade copper peptide formulated to support repair. Prescription after clinician review. Results vary.",
    productDescription:
      "Vio Compounding GHK-Cu is medical-grade copper peptide for clients who want repair-minded skincare — not another cream that only covers the problem. GHK-Cu is used to support the look of healthier, more resilient skin from the formulation up. We pair it with a consult so you know how it fits your routine and what not to expect overnight. Prescription after clinician review. Compounded specifically for you when approved. Results vary. Ask for Vio GHK-Cu at Hello Gorgeous RX. hellogorgeousmedspa.com/rx/request",
    sitePath: "/rx/request",
    photoPath: "/images/regen/logo-full.png",
    productCategoryHint: "Skincare",
  },
  {
    name: "Medical Weight Loss",
    description:
      "Clinician-directed GLP-1 and weight-loss programs. Consult required. Dosing is individualized. Results vary. Oswego IL.",
    productDescription:
      "Medical weight loss here is a program, not a vial at the front desk. Clinician consult, labs when needed, and GLP-1 options such as tirzepatide or semaglutide only if you qualify. Dose is written for YOU. Follow-up visits matter — we do not release remaining medication as a walk-up pickup. Education, aftercare, and a plan you can live with. Serving Oswego, Naperville, Aurora, and the Fox Valley. Consult required. Results vary. No outcome guarantees. hellogorgeousmedspa.com/glp-1-weight-loss-oswego",
    sitePath: "/glp-1-weight-loss-oswego",
    photoPath: "/images/regen/logo-full.png",
    productCategoryHint: "Weight loss",
  },
  {
    name: "Laser Hair Removal",
    description:
      "Medical laser hair removal for face and body. Series recommended. Consult required. Results vary. Hello Gorgeous, Oswego.",
    productDescription:
      "Laser hair removal for face, underarms, Brazilian, legs, and other body areas — medical device, medical setting. We match your skin and hair, set expectations for a series (not one-and-done), and tell you how to prep so you do not waste a session. Packages when a full course is smarter. You should leave knowing the calendar, the aftercare, and who to text if something feels off. Consult required. Results vary. Book downtown Oswego. hellogorgeousmedspa.com/book",
    sitePath: "/book",
    photoPath: "/images/solaria/solaria-inmode-machine.jpg",
    productCategoryHint: "Laser treatment",
  },
  {
    name: "IV Therapy",
    description:
      "IV hydration and vitamin infusions under medical protocols. Consult required. Results vary. Hello Gorgeous Med Spa, Oswego IL.",
    productDescription:
      "IV therapy at Hello Gorgeous is hydration and vitamin infusions in a medical chair — Myers-style blends, targeted shots, and recovery support when it fits your visit. We start a real IV, watch you, and educate you. This is not a pop-up drip bar. Ask about immunity, glow, and wellness add-ons at consult. Same-day when the schedule allows. Consult required. Results vary. 74 W. Washington St, Oswego. hellogorgeousmedspa.com/book",
    sitePath: "/book",
    photoPath: "/images/marketing/nad-iv-bag-hello-gorgeous.svg",
    productCategoryHint: "Wellness",
  },
];
