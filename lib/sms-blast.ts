/**
 * SMS Blast Panel — marketing tool for MMS/SMS campaigns
 * Audience segments, compliance, cost calculator, iPhone preview
 */

export const BLAST = {
  gold: "#D4AF37",
  cream: "#FFFBF2",
  dark: "#0F0F0F",
  border: "#F0E6D3",
  borderDark: "#1C1C1C",
} as const;

export type BlastAudience = {
  id: string;
  label: string;
  count: number;
  description?: string;
};

export const BLAST_AUDIENCES: BlastAudience[] = [
  { id: "all", label: "All Clients", count: 1931, description: "Verified SMS consent" },
  { id: "injectables-due", label: "Injectables Due 90+", count: 342, description: "90+ days since last visit" },
  { id: "weight-loss", label: "Weight Loss Active", count: 187, description: "GLP-1 / Peptide program" },
  { id: "morpheus8-leads", label: "Morpheus8 Leads", count: 89, description: "Consulted not booked" },
  { id: "vip", label: "VIP $2k+", count: 156, description: "Lifetime value $2,000+" },
  { id: "consulted", label: "Consulted not booked", count: 124, description: "Within last 90 days" },
];

export type BlastTemplate = {
  id: string;
  title: string;
  message: string;
  hasMms?: boolean;
};

export const BLAST_TEMPLATES: BlastTemplate[] = [
  {
    id: "last-minute",
    title: "Last-minute cancel",
    message: "Ladies — 2pm Botox opening just popped with {Injector}. $11/unit next 2h only. Reply YES to claim — Danielle",
  },
  {
    id: "flash-botox",
    title: "Flash Botox $11/u",
    message: "Flash Botox $11/unit TODAY 10-4 only. First 8 replies. Text YES — Hello Gorgeous Oswego",
  },
  {
    id: "flash-filler",
    title: "Flash Filler Friday",
    message: "Filler Friday — $100 off syringe, 3 spots left this afternoon. Reply FILLER to claim — Hello Gorgeous",
    hasMms: true,
  },
  {
    id: "morpheus8-flash",
    title: "Morpheus8 Body",
    message: "Burst Body — $200 off abdomen/thighs this Fri only. 2 spots. Reply BODY — Hello Gorgeous",
    hasMms: true,
  },
  {
    id: "refill-nudge",
    title: "Peptide check-in",
    message: "Hi {FirstName}, Ryan here — your peptide check-in window is open. No auto-ship, requires review. Reply REFILL",
  },
  {
    id: "vip-early-access",
    title: "VIP Early Access",
    message: "VIP Early Access: Filler Friday this week, spots before public. Reply YES for first pick — Danielle",
  },
];

export const BLAST_FOOTER = "Reply STOP to end. 74 W Washington Oswego IL";

export const BLAST_PRICING = {
  twilioSms: 0.0075,
  twilioMms: 0.02,
  freshaSms: 0.15,
  freshaMms: 0.15,
} as const;

export function calculateBlastCost(
  contactCount: number,
  isMms: boolean
): { twilioCost: number; freshaCost: number; savings: number } {
  const rate = isMms ? BLAST_PRICING.twilioMms : BLAST_PRICING.twilioSms;
  const twilioCost = contactCount * rate;
  const freshaCost = contactCount * (isMms ? BLAST_PRICING.freshaMms : BLAST_PRICING.freshaSms);
  return {
    twilioCost,
    freshaCost,
    savings: freshaCost - twilioCost,
  };
}

export const BLAST_COMPLIANCE = {
  consentRequired: "Express written consent required — Square checkbox + date saved",
  footerRequired: "Every message must include: "Reply STOP to end. 74 W Washington Oswego IL"",
  stopHonor: "Honor STOP within 24h • Twilio handles automatically",
  consentCheckbox: "I confirm these contacts gave express written consent for SMS marketing at Hello Gorgeous. Includes STOP instructions.",
  legalProtection: "You cannot blast without consent checked. This is your legal protection vs Fresha.",
} as const;

export type BlastHistoryItem = {
  id: string;
  date: string;
  audience: string;
  audienceCount: number;
  message: string;
  hasMms: boolean;
  delivered: number;
  clicked?: number;
  replied?: number;
  cost: number;
  sentBy: string;
};

// Placeholder history - will be fetched from DB
export const BLAST_HISTORY_SAMPLE: BlastHistoryItem[] = [
  {
    id: "1",
    date: "Apr 28, 2025",
    audience: "Injectables Due 90+",
    audienceCount: 342,
    message: "Flash Botox $11/u TODAY ONLY...",
    hasMms: true,
    delivered: 338,
    clicked: 89,
    replied: 12,
    cost: 6.84,
    sentBy: "Danielle",
  },
  {
    id: "2",
    date: "Apr 19, 2025",
    audience: "Weight Loss Active",
    audienceCount: 187,
    message: "Hi {FirstName}! Quick check-in...",
    hasMms: false,
    delivered: 184,
    replied: 23,
    cost: 1.40,
    sentBy: "Danielle",
  },
];

export function formatMergeField(message: string, fields: Record<string, string>): string {
  let result = message;
  for (const [key, value] of Object.entries(fields)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "gi"), value);
  }
  return result;
}

export function detectPhiWarnings(message: string): string[] {
  const warnings: string[] = [];
  const phiTerms = [
    "dose", "dosage", "mg", "units", "prescription", "diagnosis",
    "tirzepatide", "semaglutide", "ozempic", "mounjaro", "wegovy",
    "blood pressure", "a1c", "glucose", "diabetes", "medical history",
  ];
  const lower = message.toLowerCase();
  for (const term of phiTerms) {
    if (lower.includes(term)) {
      warnings.push(`Contains "${term}" — avoid PHI in marketing SMS`);
    }
  }
  return warnings;
}

export function generateTwilioPayload(
  to: string[],
  message: string,
  mediaUrl?: string
): {
  type: "sms" | "mms";
  to: string[];
  body: string;
  mediaUrl?: string;
} {
  return {
    type: mediaUrl ? "mms" : "sms",
    to,
    body: `${message}\n\n${BLAST_FOOTER}`,
    mediaUrl,
  };
}
