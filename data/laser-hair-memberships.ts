/**
 * Laser Hair Removal Membership Tiers
 * Competitive value pricing — up to 30% savings vs typical market rates
 */

export const LASER_HAIR_MEMBERSHIPS_CITIES = [
  { slug: "oswego", name: "Oswego", driveTime: "right here", note: "Located in downtown Oswego" },
  { slug: "naperville", name: "Naperville", driveTime: "15 min", note: "Just 15 minutes south on Route 59" },
  { slug: "aurora", name: "Aurora", driveTime: "10 min", note: "Quick drive east on Route 30" },
  { slug: "plainfield", name: "Plainfield", driveTime: "12 min", note: "15 minutes south on Route 126" },
  { slug: "yorkville", name: "Yorkville", driveTime: "8 min", note: "10 minutes west on Route 34" },
  { slug: "montgomery", name: "Montgomery", driveTime: "10 min", note: "Right next door" },
] as const;

export type LaserHairMembershipsCity = (typeof LASER_HAIR_MEMBERSHIPS_CITIES)[number];

export const LASER_HAIR_MEMBERSHIPS = {
  headline: "Laser Hair Removal Memberships",
  subheadline: "Smooth, hair-free skin for less — up to 30% savings with our membership pricing.",
  guarantee: "Guaranteed permanent results after 24-month membership.",
  touchupPrice: 50,
  touchupNote: "Lifetime touch-ups for just $50 per area after completing your membership.",
  tiers: [
    {
      id: "small",
      name: "Small",
      price: 69,
      compareAtPrice: 99,
      savings: "Save $30/month",
      popular: true,
      description: "Perfect for those focused on smaller areas like full face, underarms or bikini line.",
      includes: [
        "Choice of 2 small areas",
        "24-month treatment plan",
        "Guaranteed permanent results",
        "Lifetime touch-ups for $50/area after membership",
      ],
      areas: [
        "Underarms",
        "Bikini line",
        "Full face (or section of face)",
        "Neck",
        "Navel area",
        "Hairline shaping",
        "Ears",
      ],
      image: "/images/laser-memberships/laser-hair-small.png",
    },
    {
      id: "medium",
      name: "Medium",
      price: 174,
      compareAtPrice: 249,
      savings: "Save $75/month",
      popular: false,
      description: "Ideal for those wanting to address both facial and body hair concerns.",
      includes: [
        "1 medium area + 1 small area",
        "24-month treatment plan",
        "Guaranteed permanent results",
        "Lifetime touch-ups for $50/area after membership",
      ],
      areas: [
        "Full Brazilian & bikini line",
        "Forearms",
        "Lower legs",
        "Upper legs",
        "Abdomen",
        "Chest",
        "Shoulders & upper back",
        "Lower back",
        "Glutes/buttocks",
      ],
      image: "/images/laser-memberships/laser-hair-medium.png",
    },
    {
      id: "large",
      name: "Large",
      price: 244,
      compareAtPrice: 349,
      savings: "Save $105/month",
      popular: false,
      description: "For those seeking more extensive hair removal, head-to-toe smoothness.",
      includes: [
        "2 large areas + 2 small areas",
        "24-month treatment plan",
        "Guaranteed permanent results",
        "Lifetime touch-ups for $50/area after membership",
      ],
      areas: [
        "Full legs",
        "Full arms",
        "Full Brazilian, bikini line & buttocks",
        "Full back & shoulders",
        "Full back, shoulders & neck",
        "Chest & abdomen",
      ],
      image: "/images/laser-memberships/laser-hair-large.png",
    },
    {
      id: "full-body",
      name: "Full Body",
      price: 314,
      compareAtPrice: 449,
      savings: "Save $135/month",
      popular: false,
      description: "Our most comprehensive solution — unlimited areas every two months.",
      includes: [
        "Unlimited areas every 2 months",
        "24-month treatment plan",
        "Guaranteed permanent results",
        "Lifetime touch-ups for $50/area after membership",
        "Complete flexibility to address all hair concerns",
      ],
      areas: [
        "Underarms",
        "Brazilian & bikini line",
        "Face, neck & ears",
        "Back & shoulders",
        "Lower back",
        "Glutes",
        "Chest",
        "Abdomen",
        "Hairline shaping",
        "Full legs",
        "Full arms",
      ],
      image: "/images/laser-memberships/laser-hair-full-body.png",
    },
  ],
  benefits: [
    "Predictable monthly investment — no upfront costs",
    "Guaranteed permanent results after 24-month membership",
    "Unlimited lifetime touch-ups for just $50 per area",
    "Customized treatment schedule based on your hair growth cycle",
    "Exclusive member benefits",
    "No more razor burn, ingrown hairs, or last-minute shaving",
  ],
  faqs: [
    {
      q: "How many treatments will I need?",
      a: "Most clients see significant results within 8-10 treatments. Our 24-month membership ensures complete coverage of all hair growth cycles for permanent results with the suggested 12 treatments per area.",
    },
    {
      q: "How often will I need to come in?",
      a: "Treatment frequency depends on the body area and your individual hair growth cycle. Typically, treatments are scheduled every 4-8 weeks.",
    },
    {
      q: "Is the treatment painful?",
      a: "Most clients describe the sensation as a quick snap or warm pinch. Our advanced cooling technology minimizes discomfort, and treatments become progressively more comfortable as hair thins.",
    },
    {
      q: "What does \"guaranteed results\" mean?",
      a: "After completing your 24-month membership, we guarantee permanent hair reduction of at least 85-95% in the treated areas. Any maintenance beyond this period requires just a $50 touchup fee per area.",
    },
    {
      q: "Is there a down payment or initiation fee?",
      a: "No. Your monthly membership fee covers everything with no hidden costs or startup fees.",
    },
  ],
} as const;
