/**
 * REGEN RX partner / affiliate program.
 * Source of truth for rates, legal version, and cookie rules.
 * Commissions are a marketing referral fee — never tied to a prescription.
 */

export const AFFILIATE_COOKIE = "regen_aff" as const;
export const AFFILIATE_COOKIE_DAYS = 30;
export const AFFILIATE_HOLDING_DAYS = 14;
export const AFFILIATE_PAYOUT_MINIMUM_USD = 100;
/** @deprecated Use affiliateTierForActivePatients — old flat 15% / 3-month offer. */
export const AFFILIATE_RECURRING_PERCENT = 15;
/** @deprecated Commission now follows the patient for as long as they stay active. */
export const AFFILIATE_RECURRING_MONTHS = 0;
/** @deprecated Design: no flat bonus before collected medication revenue. */
export const AFFILIATE_INTAKE_BONUS_USD = 0;
export const AFFILIATE_ACTIVE_WINDOW_DAYS = 45;
export const AFFILIATE_AGREEMENT_VERSION = "v2-2026-09-06" as const;

export const AFFILIATE_TIERS = [
  { id: "starter", label: "Starter", minActive: 1, maxActive: 4, percent: 10 },
  { id: "growth", label: "Growth", minActive: 5, maxActive: 9, percent: 15 },
  { id: "pro", label: "Pro", minActive: 10, maxActive: 19, percent: 20 },
  { id: "elite", label: "Elite", minActive: 20, maxActive: null, percent: 25 },
] as const;

export type AffiliateTier = (typeof AFFILIATE_TIERS)[number];

export function affiliateTierForActivePatients(activePatients: number): AffiliateTier {
  if (activePatients >= 20) return AFFILIATE_TIERS[3];
  if (activePatients >= 10) return AFFILIATE_TIERS[2];
  if (activePatients >= 5) return AFFILIATE_TIERS[1];
  return AFFILIATE_TIERS[0];
}

export function affiliateTierRangeLabel(tier: AffiliateTier): string {
  if (tier.maxActive == null) return `${tier.minActive}+ active patients`;
  return `${tier.minActive}–${tier.maxActive} active patients`;
}

export const AFFILIATE_START_HREF = "/start" as const;
export const AFFILIATE_PUBLIC_PATH = "/affiliates" as const;

export type AffiliatePartnerType = "med_spa" | "day_spa" | "creator";
export type AffiliateStatus = "applied" | "pending" | "active" | "paused" | "terminated";

export const AFFILIATE_TYPES: { id: AffiliatePartnerType; label: string; blurb: string }[] = [
  {
    id: "med_spa",
    label: "Med spas & aesthetic clinics",
    blurb:
      "Send clients who need prescription weight loss, hormone therapy, or peptides — services outside your scope — to a licensed NP team, and earn on every patient who starts care.",
  },
  {
    id: "day_spa",
    label: "Day spas & wellness studios",
    blurb:
      "Give your clients a trusted next step for medical-grade care with your own referral code — no clinical liability, no inventory, just a warm handoff.",
  },
  {
    id: "creator",
    label: "Content creators & influencers",
    blurb:
      "Share your story with a trackable link and discount code. Recurring commission on every month your referral stays active in a protocol.",
  },
];

export const AFFILIATE_AGREEMENT_SECTIONS = [
  {
    title: "1. Licensed Medical Care Only",
    body: "I acknowledge that REGEN RX treatments — peptide, hormone, aesthetic, and vitamin therapies — are prescribed only after a licensed Illinois provider completes a clinical evaluation. I will never suggest that someone can obtain or use a REGEN RX medication without completing that evaluation.",
  },
  {
    title: "2. No Medical or Outcome Claims",
    body: "I will not claim that any treatment cures, treats, prevents, or diagnoses any disease or condition, and I will not promise a specific result, dose, or timeline. When asked medical questions, I will direct them to start a free consult with a REGEN RX provider.",
  },
  {
    title: "3. Audience & Geography",
    body: "I will only market to adults 21 years of age or older. REGEN RX currently treats Illinois residents only, and I will make that clear rather than implying availability in any other state.",
  },
  {
    title: "4. Honest Marketing",
    body: "I will not impersonate REGEN RX, claim employment, or imply an exclusive partnership beyond what my agreement states. I will not run paid advertising bidding on the REGEN RX name, trademarks, or product terms, and I will not create lookalike websites or copycat social handles.",
  },
  {
    title: "5. No Coupon Aggregators or Spam",
    body: "I will not list my referral code on coupon-aggregator sites. I will not send commercial email or SMS without prior consent in compliance with CAN-SPAM and TCPA, and I will not purchase or use scraped contact lists.",
  },
  {
    title: "6. Commission, Payouts, and Taxes",
    body: "My commission is a marketing/referral fee only, and is never tied to a specific prescription or clinical decision. My rate is based on how many referred patients are actively in treatment at once, and applies to medication REGEN RX actually collects — shipping is not commissioned. No flat bonus is paid before that revenue exists. Commissions go through a short holding period before becoming payable, and payouts are issued on the 15th of each month with a $100 minimum — balances under $100 roll forward. I am responsible for keeping a payout method on file. Earning over $600 in a calendar year means I will receive a Form 1099-NEC and I am responsible for reporting that income.",
  },
  {
    title: "7. Suspension and Termination",
    body: "I will keep my dashboard credentials private. Violations of this Code — including medical claims, marketing to minors, paid brand ads, coupon-site listings, or misuse of referral data — may result in immediate suspension without prior notice. Severe violations may result in forfeiture of unpaid commission and permanent termination.",
  },
  {
    title: "8. Patient Privacy",
    body: "I will never request, collect, store, or share a referral's health information, diagnosis, or treatment details. Every referral completes their own confidential visit directly with REGEN RX. I will only ever see click, signup, and commission data in my dashboard.",
  },
  {
    title: "9. Program Exclusivity",
    body: "While I am an active partner earning commissions from REGEN RX, I will not simultaneously hold an affiliate or ambassador position with a directly competing telehealth peptide, hormone, or GLP-1 provider. This exclusivity applies only while I remain active in the program.",
  },
  {
    title: "10. Posting and Disclosure Compliance",
    body: "Every post I publish about REGEN RX will follow this Code and clearly disclose my financial relationship (for example, #ad or #partner), as required by FTC endorsement rules. I am solely responsible for content I create and publish.",
  },
  {
    title: "11. Confidentiality",
    body: "Non-public information I receive through the program — commission structures, unreleased treatments, wholesale or partner pricing — is confidential. This obligation continues after I leave the program.",
  },
  {
    title: "12. Acknowledgment",
    body: "By typing my full legal name and clicking Sign and Continue, I confirm that I have read, understood, and agree to abide by this Code of Conduct.",
  },
] as const;

export function affiliateReferralUrl(code: string): string {
  return `https://tryregenrx.com/start?ref=${encodeURIComponent(code)}`;
}

export function qualifiesForIntakeBonus(_type: AffiliatePartnerType): boolean {
  return false;
}

export function suggestAffiliateCode(businessOrName: string): string {
  const base = businessOrName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "PARTNER";
  const suffix = String(Math.floor(100 + Math.random() * 900));
  return `${base}${suffix}`;
}

export async function hashAffiliateEmail(email: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function readAffiliateCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${AFFILIATE_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function affiliateCookieHeader(code: string): string {
  const maxAge = AFFILIATE_COOKIE_DAYS * 24 * 60 * 60;
  return `${AFFILIATE_COOKIE}=${encodeURIComponent(code.toUpperCase())}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
