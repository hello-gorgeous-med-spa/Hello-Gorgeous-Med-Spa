export type SprintPriority = "high" | "medium";

export type SprintTask = {
  id: string;
  title: string;
  priority: SprintPriority;
  owner: "provider" | "marketing" | "front-desk" | "seo";
  route: string;
  why: string;
  checklist: string[];
};

export type SprintCampaign = {
  id: string;
  channel: "sms" | "email" | "google-business" | "partnership";
  audience: string;
  objective: string;
  offer: string;
  cta: string;
};

export const LOCAL_DOMINANCE_TASKS: SprintTask[] = [
  {
    id: "beat-her-reviews",
    title: "Beat HER Aesthetics on Google (Oswego)",
    priority: "high",
    owner: "front-desk",
    route: "/review",
    why: "HER is your #1 Oswego rival — review count and star rating drive map-pack rank for Botox and med spa searches.",
    checklist: [
      "Ask 5 happy clients this week (GLP-1 wins, natural Botox, peptide recovery)",
      "QR at checkout → hellogorgeousmedspa.com/review",
      "Reply to every Google review within 24h (HIPAA-safe — no medical details)",
      "Check Oswego hub for reviews needed to pass HER",
    ],
  },
  {
    id: "oswego-social-blast",
    title: "Run Mon / Wed / Fri social blast",
    priority: "high",
    owner: "marketing",
    route: "/admin/marketing/post-social",
    why: "Consistent local posts compound — presets are loaded for memberships, GLP-1, and peptides.",
    checklist: [
      "Monday: Blast — Memberships (Google + Facebook)",
      "Wednesday: Blast — GLP-1 published pricing",
      "Friday: Blast — Peptides + app (Facebook) + wellness hub (Google)",
    ],
  },
  {
    id: "warm-rx-leads",
    title: "Close warm RX leads (GLP-1 + peptides)",
    priority: "high",
    owner: "front-desk",
    route: "/admin/rx-dispatch",
    why: "$30k RX goal needs ~3 paid starts/week — speed beats competitors.",
    checklist: [
      "Open Oswego hub warm leads list — text/call every open intake",
      "Ryan approves → RX Invoice payment link same day",
      "Approved + paid → RX Dispatch to pharmacy same day",
      "Schedule included monthly check-in before patient leaves",
    ],
  },
  {
    id: "gbp-audit-oswego",
    title: "Complete GBP setup checklist",
    priority: "high",
    owner: "marketing",
    route: "https://business.google.com",
    why: "Competitors win “near me” when GBP services, photos, and posts are fuller than yours.",
    checklist: [
      "Add semaglutide, tirzepatide, peptide therapy as individual GBP services",
      "Fix appointment-required + medical spa description",
      "Upload 5 new photos",
      "Mark checklist items done in Oswego command center",
    ],
  },
  {
    id: "money-pages",
    title: "Upgrade 2 money pages this week",
    priority: "high",
    owner: "seo",
    route: "/services",
    why: "These pages capture high-intent search traffic and should be refreshed weekly.",
    checklist: [
      "Add one buyer-intent FAQ (candidacy, downtime, timeline, or pricing context)",
      "Add one local-intent line for Oswego + surrounding city",
      "Add one natural internal link to a concern or comparison page",
    ],
  },
  {
    id: "gbp-cadence",
    title: "Publish 3 Google Business posts",
    priority: "high",
    owner: "marketing",
    route: "/admin/marketing/google-posts",
    why: "Google Business profile activity is one of the fastest local visibility multipliers.",
    checklist: [
      "Post one provider education tip",
      "Post one treatment FAQ myth-vs-fact",
      "Post one social proof or transformation education post with booking CTA",
    ],
  },
  {
    id: "reactivation-sms",
    title: "Run reactivation SMS campaign",
    priority: "high",
    owner: "front-desk",
    route: "/admin/sms",
    why: "Existing clients convert faster and cheaper than cold leads.",
    checklist: [
      "Send due-back injectables reminder segment",
      "Send skin-tightening consultation invitation segment",
      "Track responses and route warm replies to booking",
    ],
  },
  {
    id: "review-engine",
    title: "Boost review request workflow",
    priority: "medium",
    owner: "front-desk",
    route: "/api/cron/review-requests",
    why: "Review volume and recency reinforce authority for both search and AI systems.",
    checklist: [
      "Confirm review request automation is active",
      "Ask top 5 happy clients this week for Google feedback",
      "Reply to newest Google reviews with service-specific language",
    ],
  },
  {
    id: "referral-partners",
    title: "Activate one referral partnership",
    priority: "medium",
    owner: "marketing",
    route: "/admin/marketing",
    why: "Local trust transfer can bring high-quality leads without paid ad spend.",
    checklist: [
      "Choose one partner type (gym, salon, bridal, wellness office)",
      "Create one co-branded offer or event idea",
      "Track referral source on incoming consultations",
    ],
  },
];

export const LOCAL_DOMINANCE_CAMPAIGNS: SprintCampaign[] = [
  {
    id: "acne-scar-series",
    channel: "email",
    audience: "Acne scar concern leads",
    objective: "Educate and convert consult bookings",
    offer: "Clinical comparison of Morpheus8 vs Solaria CO2 based on recovery profile",
    cta: "Book acne-scar consultation",
  },
  {
    id: "tightening-dueback",
    channel: "sms",
    audience: "Past skin tightening clients",
    objective: "Reactivation",
    offer: "Progress check + refinement consult availability this month",
    cta: "Reply YES for callback or book link",
  },
  {
    id: "gbp-provider-tip",
    channel: "google-business",
    audience: "Local map/search users",
    objective: "Local authority visibility",
    offer: "Provider tip post on who is best fit for Quantum RF vs Morpheus8",
    cta: "Book consultation",
  },
];
