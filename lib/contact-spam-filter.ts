/** Contact form spam filtering — honeypot, contact validation, cold-outreach patterns. */

export type ContactSpamVerdict =
  | { spam: false }
  | { spam: true; reason: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

/** Case-insensitive phrases common in B2B spam / bot outreach. */
const SPAM_PHRASES = [
  "reply yes",
  "reply stop",
  "virtual assistant",
  "virtual team",
  "virtual team expert",
  "mavis",
  "my advanced virtual intelligent system",
  "seo services",
  "link building",
  "guest post",
  "web design agency",
  "digital marketing agency",
  "click here to unsubscribe",
  "set up a quick zoom",
  "quick zoom call",
  "we noticed your website",
  "improve your google ranking",
  "crypto investment",
  "forex trading",
  "make money online",
  "work from home opportunity",
  "dear sir or madam",
  "dear business owner",
  "white label",
  "outsource your",
  "replace your team",
  "20-man team",
  "20 man team",
];

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function normalizePhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhoneDigits(value);
  return digits.length === 10;
}

/** Contact field must be a reachable email or US-style phone — not a repeated name. */
export function isValidContactField(contact: string): boolean {
  const trimmed = contact.trim();
  if (!trimmed) return false;
  if (isValidEmail(trimmed)) return true;
  return isValidPhone(trimmed);
}

export function contactMatchesName(contact: string, name: string): boolean {
  return contact.trim().toLowerCase() === name.trim().toLowerCase();
}

function containsSpamPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  for (const phrase of SPAM_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
}

export type ContactSubmissionInput = {
  name: string;
  contact: string;
  message: string;
  /** Honeypot — must be empty for real users. */
  website?: string;
};

/**
 * Returns spam verdict. Silent reject in the API when spam is true.
 * RX inquiries still require a valid email on contact.
 */
export function assessContactSpam(input: ContactSubmissionInput): ContactSpamVerdict {
  if (input.website?.trim()) {
    return { spam: true, reason: "honeypot" };
  }

  const name = input.name.trim();
  const contact = input.contact.trim();
  const message = input.message.trim();

  if (!isValidContactField(contact)) {
    return { spam: true, reason: "invalid_contact" };
  }

  if (contactMatchesName(contact, name)) {
    return { spam: true, reason: "contact_equals_name" };
  }

  const combined = `${name}\n${contact}\n${message}`;
  const phrase = containsSpamPhrase(combined);
  if (phrase) {
    return { spam: true, reason: `phrase:${phrase}` };
  }

  // Cold outreach often uses a person's name as "company" with no @ or digits in contact.
  // (Already covered by invalid_contact + contact_equals_name.)

  return { spam: false };
}
